import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { Command, Option } from 'clipanion';

import { writeJson, writeLine } from '../lib/output.js';
import { findRepoRoot } from '../lib/repo-root.js';

export class EvalRunCommand extends Command {
  static override paths = [['eval', 'run']];

  static override usage = Command.Usage({
    category: 'Eval',
    description: 'Run the Python eval harness against modules in the repo.',
    details: `Delegates to \`uv run lokomotif-eval run\` inside \`packages/eval\`. The harness walks \`modules/**\` for eval suites and runs every check.

Forward extra arguments to the harness after \`--\`:

\`\`\`bash
lokomotif eval run -- --module roles/finance/aml-analyst
lokomotif eval run -- --reporter json
\`\`\`
`,
    examples: [
      ['Run every eval suite', 'lokomotif eval run'],
      ['Filter to one module', 'lokomotif eval run -- --module roles/finance/aml-analyst'],
      ['JSON output for CI', 'lokomotif eval run -- --reporter json'],
    ],
  });

  json = Option.Boolean('--json', false, {
    description: 'Emit a JSON status envelope instead of streaming harness output. Useful for CI metadata wrappers.',
  });

  rootOverride = Option.String('--root', {
    description: 'Repository root. Defaults to the current working directory.',
  });

  harnessArgs = Option.Proxy({ name: 'harness args' });

  async execute(): Promise<number> {
    const repoRoot = findRepoRoot(this.rootOverride ?? process.cwd());
    const evalDir = join(repoRoot, 'packages', 'eval');

    if (!existsSync(evalDir)) {
      this.context.stderr.write(`error: packages/eval not found under ${repoRoot}\n`);
      return 1;
    }

    const harnessArgs = this.harnessArgs.length > 0 ? this.harnessArgs : ['run'];
    const args = ['run', 'lokomotif-eval', ...harnessArgs];

    if (!this.json) {
      writeLine(this.context.stdout, `> uv ${args.join(' ')}    (cwd: ${evalDir})`);
    }

    const exitCode = await runChild('uv', args, evalDir);

    if (this.json) {
      writeJson(this.context.stdout, {
        ok: exitCode === 0,
        exit_code: exitCode,
        cwd: evalDir,
        command: ['uv', ...args],
      });
    }

    return exitCode;
  }
}

function runChild(command: string, args: readonly string[], cwd: string): Promise<number> {
  return new Promise((resolveExit) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit' });
    child.on('error', (err) => {
      // most likely: uv is not installed
      process.stderr.write(`error: failed to spawn '${command}': ${err.message}\n`);
      resolveExit(1);
    });
    child.on('exit', (code) => {
      resolveExit(code ?? 1);
    });
  });
}
