# CLAUDE.md — Lokomotif Kit

This file is read by Claude Code at the start of every session. It is also read by human contributors. Keep it short, opinionated, and current.

## Project

Lokomotif Kit is the open-source reference implementation of the RTCSG methodology and the Three-Horizon Adoption Journey published by Lokomotif AI. It is the public foundation of the Lokomotif stack; the internal Workbench and the optional managed Control Plane sit on top of it.

RTCSG is a five-layer prompt architecture: **R**ole (who the AI acts as), **T**ask & format (what must be done, how structured), **C**ontext & constraint (organizational reality), **S**tyle & tone (audience calibration), **G**uardrail (what the AI must not do). Every module in this repo belongs to exactly one of these five concerns.

The Kit is **model-agnostic by design** and **runtime-agnostic by intent**. Modules work on Anthropic Agent SDK, Dify, n8n, LangGraph, and plain Python/TS agents. If a change only works on one runtime, stop — that belongs in `blueprints/`, not in `modules/`.

License: Apache 2.0.

## Stack

- **Monorepo**: pnpm workspaces + turborepo
- **TypeScript**: CLI, schema validation, SDK (Node 20+)
- **Python**: eval harness (`uv` + pytest, Python 3.12+)
- **YAML**: RTCSG module definitions
- **JSON Schema**: module validation (compiled to both TS types and Python dataclasses)
- **Docs**: Nextra
- **CI**: GitHub Actions

Do not introduce Bun, Yarn, npm, Poetry, Hatch, or any alternative to the above without opening an RFC issue first.

## Repo layout

```
kit/
├── packages/
│   ├── schema/          # JSON Schema + TS types for RTCSG modules
│   ├── cli/             # `lokomotif` CLI (TS)
│   ├── sdk/             # TypeScript SDK for composing modules
│   ├── eval/            # Python eval harness (uv)
│   └── otel-schema/     # OpenTelemetry attribute schema
├── modules/
│   ├── roles/           # R — who the AI acts as
│   ├── tasks/           # T — what must be done, what format
│   ├── contexts/        # C — organizational reality, constraints
│   ├── styles/          # S — tone, register, audience
│   └── guardrails/      # G — what the AI must not do
├── blueprints/          # Runtime-specific reference implementations
│   ├── anthropic-sdk/
│   ├── dify/
│   ├── n8n/
│   └── langgraph/
├── runbooks/            # Operational playbooks
├── docs/                # Nextra site source
└── examples/            # End-to-end example flows
```

Modules are the primary content of this repo. Packages exist to serve modules. If you are adding infrastructure that does not make modules better, stop and ask.

## Commands

Install:

```bash
pnpm install
cd packages/eval && uv sync
```

Develop:

```bash
pnpm dev                    # turborepo dev mode across TS packages
pnpm build                  # build all TS packages
pnpm test                   # run all TS tests (vitest)
pnpm lint                   # ESLint + Prettier
pnpm typecheck              # tsc --noEmit across workspace
pnpm validate:modules       # JSON Schema validation on all YAML modules
pnpm -F cli dev             # CLI in watch mode
```

Eval:

```bash
cd packages/eval
uv run pytest               # all eval tests
uv run pytest -k "roles"    # filter by pattern
uv run pytest --cov         # with coverage
```

CLI (end-user commands, not dev):

```bash
lokomotif modules list
lokomotif modules validate <path>
lokomotif compose <flow.yaml>
lokomotif eval run <flow.yaml>
lokomotif deploy <target> <flow.yaml>
```

## Core principles (non-negotiable)

1. **RTCSG is the spine.** Every module belongs to exactly one of the five concerns. Do not create modules that mix concerns. Do not introduce a sixth concern without an RFC and Lokomotif Core maintainer approval.

2. **Model-agnostic.** Never hardcode a specific model name, provider API, or vendor-specific feature into a `modules/` file. Runtime-specific adaptations live in `blueprints/`.

3. **Measurable by default.** Every module ships with at least one eval test. A module without an eval test is incomplete and cannot be merged.

4. **Schema is the contract.** Modules are validated at lint time, build time, and install time. Never work around validation — fix the module, or evolve the schema through an RFC.

5. **Turkish context is first-class.** Modules support Turkish content natively. Regulatory references (KVKK, BDDK, SPK, MASAK) are acceptable and encouraged where the module domain requires them.

## RTCSG module conventions

Every module YAML file has this frontmatter:

```yaml
id: <kind>/<industry>/<name> # e.g., roles/finance/compliance-analyst
version: 1.0.0 # semver; breaking changes require major bump
kind: role | task | context | style | guardrail
title: 'Short human-readable title'
description: 'One-sentence description of what this module does'
industry: [finance, retail, ...] # optional; see taxonomy below
languages: [tr, en] # which languages the content is available in
owner: lokomotif-core # or contributor handle
license: Apache-2.0
```

Then the body, schema varies by `kind`. See `packages/schema/` for exact definitions.

**Industry taxonomy** (extend via RFC): `finance`, `banking`, `insurance`, `retail`, `e-commerce`, `logistics`, `healthcare`, `manufacturing`, `energy`, `telco`, `media`, `hr`, `legal`, `public-sector`, `education`.

**Naming:**

