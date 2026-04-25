import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { Command, Option } from 'clipanion';

import { isKind, type Kind } from '@lokomotif/schema';

import { renderTemplate } from '../templates/index.js';
import { writeJson, writeLine } from '../lib/output.js';
import { findModulesDir, findRepoRoot } from '../lib/repo-root.js';

const NAME_PATTERN = /^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/;
const SEGMENT_PATTERN = /^[a-z][a-z0-9-]*$/;

export class ModulesNewCommand extends Command {
  static override paths = [['modules', 'new']];

  static override usage = Command.Usage({
    category: 'Modules',
    description: 'Scaffold a new RTCSG module skeleton.',
    details: `Writes a frontmatter-complete YAML skeleton plus an eval test placeholder under \`modules/<kind-plural>/<industry>/<name>.yaml\`. The skeleton ships with TODO markers — Lokomotif modules must reflect real practice; the scaffold gives you the shape, not the content.

Refuses to overwrite existing files unless \`--force\` is passed.`,
    examples: [
      ['New finance AML role', 'lokomotif modules new role finance/aml-analyst'],
      ['New cross-industry guardrail', 'lokomotif modules new guardrail cross-industry/pii-tr'],
      ['Overwrite existing', 'lokomotif modules new role finance/aml-analyst --force'],
    ],
  });

  json = Option.Boolean('--json', false, { description: 'Emit JSON instead of human output.' });

  force = Option.Boolean('--force', false, {
    description: 'Overwrite existing module and test files.',
  });

  rootOverride = Option.String('--root', {
    description: 'Repository root. Defaults to the current working directory.',
  });

  kindArg = Option.String({ required: true, name: 'kind' });

  nameArg = Option.String({ required: true, name: 'industry/name' });

  async execute(): Promise<number> {
    if (!isKind(this.kindArg)) {
      this.fail(
        `Unknown kind '${this.kindArg}'. Expected one of: role, task, context, style, guardrail.`,
      );
      return 1;
    }
    const kind: Kind = this.kindArg;

    if (!NAME_PATTERN.test(this.nameArg)) {
      this.fail(`Argument must be in 'industry/name' form, kebab-case. Got '${this.nameArg}'.`);
      return 1;
    }

    const [industryRaw, nameRaw] = this.nameArg.split('/', 2);
    if (industryRaw === undefined || nameRaw === undefined) {
      this.fail(`Could not split '${this.nameArg}' into industry/name.`);
      return 1;
    }
    if (!SEGMENT_PATTERN.test(industryRaw) || !SEGMENT_PATTERN.test(nameRaw)) {
      this.fail(`'industry' and 'name' must be kebab-case starting with a lowercase letter.`);
      return 1;
    }

    const cwd = this.rootOverride ?? process.cwd();
    const modulesDir = findModulesDir(cwd) ?? join(findRepoRoot(cwd), 'modules');

    const repoRoot = dirname(modulesDir);
    const rendered = renderTemplate({ kind, industry: industryRaw, name: nameRaw });

    const moduleAbs = join(repoRoot, rendered.modulePath);
    const testAbs = join(repoRoot, rendered.testPath);

    if (!this.force && (existsSync(moduleAbs) || existsSync(testAbs))) {
      this.fail(
        `Refusing to overwrite existing files. Pass --force to replace.\n  ${rendered.modulePath}\n  ${rendered.testPath}`,
      );
      return 1;
    }

    mkdirSync(dirname(moduleAbs), { recursive: true });
    mkdirSync(dirname(testAbs), { recursive: true });
    writeFileSync(moduleAbs, rendered.moduleContent, 'utf-8');
    writeFileSync(testAbs, rendered.testContent, 'utf-8');

    if (this.json) {
      writeJson(this.context.stdout, {
        id: rendered.id,
        files: [rendered.modulePath, rendered.testPath],
      });
    } else {
      writeLine(this.context.stdout, `Scaffolded ${rendered.id}`);
      writeLine(this.context.stdout, `  module: ${rendered.modulePath}`);
      writeLine(this.context.stdout, `  test:   ${rendered.testPath}`);
      writeLine(this.context.stdout, '');
      writeLine(
        this.context.stdout,
        'Next: replace TODO markers with content adapted from real Lokomotif practice.',
      );
    }
    return 0;
  }

  private fail(message: string): void {
    if (this.json) {
      writeJson(this.context.stdout, { ok: false, error: message });
    } else {
      this.context.stderr.write(`error: ${message}\n`);
    }
  }
}
