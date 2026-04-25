# Lokomotif Kit — Implementation Plan

**Version:** 1.1
**Status:** ✅ SHIPPED — v0.1.0 on 2026-04-25
**Owner:** Fatih Güner (Lead Maintainer)
**Effective:** 2026-04-25 (v1.1 amendment 2026-04-25)

> v0.1.0 shipped on 2026-04-25 — eight @lokomotif/* packages on npm with Sigstore provenance, eight GitHub releases, docs site live at kit.lokomotif.ai. Phases 0–10 all closed. Beyond v0.1.0, see [`ROADMAP.md`](./ROADMAP.md).
>
> v1.1 changes Phase 6 from a five-module ship to a two-pass ship: three public-sourced modules now (Pass 1) and two engagement-derived modules later (Pass 2). See `docs/rfcs/0001-phase-6-partial-scope.md`.

> This is a locked planning artifact. Changes require an RFC and Lead Maintainer approval. The plan exists to keep the build coherent across phases — not to be revised every sprint. See § 9 for the change procedure.

---

## 1. Frame

Lokomotif Kit is the open-source methodology core of the Lokomotif AI stack. It is the public foundation for **RTCSG** and the **Three-Horizon Adoption Journey**. The internal Workbench and the optional managed Control Plane sit on top of it.

Two source documents bound this plan:

- [`Lokomotif-Kit.md`](Lokomotif-Kit.md) — engineering conventions, stack, voice rules, what NOT to do.
- [`Lokomotif_AI_Positioning_Brief.md`](Lokomotif_AI_Positioning_Brief.md) — strategic frame, voice principles, phrases to retire, category claim.

Both documents take precedence over this plan when there is conflict. This plan operationalizes them; it does not extend or override them.

---

## 2. Locked decisions (v1.0)

| #   | Decision                                  | Value                                                                                                           |
| --- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1   | Versioning tool                           | Changesets                                                                                                      |
| 2   | Docs domain                               | `kit.lokomotif.ai`                                                                                              |
| 3   | NPM scope                                 | `@lokomotif/*` (claimed by the Lead Maintainer before Phase 3 publishes)                                        |
| 4   | Lead Maintainer                           | Fatih Güner                                                                                                     |
| 5   | Security contact                          | `kit@lokomotif.ai`                                                                                              |
| 6   | First canonical modules — source material | **Partial.** Pass 1 resolved via public sources (RFC 0001). Pass 2 still pending engagement artifacts. See § 3. |
| 7   | README tagline                            | Lead Maintainer-approved (Phase 0 deliverable)                                                                  |
| 8   | Phase cadence                             | Sequential. Parallelization allowed within explicit phases.                                                     |

---

## 3. Open question 6 — explained

The Brief and `Lokomotif-Kit.md` both forbid generating module content "from thin air." A module is a methodology artifact — it must reflect actual Lokomotif practice. Otherwise the Kit becomes AI-generated plausibility, and the methodology-led pillar collapses on contact with a serious enterprise reviewer.

**What "kaynak materyal" means concretely.**

When we author the first canonical module — for example, `roles/finance/aml-analyst` — we need at least one of:

- An anonymized prompt Lokomotif used inside a real fintech engagement.
- A redacted task brief from a Workflow Rewire delivery.
- A documented role definition from a client-facing playbook.
- An anonymized governance or guardrail spec from a delivered system.

The artifact need not be polished. It needs to be **real**. From it we extract the role identity, task structure, and constraints. The published module is then a generalized, anonymized derivative.

This is explicitly required in `Lokomotif-Kit.md` § _Communication preferences_:

> Never invent module content from thin air. If asked to create a finance AML role and no source material exists, ask for the reference prompt or engagement artifact to adapt. Modules should reflect real Lokomotif practice, not AI-generated plausibility.

**Decision deadline.** Before Phase 6 begins. Phases 0–5 do not depend on this resolution.

---

## 4. Phase ladder

The build is partitioned into eleven phases (0–10). Each phase has a definition, deliverables, exit criteria, and dependencies. A phase is complete when (a) all deliverables ship, (b) CI for the phase is green, and (c) the Lead Maintainer signs off.

### Phase 0 — Repository Foundation

**Goal.** Make the repo respectable on first contact. No engineer or enterprise reviewer should hesitate to evaluate it because of missing baseline artifacts.

**Deliverables:**

- `LICENSE` (Apache 2.0), `NOTICE`
- `README.md` (English, primary), `README.tr.md` (Turkish, native — not translated)
- `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1)
- `CONTRIBUTING.md`
- `SECURITY.md`
- `GOVERNANCE.md`
- `CHANGELOG.md`
- `.gitignore`, `.editorconfig`, `.nvmrc`, `.python-version`
- `.yamllint.yaml`
- `.pre-commit-config.yaml`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/CODEOWNERS`
- `.github/dependabot.yml`
- `.github/ISSUE_TEMPLATE/{config,bug_report,feature_request,rfc_proposal,module_proposal}.yml|yaml`

**Exit criteria:**

- All files ship and pass voice review (no retired phrases per Brief § 11).
- A new contributor can clone the repo and read every governance surface in under 15 minutes.
- Pre-commit installs and runs without error.

**Dependencies.** None. This is the entry phase.

### Phase 1 — Monorepo Skeleton & Toolchain

**Goal.** A workspace that builds, tests, and gates quality on every PR. CI green on day one, even with zero packages.

**Deliverables:**

- `package.json` (root, private, `@lokomotif/kit-monorepo`)
- `pnpm-workspace.yaml`
- `turbo.json`
- `tsconfig.base.json`
- `eslint.config.mjs` (flat config)
- `.prettierrc`, `.prettierignore`
- `.changeset/config.json`, `.changeset/README.md`
- `packages/eval/` scaffold:
  - `pyproject.toml`
  - `.python-version`
  - `README.md`
  - `src/lokomotif_eval/__init__.py`
  - `tests/test_smoke.py`
- `.github/workflows/ci.yml` (TypeScript + Python jobs)
- `.github/workflows/release.yml` (Changesets, with Sigstore provenance)
- `.github/workflows/codeql.yml`
- `.github/workflows/scorecards.yml`

**Exit criteria:**

- `pnpm install` and `cd packages/eval && uv sync` succeed locally; lockfiles committed.
- All workflows green on first push.
- OpenSSF Scorecard returns a baseline (≥ 5; the goal is ≥ 7 by Phase 10).
- Pre-commit hooks active; `pre-commit run --all-files` clean.

**Dependencies.** Phase 0.

### Phase 2 — Schema (`packages/schema`)

**Goal.** The contract every module conforms to. The single highest-leverage code in the repo.

**Deliverables:**

- `packages/schema/` package.
- JSON Schemas: `module.common`, `role`, `task`, `context`, `style`, `guardrail`.
- TypeScript type generation (json-schema-to-typescript).
- Python dataclass generation (datamodel-code-generator) → emitted to `packages/eval/src/lokomotif_schema/`.
- `validate(module): Result<Module, ValidationError[]>` API.
- Industry taxonomy enum (`Lokomotif-Kit.md` § _Industry taxonomy_, 15 sectors).
- Vitest unit tests with valid + invalid fixtures.

**Exit criteria:**

- Round-trip: edit schema → regenerate TS + Python types → tests pass.
- Invalid example modules fail with actionable, line-pointed errors.
- Valid example modules of every kind pass.

**Dependencies.** Phase 1.

### Phase 3 — CLI MVP (`packages/cli`)

**Goal.** The first dış izlenim. `npx @lokomotif/cli` works end-to-end on the canonical modules.

**Deliverables:**

- `packages/cli/`, published as `@lokomotif/cli`.
- Subcommands: `modules list`, `modules validate`, `modules new`, `compose`, `eval run`, `deploy`.
- `--json` mode on every command.
- Smoke tests via `execa` + fixtures.
- npm publish via Changesets, with Sigstore provenance attestations.

**Exit criteria:**

- `npx @lokomotif/cli modules list` works in an empty directory (returns informational message).
- `lokomotif modules new role finance/aml-analyst` scaffolds a valid module.
- Provenance attestations verifiable on the published artifact.

**Dependencies.** Phase 2.

### Phase 4 — SDK (`packages/sdk`) and OTel Schema (`packages/otel-schema`)

**Goal.** A composable runtime-agnostic library, plus the observability spine.

**Deliverables:**

- `packages/sdk/` — `composeFlow`, `loadModule`, `loadFlow`. **No vendor adapters here.**
- `packages/otel-schema/` — OpenTelemetry semantic conventions YAML + TS constants (`lokomotif.module.id`, `lokomotif.module.kind`, `lokomotif.flow.composition_hash`, `lokomotif.eval.score`).

**Exit criteria:**

- SDK has no runtime imports of vendor SDKs (CI grep enforces).
- Composing a flow from canonical modules produces a deterministic, testable string.
- OTel attributes documented and importable.

**Dependencies.** Phase 2.

### Phase 5 — Eval Harness (`packages/eval`)

**Goal.** Eval gating shipping before the first module. CLAUDE.md prohibits modules without eval tests; the harness must exist first.

**Deliverables:**

- Runner: `lokomotif_eval.runner` invoked by `lokomotif eval run`.
- Judges: deterministic (regex/structural) + `LLMJudge` interface with model-agnostic adapters.
- Schema dataclasses (auto-generated from Phase 2).
- Coverage ≥ 90% on the harness code itself.
- `golden/` directory wired with PII detector (placeholder until Phase 6 ships `guardrails/pii-tr`).

**Exit criteria:**

- Eval suite runs in CI within 5 minutes for the canonical modules.
- LLM judge adapter has at least one open-source-friendly local fallback for CI without API keys.

**Dependencies.** Phase 2.

### Phase 6 — First Canonical Modules (two-pass ship per RFC 0001)

**Goal.** Reference modules that establish the standard for everything downstream. Shipped in two passes so Phases 7–10 are not blocked on engagement-artifact availability.

#### Pass 1 — public-sourced modules (shipped in v1.1)

Three modules, each grounded in real, citable, public sources:

- `modules/guardrails/cross-industry/pii-tr.yaml` — KVKK 6698, MASAK Tebliğ, ISO 13616, NVI TC Kimlik formatı.
- `modules/contexts/finance/kvkk-compliance.yaml` — KVKK 6698 Md. 4–9, BDDK 2020 Bilgi Sistemleri Yönetmeliği.
- `modules/styles/cross-industry/executive-board-brief.yaml` — `Lokomotif_AI_Positioning_Brief.md` § 10 + § 11.

Each module ships with bilingual body, eval suite under `__tests__/`, and a `source_reference` field carrying the citation.

#### Pass 2 — engagement-derived modules (deferred)

Activated when the Lead Maintainer provides anonymized engagement artifacts:

- `modules/roles/finance/aml-analyst.yaml`
- `modules/tasks/general/structured-summary.yaml`

Pass 2 is tracked in `OPERATOR_TASKS.md` § _Phase 6 Pass 2_ so the dependency does not get lost.

**Exit criteria:**

- Pass 1: every module passes schema validation and at least one eval test; voice review by Lead Maintainer.
- Pass 2: same bar; the missing two modules are added to `modules/`.
- `guardrails/cross-industry/pii-tr` replaces the placeholder PII checker in pre-commit (operator step in `OPERATOR_TASKS.md`).

**Dependencies.** Phase 5. Pass 1 starts immediately; Pass 2 unblocks when Decision 6 is fully resolved.

### Phase 7 — Blueprints (parallel with Phases 6 and 8)

**Goal.** Prove the modules run on real runtimes. Vendor-specific code lives only here.

**Deliverables:**

- `blueprints/anthropic-sdk/` (first — frontier partnership pillar).
- `blueprints/dify/`
- `blueprints/n8n/`
- `blueprints/langgraph/`
- Each: README, smoke test, end-to-end example using a canonical module.

**Exit criteria:**

- Each blueprint's smoke test runs in CI without external API calls (mocked).
- One end-to-end manual run logged per blueprint before launch.

**Dependencies.** Phase 6.

### Phase 8 — Documentation Site (Nextra)

**Goal.** `kit.lokomotif.ai` shipping. The site is the category-construction surface.

**Deliverables:**

- `docs/` Nextra source.
- Sections: Getting Started · The Method · Module Authoring · CLI Reference · SDK Reference · Eval Harness · Blueprints · RFC Index · Glossary.
- TR + EN parallel builds. **No autotranslation.**
- Voice gate: lint for retired phrases.
- Hosting on Cloudflare Pages or Vercel; DNS to `kit.lokomotif.ai`.

**Exit criteria:**

- Site live at the locked domain.
- Every public package has a reference entry.
- Glossary mirrors Brief § 11 vocabulary verbatim.

**Dependencies.** Phases 3, 4, 5.

### Phase 9 — Community & Release Hygiene

**Goal.** The project behaves like a v1-era open-source project, not a side experiment.

**Deliverables:**

- GitHub Discussions enabled with categories.
- Issue triage labels.
- `commitlint` + commit message hook enforcing Conventional Commits.
- `ROADMAP.md` with a quarterly horizon.
- Release rituals documented (Changesets, version PRs, tags).
- Optional: dedicated `#lokomotif-kit` channel inside Komünite. (**Komünite remains uninstrumented.**)

**Exit criteria:**

- First external contributor can land a PR without maintainer hand-holding through the docs.
- Release ritual rehearsed once on a `0.x` tag.

**Dependencies.** Phases 3–8.

### Phase 10 — Launch Preparation

**Goal.** v0.1.0 — public launch.

**Deliverables:**

- All workflows pinned to action SHAs.
- OpenSSF Scorecard score ≥ 7.
- README enterprise-buyer-grade (Lead Maintainer voice review).
- Launch artifacts:
  - Insights post on lokomotif.ai (Brief § 13, Tier 2).
  - Anthropic Ambassador channel announcement.
  - Komünite Space launch event (Brief § 13, Engine 1).
- v0.1.0 changeset and tag.

**Exit criteria:**

- Release ships from `main` after green CI.
- Public announcement coincides with site live and CLI installable from npm.

**Dependencies.** Phases 0–9.

---

## 5. Cross-cutting disciplines

These apply to every PR in every phase.

- **Voice review.** No retired phrases (Brief § 11). Voice gate runs in CI and PR review.
- **Privacy review.** gitleaks + PII detector + manual scan on PRs that touch examples or fixtures.
- **Bilingual parity.** Material additions in one language without the other surface a soft warning (CI annotation); 30-day delay turns it into a hard fail.
- **Schema RFC.** Any change to JSON schemas or industry taxonomy → RFC required. Major bumps include a written migration guide.
- **No vendor lock-in drift.** Hardcoded model names or vendor APIs in `modules/` → CI fail. Adapters belong in `blueprints/`.
- **One concern per module.** Enforced by review, supported by linter heuristics where feasible.
- **Conventional Commits + DCO.** All commits signed off (`git commit -s`).

---

## 6. Pre-flight after Phase 1 ships

Once Phase 1 files are in place and committed, the Lead Maintainer must:

1. Run `pnpm install` locally; commit `pnpm-lock.yaml`.
2. Run `cd packages/eval && uv sync`; commit `packages/eval/uv.lock`.
3. Run `pre-commit install` to wire git hooks.
4. Push to `main`. Confirm all four workflows go green.
5. Claim the `@lokomotif` npm scope (Decision 3) and store `NPM_TOKEN` in repo secrets.
6. Verify branch protection on `main`: 1+ approval, status checks required (CI, CodeQL, Scorecard), force-push disabled.

---

## 7. Risks and mitigations

| Risk                                          | Likelihood | Impact | Mitigation                                                                                  |
| --------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------- |
| Schema design churn after Phase 2             | High       | High   | RFC discipline; major-bump tolerance pre-1.0.                                               |
| Eval harness slow → contributors skip locally | Medium     | Medium | Coverage budget on harness itself; CI-only deep eval where needed.                          |
| Voice drift in docs over time                 | Medium     | High   | Lint for retired phrases; voice review in PR template.                                      |
| Komünite confused with marketing channel      | Low        | Severe | Brief § 13 quoted in `GOVERNANCE.md` and `CONTRIBUTING.md`. Komünite uninstrumented.        |
| Module content invented "from thin air"       | Medium     | Severe | Module Proposal template requires anonymized source-material reference. PR review enforces. |
| Vendor lock-in creeping into modules          | Medium     | High   | CI grep for vendor strings in `modules/`. Blueprint isolation reviewed.                     |

---

## 8. Out of scope (v1.0 of the plan)

Explicitly not part of this plan; revisit after launch:

- An RTCSG platform product (Brief § 07, Year 3).
- Outcome-linked pricing infrastructure (Brief § 09 — that is a Lokomotif AI commercial decision, not a Kit decision).
- Hosted Workbench or Control Plane (separate repos).
- Annual category report (Brief § 16 — open at the firm level).
- International language additions beyond TR and EN.

---

## 9. How this plan changes

A change to this plan requires:

1. An RFC opened with the `RFC` issue template, referencing the affected section.
2. Lead Maintainer review and `accepted` mark within 14 days.
3. PR that updates this file and increments the version (1.0 → 1.1 for additions, 2.0 for restructures).

The plan's version is independent of any package's version.

---

> **A category is not declared. It is occupied. The Kit is one of the surfaces that occupies it.**
