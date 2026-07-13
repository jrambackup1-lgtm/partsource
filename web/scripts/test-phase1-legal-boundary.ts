import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const memoPath = path.join(repoRoot, 'research', 'legal-boundary.md');

assert.ok(
  fs.existsSync(memoPath),
  'research/legal-boundary.md must exist as the MP-1.5 legal and operational boundary memo',
);

const memo = fs.readFileSync(memoPath, 'utf8');
const normaliseNewlines = (value: string) => value.replace(/\r\n/g, '\n');

const extractSection = (value: string, heading: string, nextHeading: string) => {
  const normalised = normaliseNewlines(value);
  const start = normalised.indexOf(`## ${heading}\n`);
  const end = normalised.indexOf(`\n## ${nextHeading}\n`, start);
  assert.notEqual(start, -1, `${heading} section must exist`);
  assert.notEqual(end, -1, `${heading} section must end before ${nextHeading}`);
  return normalised.slice(start, end);
};

assert.match(memo, /subordinate to `research\/product-contract\.md`/i);
assert.match(memo, /boundary memo, not legal advice/i);
assert.match(memo, /not (?:a )?launch-ready privacy (?:notice|policy), terms, or retention policy/i);
assert.doesNotMatch(memo, /counsel[- ]approved|approved by counsel/i);

const operator = extractSection(memo, 'Operator and jurisdiction status', 'Current data-flow boundary');
for (const unresolvedField of ['Legal name', 'Address', 'Jurisdiction', 'Responsible owner']) {
  assert.match(
    operator,
    new RegExp(`^\\| ${unresolvedField} \\| Unresolved \\|[^\\n]+Phase 7[^\\n]+launch blocker[^\\n]+\\|$`, 'im'),
    `${unresolvedField} must remain an unresolved Phase 7 launch blocker`,
  );
}
assert.match(operator, /repository contains no evidence sufficient to name an operator entity/i);

const dataFlow = extractSection(memo, 'Current data-flow boundary', 'Minimum privacy and rights boundary');
for (const currentFlow of [
  'browser-local BOM',
  'localStorage',
  'CSV import',
  'CSV export',
  'PDF export',
  'outbound supplier search links',
  'user-initiated mailto',
  'clipboard',
  'GitHub Pages',
]) {
  assert.match(dataFlow, new RegExp(currentFlow, 'i'), `current data flow must include ${currentFlow}`);
}
assert.match(dataFlow, /CSV and PDF processing[^\n]+(?:browser|device)/i);
for (const absentFlow of ['application backend', 'customer authentication', 'analytics', 'server submission']) {
  assert.match(dataFlow, new RegExp(`no ${absentFlow}`, 'i'), `current boundary must state no ${absentFlow}`);
}
assert.match(dataFlow, /third parties control their own systems/i);
assert.match(dataFlow, /does not claim[^\n]+retention/i);

const privacy = extractSection(memo, 'Minimum privacy and rights boundary', 'Engineering and liability boundary');
for (const noticeField of [
  'operator identity',
  'data categories',
  'purposes',
  'legal basis',
  'recipients',
  'retention',
  'rights',
  'contact',
  'jurisdiction',
]) {
  assert.match(privacy, new RegExp(noticeField, 'i'), `privacy boundary must include ${noticeField}`);
}
assert.match(privacy, /local-device deletion/i);
assert.match(privacy, /CSV[^\n]+export/i);
assert.match(privacy, /future quote[^\n]+retention[^\n]+deletion/i);
assert.match(privacy, /analytics[^\n]+never[^\n]+BOM contents/i);

const liability = extractSection(memo, 'Engineering and liability boundary', 'Affiliate and supplier-data boundary');
for (const disclaimer of [
  'independent verification',
  'suitability',
  'certification',
  'equivalence',
  'approval',
  'price',
  'stock',
  'availability',
  'safety-critical',
  'qualified review',
]) {
  assert.match(liability, new RegExp(disclaimer, 'i'), `liability boundary must include ${disclaimer}`);
}

const supplierData = extractSection(memo, 'Affiliate and supplier-data boundary', 'Phase gates and go/no-go blockers');
assert.match(supplierData, /before any compensated link/i);
assert.match(supplierData, /clear and conspicuous/i);
for (const supplierRule of [
  'written',
  'sanctioned access',
  'attribution',
  'rate limits',
  'redistribution',
  'freshness',
  'login-wall circumvention',
  'gray-area scraping',
]) {
  assert.match(supplierData, new RegExp(supplierRule, 'i'), `supplier-data boundary must include ${supplierRule}`);
}

const gates = extractSection(memo, 'Phase gates and go/no-go blockers', 'Unresolved counsel questions');
for (const phase of ['Phase 7', 'Phase 8', 'Phase 9', 'Phase 11']) {
  assert.match(gates, new RegExp(`^\\| ${phase} \\|[^\\n]+\\|[^\\n]+\\| No-go[^\\n]+\\|$`, 'mi'), `${phase} must have a no-go gate`);
}
assert.match(gates, /legal launch pack/i);
assert.match(gates, /tenant|authorization/i);
assert.match(gates, /written permission|signed supplier/i);
assert.match(gates, /legal entity|banking|tax|insurance/i);

const questions = extractSection(memo, 'Unresolved counsel questions', 'Official sources');
for (const question of [
  'operator',
  'applicable jurisdictions',
  'localStorage',
  'quote',
  'affiliate',
  'supplier',
  'commerce',
]) {
  assert.match(questions, new RegExp(question, 'i'), `counsel questions must cover ${question}`);
}

const sources = normaliseNewlines(memo).slice(normaliseNewlines(memo).indexOf('## Official sources\n'));
assert.match(sources, /Retrieved: 2026-07-13/);
for (const jurisdiction of ['India', 'European Union', 'United Kingdom', 'California / United States', 'United States', 'Hosting', 'Supplier access']) {
  assert.match(sources, new RegExp(`^\\| ${jurisdiction.replace('/', '\\/')} \\|`, 'm'), `official sources must label ${jurisdiction}`);
}
for (const officialHost of [
  'meity.gov.in',
  'eur-lex.europa.eu',
  'ico.org.uk',
  'cppa.ca.gov',
  'ftc.gov',
  'docs.github.com',
  'mcmaster.com',
  'consumeraffairs.nic.in',
]) {
  assert.match(sources, new RegExp(`https:\\/\\/(?:www\\.)?${officialHost.replace('.', '\\.')}`), `sources must include direct official URL for ${officialHost}`);
}

const crlfFixture = normaliseNewlines(memo).replace(/\n/g, '\r\n');
assert.equal(
  extractSection(crlfFixture, 'Current data-flow boundary', 'Minimum privacy and rights boundary'),
  dataFlow,
  'data-flow parsing must be LF/CRLF safe',
);
assert.equal(
  extractSection(crlfFixture, 'Phase gates and go/no-go blockers', 'Unresolved counsel questions'),
  gates,
  'phase-gate parsing must be LF/CRLF safe',
);

console.log('Phase 1 legal-boundary checks passed.');
