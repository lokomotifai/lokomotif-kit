#!/usr/bin/env node
/**
 * Pin every GitHub Action reference in `.github/workflows/*.yml` to a
 * full commit SHA, with the original tag preserved as a trailing
 * comment.
 *
 *   uses: actions/checkout@v4
 *   →
 *   uses: actions/checkout@a5ac7e51b41094c92402da3b24376905380afc29 # v4
 *
 * This satisfies the OpenSSF Scorecard `Pinned-Dependencies` check.
 *
 * Usage:
 *   GITHUB_TOKEN=<token> node scripts/pin-actions.mjs
 *
 * Without a token the script still works for low-volume runs but is
 * subject to the unauthenticated GitHub API rate limit (60 req/hour).
 *
 * The script is idempotent: SHAs already pinned (40 hex chars) are
 * skipped. Re-running refreshes nothing on its own — pass `--refresh`
 * to re-resolve every reference even if already pinned.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, '..');
const WORKFLOW_GLOB = '.github/workflows';

const REFRESH = process.argv.includes('--refresh');
const TOKEN = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;

const USES_PATTERN =
  /uses:\s*([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)((?:\/[A-Za-z0-9_.-]+)*)@([A-Za-z0-9_.-]+)/g;

const SHA_PATTERN = /^[0-9a-f]{40}$/;

const cache = new Map();

async function fetchSha(owner, repo, ref) {
  const cacheKey = `${owner}/${repo}@${ref}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const url = `https://api.github.com/repos/${owner}/${repo}/commits/${encodeURIComponent(ref)}`;
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'lokomotif-kit-pin-actions',
  };
  if (TOKEN !== undefined) {
    headers.Authorization = `Bearer ${TOKEN}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(
      `GitHub API ${response.status} for ${cacheKey}: ${await response.text().then((t) => t.slice(0, 200))}`,
    );
  }
  const data = await response.json();
  if (typeof data.sha !== 'string' || !SHA_PATTERN.test(data.sha)) {
    throw new Error(`unexpected response for ${cacheKey}: missing sha`);
  }
  cache.set(cacheKey, data.sha);
  return data.sha;
}

async function processFile(absPath) {
  const original = readFileSync(absPath, 'utf-8');
  const matches = [...original.matchAll(USES_PATTERN)];
  if (matches.length === 0) return { absPath, updated: 0, skipped: 0 };

  let updated = original;
  let updatedCount = 0;
  let skippedCount = 0;

  for (const match of matches) {
    const [full, owner, repo, subpath, ref] = match;
    if (!REFRESH && SHA_PATTERN.test(ref)) {
      skippedCount += 1;
      continue;
    }
    const sha = await fetchSha(owner, repo, ref);
    const replacement = `uses: ${owner}/${repo}${subpath ?? ''}@${sha} # ${ref}`;
    updated = updated.replace(full, replacement);
    updatedCount += 1;
    console.log(`  ${owner}/${repo}@${ref} → ${sha.slice(0, 10)}…`);
  }

  if (updated !== original) {
    writeFileSync(absPath, updated);
  }
  return { absPath, updated: updatedCount, skipped: skippedCount };
}

async function main() {
  // Walk the workflows dir manually to avoid an extra dep.
  const { readdirSync } = await import('node:fs');
  const workflowsDir = resolve(REPO_ROOT, WORKFLOW_GLOB);
  const files = readdirSync(workflowsDir).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));

  if (files.length === 0) {
    console.log(`No workflow files found under ${WORKFLOW_GLOB}.`);
    return;
  }

  console.log(`Pinning ${files.length} workflow file(s)…\n`);
  let totalUpdated = 0;
  let totalSkipped = 0;
  for (const name of files) {
    const abs = resolve(workflowsDir, name);
    console.log(`${name}:`);
    const result = await processFile(abs);
    totalUpdated += result.updated;
    totalSkipped += result.skipped;
    if (result.updated === 0 && result.skipped === 0) {
      console.log('  (no `uses:` references)');
    }
  }

  console.log(`\nDone. Pinned: ${totalUpdated}, already pinned: ${totalSkipped}.`);
  if (totalUpdated === 0 && !REFRESH) {
    console.log('Pass --refresh to re-resolve every reference.');
  } else {
    console.log('Review the diff with `git diff .github/workflows/` and commit.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
