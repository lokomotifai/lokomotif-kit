import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { validate } from '@lokomotif/schema';
import { parse as parseYaml } from 'yaml';

import { makeTempRepo, runCli } from './helpers.js';

describe('modules new', () => {
  it('scaffolds a role module that passes schema validation', async () => {
    const repo = makeTempRepo();
    const { exitCode, stdout } = await runCli([
      'modules',
      'new',
      'role',
      'finance/aml-analyst',
      '--root',
      repo,
      '--json',
    ]);
    expect(exitCode).toBe(0);
    const parsed = JSON.parse(stdout) as { id: string; files: string[] };
    expect(parsed.id).toBe('roles/finance/aml-analyst');

    const moduleAbs = join(repo, 'modules/roles/finance/aml-analyst.yaml');
    const testAbs = join(repo, 'modules/roles/finance/__tests__/aml-analyst.eval.yaml');
    expect(existsSync(moduleAbs)).toBe(true);
    expect(existsSync(testAbs)).toBe(true);

    const yaml = parseYaml(readFileSync(moduleAbs, 'utf-8')) as unknown;
    const result = validate(yaml);
    expect(result.ok, result.ok ? '' : JSON.stringify(result.errors, null, 2)).toBe(true);
  });

  it.each([
    ['task', 'tasks/cross-industry/example'],
    ['context', 'contexts/cross-industry/example'],
    ['style', 'styles/cross-industry/example'],
    ['guardrail', 'guardrails/cross-industry/example'],
  ])('scaffolds a %s module that validates', async (kind, expectedId) => {
    const repo = makeTempRepo();
    const { exitCode, stdout } = await runCli([
      'modules',
      'new',
      kind,
      'cross-industry/example',
      '--root',
      repo,
      '--json',
    ]);
    expect(exitCode).toBe(0);
    const parsed = JSON.parse(stdout) as { id: string };
    expect(parsed.id).toBe(expectedId);

    const path = join(repo, 'modules', expectedId + '.yaml');
    const yaml = parseYaml(readFileSync(path, 'utf-8')) as unknown;
    const result = validate(yaml);
    expect(result.ok, result.ok ? '' : JSON.stringify(result.errors, null, 2)).toBe(true);
  });

  it('refuses an unknown kind', async () => {
    const repo = makeTempRepo();
    const { exitCode } = await runCli([
      'modules',
      'new',
      'not-a-kind',
      'finance/example',
      '--root',
      repo,
    ]);
    expect(exitCode).toBe(1);
  });

  it('refuses a malformed industry/name argument', async () => {
    const repo = makeTempRepo();
    const { exitCode } = await runCli([
      'modules',
      'new',
      'role',
      'BadCase/example',
      '--root',
      repo,
    ]);
    expect(exitCode).toBe(1);
  });

  it('refuses to overwrite without --force', async () => {
    const repo = makeTempRepo();
    await runCli(['modules', 'new', 'role', 'finance/example', '--root', repo, '--json']);
    const second = await runCli([
      'modules',
      'new',
      'role',
      'finance/example',
      '--root',
      repo,
      '--json',
    ]);
    expect(second.exitCode).toBe(1);
    const parsed = JSON.parse(second.stdout) as { ok?: boolean; error?: string };
    expect(parsed.ok).toBe(false);
    expect(parsed.error).toContain('Refusing to overwrite');
  });

  it('overwrites with --force', async () => {
    const repo = makeTempRepo();
    await runCli(['modules', 'new', 'role', 'finance/example', '--root', repo, '--json']);
    const second = await runCli([
      'modules',
      'new',
      'role',
      'finance/example',
      '--root',
      repo,
      '--force',
      '--json',
    ]);
    expect(second.exitCode).toBe(0);
  });
});
