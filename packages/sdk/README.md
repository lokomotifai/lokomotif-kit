# `@lokomotif/sdk`

Runtime-agnostic TypeScript SDK for loading and composing RTCSG modules.

## Why a separate package

`@lokomotif/schema` is the contract. `@lokomotif/cli` is one consumer. The SDK is the consumable composition library that other tools — blueprints, internal services, integrations — depend on without taking on the CLI's dependencies.

The SDK has **zero vendor dependencies**. No Anthropic SDK, no OpenAI client, no LangChain. Vendor adapters live in `blueprints/`. The SDK produces a structured `ComposedPrompt`; blueprints render it for their runtime.

## Install

```bash
pnpm add @lokomotif/sdk
```

## Public API

```ts
import {
  loadModule,
  loadModules,
  loadFlow,
  compose,
  composeFlow,
  renderPrompt,
  compositionHash,
  LoadModuleError,
  type Flow,
  type ComposedPrompt,
  type ComposeOptions,
} from '@lokomotif/sdk';
```

## Loading modules

```ts
import { loadModule } from '@lokomotif/sdk';

const module = await loadModule('roles/finance/aml-analyst', {
  modulesDir: '/abs/path/to/modules',
});
```

Throws `LoadModuleError` with a typed `reason` (`not-found`, `parse-error`, `validation-error`) when the module cannot be loaded.

## Composing flows

```ts
import { composeFlow } from '@lokomotif/sdk';

const composed = await composeFlow(
  {
    name: 'aml-review',
    modules: [
      'roles/finance/aml-analyst',
      'tasks/finance/case-review',
      'guardrails/cross-industry/pii-tr',
    ],
  },
  { modulesDir: '/abs/path/to/modules', language: 'tr' },
);

console.log(composed.text);            // RTCSG-ordered, sectioned prompt
console.log(composed.compositionHash); // 16-char deterministic hash for OTel
console.log(composed.byKind.role?.id); // bucketed access
```

`compose(modules, options)` is the pure form — accepts pre-loaded modules and skips disk I/O.

## RTCSG ordering

Composition canonicalizes module order to **R → T → C → S → G**:

1. Role (single — multiple roles in one flow throw)
2. Tasks (one or more)
3. Contexts (zero or more)
4. Styles (zero or more)
5. Guardrails (zero or more)

`renderPrompt` emits sections under markdown-style `## Role`, `## Task`, `## Context`, `## Style`, `## Guardrail` headers. Localized fields are rendered in `language` (or `fallbackLanguage`) preference order.

## Composition hash

`compositionHash(modules)` returns a stable 16-character hex hash of the ordered `(id, version)` tuples. Same input produces the same hash regardless of the order modules were passed in. The hash is what an observability layer (`@lokomotif/otel-schema`'s `lokomotif.flow.composition_hash` attribute) records.

## Status

`v0.0.x` — pre-release. Surface may evolve before v1.0.0 via RFC.
