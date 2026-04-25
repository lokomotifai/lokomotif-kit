# @lokomotif/cli

## 0.0.1

### Patch Changes

- [`71b028e`](https://github.com/lokomotifai/lokomotif-kit/commit/71b028e5fa7e686811ac3d9bd2b5b57d8263f989) Thanks [@fatihguner](https://github.com/fatihguner)! - Release rehearsal — 0.0.1 patch publish to verify npm scope, NPM_TOKEN, and Sigstore provenance work end-to-end before v0.1.0 ships. No code changes; this is a smoke test for the release pipeline (Phase F in OPERATOR_TASKS.md § 13).

- Updated dependencies [[`71b028e`](https://github.com/lokomotifai/lokomotif-kit/commit/71b028e5fa7e686811ac3d9bd2b5b57d8263f989)]:
  - @lokomotif/schema@0.0.1
  - @lokomotif/sdk@0.0.1

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
