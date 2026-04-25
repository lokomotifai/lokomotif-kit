<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/logo-lokomotif-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./assets/logo-lokomotif.svg">
    <img src="./assets/logo-lokomotif.svg" alt="Lokomotif" width="220">
  </picture>
</p>

<p align="center">
  <strong>The open-source methodology core for Corporate AI Adoption.</strong><br>
  RTCSG and the Three-Horizon Adoption Journey, in code.<br>
  Apache 2.0. Model-agnostic. Runtime-agnostic.
</p>

<p align="center">
  <a href="#quickstart"><strong>Quickstart</strong></a> ·
  <a href="https://kit.lokomotif.ai"><strong>Documentation</strong></a> ·
  <a href="./README.tr.md"><strong>Türkçe</strong></a> ·
  <a href="./ROADMAP.md"><strong>Roadmap</strong></a> ·
  <a href="./CONTRIBUTING.md"><strong>Contribute</strong></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@lokomotif/cli"><img src="https://img.shields.io/npm/v/@lokomotif/cli?label=%40lokomotif%2Fcli" alt="npm @lokomotif/cli"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-Apache%202.0-blue" alt="Apache 2.0"></a>
  <a href="https://github.com/lokomotifai/lokomotif-kit/actions/workflows/ci.yml"><img src="https://github.com/lokomotifai/lokomotif-kit/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI"></a>
  <a href="https://scorecard.dev/viewer/?uri=github.com/lokomotifai/lokomotif-kit"><img src="https://api.scorecard.dev/projects/github.com/lokomotifai/lokomotif-kit/badge" alt="OpenSSF Scorecard"></a>
  <a href="https://github.com/lokomotifai/lokomotif-kit/actions/workflows/codeql.yml"><img src="https://github.com/lokomotifai/lokomotif-kit/actions/workflows/codeql.yml/badge.svg?branch=main" alt="CodeQL"></a>
  <a href="https://kit.lokomotif.ai"><img src="https://img.shields.io/badge/docs-kit.lokomotif.ai-7057ff" alt="Docs"></a>
</p>

---

## What is Lokomotif Kit?

Lokomotif Kit is the reference implementation of **RTCSG** — a five-layer prompt architecture (Role, Task, Context, Style, Guardrail) — and the **Three-Horizon Adoption Journey**. It is the methodology Lokomotif AI uses on every engagement, published as code so practitioners, partners, and client teams can apply it directly.

The Kit is editorial, not a marketplace. Quality is gated by schema, eval suite, and review.

| Without the Kit                                                     | With the Kit                                                        |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| ❌ Ad-hoc prompts copy-pasted across teams, no version, no contract | ✅ Composable RTCSG modules with schema, version, owner, license    |
| ❌ Quality gated by gut feel and demo polish                        | ✅ Every module ships with at least one passing eval suite          |
| ❌ Vendor lock-in to one runtime                                    | ✅ Same module composes into Anthropic SDK, Dify, n8n, or LangGraph |
| ❌ Compliance bolted on after launch                                | ✅ Guardrails are first-class modules in the schema                 |
| ❌ Methodology lives in tribal knowledge and slide decks            | ✅ Apache 2.0 — fork it, study it, audit it, ship it                |
| ❌ Observability you wire up by hand                                | ✅ OpenTelemetry semantic conventions for every flow and eval       |

---

## How It Works

```
   Author module                        Validate                          Run eval
        │                                  │                                 │
   ┌────▼─────┐                       ┌────▼─────┐                      ┌────▼────┐
   │  YAML    │ ── schema ─────────►  │  Module  │ ── lokomotif-eval ─► │  Pass   │
   │  + eval  │                       │  passes  │                      │  /Fail  │
   └────┬─────┘                       └──────────┘                      └─────────┘
        │
   ┌────▼─────┐  R → T → C → S → G   ┌──────────┐    Anthropic SDK
   │  Flow    │ ──────────────────►  │  Compose │ ─► Dify
   │  YAML    │   canonical order    │   Hash   │ ─► n8n
   └──────────┘   dedupe + render    └──────────┘ ─► LangGraph
```

Every step is enforced. Modules that don't validate against the schema can't be merged. Modules without a passing eval can't ship. Compositions are deterministic — the same modules in any order produce the same 16-character composition hash.

---

## What's Inside

