/**
 * @lokomotif/otel-schema — public API.
 *
 * OpenTelemetry semantic conventions for Lokomotif Kit modules, flows,
 * and evals. Use these constants in code that emits or consumes Kit
 * telemetry; the YAML in `semconv/` is the authoritative reference for
 * tooling.
 */

export {
  ATTR_COMPOSE_BYTE_LENGTH,
  ATTR_COMPOSE_FALLBACK_LANGUAGE,
  ATTR_COMPOSE_RENDER_LANGUAGE,
  ATTR_EVAL_DURATION_MS,
  ATTR_EVAL_ID,
  ATTR_EVAL_JUDGE,
  ATTR_EVAL_MODULE_ID,
  ATTR_EVAL_PASSED,
  ATTR_EVAL_SCORE,
  ATTR_FLOW_COMPOSITION_HASH,
  ATTR_FLOW_MODULE_COUNT,
  ATTR_FLOW_NAME,
  ATTR_MODULE_ID,
  ATTR_MODULE_INDUSTRY,
  ATTR_MODULE_KIND,
  ATTR_MODULE_LANGUAGES,
  ATTR_MODULE_VERSION,
  ALL_ATTRIBUTES,
  EVAL_JUDGE_KINDS,
  MODULE_KINDS,
} from './attributes.js';
export type { EvalJudgeKindValue, LokomotifAttributeName, ModuleKindValue } from './attributes.js';

export {
  ALL_SPAN_NAMES,
  SPAN_EVAL_RUN,
  SPAN_FLOW_COMPOSE,
  SPAN_FLOW_DEPLOY,
  SPAN_MODULE_LOAD,
} from './spans.js';
export type { LokomotifSpanName } from './spans.js';
