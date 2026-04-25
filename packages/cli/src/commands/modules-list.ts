import { Command, Option } from 'clipanion';

import { isIndustry, isKind, type Industry, type Kind } from '@lokomotif/schema';

import { listModuleFiles, loadModuleFile } from '../lib/module-loader.js';
import { writeJson, writeLine, writeModuleList, type ListedModule } from '../lib/output.js';
import { findModulesDir } from '../lib/repo-root.js';

export class ModulesListCommand extends Command {
  static override paths = [['modules', 'list']];

  static override usage = Command.Usage({
    category: 'Modules',
    description: 'List RTCSG modules in the current repository.',
    details: `Walks \`modules/**/*.yaml\` from the repository root and prints each module's id, kind, version, and languages.

If invoked outside a Lokomotif Kit repository (no \`modules/\` directory), an informational message is printed and the command exits cleanly.`,
    examples: [
      ['List all modules', 'lokomotif modules list'],
      ['Filter by kind', 'lokomotif modules list --kind role'],
      ['Filter by industry', 'lokomotif modules list --industry finance'],
      ['JSON output', 'lokomotif modules list --json'],
    ],
  });

  json = Option.Boolean('--json', false, {
    description: 'Emit JSON instead of a human-readable table.',
  });

  kindFilter = Option.String('--kind', { description: 'Filter by RTCSG kind.' });

  industryFilter = Option.String('--industry', { description: 'Filter by industry.' });

  rootOverride = Option.String('--root', {
    description: 'Repository root. Defaults to the current working directory.',
  });

  async execute(): Promise<number> {
    const cwd = this.rootOverride ?? process.cwd();
    const modulesDir = findModulesDir(cwd);

    if (modulesDir === null) {
      if (this.json) {
        writeJson(this.context.stdout, { modules: [], note: 'no modules directory' });
      } else {
        writeLine(
          this.context.stdout,
          'No modules/ directory found. Run from inside a Lokomotif Kit repo, or pass --root.',
        );
      }
      return 0;
    }

    const files = await listModuleFiles(modulesDir);
    const collected: ListedModule[] = [];
    let failed = 0;

    for (const file of files) {
      const result = loadModuleFile(file);
      if (!result.ok) {
        failed += 1;
        if (!this.json) {
          writeLine(this.context.stderr, `! skipped (invalid): ${file}`);
        }
        continue;
      }
      collected.push({ path: file, module: result.module });
    }

    const filtered = collected.filter(({ module }) => {
      if (this.kindFilter !== undefined) {
        if (!isKind(this.kindFilter)) return false;
        if (module.kind !== (this.kindFilter as Kind)) return false;
      }
      if (this.industryFilter !== undefined) {
        if (!isIndustry(this.industryFilter)) return false;
        const ind = this.industryFilter as Industry;
        if (!(module.industry?.includes(ind) ?? false)) return false;
      }
      return true;
    });

    if (this.json) {
      writeJson(this.context.stdout, {
        modules: filtered.map(({ path, module }) => ({ path, module })),
        skipped_invalid: failed,
      });
    } else {
      writeModuleList(this.context.stdout, filtered);
      if (failed > 0) {
        writeLine(this.context.stderr, `\n${failed} file(s) skipped due to validation errors.`);
      }
    }
    return 0;
  }
}
