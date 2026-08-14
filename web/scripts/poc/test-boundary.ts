import * as assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
const root = process.cwd();
const entry = readFileSync(resolve(root, 'src/App.tsx'), 'utf8');
assert.match(entry, /\.\/poc\/PocApp/);
assert.doesNotMatch(entry, /pages\/|supabase|catalog-api|bom/i);
const index = readFileSync(resolve(root, 'dist/index.html'), 'utf8');
assert.doesNotMatch(index, /application\/ld\+json|Product|Offer|supplier/i);
assert.doesNotMatch(index, /https?:\/\//i);
const pocSource = resolve(root, 'src/poc');
const sourceFiles = readdirSync(pocSource).filter(file => statSync(join(pocSource, file)).isFile());
for (const file of sourceFiles) {
  const source = readFileSync(join(pocSource, file), 'utf8').replace(/Synthetic POC data — not an engineering reference or supplier listing\./g, 'SYNTHETIC_NOTICE');
  assert.doesNotMatch(source, /\b(fetch|XMLHttpRequest|WebSocket|EventSource)\b|https?:\/\/|supabase|supplier|procurement|\bbom\b|openai|anthropic|\bai\b|\bagents?\b|\b(compare|shortlist|favorite|cart|quote|verified|approved|suitable|equivalent|replacement|alternate|price|availability|lead time|in stock)\b/i, `${file} must remain a local deterministic POC module`);
}
console.log('POC static boundary guard passed.');
