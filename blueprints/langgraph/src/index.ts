/**
 * @lokomotif/blueprint-langgraph — adapt RTCSG composition to LangGraph.
 *
 * The graph layout is fixed: START → compose → execute → audit → END.
 *
 * - `compose` injects the composed prompt and user input into state.
 * - `execute` calls the caller-supplied `llm` function.
 * - `audit` records the composition hash and module manifest for
 *   downstream observability.
 *
 * `adaptToLangGraph` is the pure form (no LangGraph dependency).
 * `buildStateGraph` constructs the actual `StateGraph`. The two are
 * separated so consumers that only want the layout description (for
 * documentation, diagrams, or other graph runtimes) do not have to
 * pull in LangGraph.
 */

import { END, START, StateGraph } from '@langchain/langgraph';

import type { ComposedPrompt } from '@lokomotif/sdk';

export type LokomotifGraphState = {
  user_input: string;
  system_prompt?: string;
  llm_output?: string;
  composition_hash?: string;
  modules?: ReadonlyArray<{ id: string; version: string; kind: string }>;
};

export type LokomotifGraphLayout = {
  readonly nodes: ReadonlyArray<{ readonly id: string; readonly description: string }>;
  readonly edges: ReadonlyArray<readonly [string, string]>;
  readonly composition_hash: string;
};

export type BuildGraphOptions = {
  /**
   * Caller-supplied LLM call. Receives the populated state and returns
   * the produced output. The blueprint does not call any provider; the
   * caller wires whichever client is appropriate for their runtime.
   */
  readonly llm: (state: LokomotifGraphState) => Promise<{ llm_output: string }> | { llm_output: string };
};

export const LOKOMOTIF_GRAPH_LAYOUT = {
  nodes: [
    { id: 'compose', description: 'Inject composed system prompt and user input into state.' },
    { id: 'execute', description: 'Invoke the caller-supplied LLM with the populated state.' },
    { id: 'audit', description: 'Record composition hash and module manifest in state.' },
  ],
  edges: [
    [START, 'compose'],
    ['compose', 'execute'],
    ['execute', 'audit'],
    ['audit', END],
  ],
} as const;

export function adaptToLangGraph(composed: ComposedPrompt): LokomotifGraphLayout {
  return {
    nodes: LOKOMOTIF_GRAPH_LAYOUT.nodes,
    edges: LOKOMOTIF_GRAPH_LAYOUT.edges,
    composition_hash: composed.compositionHash,
  };
}

export function buildStateGraph(
  composed: ComposedPrompt,
  options: BuildGraphOptions,
): StateGraph<LokomotifGraphState> {
  const graph = new StateGraph<LokomotifGraphState>({
    channels: {
      user_input: null,
      system_prompt: null,
      llm_output: null,
      composition_hash: null,
      modules: null,
    },
  });

  const moduleManifest = composed.modules.map((m) => ({
    id: m.id,
    version: m.version,
    kind: m.kind,
  }));

  graph.addNode('compose', () => ({
    system_prompt: composed.text,
  }));

  graph.addNode('execute', async (state: LokomotifGraphState) => {
    const result = await options.llm(state);
    return { llm_output: result.llm_output };
  });

  graph.addNode('audit', () => ({
    composition_hash: composed.compositionHash,
    modules: moduleManifest,
  }));

  graph.addEdge(START, 'compose' as never);
  graph.addEdge('compose' as never, 'execute' as never);
  graph.addEdge('execute' as never, 'audit' as never);
  graph.addEdge('audit' as never, END);

  return graph;
}
