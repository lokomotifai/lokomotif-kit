import { existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

/**
 * Walk up from `startDir` looking for the modules directory of a
 * Lokomotif Kit repository.
 *
 * Returns the absolute path to the modules directory if found. Returns
 * `null` if the search reaches the filesystem root or a directory that
 * looks like a repo root (`.git/`, `pnpm-workspace.yaml`) without a
 * `modules/` sibling.
 */
export function findModulesDir(startDir: string = process.cwd()): string | null {
  let current = resolve(startDir);
  // safety against symlink loops and unbounded climbs
  for (let depth = 0; depth < 64; depth += 1) {
    const candidate = join(current, 'modules');
    if (existsSync(candidate) && statSync(candidate).isDirectory()) {
      return candidate;
    }

    if (existsSync(join(current, '.git'))) {
      return null;
    }

    if (existsSync(join(current, 'pnpm-workspace.yaml'))) {
      return null;
    }

    const parent = dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
  return null;
}

/**
 * Locate the repository root, defined as the closest ancestor containing
 * a `.git/` directory or a `pnpm-workspace.yaml` file. Returns the start
 * directory if neither is found within depth 64.
 */
export function findRepoRoot(startDir: string = process.cwd()): string {
  let current = resolve(startDir);
  for (let depth = 0; depth < 64; depth += 1) {
    if (existsSync(join(current, '.git')) || existsSync(join(current, 'pnpm-workspace.yaml'))) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) {
      return resolve(startDir);
    }
    current = parent;
  }
  return resolve(startDir);
}
