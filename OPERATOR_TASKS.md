# Operator Tasks — Deferred Manual Setup

This file tracks setup actions that cannot be automated from inside the repository — registry claims, secrets, branch protection, hosting, third-party accounts. Items are added as we build; they are executed in batch at the end of the implementation plan.

**Owner:** Lead Maintainer (Fatih Güner)
**Status legend:** ⬜ pending · ✅ done · ⏸ blocked

---

## 1. After Phase 1 ships (local + CI bring-up)

- ⬜ Run `pnpm install` locally; commit the resulting `pnpm-lock.yaml`.
- ⬜ Run `cd packages/eval && uv sync`; commit the resulting `packages/eval/uv.lock`.
- ⬜ Run `pre-commit install` to wire git hooks.
- ⬜ Push the seeded branch and confirm all four GitHub Actions workflows go green:
  - CI (TypeScript + Python)
  - Release (no-op until first changeset lands)
  - CodeQL
  - OpenSSF Scorecard

## 2. GitHub repository configuration

- ⬜ Create the repository under the `lokomotif-ai` (or chosen) GitHub organization.
- ⬜ Set repository description: _"The open-source methodology core for Corporate AI Adoption."_
- ⬜ Set repository homepage: `https://kit.lokomotif.ai`
- ⬜ Set topics: `rtcsg`, `ai-adoption`, `methodology`, `open-source`, `turkey`, `agentic-ai`.
- ⬜ Enable GitHub Discussions.
- ⬜ Enable Issues.
- ⬜ Enable Dependabot security updates.
- ⬜ Configure branch protection on `main`:
  - Require pull request before merging
  - Require at least 1 approving review
  - Require status checks: CI, CodeQL, Scorecard
  - Require linear history
  - Require signed commits (DCO via `Signed-off-by`)
  - Disallow force pushes
  - Disallow deletions

## 3. NPM registry

- ⬜ Claim the `@lokomotif` scope on npm.
- ⬜ Configure `@lokomotif` as an npm organization with at least the Lead Maintainer as owner.
- ⬜ Generate an npm automation token with publish rights for the scope.
- ⬜ Add the token as `NPM_TOKEN` in GitHub repository secrets.
- ⬜ Verify Sigstore provenance is enabled at the org level (`enabled` on the publishing settings page).

## 4. Secrets and tokens (GitHub repository secrets)

- ⬜ `NPM_TOKEN` — npm publish token (Phase 3 release).
- ⬜ `SCORECARD_TOKEN` — optional, only if pinning to a fine-grained PAT for OpenSSF Scorecard publish.

## 5. DNS and hosting (Phase 8)

- ⬜ Provision a hosting account for the docs site (Cloudflare Pages or Vercel — decision by Phase 8 start).
- ⬜ Configure DNS for `kit.lokomotif.ai` → docs hosting target.
- ⬜ Configure HTTPS / TLS certificate.
- ⬜ Set up redirects: bare domain → `kit.lokomotif.ai` if applicable.
- ⬜ Add the hosting deploy hook as `DOCS_DEPLOY_HOOK` in repo secrets if needed.

## 6. Pre-launch hardening (Phase 10)

- ⬜ SHA-pin every GitHub Action reference. Replace `@v4` style tags with full commit SHAs.
- ⬜ Enable required GitHub branch protection bypass logging.
- ⬜ Verify OpenSSF Scorecard score is ≥ 7. Address any flagged checks.
- ⬜ Add a `funding.yml` if Lokomotif AI decides to accept sponsorship for the Kit.

## 7. Communication channels

- ⬜ Create a dedicated Komünite channel (`#lokomotif-kit` or named equivalent) — community health remit only, no instrumentation. See Brief § 13 and `GOVERNANCE.md`.
- ⬜ Create a `kit@lokomotif.ai` group / inbox monitored by the Lead Maintainer.
- ⬜ Create the `hello@lokomotif.ai` escalation alias if not already in place.

## 8. External account links

- ⬜ Link the repository on `lokomotif.ai` (Insights/Open Source page when the section ships).
- ⬜ Reference the Kit in the Anthropic Ambassador profile if appropriate.
- ⬜ Add the Kit to the Lokomotif AI organizational README on GitHub.

## 9. Phase 6 Pass 2 — engagement-derived modules

Pass 1 (Phase 6) shipped three public-sourced modules in v1.1 of the implementation plan. Pass 2 still requires anonymized Lokomotif practice artifacts. See `docs/rfcs/0001-phase-6-partial-scope.md`.

- ⬜ Source an anonymized AML engagement artifact (prompt / role definition / task brief) and author `modules/roles/finance/aml-analyst.yaml` + eval suite.
- ⬜ Source a redacted task brief from a Lokomotif Workflow Rewire delivery and author `modules/tasks/general/structured-summary.yaml` + eval suite.
- ⬜ When both Pass 2 modules ship, mark Decision #6 in `IMPLEMENTATION_PLAN.md` as fully resolved.

## 10. Pre-commit PII hook activation

The canonical PII detector (`guardrails/cross-industry/pii-tr`) shipped in Phase 6 Pass 1. The pre-commit hook still needs operator activation:

- ⬜ Run `cd packages/eval && uv sync` (covered by Section 1).
- ⬜ Add a local pre-commit hook that runs `uv run lokomotif-eval scan-pii modules/` on every commit (or another scope decided by the Lead Maintainer).
- ⬜ Verify the hook fails the commit when a PII candidate is introduced into a tracked file.

## 11. Phase 7 — blueprint end-to-end manual runs

Each blueprint ships with a mocked smoke test in CI. Per the Phase 7 exit criteria, one manual end-to-end run per blueprint is required before launch (Phase 10):

- ⬜ `anthropic-sdk` — set `ANTHROPIC_API_KEY`, compose a Pass 1 flow, send to Anthropic, log the response and the recorded `composition_hash`.
- ⬜ `dify` — generate a workflow YAML, import into a Dify project, run with sample input.
- ⬜ `n8n` — generate a workflow JSON, import into n8n, run with sample input.
- ⬜ `langgraph` — wire a real LLM callback (Anthropic or other), compile the graph, invoke with sample input.

Capture log excerpts and screenshots per run; they feed the launch announcement (Brief § 13) as proof points.

---

## How this file is maintained

- Add items as they are discovered; do not batch silently into untracked memory.
- Tick items as they are completed; do not delete completed items until the next phase boundary so the audit trail stays in place.
- When all items in a section are ✅, the section may be archived under a `## Done` heading at the bottom of the file.
- This file is _not_ public-facing copy. It is operational. Voice rules do not apply with the same severity.
