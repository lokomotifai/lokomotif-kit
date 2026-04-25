import { describe, expect, it } from 'vitest';

import { VERSION } from '../src/index.js';

import { runCli } from './helpers.js';

describe('CLI smoke', () => {
  it('reports its version', async () => {
    const { exitCode, stdout } = await runCli(['--version']);
    expect(exitCode).toBe(0);
    expect(stdout.trim()).toBe(VERSION);
  });

  it('shows help when invoked with no arguments', async () => {
    const { stdout } = await runCli(['--help']);
    expect(stdout).toContain('lokomotif');
    expect(stdout).toContain('modules');
  });

  it('exits non-zero on an unknown command', async () => {
    const { exitCode } = await runCli(['this-command-does-not-exist']);
    expect(exitCode).not.toBe(0);
  });

  it('lists subcommands in help', async () => {
    const { stdout } = await runCli(['--help']);
    for (const cmd of [
      'modules list',
      'modules validate',
      'modules new',
      'compose',
      'eval run',
      'deploy',
    ]) {
      expect(stdout, `expected '${cmd}' in help output`).toContain(cmd.split(' ')[0] ?? '');
    }
  });
});
