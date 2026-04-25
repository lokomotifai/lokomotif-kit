import { describe, expect, it } from 'vitest';

import { compositionHash, loadModules } from '../src/index.js';

import { makeTempModulesDir, seedAllKinds } from './helpers.js';

describe('compositionHash', () => {
  it('returns a 16-char hex string', () => {
    const modulesDir = makeTempModulesDir();
    seedAllKinds(modulesDir);
    const modules = loadModules(['roles/cross-industry/test-role'], { modulesDir });
    const hash = compositionHash(modules);
    expect(hash).toMatch(/^[0-9a-f]{16}$/);
  });

  it('is deterministic', () => {
    const modulesDir = makeTempModulesDir();
    seedAllKinds(modulesDir);
    const ids = [
      'roles/cross-industry/test-role',
      'tasks/cross-industry/test-task',
      'guardrails/cross-industry/test-guardrail',
    ];
    const modules = loadModules(ids, { modulesDir });
    const a = compositionHash(modules);
    const b = compositionHash(modules);
    expect(a).toBe(b);
  });

  it('is independent of input order', () => {
    const modulesDir = makeTempModulesDir();
    seedAllKinds(modulesDir);
    const ids = [
      'roles/cross-industry/test-role',
      'tasks/cross-industry/test-task',
      'guardrails/cross-industry/test-guardrail',
    ];
    const a = compositionHash(loadModules(ids, { modulesDir }));
    const b = compositionHash(loadModules([...ids].reverse(), { modulesDir }));
    expect(a).toBe(b);
  });

  it('changes when a module changes', () => {
    const modulesDir = makeTempModulesDir();
    seedAllKinds(modulesDir);
    const a = compositionHash(
      loadModules(
        ['roles/cross-industry/test-role', 'tasks/cross-industry/test-task'],
        { modulesDir },
      ),
    );
    const b = compositionHash(
      loadModules(['roles/cross-industry/test-role'], { modulesDir }),
    );
    expect(a).not.toBe(b);
  });
});
