import { readFileSync } from 'node:fs';

import fg from 'fast-glob';
import { parse as parseYaml } from 'yaml';

import { validate, type Module, type ValidationError } from '@lokomotif/schema';

export type LoadedModule = {
  readonly path: string;
  readonly module: Module;
};

export type LoadFailure = {
  readonly path: string;
  readonly errors: readonly ValidationError[];
};

export type LoadResult =
  | { readonly ok: true; readonly module: Module }
  | { readonly ok: false; readonly errors: readonly ValidationError[] };

/**
 * Read a single YAML file and validate it against the module schema.
 *
 * YAML parse failures and validation failures are surfaced as
 * `ValidationError`-shaped records so callers can treat both uniformly.
 */
export function loadModuleFile(filePath: string): LoadResult {
  let parsed: unknown;
  try {
    parsed = parseYaml(readFileSync(filePath, 'utf-8'));
  } catch (err: unknown) {
    return {
      ok: false,
      errors: [
        {
          path: '/',
          keyword: 'yaml',
          message: err instanceof Error ? err.message : String(err),
        },
      ],
    };
  }
  const result = validate(parsed);
  if (result.ok) {
    return { ok: true, module: result.data };
  }
  return { ok: false, errors: result.errors };
}

/**
 * Glob for module YAML files inside `modulesDir`.
 *
 * Test fixtures (`__tests__/`) are excluded by default — callers that
 * want them can pass `{ includeTests: true }`.
 */
export async function listModuleFiles(
  modulesDir: string,
  options: { readonly includeTests?: boolean } = {},
): Promise<string[]> {
  const ignore = options.includeTests ? [] : ['**/__tests__/**'];
  return fg(['**/*.yaml', '**/*.yml'], {
    cwd: modulesDir,
    absolute: true,
    ignore,
  });
}
