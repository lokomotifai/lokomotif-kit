# @lokomotif/blueprint-langgraph

## 0.0.1

### Patch Changes

- [`71b028e`](https://github.com/lokomotifai/lokomotif-kit/commit/71b028e5fa7e686811ac3d9bd2b5b57d8263f989) Thanks [@fatihguner](https://github.com/fatihguner)! - Release rehearsal — 0.0.1 patch publish to verify npm scope, NPM_TOKEN, and Sigstore provenance work end-to-end before v0.1.0 ships. No code changes; this is a smoke test for the release pipeline (Phase F in OPERATOR_TASKS.md § 13).

- Updated dependencies [[`71b028e`](https://github.com/lokomotifai/lokomotif-kit/commit/71b028e5fa7e686811ac3d9bd2b5b57d8263f989)]:
  - @lokomotif/sdk@0.0.1

## 0.0.0

Initial scaffold. Released alongside Phase 7 of the Lokomotif Kit implementation plan.

- `adaptToLangGraph(composed)` — pure layout description (no LangGraph dependency).
- `buildStateGraph(composed, { llm })` — returns a `StateGraph<LokomotifGraphState>` with compose → execute → audit nodes.
- Smoke tests use a stub `llm` so CI runs without provider credentials.
- `@langchain/langgraph` and `@langchain/core` declared as peer dependencies.
