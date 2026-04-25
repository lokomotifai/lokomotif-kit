# RFC 0001 — Phase 6 partial scope

| Field   | Value |
|---------|-------|
| Status  | Accepted |
| Author  | Fatih Güner (Lead Maintainer) |
| Date    | 2026-04-25 |
| Affects | `IMPLEMENTATION_PLAN.md` § Phase 6 · Locked decision #6 |

## Summary

Reduce Phase 6 scope from five canonical modules to three. Each of the three is grounded in **real, citable, public sources** — not invented. Defer the two engagement-derived modules until anonymized Lokomotif practice artifacts are available.

## Motivation

The plan's Phase 6 enumerates five canonical modules. Two of them — `roles/finance/aml-analyst` and `tasks/general/structured-summary` — must be derived from anonymized Lokomotif engagement artifacts per `Lokomotif-Kit.md` § _Communication preferences_:

> Never invent module content from thin air. … Modules should reflect real Lokomotif practice, not AI-generated plausibility.

Those artifacts are not currently available. Strict reading of the plan: Phase 6 cannot start, which blocks Phases 7–10.

The plan's own decision register (Decision #6) flagged this as the open question that needed resolution before Phase 6.

## Decision

Ship Phase 6 in two passes.

### Pass 1 — accepted by this RFC

Three modules, each with a `source_reference` that cites the public document it derives from.

| Module ID | Source |
|---|---|
| `guardrails/cross-industry/pii-tr` | KVKK 6698 sayılı Kanun (Md. 3, 5, 6, 12); MASAK Tebliğ; ISO 13616 (IBAN); NVI TC Kimlik formatı |
| `contexts/finance/kvkk-compliance` | KVKK 6698 (Md. 4–9); KVKK Kurumu rehberleri; BDDK 2020 Bilgi Sistemleri Yönetmeliği |
| `styles/cross-industry/executive-board-brief` | `Lokomotif_AI_Positioning_Brief.md` § 10 (Voice & Category Construction Discipline) + § 11 (The Glossary) |

Each module ships with at least one passing eval suite under its sibling `__tests__/` directory.

### Pass 2 — deferred

When the Lead Maintainer provides anonymized engagement artifacts, the original five-module set completes:

- `roles/finance/aml-analyst` — needs an anonymized AML engagement role definition.
- `tasks/general/structured-summary` — needs a redacted task brief from a real Lokomotif delivery.

Pass 2 is tracked as a section in `OPERATOR_TASKS.md` so the dependency does not get lost.

## Why this is not a rule violation

`Lokomotif-Kit.md` prohibits "AI-generated plausibility." It does not prohibit derivation from real public sources. Pass 1 modules are grounded in:

- **Turkish regulation** (KVKK 6698, MASAK Tebliğ, BDDK Bilgi Sistemleri Yönetmeliği) — published by the Republic of Turkey, citable by article and section.
- **International technical standards** (ISO 13616 for IBAN format) — public spec maintained by SWIFT.
- **Lokomotif source documents** — the Brief itself is canonical Lokomotif material; deriving a style module from its voice rules is the same kind of "real source" that an engagement artifact would be, just sourced from a published asset rather than an internal one.

A reviewer can audit any claim in any of the three modules by reading the cited regulation or the Brief.

## Why we did not just create example modules

`examples/` was a candidate. Rejected:

1. Modules with real regulatory grounding are higher-value than illustrative content. They will remain canonical even after Pass 2 ships — they do not get demoted.
2. The deferred Pass 2 modules need a place to land in `modules/`. Having three real modules already in the tree makes the tree look credible while Pass 2 is pending.
3. `examples/` would create a parallel content path with weaker quality bars; the schema and eval gates apply uniformly to `modules/` and we want every published artifact to clear the same bar.

## Migration

None. Pass 2 modules append to the existing `modules/` tree without disturbing Pass 1.

## Consequences

- Phases 7 (blueprints), 8 (docs), 9 (community), and 10 (launch) can proceed with Pass 1 modules as the demonstration set.
- The plan's Decision #6 is partially resolved: source material is on file for three modules, deferred for two. Pass 2 reopens the decision.
- The implementation plan version bumps from 1.0 to 1.1.

## Open questions

- **Should Pass 2's missing modules block any later phase?** No. Phases 7–10 demonstrate against Pass 1. Pass 2 is additive, not blocking. The launch announcement (Phase 10) should note the planned Pass 2 additions but not wait on them.
- **Could public-sourced modules grow beyond three?** Yes. If a clear public source surfaces for any other module (e.g., MASAK-grounded AML context that is genuinely public), it can ship alongside Pass 1 by the same authoring pattern.
