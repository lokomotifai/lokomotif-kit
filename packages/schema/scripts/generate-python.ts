/**
 * Generate Pydantic models from the JSON Schema.
 *
 * Output: `packages/eval/src/lokomotif_schema/module.py`.
 *
 * Run from the schema package root: `pnpm generate:py`.
 *
 * Uses `datamodel-code-generator` (declared as a dev-dependency of
 * `packages/eval`) via `uv run`. The eval package's virtualenv must
 * be initialized (`uv sync`) before running this script.
 */

import { execSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const schemaRoot = join(here, '..');
const evalRoot = join(schemaRoot, '..', 'eval');

const schemaPath = join(schemaRoot, 'schemas', 'module.schema.json');
const outputPath = join(evalRoot, 'src', 'lokomotif_schema', 'module.py');

// Path datamodel-codegen sees, relative to the eval package cwd it runs in.
const inputForCli = relative(evalRoot, schemaPath);
const outputForCli = relative(evalRoot, outputPath);

const command = [
  'uv',
  'run',
  'datamodel-codegen',
  '--input',
  inputForCli,
  '--input-file-type',
  'jsonschema',
  '--output',
  outputForCli,
  '--target-python-version',
  '3.12',
  '--use-standard-collections',
  '--use-union-operator',
  '--output-model-type',
  'pydantic_v2.BaseModel',
  '--use-schema-description',
  '--use-field-description',
  '--snake-case-field',
  '--disable-timestamp',
].join(' ');

try {
  execSync(command, { cwd: evalRoot, stdio: 'inherit' });
  console.log(`Generated Pydantic models: ${outputPath}`);
} catch (err: unknown) {
  console.error('Python schema generation failed.');
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