| **📐 JSON Schema**                                                                                | **🛠️ CLI**                                                                                   | **📦 SDK**                                                                                    |
| :------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| Draft-07 schema for every RTCSG kind, with TypeScript types and a Result-returning `validate()`   | `lokomotif` binary — list, validate, scaffold, compose, evaluate, deploy                     | Runtime-agnostic TypeScript composition library, zero vendor SDK dependencies                 |
| **🧪 Eval Harness**                                                                               | **📡 OTel Schema**                                                                           | **📚 Canonical Modules**                                                                      |
| Python test runner (uv, pytest) with deterministic and LLM-judged checks via JSON Pointer targets | OpenTelemetry semantic conventions for module, flow, compose, and eval attributes            | Three Pass-1 modules sourced from public references (KVKK, executive voice, Turkey-aware PII) |
| **🚂 4 Runtime Blueprints**                                                                       | **📖 EN + TR Documentation**                                                                 | **🔐 Sigstore Provenance**                                                                    |
| Anthropic Agent SDK · Dify · n8n · LangGraph — vendor-specific code lives here, never in modules  | [kit.lokomotif.ai](https://kit.lokomotif.ai) — English canonical with Turkish priority pages | Every release signed with SLSA build provenance via npm publish + Sigstore                    |

---

## RTCSG

Every module belongs to exactly one of five concerns:

| Layer | Concern              | What it carries                                                                 |
| :---: | -------------------- | ------------------------------------------------------------------------------- |
| **R** | Role                 | Who the AI acts as. Expertise, perspective, authority calibrated to the task.   |
| **T** | Task & Format        | What must be done; how the output is structured.                                |
| **C** | Context & Constraint | Organizational reality — data boundaries, situational limits, regulatory frame. |
| **S** | Style & Tone         | Voice and register calibrated to audience.                                      |
| **G** | Guardrail            | What the model must not do. Boundaries, accuracy standards, risk controls.      |

Composition happens at flow time, not module time. A role module never embeds guardrails; a task module never embeds context. The Kit enforces this.

Read the full method: [kit.lokomotif.ai/method](https://kit.lokomotif.ai/method).

---

## Quickstart

### Use the CLI

```bash
npx @lokomotif/cli@latest --help
```

### Install in your project

```bash
pnpm add @lokomotif/sdk @lokomotif/schema
# or, for a runtime adapter:
pnpm add @lokomotif/blueprint-anthropic-sdk
```

### Compose your first flow

```ts
import { composeFlow } from '@lokomotif/sdk';

const composed = composeFlow(
  {
    name: 'kvkk-board-brief',
    modules: [
      'roles/finance/your-role', // a role you author
      'contexts/finance/kvkk-compliance',
      'styles/cross-industry/executive-board-brief',
      'guardrails/cross-industry/pii-tr',
    ],
  },
  { modulesDir: './modules', language: 'tr' },
);

console.log(composed.text); // R → T → C → S → G ordered prompt
console.log(composed.compositionHash); // 16-char deterministic hash
```

### Develop on the Kit itself

```bash
git clone https://github.com/lokomotifai/lokomotif-kit.git
cd lokomotif-kit
corepack enable
pnpm install
cd packages/eval && uv sync
pnpm test          # full TypeScript suite
pnpm validate:modules
```

Full walkthrough: [kit.lokomotif.ai/getting-started](https://kit.lokomotif.ai/getting-started).

---

## Key Commands

| Command                               | What It Does                                                    |
| ------------------------------------- | --------------------------------------------------------------- |
| `lokomotif modules list`              | List RTCSG modules with kind, version, languages                |
| `lokomotif modules validate <glob>`   | Validate against the JSON Schema, with JSON Pointer error paths |
| `lokomotif modules new <kind> <name>` | Scaffold a frontmatter-complete module + eval placeholder       |
| `lokomotif compose <flow.yaml>`       | Compose modules into a single RTCSG-ordered prompt              |
| `lokomotif eval run`                  | Run the Python eval harness (delegates to `lokomotif-eval`)     |
| `lokomotif deploy`                    | List runtime blueprint targets                                  |

Every command supports `--json` for machine output and `--root <path>` for testability.

Full reference: [kit.lokomotif.ai/cli](https://kit.lokomotif.ai/cli).

---

## Packages

| Package                                                                    | Purpose                                                                  |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [`@lokomotif/schema`](./packages/schema)                                   | JSON Schema for every RTCSG kind, with TypeScript types and `validate()` |
| [`@lokomotif/cli`](./packages/cli)                                         | The `lokomotif` binary                                                   |
| [`@lokomotif/sdk`](./packages/sdk)                                         | Runtime-agnostic composition library                                     |
| [`@lokomotif/otel-schema`](./packages/otel-schema)                         | OpenTelemetry semantic conventions                                       |
| [`@lokomotif/blueprint-anthropic-sdk`](./packages/blueprint-anthropic-sdk) | Anthropic Agent SDK adapter                                              |
| [`@lokomotif/blueprint-dify`](./packages/blueprint-dify)                   | Dify YAML adapter                                                        |
| [`@lokomotif/blueprint-n8n`](./packages/blueprint-n8n)                     | n8n workflow JSON adapter                                                |
| [`@lokomotif/blueprint-langgraph`](./packages/blueprint-langgraph)         | LangGraph state machine adapter                                          |
| [`packages/eval`](./packages/eval)                                         | Python eval harness (PyPI publish in v0.2.0)                             |

All TypeScript packages publish to npm under the `@lokomotif` scope with Sigstore provenance.

---

## Canonical Modules (v0.1.0)

Three Pass-1 modules sourced from public references per [RFC 0001](./docs/rfcs/0001-phase-6-partial-scope.md):

| Module                                                                                                      | What it covers                                               |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [`contexts/finance/kvkk-compliance`](./modules/contexts/finance/kvkk-compliance.yaml)                       | KVKK + BDDK fintech context (TR + EN)                        |
| [`styles/cross-industry/executive-board-brief`](./modules/styles/cross-industry/executive-board-brief.yaml) | Lokomotif executive voice (TR + EN)                          |
| [`guardrails/cross-industry/pii-tr`](./modules/guardrails/cross-industry/pii-tr.yaml)                       | Turkey-aware PII guardrail — TC ID, IBAN, KVKK personal data |

Pass-2 modules (`roles/finance/aml-analyst`, `tasks/general/structured-summary`) ship in v0.2.0 once engagement-derived artifacts are available. Until then, scaffold your own role and task modules with `lokomotif modules new`.

---

## Architecture

```
lokomotif-kit/
├── packages/
│   ├── schema/                       JSON Schema + TS types + Pydantic types
│   ├── cli/                          lokomotif binary (clipanion v4)
│   ├── sdk/                          Runtime-agnostic composition
│   ├── otel-schema/                  OTel semantic conventions
│   ├── eval/                         Python harness (uv, pytest, mypy strict)
│   ├── blueprint-anthropic-sdk/      Anthropic Agent SDK adapter
│   ├── blueprint-dify/               Dify YAML adapter
│   ├── blueprint-n8n/                n8n workflow JSON adapter
│   └── blueprint-langgraph/          LangGraph state machine adapter
├── modules/                          Pass-1 canonical modules (3 + evals)
├── docs/                             Nextra v3 site (EN canonical + TR priority pages)
├── docs/rfcs/                        Accepted RFCs
├── .changeset/                       Release management
└── .github/                          CI, security scanning, governance
```

Architecture deep-dive: [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md).

---

## Security & Provenance

- Every release is signed with **Sigstore** provenance attestations (SLSA build v1) on npm publish.
- **OpenSSF Scorecard** score is published on every push to `main`.
- **CodeQL** runs on every push, PR, and weekly cron.
- Branch protection on `main` with required status checks (CI, CodeQL, Scorecard).
- Dependabot keeps dependencies and GitHub Actions current; majors gated by RFC for the docs stack.
- Disclosure policy: [`SECURITY.md`](./SECURITY.md).

---

## Roadmap

- [x] **v0.1.0** — RTCSG schema, CLI, SDK, eval harness, four runtime blueprints, three Pass-1 modules
- [x] Sigstore provenance + OpenSSF Scorecard + CodeQL on every push
- [x] Bilingual docs (EN canonical + TR priority pages) at [kit.lokomotif.ai](https://kit.lokomotif.ai)
- [ ] **v0.2.0** — Pass-2 modules from real engagements (`roles/finance/aml-analyst`, `tasks/general/structured-summary`)
- [ ] **v0.2.0** — First sector library: 3–5 finance modules grounded in real engagements
- [ ] **v0.2.0** — Nextra v4 / Next.js 15+ migration via RFC
- [ ] **v0.3.0** — Anthropic-backed reference `LLMJudge` in the eval harness
- [ ] **v0.3.0** — `@lokomotif/sdk` emits OTel spans (`lokomotif.flow.compose`)
- [ ] **v0.3.0** — Full blueprint dispatcher in `lokomotif deploy`

Full roadmap: [`ROADMAP.md`](./ROADMAP.md).

---

## Contributing

Lokomotif Kit is open source because how organizations adopt AI deserves open-source-grade work, not closed decks. Every contribution — a new module, a refined eval, a runtime blueprint — helps an enterprise adopt AI more rigorously.

```bash
git clone https://github.com/lokomotifai/lokomotif-kit.git
cd lokomotif-kit
corepack enable
pnpm install
```

Read the contributor guide: [`CONTRIBUTING.md`](./CONTRIBUTING.md). Module authoring rules: [kit.lokomotif.ai/module-authoring](https://kit.lokomotif.ai/module-authoring). RFC process: [kit.lokomotif.ai/rfcs](https://kit.lokomotif.ai/rfcs).

Every module ships with at least one passing eval. No exceptions.

---

## Frontier Connection

Lokomotif AI is **Anthropic Ambassador İstanbul**. The Kit reflects current frontier practice in agentic systems and responsible AI.

---

## Built By

[**Lokomotif AI**](https://lokomotif.ai) — Turkey's first Corporate AI Adoption Partner. The Kit publishes the methodology behind the firm's Adoption Sprint, Workflow Rewire, and Agentic Scale engagements. Practitioner community: [Komünite](https://komunite.lokomotif.ai).

Maintained by [**Fatih Güner**](https://github.com/fatihguner), founder of Lokomotif AI.

[𝕏 @fatihguner](https://x.com/fatihguner) · [LinkedIn](https://linkedin.com/in/fatihguner)

---

## License

[Apache 2.0](./LICENSE). See [`NOTICE`](./NOTICE) for attribution requirements.

---

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/logo-lokomotif-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./assets/logo-lokomotif.svg">
    <img src="./assets/logo-lokomotif.svg" alt="Lokomotif" width="100">
  </picture><br><br>
  <sub>Open source under Apache 2.0. The methodology, in code.</sub>
</p>
