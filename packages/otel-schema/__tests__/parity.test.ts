import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';
import { parse as parseYaml } from 'yaml';

import { ALL_ATTRIBUTES, ALL_SPAN_NAMES } from '../src/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const semconvPath = join(here, '..', 'semconv', 'lokomotif.yaml');

type SemconvFile = {
  groups: ReadonlyArray<{
    type?: string;
    attributes?: ReadonlyArray<{ id: string }>;
    span_names?: readonly string[];
  }>;
};

const semconv = parseYaml(readFileSync(semconvPath, 'utf-8')) as SemconvFile;

function attributesFromYaml(): readonly string[] {
  const ids: string[] = [];
  for (const group of semconv.groups) {
    if (group.attributes !== undefined) {
      for (const a of group.attributes) {
        ids.push(a.id);
      }
    }
  }
  return ids;
}

function spanNamesFromYaml(): readonly string[] {
  const names: string[] = [];
  for (const group of semconv.groups) {
    if (group.span_names !== undefined) {
      names.push(...group.span_names);
    }
  }
  return names;
}

describe('TS constants ↔ semconv YAML parity', () => {
  it('attribute sets match', () => {
    const fromTs = [...ALL_ATTRIBUTES].sort();
    const fromYaml = [...attributesFromYaml()].sort();
    expect(fromTs).toEqual(fromYaml);
  });

  it('span name sets match', () => {
    const fromTs = [...ALL_SPAN_NAMES].sort();
    const fromYaml = [...spanNamesFromYaml()].sort();
    expect(fromTs).toEqual(fromYaml);
  });
});
