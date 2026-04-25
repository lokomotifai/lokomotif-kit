# `@lokomotif/blueprint-dify`

Adapt a `ComposedPrompt` to a Dify workflow definition that imports cleanly into a Dify project.

## Install

```bash
pnpm add @lokomotif/sdk @lokomotif/blueprint-dify
```

## Usage

```ts
import { compose, loadModules } from '@lokomotif/sdk';
import { adaptToDify, renderDifyYaml } from '@lokomotif/blueprint-dify';
import { writeFileSync } from 'node:fs';

const modules = loadModules([...], { modulesDir });
const composed = compose(modules);
const definition = adaptToDify(composed, {
  appName: 'aml-review',
  modelProvider: 'anthropic',
  modelName: 'claude-sonnet-4-6',
});

writeFileSync('aml-review.dify.yaml', renderDifyYaml(definition));
```

The output is a workflow-mode Dify definition. Import it from the Dify dashboard via _Apps → Create from DSL_.

## API

```ts
adaptToDify(composed, options)  → DifyAppDefinition
renderDifyYaml(definition)      → string  (importable YAML)
```

## What goes where

- The composed RTCSG prompt becomes the `system` slot of an LLM node.
- The user input is wired through a `{{#sys.query#}}` template variable so end users can drive the workflow from the Dify chat UI.
- The composition hash is recorded in the app description for traceability.
- Model provider and name are passed through; sensible defaults target Anthropic + claude-sonnet-4-6.

## Caveats

Dify's workflow DSL evolves between releases. The output here targets the current major; minor schema fields may need adjustment for older or pre-release versions. PRs welcome to extend coverage.

## Phase status

Ships in **Phase 7** of [`IMPLEMENTATION_PLAN.md`](../../IMPLEMENTATION_PLAN.md).
