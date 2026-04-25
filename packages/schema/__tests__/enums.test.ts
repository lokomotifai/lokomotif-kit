import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  Industries,
  Kinds,
  Languages,
  OutputFormatTypes,
  Registers,
  Severities,
  isIndustry,
  isKind,
  isLanguage,
} from '../src/enums.js';

const here = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(here, '..', 'schemas', 'module.schema.json');

type Schema = {
  definitions: {
    Kind: { enum: readonly string[] };
    Industry: { enum: readonly string[] };
    Language: { enum: readonly string[] };
    StyleBody: {
      properties: { register: { enum: readonly string[] } };
    };
    TaskBody: {
      properties: { output_format: { properties: { type: { enum: readonly string[] } } } };
    };
    GuardrailBody: {
      properties: { severity: { enum: readonly string[] } };
    };
  };
};

const schema = JSON.parse(readFileSync(schemaPath, 'utf-8')) as Schema;

describe('enums mirror the JSON Schema', () => {
  it('Kind', () => {
    expect([...Kinds].sort()).toEqual([...schema.definitions.Kind.enum].sort());
  });

  it('Industry', () => {
    expect([...Industries].sort()).toEqual([...schema.definitions.Industry.enum].sort());
  });

  it('Language', () => {
    expect([...Languages].sort()).toEqual([...schema.definitions.Language.enum].sort());
  });

  it('Register', () => {
    expect([...Registers].sort()).toEqual(
      [...schema.definitions.StyleBody.properties.register.enum].sort(),
    );
  });

  it('OutputFormatType', () => {
    expect([...OutputFormatTypes].sort()).toEqual(
      [...schema.definitions.TaskBody.properties.output_format.properties.type.enum].sort(),
    );
  });

  it('Severity', () => {
    expect([...Severities].sort()).toEqual(
      [...schema.definitions.GuardrailBody.properties.severity.enum].sort(),
    );
  });
});

describe('type guards', () => {
  it('isKind', () => {
    expect(isKind('role')).toBe(true);
    expect(isKind('not-a-kind')).toBe(false);
    expect(isKind(null)).toBe(false);
    expect(isKind(123)).toBe(false);
  });

  it('isIndustry', () => {
    expect(isIndustry('finance')).toBe(true);
    expect(isIndustry('aerospace')).toBe(false);
  });

  it('isLanguage', () => {
    expect(isLanguage('tr')).toBe(true);
    expect(isLanguage('en')).toBe(true);
    expect(isLanguage('de')).toBe(false);
  });
});
