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
    description: 'Run the Python eval harness in packages/eval.',
    details: `Delegates to \`uv run pytest\` inside \`packages/eval\`. Until the full harness ships in Phase 5 of the implementation plan, this runs the package's smoke tests.

Pass extra arguments to pytest after \`--\`:

\`\`\`bash
lokomotif eval run -- -k "roles" --cov
\`\`\`
`,
    examples: [
      ['Run all eval tests', 'lokomotif eval run'],
      ['Run a filtered subset', 'lokomotif eval run -- -k "finance"'],
    ],
  });

  json = Option.Boolean('--json', false, {
    description: 'Emit JSON status instead of streaming pytest output. Useful for CI metadata wrappers.',
  });

  rootOverride = Option.String('--root', {
    description: 'Repository root. Defaults to the current working directory.',
  });

  pytestArgs = Option.Proxy({ name: 'pytest args' });

  async execute(): Promise<number> {
    const repoRoot = findRepoRoot(this.rootOverride ?? process.cwd());
    const evalDir = join(repoRoot, 'packages', 'eval');

    if (!existsSync(evalDir)) {
      this.context.stderr.write(`error: packages/eval not found under ${repoRoot}\n`);
      return 1;
    }

    const args = ['run', 'pytest', ...this.pytestArgs];

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
