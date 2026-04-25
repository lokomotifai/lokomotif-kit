# Roadmap

A directional roadmap for what's beyond the implementation plan. Specific dates are not promises — items move based on engagement-artifact availability (especially Pass 2 modules), operator availability, and external feedback after launch.

[`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) is the authoritative phase ladder for the Kit's initial build (Phases 0–10). This roadmap projects what's beyond Phase 10 launch and folds in items deferred from earlier phases.

## Q2 2026 — Launch (v0.1.0)

- Phase 9 ships community + release hygiene (this roadmap, commitlint, labels, RELEASING).
- Phase 10 launch prep: SHA-pin GitHub Actions, OpenSSF Scorecard ≥ 7, README enterprise voice review, launch artifacts (Insights post, Anthropic Ambassador announcement, Komünite Space launch event per Brief § 13).
- v0.1.0 ships from `main` with provenance attestations across all published packages.

## Q3 2026 — Pass 2 modules and the first sector library

- `roles/finance/aml-analyst` — Pass 2 (engagement-derived) per RFC 0001.
- `tasks/general/structured-summary` — Pass 2.
- First sector-specific library: 3–5 finance modules grounded in real engagements. Decision #6 in `IMPLEMENTATION_PLAN.md` flips to fully resolved.
- **Nextra v4 / Next.js 15+ migration.** Nextra 3.3.x is pinned to Next 14.2.x which carries seven moderate/high CVEs in its transitive tree (postcss <8.5.10, uuid, plus five Next-direct advisories) with no patch available within the 14.2 line. The migration unblocks the OpenSSF Scorecard `Vulnerabilities` check that drags v0.1.0 to 5.5/10. Operator-driven RFC; scope: re-author `_meta.ts`, `theme.config.tsx`, App Router layout if v4 requires it; verify TR locale routing; voice gate unchanged.
- v0.2.0.

## Q4 2026 — Observability surface and a real LLM judge

- Anthropic-backed reference `LLMJudge` ships in `packages/eval` (separate optional dep, not a hard requirement).
- `guardrails/cross-industry/pii-tr` regex set is read from the YAML at runtime so the canonical module is the single source of truth (replaces the hand-aligned patterns in `pii.py`).
- `@lokomotif/sdk` emits OTel spans (`lokomotif.flow.compose`) using `@lokomotif/otel-schema`.
- `@lokomotif/cli deploy <target> <flow.yaml>` dispatches to blueprints end-to-end (Phase 7 dispatcher work that was scoped out of v0.1).
- v0.3.0.

## Q1 2027 — Annual category report support

The Brief § 16 lists "The State of Corporate AI Adoption in Turkey" as an open strategic decision at the firm level. If accepted by Lokomotif AI leadership, the Kit ships supporting infrastructure: data templates, citation helpers, optional embedding tools. The Kit does not author the report — it gives the firm authoring infrastructure that survives report cycles.

## Beyond — Leveraged Agency Model Rung 3

The Brief's § 07 outlines the firm's product ladder: Services → Productized Service → Product. The Kit is currently the open-source spine that supports Rung 1 (services delivery) and seeds Rung 2 (productized service via the Diagnostic). When the firm decides to ship Rung 3 (product) — likely an RTCSG platform — the Kit's schema and SDK become the foundation.

That decision is not on this roadmap; it lives on the firm's annual planning surface.

## How items move on and off

- **On**: an RFC for any new scope item, accepted by the Lead Maintainer.
- **Off**: when shipped (linked PRs in the entry) or when explicitly deferred via a follow-up RFC.

This file is updated alongside each release tag so a reader can scan it once and see what's coming. It is not a sales document; entries that turn out to be wrong are removed cleanly with a note.
