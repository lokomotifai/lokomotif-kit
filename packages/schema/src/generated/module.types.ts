/* eslint-disable */
/**
 * AUTO-GENERATED FILE — DO NOT EDIT.
 *
 * Source of truth: schemas/module.schema.json
 * Regenerate with: pnpm -F @lokomotif/schema generate:ts
 *
 * The hand-written initial version of this file is committed so the
 * package compiles before the generation pipeline is wired. After the
 * first `pnpm generate:ts` run, this file is replaced by the
 * json-schema-to-typescript output. CI verifies the two are in sync.
 */

import type { Industry, Kind, Language, OutputFormatType, Register, Severity } from '../enums.js';

export type LocalizedString = {
  readonly tr?: string;
  readonly en?: string;
};

export type LocalizedStringArray = readonly LocalizedString[];

export type ModuleCommon = {
  readonly id: string;
  readonly version: string;
  readonly kind: Kind;
  readonly title: string;
  readonly description: string;
  readonly industry?: readonly Industry[];
  readonly languages: readonly Language[];
  readonly owner: string;
  readonly license: 'Apache-2.0';
  readonly tags?: readonly string[];
  readonly deprecated?: boolean;
  readonly deprecation_notice?: string;
  readonly source_reference?: string;
};

export type RoleBody = {
  readonly identity: LocalizedString;
  readonly expertise: LocalizedStringArray;
  readonly perspective?: LocalizedString;
  readonly authority?: LocalizedString;
};

export type TaskOutputFormat = {
  readonly type: OutputFormatType;
  readonly schema?: object | string;
  readonly description?: LocalizedString;
};

export type TaskExample = {
  readonly input: LocalizedString;
  readonly output: LocalizedString;
};

export type TaskBody = {
  readonly instructions: LocalizedString;
  readonly output_format: TaskOutputFormat;
  readonly examples?: readonly TaskExample[];
  readonly constraints?: LocalizedStringArray;
};

export type RegulatoryReference = {
  readonly framework: string;
  readonly section?: string;
  readonly summary?: LocalizedString;
};

export type ContextBody = {
  readonly domain: LocalizedString;
  readonly data_boundaries?: LocalizedStringArray;
  readonly regulatory_references?: readonly RegulatoryReference[];
  readonly operating_constraints?: LocalizedStringArray;
};

export type StyleBody = {
  readonly voice: LocalizedString;
  readonly audience: LocalizedString;
  readonly register?: Register;
  readonly examples?: LocalizedStringArray;
  readonly avoid?: LocalizedStringArray;
};

export type ForbiddenRule = {
  readonly rule: LocalizedString;
  readonly rationale?: LocalizedString;
};

export type GuardrailBody = {
  readonly forbidden: readonly ForbiddenRule[];
  readonly required_actions?: LocalizedStringArray;
  readonly escalation?: LocalizedString;
  readonly audit_requirements?: LocalizedStringArray;
  readonly severity?: Severity;
};

export type RoleModule = ModuleCommon & {
  readonly kind: 'role';
  readonly body: RoleBody;
};

export type TaskModule = ModuleCommon & {
  readonly kind: 'task';
  readonly body: TaskBody;
};

export type ContextModule = ModuleCommon & {
  readonly kind: 'context';
  readonly body: ContextBody;
};

export type StyleModule = ModuleCommon & {
  readonly kind: 'style';
  readonly body: StyleBody;
};

export type GuardrailModule = ModuleCommon & {
  readonly kind: 'guardrail';
  readonly body: GuardrailBody;
};

export type Module = RoleModule | TaskModule | ContextModule | StyleModule | GuardrailModule;
