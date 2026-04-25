import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const pkgPath = join(here, '..', 'package.json');

type PackageJson = {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

const FORBIDDEN_PATTERNS = [
  /^@anthropic-ai\//,
  /^@openai\//,
  /^openai$/,
  /^@google-cloud\//,
  /^@aws-sdk\//,
  /^langchain/,
  /^@langchain\//,
  /^langgraph$/,
  /^@dify\//,
  /^n8n-/,
];

describe('@lokomotif/sdk dependency contract', () => {
  it('declares no vendor SDKs as runtime deps', () => {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as PackageJson;
    const allRuntime = {
      ...(pkg.dependencies ?? {}),
      ...(pkg.peerDependencies ?? {}),
    };
    const forbidden = Object.keys(allRuntime).filter((name) =>
      FORBIDDEN_PATTERNS.some((re) => re.test(name)),
    );
    expect(
      forbidden,
      `vendor SDKs forbidden in @lokomotif/sdk runtime deps: ${forbidden.join(', ')}`,
    ).toEqual([]);
  });
});
