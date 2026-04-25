# @lokomotif/otel-schema

## 0.0.1

### Patch Changes

- [`71b028e`](https://github.com/lokomotifai/lokomotif-kit/commit/71b028e5fa7e686811ac3d9bd2b5b57d8263f989) Thanks [@fatihguner](https://github.com/fatihguner)! - Release rehearsal — 0.0.1 patch publish to verify npm scope, NPM_TOKEN, and Sigstore provenance work end-to-end before v0.1.0 ships. No code changes; this is a smoke test for the release pipeline (Phase F in OPERATOR_TASKS.md § 13).

## 0.0.0

Initial scaffold. Released alongside Phase 4 of the Lokomotif Kit implementation plan.

- `semconv/lokomotif.yaml` — OpenTelemetry semantic conventions for module, flow, compose, and eval attributes.
- TypeScript constants for every attribute and span name.
- Parity test asserting the TS constants match the YAML spec exactly.
