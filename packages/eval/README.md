# `lokomotif-eval` — RTCSG eval harness

Python test runner for RTCSG modules. Every module shipped with Lokomotif Kit is gated by at least one passing eval defined here.

## Setup

```bash
cd packages/eval
uv sync
```

## CLI

The package installs a console script `lokomotif-eval` (also reachable through the Node CLI as `lokomotif eval run`).

```bash
uv run lokomotif-eval run                    # run every eval suite under modules/
uv run lokomotif-eval run --module roles/finance/aml-analyst
uv run lokomotif-eval run --reporter json    # JSON for CI
uv run lokomotif-eval list                   # discovered suites
uv run lokomotif-eval scan-pii path/to/scan  # Turkey-aware PII scan
```

## Self-tests

```bash
uv run pytest                 # all tests
uv run pytest -k targets      # filter by name
uv run pytest --cov           # with coverage
```

```bash
uv run ruff check             # lint
uv run ruff format --check    # format
uv run mypy src               # strict type check
```

## Eval suite shape

Each module under `modules/` carries a sibling `__tests__/<name>.eval.yaml`:

```yaml
module: roles/finance/aml-analyst
description: 'Eval suite for the AML analyst role.'
checks:
  - id: identity-mentions-aml
    judge: deterministic
    kind: regex
    target: /body/identity/en
    pattern: 'AML|anti-money laundering'
    flags: i

  - id: identity-not-empty-tr
    judge: deterministic
    kind: not_empty
    target: /body/identity/tr

  - id: voice-sounds-senior
    judge: llm
    target: /body/identity
    rubric: 'Identity should sound like a senior practitioner.'
    threshold: 0.7
```

### Check kinds

| `judge`         | `kind`         | Args                        | Pass when …                      |
| --------------- | -------------- | --------------------------- | -------------------------------- |
| `deterministic` | `regex`        | `pattern`, optional `flags` | regex matches the target text    |
| `deterministic` | `not_empty`    | —                           | target is non-null and non-empty |
| `deterministic` | `array_length` | `min`, `max`                | array length in bounds           |
| `deterministic` | `equals`       | `expected`                  | target equals the expected value |
| `deterministic` | `contains`     | `substring`                 | target contains the substring    |
| `llm`           | —              | `rubric`, `threshold`       | judge score ≥ threshold          |

`target` is a JSON Pointer (RFC 6901) into the module — `/body/identity/en`, `/body/expertise/0`, and so on.

## LLM judges

The harness ships with `StubLLMJudge` — a deterministic keyword-overlap heuristic so CI runs without API keys. Real LLM judges (Anthropic-backed, OpenAI-compatible, local model servers) are configured by the operator and registered against the runner. The stub is the floor, not the ceiling.

## What lives here

- `src/lokomotif_eval/` — runner, judges, reporters, JSON Pointer, PII stub.
- `tests/` — tests for the harness itself.
- `golden/` — anonymized regression set; populated alongside the canonical modules in Phase 6.

## Phase status

The harness ships in **Phase 5** of [`IMPLEMENTATION_PLAN.md`](../../IMPLEMENTATION_PLAN.md). The first canonical modules and their eval suites land in Phase 6.
