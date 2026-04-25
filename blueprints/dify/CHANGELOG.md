# @lokomotif/blueprint-dify

## 0.0.1

### Patch Changes

- [`71b028e`](https://github.com/lokomotifai/lokomotif-kit/commit/71b028e5fa7e686811ac3d9bd2b5b57d8263f989) Thanks [@fatihguner](https://github.com/fatihguner)! - Release rehearsal — 0.0.1 patch publish to verify npm scope, NPM_TOKEN, and Sigstore provenance work end-to-end before v0.1.0 ships. No code changes; this is a smoke test for the release pipeline (Phase F in OPERATOR_TASKS.md § 13).

- Updated dependencies [[`71b028e`](https://github.com/lokomotifai/lokomotif-kit/commit/71b028e5fa7e686811ac3d9bd2b5b57d8263f989)]:
  - @lokomotif/sdk@0.0.1

## 0.0.0

Initial scaffold. Released alongside Phase 7 of the Lokomotif Kit implementation plan.

- `adaptToDify(composed, options)` — produce a `DifyAppDefinition`.
- `renderDifyYaml(definition)` — serialize to importable Dify DSL YAML.
- Smoke tests cover structural invariants without a Dify runtime.
