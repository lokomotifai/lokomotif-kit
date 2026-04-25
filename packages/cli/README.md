# `@lokomotif/cli`

The `lokomotif` command-line tool. The first surface practitioners and contributors meet.

## Install

```bash
npm install --global @lokomotif/cli
# or, one-shot
npx @lokomotif/cli --help
```

## Commands

```text
lokomotif modules list                   List RTCSG modules in the current repo.
lokomotif modules validate <path>        Validate a module file or glob.
lokomotif modules new <kind> <name>      Scaffold a new module skeleton.
lokomotif compose <flow.yaml>            Compose a flow into a single prompt.
lokomotif eval run [-- args]             Run the eval harness (Python, packages/eval).
lokomotif deploy <target> <flow.yaml>    Adapt a flow to a runtime blueprint.
```

Every command supports `--json` for machine-readable output.

## Examples

List role modules in the current repo:

```bash
lokomotif modules list --kind role
```

Scaffold a new finance AML role module:

```bash
lokomotif modules new role finance/aml-analyst
```

This writes:

- `modules/roles/finance/aml-analyst.yaml` — the module skeleton (frontmatter + body placeholders).
- `modules/roles/finance/__tests__/aml-analyst.eval.yaml` — the eval test placeholder (real format ships with the harness in Phase 5).

Validate a single module:

```bash
lokomotif modules validate modules/roles/finance/aml-analyst.yaml
```

Validate every module under a directory:

```bash
lokomotif modules validate "modules/roles/**/*.yaml"
```

JSON validation output for CI:

```bash
lokomotif modules validate --json modules/**/*.yaml
```

## Status

`v0.0.x` — pre-release. Surface and flags may change before v1.0.0.

- `modules list / validate / new` — full implementation.
- `compose` — basic concatenation. Real composition (with proper RTCSG ordering, flow schema, and SDK integration) lands in Phase 4.
- `eval run` — delegates to `uv run pytest` in `packages/eval`. The full harness ships in Phase 5.
- `deploy` — lists known runtime targets. Adapter logic ships per-runtime in Phase 7.

Track the build sequence in [`IMPLEMENTATION_PLAN.md`](../../IMPLEMENTATION_PLAN.md).

## Repository discovery

Most commands look for a `modules/` directory by walking up from the current working directory. Override with `--root <path>` when running outside a repository (or in tests).

## Exit codes

- `0` — success.
- `1` — operation failure (validation errors, missing files, etc.).
- `2` — usage error (clipanion default for invalid arguments).

In `--json` mode, error details are emitted to stdout as part of the JSON payload; the exit code still indicates success or failure.
