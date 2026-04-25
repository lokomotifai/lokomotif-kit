import { describe, expect, it } from 'vitest';

import { compose, loadModules, pickLanguage, renderModule } from '../src/index.js';

import { makeTempModulesDir, seedAllKinds } from './helpers.js';

describe('pickLanguage', () => {
  it('returns preferred language when present', () => {
    const text = pickLanguage({ tr: 'tr-text', en: 'en-text' }, 'tr');
    expect(text).toBe('tr-text');
  });

  it('falls back to fallbackLanguage', () => {
    const text = pickLanguage({ en: 'en-only' }, 'tr', 'en');
    expect(text).toBe('en-only');
  });

  it('falls back to any present language as last resort', () => {
    const text = pickLanguage({ tr: 'only-tr' });
    expect(text).toBe('only-tr');
  });
});

describe('renderModule', () => {
  it('renders role section with identity and expertise', () => {
    const modulesDir = makeTempModulesDir();
    seedAllKinds(modulesDir);
    const [role] = loadModules(['roles/cross-industry/test-role'], { modulesDir });
    expect(role).toBeDefined();
    if (role === undefined) return;
    const text = renderModule(role, { language: 'tr' });
    expect(text).toContain('## Role');
    expect(text).toContain('Bir test rolüsün.');
    expect(text).toContain('Alan bir');
  });

  it('renders task section with output format and constraints', () => {
    const modulesDir = makeTempModulesDir();
    seedAllKinds(modulesDir);
    const [task] = loadModules(['tasks/cross-industry/test-task'], { modulesDir });
    expect(task).toBeDefined();
    if (task === undefined) return;
    const text = renderModule(task);
    expect(text).toContain('## Task');
    expect(text).toContain('Output format: markdown');
  });

  it('renders guardrail with severity in heading', () => {
    const modulesDir = makeTempModulesDir();
    seedAllKinds(modulesDir);
    const [guardrail] = loadModules(['guardrails/cross-industry/test-guardrail'], {
      modulesDir,
    });
    expect(guardrail).toBeDefined();
    if (guardrail === undefined) return;
    const text = renderModule(guardrail);
    expect(text).toContain('## Guardrail');
    expect(text).toContain('severity: high');
  });
});

describe('renderPrompt (via compose)', () => {
  it('emits sections in RTCSG order', () => {
    const modulesDir = makeTempModulesDir();
    seedAllKinds(modulesDir);
    const composed = compose(
      loadModules(
        [
          'guardrails/cross-industry/test-guardrail',
          'styles/cross-industry/test-style',
          'contexts/finance/test-context',
          'tasks/cross-industry/test-task',
          'roles/cross-industry/test-role',
        ],
        { modulesDir },
      ),
    );
    const idx = (h: string) => composed.text.indexOf(h);
    expect(idx('## Role')).toBeLessThan(idx('## Task'));
    expect(idx('## Task')).toBeLessThan(idx('## Context'));
    expect(idx('## Context')).toBeLessThan(idx('## Style'));
    expect(idx('## Style')).toBeLessThan(idx('## Guardrail'));
  });
});
