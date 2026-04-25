# @lokomotif/schema

## 0.0.0

Initial scaffold. Released alongside Phase 2 of the Lokomotif Kit implementation plan.

- JSON Schema (draft-07) defining the RTCSG module contract.
- TypeScript validator (`validate`) returning a `ValidationResult` Result type.
- Discriminated-union `Module` type and per-kind body types.
- Generation scripts for TypeScript (`json-schema-to-typescript`) and Pydantic (`datamodel-code-generator`).
- `validate:modules` script for repository-wide module validation.
