import type {
  ContextModule,
  GuardrailModule,
  Language,
  LocalizedString,
  Module,
  RoleModule,
  StyleModule,
  TaskModule,
} from '@lokomotif/schema';

import type { ComposeOptions } from './types.js';

const DEFAULT_FALLBACK: Language = 'en';

/**
 * Render a localized string in the caller's preferred language. Falls
 * back to `fallbackLanguage`, then to whichever language is present.
 * Returns an empty string only when the LocalizedString is empty —
 * which the schema rejects, so this is unreachable in valid input.
 */
export function pickLanguage(
  field: LocalizedString,
  language?: Language,
  fallbackLanguage: Language = DEFAULT_FALLBACK,
): string {
  if (language !== undefined && field[language] !== undefined) {
    return field[language] as string;
  }
  if (field[fallbackLanguage] !== undefined) {
    return field[fallbackLanguage] as string;
  }
  for (const lang of ['tr', 'en'] as const) {
    if (field[lang] !== undefined) return field[lang] as string;
  }
  return '';
}

function pickArray(
  fields: readonly LocalizedString[] | undefined,
  language?: Language,
  fallback?: Language,
): string[] {
  if (fields === undefined) return [];
  return fields.map((f) => pickLanguage(f, language, fallback)).filter((s) => s.length > 0);
}

function bullets(items: readonly string[]): string {
  return items.map((s) => `- ${s}`).join('\n');
}

function renderRole(module: RoleModule, opts: ComposeOptions): string {
  const lang = opts.language;
  const fb = opts.fallbackLanguage;
  const parts: string[] = [];
  parts.push(`## Role  _(${module.id} v${module.version})_`);
  parts.push('');
  parts.push(pickLanguage(module.body.identity, lang, fb));
  if (module.body.expertise.length > 0) {
    parts.push('');
    parts.push('Expertise:');
    parts.push(bullets(pickArray(module.body.expertise, lang, fb)));
  }
  if (module.body.perspective !== undefined) {
    parts.push('');
    parts.push(`Perspective: ${pickLanguage(module.body.perspective, lang, fb)}`);
  }
  if (module.body.authority !== undefined) {
    parts.push('');
    parts.push(`Authority: ${pickLanguage(module.body.authority, lang, fb)}`);
  }
  return parts.join('\n');
}

function renderTask(module: TaskModule, opts: ComposeOptions): string {
  const lang = opts.language;
  const fb = opts.fallbackLanguage;
  const parts: string[] = [];
  parts.push(`## Task  _(${module.id} v${module.version})_`);
  parts.push('');
  parts.push(pickLanguage(module.body.instructions, lang, fb));
  parts.push('');
  parts.push(`Output format: ${module.body.output_format.type}`);
  if (module.body.output_format.description !== undefined) {
    parts.push(pickLanguage(module.body.output_format.description, lang, fb));
  }
  if (module.body.constraints !== undefined && module.body.constraints.length > 0) {
    parts.push('');
    parts.push('Constraints:');
    parts.push(bullets(pickArray(module.body.constraints, lang, fb)));
  }
  return parts.join('\n');
}

function renderContext(module: ContextModule, opts: ComposeOptions): string {
  const lang = opts.language;
  const fb = opts.fallbackLanguage;
  const parts: string[] = [];
  parts.push(`## Context  _(${module.id} v${module.version})_`);
  parts.push('');
  parts.push(pickLanguage(module.body.domain, lang, fb));
  if (module.body.data_boundaries !== undefined && module.body.data_boundaries.length > 0) {
    parts.push('');
    parts.push('Data boundaries:');
    parts.push(bullets(pickArray(module.body.data_boundaries, lang, fb)));
  }
  if (
    module.body.regulatory_references !== undefined &&
    module.body.regulatory_references.length > 0
  ) {
    parts.push('');
    parts.push('Regulatory references:');
    for (const ref of module.body.regulatory_references) {
      const summary =
        ref.summary !== undefined ? `: ${pickLanguage(ref.summary, lang, fb)}` : '';
      const section = ref.section !== undefined ? ` ${ref.section}` : '';
      parts.push(`- ${ref.framework}${section}${summary}`);
    }
  }
  if (
    module.body.operating_constraints !== undefined &&
    module.body.operating_constraints.length > 0
  ) {
    parts.push('');
    parts.push('Operating constraints:');
    parts.push(bullets(pickArray(module.body.operating_constraints, lang, fb)));
  }
  return parts.join('\n');
}

