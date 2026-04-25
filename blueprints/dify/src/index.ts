/**
 * @lokomotif/blueprint-dify — adapt RTCSG composition to a Dify workflow.
 *
 * Output is a workflow-mode Dify app definition with the composed
 * prompt embedded as the system slot of a single LLM node. The
 * composition hash is recorded in the app description so a Dify
 * import can be traced back to a specific Lokomotif composition.
 */

import { stringify as stringifyYaml } from 'yaml';

import type { ComposedPrompt } from '@lokomotif/sdk';

const DEFAULT_MODEL_PROVIDER = 'anthropic';
const DEFAULT_MODEL_NAME = 'claude-sonnet-4-6';

export type DifyAdaptOptions = {
  /** App name as it appears in Dify. Required. */
  readonly appName: string;
  /** Free-text description; the composition hash is appended automatically. */
  readonly description?: string;
  /** Model provider id. Defaults to anthropic. */
  readonly modelProvider?: string;
  /** Model name. Defaults to claude-sonnet-4-6. */
  readonly modelName?: string;
  /** Optional icon emoji for the Dify card. */
  readonly icon?: string;
  /** Optional model-completion parameters forwarded into the LLM node. */
  readonly modelParams?: Readonly<Record<string, unknown>>;
};

export type DifyNode = {
  readonly id: string;
  readonly type: string;
  readonly title: string;
  readonly data: Readonly<Record<string, unknown>>;
};

export type DifyEdge = {
  readonly source: string;
  readonly target: string;
};

export type DifyAppDefinition = {
  readonly version: '0.1.0';
  readonly app: {
    readonly name: string;
    readonly description: string;
    readonly mode: 'workflow';
    readonly icon: string;
  };
  readonly workflow: {
    readonly graph: {
      readonly nodes: readonly DifyNode[];
      readonly edges: readonly DifyEdge[];
    };
  };
  readonly lokomotif: {
    readonly composition_hash: string;
    readonly module_count: number;
  };
};

export function adaptToDify(
  composed: ComposedPrompt,
  options: DifyAdaptOptions,
): DifyAppDefinition {
  const provider = options.modelProvider ?? DEFAULT_MODEL_PROVIDER;
  const modelName = options.modelName ?? DEFAULT_MODEL_NAME;
  const description = composeDescription(composed, options.description);

  const startNode: DifyNode = {
    id: 'start',
    type: 'start',
    title: 'Start',
    data: {
      variables: [{ variable: 'user_input', label: 'User input', type: 'string', required: true }],
    },
  };

  const llmNode: DifyNode = {
    id: 'llm',
    type: 'llm',
    title: 'Lokomotif RTCSG composition',
    data: {
      model: {
        provider,
        name: modelName,
        completion_params: options.modelParams ?? {},
      },
      prompt_template: [
        { role: 'system', text: composed.text },
        { role: 'user', text: '{{#start.user_input#}}' },
      ],
      lokomotif: {
        composition_hash: composed.compositionHash,
        modules: composed.modules.map((m) => ({ id: m.id, version: m.version, kind: m.kind })),
      },
    },
  };

  const endNode: DifyNode = {
    id: 'end',
    type: 'end',
    title: 'End',
    data: {
      outputs: [{ variable: 'answer', value_selector: ['llm', 'text'] }],
    },
  };

  return {
    version: '0.1.0',
    app: {
      name: options.appName,
      description,
      mode: 'workflow',
      icon: options.icon ?? '🚂',
    },
    workflow: {
      graph: {
        nodes: [startNode, llmNode, endNode],
        edges: [
          { source: 'start', target: 'llm' },
          { source: 'llm', target: 'end' },
        ],
      },
    },
    lokomotif: {
      composition_hash: composed.compositionHash,
      module_count: composed.modules.length,
    },
  };
}

export function renderDifyYaml(definition: DifyAppDefinition): string {
  return stringifyYaml(definition, { lineWidth: 0 });
}

function composeDescription(composed: ComposedPrompt, base: string | undefined): string {
  const flowName = composed.flow?.name;
  const baseText = base ?? composed.flow?.description ?? '';
  const provenance = `Lokomotif composition ${composed.compositionHash} (${composed.modules.length} modules)`;
  const head = flowName !== undefined ? `${flowName} — ` : '';
  return baseText.length > 0 ? `${head}${baseText}\n\n${provenance}` : `${head}${provenance}`;
}

export const DIFY_BLUEPRINT_DEFAULTS = {
  modelProvider: DEFAULT_MODEL_PROVIDER,
  modelName: DEFAULT_MODEL_NAME,
} as const;
