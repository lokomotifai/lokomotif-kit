import { describe, expect, it } from 'vitest';

import {
  FlowError,
  compose,
  composeFlow,
  loadModule,
  loadModules,
} from '../src/index.js';

import {
  ROLE_YAML,
  SECOND_ROLE_YAML,
  TASK_YAML,
  STYLE_YAML,
  GUARDRAIL_YAML,
  makeTempModulesDir,
  seedAllKinds,
  writeFixture,
} from './helpers.js';

describe('compose (pure)', () => {
  it('orders modules in canonical RTCSG order', () => {
    const modulesDir = makeTempModulesDir();
    seedAllKinds(modulesDir);
    const modules = loadModules(
      [
        'guardrails/cross-industry/test-guardrail',
        'styles/cross-industry/test-style',
        'contexts/finance/test-context',
        'tasks/cross-industry/test-task',
        'roles/cross-industry/test-role',
      ],
      { modulesDir },
    );

    const composed = compose(modules);
    expect(composed.modules.map((m) => m.kind)).toEqual([
      'role',
      'task',
      'context',
      'style',
      'guardrail',
    ]);
  });

  it('buckets by kind and tracks single role', () => {
    const modulesDir = makeTempModulesDir();
    seedAllKinds(modulesDir);
    const modules = loadModules(
      [
        'roles/cross-industry/test-role',
        'tasks/cross-industry/test-task',
        'guardrails/cross-industry/test-guardrail',
      ],
      { modulesDir },
    );

    const composed = compose(modules);
    expect(composed.byKind.role?.id).toBe('roles/cross-industry/test-role');
    expect(composed.byKind.tasks).toHaveLength(1);
    expect(composed.byKind.guardrails).toHaveLength(1);
    expect(composed.byKind.contexts).toHaveLength(0);
    expect(composed.byKind.styles).toHaveLength(0);
  });

  it('rejects multiple roles in one composition', () => {
    const modulesDir = makeTempModulesDir();
    writeFixture(modulesDir, 'roles/cross-industry/test-role.yaml', ROLE_YAML);
    writeFixture(modulesDir, 'roles/cross-industry/another-role.yaml', SECOND_ROLE_YAML);
    writeFixture(modulesDir, 'tasks/cross-industry/test-task.yaml', TASK_YAML);
    const modules = loadModules(
      [
        'roles/cross-industry/test-role',
        'roles/cross-industry/another-role',
        'tasks/cross-industry/test-task',
      ],
      { modulesDir },
    );
    expect(() => compose(modules)).toThrow(/multiple role/);
  });

  it('rejects empty composition', () => {
    expect(() => compose([])).toThrow(FlowError);
  });

  it('rejects duplicate module IDs', () => {
    const modulesDir = makeTempModulesDir();
    writeFixture(modulesDir, 'roles/cross-industry/test-role.yaml', ROLE_YAML);
    writeFixture(modulesDir, 'tasks/cross-industry/test-task.yaml', TASK_YAML);
    const role = loadModule('roles/cross-industry/test-role', { modulesDir });
    const task = loadModule('tasks/cross-industry/test-task', { modulesDir });
    expect(() => compose([role, task, role])).toThrow(/duplicate/);
  });

  it('rejects compositions with neither role nor task', () => {
    const modulesDir = makeTempModulesDir();
    writeFixture(modulesDir, 'guardrails/cross-industry/test-guardrail.yaml', GUARDRAIL_YAML);
    writeFixture(modulesDir, 'styles/cross-industry/test-style.yaml', STYLE_YAML);
    const modules = loadModules(
      [
        'guardrails/cross-industry/test-guardrail',
        'styles/cross-industry/test-style',
      ],
      { modulesDir },
    );
    expect(() => compose(modules)).toThrow(/empty in the structural slots|role or a task/);
  });

  it('produces stable compositionHash regardless of input order', () => {
    const modulesDir = makeTempModulesDir();
    seedAllKinds(modulesDir);
    const ids = [
      'roles/cross-industry/test-role',
      'tasks/cross-industry/test-task',
      'guardrails/cross-industry/test-guardrail',
    ];
    const a = compose(loadModules(ids, { modulesDir }));
    const b = compose(loadModules([...ids].reverse(), { modulesDir }));
    expect(a.compositionHash).toBe(b.compositionHash);
    expect(a.compositionHash).toMatch(/^[0-9a-f]{16}$/);
  });

  it('attaches flow metadata when supplied', () => {
    const modulesDir = makeTempModulesDir();
    seedAllKinds(modulesDir);
    const modules = loadModules(
      ['roles/cross-industry/test-role', 'tasks/cross-industry/test-task'],
      { modulesDir },
    );
    const composed = compose(modules, {
      flow: { name: 'fx', description: 'd', modules: [] },
    });
    expect(composed.flow).toEqual({ name: 'fx', description: 'd' });
    expect(composed.text).toContain('# fx');
    expect(composed.text).toContain('d');
  });
});

describe('composeFlow', () => {
  it('loads + composes from a flow definition', () => {
    const modulesDir = makeTempModulesDir();
    seedAllKinds(modulesDir);
    const composed = composeFlow(
      {
        name: 'demo',
        modules: [
          'roles/cross-industry/test-role',
          'tasks/cross-industry/test-task',
          'contexts/finance/test-context',
        ],
      },
      { modulesDir },
    );
    expect(composed.modules).toHaveLength(3);
    expect(composed.text).toContain('## Role');
    expect(composed.text).toContain('## Task');
    expect(composed.text).toContain('## Context');
  });
});
