# LAUNCH — v0.1.0

The launch protocol for the first public release of Lokomotif Kit. This file is the operator's runbook on launch day. It captures the pre-launch verification, the release sequence, and the three launch artifacts (Insights post, Anthropic Ambassador announcement, Komünite Space event brief).

This file is operational. It is read once per launch. After v0.1.0 ships, update the date and version block; keep the artifact drafts as templates for the next major release.

---

## 1. Overview

**What ships:** Lokomotif Kit v0.1.0 — eight published packages, three canonical modules, four runtime blueprints, the docs site at `kit.lokomotif.ai`, and one accepted RFC. The methodology in code.

**Audiences for each artifact:**

| Artifact | Audience | Channel |
|---|---|---|
| Insights post | LOB leaders, executive sponsors | `lokomotif.ai/insights` (Tier 2 cadence per Brief § 13) |
| Anthropic Ambassador post | Anthropic ecosystem, builders | Anthropic Ambassador channel + Anthropic-aligned community feeds |
| Komünite Space event | Practitioners, contributors | Live at Komünite Space + recording to `kit.lokomotif.ai` |

**Success looks like:**

- v0.1.0 tag on `main`; eight packages on npm with provenance attestations.
- `kit.lokomotif.ai` resolves with full content; OpenSSF Scorecard ≥ 7.
- One press cycle: Insights post live, Anthropic Ambassador post live, Komünite Space event run, recording published.
- First external visitor can install, scaffold, and run an eval using only the docs.

---

## 2. Pre-launch checklist

Execute in order. Any unchecked item blocks launch.

### Code and infrastructure

- ⬜ All Phase 0–9 deliverables shipped (`git log --oneline` shows every phase commit).
- ⬜ `OPERATOR_TASKS.md` § 1 (lockfiles, secrets, branch protection) complete.
- ⬜ `OPERATOR_TASKS.md` § 2 (GitHub repo configuration) complete; Discussions enabled with categories.
- ⬜ `OPERATOR_TASKS.md` § 3 (npm scope + token) complete; `NPM_TOKEN` in repo secrets.
- ⬜ `OPERATOR_TASKS.md` § 5 (Vercel project + DNS) complete; `https://kit.lokomotif.ai` resolves.
- ⬜ `OPERATOR_TASKS.md` § 13 (release rehearsal on a `0.0.x` tag) complete; rehearsal published an artifact, attested provenance verified, GitHub Release rendered.
- ⬜ `pnpm typecheck && pnpm lint && pnpm test && pnpm validate:modules` green on `main`.
- ⬜ `pnpm -F @lokomotif/docs voice-gate` green.
- ⬜ Every blueprint has had one manual end-to-end run (`OPERATOR_TASKS.md` § 11).

### Hardening

- ⬜ All GitHub Actions pinned to commit SHAs. Run `node scripts/pin-actions.mjs` (with `GITHUB_TOKEN` exported) to update the workflows; review the diff and commit.
- ⬜ OpenSSF Scorecard score on `main` ≥ 7. The score is visible at `https://scorecard.dev/viewer/?uri=github.com/lokomotifai/lokomotif-kit` after the first scheduled or workflow-dispatch run.
- ⬜ README badges render correctly on github.com (CI green, CodeQL green, Scorecard ≥ 7).

### Voice review

- ⬜ Lead Maintainer rereads `README.md`, `docs/pages/index.mdx`, and the Insights post draft below for voice fidelity (Brief § 10–11). No retired phrases. No parity copy.

---

## 3. Release sequence

When the pre-launch checklist is fully ticked, run the sequence below in one sitting. Estimated wall time: 60–90 minutes.

### Step 1 — Author the v0.1.0 changeset

```bash
pnpm changeset
```

Select all eight published packages. Bump type: **minor** (0.0.0 → 0.1.0). Use the release-notes draft from § 4 below as the changeset body.

Commit the resulting `.changeset/<slug>.md` on a release branch:

