# Security Policy

Lokomotif Kit handles methodology, schemas, and CLI tooling — not customer data, not production secrets. Even so, the surfaces it touches inside enterprise environments make security discipline non-optional. This document defines how we handle reports, what we support, and how we treat the data adjacent to the Kit.

## Reporting a vulnerability

If you have discovered a security issue in Lokomotif Kit, please report it privately. Do not open a public issue.

**Contact:** [kit@lokomotif.ai](mailto:kit@lokomotif.ai)

We aim to acknowledge reports within **2 business days** and to provide a remediation timeline within **7 business days**. For significant issues, we coordinate disclosure timelines with the reporter.

When reporting, include:

- Affected package(s) and version(s).
- Reproduction steps or proof-of-concept.
- Expected vs. actual behavior.
- Impact assessment, if known.

We credit reporters who request acknowledgment in the release notes of the fix.

## Supported versions

Lokomotif Kit is in active development. Until v1.0.0, only the most recent release receives security fixes.

| Version | Supported |
|---------|-----------|
| `0.x` | Latest minor only |

Once v1.0.0 ships, the latest two minor versions will receive security fixes.

## Privacy and data handling

The Kit is data-light by design. A few rules are enforced repository-wide:

- **No customer-identifiable data.** Modules, examples, fixtures, and golden sets use anonymized content. Real company names become placeholders. Personal information is stripped at the source.
- **No secrets in the repository.** API keys, OAuth tokens, connection strings, and similar are kept out of the repo. Use `.env.local` (gitignored) for development; CI pulls secrets from repository secrets, not files.
- **Pre-commit scanning.** Every commit is scanned for likely secrets and Turkish-context personal information patterns (TC Kimlik, IBAN TR, Turkish phone numbers, and similar). The scanners can be bypassed only with maintainer approval and an audit note.

KVKK considerations are first-class for Turkish modules. The `guardrails/pii-tr` module is the canonical PII detection layer for Turkish content; it is updated alongside KVKK guidance.

A breach of these rules — committing real customer data, real secrets, or real personal information — is treated as a security event and triggers the reporting process described above.

## Supply chain

- Dependencies are reviewed before introduction. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) § _Adding dependencies_.
- GitHub Actions are pinned by SHA before the v0.1.0 launch.
- Released npm packages carry [Sigstore provenance attestations](https://docs.npmjs.com/generating-provenance-statements).
- The OpenSSF Scorecard runs on `main`. Results are public.

## Out of scope

- Vulnerabilities in upstream dependencies. Please report those upstream; we will track and update.
- Theoretical issues without proof of impact.
- Issues in customer or partner deployments of the Kit. Those are governed by the relevant engagement, not this policy.

## Escalation

If a security report concerns the Lead Maintainer specifically, or if the standard channel does not respond within the stated window, escalate to **[hello@lokomotif.ai](mailto:hello@lokomotif.ai)**.
