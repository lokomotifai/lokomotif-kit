import { describe, expect, it } from 'vitest';

import {
  VALID_GUARDRAIL_YAML,
  VALID_ROLE_YAML,
  VALID_TASK_YAML,
  makeTempRepo,
  runCli,
  writeRepoFile,
} from './helpers.js';

const FLOW_YAML = `name: test-flow
description: "Test flow used by CLI tests."
modules:
  - guardrails/cross-industry/test-guardrail
  - roles/cross-industry/test-role
  - tasks/cross-industry/test-task
`;

describe('compose', () => {
  it('composes a flow and orders modules R-T-C-S-G', async () => {
    const repo = makeTempRepo();
    writeRepoFile(repo, 'modules/roles/cross-industry/test-role.yaml', VALID_ROLE_YAML);
    writeRepoFile(repo, 'modules/tasks/cross-industry/test-task.yaml', VALID_TASK_YAML);
    writeRepoFile(
      repo,
      'modules/guardrails/cross-industry/test-guardrail.yaml',
      VALID_GUARDRAIL_YAML,
    );
    const flowPath = writeRepoFile(repo, 'flow.yaml', FLOW_YAML);

    const { exitCode, stdout } = await runCli([
      'compose',
      flowPath,
      '--root',
      repo,
      '--json',
    ]);
    expect(exitCode).toBe(0);
    const parsed = JSON.parse(stdout) as {
      modules: { id: string; kind: string }[];
      prompt: string;
    };
    expect(parsed.modules.map((m) => m.kind)).toEqual(['role', 'task', 'guardrail']);
    expect(parsed.prompt).toContain('## Role');
    expect(parsed.prompt).toContain('## Task');
    expect(parsed.prompt).toContain('## Guardrail');
    // sanity: role section appears before guardrail section
    const rolePos = parsed.prompt.indexOf('## Role');
    const guardPos = parsed.prompt.indexOf('## Guardrail');
    expect(rolePos).toBeGreaterThan(-1);
    expect(guardPos).toBeGreaterThan(rolePos);
  });

  it('errors when a referenced module is missing', async () => {
    const repo = makeTempRepo();
    writeRepoFile(repo, 'modules/roles/cross-industry/test-role.yaml', VALID_ROLE_YAML);
    const flowPath = writeRepoFile(
      repo,
      'flow.yaml',
      'modules:\n  - roles/cross-industry/does-not-exist\n',
    );

    const { exitCode, stderr } = await runCli([
      'compose',
      flowPath,
      '--root',
      repo,
    ]);
    expect(exitCode).toBe(1);
    expect(stderr).toContain('cannot resolve module');
  });

  it('errors when flow.yaml is not found', async () => {
    const repo = makeTempRepo();
    // Provide a modules/ directory so the modules-dir check passes and
    // the missing-flow-file path is the one that fails.
    writeRepoFile(repo, 'modules/roles/cross-industry/test-role.yaml', VALID_ROLE_YAML);

    const { exitCode, stderr } = await runCli([
      'compose',
      'nonexistent-flow.yaml',
      '--root',
      repo,
    ]);
    expect(exitCode).toBe(1);
    expect(stderr).toContain('flow file not found');
  });
});
