import * as assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
const root = process.cwd();
const entry = readFileSync(resolve(root, 'src/App.tsx'), 'utf8');
assert.match(entry, /\.\/catalog\/ui\/CatalogApp/);
assert.doesNotMatch(entry, /pages\/|supabase|catalog-api|bom/i);
const index = readFileSync(resolve(root, 'dist/index.html'), 'utf8');
assert.doesNotMatch(index, /application\/ld\+json|Product|Offer|supplier/i);
assert.doesNotMatch(index, /https?:\/\//i);
const catalogSource = resolve(root, 'src/catalog');
const sourceFiles: string[] = [];
const walk = (directory: string) => {
  for (const file of readdirSync(directory)) {
    const path = join(directory, file);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.tsx?$/.test(file)) sourceFiles.push(path);
  }
};
walk(catalogSource);
for (const file of sourceFiles) {
  const source = readFileSync(file, 'utf8');
  assert.doesNotMatch(source, /\b(fetch|XMLHttpRequest|WebSocket|EventSource)\b|https?:\/\/|supabase|openai|anthropic/i, `${file} must remain a local deterministic catalog module`);
  assert.doesNotMatch(source, /from ['"]\.\.\/\.\.\/poc|from ['"]\.\.\/poc/i, `${file} must not depend on the retired POC runtime`);
}
console.log('Catalog static runtime boundary guard passed.');
