/**
 * @lokomotif/blueprint-n8n — adapt RTCSG composition to an n8n workflow.
 *
 * Output is a workflow JSON with three nodes (manual trigger → Anthropic
 * chat → set output) wired in series. The composed prompt becomes the
 * Anthropic node's system message; the trigger payload becomes the
 * user message. The composition hash is preserved in the workflow's
 * meta block so an exported flow remains traceable to the originating
 * Lokomotif composition.
 */

import type { ComposedPrompt } from '@lokomotif/sdk';

const DEFAULT_MODEL = 'claude-sonnet-4-6';
const SCHEMA_VERSION = 1;

export type N8nAdaptOptions = {
  /** Workflow name as it appears in n8n. Required. */
  readonly workflowName: string;
  /** Optional model id forwarded into the Anthropic chat node. */
  readonly modelName?: string;
  /** Pass-through completion params. */
  readonly modelParams?: Readonly<Record<string, unknown>>;
};

export type N8nNode = {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly typeVersion: number;
  readonly position: readonly [number, number];
  readonly parameters: Readonly<Record<string, unknown>>;
  readonly credentials?: Readonly<Record<string, unknown>>;
};

export type N8nWorkflow = {
  readonly name: string;
  readonly active: false;
  readonly nodes: readonly N8nNode[];
  readonly connections: Readonly<Record<string, unknown>>;
  readonly settings: Readonly<Record<string, unknown>>;
  readonly meta: {
    readonly schemaVersion: number;
    readonly lokomotif: {
      readonly composition_hash: string;
      readonly modules: ReadonlyArray<{ readonly id: string; readonly version: string; readonly kind: string }>;
    };
  };
};

export function adaptToN8n(composed: ComposedPrompt, options: N8nAdaptOptions): N8nWorkflow {
  const modelName = options.modelName ?? DEFAULT_MODEL;

  const triggerNode: N8nNode = {
    id: 'trigger',
    name: 'Manual Trigger',
    type: 'n8n-nodes-base.manualTrigger',
    typeVersion: 1,
    position: [240, 300],
    parameters: {},
  };

  const llmNode: N8nNode = {
    id: 'llm',
    name: 'Anthropic Chat',
    type: '@n8n/n8n-nodes-langchain.lmChatAnthropic',
    typeVersion: 1,
    position: [520, 300],
    parameters: {
      model: modelName,
      options: options.modelParams ?? {},
      messages: {
        messageValues: [
          { role: 'system', message: composed.text },
          { role: 'user', message: '={{ $json.user_input }}' },
        ],
      },
    },
  };

  const outputNode: N8nNode = {
    id: 'output',
    name: 'Set Output',
    type: 'n8n-nodes-base.set',
    typeVersion: 3,
    position: [800, 300],
    parameters: {
      keepOnlySet: true,
      values: {
        string: [
          { name: 'answer', value: '={{ $json.text }}' },
          { name: 'composition_hash', value: composed.compositionHash },
        ],
      },
    },
  };

  const connections = {
    'Manual Trigger': {
      main: [[{ node: 'Anthropic Chat', type: 'main', index: 0 }]],
    },
    'Anthropic Chat': {
      main: [[{ node: 'Set Output', type: 'main', index: 0 }]],
    },
  };

  return {
    name: options.workflowName,
    active: false,
    nodes: [triggerNode, llmNode, outputNode],
    connections,
    settings: { executionOrder: 'v1' },
    meta: {
      schemaVersion: SCHEMA_VERSION,
      lokomotif: {
        composition_hash: composed.compositionHash,
        modules: composed.modules.map((m) => ({ id: m.id, version: m.version, kind: m.kind })),
      },
    },
  };
}

export function renderN8nJson(workflow: N8nWorkflow): string {
  return `${JSON.stringify(workflow, null, 2)}\n`;
}

export const N8N_BLUEPRINT_DEFAULTS = {
  modelName: DEFAULT_MODEL,
  schemaVersion: SCHEMA_VERSION,
} as const;
