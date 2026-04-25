import { existsSync, readFileSync } from 'node:fs';

import { parse as parseYaml } from 'yaml';

import { FlowError } from './errors.js';
import type { Flow } from './types.js';

/**
 * Read a flow YAML file from disk and validate the shape.
 *
 * The flow shape in v0:
 *
 * ```yaml
 * name: optional-name
 * description: optional description
 * modules:
 *   - <module-id-1>
 *   - <module-id-2>
 * ```
 *
 * Throws `FlowError` for missing files, parse errors, or shape problems.
 */
export function loadFlow(filePath: string): Flow {
  if (!existsSync(filePath)) {
    throw new FlowError(`flow file not found: ${filePath}`);
  }

  let parsed: unknown;
  try {
    parsed = parseYaml(readFileSync(filePath, 'utf-8'));
  } catch (err: unknown) {
    throw new FlowError(
      `failed to parse flow YAML: ${err instanceof Error ? err.message : String(err)}`,
      err,
    );
  }

  return assertFlow(parsed);
}

/**
 * Validate that an unknown value matches the `Flow` shape. Throws
 * `FlowError` with a precise message on mismatch.
 */
export function assertFlow(value: unknown): Flow {
  if (typeof value !== 'object' || value === null) {
    throw new FlowError('flow must be an object');
  }
  const obj = value as Record<string, unknown>;

  if (!Array.isArray(obj['modules'])) {
    throw new FlowError('flow.modules must be an array of module IDs');
  }
  if (obj['modules'].length === 0) {
    throw new FlowError('flow.modules must not be empty');
  }
  for (const m of obj['modules']) {
    if (typeof m !== 'string' || m.length === 0) {
      throw new FlowError('flow.modules entries must be non-empty strings');
    }
  }

  if (obj['name'] !== undefined && typeof obj['name'] !== 'string') {
    throw new FlowError('flow.name must be a string when present');
  }
  if (obj['description'] !== undefined && typeof obj['description'] !== 'string') {
    throw new FlowError('flow.description must be a string when present');
  }

  return {
    name: obj['name'] as string | undefined,
    description: obj['description'] as string | undefined,
    modules: obj['modules'] as string[],
  };
}
