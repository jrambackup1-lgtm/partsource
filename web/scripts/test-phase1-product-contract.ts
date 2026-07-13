import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const contractPath = path.join(repoRoot, 'research', 'product-contract.md');

assert.ok(
  fs.existsSync(contractPath),
  'research/product-contract.md must exist as the authoritative current product contract',
);

const contract = fs.readFileSync(contractPath, 'utf8');

assert.match(contract, /Status:\*\* Authoritative — sole current source of truth/);
assert.match(contract, /When current product or research documents conflict, this contract wins\./);

for (const topic of [
  'Scraping',
  'Commercial pricing and offers',
  'Pins',
  'Imperial coverage',
  'Currency',
  'Accounts and authentication',
  'Company and team features',
  'Enterprise features',
  'Quote validation',
  'Brokerage and commerce',
  'pSEO indexing',
  'Styling and runtime stack',
]) {
  assert.match(contract, new RegExp(`\\| \\*\\*${topic}\\*\\* \\|[^\\n]+\\|[^\\n]*(?:Current|Rejected|Phase|MP-)`), `${topic} must have a resolved decision and owner`);
}

assert.match(contract, /Vite \+ React SPA/);
assert.match(contract, /Tailwind CSS 4/);
assert.match(contract, /GitHub Pages/);
assert.match(contract, /https:\/\/jrambackup1-lgtm\.github\.io\/partsource\//);

for (const term of [
  'Configuration',
  'Manufacturer part',
  'Supplier listing',
  'Offer',
  'Candidate match',
  'Cross-reference',
  'Exact equivalent',
  'Approved alternate',
]) {
  assert.match(contract, new RegExp(`\\| ${term} \\|`), `${term} must remain distinct`);
}

for (const boundary of [
  'Never describe a configuration as stocked.',
  'Never describe a search URL as an offer.',
  'Never describe a candidate as an equivalent.',
  'Never describe an equivalent as approved without organizational approval.',
  'Never display live price, inventory, certification, or lead time without a sanctioned source and timestamp.',
  'Never silently substitute thread pitch, measurement system, standard, material, or strength class.',
]) {
  assert.ok(contract.includes(boundary), `missing Product Truth boundary: ${boundary}`);
}

assert.match(contract, /## Phase ownership register/);
assert.match(contract, /Phase 0[\s\S]+Phase 1[\s\S]+Phase 2[\s\S]+Phase 3[\s\S]+Phase 4[\s\S]+Phase 5[\s\S]+Phase 6[\s\S]+Phase 7[\s\S]+Phase 8[\s\S]+Phase 9[\s\S]+Phase 10[\s\S]+Phase 11[\s\S]+Phase 12/);

console.log('Phase 1 product-contract checks passed.');
