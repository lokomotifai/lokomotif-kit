# `@lokomotif/blueprint-n8n`

Adapt a `ComposedPrompt` to an n8n workflow JSON that imports cleanly via _Workflows → Import from File_.

## Install

```bash
pnpm add @lokomotif/sdk @lokomotif/blueprint-n8n
```

## Usage

```ts
import { compose, loadModules } from '@lokomotif/sdk';
import { adaptToN8n, renderN8nJson } from '@lokomotif/blueprint-n8n';
import { writeFileSync } from 'node:fs';

const modules = loadModules([...], { modulesDir });
const composed = compose(modules);
const workflow = adaptToN8n(composed, {
  workflowName: 'aml-review',
});

writeFileSync('aml-review.n8n.json', renderN8nJson(workflow));
```

## API

```ts
adaptToN8n(composed, options)  → N8nWorkflow
renderN8nJson(workflow)         → string  (importable JSON)
```

## What goes where

The output workflow has three nodes:

1. **Manual Trigger** — `n8n-nodes-base.manualTrigger`. The starting node; in production replace with your real trigger (webhook, schedule, etc.).
2. **Anthropic Chat** — `@n8n/n8n-nodes-langchain.lmChatAnthropic` carrying the composed RTCSG prompt as the system message and the trigger payload as the user message.
3. **Set output** — `n8n-nodes-base.set` exposing the LLM response to downstream nodes.

The composition hash is recorded in the workflow's `meta` field so an n8n export can be traced back to the originating Lokomotif composition.

## Caveats

n8n's node parameter shape evolves between releases. The output here targets the LangChain integration nodes that ship with current n8n. Operators may need to swap the LLM node type for their preferred provider.

## Phase status

Ships in **Phase 7** of [`IMPLEMENTATION_PLAN.md`](../../IMPLEMENTATION_PLAN.md).
