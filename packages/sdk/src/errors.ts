import type { ValidationError } from '@lokomotif/schema';

export type LoadModuleErrorReason = 'not-found' | 'parse-error' | 'validation-error';

/**
 * Thrown by `loadModule` / `loadModules` when a module cannot be loaded.
 *
 * The `reason` discriminator lets callers handle each failure mode
 * differently. `details` carries kind-appropriate context: validation
 * errors carry the schema's `ValidationError[]`; parse errors carry the
 * underlying parser message; not-found carries the resolved path.
 */
export class LoadModuleError extends Error {
  readonly moduleId: string;
  readonly reason: LoadModuleErrorReason;
  readonly details: unknown;

  constructor(moduleId: string, reason: LoadModuleErrorReason, details?: unknown) {
    super(`Failed to load module '${moduleId}': ${reason}`);
    this.name = 'LoadModuleError';
    this.moduleId = moduleId;
    this.reason = reason;
    this.details = details;
  }

  /** Convenience accessor when `reason === 'validation-error'`. */
  get validationErrors(): readonly ValidationError[] | undefined {
    if (this.reason !== 'validation-error') return undefined;
    return this.details as readonly ValidationError[] | undefined;
  }
}

/**
 * Thrown by `loadFlow` / `compose` for flow-shape problems.
 */
export class FlowError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'FlowError';
    this.cause = cause;
  }
}
