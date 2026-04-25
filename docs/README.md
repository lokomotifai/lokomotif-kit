# `@lokomotif/docs` — kit.lokomotif.ai

Public documentation site for Lokomotif Kit. Built with Nextra (Next.js + MDX) and deployed to Vercel.

## Local development

```bash
pnpm install                  # from the repo root
pnpm -F @lokomotif/docs dev   # http://localhost:3000
```

## Build

```bash
pnpm -F @lokomotif/docs build
```

The output is a Next.js production build in `.next/`. Vercel reads it directly.

## Voice gate

Every MDX page is scanned for retired phrases (Brief § 11) and the CLAUDE.md voice rules. The gate runs on PRs through `.github/workflows/docs.yml` and locally via:

```bash
pnpm -F @lokomotif/docs voice-gate
```

A page can opt out by setting `voice_gate: skip` in its frontmatter — used by `glossary.mdx`, which documents the retired phrases as content.

## Internationalization

Two locales: `en` (default) and `tr`. Pages live under `pages/` (English) and `pages/tr/` (native Turkish). **Autotranslation is forbidden** — Turkish pages are written natively per Brief § 11.

## Deployment

Vercel — project root is `docs/`. See `OPERATOR_TASKS.md` for one-time UI configuration and DNS setup for `kit.lokomotif.ai`.

## Phase status

Ships in **Phase 8** of [`IMPLEMENTATION_PLAN.md`](../IMPLEMENTATION_PLAN.md).
