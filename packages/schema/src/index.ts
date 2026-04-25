/**
 * @lokomotif/schema — public API.
 *
 * Modules in the Kit conform to the JSON Schema in
 * `schemas/module.schema.json`. This package exposes:
 *
 * - `validate(input)` — Result-returning validator backed by Ajv.
 * - The discriminated `Module` type and per-kind body types.
 * - Enum constants and type guards for `Kind`, `Industry`, `Language`.
 * - Error formatting helpers.
 */

export { validate } from './validate.js';
export { loadModuleSchema } from './load-schema.js';
export { formatErrors } from './errors.js';
export type { ValidationError, ValidationResult } from './errors.js';
export {
  Kinds,
  Industries,
  Languages,
  Registers,
  OutputFormatTypes,
  Severities,
  isKind,
  isIndustry,
  isLanguage,
} from './enums.js';
export type {
  Kind,
  Industry,
  Language,
  Register,
  OutputFormatType,
  Severity,
} from './enums.js';
export type {
  LocalizedString,
  LocalizedStringArray,
  ModuleCommon,
  RoleBody,
  TaskBody,
  TaskOutputFormat,
  TaskExample,
  ContextBody,
  RegulatoryReference,
  StyleBody,
  GuardrailBody,
  ForbiddenRule,
  RoleModule,
  TaskModule,
  ContextModule,
  StyleModule,
  GuardrailModule,
  Module,
} from './generated/module.types.js';
