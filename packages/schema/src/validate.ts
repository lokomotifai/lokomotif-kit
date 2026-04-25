import Ajv, { type ErrorObject, type ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

import type { Module } from './generated/module.types.js';
import { loadModuleSchema } from './load-schema.js';
import type { ValidationError, ValidationResult } from './errors.js';

function buildValidator(): ValidateFunction<unknown> {
  const ajv = new Ajv({ allErrors: true, strict: true, allowUnionTypes: true });
  addFormats(ajv);
  return ajv.compile<unknown>(loadModuleSchema());
}

let validator: ValidateFunction<unknown> | undefined;

function getValidator(): ValidateFunction<unknown> {
  if (validator === undefined) {
    validator = buildValidator();
  }
  return validator;
}

function toValidationError(err: ErrorObject): ValidationError {
  return {
    path: err.instancePath === '' ? '/' : err.instancePath,
    keyword: err.keyword,
    message: err.message ?? 'unknown error',
    params: err.params as Readonly<Record<string, unknown>>,
  };
}

/**
 * Validate an arbitrary value against the Lokomotif module schema.
 *
 * Returns a `ValidationResult`:
 * - `{ ok: true, data }` when the input conforms — `data` is the same
 *   object, narrowed to `Module`.
 * - `{ ok: false, errors }` with a list of `ValidationError`s otherwise.
 *
 * No exceptions are thrown for invalid input. Bugs in the validator
 * itself (e.g. schema compilation failures) are still thrown, since
 * those are programmer errors.
 */
export function validate(input: unknown): ValidationResult<Module> {
  const fn = getValidator();
  const isValid = fn(input);
  if (isValid) {
    return { ok: true, data: input as Module };
  }
  const rawErrors: ErrorObject[] = fn.errors ?? [];
  const errors: ValidationError[] = rawErrors.map(toValidationError);
  return { ok: false, errors };
}

/** Test helper. Forces a fresh validator on next call. Do not use from production code. */
export function __resetValidator(): void {
  validator = undefined;
}
