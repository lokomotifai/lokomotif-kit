/**
 * Generate `src/generated/module.types.ts` from the JSON Schema.
 *
 * Run from the package root: `pnpm generate:ts`
 *
 * Output is committed. CI verifies the committed file is up-to-date by
 * running this script and asserting `git diff --exit-code`.
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { compileFromFile } from 'json-schema-to-typescript';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const schemaPath = join(root, 'schemas', 'module.schema.json');
const outputPath = join(root, 'src', 'generated', 'module.types.ts');

const banner = `/* eslint-disable */
/**
 * AUTO-GENERATED FILE — DO NOT EDIT.
 *
 * Source of truth: schemas/module.schema.json
 * Regenerate with: pnpm -F @lokomotif/schema generate:ts
 */`;

async function main(): Promise<void> {
  const ts = await compileFromFile(schemaPath, {
    bannerComment: banner,
    style: {
      singleQuote: true,
      trailingComma: 'all',
      printWidth: 100,
    },
    additionalProperties: false,
    enableConstEnums: false,
    declareExternallyReferenced: true,
    strictIndexSignatures: true,
  });
  writeFileSync(outputPath, ts);
  console.log(`Generated TypeScript types: ${outputPath}`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
