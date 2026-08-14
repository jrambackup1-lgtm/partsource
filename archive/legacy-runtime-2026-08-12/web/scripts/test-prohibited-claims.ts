import * as assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';

const webRoot = path.resolve(import.meta.dirname, '..');
const runtimeRoots = ['src/App.tsx', 'src/components', 'src/contexts', 'src/hooks', 'src/lib', 'src/pages'];
const sourceAllowlist = new Set([
  // Internal/test-only compatibility modules may define old contracts as long as they are not imported by runtime UI.
  'src/lib/unpublishedCrossReferenceCatalog.ts',
  // Boundary declarations and ingestion adapters mention prohibited field names to reject or quarantine them.
  'src/lib/catalogApi.ts',
  'src/lib/feedAdapter.ts',
  'src/lib/decoder.ts',
]);

const prohibitedClaimPatterns = [
  /\bverified[-\s]?equivalents?\b/i,
  /\bapproved\s+alternates?\b/i,
  /\bsame\s+item\b/i,
  /\breplacements?\s+(?:for|to)\b/i,
  /\b(?:in\s+stock|available\s+now|ships?\s+(?:today|tomorrow))\b/i,
  /\b(?:buy|purchase|order)\s+(?:now|from|on)\b/i,
  /\b(?:request|get)\s+(?:a\s+)?quote\b/i,
  /\b(?:supplier\s+)?offers?\s+(?:available|from|for)\b/i,
  /\b(?:live|real[-\s]?time)\s+(?:price|stock|availability)\b/i,
  /\b(?:estimated|simulated|guaranteed)\s+(?:price|pricing|stock|availability|savings)\b/i,
  /\$\s*\d+(?:\.\d{2})?\s*(?:each|ea|per|\/)/i,
];

function walkRuntimeFiles(entry: string): string[] {
  const full = path.join(webRoot, entry);
  const stat = fs.statSync(full);
  if (stat.isFile()) return /\.(?:ts|tsx)$/.test(entry) ? [entry] : [];
  return fs.readdirSync(full, { recursive: true, encoding: 'utf8' })
    .filter(file => /\.(?:ts|tsx)$/.test(file))
    .map(file => path.join(entry, file).replace(/\\/g, '/'));
}

function assertNoProhibitedClaims(label: string, text: string) {
  for (const pattern of prohibitedClaimPatterns) {
    assert.doesNotMatch(text, pattern, `${label} contains prohibited public commercial/equivalence claim: ${pattern}`);
  }
}

const runtimeFiles = runtimeRoots.flatMap(walkRuntimeFiles)
  .filter((file, index, files) => files.indexOf(file) === index)
  .filter(file => !sourceAllowlist.has(file));

for (const file of runtimeFiles) {
  assertNoProhibitedClaims(file, fs.readFileSync(path.join(webRoot, file), 'utf8'));
}

const bundleDir = path.join(webRoot, 'dist', 'assets');
if (fs.existsSync(bundleDir)) {
  const bundle = fs.readdirSync(bundleDir)
    .filter(file => file.endsWith('.js'))
    .map(file => fs.readFileSync(path.join(bundleDir, file), 'utf8'))
    .join('\n');
  assertNoProhibitedClaims('production JS bundle', bundle);
}

console.log('Prohibited public-claim scan passed.');
