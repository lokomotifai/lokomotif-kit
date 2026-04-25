import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { FlowError, assertFlow, loadFlow } from '../src/index.js';

import { makeTempModulesDir } from './helpers.js';

describe('loadFlow', () => {
  it('parses a simple flow YAML', () => {
    const root = makeTempModulesDir();
    const path = join(root, '..', 'flow.yaml');
    writeFileSync(
      path,
      `name: example
description: "An example flow."
modules:
  - roles/finance/aml-analyst
  - tasks/finance/case-review
`,
      'utf-8',
    );
    const flow = loadFlow(path);
    expect(flow.name).toBe('example');
    expect(flow.description).toBe('An example flow.');
    expect(flow.modules).toEqual([
      'roles/finance/aml-analyst',
      'tasks/finance/case-review',
    ]);
  });

  it('throws when the file is missing', () => {
    expect(() => loadFlow('/this/path/does/not/exist.yaml')).toThrow(FlowError);
  });
});

describe('assertFlow', () => {
  it('rejects non-objects', () => {
    expect(() => assertFlow(null)).toThrow(FlowError);
    expect(() => assertFlow('string')).toThrow(FlowError);
    expect(() => assertFlow([1, 2, 3])).not.toThrow(); // arrays are objects but lack `modules`; let's verify
  });

  it('rejects empty modules array', () => {
    expect(() => assertFlow({ modules: [] })).toThrow(/empty/);
  });

  it('rejects non-string module entries', () => {
    expect(() => assertFlow({ modules: [123] })).toThrow();
    expect(() => assertFlow({ modules: [''] })).toThrow();
  });

  it('rejects non-string name and description', () => {
    expect(() => assertFlow({ modules: ['x/y/z'], name: 5 })).toThrow();
    expect(() => assertFlow({ modules: ['x/y/z'], description: false })).toThrow();
  });

  it('accepts a valid flow', () => {
    const flow = assertFlow({
      name: 'n',
      description: 'd',
      modules: ['roles/finance/x', 'tasks/finance/y'],
    });
    expect(flow.modules).toHaveLength(2);
  });
});
