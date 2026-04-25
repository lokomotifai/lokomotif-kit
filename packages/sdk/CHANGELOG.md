# @lokomotif/sdk

## 0.0.0

Initial scaffold. Released alongside Phase 4 of the Lokomotif Kit implementation plan.

- `loadModule` / `loadModules` — disk loaders with typed `LoadModuleError` failure paths.
- `loadFlow` — flow YAML parser with shape validation.
- `compose` — pure composer over pre-loaded modules, returning a `ComposedPrompt`.
- `composeFlow` — convenience that loads + composes from a flow definition.
- `renderPrompt` — RTCSG-ordered text rendering with localized field selection.
- `compositionHash` — stable 16-character hex hash for observability.
- Zero vendor SDK dependencies; runtime adapters live in `blueprints/`.