```bash
git checkout -b release/v0.1.0
git add .changeset/
git commit -m "chore(release): v0.1.0 changeset" -s
```

Open a PR; merge after CI green.

### Step 2 — Merge the version PR

The Release workflow opens `chore: version packages` on the next push to `main`. Review the diff:

- Each package's `CHANGELOG.md` updated.
- Each package's version bumped to `0.1.0`.
- The changeset in `.changeset/` consumed.

Merge the version PR.

### Step 3 — Verify publishing

The Release workflow runs again on the merge of the version PR. Watch the workflow logs and verify, per package:

- Tag created on `main` (`@lokomotif/cli@0.1.0`, etc.).
- npm version visible: `npm view @lokomotif/cli version` returns `0.1.0`.
- Provenance attestation present:

  ```bash
  npm view @lokomotif/cli@0.1.0 --json | jq .dist.attestations
  ```

- GitHub Release rendered with the changelog entry.

### Step 4 — Confirm the docs site is current

Visit `https://kit.lokomotif.ai`. Verify:

- The `Status` line on the landing page reflects v0.1.0.
- Cross-links to GitHub resolve to `main`.
- The Glossary page is intact.

If the docs site shows a stale build, redeploy via the Vercel UI.

### Step 5 — Publish the launch artifacts

In the order below — each cross-references the previous so they read as one coordinated release.

1. **Insights post** — publish on `lokomotif.ai/insights`. See § 5.
2. **Anthropic Ambassador post** — publish to the Anthropic Ambassador channel. See § 6.
3. **Komünite Space event** — schedule for the same week; publicize in Komünite. See § 7.

### Step 6 — Update the tracker

After every artifact is live:

- Tick `OPERATOR_TASKS.md` § 14 items.
- Move IMPLEMENTATION_PLAN.md status to "v0.1.0 shipped on YYYY-MM-DD" in a follow-up commit (RFC 0002 if substantive scope changes, otherwise a `docs:` commit).
- Open a `roadmap` issue for v0.2.0 (Q3 2026 — Pass 2 modules and the first sector library).

---

## 4. v0.1.0 release notes (changeset body)

> Use the text below as the changeset body when running `pnpm changeset` in Step 1.

---

**Lokomotif Kit v0.1.0 — first public release.**

The methodology, in code. RTCSG and the Three-Horizon Adoption Journey, packaged as schemas, a CLI, an SDK, an eval harness, four runtime blueprints, and a documentation site at `kit.lokomotif.ai`.

### What's in this release

**Schema and contracts**
- `@lokomotif/schema` — JSON Schema for every RTCSG kind, with TypeScript types and a Result-returning `validate()`.
- `@lokomotif/otel-schema` — OpenTelemetry semantic conventions for module, flow, compose, and eval attributes.

**Tools**
- `@lokomotif/cli` — `lokomotif` binary: `modules list / validate / new`, `compose`, `eval run`, `deploy`.
- `@lokomotif/sdk` — runtime-agnostic composition library (zero vendor SDK dependencies).

**Eval harness**
- `lokomotif-eval` (Python) — JSON Pointer targets, deterministic + LLM-judged checks, a stub LLM judge for CI without API keys.

**Runtime blueprints**
- `@lokomotif/blueprint-anthropic-sdk`
- `@lokomotif/blueprint-dify`
- `@lokomotif/blueprint-n8n`
- `@lokomotif/blueprint-langgraph`

**Canonical modules (Pass 1, public-sourced per RFC 0001)**
- `guardrails/cross-industry/pii-tr` — KVKK-aware PII guardrail.
- `contexts/finance/kvkk-compliance` — KVKK + BDDK fintech context.
- `styles/cross-industry/executive-board-brief` — Lokomotif executive voice.

**Documentation**
- `kit.lokomotif.ai` (Nextra, deployed to Vercel) — EN canonical with TR priority pages; voice gate against Brief § 11 retired phrases.

### Status

