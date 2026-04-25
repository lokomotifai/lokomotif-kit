import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { buildCli } from '../src/index.js';

export type RunResult = {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
};

/**
 * Run the CLI in-process and capture stdout/stderr. The CLI never sees
 * `process.stdin`/`process.stdout` in tests — bytes go to the buffers.
 */
export async function runCli(args: readonly string[]): Promise<RunResult> {
  const cli = buildCli();
  let stdout = '';
  let stderr = '';
  const exitCode = await cli.run(Array.from(args), {
    stdin: process.stdin,
    stdout: {
      write: (chunk: string) => {
        stdout += chunk;
        return true;
      },
    } as unknown as NodeJS.WriteStream,
    stderr: {
      write: (chunk: string) => {
        stderr += chunk;
        return true;
      },
    } as unknown as NodeJS.WriteStream,
  });
  return { exitCode, stdout, stderr };
}

/**
 * Create an isolated temporary directory tree for a test. Returns the
 * absolute path. Caller is responsible for cleanup if desired — the OS
 * will reap on tmpdir rotation.
 */
export function makeTempRepo(prefix = 'lokomotif-cli-'): string {
  return mkdtempSync(join(tmpdir(), prefix));
}

/**
 * Write a file inside `dir`, creating parent directories as needed.
 */
export function writeRepoFile(dir: string, relativePath: string, content: string): string {
  const abs = join(dir, relativePath);
  const parent = abs.substring(0, abs.lastIndexOf('/'));
  mkdirSync(parent, { recursive: true });
  writeFileSync(abs, content, 'utf-8');
  return abs;
}

export const VALID_ROLE_YAML = `id: roles/cross-industry/test-role
version: 1.0.0
kind: role
title: "Test role"
description: "A fixture used by CLI tests."
industry: ["cross-industry"]
languages: ["en"]
owner: lokomotif-core
license: Apache-2.0
body:
  identity:
    en: "Test identity."
  expertise:
    - en: "Test domain."
`;

export const VALID_TASK_YAML = `id: tasks/cross-industry/test-task
version: 1.0.0
kind: task
title: "Test task"
description: "A fixture used by CLI tests."
industry: ["cross-industry"]
languages: ["en"]
owner: lokomotif-core
license: Apache-2.0
body:
  instructions:
    en: "Do the test thing."
  output_format:
    type: markdown
`;

export const VALID_GUARDRAIL_YAML = `id: guardrails/cross-industry/test-guardrail
version: 1.0.0
kind: guardrail
title: "Test guardrail"
description: "A fixture used by CLI tests."
industry: ["cross-industry"]
languages: ["en"]
owner: lokomotif-core
license: Apache-2.0
body:
  forbidden:
    - rule:
        en: "Do not do bad things."
`;

export const INVALID_YAML_MISSING_VERSION = `id: roles/cross-industry/missing-version
kind: role
title: "Missing version"
description: "Should fail validation because version is missing."
languages: ["en"]
owner: lokomotif-core
license: Apache-2.0
body:
  identity:
    en: "Test."
  expertise:
    - en: "Test."
`;
