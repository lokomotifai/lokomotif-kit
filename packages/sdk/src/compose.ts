import type {
  ContextModule,
  GuardrailModule,
  Module,
  RoleModule,
  StyleModule,
  TaskModule,
} from '@lokomotif/schema';

import { FlowError } from './errors.js';
import { compositionHash } from './hash.js';
import { loadModules } from './load-module.js';
import { loadFlow } from './load-flow.js';
import { renderPrompt } from './render.js';
import type {
  ComposeFlowOptions,
  ComposeOptions,
  ComposedByKind,
  ComposedPrompt,
  Flow,
} from './types.js';

const KIND_ORDER: Record<Module['kind'], number> = {
  role: 0,
  task: 1,
  context: 2,
  style: 3,
  guardrail: 4,
};

function sortRTCSG(modules: readonly Module[]): Module[] {
  return [...modules].sort((a, b) => {
    const order = KIND_ORDER[a.kind] - KIND_ORDER[b.kind];
    if (order !== 0) return order;
    return a.id.localeCompare(b.id);
  });
}

function bucket(modules: readonly Module[]): ComposedByKind {
  const tasks: TaskModule[] = [];
  const contexts: ContextModule[] = [];
  const styles: StyleModule[] = [];
  const guardrails: GuardrailModule[] = [];
  let role: RoleModule | undefined;

  for (const module of modules) {
    switch (module.kind) {
      case 'role':
        if (role !== undefined) {
          throw new FlowError(
            `multiple role modules in one composition: '${role.id}' and '${module.id}'. RTCSG allows at most one role per flow.`,
          );
        }
        role = module;
        break;
      case 'task':
        tasks.push(module);
        break;
      case 'context':
        contexts.push(module);
        break;
      case 'style':
        styles.push(module);
        break;
      case 'guardrail':
        guardrails.push(module);
        break;
    }
  }

  if (tasks.length === 0 && role === undefined) {
    throw new FlowError(
      'composition is empty in the structural slots. At minimum a role or a task is required.',
    );
  }

  return { role, tasks, contexts, styles, guardrails };
}

function detectDuplicates(modules: readonly Module[]): void {
  const seen = new Set<string>();
  for (const module of modules) {
    if (seen.has(module.id)) {
      throw new FlowError(`duplicate module id in composition: '${module.id}'`);
    }
    seen.add(module.id);
  }
}

/**
 * Pure composition over pre-loaded modules.
 *
 * - Canonicalizes order to RTCSG (R-T-C-S-G; ties broken by id).
 * - Buckets modules by kind for ergonomic access.
 * - Computes a deterministic 16-character hex compositionHash.
 * - Renders the default text representation.
 *
 * Throws `FlowError` on shape problems (duplicate ids, multiple roles,
 * empty composition).
 */
export function compose(
  modules: readonly Module[],
  options: ComposeOptions & { readonly flow?: Flow } = {},
): ComposedPrompt {
  if (modules.length === 0) {
    throw new FlowError('compose() received zero modules');
  }
  detectDuplicates(modules);
  const ordered = sortRTCSG(modules);
  const buckets = bucket(ordered);
  const flowMeta =
    options.flow !== undefined
      ? { name: options.flow.name, description: options.flow.description }
      : undefined;

  return {
    modules: ordered,
    byKind: buckets,
    flow: flowMeta,
    compositionHash: compositionHash(ordered),
    text: renderPrompt(ordered, flowMeta ?? {}, options),
  };
}

/**
 * Convenience that loads modules from a flow definition and composes
 * them. Throws `LoadModuleError` for module-level problems and
 * `FlowError` for composition-level problems.
 */
export function composeFlow(flow: Flow, options: ComposeFlowOptions): ComposedPrompt {
  const modules = loadModules(flow.modules, { modulesDir: options.modulesDir });
  return compose(modules, {
    language: options.language,
    fallbackLanguage: options.fallbackLanguage,
    flow,
  });
}

/**
 * One-shot: read a flow file from disk, load every referenced module,
 * compose them. Convenience for CLI and blueprint authors.
 */
export function composeFlowFile(filePath: string, options: ComposeFlowOptions): ComposedPrompt {
  const flow = loadFlow(filePath);
  return composeFlow(flow, options);
}
