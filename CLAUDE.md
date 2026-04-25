# CLAUDE.md

Operational guide for Claude Code sessions in this repo. Keep it short, directive, current.

The canonical project brief — methodology, voice, engineering conventions, what NOT to do — lives in [`Lokomotif-Kit.md`](./Lokomotif-Kit.md). Read it. This file is for the things Claude needs to be effective day-to-day in this repo specifically.

## What this repo is

Lokomotif Kit — the open-source methodology core for Corporate AI Adoption. Reference implementation of **RTCSG** (Role · Task · Context · Style · Guardrail) and the Three-Horizon Adoption Journey, published by Lokomotif AI under Apache 2.0.

Status: **v0.1.0 shipped on 2026-04-25**. Eight `@lokomotif/*` packages on npm with Sigstore provenance, docs at <https://kit.lokomotif.ai>. Beyond v0.1.0 work is tracked in [`ROADMAP.md`](./ROADMAP.md). The phase ladder that produced v0.1.0 is closed in [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md).

## Read first

| Document                                                                   | When to consult                                                                   |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [`Lokomotif-Kit.md`](./Lokomotif-Kit.md)                                   | Engineering conventions, RTCSG rules, voice, what NOT to do                       |
| [`Lokomotif_AI_Positioning_Brief.md`](./Lokomotif_AI_Positioning_Brief.md) | Firm-level positioning. § 11 holds the retired-phrases list                       |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md)                                     | Module authoring workflow, PR checklist                                           |
| [`GOVERNANCE.md`](./GOVERNANCE.md)                                         | RFC process, decision authority, release cadence                                  |
| [`ROADMAP.md`](./ROADMAP.md)                                               | Beyond-v0.1.0 plan; what's deferred and why                                       |
| [`SECURITY.md`](./SECURITY.md)                                             | Disclosure policy                                                                 |
| [`docs/rfcs/`](./docs/rfcs/)                                               | Accepted RFCs (e.g., `0001-phase-6-partial-scope.md` on the two-pass module ship) |

## Stack — locked

- **Monorepo**: pnpm 9 workspaces + turborepo
- **TypeScript**: Node ≥ 20.10, strict mode, `verbatimModuleSyntax`, `noUncheckedIndexedAccess`. `exactOptionalPropertyTypes` is intentionally **disabled** — re-enabling it breaks `clipanion` integrations.
- **Python**: ≥ 3.12 with `uv`, `ruff`, `mypy --strict`
- **YAML**: 2-space indent, double quotes, no tabs. Frontmatter key order matters for readability — do not auto-sort.
- **Docs**: Nextra v3 on Next 14.2 (intentional pin — see "Pinned majors" below)
- **Release**: Changesets + Sigstore provenance via npm publish

Do not introduce Bun, Yarn, npm-as-pm, Poetry, Hatch, or alternative build tools without an RFC. See [`Lokomotif-Kit.md`](./Lokomotif-Kit.md) § _Stack_.

## Commands that work

```bash
# Install
corepack enable
pnpm install
cd packages/eval && uv sync && cd -

# Develop
pnpm dev                      # turbo dev across TS packages
pnpm build
pnpm test                     # vitest across workspace
pnpm lint                     # eslint
pnpm typecheck
pnpm validate:modules         # JSON Schema validation on modules/**/*.yaml
pnpm format                   # prettier --write .
pnpm format:check             # CI parity

# Eval harness (Python)
cd packages/eval
uv run pytest
uv run lokomotif-eval run                                # all eval suites
uv run lokomotif-eval run --module contexts/finance/kvkk-compliance
uv run lokomotif-eval scan-pii path/                     # Turkey-aware PII

# Release (Changesets)
pnpm changeset                # author a changeset for the PR
pnpm version-packages         # changesets/action runs this in CI
pnpm release                  # publish (CI only — needs NPM_TOKEN)

# Pre-commit
pre-commit install            # one-shot wiring (pre-commit + commit-msg)
pre-commit run --all-files
```

## Conventions enforced by tooling

- **Conventional Commits** — commitlint runs on `commit-msg`. Allowed types: `feat fix docs chore refactor test build ci perf style revert`.
- **Prettier** — runs in `pre-commit` (local hook calling `pnpm exec prettier --write --ignore-unknown`) AND in CI (`pnpm format:check`). Both must agree. If CI rejects formatting, run `pnpm format` and recommit.
- **Gitleaks + secret scan** — pre-commit blocks committed secrets.
- **Schema validation** — `pnpm validate:modules` walks `modules/**/*.yaml` and validates against `@lokomotif/schema`. This runs in CI. Fix the YAML, never weaken the schema for one module.
- **Eval requirement** — every module ships with at least one passing eval suite at `<kind>/<industry>/__tests__/<name>.eval.yaml`. Modules without evals cannot merge.
- **Voice gate** — docs CI scans for retired phrases per Brief § 11 (powerful, revolutionary, seamless, cutting-edge, intelligent, next-gen, AI-powered, game-changing). Do not hand-edit around it; rewrite.
- **DCO** — every commit needs `Signed-off-by:`. Use `git commit -s` or pre-author the trailer.

## What ships in v0.1.0 (concrete inventory)

The repo is **not** a methodology aspiration; it is a shipped artifact. When writing docs, READMEs, or examples, only reference what exists:

**Modules (3 Pass-1, public-sourced per RFC 0001):**

- `contexts/finance/kvkk-compliance`
- `styles/cross-industry/executive-board-brief`
- `guardrails/cross-industry/pii-tr`

