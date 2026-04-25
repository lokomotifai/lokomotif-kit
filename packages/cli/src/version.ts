import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * The CLI version string.
 *
 * Read from `package.json` at module load. Works whether the file lives
 * at `src/version.ts` (development, two parents up) or `dist/version.js`
 * (published, one parent up).
 */
function readVersion(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const candidates = [join(here, '..', 'package.json'), join(here, '..', '..', 'package.json')];
  for (const path of candidates) {
    try {
      const pkg = JSON.parse(readFileSync(path, 'utf-8')) as { version?: string };
      if (typeof pkg.version === 'string') {
        return pkg.version;
      }
    } catch {
      // try next candidate
    }
  }
  return '0.0.0-unknown';
}

export const VERSION: string = readVersion();
