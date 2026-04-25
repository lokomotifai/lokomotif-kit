import type Anthropic from '@anthropic-ai/sdk';

import { describe, expect, it, vi } from 'vitest';

import {
  ANTHROPIC_BLUEPRINT_DEFAULT_MODEL,
  adaptToAnthropic,
  runWithAnthropic,
} from '../src/index.js';

import { fixtureComposition } from './fixtures.js';

describe('adaptToAnthropic', () => {
  it('puts the composed prompt into the system field', () => {
    const composed = fixtureComposition();
    const out = adaptToAnthropic(composed, 'hello');
    expect(out.system).toContain('## Role');
    expect(out.system).toContain('## Task');
    expect(out.system).toContain('Acting as a test analyst.');
  });

  it('emits a single user message carrying the caller input', () => {
    const composed = fixtureComposition();
    const out = adaptToAnthropic(composed, 'analyze this');
    expect(out.messages).toHaveLength(1);
    expect(out.messages[0]).toEqual({ role: 'user', content: 'analyze this' });
  });

  it('forwards the composition hash for OTel emitters', () => {
    const composed = fixtureComposition();
    const out = adaptToAnthropic(composed, '');
    expect(out.composition_hash).toBe(composed.compositionHash);
    expect(out.composition_hash).toMatch(/^[0-9a-f]{16}$/);
  });
});

describe('runWithAnthropic', () => {
  it('calls messages.create with the adapted shape', async () => {
    const composed = fixtureComposition();
    const reply = { id: 'msg_test' } as unknown as Anthropic.Message;
    const create = vi.fn().mockResolvedValue(reply);
    const client = { messages: { create } } as unknown as Anthropic;

    const result = await runWithAnthropic(composed, 'hi', { client });

    expect(result).toBe(reply);
    expect(create).toHaveBeenCalledOnce();
    const params = create.mock.calls[0]?.[0] as Anthropic.MessageCreateParamsNonStreaming;
    expect(params.system).toContain('## Role');
    expect(params.messages).toEqual([{ role: 'user', content: 'hi' }]);
    expect(params.model).toBe(ANTHROPIC_BLUEPRINT_DEFAULT_MODEL);
    expect(params.max_tokens).toBe(1024);
  });

  it('honours model and maxTokens overrides', async () => {
    const composed = fixtureComposition();
    const create = vi.fn().mockResolvedValue({});
    const client = { messages: { create } } as unknown as Anthropic;

    await runWithAnthropic(composed, 'x', {
      client,
      model: 'claude-opus-4-7',
      maxTokens: 4096,
    });
    const params = create.mock.calls[0]?.[0] as Anthropic.MessageCreateParamsNonStreaming;
    expect(params.model).toBe('claude-opus-4-7');
    expect(params.max_tokens).toBe(4096);
  });

  it('forwards extra parameters', async () => {
    const composed = fixtureComposition();
    const create = vi.fn().mockResolvedValue({});
    const client = { messages: { create } } as unknown as Anthropic;

    await runWithAnthropic(composed, 'x', {
      client,
      extra: { temperature: 0.2, metadata: { user_id: 'test' } },
    });
    const params = create.mock.calls[0]?.[0] as Anthropic.MessageCreateParamsNonStreaming;
    expect(params.temperature).toBe(0.2);
    expect(params.metadata).toEqual({ user_id: 'test' });
  });
});
