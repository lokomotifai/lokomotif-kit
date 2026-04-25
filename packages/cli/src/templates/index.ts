import type { Kind } from '@lokomotif/schema';

import { contextTemplate } from './context.js';
import { evalPlaceholder } from './eval-placeholder.js';
import { guardrailTemplate } from './guardrail.js';
import { roleTemplate } from './role.js';
import { styleTemplate } from './style.js';
import { taskTemplate } from './task.js';

export type TemplateInput = {
  readonly kind: Kind;
  readonly industry: string;
  readonly name: string;
};

export type TemplateOutput = {
  readonly id: string;
  readonly modulePath: string;
  readonly moduleContent: string;
  readonly testPath: string;
  readonly testContent: string;
};

const KIND_PLURAL: Record<Kind, string> = {
  role: 'roles',
  task: 'tasks',
  context: 'contexts',
  style: 'styles',
  guardrail: 'guardrails',
};

export function moduleId(input: TemplateInput): string {
  return `${KIND_PLURAL[input.kind]}/${input.industry}/${input.name}`;
}

export function modulePath(input: TemplateInput): string {
  return `modules/${KIND_PLURAL[input.kind]}/${input.industry}/${input.name}.yaml`;
}

export function testPath(input: TemplateInput): string {
  return `modules/${KIND_PLURAL[input.kind]}/${input.industry}/__tests__/${input.name}.eval.yaml`;
}

export function renderTemplate(input: TemplateInput): TemplateOutput {
  const id = moduleId(input);
  const args = { id, industry: input.industry, name: input.name };

  const moduleContent = (() => {
    switch (input.kind) {
      case 'role':
        return roleTemplate(args);
      case 'task':
        return taskTemplate(args);
      case 'context':
        return contextTemplate(args);
      case 'style':
        return styleTemplate(args);
      case 'guardrail':
        return guardrailTemplate(args);
    }
  })();

  return {
    id,
    modulePath: modulePath(input),
    moduleContent,
    testPath: testPath(input),
    testContent: evalPlaceholder({ id }),
  };
}
