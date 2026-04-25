/**
 * Validation result types.
 *
 * `validate` returns a Result rather than throwing — invalid input is a
 * normal flow, not an exception, and callers benefit from exhaustive
 * narrowing on the `ok` discriminant.
 */

export type ValidationError = {
  /** JSON Pointer to the offending location, e.g. `/body/identity/tr`. `/` for root. */
  readonly path: string;
  /** Schema keyword that triggered the failure: `required`, `type`, `enum`, `pattern`, `oneOf`, etc. */
  readonly keyword: string;
  /** Human-readable message from the validator. */
  readonly message: string;
  /** Keyword-specific parameters (allowed values, missing property name, etc.). */
  readonly params?: Readonly<Record<string, unknown>>;
};

export type ValidationResult<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly errors: readonly ValidationError[] };

/**
 * Format a list of validation errors as a multi-line string.
 *
 * Useful for CLI output and test failure messages. Not part of the
 * library's structured contract — for programmatic access, walk `errors`
 * directly.
 */
export function formatErrors(errors: readonly ValidationError[]): string {
  if (errors.length === 0) {
    return '(no errors)';
  }
  return errors
    .map((err) => {
      const path = err.path === '' ? '/' : err.path;
      return `  ${path}  [${err.keyword}]  ${err.message}`;
    })
    .join('\n');
}
