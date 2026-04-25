import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { Command, Option } from 'clipanion';

import { writeJson, writeLine } from '../lib/output.js';
import { findRepoRoot } from '../lib/repo-root.js';

const KNOWN_TARGETS = ['anthropic-sdk', 'dify', 'n8n', 'langgraph'] as const;
type KnownTarget = (typeof KNOWN_TARGETS)[number];

function isKnownTarget(value: string): value is KnownTarget {
  return (KNOWN_TARGETS as readonly string[]).includes(value);
}

export class DeployCommand extends Command {
  static override paths = [['deploy']];

  static override usage = Command.Usage({
    category: 'Flow',
    description: 'Adapt a flow to a runtime blueprint.',
    details: `Each blueprint translates a composed flow into the runtime-specific format the target expects (Anthropic Agent SDK, Dify, n8n, LangGraph). Adapter logic ships per-runtime in Phase 7 of the implementation plan; until then this command surfaces the planned target list and exits.

Run \`lokomotif deploy\` without a target to see what is available.`,
    examples: [
      ['List supported targets', 'lokomotif deploy'],
      ['Deploy a flow (Phase 7+)', 'lokomotif deploy anthropic-sdk flow.yaml'],
    ],
  });

  json = Option.Boolean('--json', false, { description: 'Emit JSON instead of human output.' });

  rootOverride = Option.String('--root', {
    description: 'Repository root. Defaults to the current working directory.',
  });

  target = Option.String({ required: false, name: 'target' });

  flowPath = Option.String({ required: false, name: 'flow.yaml' });

  async execute(): Promise<number> {
    const repoRoot = findRepoRoot(this.rootOverride ?? process.cwd());
    const blueprintsDir = join(repoRoot, 'blueprints');

    if (this.target === undefined) {
      const status = KNOWN_TARGETS.map((name) => ({
        name,
        shipped: existsSync(join(blueprintsDir, name)),
      }));
      if (this.json) {
        writeJson(this.context.stdout, { targets: status });
      } else {
        writeLine(this.context.stdout, 'Known runtime targets:');
        for (const { name, shipped } of status) {
          const tag = shipped ? '[shipped]' : '[planned]';
          writeLine(this.context.stdout, `  ${tag.padEnd(10, ' ')} ${name}`);
        }
        writeLine(this.context.stdout, '');
        writeLine(
          this.context.stdout,
          'Adapter logic for unshipped targets lands in Phase 7 of the implementation plan.',
        );
      }
      return 0;
    }

    if (!isKnownTarget(this.target)) {
      this.context.stderr.write(
        `error: unknown target '${this.target}'. Known: ${KNOWN_TARGETS.join(', ')}\n`,
      );
      return 1;
    }

    const targetDir = join(blueprintsDir, this.target);
    const shipped = existsSync(targetDir);

    if (this.flowPath === undefined) {
      this.context.stderr.write(
        `error: deploy <target> <flow.yaml> — flow argument is required.\n`,
      );
      return 1;
    }

    if (!shipped) {
      const message = `Blueprint '${this.target}' has not shipped yet. Track progress under blueprints/${this.target}/.`;
      if (this.json) {
        writeJson(this.context.stdout, {
          ok: false,
          target: this.target,
          shipped: false,
          message,
        });
      } else {
        writeLine(this.context.stdout, message);
      }
      return 1;
    }

    // Once Phase 7 ships, the actual adapter is loaded and invoked here.
    const message = `Blueprint '${this.target}' is shipped, but the CLI dispatcher lands with the first blueprint (Phase 7).`;
    if (this.json) {
      writeJson(this.context.stdout, {
        ok: false,
        target: this.target,
        shipped: true,
        message,
      });
    } else {
      writeLine(this.context.stdout, message);
    }
    return 1;
  }
}