function renderStyle(module: StyleModule, opts: ComposeOptions): string {
  const lang = opts.language;
  const fb = opts.fallbackLanguage;
  const parts: string[] = [];
  parts.push(`## Style  _(${module.id} v${module.version})_`);
  parts.push('');
  parts.push(`Voice: ${pickLanguage(module.body.voice, lang, fb)}`);
  parts.push(`Audience: ${pickLanguage(module.body.audience, lang, fb)}`);
  if (module.body.register !== undefined) {
    parts.push(`Register: ${module.body.register}`);
  }
  if (module.body.examples !== undefined && module.body.examples.length > 0) {
    parts.push('');
    parts.push('Examples:');
    parts.push(bullets(pickArray(module.body.examples, lang, fb)));
  }
  if (module.body.avoid !== undefined && module.body.avoid.length > 0) {
    parts.push('');
    parts.push('Avoid:');
    parts.push(bullets(pickArray(module.body.avoid, lang, fb)));
  }
  return parts.join('\n');
}

function renderGuardrail(module: GuardrailModule, opts: ComposeOptions): string {
  const lang = opts.language;
  const fb = opts.fallbackLanguage;
  const parts: string[] = [];
  const sev = module.body.severity ?? 'high';
  parts.push(`## Guardrail  _(${module.id} v${module.version} · severity: ${sev})_`);
  parts.push('');
  parts.push('Forbidden:');
  for (const f of module.body.forbidden) {
    const rule = pickLanguage(f.rule, lang, fb);
    if (f.rationale !== undefined) {
      parts.push(`- ${rule}  _(why: ${pickLanguage(f.rationale, lang, fb)})_`);
    } else {
      parts.push(`- ${rule}`);
    }
  }
  if (module.body.required_actions !== undefined && module.body.required_actions.length > 0) {
    parts.push('');
    parts.push('Required actions:');
    parts.push(bullets(pickArray(module.body.required_actions, lang, fb)));
  }
  if (module.body.escalation !== undefined) {
    parts.push('');
    parts.push(`Escalation: ${pickLanguage(module.body.escalation, lang, fb)}`);
  }
  if (module.body.audit_requirements !== undefined && module.body.audit_requirements.length > 0) {
    parts.push('');
    parts.push('Audit requirements:');
    parts.push(bullets(pickArray(module.body.audit_requirements, lang, fb)));
  }
  return parts.join('\n');
}

/**
 * Render a single module to its section.
 */
export function renderModule(module: Module, opts: ComposeOptions = {}): string {
  switch (module.kind) {
    case 'role':
      return renderRole(module, opts);
    case 'task':
      return renderTask(module, opts);
    case 'context':
      return renderContext(module, opts);
    case 'style':
      return renderStyle(module, opts);
    case 'guardrail':
      return renderGuardrail(module, opts);
  }
}

/**
 * Render the full composition. Modules are expected in canonical RTCSG
 * order — `compose()` produces that order.
 */
export function renderPrompt(
  modules: readonly Module[],
  flow: { readonly name?: string; readonly description?: string } = {},
  opts: ComposeOptions = {},
): string {
  const sections: string[] = [];
  if (flow.name !== undefined) {
    sections.push(`# ${flow.name}`);
  }
  if (flow.description !== undefined) {
    sections.push(flow.description);
  }
  for (const module of modules) {
    sections.push(renderModule(module, opts));
  }
  return `${sections.join('\n\n')}\n`;
}
