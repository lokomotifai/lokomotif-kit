# `@lokomotif/blueprint-langgraph`

Adapt a `ComposedPrompt` to a [LangGraph](https://langchain-ai.github.io/langgraphjs/) `StateGraph`.

The blueprint produces a graph with three nodes — `compose`, `execute`, and `audit` — wired in series. The composed RTCSG prompt is the `compose` node's output; `execute` calls a caller-supplied LLM function; `audit` records the composition hash and forwards the model's response.

## Install

```bash
pnpm add @lokomotif/sdk @lokomotif/blueprint-langgraph @langchain/core @langchain/langgraph
```

LangGraph and `@langchain/core` are peer dependencies — bring your own version aligned with whichever model adapter you use.

## Usage

```ts
import { compose } from '@lokomotif/sdk';
import { buildStateGraph, type LokomotifGraphState } from '@lokomotif/blueprint-langgraph';

const composed = compose(modules);

const graph = buildStateGraph(composed, {
  llm: async (state) => callYourLLM(state.system_prompt, state.user_input),
});

const compiled = graph.compile();
const result = await compiled.invoke({ user_input: 'analyze this' });
console.log(result.llm_output);
console.log(result.composition_hash);
```

## API

```ts
adaptToLangGraph(composed)              → LokomotifGraphLayout
buildStateGraph(composed, options)      → StateGraph<LokomotifGraphState>
```

`adaptToLangGraph` is the pure form — no LangGraph dependency, returns the layout description. `buildStateGraph` constructs the actual `StateGraph` and is the typical entry point.

## Graph layout

```
START → compose → execute → audit → END
```

- **`compose`** — emits the composed system prompt and user input into state. Pure.
- **`execute`** — calls `options.llm(state)`. The caller's contract: read `state.system_prompt` and `state.user_input`, return `{ llm_output: string }`.
- **`audit`** — appends `composition_hash` and the module manifest to state for downstream observability.

## Phase status

Ships in **Phase 7** of [`IMPLEMENTATION_PLAN.md`](../../IMPLEMENTATION_PLAN.md).
