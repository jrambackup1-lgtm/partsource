import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');

const documentPaths = {
  agents: path.join(repoRoot, 'AGENTS.md'),
  context: path.join(repoRoot, 'CONTEXT.md'),
  handoff: path.join(repoRoot, 'HANDOFF_NEXT_SESSION.md'),
  product: path.join(repoRoot, 'PRODUCT.md'),
  readme: path.join(repoRoot, 'README.md'),
  spec: path.join(repoRoot, 'SPEC_CONFIRMATION.md'),
  contract: path.join(repoRoot, 'research', 'product-contract.md'),
  prd: path.join(repoRoot, 'research', 'prd.md'),
  researchIndex: path.join(repoRoot, 'research', 'README.md'),
  wayfinder: path.join(repoRoot, '.wayfinder', 'poc-ship', 'poc-ship-map.md'),
} as const;

for (const [name, documentPath] of Object.entries(documentPaths)) {
  assert.ok(fs.existsSync(documentPath), `${name} product document must exist`);
}

const documents = Object.fromEntries(
  Object.entries(documentPaths).map(([name, documentPath]) => [
    name,
    fs.readFileSync(documentPath, 'utf8').replace(/\r\n/g, '\n'),
  ]),
) as Record<keyof typeof documentPaths, string>;

const catalogFlow = 'query → catalog level → family → filters → result list';
const exactFlow = 'exact ID → correct family/context → result list → exact item highlighted';
const coreRule = 'Search determines catalog depth. Catalog context stays visible. Filters narrow the list. Exact ID highlights the matching item. User selects.';

assert.match(documents.contract, /Status:\*\* Authoritative — sole current source of truth/);
assert.match(documents.contract, /Wayfinder, dated research, prototypes, old plans, and archived files are historical evidence/);

for (const name of ['agents', 'contract', 'handoff', 'prd', 'product', 'readme', 'researchIndex', 'spec', 'wayfinder'] as const) {
  assert.ok(documents[name].includes(catalogFlow), `${name} must state the current catalog flow`);
}

for (const name of ['contract', 'handoff', 'prd', 'spec'] as const) {
  assert.ok(documents[name].includes(exactFlow), `${name} must state the current exact-ID flow`);
  assert.match(documents[name], /Non-exact search never auto-selects|Never auto-select a part|non-exact input never selects/i);
}

for (const name of ['contract', 'handoff', 'product', 'spec'] as const) {
  assert.ok(documents[name].includes(coreRule), `${name} must state the core product rule`);
}

for (const term of [
  'typed',
  'category hierarchy',
  'family schemas',
  'filters',
  'matching',
  'provenance',
  'fail-closed',
]) {
  for (const name of ['contract', 'prd', 'spec'] as const) {
    assert.match(documents[name], new RegExp(term, 'i'), `${name} must include deterministic ${term}`);
  }
}

for (const name of ['agents', 'contract', 'handoff', 'product', 'spec'] as const) {
  assert.match(documents[name], /No AI or agents (?:run|run in|run in the product|run in PartSource)|uses no AI or agents/i);
}

for (const forbiddenHistory of [
  /Direction A/i,
  /Ticket 30/i,
  /bounded intent-adaptive resolver/i,
  /22 (?:browser )?scenario/i,
  /138 (?:assertions|checks)/i,
  /agent orchestration/i,
  /validation history/i,
]) {
  assert.doesNotMatch(documents.spec, forbiddenHistory, 'product spec must contain product behavior only');
}

for (const obsoleteContractSection of [
  /## Phase ownership register/i,
  /## Product Truth Contract/i,
  /Vite \+ React SPA/i,
  /Tailwind CSS 4/i,
  /GitHub Pages/i,
]) {
  assert.doesNotMatch(documents.contract, obsoleteContractSection, 'product contract must not contain old implementation planning');
}

for (const boundary of [
  'engineering approval',
  'application suitability',
  'equivalence',
  'replacement',
  'price',
  'stock',
  'availability',
]) {
  assert.match(documents.contract, new RegExp(boundary, 'i'), `contract must retain the ${boundary} claim boundary`);
  assert.match(documents.spec, new RegExp(boundary, 'i'), `spec must retain the ${boundary} claim boundary`);
}

const currentHandoff = documents.handoff.split('\n---\n', 1)[0];
assert.match(currentHandoff, /Product-direction cleanup complete/);
assert.doesNotMatch(currentHandoff, /Direction A|Ticket 30|138 assertions|22 browser scenario/i);
assert.match(currentHandoff, /Do not start `\/to-spec` without Jay's explicit instruction/);

assert.match(documents.wayfinder, /## Historical evidence index/);
assert.match(documents.wayfinder, /## Historical decision record/);
assert.match(documents.wayfinder, /The existing web app is legacy implementation evidence/);

for (const relativePath of [
  'research/business-plan.md',
  'research/capability-tiers.md',
  'research/competitive-matrix.md',
  'research/mvp-boundary.md',
  'research/production-readiness-plan.md',
  'research/proxy-validation-gate-contract-2026-08-10.md',
  'research/unit-economics.md',
  'research/user-research-plan.md',
]) {
  const content = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
  assert.match(content, /HISTORICAL/, `${relativePath} must be marked historical`);
}

console.log('Current product-document contract checks passed.');
