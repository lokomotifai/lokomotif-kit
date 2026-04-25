# @lokomotif/blueprint-langgraph

## 0.0.0

Initial scaffold. Released alongside Phase 7 of the Lokomotif Kit implementation plan.

- `adaptToLangGraph(composed)` — pure layout description (no LangGraph dependency).
- `buildStateGraph(composed, { llm })` — returns a `StateGraph<LokomotifGraphState>` with compose → execute → audit nodes.
- Smoke tests use a stub `llm` so CI runs without provider credentials.
- `@langchain/langgraph` and `@langchain/core` declared as peer dependencies.
