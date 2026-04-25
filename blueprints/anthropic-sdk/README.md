# `@lokomotif/blueprint-anthropic-sdk`

Adapt a `ComposedPrompt` from `@lokomotif/sdk` to Anthropic's Messages API.

The composed RTCSG prompt becomes the system field; the user input goes into a single user message. The blueprint also exposes a one-line `runWithAnthropic` that wraps `client.messages.create` with sensible defaults.

## Install

```bash
pnpm add @lokomotif/sdk @lokomotif/blueprint-anthropic-sdk @anthropic-ai/sdk
```

`@anthropic-ai/sdk` is a peer dependency — bring your own version.

## Usage

```ts
import Anthropic from '@anthropic-ai/sdk';
import { compose, loadModules } from '@lokomotif/sdk';
import { runWithAnthropic } from '@lokomotif/blueprint-anthropic-sdk';

const modules = loadModules(
  [
    'roles/finance/aml-analyst',
    'tasks/general/structured-summary',
    'contexts/finance/kvkk-compliance',
    'styles/cross-industry/executive-board-brief',
    'guardrails/cross-industry/pii-tr',
  ],
  { modulesDir: '/path/to/modules' },
);

const composed = compose(modules, { language: 'tr' });

const message = await runWithAnthropic(composed, 'Vakayı özetle.', {
  client: new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }),
  model: 'claude-sonnet-4-6',
});
```

## API

```ts
adaptToAnthropic(composed, userMessage)
  → { system: string; messages: MessageParam[]; composition_hash: string }

runWithAnthropic(composed, userMessage, options)
  → Promise<Anthropic.Message>
```

### Why a thin adapter

The SDK is vendor-neutral by design. This blueprint contains every Anthropic-specific concern in one file:

- The composed prompt goes into the `system` field, not into user messages — Anthropic conventions.
- The user input becomes a single `user` message; multi-turn conversation is the caller's responsibility.
- The composition hash is forwarded so emitters can record `lokomotif.flow.composition_hash` (see `@lokomotif/otel-schema`).

## Testing

The smoke test mocks `client.messages.create` so CI runs without an API key. To exercise the adapter end-to-end against the real API, set `ANTHROPIC_API_KEY` and run the example script in `examples/` (this is the operator-side end-to-end run noted in `OPERATOR_TASKS.md` § 11).

## Phase status

Ships in **Phase 7** of [`IMPLEMENTATION_PLAN.md`](../../IMPLEMENTATION_PLAN.md). Frontier-partnership pillar (Brief § 09).
