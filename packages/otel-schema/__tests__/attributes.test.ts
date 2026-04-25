import { describe, expect, it } from 'vitest';

import {
  ALL_ATTRIBUTES,
  ATTR_EVAL_SCORE,
  ATTR_FLOW_COMPOSITION_HASH,
  ATTR_MODULE_ID,
  ALL_SPAN_NAMES,
  SPAN_FLOW_COMPOSE,
  EVAL_JUDGE_KINDS,
  MODULE_KINDS,
} from '../src/index.js';

describe('attribute constants', () => {
  it('all start with the lokomotif. prefix', () => {
    for (const a of ALL_ATTRIBUTES) {
      expect(a).toMatch(/^lokomotif\./);
    }
  });

  it('contain the four canonical operational attributes', () => {
    expect(ALL_ATTRIBUTES).toContain(ATTR_MODULE_ID);
    expect(ALL_ATTRIBUTES).toContain(ATTR_FLOW_COMPOSITION_HASH);
    expect(ALL_ATTRIBUTES).toContain(ATTR_EVAL_SCORE);
  });

  it('have unique values', () => {
    const set = new Set(ALL_ATTRIBUTES);
    expect(set.size).toBe(ALL_ATTRIBUTES.length);
  });
});

describe('span constants', () => {
  it('all start with the lokomotif. prefix', () => {
    for (const s of ALL_SPAN_NAMES) {
      expect(s).toMatch(/^lokomotif\./);
    }
  });

  it('include flow.compose', () => {
    expect(ALL_SPAN_NAMES).toContain(SPAN_FLOW_COMPOSE);
  });
});

describe('value spaces', () => {
  it('module kinds match the schema enum', () => {
    expect([...MODULE_KINDS].sort()).toEqual(
      ['context', 'guardrail', 'role', 'style', 'task'].sort(),
    );
  });

  it('eval judge kinds are deterministic and llm', () => {
    expect([...EVAL_JUDGE_KINDS].sort()).toEqual(['deterministic', 'llm'].sort());
  });
});
