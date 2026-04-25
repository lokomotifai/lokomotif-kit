# @lokomotif/sdk

## 0.1.0

### Minor Changes

- [`fba79a0`](https://github.com/lokomotifai/lokomotif-kit/commit/fba79a0bba425e76a6980dea467004de3bc34130) Thanks [@fatihguner](https://github.com/fatihguner)! - # Lokomotif Kit v0.1.0 — first public release

  The methodology, in code. RTCSG and the Three-Horizon Adoption Journey, packaged as schemas, a CLI, an SDK, an eval harness, four runtime blueprints, and a documentation site at [kit.lokomotif.ai](https://kit.lokomotif.ai).

  ## What's in this release

  **Schema and contracts**
  - `@lokomotif/schema` — JSON Schema for every RTCSG kind, with TypeScript types and a Result-returning `validate()`.
  - `@lokomotif/otel-schema` — OpenTelemetry semantic conventions for module, flow, compose, and eval attributes.

  **Tools**
  - `@lokomotif/cli` — `lokomotif` binary: `modules list / validate / new`, `compose`, `eval run`, `deploy`.
  - `@lokomotif/sdk` — runtime-agnostic composition library (zero vendor SDK dependencies).

  **Eval harness**
  - `lokomotif-eval` (Python) — JSON Pointer targets, deterministic + LLM-judged checks, a stub LLM judge for CI without API keys.

  **Runtime blueprints**
  - `@lokomotif/blueprint-anthropic-sdk`
  - `@lokomotif/blueprint-dify`
  - `@lokomotif/blueprint-n8n`
  - `@lokomotif/blueprint-langgraph`

  **Canonical modules (Pass 1, public-sourced per RFC 0001)**
  - `guardrails/cross-industry/pii-tr` — KVKK-aware PII guardrail.
  - `contexts/finance/kvkk-compliance` — KVKK + BDDK fintech context.
  - `styles/cross-industry/executive-board-brief` — Lokomotif executive voice.

  **Documentation**
  - [kit.lokomotif.ai](https://kit.lokomotif.ai) (Nextra, deployed to Vercel) — EN canonical with TR priority pages; voice gate against Brief § 11 retired phrases.

  ## Status

  Pre-1.0. The schema, CLI commands, and SDK surface may evolve before v1.0.0 via RFC. Pass 2 modules (`roles/finance/aml-analyst`, `tasks/general/structured-summary`) ship in v0.2.0 once engagement artifacts are available.

  ## License

  Apache 2.0.

### Patch Changes

- Updated dependencies [[`fba79a0`](https://github.com/lokomotifai/lokomotif-kit/commit/fba79a0bba425e76a6980dea467004de3bc34130)]:
  - @lokomotif/schema@0.1.0

## 0.0.1

### Patch Changes

- [`71b028e`](https://github.com/lokomotifai/lokomotif-kit/commit/71b028e5fa7e686811ac3d9bd2b5b57d8263f989) Thanks [@fatihguner](https://github.com/fatihguner)! - Release rehearsal — 0.0.1 patch publish to verify npm scope, NPM_TOKEN, and Sigstore provenance work end-to-end before v0.1.0 ships. No code changes; this is a smoke test for the release pipeline (Phase F in OPERATOR_TASKS.md § 13).

- Updated dependencies [[`71b028e`](https://github.com/lokomotifai/lokomotif-kit/commit/71b028e5fa7e686811ac3d9bd2b5b57d8263f989)]:
  - @lokomotif/schema@0.0.1

## 0.0.0

Initial scaffold. Released alongside Phase 4 of the Lokomotif Kit implementation plan.

- `loadModule` / `loadModules` — disk loaders with typed `LoadModuleError` failure paths.
- `loadFlow` — flow YAML parser with shape validation.
- `compose` — pure composer over pre-loaded modules, returning a `ComposedPrompt`.
- `composeFlow` — convenience that loads + composes from a flow definition.
- `renderPrompt` — RTCSG-ordered text rendering with localized field selection.
- `compositionHash` — stable 16-character hex hash for observability.
- Zero vendor SDK dependencies; runtime adapters live in `blueprints/`.
