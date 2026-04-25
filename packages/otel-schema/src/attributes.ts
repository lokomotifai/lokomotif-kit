/**
 * OpenTelemetry attribute names for Lokomotif Kit.
 *
 * These constants mirror `semconv/lokomotif.yaml` exactly. The
 * `__tests__/parity.test.ts` suite asserts equivalence at test time so
 * the two cannot drift.
 *
 * Use the constants instead of string literals so renames flow through
 * the type system.
 */

// ---------- lokomotif.module.* ----------

export const ATTR_MODULE_ID = 'lokomotif.module.id' as const;
export const ATTR_MODULE_KIND = 'lokomotif.module.kind' as const;
export const ATTR_MODULE_VERSION = 'lokomotif.module.version' as const;
export const ATTR_MODULE_INDUSTRY = 'lokomotif.module.industry' as const;
export const ATTR_MODULE_LANGUAGES = 'lokomotif.module.languages' as const;

// ---------- lokomotif.flow.* ----------

export const ATTR_FLOW_NAME = 'lokomotif.flow.name' as const;
export const ATTR_FLOW_COMPOSITION_HASH = 'lokomotif.flow.composition_hash' as const;
export const ATTR_FLOW_MODULE_COUNT = 'lokomotif.flow.module_count' as const;

// ---------- lokomotif.compose.* ----------

export const ATTR_COMPOSE_RENDER_LANGUAGE = 'lokomotif.compose.render_language' as const;
export const ATTR_COMPOSE_FALLBACK_LANGUAGE = 'lokomotif.compose.fallback_language' as const;
export const ATTR_COMPOSE_BYTE_LENGTH = 'lokomotif.compose.byte_length' as const;

// ---------- lokomotif.eval.* ----------

export const ATTR_EVAL_ID = 'lokomotif.eval.id' as const;
export const ATTR_EVAL_MODULE_ID = 'lokomotif.eval.module_id' as const;
export const ATTR_EVAL_JUDGE = 'lokomotif.eval.judge' as const;
export const ATTR_EVAL_PASSED = 'lokomotif.eval.passed' as const;
export const ATTR_EVAL_SCORE = 'lokomotif.eval.score' as const;
export const ATTR_EVAL_DURATION_MS = 'lokomotif.eval.duration_ms' as const;

/**
 * Frozen list of every Kit-defined attribute name. Useful for
 * allow-list filtering or self-documentation.
 */
export const ALL_ATTRIBUTES = [
  ATTR_MODULE_ID,
  ATTR_MODULE_KIND,
  ATTR_MODULE_VERSION,
  ATTR_MODULE_INDUSTRY,
  ATTR_MODULE_LANGUAGES,
  ATTR_FLOW_NAME,
  ATTR_FLOW_COMPOSITION_HASH,
  ATTR_FLOW_MODULE_COUNT,
  ATTR_COMPOSE_RENDER_LANGUAGE,
  ATTR_COMPOSE_FALLBACK_LANGUAGE,
  ATTR_COMPOSE_BYTE_LENGTH,
  ATTR_EVAL_ID,
  ATTR_EVAL_MODULE_ID,
  ATTR_EVAL_JUDGE,
  ATTR_EVAL_PASSED,
  ATTR_EVAL_SCORE,
  ATTR_EVAL_DURATION_MS,
] as const;

export type LokomotifAttributeName = (typeof ALL_ATTRIBUTES)[number];

// ---------- enum value spaces ----------

export const MODULE_KINDS = ['role', 'task', 'context', 'style', 'guardrail'] as const;
export type ModuleKindValue = (typeof MODULE_KINDS)[number];

export const EVAL_JUDGE_KINDS = ['deterministic', 'llm'] as const;
export type EvalJudgeKindValue = (typeof EVAL_JUDGE_KINDS)[number];
