# @lokomotif/cli

## 0.0.0

Initial scaffold. Released alongside Phase 3 of the Lokomotif Kit implementation plan.

- `modules list` — lists modules with kind/industry filters.
- `modules validate` — validates a path or glob via `@lokomotif/schema`.
- `modules new` — scaffolds a module skeleton + eval placeholder.
- `compose` — basic flow composition (full implementation moves to `@lokomotif/sdk` in Phase 4).
- `eval run` — delegates to `uv run pytest` in `packages/eval` (full harness in Phase 5).
- `deploy` — lists known blueprint targets (adapter logic in Phase 7).
- `--json` mode on every command.
- Smoke and unit tests via Vitest with in-process clipanion runs.
