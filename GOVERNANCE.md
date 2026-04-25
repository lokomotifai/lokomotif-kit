# Governance

Lokomotif Kit is the open-source methodology core of Lokomotif AI's stack. Its governance is intentionally light at this stage — clear authority, clear escalation, durable decisions in writing.

This document explains who maintains the project, how decisions are made, how RFCs work, and how releases happen. If something here conflicts with [`Lokomotif-Kit.md`](./Lokomotif-Kit.md) or the [Lokomotif AI Positioning Brief](./Lokomotif_AI_Positioning_Brief.md), those documents take precedence.

## Maintainership

The Kit is maintained by the **Lokomotif Core Team**.

| Role | Person | Mandate |
|------|--------|---------|
| Lead Maintainer | Fatih Güner | Final authority on schema changes, scope, and releases |

The maintainer roster grows by invitation only. Active contributors with sustained, on-voice contributions across at least one release cycle may be invited to join. Joining the Core Team is a delegation of trust, not a reward for volume.

## Decision-making

Day-to-day work runs under "lazy consensus":

- **Routine changes** — bug fixes, documentation, modules with passing eval tests — merge on a single maintainer approval.
- **Schema, scope, or convention changes** — require an RFC. See below.
- **Irreversible decisions** — versioning policy shifts, removing modules, policy changes — require explicit Lead Maintainer approval.

Disagreements are resolved by the Lead Maintainer. The escalation path exists to keep the project moving, not to short-circuit discussion. A short-form rationale is recorded in the issue or PR thread so the next contributor can see why a decision was made.

## RFC process

RFCs are how the Kit makes durable decisions in writing. Open an RFC when a change:

- Modifies the JSON Schema or any module contract.
- Introduces a new RTCSG concern, kind, or industry.
- Changes the runtime contract (CLI, SDK, blueprints).
- Sets or alters a project-wide convention.
- Introduces a new dependency at the package level.

### Steps

1. Open an issue using the **RFC** template. Lay out the problem, the proposal, alternatives considered, and a migration plan if applicable.
2. Discussion happens in the issue thread. The Lead Maintainer marks the RFC as `accepted`, `revising`, or `declined` within **14 days** of opening.
3. Accepted RFCs are committed as `docs/rfcs/NNNN-short-name.md` and linked from the implementation pull request.
4. Implementation PRs reference the RFC number.

RFCs are durable. They explain why a decision exists; the codebase shows how.

## Releases

Releases are managed via [Changesets](https://github.com/changesets/changesets). Every PR that affects a published package includes a changeset. Releases ship from `main` after the maintainer reviews the version-bump PR Changesets opens.

Semantic versioning is enforced per package:

- **Major** — breaking schema, CLI, or SDK changes.
- **Minor** — additive changes, new modules, new commands.
- **Patch** — bug fixes, documentation, eval improvements.

Pre-1.0.0 releases follow the same rules; the public API is not yet considered stable.

## Conflicts of interest

The Kit serves both Lokomotif AI's commercial work and the broader practitioner community. The two are not in tension — published method earns authority. Three guardrails apply:

- **Merit, not provenance.** Modules are accepted on quality, not because they originate from Lokomotif AI engagements.
- **Vendor neutrality.** Vendor-specific code stays in `blueprints/`. The Kit does not favor one runtime over another at the module level.
- **No marketing of services in product surfaces.** Commercial offerings (Adoption Sprint, Workflow Rewire, Agentic Scale) are referenced in `Lokomotif-Kit.md` for context, not advertised in the Kit's published surfaces.

## Komünite is uninstrumented

The Lokomotif AI Positioning Brief is explicit (§ 13): Komünite is not a marketing channel. The Kit honors this. Komünite is referenced as the practitioner ecosystem. It is not used for lead generation, pipeline tracking, or any form of attribution. If the Kit project later adopts a dedicated channel inside Komünite, the channel's purpose is community health, not pipeline.

## Contact

- Day-to-day: GitHub issues and discussions.
- Security: [kit@lokomotif.ai](mailto:kit@lokomotif.ai). See [`SECURITY.md`](./SECURITY.md).
- Maintainer questions: [kit@lokomotif.ai](mailto:kit@lokomotif.ai).
- Escalation past the Lead Maintainer: [hello@lokomotif.ai](mailto:hello@lokomotif.ai).
