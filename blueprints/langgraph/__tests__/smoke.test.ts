import { END, START } from '@langchain/langgraph';
import { describe, expect, it, vi } from 'vitest';

import {
  LOKOMOTIF_GRAPH_LAYOUT,
  adaptToLangGraph,
  buildStateGraph,
  type LokomotifGraphState,
} from '../src/index.js';

import { fixtureComposition } from './fixtures.js';

describe('adaptToLangGraph', () => {
  it('returns the canonical layout plus composition hash', () => {
    const composed = fixtureComposition();
    const layout = adaptToLangGraph(composed);
    expect(layout.composition_hash).toBe(composed.compositionHash);
    expect(layout.nodes.map((n) => n.id)).toEqual(['compose', 'execute', 'audit']);
  });

  it('layout edges include START and END terminals', () => {
    const composed = fixtureComposition();
    const layout = adaptToLangGraph(composed);
    const sources = layout.edges.map(([from]) => from);
    const targets = layout.edges.map(([, to]) => to);
    expect(sources).toContain(START);
    expect(targets).toContain(END);
  });
});

describe('buildStateGraph', () => {
  it('compiles into a runnable graph', async () => {
    const composed = fixtureComposition();
    const llm = vi.fn(async (state: LokomotifGraphState) => ({
      llm_output: `responded to ${state.user_input}`,
    }));

    const compiled = buildStateGraph(composed, { llm }).compile();
    const result = (await compiled.invoke({ user_input: 'hi' })) as LokomotifGraphState;

    expect(llm).toHaveBeenCalledOnce();
    expect(result.system_prompt).toContain('## Role');
    expect(result.system_prompt).toContain('## Task');
    expect(result.llm_output).toBe('responded to hi');
    expect(result.composition_hash).toBe(composed.compositionHash);
    expect(result.modules?.length).toBe(composed.modules.length);
  });

  it('uses the canonical layout', () => {
    expect(LOKOMOTIF_GRAPH_LAYOUT.nodes).toHaveLength(3);
    expect(LOKOMOTIF_GRAPH_LAYOUT.edges).toHaveLength(4);
  });
});
