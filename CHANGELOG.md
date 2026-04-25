# Changelog

All notable changes to this repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Per-package changelogs live alongside each package once published. This file tracks repository-level changes (governance, scaffolding, cross-cutting decisions). Package releases are recorded in each package's own `CHANGELOG.md`.

## [Unreleased]

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
