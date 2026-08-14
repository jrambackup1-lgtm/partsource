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
const officialSourcesSection = normalized.match(
  /## Official sources\n([\s\S]+?)\n## Internal authority sources/,
)?.[1];
assert.ok(officialSourcesSection, 'official sources section must have competitor sources');

const approvedOfficialHosts: Record<string, ReadonlySet<string>> = {
  'McMaster-Carr': new Set(['mcmaster.com', 'www.mcmaster.com']),
  'Grainger': new Set(['grainger.com', 'www.grainger.com']),
  'Fastenal': new Set(['fastenal.com', 'www.fastenal.com']),
  'MISUMI': new Set([
    'account.misumi-ec.com',
    'my.misumi-ec.com',
    'uk.misumi-ec.com',
    'us.misumi-ec.com',
  ]),
  'RS': new Set([
    'at.rs-online.com',
    'au.rs-online.com',
    'my.rs-online.com',
    'za.rs-online.com',
  ]),
  'Bolt Depot': new Set(['boltdepot.com', 'www.boltdepot.com']),
  'Amazon Business': new Set(['business.amazon.com']),
};

function isApprovedOfficialSource(
  sourceUrl: string,
  approvedHosts: ReadonlySet<string>,
): boolean {
  try {
    const parsed = new URL(sourceUrl);
    return parsed.protocol === 'https:' && approvedHosts.has(parsed.hostname.toLowerCase());
  } catch {
    return false;
  }
}

let checkedOfficialSourceCount = 0;
for (const [competitor, approvedHosts] of Object.entries(approvedOfficialHosts)) {
  const escapedCompetitor = competitor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const competitorSources = officialSourcesSection.match(
    new RegExp(`### ${escapedCompetitor}\\n([\\s\\S]+?)(?=\\n### |$)`),
  )?.[1];
  assert.ok(competitorSources, `missing official source group for ${competitor}`);

  const sourceUrls = [...competitorSources.matchAll(/\]\(([^)]+)\)/g)].map(
    (match) => match[1],
  );
  assert.ok(sourceUrls.length > 0, `missing direct official source for ${competitor}`);

  for (const sourceUrl of sourceUrls) {
    const parsed = new URL(sourceUrl);
    assert.equal(parsed.protocol, 'https:', `${competitor} source must use HTTPS: ${sourceUrl}`);
    assert.ok(
      approvedHosts.has(parsed.hostname.toLowerCase()),
      `${competitor} source must use an approved official hostname: ${sourceUrl}`,
    );
    checkedOfficialSourceCount += 1;
  }
}
assert.equal(
  checkedOfficialSourceCount,
  [...officialSourcesSection.matchAll(/\]\(([^)]+)\)/g)].length,
  'every cited official URL must be assigned to and validated for a competitor',
);

for (const [competitor, spoofedUrl] of [
  ['Grainger', 'https://evil.example/path/grainger.com'],
  ['McMaster-Carr', 'https://evil.example/?next=https://www.mcmaster.com/'],
  ['Fastenal', 'https://www.fastenal.com.evil.example/fast/help'],
]) {
  assert.equal(
    isApprovedOfficialSource(spoofedUrl, approvedOfficialHosts[competitor]),
    false,
    `spoofed URL must not count as an official ${competitor} source`,
  );
}
assert.equal(
  isApprovedOfficialSource('http://www.grainger.com/content/help', approvedOfficialHosts.Grainger),
  false,
  'HTTP source must not count as an official source',
);

assert.doesNotMatch(normalized, /https?:\/\/(?:www\.)?(?:google|bing)\./i);
assert.match(normalized, /Not confirmed/);

const crlfFixture = normalized.replace(/\n/g, '\r\n');
assert.match(crlfFixture, /## Capability matrix\r\n/);
assert.match(crlfFixture, /^\| Exact identifier lookup \|/m);

console.log('Phase 1 competitive-matrix checks passed.');
