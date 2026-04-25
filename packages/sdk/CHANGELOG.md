# @lokomotif/sdk

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
