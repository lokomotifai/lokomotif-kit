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

## 12. Phase 8 — Vercel deploy + DNS

The docs site (`docs/`) is built and deployed to Vercel. One-time UI setup is required:

- ⬜ Create a Vercel project from the GitHub repo `lokomotif-ai/lokomotif-kit`.
- ⬜ Set **Root Directory** to `docs`.
- ⬜ Set **Framework Preset** to Next.js (auto-detected; verify).
- ⬜ The install/build/output commands are pre-configured in `docs/vercel.json`. Verify Vercel honors them.
- ⬜ Add the custom domain `kit.lokomotif.ai` and configure DNS:
  - CNAME record: `kit.lokomotif.ai` → `cname.vercel-dns.com.`
  - Confirm the TLS certificate provisions automatically.
- ⬜ Verify the first deploy goes green; confirm `https://kit.lokomotif.ai` resolves.
- ⬜ Confirm preview deploys are enabled for PRs and production deploys come from `main`.

After the site is live:

- ⬜ Update the GitHub repo's homepage field to `https://kit.lokomotif.ai`.
- ⬜ Reference the Kit on the Lokomotif AI website's open-source page (Section 8 above).

## 13. Phase 9 — community + release readiness

GitHub Discussions, label sync, and a release-ritual rehearsal land here. Most Phase 9 work is in code (commitlint, ROADMAP, RELEASING, labels.yml, sync workflow); the items below need the operator.

### Discussions

- ⬜ Enable GitHub Discussions on the repository (Settings → General → Features).
- ⬜ Configure Discussion categories: `Q&A`, `Show and Tell`, `Ideas`, `Announcements`. The default `General` can stay.
- ⬜ Pin a welcome post in `Q&A` linking to `CONTRIBUTING.md` and `kit.lokomotif.ai`.

### Labels

- ⬜ The first push to `main` after this commit triggers `.github/workflows/labels.yml` and applies the taxonomy in `.github/labels.yml`. Verify the workflow runs green and that the labels appear under Issues.
- ⬜ If the workflow fails on first run (e.g. requires elevated permission grant), re-run after the maintainer approves.

### Release ritual rehearsal

Per `RELEASING.md` § _Rehearsing the ritual_:

- ⬜ Open a small no-op PR with a changeset for one published package.
- ⬜ Merge it; wait for the Release workflow to open the version PR.
- ⬜ Merge the version PR.
- ⬜ Verify the tag is created on `main`, the package publishes to npm, the provenance attestation is verifiable (`npm view @lokomotif/<pkg>@<version> --json | jq .dist.attestations`), and the GitHub Release renders the changelog entry.
- ⬜ If anything is wrong, rotate `NPM_TOKEN` and address the issue before v0.1.0.

### Komünite channel

Per Brief § 13: Komünite stays uninstrumented. The dedicated `#lokomotif-kit` channel (or named equivalent) is for community health, not pipeline.

- ⬜ Create the channel inside Komünite.
- ⬜ Designate a Komünite host (not the Lead Maintainer if Lokomotif Core wants explicit separation between firm-side and Kit-side).
- ⬜ Document explicitly that the channel is not instrumented (no bot tracking, no analytics).

## 14. Phase 10 — launch (v0.1.0)

The full launch protocol lives in [`LAUNCH.md`](./LAUNCH.md). The checklist below mirrors that file and is the single tracking surface on launch day. Tick items in order.

### Pre-launch hardening

- ⬜ Run `node scripts/pin-actions.mjs` (with `GITHUB_TOKEN` exported); review and commit the SHA-pinned workflow files.
- ⬜ Trigger `.github/workflows/scorecards.yml` via workflow_dispatch; verify the OpenSSF Scorecard score on `https://scorecard.dev/viewer/?uri=github.com/lokomotif-ai/lokomotif-kit` is **≥ 7**. Address any flagged checks before launch.
- ⬜ Confirm README badges render on github.com (CI, CodeQL, Scorecard, License, Docs).
- ⬜ Lead Maintainer reviews `README.md`, `docs/pages/index.mdx`, and the Insights post draft in `LAUNCH.md` § 5 for voice fidelity.

### Verify Phase 0–9 operator items

The launch is gated on the earlier sections of this file. Re-confirm every section is ✅:

- ⬜ § 1 — local lockfiles + pre-commit + first CI green.
- ⬜ § 2 — GitHub repo configuration + Discussions enabled.
- ⬜ § 3 — npm scope claimed + `NPM_TOKEN` in secrets + Sigstore provenance enabled.
- ⬜ § 4 — secrets in repo settings.
- ⬜ § 5 — Vercel project + DNS + `https://kit.lokomotif.ai` resolves.
- ⬜ § 9 — Phase 6 Pass 2 status documented (Pass 1 ships in v0.1.0; Pass 2 still tracked here for v0.2.0).
- ⬜ § 10 — pre-commit PII hook activated.
- ⬜ § 11 — every blueprint has had one manual end-to-end run.
- ⬜ § 12 — docs site live and current.
- ⬜ § 13 — Discussions categories + label sync first run + release rehearsal on a `0.0.x` tag + Komünite channel created.

### Release sequence

Per `RELEASING.md` and `LAUNCH.md` § 3:

- ⬜ Author the v0.1.0 changeset on a release branch (`pnpm changeset`, select all eight published packages, **minor** bump, body from `LAUNCH.md` § 4).
- ⬜ Open and merge the changeset PR.
- ⬜ Review and merge the auto-opened `chore: version packages` PR.
- ⬜ Verify each of eight published packages on npm at `0.1.0` with provenance attestations.
- ⬜ Verify GitHub Releases rendered for each tag.

### Launch artifacts

In order; each cross-references the previous so the press cycle reads as one coordinated release.

- ⬜ Publish the Insights post (`LAUNCH.md` § 5) on `lokomotif.ai/insights`.
- ⬜ Publish the Anthropic Ambassador announcement (`LAUNCH.md` § 6) to the Ambassador channel.
- ⬜ Schedule and run the Komünite Space launch event (`LAUNCH.md` § 7); upload the recording to `kit.lokomotif.ai/talks/launch-walkthrough` once the talks section is added to docs.
- ⬜ Reference the Kit on the Lokomotif AI website's Insights / Open Source page.

### Post-launch verification

- ⬜ 24-hour monitoring per `LAUNCH.md` § 8 (CI runs, npm publishes, Vercel builds, security inbox).
- ⬜ Open a roadmap issue for v0.2.0 (Pass 2 modules + first sector library).
- ⬜ Update `IMPLEMENTATION_PLAN.md` to note "v0.1.0 shipped on YYYY-MM-DD" via a `docs:` commit (substantive scope changes go through RFC 0002).
- ⬜ Archive completed sections of this file under a `## Done` heading once they are fully ticked.

---

## How this file is maintained

- Add items as they are discovered; do not batch silently into untracked memory.
- Tick items as they are completed; do not delete completed items until the next phase boundary so the audit trail stays in place.
- When all items in a section are ✅, the section may be archived under a `## Done` heading at the bottom of the file.
- This file is _not_ public-facing copy. It is operational. Voice rules do not apply with the same severity.
