import { resolve } from 'node:path';

import { Command, Option } from 'clipanion';

import { isLanguage, type Language } from '@lokomotif/schema';
import {
  composeFlowFile,
  FlowError,
  LoadModuleError,
} from '@lokomotif/sdk';

import { writeJson, writeLine } from '../lib/output.js';
import { findModulesDir } from '../lib/repo-root.js';

export class ComposeCommand extends Command {
  static override paths = [['compose']];

  static override usage = Command.Usage({
    category: 'Flow',
    description: 'Compose a flow into a single prompt string.',
    details: `Reads a flow definition (YAML), loads each referenced module by ID, sorts them in canonical RTCSG order (Role → Task → Context → Style → Guardrail), and emits a sectioned prompt. Backed by \`@lokomotif/sdk\` — same composition logic as blueprints and other consumers.

The flow YAML schema in v0:

\`\`\`yaml
name: example-flow
description: "Optional description."
modules:
  - roles/finance/aml-analyst
  - tasks/finance/case-review
  - guardrails/cross-industry/pii-tr
\`\`\`
`,
    examples: [
      ['Compose a flow', 'lokomotif compose flow.yaml'],
      ['Render in Turkish', 'lokomotif compose flow.yaml --language tr'],
      ['JSON output (with composition hash)', 'lokomotif compose flow.yaml --json'],
    ],
  });

  json = Option.Boolean('--json', false, { description: 'Emit JSON instead of plain prompt.' });

  rootOverride = Option.String('--root', {
    description: 'Repository root. Defaults to the current working directory.',
  });

  language = Option.String('--language', {
    description: 'Render language for LocalizedString fields.',
  });

  fallbackLanguage = Option.String('--fallback-language', {
    description: 'Fallback language when the primary is missing for a field. Defaults to en.',
  });

  flowPath = Option.String({ required: true, name: 'flow.yaml' });

  async execute(): Promise<number> {
    const cwd = this.rootOverride ?? process.cwd();
    const modulesDir = findModulesDir(cwd);
    if (modulesDir === null) {
      this.context.stderr.write('error: no modules/ directory found.\n');
      return 1;
    }

    const flowAbs = resolve(process.cwd(), this.flowPath);
    const language = pickLang(this.language);
    const fallbackLanguage = pickLang(this.fallbackLanguage);

    try {
      const composed = composeFlowFile(flowAbs, {
        modulesDir,
        ...(language !== undefined ? { language } : {}),
        ...(fallbackLanguage !== undefined ? { fallbackLanguage } : {}),
      });

      if (this.json) {
        writeJson(this.context.stdout, {
          flow: composed.flow,
          composition_hash: composed.compositionHash,
          modules: composed.modules.map((m) => ({
            id: m.id,
            kind: m.kind,
            version: m.version,
          })),
          prompt: composed.text,
        });
      } else {
        writeLine(this.context.stdout, composed.text);
      }
      return 0;
    } catch (err: unknown) {
      if (err instanceof LoadModuleError) {
        this.context.stderr.write(
          `error: cannot resolve module '${err.moduleId}' (${err.reason}).\n`,
        );
        return 1;
      }
      if (err instanceof FlowError) {
        this.context.stderr.write(`error: ${err.message}\n`);
        return 1;
      }
      this.context.stderr.write(
        `error: ${err instanceof Error ? err.message : String(err)}\n`,
      );
      return 1;
    }
  }
}

function pickLang(input: string | undefined): Language | undefined {
  if (input === undefined) return undefined;
  if (!isLanguage(input)) return undefined;
  return input;
}
