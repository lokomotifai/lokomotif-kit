/**
 * Walk `modules/**\/*.yaml` from the repository root, validate each file
 * against the schema, and report failures.
 *
 * Wired to the repo-wide `pnpm validate:modules` task via turborepo.
 *
 * Until Phase 6 ships canonical modules, the `modules/` directory does
 * not exist; the script exits 0 with an informational message.
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import fg from 'fast-glob';
import { parse as parseYaml } from 'yaml';

import { formatErrors } from '../src/errors.js';
import { validate } from '../src/validate.js';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..', '..');
const modulesDir = join(repoRoot, 'modules');

async function main(): Promise<void> {
  if (!existsSync(modulesDir)) {
    console.log('No modules/ directory yet. Skipping validation.');
    return;
  }

  const files = await fg(['modules/**/*.yaml', 'modules/**/*.yml'], {
    cwd: repoRoot,
    absolute: true,
    ignore: ['**/__tests__/**'],
  });

  if (files.length === 0) {
    console.log('No modules found. Skipping validation.');
    return;
  }

  let failed = 0;

  for (const file of files) {
    const rel = relative(repoRoot, file);
    let parsed: unknown;
    try {
      parsed = parseYaml(readFileSync(file, 'utf-8'));
    } catch (err: unknown) {
      console.error(`✗ ${rel}`);
      console.error(`    YAML parse error: ${err instanceof Error ? err.message : String(err)}`);
      failed += 1;
      continue;
    }

    const result = validate(parsed);
    if (result.ok) {
      console.log(`✓ ${rel}`);
    } else {
      failed += 1;
      console.error(`✗ ${rel}`);
      console.error(formatErrors(result.errors));
    }
  }

  console.log('');
  if (failed > 0) {
    console.error(`${failed} of ${files.length} module(s) failed validation.`);
    process.exit(1);
  }
  console.log(`${files.length} module(s) validated.`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