- IDs are kebab-case: `roles/finance/aml-analyst`
- File names match IDs: `modules/roles/finance/aml-analyst.yaml`
- Every module directory has a sibling `__tests__/` directory with eval tests

**One concern per module.** A role module does not embed guardrails. A task module does not embed context. Compose them at flow time, not at module time.

## Testing

The test pyramid for this repo:

1. **Schema validation** (fast, every file change) — every YAML module parses and validates against its schema
2. **Unit tests** (TS packages) — Vitest, colocated `.test.ts` files
3. **Eval tests** (Python) — per-module, deterministic where possible, LLM-judge where not. Live in `packages/eval/tests/`
4. **Blueprint integration tests** — each blueprint has a smoke test that composes a trivial flow end-to-end
5. **Golden set regression** — anonymized real-world cases, versioned in `packages/eval/golden/`

Before every commit: `pnpm validate:modules && pnpm typecheck && pnpm test`.

Before every PR merge: all of the above plus `uv run pytest` in `packages/eval`.

## Coding conventions

- TypeScript: strict mode on, no `any`, prefer `type` over `interface` for data, `interface` for extensible contracts
- Python: type hints required, `ruff` for lint, `mypy --strict`
- YAML: 2-space indent, double quotes for strings with punctuation, no tabs
- Imports sorted and grouped: stdlib → external → internal
- No default exports in TS (named exports only)
- No circular imports — turborepo will flag these

Commit convention: [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`.

Branch convention: `type/short-description` (e.g., `feat/finance-roles`, `fix/schema-validation`).

## Language, voice, tone

User-facing content (docs, module descriptions, CLI output, error messages):

- Turkish where the audience is Turkish; English where the audience is global. Never mix languages mid-sentence.
- Sentence case, not Title Case. Not ALL CAPS.
- **Methodology language over feature language.** Talk about RTCSG, adoption horizons, workflow rewire, measurable transformation. Do not talk about "intelligent solutions", "AI-powered platforms", "revolutionary paradigms".
- **Avoid these words**: powerful, revolutionary, seamless, cutting-edge, intelligent, next-gen, AI-powered (as an adjective stack), game-changing, transformative (unless literally describing transformation programs).
- **Prefer concrete verbs and named outcomes** over vague futurism. "Reduces cycle time by 40%" over "accelerates your business."
- Short sentences that commit. Edit for spine.

Module content follows the same voice rules. A role module's `identity` field is prose — it should sound like something a senior consultant would say, not a marketing deck.

## Security and privacy

- **Never commit customer data.** All examples must use anonymized fixtures. Real company names become `Company A`, `Company B`. Personal data is stripped.
- **Never commit secrets.** API keys, OAuth tokens, connection strings — never. Use `.env.local` (gitignored) for development, environment secrets for CI.
- **PII guardrails are Turkey-aware.** The `guardrails/pii-tr` module detects TC Kimlik, IBAN TR, Turkish phone numbers, passport numbers. Keep it current with KVKK guidance.
- **Git hooks enforce the above.** `pre-commit` runs `gitleaks` for secret scanning and a PII checker over diffed content. Do not disable hooks.

## What NOT to do

- Do not introduce new languages, runtimes, or package managers without an RFC
- Do not create modules that depend on specific vendor APIs inside `modules/` (move to `blueprints/`)
- Do not bypass JSON Schema validation "just for now"
- Do not commit customer-identifiable data in examples, tests, or golden sets
- Do not merge unreviewed PRs from external contributors
- Do not remove or weaken eval tests to make CI green — fix the module instead
- Do not write deep class hierarchies; prefer composition and data transformation
- Do not silently swallow exceptions; log context and rethrow or fail loud
- Do not add a dependency without justifying it in the PR description
- Do not auto-format YAML module files with tooling that reorders keys — the frontmatter order matters for readability

## Communication preferences (Claude Code session behavior)

- User-facing chat: **Turkish** unless the user switches to English. Fatih and the Lokomotif team communicate in Turkish by default.
- Code, comments, commit messages, dev docs: English
- Module content: the language the module declares in its `languages` field
- **Plan before large changes.** When a task spans more than 3 files or touches the schema, propose a short plan first and wait for confirmation.
- **Small changes: edit directly** without extensive preamble.
- **When uncertain about schema design, Lokomotif voice, or Kit architecture: ask rather than guess.** These decisions compound across hundreds of modules.
- **Never invent module content from thin air.** If asked to create a finance AML role and no source material exists, ask for the reference prompt or engagement artifact to adapt. Modules should reflect real Lokomotif practice, not AI-generated plausibility.

## Working with MCP integrations

This repo does not require MCP at runtime. During development, the following MCPs are typically available in Claude Code sessions:

- **GitHub** — issues, PRs, reviews
- **Supabase** — used by the Workbench repo only; do not add Supabase dependencies here
- **Slack, Google Drive** — for drafting release notes or launch content, not for repo logic

If a task seems to need an MCP tool not listed, ask before adding it.

## Evolution of this file

This CLAUDE.md is a living document. Update it when:

- A core architectural decision is made (stack, directory layout, schema shape)
- A new convention is established across 3+ PRs
- A new "what NOT to do" is learned the hard way

Keep it under 400 lines. When it grows past that, split a section out into `docs/contributing.md` or an RFC in `docs/rfcs/`.

---

Last updated: April 2026 · Owner: Lokomotif Core Team
