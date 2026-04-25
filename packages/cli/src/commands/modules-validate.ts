import { resolve } from 'node:path';

import { Command, Option } from 'clipanion';
import fg from 'fast-glob';

import { loadModuleFile } from '../lib/module-loader.js';
import {
  writeJson,
  writeLine,
  writeValidationErrors,
  writeValidationOk,
} from '../lib/output.js';

type FileResult =
  | { readonly path: string; readonly ok: true }
  | { readonly path: string; readonly ok: false; readonly errors: ReturnType<typeof loadModuleFile> extends { errors: infer E } ? E : never };

export class ModulesValidateCommand extends Command {
  static override paths = [['modules', 'validate']];

  static override usage = Command.Usage({
    category: 'Modules',
    description: 'Validate one or more RTCSG modules against the schema.',
    details: `Accepts file paths or glob patterns. Each matching YAML file is parsed and validated. Exits with code 1 if any file fails validation.

In \`--json\` mode, the full result set is emitted as a single JSON document; the exit code still reflects success or failure.`,
    examples: [
      ['Validate a single module', 'lokomotif modules validate modules/roles/finance/aml-analyst.yaml'],
      ['Validate a glob', 'lokomotif modules validate "modules/**/*.yaml"'],
      ['JSON output for CI', 'lokomotif modules validate --json modules/**/*.yaml'],
    ],
  });

  json = Option.Boolean('--json', false, { description: 'Emit JSON instead of human output.' });

  patterns = Option.Rest({ name: 'paths', required: 1 });

  async execute(): Promise<number> {
    const matched = await fg(this.patterns, {
      cwd: process.cwd(),
      absolute: true,
      onlyFiles: true,
    });

    if (matched.length === 0) {
      if (this.json) {
        writeJson(this.context.stdout, { results: [], note: 'no files matched' });
      } else {
        writeLine(this.context.stderr, 'No files matched the given paths.');
      }
      return 1;
    }

    const results: FileResult[] = [];
    let failed = 0;

    for (const file of matched) {
      const result = loadModuleFile(file);
      if (result.ok) {
        results.push({ path: file, ok: true });
        if (!this.json) {
          writeValidationOk(this.context.stdout, file);
        }
      } else {
        failed += 1;
        results.push({ path: file, ok: false, errors: result.errors });
        if (!this.json) {
          writeValidationErrors(this.context.stdout, file, result.errors);
        }
      }
    }

    if (this.json) {
      writeJson(this.context.stdout, {
        results: results.map((r) =>
          r.ok ? { path: r.path, ok: true } : { path: r.path, ok: false, errors: r.errors },
        ),
        summary: {
          total: matched.length,
          passed: matched.length - failed,
          failed,
        },
      });
    } else {
      writeLine(this.context.stdout, '');
      if (failed === 0) {
        writeLine(this.context.stdout, `${matched.length} module(s) validated.`);
      } else {
        writeLine(
          this.context.stdout,
          `${failed} of ${matched.length} module(s) failed validation.`,
        );
      }
    }

    return failed === 0 ? 0 : 1;
  }
}

// Reference resolve to avoid an unused-import lint warning when this
// module is consumed without explicit path normalization.
void resolve;
