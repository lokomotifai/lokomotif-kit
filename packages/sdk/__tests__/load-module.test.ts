import { describe, expect, it } from 'vitest';

import { LoadModuleError, loadModule, loadModules } from '../src/index.js';

import { ROLE_YAML, TASK_YAML, makeTempModulesDir, writeFixture } from './helpers.js';

describe('loadModule', () => {
  it('loads a valid module by id', () => {
    const modulesDir = makeTempModulesDir();
    writeFixture(modulesDir, 'roles/cross-industry/test-role.yaml', ROLE_YAML);

    const m = loadModule('roles/cross-industry/test-role', { modulesDir });
    expect(m.kind).toBe('role');
    expect(m.id).toBe('roles/cross-industry/test-role');
  });

  it('throws not-found for missing modules', () => {
    const modulesDir = makeTempModulesDir();
    expect.assertions(2);
    try {
      loadModule('roles/cross-industry/missing', { modulesDir });
    } catch (err) {
      expect(err).toBeInstanceOf(LoadModuleError);
      expect((err as LoadModuleError).reason).toBe('not-found');
    }
  });

  it('throws parse-error on malformed YAML', () => {
    const modulesDir = makeTempModulesDir();
    writeFixture(
      modulesDir,
      'roles/cross-industry/broken.yaml',
      'id: [this is\n  - not: valid: yaml: [at all\n',
    );
    expect.assertions(2);
    try {
      loadModule('roles/cross-industry/broken', { modulesDir });
    } catch (err) {
      expect(err).toBeInstanceOf(LoadModuleError);
      expect((err as LoadModuleError).reason).toBe('parse-error');
    }
  });

  it('throws validation-error for schema-invalid modules', () => {
    const modulesDir = makeTempModulesDir();
    writeFixture(
      modulesDir,
      'roles/cross-industry/missing-version.yaml',
      `id: roles/cross-industry/missing-version
kind: role
title: "Missing version"
description: "Schema says version is required."
languages: ["en"]
owner: lokomotif-core
license: Apache-2.0
body:
  identity:
    en: "x"
  expertise:
    - en: "y"
`,
    );
    expect.assertions(3);
    try {
      loadModule('roles/cross-industry/missing-version', { modulesDir });
    } catch (err) {
      expect(err).toBeInstanceOf(LoadModuleError);
      expect((err as LoadModuleError).reason).toBe('validation-error');
      expect((err as LoadModuleError).validationErrors?.length).toBeGreaterThan(0);
    }
  });

  it('loads multiple modules in input order', () => {
    const modulesDir = makeTempModulesDir();
    writeFixture(modulesDir, 'roles/cross-industry/test-role.yaml', ROLE_YAML);
    writeFixture(modulesDir, 'tasks/cross-industry/test-task.yaml', TASK_YAML);

    const modules = loadModules(
      ['tasks/cross-industry/test-task', 'roles/cross-industry/test-role'],
      { modulesDir },
    );
    expect(modules.map((m) => m.kind)).toEqual(['task', 'role']);
  });

  it('loadModules fails fast on first error', () => {
    const modulesDir = makeTempModulesDir();
    writeFixture(modulesDir, 'roles/cross-industry/test-role.yaml', ROLE_YAML);

    expect(() =>
      loadModules(
        [
          'roles/cross-industry/test-role',
          'roles/cross-industry/does-not-exist',
        ],
        { modulesDir },
      ),
    ).toThrow(LoadModuleError);
  });
});
