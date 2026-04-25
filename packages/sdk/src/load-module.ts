import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { validate, type Module } from '@lokomotif/schema';
import { parse as parseYaml } from 'yaml';

import { LoadModuleError } from './errors.js';
import type { LoadOptions } from './types.js';

/**
 * Load a single module by ID.
 *
 * The ID format is `<kind-plural>/<industry>/<name>`; the file path is
 * resolved as `<modulesDir>/<id>.yaml`.
 *
 * Throws `LoadModuleError` on missing files, YAML parse errors, or
 * schema validation errors.
 */
export function loadModule(id: string, opts: LoadOptions): Module {
  const filePath = join(opts.modulesDir, `${id}.yaml`);
  if (!existsSync(filePath)) {
    throw new LoadModuleError(id, 'not-found', { path: filePath });
  }

  let parsed: unknown;
  try {
    parsed = parseYaml(readFileSync(filePath, 'utf-8'));
  } catch (err: unknown) {
    throw new LoadModuleError(id, 'parse-error', {
      message: err instanceof Error ? err.message : String(err),
    });
  }

  const result = validate(parsed);
  if (!result.ok) {
    throw new LoadModuleError(id, 'validation-error', result.errors);
  }
  return result.data;
}

/**
 * Load multiple modules. Fails fast on the first error.
 *
 * Use `Promise.allSettled`-style accumulation in callers that want to
 * report every failure; the SDK's contract is "throw on the first
 * problem so the caller does not work with partial state".
 */
export function loadModules(ids: readonly string[], opts: LoadOptions): Module[] {
  return ids.map((id) => loadModule(id, opts));
}
