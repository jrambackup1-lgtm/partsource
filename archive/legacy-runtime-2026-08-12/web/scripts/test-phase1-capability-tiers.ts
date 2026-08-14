import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const documentPath = path.join(repoRoot, 'research', 'capability-tiers.md');

assert.ok(
  fs.existsSync(documentPath),
  'research/capability-tiers.md must exist as the MP-1.3 capability-tier contract',
);

const document = fs.readFileSync(documentPath, 'utf8');
const normaliseNewlines = (value: string) => value.replace(/\r\n/g, '\n');

const extractTierSections = (value: string) => {
  const normalised = `${normaliseNewlines(value).trimEnd()}\n## END\n`;
  const matches = [...normalised.matchAll(/^## Tier: (.+)\n([\s\S]*?)(?=^## )/gm)];
  return matches.map((match) => ({ name: match[1].trim(), body: match[2] }));
};

assert.match(document, /subordinate to `research\/product-contract\.md`/i);
assert.match(document, /consistent with `research\/mvp-boundary\.md`/i);

const expectedTiers = [
  'Personal/local',
  'Company/team',
  'Enterprise extensions',
  'Brokerage/commerce',
] as const;
const tierSections = extractTierSections(document);
assert.deepEqual(
  tierSections.map(({ name }) => name),
  expectedTiers,
  'the contract must define exactly the four capability tiers in roadmap order',
);

const dimensions = [
  'User',
  'Identity',
  'Storage',
  'Collaboration',
  'Commercial data',
  'Operational owner',
  'Earliest phase',
  'Entry trigger',
  'Unavailable before gate',
] as const;

for (const tier of tierSections) {
  for (const dimension of dimensions) {
    assert.match(
      tier.body,
      new RegExp(`^- \\*\\*${dimension}:\\*\\*\\s+\\S.+$`, 'm'),
      `${tier.name} must state ${dimension}`,
    );
  }
}

const tierBody = (name: (typeof expectedTiers)[number]) => {
  const body = tierSections.find((tier) => tier.name === name)?.body;
  assert.ok(body, `${name} tier must exist`);
  return body;
};

const personal = tierBody('Personal/local');
assert.match(personal, /anonymous/i);
assert.match(personal, /browser-local/i);
assert.match(personal, /localStorage/);
assert.match(personal, /only current product tier through Phase 7/i);
assert.match(personal, /user-entered or imported costs/i);
for (const unavailable of [
  'account',
  'cloud sync',
  'team approval',
  'audit history',
  'server submission',
]) {
  assert.match(personal, new RegExp(unavailable, 'i'), `Personal/local must exclude ${unavailable}`);
}

const company = tierBody('Company/team');
assert.match(company, /Phase 8 only/i);
assert.match(company, /backend trigger/i);
for (const foundation of ['threat model', 'tenant and identity model', 'RBAC', 'authorization tests']) {
  assert.match(company, new RegExp(foundation, 'i'), `Company/team security foundation must include ${foundation}`);
}
for (const trigger of [
  'Five qualified quote attempts in one month',
  'lost submissions or mailto/URL-size failure',
  'attachments or multiple staff handlers',
  'Three target companies request shared/cross-device workflows',
]) {
  assert.match(company, new RegExp(trigger, 'i'), `Company/team must retain backend trigger: ${trigger}`);
}

const enterprise = tierBody('Enterprise extensions');
assert.match(enterprise, /after the Phase 8 foundation/i);
assert.match(enterprise, /individually demand-gated/i);
for (const unavailable of [
  'SSO/SAML',
  'SCIM',
  'punchout/cXML',
  'ERP/PO fields',
  'contractual security',
  'customer retention',
  'restricted-supplier',
  'compliance policies',
]) {
  assert.match(enterprise, new RegExp(unavailable, 'i'), `Enterprise extensions must gate ${unavailable}`);
}

const brokerage = tierBody('Brokerage/commerce');
assert.match(brokerage, /Phase 11 only/i);
for (const requirement of [
  'repeat qualified customers',
  'proven economics',
  'signed suppliers',
  'legal entity',
  'banking',
  'tax process',
  'insurance',
  'terms',
  'returns/quality process',
  'traceability',
  'staff capacity',
  'support SLA',
]) {
  assert.match(brokerage, new RegExp(requirement, 'i'), `Brokerage/commerce must require ${requirement}`);
}

const sectionSource = `${normaliseNewlines(document).trimEnd()}\n## END\n`;
const presentation = sectionSource.match(/^## Presentation rules\n([\s\S]*?)(?=^## )/m)?.[1];
assert.ok(presentation, 'Presentation rules section must exist');
assert.match(presentation, /roadmap context/i);
assert.match(presentation, /not available features/i);
for (const prohibited of [
  'fake locked nav',
  'avatars',
  'approvals',
  'admin',
  'account',
  'order',
  'tracking',
  'compliance',
  'live price',
  'savings theatre',
]) {
  assert.match(presentation, new RegExp(prohibited, 'i'), `current UI must prohibit ${prohibited}`);
}

const productTruth = sectionSource.match(/^## Product Truth alignment\n([\s\S]*?)(?=^## )/m)?.[1];
assert.ok(productTruth, 'Product Truth alignment section must exist');
for (const boundary of [
  'configuration is not stock',
  'search URL is not an offer',
  'candidate is not an equivalent',
  'equivalent is not approved',
  'sanctioned source and timestamp',
  'user-entered or imported costs',
  'not PartSource prices, offers, or savings',
]) {
  assert.match(productTruth, new RegExp(boundary, 'i'), `Product Truth alignment must state: ${boundary}`);
}

const crlfFixture = normaliseNewlines(document).replace(/\n/g, '\r\n');
assert.deepEqual(
  extractTierSections(crlfFixture),
  tierSections,
  'tier parsing must be LF/CRLF safe',
);

console.log('Phase 1 capability-tier checks passed.');
