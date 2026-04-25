/**
 * @lokomotif/blueprint-anthropic-sdk — adapt RTCSG composition to Anthropic.
 *
 * The composed RTCSG prompt becomes the system field on the Messages
 * API. The user input becomes a single user-role message. Multi-turn
 * conversations remain the caller's responsibility — this blueprint
 * does not impose a chat history shape.
 */

import type Anthropic from '@anthropic-ai/sdk';

import type { ComposedPrompt } from '@lokomotif/sdk';

const DEFAULT_MODEL = 'claude-sonnet-4-6';
const DEFAULT_MAX_TOKENS = 1024;

export type AnthropicAdaptOutput = {
  /** Composed RTCSG prompt — feeds the Anthropic Messages `system` field. */
  readonly system: string;
  /** Message array — one user message carrying the caller's input. */
  readonly messages: readonly Anthropic.MessageParam[];
  /** Composition hash, surfaced for OTel emitters. */
  readonly composition_hash: string;
};

/**
 * Pure adapter — no I/O, no SDK calls. Maps a `ComposedPrompt` and the
 * caller's user message onto the shape Anthropic's Messages API expects.
 */
export function adaptToAnthropic(
  composed: ComposedPrompt,
  userMessage: string,
): AnthropicAdaptOutput {
  return {
    system: composed.text,
    messages: [{ role: 'user', content: userMessage }],
    composition_hash: composed.compositionHash,
  };
}

export type AnthropicRunOptions = {
  /** An initialized Anthropic client. The blueprint does not construct one. */
  readonly client: Anthropic;
  /** Model id. Defaults to claude-sonnet-4-6 — operators should pin in production. */
  readonly model?: string;
  /** Max tokens. Defaults to 1024. */
  readonly maxTokens?: number;
  /** Pass-through extras forwarded verbatim to messages.create. */
  readonly extra?: Omit<
    Anthropic.MessageCreateParamsNonStreaming,
    'model' | 'max_tokens' | 'system' | 'messages' | 'stream'
  >;
};

/**
 * Compose, adapt, and call Anthropic. A convenience for callers that
 * just want the result; tests should mock `options.client.messages.create`.
 */
export async function runWithAnthropic(
  composed: ComposedPrompt,
  userMessage: string,
  options: AnthropicRunOptions,
): Promise<Anthropic.Message> {
  const adapted = adaptToAnthropic(composed, userMessage);
  return options.client.messages.create({
    model: options.model ?? DEFAULT_MODEL,
    max_tokens: options.maxTokens ?? DEFAULT_MAX_TOKENS,
    system: adapted.system,
    messages: [...adapted.messages],
    ...(options.extra ?? {}),
  });
}

export const ANTHROPIC_BLUEPRINT_DEFAULT_MODEL = DEFAULT_MODEL;
