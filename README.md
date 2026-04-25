# Lokomotif Kit

[![CI](https://github.com/lokomotif-ai/lokomotif-kit/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/lokomotif-ai/lokomotif-kit/actions/workflows/ci.yml)
[![CodeQL](https://github.com/lokomotif-ai/lokomotif-kit/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/lokomotif-ai/lokomotif-kit/actions/workflows/codeql.yml)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/lokomotif-ai/lokomotif-kit/badge)](https://scorecard.dev/viewer/?uri=github.com/lokomotif-ai/lokomotif-kit)
[![License: Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Docs: kit.lokomotif.ai](https://img.shields.io/badge/docs-kit.lokomotif.ai-7057ff.svg)](https://kit.lokomotif.ai)

**The open-source methodology core for Corporate AI Adoption.**

Lokomotif Kit is the reference implementation of **RTCSG** and the **Three-Horizon Adoption Journey** — the methodology Lokomotif AI uses to design how organizations work with AI. The Kit publishes the method so practitioners, partners, and client teams can apply it directly. The internal Workbench and the optional managed Control Plane sit on top of it.

[Türkçe](./README.tr.md) · [Documentation](https://kit.lokomotif.ai) · [Lokomotif AI](https://lokomotif.ai)

---

## What this is

A model-agnostic, runtime-agnostic library of:

- **RTCSG modules** — composable units across the five layers of the prompt architecture: Role, Task & Format, Context & Constraint, Style & Tone, Guardrail.
- **A schema** — every module conforms to a JSON Schema validated at lint time, build time, and install time.
- **A CLI** — `lokomotif` to list, validate, compose, evaluate, and deploy flows.
- **An eval harness** — a Python test runner with deterministic and judged checks. No module ships without a passing eval.
- **Blueprints** — runtime-specific reference implementations for Anthropic Agent SDK, Dify, n8n, and LangGraph. Vendor-specific code lives here, never in modules.

## What this is not

- Not a prompt library. RTCSG modules carry context, governance, and measurement — not just a string template.
- Not a framework that requires a runtime. Modules are portable across runtimes by design.
- Not a curated marketplace. The Kit is editorial; module quality is gated by schema, eval, and review.
- Not a substitute for engagement. The Kit publishes the method; the practice it embodies is delivered through Lokomotif AI's Adoption Sprint, Workflow Rewire, and Agentic Scale.

## RTCSG

Every module belongs to exactly one of five concerns:

- **R — Role.** Who the AI acts as. Expertise, perspective, authority calibrated to the task.
- **T — Task & Format.** What must be done; how the output is structured.
- **C — Context & Constraint.** The organizational reality the model must respect — data boundaries, situational limits, regulatory frame.
- **S — Style & Tone.** Voice and register calibrated to audience.
- **G — Guardrail.** What the model must not do. Boundaries, accuracy standards, organizational risk controls.

Composition happens at flow time, not module time. A role module never embeds guardrails; a task module never embeds context. The Kit enforces this.

## Status

`v0.1.0` is in development. Module surface, CLI commands, and schema may change ahead of the first stable release. The build sequence is defined in [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md).

## Stack

- **Monorepo:** pnpm workspaces + turborepo
- **TypeScript:** CLI, schema, SDK (Node 20+)
- **Python:** eval harness (`uv` + pytest, Python 3.12+)
- **YAML:** RTCSG module definitions
- **JSON Schema:** module validation, compiled to TypeScript types and Python dataclasses
- **Docs:** Nextra
- **CI:** GitHub Actions, with Sigstore provenance on releases

## Install

> The Kit is in pre-release. The commands below scaffold the development environment; published packages ship in Phase 3 of the [implementation plan](./IMPLEMENTATION_PLAN.md).

```bash
git clone https://github.com/lokomotif-ai/lokomotif-kit.git
cd lokomotif-kit
corepack enable
pnpm install
cd packages/eval && uv sync
```

## Documentation

Documentation lives at [kit.lokomotif.ai](https://kit.lokomotif.ai). For contributor conventions see [`Lokomotif-Kit.md`](./Lokomotif-Kit.md); for the build sequence see [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md); for what's coming next see [`ROADMAP.md`](./ROADMAP.md).

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the development workflow, the RFC process, and module authoring rules. Every module ships with at least one eval test. No exceptions.

## Governance

The Kit is maintained by the Lokomotif Core Team. See [`GOVERNANCE.md`](./GOVERNANCE.md).

## Security

If you have discovered a security issue, please email [kit@lokomotif.ai](mailto:kit@lokomotif.ai). Do not open a public issue. See [`SECURITY.md`](./SECURITY.md) for the full policy.

## Frontier connection

Lokomotif AI is **Anthropic Ambassador İstanbul**. The Kit reflects current frontier practice in agentic systems and responsible AI.

## License

Apache License 2.0. See [`LICENSE`](./LICENSE) and [`NOTICE`](./NOTICE).

## About Lokomotif AI

Lokomotif AI is **Turkey's first Corporate AI Adoption Partner**. The firm designs operating models for agentic transformation across enterprise sectors. Practitioner community: [Komünite](https://komunite.lokomotif.ai). Learn more at [lokomotif.ai](https://lokomotif.ai).
