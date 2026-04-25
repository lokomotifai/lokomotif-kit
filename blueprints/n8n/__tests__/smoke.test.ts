import { describe, expect, it } from 'vitest';

import { N8N_BLUEPRINT_DEFAULTS, adaptToN8n, renderN8nJson } from '../src/index.js';

import { fixtureComposition } from './fixtures.js';

describe('adaptToN8n', () => {
  it('produces a three-node workflow wired in series', () => {
    const composed = fixtureComposition();
    const wf = adaptToN8n(composed, { workflowName: 'aml-review' });
    expect(wf.name).toBe('aml-review');
    expect(wf.active).toBe(false);
    expect(wf.nodes).toHaveLength(3);
    expect(wf.nodes.map((n) => n.id)).toEqual(['trigger', 'llm', 'output']);
  });

  it('embeds the composed prompt as the system message', () => {
    const composed = fixtureComposition();
    const wf = adaptToN8n(composed, { workflowName: 'demo' });
    const llm = wf.nodes.find((n) => n.id === 'llm');
    expect(llm).toBeDefined();
    const messageValues = (
      (llm?.parameters['messages'] ?? {}) as {
        messageValues: ReadonlyArray<{ role: string; message: string }>;
      }
    ).messageValues;
    expect(messageValues[0]?.role).toBe('system');
    expect(messageValues[0]?.message).toContain('## Role');
    expect(messageValues[0]?.message).toContain('## Task');
  });

  it('records the composition hash in the workflow meta', () => {
    const composed = fixtureComposition();
    const wf = adaptToN8n(composed, { workflowName: 'demo' });
    expect(wf.meta.lokomotif.composition_hash).toBe(composed.compositionHash);
    expect(wf.meta.lokomotif.modules).toHaveLength(composed.modules.length);
  });

  it('uses the default Anthropic model when none is supplied', () => {
    const composed = fixtureComposition();
    const wf = adaptToN8n(composed, { workflowName: 'demo' });
    const llm = wf.nodes.find((n) => n.id === 'llm');
    expect(llm?.parameters['model']).toBe(N8N_BLUEPRINT_DEFAULTS.modelName);
  });

  it('honours model overrides', () => {
    const composed = fixtureComposition();
    const wf = adaptToN8n(composed, {
      workflowName: 'demo',
      modelName: 'claude-opus-4-7',
      modelParams: { temperature: 0.1 },
    });
    const llm = wf.nodes.find((n) => n.id === 'llm');
    expect(llm?.parameters['model']).toBe('claude-opus-4-7');
    expect(llm?.parameters['options']).toEqual({ temperature: 0.1 });
  });

  it('connects trigger → llm → output in connections', () => {
    const composed = fixtureComposition();
    const wf = adaptToN8n(composed, { workflowName: 'demo' });
    const conns = wf.connections as Record<
      string,
      { main: ReadonlyArray<ReadonlyArray<{ node: string }>> }
    >;
    expect(conns['Manual Trigger']?.main[0]?.[0]?.node).toBe('Anthropic Chat');
    expect(conns['Anthropic Chat']?.main[0]?.[0]?.node).toBe('Set Output');
  });
});

describe('renderN8nJson', () => {
  it('returns valid JSON that round-trips', () => {
    const composed = fixtureComposition();
    const wf = adaptToN8n(composed, { workflowName: 'demo' });
    const text = renderN8nJson(wf);
    const parsed = JSON.parse(text) as N8nWorkflowShape;
    expect(parsed.name).toBe('demo');
    expect(parsed.meta.lokomotif.composition_hash).toBe(composed.compositionHash);
  });
});

type N8nWorkflowShape = {
  name: string;
  meta: { lokomotif: { composition_hash: string } };
};
