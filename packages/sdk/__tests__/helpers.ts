import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export function makeTempModulesDir(prefix = 'lokomotif-sdk-'): string {
  const root = mkdtempSync(join(tmpdir(), prefix));
  const modules = join(root, 'modules');
  mkdirSync(modules, { recursive: true });
  return modules;
}

export function writeFixture(modulesDir: string, relativePath: string, content: string): string {
  const abs = join(modulesDir, relativePath);
  const parent = abs.substring(0, abs.lastIndexOf('/'));
  mkdirSync(parent, { recursive: true });
  writeFileSync(abs, content, 'utf-8');
  return abs;
}

export const ROLE_YAML = `id: roles/cross-industry/test-role
version: 1.0.0
kind: role
title: "Test role"
description: "Fixture for SDK tests."
industry: ["cross-industry"]
languages: ["tr", "en"]
owner: lokomotif-core
license: Apache-2.0
body:
  identity:
    tr: "Bir test rolüsün."
    en: "You are a test role."
  expertise:
    - tr: "Alan bir"
      en: "Domain one"
`;

export const TASK_YAML = `id: tasks/cross-industry/test-task
version: 1.0.0
kind: task
title: "Test task"
description: "Fixture for SDK tests."
industry: ["cross-industry"]
languages: ["en"]
owner: lokomotif-core
license: Apache-2.0
body:
  instructions:
    en: "Do the test thing."
  output_format:
    type: markdown
`;

export const CONTEXT_YAML = `id: contexts/finance/test-context
version: 1.0.0
kind: context
title: "Test context"
description: "Fixture for SDK tests."
industry: ["finance"]
languages: ["en"]
owner: lokomotif-core
license: Apache-2.0
body:
  domain:
    en: "Generic finance test domain."
  regulatory_references:
    - framework: KVKK
      summary:
        en: "Personal data protection."
`;

export const STYLE_YAML = `id: styles/cross-industry/test-style
version: 1.0.0
kind: style
title: "Test style"
description: "Fixture for SDK tests."
industry: ["cross-industry"]
languages: ["en"]
owner: lokomotif-core
license: Apache-2.0
body:
  voice:
    en: "Senior, specific."
  audience:
    en: "Test reader."
  register: professional
`;

export const GUARDRAIL_YAML = `id: guardrails/cross-industry/test-guardrail
version: 1.0.0
kind: guardrail
title: "Test guardrail"
description: "Fixture for SDK tests."
industry: ["cross-industry"]
languages: ["en"]
owner: lokomotif-core
license: Apache-2.0
body:
  forbidden:
    - rule:
        en: "Do not do bad things."
  severity: high
`;

export const SECOND_ROLE_YAML = `id: roles/cross-industry/another-role
version: 1.0.0
kind: role
title: "Another role"
description: "A second role fixture."
industry: ["cross-industry"]
languages: ["en"]
owner: lokomotif-core
license: Apache-2.0
body:
  identity:
    en: "You are another role."
  expertise:
    - en: "Other expertise."
`;

export function seedAllKinds(modulesDir: string): void {
  writeFixture(modulesDir, 'roles/cross-industry/test-role.yaml', ROLE_YAML);
  writeFixture(modulesDir, 'tasks/cross-industry/test-task.yaml', TASK_YAML);
  writeFixture(modulesDir, 'contexts/finance/test-context.yaml', CONTEXT_YAML);
  writeFixture(modulesDir, 'styles/cross-industry/test-style.yaml', STYLE_YAML);
  writeFixture(modulesDir, 'guardrails/cross-industry/test-guardrail.yaml', GUARDRAIL_YAML);
}
