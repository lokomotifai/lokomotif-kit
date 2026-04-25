import { createHash } from 'node:crypto';

import type { Module } from '@lokomotif/schema';

/**
 * Stable 16-character hex hash of a composition.
 *
 * The hash is derived from the canonical RTCSG order of (id, version)
 * tuples. Same composition (same modules, any input order) produces the
 * same hash. Different versions, different IDs, or different counts
 * produce different hashes.
 *
 * Suitable for the OTel attribute `lokomotif.flow.composition_hash`.
 */
export function compositionHash(modules: readonly Module[]): string {
  const canonical = [...modules]
    .sort((a, b) => byKindOrder(a.kind, b.kind) || a.id.localeCompare(b.id))
    .map((m) => `${m.id}@${m.version}`)
    .join('\n');
  return createHash('sha256').update(canonical, 'utf-8').digest('hex').slice(0, 16);
}

const KIND_ORDER: Record<string, number> = {
  role: 0,
  task: 1,
  context: 2,
  style: 3,
  guardrail: 4,
};

function byKindOrder(a: string, b: string): number {
  return (KIND_ORDER[a] ?? 99) - (KIND_ORDER[b] ?? 99);
}
