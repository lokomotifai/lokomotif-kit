# @lokomotif/docs

## 0.0.0

Initial scaffold. Released alongside Phase 8 of the Lokomotif Kit implementation plan.

- Nextra 3.x site with `nextra-theme-docs`.
- EN canonical pages: index, getting-started, method, module-authoring, cli, sdk, eval-harness, blueprints, rfcs, glossary.
- TR priority pages (native, not translated): tr/index, tr/getting-started, tr/method, tr/glossary.
- Voice gate script (`scripts/voice-gate.mjs`) blocks Brief § 11 retired phrases at PR time; pages opt out via `voice_gate: skip` frontmatter.
- Vercel configuration (`vercel.json`) with monorepo install and Next.js build.
- GitHub Actions workflow runs voice gate and Next.js build on PRs touching `docs/`.
