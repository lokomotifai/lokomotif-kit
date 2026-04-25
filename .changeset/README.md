# Changesets

This directory holds [changeset](https://github.com/changesets/changesets) files. Every PR that affects a published package must include one.

## Creating a changeset

```bash
pnpm changeset
```

Choose the affected packages, the bump type, and write a one-line summary that will appear in the changelog.

## What kinds of changes go in a changeset

- **Major** — breaking change to a published API (CLI flags, SDK signatures, schema).
- **Minor** — additive change (new modules, new commands, new schema fields).
- **Patch** — bug fix, documentation, internal refactor that affects published behavior.

Internal-only changes (build config, repo policy, README polish) do not need a changeset.

The Python package `lokomotif-eval` is intentionally excluded from Changesets and is versioned out-of-band — see `IMPLEMENTATION_PLAN.md` § Phase 5.

## How releases work

1. Each PR with a changeset adds a markdown file here.
2. On every push to `main`, the `Release` workflow opens a "Version Packages" PR that aggregates pending changesets, bumps versions, and updates each package's `CHANGELOG.md`.
3. Merging the Version Packages PR creates git tags and publishes packages to npm.
4. Sigstore provenance attestations are generated automatically.
