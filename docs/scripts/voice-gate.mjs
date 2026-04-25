#!/usr/bin/env node
/**
 * Voice gate — scan MDX pages for retired phrases.
 *
 * Sources for the retired-phrase list:
 *   - Lokomotif_AI_Positioning_Brief.md § 11
 *   - Lokomotif-Kit.md § Language, voice, tone
 *
 * A page can opt out by setting `voice_gate: skip` in its frontmatter.
 * The glossary uses this — that page documents the retired phrases as
 * content, so the gate would otherwise self-trigger.
 *
 * Run from `docs/`:  node scripts/voice-gate.mjs
 * Or via package script:  pnpm voice-gate
 */

import { readFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import fg from 'fast-glob';
import matter from 'gray-matter';

const HERE = dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = resolve(HERE, '..');
const PAGES_GLOB = ['pages/**/*.mdx', 'pages/**/*.md'];

const RETIRED_PHRASES = [
  // Brief § 11 retired phrases (case-insensitive substring match)
  'AI solutions',
  'AI training academy',
  'End-to-end AI services',
  'Digitize your business',
  'Simplify your complex processes',
  'Integrations in days',
  'MVP in 12 weeks',
  'Your trusted AI partner',
  'AI-powered',
  'revolutionary',
  'next-gen',
  'cutting-edge',
  'Empower your team',
  'Certificate of completion',
  // CLAUDE.md voice rules
  'seamless',
  'game-changing',
];

function stripCodeAndPlaceholders(text) {
  // Strip fenced code blocks first, then inline code spans, then JSX/MDX
  // expression curly braces — those are typically literal renderings of
  // off-voice strings, not authored prose.
  return text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\{[^{}]*\}/g, '');
}

function scanLine(line, lineNumber, file, findings) {
  const lower = line.toLowerCase();
  for (const phrase of RETIRED_PHRASES) {
    const idx = lower.indexOf(phrase.toLowerCase());
    if (idx >= 0) {
      findings.push({
        file,
        line: lineNumber,
        column: idx + 1,
        phrase,
        excerpt: line.trim().slice(0, 120),
      });
    }
  }
}

async function main() {
  const files = await fg(PAGES_GLOB, { cwd: DOCS_ROOT, absolute: true });
  const findings = [];
  let scanned = 0;
  let skipped = 0;

  for (const abs of files) {
    const rel = relative(DOCS_ROOT, abs);
    const raw = readFileSync(abs, 'utf-8');
    const parsed = matter(raw);
    if (parsed.data?.voice_gate === 'skip') {
      skipped += 1;
      continue;
    }
    const stripped = stripCodeAndPlaceholders(parsed.content);
    const lines = stripped.split('\n');
    for (let i = 0; i < lines.length; i += 1) {
      scanLine(lines[i] ?? '', i + 1, rel, findings);
    }
    scanned += 1;
  }

  if (findings.length === 0) {
    console.log(
      `✓ Voice gate clear — ${scanned} page(s) scanned, ${skipped} skipped (voice_gate: skip).`,
    );
    return;
  }

  console.error(`✗ Voice gate found ${findings.length} retired-phrase use(s):\n`);
  for (const f of findings) {
    console.error(`  ${f.file}:${f.line}:${f.column}  retired '${f.phrase}'`);
    console.error(`    ${f.excerpt}`);
  }
  console.error(`\nSee docs/pages/glossary.mdx § Phrases to retire.`);
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
