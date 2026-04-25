/**
 * Canonical span names for Lokomotif Kit operations.
 *
 * Mirrored in `semconv/lokomotif.yaml` under the `lokomotif.spans` group.
 */

export const SPAN_MODULE_LOAD = 'lokomotif.module.load' as const;
export const SPAN_FLOW_COMPOSE = 'lokomotif.flow.compose' as const;
export const SPAN_FLOW_DEPLOY = 'lokomotif.flow.deploy' as const;
export const SPAN_EVAL_RUN = 'lokomotif.eval.run' as const;

export const ALL_SPAN_NAMES = [
  SPAN_MODULE_LOAD,
  SPAN_FLOW_COMPOSE,
  SPAN_FLOW_DEPLOY,
  SPAN_EVAL_RUN,
] as const;

export type LokomotifSpanName = (typeof ALL_SPAN_NAMES)[number];
