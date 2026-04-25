/**
 * Loads the canonical JSON Schema from disk.
 *
 * The schema lives in `schemas/module.schema.json` relative to the package
 * root. Reading it at runtime (rather than importing as a JSON module)
 * keeps Node version requirements low and avoids quirks around JSON
 * import attributes.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Resolve the path to `module.schema.json`, regardless of whether this
 * file is executed from `src/` (development) or `dist/` (published).
 */
function resolveSchemaPath(): string {
  return join(here, '..', 'schemas', 'module.schema.json');
}

let cached: object | undefined;

export function loadModuleSchema(): object {
  if (cached === undefined) {
    const raw = readFileSync(resolveSchemaPath(), 'utf-8');
    cached = JSON.parse(raw) as object;
  }
  return cached;
}

/** Test helper. Not part of the public API; do not use from production code. */
export function __resetSchemaCache(): void {
  cached = undefined;
}
