import pc from 'picocolors';

import type { Module } from '@lokomotif/schema';

import type { ValidationError } from '@lokomotif/schema';

export type WriteStream = { write: (chunk: string) => boolean };

export function writeJson(out: WriteStream, value: unknown): void {
  out.write(`${JSON.stringify(value, null, 2)}\n`);
}

export function writeLine(out: WriteStream, line: string): void {
  out.write(`${line}\n`);
}

export type ListedModule = {
  readonly path: string;
  readonly module: Module;
};

export function writeModuleList(out: WriteStream, modules: readonly ListedModule[]): void {
  if (modules.length === 0) {
    writeLine(out, pc.dim('  (no modules)'));
    return;
  }

  const widths = {
    id: Math.max(2, ...modules.map(({ module }) => module.id.length)),
    kind: Math.max(4, ...modules.map(({ module }) => module.kind.length)),
    version: Math.max(7, ...modules.map(({ module }) => module.version.length)),
  };

  const header = `${pad('ID', widths.id)}  ${pad('KIND', widths.kind)}  ${pad('VERSION', widths.version)}  LANGS`;
  writeLine(out, pc.bold(header));
  writeLine(out, pc.dim('-'.repeat(header.length)));

  for (const { module } of modules) {
    const langs = module.languages.join(', ');
    writeLine(
      out,
      `${pad(module.id, widths.id)}  ${pad(module.kind, widths.kind)}  ${pad(module.version, widths.version)}  ${langs}`,
    );
  }
}

export function writeValidationErrors(
  out: WriteStream,
  filePath: string,
  errors: readonly ValidationError[],
): void {
  writeLine(out, pc.red(`✗ ${filePath}`));
  for (const err of errors) {
    const path = err.path === '' ? '/' : err.path;
    writeLine(out, `  ${pc.dim(path)}  ${pc.yellow(`[${err.keyword}]`)}  ${err.message}`);
  }
}

export function writeValidationOk(out: WriteStream, filePath: string): void {
  writeLine(out, pc.green(`✓ ${filePath}`));
}

function pad(s: string, n: number): string {
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}
