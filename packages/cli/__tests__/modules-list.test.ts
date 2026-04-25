import { describe, expect, it } from 'vitest';

import { makeTempRepo, runCli, VALID_ROLE_YAML, VALID_TASK_YAML, writeRepoFile } from './helpers.js';

describe('modules list', () => {
  it('returns informational message when no modules dir exists', async () => {
    const repo = makeTempRepo();
    const { exitCode, stdout } = await runCli(['modules', 'list', '--root', repo]);
    expect(exitCode).toBe(0);
    expect(stdout).toContain('No modules/ directory');
  });

  it('returns empty JSON when no modules dir exists', async () => {
    const repo = makeTempRepo();
    const { exitCode, stdout } = await runCli(['modules', 'list', '--root', repo, '--json']);
    expect(exitCode).toBe(0);
    const parsed = JSON.parse(stdout) as { modules: unknown[]; note?: string };
    expect(parsed.modules).toEqual([]);
    expect(parsed.note).toBeDefined();
  });

  it('lists modules present in the repo', async () => {
    const repo = makeTempRepo();
    writeRepoFile(repo, 'modules/roles/cross-industry/test-role.yaml', VALID_ROLE_YAML);
    writeRepoFile(repo, 'modules/tasks/cross-industry/test-task.yaml', VALID_TASK_YAML);

    const { exitCode, stdout } = await runCli(['modules', 'list', '--root', repo, '--json']);
    expect(exitCode).toBe(0);
    const parsed = JSON.parse(stdout) as {
      modules: { module: { id: string; kind: string } }[];
    };
    expect(parsed.modules).toHaveLength(2);
    const ids = parsed.modules.map((m) => m.module.id).sort();
    expect(ids).toEqual([
      'roles/cross-industry/test-role',
      'tasks/cross-industry/test-task',
    ]);
  });

  it('filters by --kind', async () => {
    const repo = makeTempRepo();
    writeRepoFile(repo, 'modules/roles/cross-industry/test-role.yaml', VALID_ROLE_YAML);
    writeRepoFile(repo, 'modules/tasks/cross-industry/test-task.yaml', VALID_TASK_YAML);

    const { exitCode, stdout } = await runCli([
      'modules',
      'list',
      '--root',
      repo,
      '--kind',
      'role',
      '--json',
    ]);
    expect(exitCode).toBe(0);
    const parsed = JSON.parse(stdout) as { modules: { module: { kind: string } }[] };
    expect(parsed.modules.every((m) => m.module.kind === 'role')).toBe(true);
    expect(parsed.modules).toHaveLength(1);
  });

  it('filters by --industry', async () => {
    const repo = makeTempRepo();
    writeRepoFile(repo, 'modules/roles/cross-industry/test-role.yaml', VALID_ROLE_YAML);

    const { exitCode, stdout } = await runCli([
      'modules',
      'list',
      '--root',
      repo,
      '--industry',
      'finance', // not present in fixture
      '--json',
    ]);
    expect(exitCode).toBe(0);
    const parsed = JSON.parse(stdout) as { modules: unknown[] };
    expect(parsed.modules).toHaveLength(0);
  });
});