**Pass-2 modules (`roles/finance/aml-analyst`, `tasks/general/structured-summary`) ship in v0.2.0** — not yet. Examples must use a placeholder like `roles/finance/your-role` with a comment that the user authors it. `compose()` throws `FlowError` if both role and task slots are empty, so every example flow needs at least one role or task.

**Packages (npm scope `@lokomotif`):** `schema · cli · sdk · otel-schema · blueprint-anthropic-sdk · blueprint-dify · blueprint-n8n · blueprint-langgraph`. The Python eval harness is `lokomotif-eval` (PyPI publish deferred to v0.2.0).

**Default model**: `claude-sonnet-4-6` across all blueprints.

## Pinned majors (do not bump without an RFC)

The docs site is pinned to **Nextra v3 / Next 14.2 / React 18**. Major bumps for `nextra`, `nextra-theme-docs`, `next`, `react`, `react-dom`, `@types/react*` are auto-ignored by Dependabot (see `.github/dependabot.yml`). The migration is tracked in `ROADMAP.md` Q3 2026 — operator-driven RFC. Reason: Nextra v3 is incompatible with Next 15+ and React 19; bumping any one of them in isolation breaks the build.

If a Dependabot PR for one of these majors arrives, close it with a comment pointing at ROADMAP.md.

## Operational gotchas (learned the hard way)

These are project-specific and not derivable from the code. They saved hours during the v0.1.0 ship and will save them again.

- **Release workflow needs `NODE_AUTH_TOKEN`.** `actions/setup-node` with `registry-url:` writes `.npmrc` referencing `${NODE_AUTH_TOKEN}` literally. Setting `NPM_TOKEN` alone produces `401 Unauthorized` on publish. The release workflow sets both: `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}` AND `NPM_TOKEN: ${{ secrets.NPM_TOKEN }}`.
- **npm Granular tokens need "Bypass 2FA"** for non-interactive `npm publish`. Without it, publish fails 401 even with a valid token.
- **Sigstore provenance** is enabled by `NPM_CONFIG_PROVENANCE: "true"` in the release env block plus `id-token: write` in job permissions plus `actions/upload-artifact` ≥ v4. All three are required.
- **Schema strict-mode + Ajv** — `$ref` combined with `minItems` violates Ajv strict mode. The `expertise` field uses an inline `type: array` with `minItems` directly. If you touch the schema, run `pnpm -F @lokomotif/schema test` and re-generate types: `pnpm -F @lokomotif/schema generate:types`.
- **Nextra v3 requires `_meta.ts`** (not `_meta.json`) and a custom `pages/_app.tsx`. The repo wires global CSS through `_app.tsx`.
- **Branch protection on `main`** requires admin bypass for direct push from local — most CI-side commits go through the protection. If a `git push origin main` fails with "Changes must be made through a pull request," the operator needs to add their account to the bypass list (Settings → Rules → Bypass list). This is intentional; do not weaken the rule.
- **Coverage thresholds** are conservative on purpose. If coverage drops, the SDK and CLI tests are the right place to add coverage — never lower the threshold to make CI green.
- **`pnpm-workspace.yaml`** lists `packages/*`, `blueprints/*`, `docs`. The `blueprints/*` glob exists alongside `packages/blueprint-*` because the original layout had two homes; the published packages live under `packages/blueprint-*`. Do not "consolidate" without an RFC — npm scope publishes from `packages/`.

## What NOT to do

The full list lives in [`Lokomotif-Kit.md`](./Lokomotif-Kit.md) § _What NOT to do_. The ones that come up most often:

- **Don't invent module content from thin air.** Modules must reflect real practice or named public sources (per RFC 0001). AI-generated plausibility breaks the methodology pillar.
- **Don't reference modules that don't exist.** When writing docs or examples, audit against the v0.1.0 inventory above. Aspirational module names go in ROADMAP, not in working examples.
- **Don't weaken validation, eval, or voice gates** to make CI green. Fix the input.
- **Don't bypass pre-commit hooks** (`--no-verify`). If a hook fails, fix the underlying issue.
- **Don't auto-merge Dependabot PRs blindly.** DevDep majors and Action majors need actual review. Close docs-stack majors per "Pinned majors" above.
- **Don't put vendor-specific code in `modules/`.** It belongs in `blueprints/`.
- **Don't hardcode model names in modules** — the runtime selects the model. `claude-sonnet-4-6` is set in blueprint code, not in YAML.

## Communication preferences (Claude Code session)

- **User-facing chat: Turkish.** Fatih and the Lokomotif team work in Turkish by default. Switch to English only if the user does.
- **Code, comments, commit messages, dev docs: English.** No mixing.
- **Module content: the language declared in the module's `languages` field** — TR + EN for canonical modules.
- **Plan before large changes.** Anything that spans 3+ files or touches the schema → propose a short plan and wait. Small edits → just do them.
- **Ask, don't guess** on schema design, Lokomotif voice, or Kit architecture. These decisions compound across hundreds of modules.
- **Co-author trailer**: commits made through Claude Code use `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`.

## Evolution

Update this file when:

- A new operational gotcha is learned (add to "Operational gotchas")
- A pinned dependency unblocks (remove from "Pinned majors" once the RFC lands)
- A convention shifts across 3+ PRs

Keep it under 250 lines. When it grows past that, split a section out into a doc under `docs/` or an RFC.

---

Last updated: 2026-04-25 · Owner: Lokomotif Core Team · License: Apache 2.0
