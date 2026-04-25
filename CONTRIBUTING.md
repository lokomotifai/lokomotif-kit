# Contributing to Lokomotif Kit

Lokomotif Kit publishes the method behind Lokomotif AI's Corporate AI Adoption practice. Contributions raise the quality of that published method. Read this guide in full before opening a pull request.

For project-wide context, see [`Lokomotif-Kit.md`](./Lokomotif-Kit.md). For decision-making process, see [`GOVERNANCE.md`](./GOVERNANCE.md). For the build sequence, see [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md). For what's coming next, see [`ROADMAP.md`](./ROADMAP.md). For the release ritual, see [`RELEASING.md`](./RELEASING.md).

## Ground rules

- **The schema is the contract.** Modules are validated at lint, build, and install. Never bypass validation.
- **One concern per module.** A role module never embeds guardrails; a task module never carries context.
- **Model-agnostic in `modules/`.** Vendor-specific code lives in `blueprints/`.
- **Measurable by default.** Every module ships with at least one passing eval test.
- **No customer data, ever.** Examples and tests use anonymized fixtures only.
- **Voice matters.** Surfaces follow the voice rules in `Lokomotif-Kit.md` § _Language, voice, tone_ and the Brief § 11 glossary — no hype, methodology-led, prose over bullets.

If a contribution conflicts with any of the above, the contribution is wrong, not the rule.

## Setup

### Requirements

- Node.js 20.10 or newer
- pnpm 9.x (via [Corepack](https://nodejs.org/api/corepack.html): `corepack enable`)
- Python 3.12 or newer
- [`uv`](https://docs.astral.sh/uv/) for Python dependency management
- [`pre-commit`](https://pre-commit.com) for git hooks

### Install

```bash
git clone https://github.com/lokomotif-ai/lokomotif-kit.git
cd lokomotif-kit
corepack enable
pnpm install
cd packages/eval && uv sync
cd ../..
pre-commit install
```

### Common commands

```bash
pnpm typecheck            # Strict TypeScript across the workspace
pnpm lint                 # ESLint
pnpm test                 # Vitest
pnpm validate:modules     # JSON Schema validation on YAML modules
pnpm format               # Prettier (write)
pnpm format:check         # Prettier (check)
pnpm changeset            # Author a changeset for your PR
```

```bash
cd packages/eval
uv run pytest             # Python eval tests
uv run mypy src           # Type check
uv run ruff check         # Lint
uv run ruff format        # Format
```

## Development workflow

### Branches

Naming: `type/short-description`. Examples: `feat/finance-roles`, `fix/schema-validation`, `docs/contributing-update`.

`main` is protected. All changes go through pull requests.

### Commits

[Conventional Commits](https://www.conventionalcommits.org). Allowed types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `build`, `ci`, `perf`, `style`, `revert`.

Commit messages are linted by `commitlint` at commit-msg time. The hook is wired through the pre-commit framework — run `pre-commit install` once and the `commit-msg` stage is installed alongside `pre-commit`. See `commitlint.config.cjs` for the active rule set.

Sign every commit. We use the [Developer Certificate of Origin](https://developercertificate.org/) — `git commit -s` adds the `Signed-off-by` trailer. Pull requests without sign-off are not merged.

### Pull requests

Every PR includes:

1. **A description.** What changed and why. Reference issues.
2. **A changeset** (for changes to published packages). Run `pnpm changeset` to create one.
3. **Tests.** New code is covered by unit tests and, for modules, eval tests.
4. **A clean CI.** Typecheck, lint, tests, schema validation, and Python checks must all pass.

The PR template will guide you. Drafts are welcome; finished work is reviewed faster.

### Reviews

Single Lead Maintainer approval merges most PRs. Schema changes and new conventions go through the [RFC process](./GOVERNANCE.md). Substantive critique is part of the work, not a personal slight.

## Adding a module

Every module sits at `modules/<kind>/<industry>/<name>.yaml` with a sibling `__tests__/` directory. The conventions are defined in `Lokomotif-Kit.md` § _RTCSG module conventions_.

### Steps

1. **Confirm the kind.** Role, task, context, style, or guardrail. One concern per module.
2. **Write the frontmatter.** See `Lokomotif-Kit.md` for required fields and the industry taxonomy.
3. **Write the body.** Use the language(s) declared in `languages`. Turkish content is written in native Turkish; English content is written in native English. No autotranslation.
4. **Write the eval test.** At least one. See `packages/eval/README.md` for authoring rules.
5. **Validate locally.**

   ```bash
   pnpm validate:modules
   cd packages/eval && uv run pytest -k <module-name>
   ```

6. **Open the PR** with the Module Proposal template. Anonymized source-material reference is required.

### What we will not accept

- Modules that mix concerns.
- Modules that hardcode model names, provider APIs, or vendor-specific features.
- Modules without an anonymized source-material reference. Modules must reflect real practice.
- Modules without eval tests.
- Modules whose voice violates `Lokomotif-Kit.md` § _Language, voice, tone_.

## Adding a blueprint adapter

Blueprints adapt composed flows to runtimes. To add a new runtime:

1. Open an RFC. Runtime additions affect scope and maintenance burden.
2. If accepted, scaffold under `blueprints/<runtime>/` with a smoke test, README, and end-to-end example.
3. The smoke test must run in CI without external dependencies (mock model calls).

## Adding dependencies

New dependencies require justification in the PR description: what does it do, why is it the best option, what is the maintenance burden? `Lokomotif-Kit.md` is explicit — do not add a dependency without justifying it.

For Python, we standardize on `uv`. For Node, on `pnpm`. Alternatives go through an RFC.

## Reporting issues

- **Bugs:** open an issue with the Bug Report template.
- **Feature requests:** open an issue with the Feature Request template.
- **RFCs:** see [`GOVERNANCE.md`](./GOVERNANCE.md).
- **Module proposals:** open an issue with the Module Proposal template (anonymized engagement reference required).
- **Security:** see [`SECURITY.md`](./SECURITY.md). Do not open public issues for security reports.

## Code of Conduct

This project follows the [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md). Every interaction in issues, pull requests, discussions, and events is subject to it.
