# Releasing

Releases are managed through [Changesets](https://github.com/changesets/changesets). The Lead Maintainer is responsible for releases; this document is the operational ritual.

## On every PR

1. If the PR affects a published package, run:

   ```bash
   pnpm changeset
   ```

   Pick the affected packages, the bump type (major / minor / patch), and write a one-line summary that will land in the package's `CHANGELOG.md`.

2. Commit the generated changeset file under `.changeset/` as part of the PR.

3. PRs without a changeset are fine for changes that do not affect published packages (build config, repo policy, internal refactors that do not change behavior).

## On merge to `main`

1. The **Release** workflow (`.github/workflows/release.yml`) runs.
2. If pending changesets exist, the workflow opens a PR titled `chore: version packages`. The PR aggregates every pending changeset into version bumps and `CHANGELOG.md` updates per package.
3. The Lead Maintainer reviews the version PR and merges it when ready to ship.
4. Merging the version PR triggers the Release workflow again, which:
   - Tags the commit (one tag per published package, e.g. `@lokomotif/cli@0.1.0`).
   - Publishes each affected package to npm with [Sigstore provenance attestations](https://docs.npmjs.com/generating-provenance-statements) via `NPM_CONFIG_PROVENANCE`.
   - Creates a GitHub Release per tag with the changeset's release notes.

## First-time setup (operator)

Tracked in `OPERATOR_TASKS.md`:

- `@lokomotif` npm scope claimed.
- `NPM_TOKEN` repository secret with publish rights for the scope.
- Branch protection on `main` requires the Release workflow to pass.

## Rehearsing the ritual

Before the first public release, the Lead Maintainer rehearses on a `0.0.x` tag:

1. Open a small PR with a changeset for one package.
2. Merge it.
3. Watch the Release workflow open the version PR.
4. Merge the version PR.
5. Verify:
   - The tag exists on `main`.
   - The package is published on npm at the expected version.
   - The provenance attestation is verifiable: `npm view @lokomotif/<pkg>@<version> --json | jq .dist.attestations`.
   - The GitHub Release contains the changelog entry.
6. If anything is wrong, rotate `NPM_TOKEN` and address the issue before the v0.1.0 launch.

The rehearsal is captured in `OPERATOR_TASKS.md § 13`.

## Pre-1.0 versioning

Until v1.0.0 ships, every package follows the same rules with the understanding that the public API is not yet stable:

- **Major** — breaking schema, CLI, or SDK changes.
- **Minor** — additive changes, new modules, new commands.
- **Patch** — bug fixes, documentation, eval improvements.

The `lokomotif-eval` Python package is intentionally excluded from Changesets (see `.changeset/config.json` `ignore`) and is versioned out-of-band.

## Hotfix process

For security fixes (`SECURITY.md` § _Reporting a vulnerability_):

1. Land the fix on `main` with a `fix:` Conventional Commit.
2. Create a changeset with a patch bump.
3. The Release workflow opens a version PR. Merge it as soon as CI is green; do not batch with other unrelated patches.
4. Notify reporters and any downstream consumers tracked in the security ledger.

## Coordinating with the docs site

Public docs (`kit.lokomotif.ai`) are deployed independently by Vercel on every push to `main`. A release does not gate the docs site, but the docs site should reference the latest published versions:

- After a release, update version-pinned `pnpm add @lokomotif/<pkg>` snippets in `docs/pages/getting-started.mdx` if they were pinning anything specific.
- The Glossary and methodology pages are version-agnostic; no update needed.
