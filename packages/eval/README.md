# `@lokomotif/eval` — RTCSG eval harness

Python test runner for RTCSG modules. Every module shipped with Lokomotif Kit is gated by at least one passing eval defined here.

This package is at scaffold stage. The runner, judge interfaces, and reporting layer ship in **Phase 5** of [`IMPLEMENTATION_PLAN.md`](../../IMPLEMENTATION_PLAN.md).

## Setup

```bash
cd packages/eval
uv sync
```

## Run

```bash
uv run pytest                 # all tests
uv run pytest -k <pattern>    # filter
uv run pytest --cov           # with coverage
```

## Quality gates

```bash
uv run ruff check             # lint
uv run ruff format --check    # format check
uv run mypy src               # type check
```

## What lives here

- `src/lokomotif_eval/` — runner, judges, reporters.
- `tests/` — tests for the harness itself.
- `golden/` (Phase 5) — anonymized regression set.
- `lokomotif_schema/` (Phase 2 output) — auto-generated dataclasses from the JSON Schemas in `packages/schema/`.

## Authoring eval tests

Eval test conventions are defined alongside the runner in Phase 5. Until then, see [`CONTRIBUTING.md`](../../CONTRIBUTING.md) for general module rules.
