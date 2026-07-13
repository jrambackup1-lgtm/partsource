import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const matrixPath = path.join(repoRoot, 'research', 'competitive-matrix.md');

assert.ok(
  fs.existsSync(matrixPath),
  'research/competitive-matrix.md must exist for MP-1.7',
);

const matrix = fs.readFileSync(matrixPath, 'utf8');
const normalized = matrix.replace(/\r\n/g, '\n');

assert.match(normalized, /subordinate to `research\/product-contract\.md`/i);
assert.match(normalized, /## Evidence-state legend/);
for (const state of [
  'Documented',
  'Partial',
  'Not confirmed',
  'Not applicable',
  'PartSource target — Phase X',
]) {
  assert.ok(normalized.includes(`\`${state}\``), `legend must define ${state}`);
}

const capabilitySection = normalized.match(
  /## Capability matrix\n([\s\S]+?)\n## Role and category distinction/,
)?.[1];
assert.ok(capabilitySection, 'capability matrix section must exist');

const header = capabilitySection.split('\n').find((line) => line.startsWith('| User task |'));
assert.ok(header, 'capability matrix must have a User task header');
for (const product of [
  'McMaster-Carr',
  'Grainger',
  'Fastenal',
  'MISUMI',
  'RS',
  'Bolt Depot',
  'Amazon Business',
  'PartSource',
]) {
  assert.ok(header.includes(`| ${product} `), `matrix must include ${product}`);
}

const requiredTasks = [
  'Exact identifier lookup',
  'Broad discovery and filtering',
  'Technical specification and reference',
  'CAD availability',
  'Alternatives and cross-reference status',
  'Public commercial visibility',
  'Supplier search and handoff',
  'BOM and list workflow',
  'Company procurement controls',
  'Anonymous and local use',
  'Verification boundary',
];

const controlledState = /^\*\*(?:Documented|Partial|Not confirmed|Not applicable|PartSource target — Phase \d+)\*\*(?: — .+)?$/;
for (const task of requiredTasks) {
  const row = capabilitySection
    .split('\n')
    .find((line) => line.startsWith(`| ${task} |`));
  assert.ok(row, `missing capability row: ${task}`);
  const cells = row.split('|').slice(2, -1).map((cell) => cell.trim());
  assert.equal(cells.length, 8, `${task} must compare all eight products`);
  for (const cell of cells) {
    assert.match(cell, controlledState, `${task} has an uncontrolled evidence state: ${cell}`);
  }
}

assert.match(normalized, /## Role and category distinction/);
for (const role of [
  'retailer/distributor catalog',
  'marketplace',
  'manufacturer/configurator',
  'standards-first discovery and local-BOM tool',
]) {
  assert.match(normalized, new RegExp(role, 'i'), `missing category distinction: ${role}`);
}

assert.match(normalized, /## Task-based findings by persona/);
for (const persona of [
  'Engineers',
  'Procurement users',
  'Maintenance users',
  'Small-company buyers',
]) {
  assert.match(normalized, new RegExp(`### ${persona}\\n`), `missing persona findings: ${persona}`);
}

for (const decisionSection of [
  'Defensible wedge',
  'Table stakes',
  'Gaps',
  'Explicit no-build decisions',
]) {
  assert.match(normalized, new RegExp(`### ${decisionSection}\\n`), `missing ${decisionSection}`);
}

for (const phase of [2, 4, 5, 6, 8, 9, 11]) {
  assert.match(normalized, new RegExp(`Phase ${phase}`), `missing master-plan tie to Phase ${phase}`);
}

for (const boundary of [
  'PartSource is not a supplier catalog, marketplace, price-comparison engine, approved-vendor system, order system, or procurement system of record.',
  'A configuration is not necessarily manufactured or stocked.',
  'A supplier-site search URL is not an offer.',
  'A candidate is not an equivalent.',
  'An equivalent is not approved without organizational approval.',
  'PartSource has no live offers, verified equivalents, approvals, supplier listings, accounts, or commerce.',
]) {
  assert.ok(normalized.includes(boundary), `missing Product Truth disclaimer: ${boundary}`);
}

assert.match(normalized, /## Official sources/);
assert.match(normalized, /Retrieved: 2026-07-13/g);
for (const officialHost of [
  'mcmaster.com',
  'grainger.com',
  'fastenal.com',
  'misumi-ec.com',
  'rs-online.com',
  'boltdepot.com',
  'business.amazon.com',
]) {
  assert.match(
    normalized,
    new RegExp(`https:\\/\\/(?:www\\.)?[^)\\s]*${officialHost.replace('.', '\\.')}`),
    `missing direct official source for ${officialHost}`,
  );
}

assert.doesNotMatch(normalized, /https?:\/\/(?:www\.)?(?:google|bing)\./i);
assert.match(normalized, /Not confirmed/);

const crlfFixture = normalized.replace(/\n/g, '\r\n');
assert.match(crlfFixture, /## Capability matrix\r\n/);
assert.match(crlfFixture, /^\| Exact identifier lookup \|/m);

console.log('Phase 1 competitive-matrix checks passed.');
