# @lokomotif/blueprint-n8n

## 0.0.0

Initial scaffold. Released alongside Phase 7 of the Lokomotif Kit implementation plan.

- `adaptToN8n(composed, options)` — produce an `N8nWorkflow` (manual trigger → Anthropic chat → set output).
- `renderN8nJson(workflow)` — serialize to JSON suitable for n8n import.
- Smoke tests cover structural invariants without running an n8n instance.
