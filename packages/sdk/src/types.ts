import type {
  ContextModule,
  GuardrailModule,
  Language,
  Module,
  RoleModule,
  StyleModule,
  TaskModule,
} from '@lokomotif/schema';

/**
 * A flow is the input to composition: an ordered (or unordered) list of
 * module IDs plus optional metadata. Composition canonicalizes the
 * order; the input array's order is irrelevant to the composed output.
 */
export type Flow = {
  readonly name?: string;
  readonly description?: string;
  readonly modules: readonly string[];
};

/**
 * Options for composition / rendering.
 *
 * `language` selects which language is rendered when a module's body
 * carries multiple. `fallbackLanguage` is consulted when the primary
 * language is missing for a given field.
 */
export type ComposeOptions = {
  readonly language?: Language;
  readonly fallbackLanguage?: Language;
};

/**
 * Bucketed view of the modules that make up a composed prompt.
 *
 * RTCSG enforces at most one role per composition; multiple of any
 * other kind are accepted and rendered in their input order.
 */
export type ComposedByKind = {
  readonly role?: RoleModule;
  readonly tasks: readonly TaskModule[];
  readonly contexts: readonly ContextModule[];
  readonly styles: readonly StyleModule[];
  readonly guardrails: readonly GuardrailModule[];
};

/**
 * The output of composition.
 *
 * `modules` is the canonical RTCSG-ordered list. `byKind` is the same
 * data bucketed for ergonomic access. `text` is the default rendered
 * prompt; blueprints may render their own representations from
 * `byKind`.
 */
export type ComposedPrompt = {
  readonly modules: readonly Module[];
  readonly byKind: ComposedByKind;
  readonly flow?: { readonly name?: string; readonly description?: string };
  readonly compositionHash: string;
  readonly text: string;
};

/**
 * Options accepted by the disk loaders.
 */
export type LoadOptions = {
  /** Absolute path to the directory under which `modules/` content lives. */
  readonly modulesDir: string;
};

/**
 * Compose-from-flow accepts both compose options and a modulesDir.
 */
export type ComposeFlowOptions = LoadOptions & ComposeOptions;
