/**
 * Hand-curated enum constants mirroring the JSON Schema enums.
 *
 * The values here MUST match `schemas/module.schema.json`. The
 * `__tests__/enums.test.ts` suite asserts parity at test time so drift is
 * caught immediately.
 */

export const Kinds = ['role', 'task', 'context', 'style', 'guardrail'] as const;
export type Kind = (typeof Kinds)[number];

export const Industries = [
  'finance',
  'banking',
  'insurance',
  'retail',
  'e-commerce',
  'logistics',
  'healthcare',
  'manufacturing',
  'energy',
  'telco',
  'media',
  'hr',
  'legal',
  'public-sector',
  'education',
  'cross-industry',
] as const;
export type Industry = (typeof Industries)[number];

export const Languages = ['tr', 'en'] as const;
export type Language = (typeof Languages)[number];

export const Registers = [
  'formal',
  'professional',
  'conversational',
  'technical',
  'executive',
] as const;
export type Register = (typeof Registers)[number];

export const OutputFormatTypes = ['markdown', 'json', 'structured', 'free-form'] as const;
export type OutputFormatType = (typeof OutputFormatTypes)[number];

export const Severities = ['critical', 'high', 'medium', 'low'] as const;
export type Severity = (typeof Severities)[number];

export function isKind(value: unknown): value is Kind {
  return typeof value === 'string' && (Kinds as readonly string[]).includes(value);
}

export function isIndustry(value: unknown): value is Industry {
  return typeof value === 'string' && (Industries as readonly string[]).includes(value);
}

export function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (Languages as readonly string[]).includes(value);
}
