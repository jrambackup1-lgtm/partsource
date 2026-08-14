import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const boundaryPath = path.join(repoRoot, 'research', 'mvp-boundary.md');

assert.ok(
  fs.existsSync(boundaryPath),
  'research/mvp-boundary.md must exist as the supporting MVP boundary contract',
);

const boundary = fs.readFileSync(boundaryPath, 'utf8');

const normaliseNewlines = (value: string) => value.replace(/\r\n/g, '\n');

const extractSection = (value: string, heading: string, nextHeading: string) => {
  const normalised = normaliseNewlines(value);
  const start = normalised.indexOf(`## ${heading}\n`);
  const end = normalised.indexOf(`\n## ${nextHeading}\n`, start);
  assert.notEqual(start, -1, `${heading} section must exist`);
  assert.notEqual(end, -1, `${heading} section must end before ${nextHeading}`);
  return normalised.slice(start, end);
};

assert.match(boundary, /Historical phase-mapping input/i);
assert.match(boundary, /product-contract\.md[^\r\n]+production-readiness-plan\.md[^\r\n]+control current scope/i);

const capabilities = extractSection(boundary, 'Target MVP capabilities', 'Supported hardware');
const requiredCapabilities = [
  ['Standard fasteners', 'Phase 2'],
  ['Safe discovery', 'Phase 4'],
  ['Technical reference', 'Phase 5'],
  ['Anonymous browser-local BOM', 'Phase 6'],
  ['Truthful CSV/PDF exports', 'Phase 6'],
  ['Supplier search handoffs', 'Phase 5'],
  ['Controlled quote validation', 'Phase 7'],
] as const;

for (const [capability, phase] of requiredCapabilities) {
  const row = capabilities.match(new RegExp(`^\\| ${capability.replace('/', '\\/')} \\| (.+) \\| (${phase}) \\| (.+) \\| (.+) \\|$`, 'm'));
  assert.ok(row, `${capability} must state current state, ${phase} ownership, gate, and acceptance boundary`);
  assert.match(row[1], /Current|Partial|Not shipped/, `${capability} must distinguish current shipped state`);
  assert.ok(row[3].trim(), `${capability} must state an entry or gate`);
  assert.ok(row[4].trim(), `${capability} must state an acceptance boundary`);
}

const hardware = extractSection(boundary, 'Supported hardware', 'Quote boundary');
for (const category of ['Screws and bolts', 'Nuts', 'Washers']) {
  assert.match(hardware, new RegExp(`^\\| ${category} \\| Target supported \\|[^\\n]+taxonomy[^\\n]+provenance[^\\n]+\\|$`, 'im'));
}
assert.match(hardware, /^\| Pins \| Unsupported \|[^\n]+later reviewed taxonomy\/evidence decision[^\n]+\|$/im);
for (const excluded of ['Bearings', 'Rivets', 'Pneumatics', 'Raw stock', 'Electrical', 'Other categories']) {
  assert.match(hardware, new RegExp(`^\\| ${excluded} \\| Outside MVP \\|`, 'im'), `${excluded} must be outside the MVP`);
}

const quote = extractSection(boundary, 'Quote boundary', 'End-to-end MVP acceptance journey');
assert.match(quote, /current mailto\/clipboard sourcing-help lead/i);
assert.match(quote, /not dependable quote submission, acknowledgement, order creation, or quote status/i);
assert.match(quote, /future Phase 7 controlled quote validation/i);
assert.match(quote, /not currently shipped/i);
for (const requirement of [
  'frozen BOM snapshot',
  'explicit consent',
  'ownership',
  'acknowledgement',
  'SLA/status',
  'deletion path',
]) {
  assert.match(quote, new RegExp(requirement, 'i'), `controlled quote validation must require ${requirement}`);
}

const journey = extractSection(boundary, 'End-to-end MVP acceptance journey', 'Explicit non-goals');
for (const outcome of [
  'discover',
  'technical reference',
  'browser-local BOM',
  'CSV or PDF',
  'supplier-site search',
  'independent verification',
  'controlled quote validation',
]) {
  assert.match(journey, new RegExp(outcome, 'i'), `acceptance journey must include ${outcome}`);
}

const nonGoals = normaliseNewlines(boundary).slice(normaliseNewlines(boundary).indexOf('## Explicit non-goals\n'));
for (const nonGoal of [
  'live or synthetic prices',
  'inventory',
  'confirmed supplier listings',
  'equivalence or approval without evidence',
  'authentication or cloud collaboration',
  'commerce',
  'brokerage',
  'bulk scraping',
  'scaled pSEO indexing',
]) {
  assert.match(nonGoals, new RegExp(nonGoal, 'i'), `non-goals must exclude ${nonGoal}`);
}

const reviewFailures: string[] = [];
const safeDiscoveryRow = capabilities.match(/^\| Safe discovery \|.+\|$/m)?.[0] ?? '';
const goldenCorpusPacket = safeDiscoveryRow.match(/MP-4\.\d+ golden corpus/)?.[0];
if (goldenCorpusPacket !== 'MP-4.12 golden corpus') {
  reviewFailures.push('Safe discovery must assign the golden corpus gate to exact packet MP-4.12');
}

const enterpriseNonGoal = nonGoals.match(/^- .*enterprise.*$/im)?.[0] ?? '';
for (const requirement of [
  'SSO/SAML',
  'SCIM',
  'punchout/cXML',
  'ERP/PO integration',
  'compliance policy/workflows',
]) {
  if (!enterpriseNonGoal.includes(requirement)) {
    reviewFailures.push(`enterprise non-goal must exclude ${requirement}`);
  }
}
if (!/individually demand-gated after the Phase 8 foundation/i.test(enterpriseNonGoal)) {
  reviewFailures.push('enterprise non-goal must retain individually demand-gated ownership after the Phase 8 foundation');
}

assert.deepEqual(reviewFailures, [], `review corrections missing:\n${reviewFailures.join('\n')}`);

const crlfFixture = boundary.replace(/\r?\n/g, '\r\n');
assert.equal(
  extractSection(crlfFixture, 'Target MVP capabilities', 'Supported hardware'),
  capabilities,
  'capability parsing must be LF/CRLF safe',
);
assert.equal(
  extractSection(crlfFixture, 'Supported hardware', 'Quote boundary'),
  hardware,
  'hardware parsing must be LF/CRLF safe',
);

console.log('Phase 1 MVP-boundary checks passed.');
