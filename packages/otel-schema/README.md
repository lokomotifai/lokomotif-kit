# `@lokomotif/otel-schema`

OpenTelemetry semantic conventions for Lokomotif Kit modules, flows, and evals.

This package is the observability spine. It declares the attribute names, expected types, and value spaces that Kit-aware runtimes (and downstream observability tooling) use when emitting telemetry. The Kit itself does not currently emit OTel spans — that is downstream work — but every emitter should follow this spec so dashboards stay coherent as the ecosystem grows.

## What is shipped

- **`semconv/lokomotif.yaml`** — the canonical specification, in OpenTelemetry semantic-convention YAML format. Suitable for consumption by `weaver` or other tooling.
- **`src/attributes.ts`** — `as const` TypeScript constants for every attribute name. Use these in code rather than string literals.
- **Span name constants** for canonical operations.

## Usage

```ts
import {
  ATTR_MODULE_ID,
  ATTR_MODULE_KIND,
  ATTR_FLOW_COMPOSITION_HASH,
  ATTR_EVAL_SCORE,
  SPAN_FLOW_COMPOSE,
} from '@lokomotif/otel-schema';

span.setAttribute(ATTR_MODULE_ID, 'roles/finance/aml-analyst');
span.setAttribute(ATTR_FLOW_COMPOSITION_HASH, composed.compositionHash);
```

## Attribute groups

- **`lokomotif.module.*`** — module identity and metadata (id, kind, version, industry, languages).
- **`lokomotif.flow.*`** — flow identity and composition (name, hash, module count).
- **`lokomotif.compose.*`** — render-time attributes (language, fallback language, byte length).
- **`lokomotif.eval.*`** — eval execution (judge, score, passed, duration).

See `semconv/lokomotif.yaml` for the authoritative list, including descriptions, types, and brief notes.

## Span names

- `lokomotif.module.load`
- `lokomotif.flow.compose`
- `lokomotif.flow.deploy`
- `lokomotif.eval.run`

## Versioning

The semantic conventions follow the package's semver. Adding a new attribute is a minor bump. Renaming or removing an attribute is a major bump (and requires an RFC — see [`GOVERNANCE.md`](../../GOVERNANCE.md)).
