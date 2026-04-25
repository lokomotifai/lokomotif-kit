import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';
import { parse as parseYaml } from 'yaml';

import { validate, formatErrors } from '../src/index.js';
import type { ValidationResult } from '../src/errors.js';
import type { Module } from '../src/generated/module.types.js';

const here = dirname(fileURLToPath(import.meta.url));

function loadFixtures(subdir: string): readonly { name: string; data: unknown }[] {
  const dir = join(here, 'fixtures', subdir);
  return readdirSync(dir)
    .filter((file) => file.endsWith('.yaml') || file.endsWith('.yml'))
    .map((file) => ({
      name: file,
      data: parseYaml(readFileSync(join(dir, file), 'utf-8')) as unknown,
    }));
}

describe('validate — valid fixtures', () => {
  const fixtures = loadFixtures('valid');

  it('covers every RTCSG kind', () => {
    const kinds = new Set(
      fixtures.map(({ data }) => (data as { kind?: string }).kind ?? '?'),
    );
    expect(kinds).toEqual(new Set(['role', 'task', 'context', 'style', 'guardrail']));
  });

  for (const { name, data } of fixtures) {
    it(`accepts ${name}`, () => {
      const result: ValidationResult<Module> = validate(data);
      if (!result.ok) {
        // surface details to the test reporter to make debugging painless
        throw new Error(`Expected ${name} to validate.\n${formatErrors(result.errors)}`);
      }
      expect(result.ok).toBe(true);
    });
  }
});

describe('validate — invalid fixtures', () => {
  const fixtures = loadFixtures('invalid');

  for (const { name, data } of fixtures) {
    it(`rejects ${name}`, () => {
      const result: ValidationResult<Module> = validate(data);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.errors.length).toBeGreaterThan(0);
        for (const err of result.errors) {
          expect(typeof err.path).toBe('string');
          expect(typeof err.keyword).toBe('string');
          expect(typeof err.message).toBe('string');
        }
      }
    });
  }
});

describe('validate — narrowing', () => {
  it('narrows Module by kind on the success branch', () => {
    const valid = loadFixtures('valid').find(({ name }) => name === 'role.yaml');
    expect(valid).toBeDefined();
    if (valid === undefined) return;

    const result = validate(valid.data);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    if (result.data.kind === 'role') {
      expect(result.data.body.identity).toBeDefined();
      expect(result.data.body.expertise.length).toBeGreaterThan(0);
    } else {
      throw new Error(`Expected kind 'role', got '${result.data.kind}'`);
    }
  });
});

describe('validate — input shapes that must always fail', () => {
  it('rejects null', () => {
    const result = validate(null);
    expect(result.ok).toBe(false);
  });

  it('rejects empty object', () => {
    const result = validate({});
    expect(result.ok).toBe(false);
  });

  it('rejects unknown top-level fields', () => {
    const valid = loadFixtures('valid').find(({ name }) => name === 'role.yaml');
    expect(valid).toBeDefined();
    if (valid === undefined) return;

    const polluted = { ...(valid.data as object), unexpected_field: 'nope' };
    const result = validate(polluted);
    expect(result.ok).toBe(false);
  });
});

describe('formatErrors', () => {
  it('returns a marker string for empty input', () => {
    expect(formatErrors([])).toBe('(no errors)');
  });

  it('prints one line per error with path and keyword', () => {
    const result = validate({});
    if (result.ok) {
      throw new Error('expected failure');
    }
    const formatted = formatErrors(result.errors);
    expect(formatted.split('\n').length).toBe(result.errors.length);
    expect(formatted).toMatch(/\[\w+\]/);
  });
});
