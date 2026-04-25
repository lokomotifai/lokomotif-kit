/**
 * @lokomotif/sdk — public API.
 *
 * Runtime-agnostic composition over RTCSG modules. The SDK has zero
 * vendor dependencies; runtime adapters live in `blueprints/`.
 *
 * Surface:
 *
 *   loadModule, loadModules        — disk loaders
 *   loadFlow                       — flow YAML parser
 *   compose                        — pure composer
 *   composeFlow, composeFlowFile   — convenience composers
 *   renderPrompt, renderModule     — text rendering helpers
 *   compositionHash                — deterministic hash for OTel
 *   pickLanguage                   — LocalizedString accessor
 *   LoadModuleError, FlowError     — typed failure paths
 */

export { loadModule, loadModules } from './load-module.js';
export { loadFlow, assertFlow } from './load-flow.js';
export { compose, composeFlow, composeFlowFile } from './compose.js';
export { renderPrompt, renderModule, pickLanguage } from './render.js';
export { compositionHash } from './hash.js';
export { LoadModuleError, FlowError } from './errors.js';
export type { LoadModuleErrorReason } from './errors.js';
export type {
  ComposeFlowOptions,
  ComposeOptions,
  ComposedByKind,
  ComposedPrompt,
  Flow,
  LoadOptions,
} from './types.js';
