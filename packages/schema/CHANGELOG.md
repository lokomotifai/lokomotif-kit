# @lokomotif/schema

## 0.0.1

### Patch Changes

- [`71b028e`](https://github.com/lokomotifai/lokomotif-kit/commit/71b028e5fa7e686811ac3d9bd2b5b57d8263f989) Thanks [@fatihguner](https://github.com/fatihguner)! - Release rehearsal — 0.0.1 patch publish to verify npm scope, NPM_TOKEN, and Sigstore provenance work end-to-end before v0.1.0 ships. No code changes; this is a smoke test for the release pipeline (Phase F in OPERATOR_TASKS.md § 13).

## 0.0.0

Initial scaffold. Released alongside Phase 2 of the Lokomotif Kit implementation plan.

- JSON Schema (draft-07) defining the RTCSG module contract.
- TypeScript validator (`validate`) returning a `ValidationResult` Result type.
- Discriminated-union `Module` type and per-kind body types.
- Generation scripts for TypeScript (`json-schema-to-typescript`) and Pydantic (`datamodel-code-generator`).
- `validate:modules` script for repository-wide module validation.
