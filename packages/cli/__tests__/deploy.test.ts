import { describe, expect, it } from 'vitest';

import { makeTempRepo, runCli } from './helpers.js';

describe('deploy', () => {
  it('lists known targets when no target is given', async () => {
    const repo = makeTempRepo();
    const { exitCode, stdout } = await runCli(['deploy', '--root', repo, '--json']);
    expect(exitCode).toBe(0);
    const parsed = JSON.parse(stdout) as {
      targets: { name: string; shipped: boolean }[];
    };
    const names = parsed.targets.map((t) => t.name);
    expect(names).toEqual(['anthropic-sdk', 'dify', 'n8n', 'langgraph']);
    // No blueprints are shipped at Phase 3.
    expect(parsed.targets.every((t) => !t.shipped)).toBe(true);
  });

  it('errors on an unknown target', async () => {
    const repo = makeTempRepo();
    const { exitCode, stderr } = await runCli([
      'deploy',
      'unknown-runtime',
      'flow.yaml',
      '--root',
      repo,
    ]);
    expect(exitCode).toBe(1);
    expect(stderr).toContain('unknown target');
  });

  it('reports unshipped status for a known but unbuilt target', async () => {
    const repo = makeTempRepo();
    const { exitCode, stdout } = await runCli([
      'deploy',
      'anthropic-sdk',
      'flow.yaml',
      '--root',
      repo,
      '--json',
    ]);
    expect(exitCode).toBe(1);
    const parsed = JSON.parse(stdout) as {
      ok: boolean;
      target: string;
      shipped: boolean;
    };
    expect(parsed.ok).toBe(false);
    expect(parsed.target).toBe('anthropic-sdk');
    expect(parsed.shipped).toBe(false);
  });
});
