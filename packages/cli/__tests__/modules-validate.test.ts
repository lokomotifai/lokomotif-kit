import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  INVALID_YAML_MISSING_VERSION,
  VALID_ROLE_YAML,
  makeTempRepo,
  runCli,
  writeRepoFile,
} from './helpers.js';

describe('modules validate', () => {
  it('passes a valid module', async () => {
    const repo = makeTempRepo();
    const path = writeRepoFile(repo, 'modules/roles/cross-industry/ok.yaml', VALID_ROLE_YAML);

    const { exitCode, stdout } = await runCli(['modules', 'validate', path, '--json']);
    expect(exitCode).toBe(0);
    const parsed = JSON.parse(stdout) as {
      summary: { passed: number; failed: number; total: number };
    };
    expect(parsed.summary).toEqual({ passed: 1, failed: 0, total: 1 });
  });

  it('reports validation errors with non-zero exit', async () => {
    const repo = makeTempRepo();
    const path = writeRepoFile(
      repo,
      'modules/roles/cross-industry/bad.yaml',
      INVALID_YAML_MISSING_VERSION,
    );

    const { exitCode, stdout } = await runCli(['modules', 'validate', path, '--json']);
    expect(exitCode).toBe(1);
    const parsed = JSON.parse(stdout) as {
      results: { ok: boolean; errors?: { keyword: string }[] }[];
      summary: { failed: number };
    };
    expect(parsed.summary.failed).toBe(1);
    const failure = parsed.results.find((r) => !r.ok);
    expect(failure).toBeDefined();
    expect(failure?.errors?.length).toBeGreaterThan(0);
  });

  it('returns 1 when no files match', async () => {
    const repo = makeTempRepo();
    const { exitCode } = await runCli([
      'modules',
      'validate',
      join(repo, 'no-such-file.yaml'),
      '--json',
    ]);
    expect(exitCode).toBe(1);
  });
});
