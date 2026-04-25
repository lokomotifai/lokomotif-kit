# @lokomotif/blueprint-anthropic-sdk

## 0.0.0

Initial scaffold. Released alongside Phase 7 of the Lokomotif Kit implementation plan.

- `adaptToAnthropic(composed, userMessage)` — pure adapter producing `{ system, messages, composition_hash }`.
- `runWithAnthropic(composed, userMessage, options)` — convenience wrapper around `client.messages.create`.
- Smoke tests run with a mocked client; no API key required.
- `@anthropic-ai/sdk` declared as a peer dependency.
