# Changelog

All notable changes to this repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Per-package changelogs live alongside each package once published. This file tracks repository-level changes (governance, scaffolding, cross-cutting decisions). Package releases are recorded in each package's own `CHANGELOG.md`.

## [Unreleased]

### Added — Phase 9 (community + release hygiene)

- `commitlint.config.cjs` — Conventional Commits enforcement at commit-msg time. Hooked through pre-commit's `commit-msg` stage so a single `pre-commit install` wires both stages (`default_install_hook_types`).
- Root `package.json`: `@commitlint/cli` and `@commitlint/config-conventional` added to devDeps.
- `ROADMAP.md` — directional roadmap beyond Phase 10 launch (Q2 2026 → Q1 2027), with a note on Brief § 07 product ladder beyond.
- `RELEASING.md` — operational ritual for Changesets-driven releases, including a rehearsal protocol on a `0.0.x` tag before v0.1.0.
- `.github/labels.yml` — full label taxonomy (type, area, RTCSG kind, industry, lifecycle, priority, status).
- `.github/workflows/labels.yml` — pushes to `main` that touch the labels file sync the repo via `EndBug/label-sync` (`delete-other-labels: true` for a clean taxonomy).
- `CONTRIBUTING.md` — links to ROADMAP and RELEASING; commit type list expanded to match commitlint config; commit-msg hook described.
- `OPERATOR_TASKS.md § 13`: Discussions, label sync verification, release rehearsal, and Komünite channel (uninstrumented).

### Added — Phase 8 (documentation site)

- `docs/` — Nextra 3.x site, deployed to Vercel as `kit.lokomotif.ai`. Theme: `nextra-theme-docs`. Locales: `en` (default) and `tr`.
- EN canonical pages: `index`, `getting-started`, `method`, `module-authoring`, `cli`, `sdk`, `eval-harness`, `blueprints`, `rfcs`, `glossary`. Each page methodology-led, no retired phrases, with cross-links into source READMEs and the implementation plan.
- TR priority pages (native Turkish, not translated per Brief § 11): `tr/index`, `tr/getting-started`, `tr/method`, `tr/glossary`. Other pages link out to the EN canonical until native Turkish coverage expands.
- `docs/scripts/voice-gate.mjs` — scans every MDX page for retired phrases (Brief § 11 + CLAUDE.md voice rules); pages opt out via `voice_gate: skip` frontmatter (used by `glossary.mdx` and `tr/glossary.mdx`).
- `.github/workflows/docs.yml` — runs voice gate, typecheck, and Next.js build on PRs touching `docs/`.
- `docs/vercel.json` — Vercel project configuration (install + build + output dir + security headers).
- `pnpm-workspace.yaml`: `docs` added as a workspace member.
- `OPERATOR_TASKS.md § 12`: Vercel UI setup and DNS for `kit.lokomotif.ai`.

### Added — Phase 7 (runtime blueprints, four targets in parallel)

- `blueprints/anthropic-sdk/` — `@lokomotif/blueprint-anthropic-sdk`. `adaptToAnthropic` produces `{ system, messages, composition_hash }`; `runWithAnthropic` calls `client.messages.create`. `@anthropic-ai/sdk` is a peer dep.
- `blueprints/dify/` — `@lokomotif/blueprint-dify`. `adaptToDify` produces a workflow-mode `DifyAppDefinition` with start → llm → end nodes; `renderDifyYaml` serializes for Dify import.
- `blueprints/n8n/` — `@lokomotif/blueprint-n8n`. `adaptToN8n` produces a three-node n8n workflow (manual trigger → Anthropic chat → set output); `renderN8nJson` serializes for n8n import.
- `blueprints/langgraph/` — `@lokomotif/blueprint-langgraph`. `adaptToLangGraph` (pure layout) and `buildStateGraph` (compose → execute → audit) using `@langchain/langgraph`. Caller supplies the LLM callback; CI smoke tests use a vitest mock.
- Each blueprint records the composition hash on its output so traces can be correlated back to the originating Lokomotif composition (per `@lokomotif/otel-schema`).

### Added — Phase 6 Pass 1 (canonical modules from public sources)

- `modules/guardrails/cross-industry/pii-tr.yaml` — KVKK-aware PII guardrail with rules for TC Kimlik, IBAN TR, Turkish mobile numbers, email addresses, and passport numbers. Source: KVKK 6698 (Md. 3, 5, 6, 12), MASAK Tebliğ, ISO 13616, NVI TC Kimlik formatı.
- `modules/contexts/finance/kvkk-compliance.yaml` — Operating context for AI inside Turkish banks, insurance, and fintech. Source: KVKK 6698 (Md. 4–9, 16), KVKK Kurumu rehberleri, BDDK 2020 Bilgi Sistemleri Yönetmeliği.
- `modules/styles/cross-industry/executive-board-brief.yaml` — Lokomotif executive voice (confident, specific, methodology-led, hype-free). Source: `Lokomotif_AI_Positioning_Brief.md` § 10–11.
- Eval suites for each module under sibling `__tests__/` directories (deterministic checks against frontmatter, body shape, regulatory citations, voice keywords, source-reference fidelity).
- `docs/rfcs/0001-phase-6-partial-scope.md` — RFC documenting the two-pass Phase 6 ship.

### Changed

- `IMPLEMENTATION_PLAN.md` v1.0 → v1.1: Phase 6 split into Pass 1 (this commit) and Pass 2 (deferred to engagement-artifact availability). Locked decision #6 marked as partially resolved.
- `OPERATOR_TASKS.md`: added § 9 (Phase 6 Pass 2 tracker) and § 10 (pre-commit PII hook activation steps).
- `packages/eval/src/lokomotif_eval/pii.py`: docstring now points at `guardrails/cross-industry/pii-tr` as the canonical specification; the in-code patterns remain the runtime implementation until the canonical module's regex set is wired through the runner.

### Added — Phase 0 (Repository foundation)

- `LICENSE` (Apache 2.0) and `NOTICE`.
- `README.md` (English, primary) and `README.tr.md` (Turkish, native).
- `CODE_OF_CONDUCT.md` adapted for a methodology-led, bilingual project.
- `CONTRIBUTING.md` with development workflow, module authoring rules, RFC pointer.
- `SECURITY.md` covering vulnerability reports, KVKK-aware data handling, supply-chain posture.
- `GOVERNANCE.md` defining lead maintainership, decision-making, and the RFC process.
- `IMPLEMENTATION_PLAN.md` (LOCKED v1.0) — eleven-phase build plan with locked decisions.
- Repo hygiene: `.gitignore`, `.editorconfig`, `.nvmrc`, `.python-version`, `.yamllint.yaml`, `.pre-commit-config.yaml`.
- GitHub policy artifacts: PR template, CODEOWNERS, Dependabot config, issue templates (bug, feature, RFC, module proposal).

### Added — Phase 1 (Monorepo skeleton & toolchain)

- pnpm workspace configuration with turborepo pipeline.
- Base TypeScript config, ESLint flat config, Prettier config.
- Changesets configuration (release tooling).
- `packages/eval/` scaffold with `pyproject.toml`, smoke test, and harness placeholder.
- GitHub Actions workflows: CI (TypeScript + Python), Release (Changesets with provenance), CodeQL, OpenSSF Scorecard.
