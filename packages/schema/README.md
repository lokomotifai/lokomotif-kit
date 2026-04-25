# `@lokomotif/schema`

The contract every Lokomotif RTCSG module conforms to.

This package owns the JSON Schema definition, the TypeScript validator, and the generation pipelines that compile the schema into TypeScript types and Pydantic models. It is the single source of truth — modules, the CLI, the SDK, and the eval harness all consume it.

## What is shipped

- `schemas/module.schema.json` — the JSON Schema (draft-07) definition. The canonical contract.
- `dist/index.js` — TypeScript validator with a Result-returning API. Re-exports types and enums.
- `src/generated/module.types.ts` — TypeScript types generated from the schema. Do not edit by hand.
- `packages/eval/src/lokomotif_schema/` (sibling package) — Pydantic models generated from the schema. Same source, different output.

## API

```ts
import { validate, type Module } from '@lokomotif/schema';

const result = validate(parsedYaml);
if (result.ok) {
  const module: Module = result.data;
  // …
} else {
  for (const err of result.errors) {
    console.error(`${err.path} (${err.keyword}): ${err.message}`);
  }
}
```

The `Module` type is a discriminated union over `kind`. Narrowing on `kind` gives you the kind-specific body type:

```ts
if (result.ok && result.data.kind === 'role') {
  // result.data.body is RoleBody
}
```

## Five kinds

| Kind | Body type | Required body fields |
|------|-----------|----------------------|
| `role` | `RoleBody` | `identity`, `expertise` |
| `task` | `TaskBody` | `instructions`, `output_format` |
| `context` | `ContextBody` | `domain` |
| `style` | `StyleBody` | `voice`, `audience` |
| `guardrail` | `GuardrailBody` | `forbidden` |

Optional fields and refinements live in the schema. See `schemas/module.schema.json` for the full surface.

## LocalizedString

Every human-readable field is a localized string:

```yaml
identity:
  tr: "Bir AML uzmanı olarak..."
  en: "Acting as an AML analyst..."
```

At least one language must be present. Cross-field parity (every field present in every declared language) is enforced softly at lint time, not at schema time. See `IMPLEMENTATION_PLAN.md` § Cross-cutting disciplines.

## Industry taxonomy

`module.industry` is an enum of fifteen sectors plus `cross-industry`. Extending the taxonomy requires an RFC. See `Lokomotif-Kit.md` § _RTCSG module conventions_.

## Generation

The schema is the source. Types are generated, not authored.

```bash
pnpm -F @lokomotif/schema generate     # both targets
pnpm -F @lokomotif/schema generate:ts  # TypeScript types only
pnpm -F @lokomotif/schema generate:py  # Pydantic models only
```

The TypeScript generator uses [`json-schema-to-typescript`](https://github.com/bcherny/json-schema-to-typescript). The Python generator uses [`datamodel-code-generator`](https://github.com/koxudaxi/datamodel-code-generator), invoked via `uv run` in `packages/eval`.

CI verifies that committed generated files are up to date by running `pnpm generate` and asserting `git diff --exit-code`.

## Validating modules

The `pnpm validate:modules` script (called from the repo root via turborepo) walks `modules/**/*.yaml`, validates each file, and reports failures with paths and JSON Pointers.

## Schema evolution

Schema changes require an RFC. See [`GOVERNANCE.md`](../../GOVERNANCE.md). Major bumps include a written migration guide and a follow-up PR that updates fixtures and any affected modules.
