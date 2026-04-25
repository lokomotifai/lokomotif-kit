import { describe, expect, it } from 'vitest';
import { parse as parseYaml } from 'yaml';

import { DIFY_BLUEPRINT_DEFAULTS, adaptToDify, renderDifyYaml } from '../src/index.js';

import { fixtureComposition } from './fixtures.js';

describe('adaptToDify', () => {
  it('produces a workflow-mode app definition', () => {
    const composed = fixtureComposition();
    const def = adaptToDify(composed, { appName: 'aml-review' });
    expect(def.app.mode).toBe('workflow');
    expect(def.app.name).toBe('aml-review');
    expect(def.workflow.graph.nodes).toHaveLength(3);
    expect(def.workflow.graph.edges).toEqual([
      { source: 'start', target: 'llm' },
      { source: 'llm', target: 'end' },
    ]);
  });

  it('embeds the composed prompt as the LLM system slot', () => {
    const composed = fixtureComposition();
    const def = adaptToDify(composed, { appName: 'demo' });
    const llm = def.workflow.graph.nodes.find((n) => n.id === 'llm');
    expect(llm).toBeDefined();
    const promptTemplate = (llm?.data['prompt_template'] ?? []) as ReadonlyArray<{
      role: string;
      text: string;
    }>;
    expect(promptTemplate[0]?.role).toBe('system');
    expect(promptTemplate[0]?.text).toContain('## Role');
    expect(promptTemplate[0]?.text).toContain('## Task');
  });

  it('records the composition hash on the top level and inside the LLM node', () => {
    const composed = fixtureComposition();
    const def = adaptToDify(composed, { appName: 'demo' });
    expect(def.lokomotif.composition_hash).toBe(composed.compositionHash);
    const llm = def.workflow.graph.nodes.find((n) => n.id === 'llm');
    const lokomotifBlock = llm?.data['lokomotif'] as { composition_hash: string };
    expect(lokomotifBlock.composition_hash).toBe(composed.compositionHash);
  });

  it('uses Anthropic + claude-sonnet-4-6 by default', () => {
    const composed = fixtureComposition();
    const def = adaptToDify(composed, { appName: 'demo' });
    const llm = def.workflow.graph.nodes.find((n) => n.id === 'llm');
    const model = llm?.data['model'] as { provider: string; name: string };
    expect(model.provider).toBe(DIFY_BLUEPRINT_DEFAULTS.modelProvider);
    expect(model.name).toBe(DIFY_BLUEPRINT_DEFAULTS.modelName);
  });

  it('honours model overrides and extra completion params', () => {
    const composed = fixtureComposition();
    const def = adaptToDify(composed, {
      appName: 'demo',
      modelProvider: 'openai',
      modelName: 'gpt-4o-mini',
      modelParams: { temperature: 0.1 },
    });
    const llm = def.workflow.graph.nodes.find((n) => n.id === 'llm');
    const model = llm?.data['model'] as {
      provider: string;
      name: string;
      completion_params: Record<string, unknown>;
    };
    expect(model.provider).toBe('openai');
    expect(model.name).toBe('gpt-4o-mini');
    expect(model.completion_params).toEqual({ temperature: 0.1 });
  });
});

describe('renderDifyYaml', () => {
  it('serializes to YAML that round-trips', () => {
    const composed = fixtureComposition();
    const def = adaptToDify(composed, { appName: 'demo' });
    const yamlText = renderDifyYaml(def);
    const parsed = parseYaml(yamlText) as {
      app: { mode: string };
      lokomotif: { composition_hash: string };
    };
    expect(parsed.app.mode).toBe('workflow');
    expect(parsed.lokomotif.composition_hash).toBe(composed.compositionHash);
  });
});
