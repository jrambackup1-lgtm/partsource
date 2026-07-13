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
const sourceUrls = [...sources.matchAll(/\]\((https:\/\/[^)\s]+)\)/g)].map((match) => match[1]);
const staleDpdpActUrl = 'https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf';

assert.ok(
  !sourceUrls.includes(staleDpdpActUrl),
  `official sources must not retain the stale DPDP Act URL: ${staleDpdpActUrl}`,
);

const requiredOfficialUrls = [
  'https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa',
  'https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf',
  'https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf',
  'https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf',
  'https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng',
  'https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/',
  'https://cppa.ca.gov/pdf/general_notices.pdf',
  'https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking',
  'https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages',
  'https://www.mcmaster.com/help/api/',
  'https://consumeraffairs.nic.in/acts-and-rules/consumer-protection/consumer-protection',
] as const;

assert.equal(new Set(sourceUrls).size, sourceUrls.length, 'official source URLs must not be duplicated');
assert.equal(sourceUrls[0], requiredOfficialUrls[0], 'current MeitY DPDP source page must be the preferred first India source');
for (const requiredUrl of requiredOfficialUrls) {
  assert.ok(sourceUrls.includes(requiredUrl), `official sources must include exact URL: ${requiredUrl}`);
}

const allowedOfficialHosts = new Set([
  'www.meity.gov.in',
  'eur-lex.europa.eu',
  'ico.org.uk',
  'cppa.ca.gov',
  'www.ftc.gov',
  'docs.github.com',
  'www.mcmaster.com',
  'consumeraffairs.nic.in',
]);
for (const sourceUrl of sourceUrls) {
  const parsed = new URL(sourceUrl);
  assert.equal(parsed.protocol, 'https:', `official source must use HTTPS: ${sourceUrl}`);
  assert.ok(allowedOfficialHosts.has(parsed.hostname), `official source host is not approved: ${parsed.hostname}`);
}

assert.match(sources, /\*\*Retrieved: 2026-07-13\. Live retrieval checked: 2026-07-13\.\*\*/);
assert.match(sources, /focused repository test validates the recorded URL strings, HTTPS, and approved hosts; it does not make live HTTP requests/i);
const sourceRows = [...sources.matchAll(/^\| ([^|]+) \| \[[^\]]+\]\((https:\/\/[^)\s]+)\) \| ([^|]+) \| ([^|]+) \|$/gm)];
assert.equal(sourceRows.length, requiredOfficialUrls.length, 'every official source must have one table row with retrieval status');
for (const [, , sourceUrl, , status] of sourceRows) {
  assert.ok(requiredOfficialUrls.includes(sourceUrl as (typeof requiredOfficialUrls)[number]), `unexpected source row URL: ${sourceUrl}`);
  assert.match(
    status.trim(),
    /^(?:Live content retrieved|Official search content retrieved; direct open timed out) on 2026-07-13\.$/,
    `source row must record exact retrieval status: ${sourceUrl}`,
  );
}
for (const jurisdiction of ['India', 'European Union', 'United Kingdom', 'California / United States', 'United States', 'Hosting', 'Supplier access']) {
  assert.match(sources, new RegExp(`^\\| ${jurisdiction.replace('/', '\\/')} \\|`, 'm'), `official sources must label ${jurisdiction}`);
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