Pre-1.0. The schema, CLI commands, and SDK surface may evolve before v1.0.0 via RFC. Pass 2 modules (`roles/finance/aml-analyst`, `tasks/general/structured-summary`) ship in v0.2.0 once engagement artifacts are available.

### License

Apache 2.0.

---

## 5. Insights post draft

> Target: `lokomotif.ai/insights`. Tier 2 (Brief § 13). ~500 words. Methodology-led. No retired phrases.

**Title:** _Lokomotif Kit: the methodology, in code_

---

For two years, the most common question we got from clients went something like this: _can you write down what you do?_

We could. We did. RTCSG, the AI Maturity Spectrum, the Three-Horizon Adoption Journey — these are the frames every Lokomotif engagement runs on. They were named, taught, and applied across sixty-plus engagements. But the answer kept arriving as decks and playbooks circulated to one client at a time.

This week we are publishing the method in a different shape. **Lokomotif Kit** is the open-source methodology core for Corporate AI Adoption. It contains the schemas, the CLI, the SDK, the eval harness, and the runtime adapters that turn the method into something a practitioner can install, modify, and run.

A short tour of what is in the box:

- **The five-layer prompt architecture (RTCSG)** as a JSON Schema. Every Lokomotif module — Role, Task, Context, Style, Guardrail — conforms. Mixing concerns fails validation.
- **The composition library**, runtime-agnostic by design. The same composed flow can be sent to Anthropic, embedded in a Dify workflow, imported into n8n, or driven through LangGraph.
- **An eval harness** that gates every module. No module ships without a passing eval — deterministic where possible, LLM-judged where rubrics make sense, with a stub judge so CI runs without API keys.
- **A documentation site** at [kit.lokomotif.ai](https://kit.lokomotif.ai) that walks practitioners from install to first composition in about thirty minutes.

Why publish it. Three reasons.

**Method earns authority.** The leading global AI-native firms publish their methods. They do not lose clients to do-it-yourself; they earn pre-educated pipeline. The Brief — our internal positioning document — has called this out for two years. Today we act on it.

**Method matters more than tools.** The 2024–2026 enterprise adoption gap is not a technology gap. The numbers are well-documented: 74% of companies reported no tangible value from AI initiatives in 2024 (MIT Sloan); 63% remain stuck before scale (Recon Analytics, 2026); 19% have robust AI oversight frameworks (Deloitte CDAO, 2026). The bottleneck is operating design. The method we are publishing is what closes that gap.

**Open source is the credible way to publish a method in 2026.** A PDF gets cited. A GitHub repo gets used. We want the method to land in real workflows — in evaluation suites, in CI pipelines, in agent systems — not on slide decks.

What this is not. It is not training. It is not consulting in a wrapper. It is not a hosted product. The Kit gives you the schemas and the tools; the practice that produces measurable transformation is delivered through Adoption Sprint, Workflow Rewire, and Agentic Scale. The Kit is the spine; the engagements are where it becomes operating reality.

Three things to do today, if any of this lands:

1. Read [kit.lokomotif.ai](https://kit.lokomotif.ai). The Method page is twenty minutes.
2. Run `npx @lokomotif/cli modules list` against your own modules directory if you have one, or against ours.
3. If you are writing prompts that need governance — and that is most enterprise prompts — open RTCSG side-by-side with what you have today.

The Kit ships under Apache 2.0. Issues and discussions live on [GitHub](https://github.com/lokomotifai/lokomotif-kit). Komünite practitioners get a dedicated channel for builders' questions.

A category is not declared. It is occupied. This is one of the surfaces.

---

## 6. Anthropic Ambassador post draft

> Target: Anthropic Ambassador community channels, builder-focused. ~200 words. Friendly to the Anthropic ecosystem; flag the frontier-partnership pillar without overplaying it.

---

**Title:** _RTCSG, open-sourced — methodology core for agentic adoption_

---

We just shipped the open-source core of how we deliver agentic-AI transformation: **Lokomotif Kit**, at [kit.lokomotif.ai](https://kit.lokomotif.ai).

The Kit is the methodology in code. RTCSG (Role, Task, Context, Style, Guardrail) as a JSON Schema. A runtime-agnostic SDK that composes flows from RTCSG modules. An eval harness that gates every module before it ships. And four runtime blueprints — including one purpose-built for the Anthropic Messages API — that adapt a composed flow to whichever runtime you are deploying on.

The Anthropic SDK blueprint is intentionally thin: `adaptToAnthropic(composed, userMessage)` returns the `system`/`messages` shape you would write by hand, with the Lokomotif composition hash threaded through so traces correlate back to the originating method. `runWithAnthropic` is a one-liner around `client.messages.create`. Bring your own `@anthropic-ai/sdk` version.

If you build agentic systems and care about governance, observability, and compositional structure as much as throughput, the Kit gives you the spine. We would love to see what you build on it.

License: Apache 2.0. GitHub: [lokomotifai/lokomotif-kit](https://github.com/lokomotifai/lokomotif-kit).

---

## 7. Komünite Space event brief

> A live walkthrough at Komünite Space the week of launch. Practitioner-focused; not a sales event. Recording goes to `kit.lokomotif.ai`.

**Title:** _Lokomotif Kit: from `npx install` to a deployed flow_

**Format:** 90 minutes. In-person at Komünite Space (with simultaneous remote livestream for Komünite members who cannot attend in person). 30–50 attendees.

**Audience:** Komünite practitioners. The room is technical; the demo runs at developer pace, not executive pace.

**Agenda:**

1. **5 min — Frame.** Why open-source the method. The Phase 3 shift. The Kit's place in the Lokomotif stack (Workbench, Control Plane).
2. **15 min — RTCSG in 15 minutes.** Live whiteboard. Show how a real engagement decomposes into Role/Task/Context/Style/Guardrail.
3. **20 min — Live build.** From scratch: `pnpm install`, `lokomotif modules new`, edit the YAML, `pnpm validate:modules`, write an eval, `lokomotif-eval run`.
4. **15 min — Compose and run.** Pull the three Pass 1 modules, compose a flow, send to Anthropic via the blueprint. Show the response. Show the composition hash in the OTel attribute.
5. **10 min — Across runtimes.** Same composed flow → Dify YAML, → n8n JSON, → LangGraph state graph. Same composition hash everywhere.
6. **15 min — Q&A.** Hardware-agnostic. Every question stays in the recording.
7. **10 min — Closing.** What's next on the Roadmap (Pass 2 modules, sector libraries). How to contribute. The Komünite channel.

**Materials to prepare:**

- Slide deck (max 10 slides). The voice rules apply.
- Live-coding repo prepped with a fresh checkout.
- A flow.yaml that uses all three Pass 1 modules + a synthesized role and task fixture (clearly labeled).
- Anthropic API credentials in a local `.env` for the live demo.
- Screen recording running from minute 0.

**Post-event:**

- Recording uploaded to `kit.lokomotif.ai/talks/launch-walkthrough` (a new section to add at launch).
- Q&A questions transcribed and posted in GitHub Discussions; substantive ones become FAQ entries.
- A short summary post in the dedicated Komünite channel.

---

## 8. Day-1 monitoring

For the 24 hours after the version PR merges:

- Watch GitHub Actions runs on `main`. Any failure is a hotfix candidate.
- Watch npm for unexpected publishes (a stray Release workflow run could ship a wrong version). The provenance attestation makes any forgery traceable.
- Watch the docs site for build failures on Vercel. Most likely cause: a stray voice gate trigger.
- Watch the security inbox `kit@lokomotif.ai` for incoming reports.

If anything unexpected happens, the hotfix process is in `RELEASING.md` § _Hotfix process_.

---

> **A category is not declared. It is occupied. The Kit is one of the surfaces that occupies it.**
