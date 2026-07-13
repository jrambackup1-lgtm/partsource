import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const planPath = path.join(repoRoot, 'research', 'user-research-plan.md');
const resultsPath = path.join(repoRoot, 'research', 'user-research-results.md');

assert.ok(fs.existsSync(planPath), 'research/user-research-plan.md must exist for MP-1.6');
assert.ok(fs.existsSync(resultsPath), 'research/user-research-results.md must exist for MP-1.6');

const plan = fs.readFileSync(planPath, 'utf8');
const results = fs.readFileSync(resultsPath, 'utf8');

const requiredQuotas = new Map([
  ['Engineer', 3],
  ['Procurement user', 3],
  ['Maintenance user', 2],
  ['Small-company buyer', 2],
  ['Student/hobbyist', 1],
  ['Enterprise procurement user', 1],
]);

type Session = {
  id: string;
  date: string;
  segment: string;
  durationMode: string;
  taskOutcomes: string;
  comprehension: string;
  problemEvidence: string;
  monetizationEvidence: string;
  consent: string;
};

function section(markdown: string, heading: string, nextLevel: number): string {
  const hashes = '#'.repeat(nextLevel);
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = markdown.match(new RegExp(`${hashes} ${escaped}\\r?\\n([\\s\\S]+?)(?=\\r?\\n${hashes} |$)`));
  assert.ok(match, `missing section: ${heading}`);
  return match[1];
}

function parseQuotas(markdown: string): Map<string, number> {
  const quotaSection = section(markdown, 'Segment quotas', 3);
  const rows = quotaSection
    .split(/\r?\n/)
    .filter((line) => /^\| (Engineer|Procurement user|Maintenance user|Small-company buyer|Student\/hobbyist|Enterprise procurement user) \|/.test(line));
  const quotas = new Map<string, number>();
  for (const row of rows) {
    const cells = row.split('|').slice(1, -1).map((cell) => cell.trim());
    assert.equal(cells.length, 3, `quota row must have three cells: ${row}`);
    assert.ok(!quotas.has(cells[0]), `duplicate quota row: ${cells[0]}`);
    quotas.set(cells[0], Number(cells[1]));
    assert.ok(cells[2].length > 0, `${cells[0]} needs qualifying criteria`);
  }
  return quotas;
}

const quotas = parseQuotas(plan);
assert.deepEqual(quotas, requiredQuotas, 'segment quotas must exactly match MP-1.6');
assert.equal([...quotas.values()].reduce((sum, value) => sum + value, 0), 12, 'quotas must total exactly 12 sessions');

for (const heading of [
  'Recruitment screener',
  'Consent and privacy script',
  'Moderator protocol',
  'Realistic tasks',
  'Comprehension rubric',
  'Monetization questions',
  'Session note template',
  'Evidence IDs and handling',
  'Synthesis method',
  'Stop and kill criteria',
]) {
  assert.match(plan, new RegExp(`^## ${heading}$`, 'im'), `plan needs ${heading}`);
}

const consentSection = section(plan, 'Consent and privacy script', 2);
for (const rule of ['voluntary', 'stop at any time', 'anonymized evidence ID', 'no names or contact details', 'recording']) {
  assert.match(consentSection, new RegExp(rule, 'i'), `consent script missing: ${rule}`);
}
assert.match(consentSection, /recording[^\r\n]+separate[^\r\n]+opt-in/i, 'recording requires separate opt-in');

const comprehensionSection = section(plan, 'Comprehension rubric', 2);
assert.match(comprehensionSection, /Pass/i);
assert.match(comprehensionSection, /Fail/i);
assert.match(comprehensionSection, /10 of 12/);
assert.match(comprehensionSection, /80%/);
for (const boundary of [
  'not a supplier catalog',
  'not a marketplace',
  'not a price-comparison engine',
  'independent verification',
  'browser-local BOM',
]) {
  assert.match(comprehensionSection, new RegExp(boundary, 'i'), `rubric missing product boundary: ${boundary}`);
}

const resultsHeading = results.match(/^\*\*Packet status:\*\* ([^\r\n]+)$/m)?.[1];
assert.ok(resultsHeading, 'results ledger needs an explicit packet status');
assert.match(resultsHeading, /^BLOCKED\b/, 'packet must remain BLOCKED below the evidence gate');
assert.doesNotMatch(resultsHeading, /complete|pass/i, 'blocked packet status cannot claim completion or pass');

const ledgerSection = section(results, 'Session evidence ledger', 2);
assert.match(
  ledgerSection,
  /\| Evidence ID \| Date \| Segment \| Moderated duration and mode \| Task outcomes \| Comprehension verdict \| Problem evidence \| Monetization evidence \| Consent status \|/,
  'ledger needs every required evidence field',
);

function parseSessions(markdown: string): Session[] {
  return section(markdown, 'Session evidence ledger', 2)
    .split(/\r?\n/)
    .filter((line) => /^\| PS-UR-\d{3} \|/.test(line))
    .map((line) => {
      const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
      assert.equal(cells.length, 9, `session row must have nine cells: ${line}`);
      return {
        id: cells[0],
        date: cells[1],
        segment: cells[2],
        durationMode: cells[3],
        taskOutcomes: cells[4],
        comprehension: cells[5],
        problemEvidence: cells[6],
        monetizationEvidence: cells[7],
        consent: cells[8],
      };
    });
}

function validateSession(session: Session): void {
  assert.match(session.id, /^PS-UR-\d{3}$/, 'evidence ID must be anonymized');
  assert.match(session.date, /^\d{4}-\d{2}-\d{2}$/, `${session.id} needs an ISO date`);
  assert.ok(requiredQuotas.has(session.segment), `${session.id} has an invalid segment`);
  assert.match(session.durationMode, /\d+ min; (video|audio|in person)/i, `${session.id} needs moderated duration and mode`);
  assert.ok(session.taskOutcomes.length > 0, `${session.id} needs task outcomes`);
  assert.match(session.comprehension, /^(Pass|Fail): .+/, `${session.id} needs a reasoned comprehension verdict`);
  assert.ok(session.problemEvidence.length > 0, `${session.id} needs problem evidence`);
  assert.ok(session.monetizationEvidence.length > 0, `${session.id} needs monetization evidence`);
  assert.match(session.consent, /^Consented; recording: (opted in|not recorded)$/i, `${session.id} needs consent and recording status`);
  assert.doesNotMatch(Object.values(session).join(' '), /@|https?:\/\//, `${session.id} must not contain contact details`);
}

function gate(sessions: Session[]): { complete: boolean; reason: string } {
  sessions.forEach(validateSession);
  if (sessions.length < 12) return { complete: false, reason: `${sessions.length}/12 qualifying sessions` };
  for (const [segment, quota] of requiredQuotas) {
    const count = sessions.filter((candidate) => candidate.segment === segment).length;
    if (count < quota) return { complete: false, reason: `${segment}: ${count}/${quota}` };
  }
  const passes = sessions.filter((candidate) => candidate.comprehension.startsWith('Pass:')).length;
  const requiredPasses = Math.ceil(sessions.length * 0.8);
  if (passes < requiredPasses) return { complete: false, reason: `${passes}/${sessions.length} comprehension passes` };
  return { complete: true, reason: `${sessions.length} sessions; ${passes} comprehension passes` };
}

const sessions = parseSessions(results);
assert.equal(sessions.length, 0, 'ledger must start honestly at zero sessions without primary evidence');
assert.deepEqual(gate(sessions), { complete: false, reason: '0/12 qualifying sessions' });
assert.match(results, /\*\*Qualifying sessions:\*\* 0\/12/);
assert.match(results, /\*\*Comprehension passes:\*\* 0\/10 required/);
assert.match(results, /No qualifying moderated sessions are recorded\./);
assert.match(results, /Secondary research[^\r\n]+does not count/i);
assert.match(results, /packet and Phase 1 exit gate cannot be claimed complete/i);
assert.doesNotMatch(results, /participant name|email address|phone number/i, 'ledger must not request identity or contact fields');

const validSession = (id: number, segment: string, pass = true): Session => ({
  id: `PS-UR-${String(id).padStart(3, '0')}`,
  date: '2026-07-13',
  segment,
  durationMode: '30 min; video',
  taskOutcomes: 'T1 complete; T2 complete; T3 complete',
  comprehension: `${pass ? 'Pass' : 'Fail'}: explained the verification boundary`,
  problemEvidence: 'Observed sourcing handoff friction',
  monetizationEvidence: 'Would test a quote-lead workflow; price uncommitted',
  consent: 'Consented; recording: not recorded',
});

const validTwelve = [...requiredQuotas.entries()].flatMap(([segment, count]) =>
  Array.from({ length: count }, () => segment),
).map((segment, index) => validSession(index + 1, segment, index < 10));
assert.equal(gate(validTwelve).complete, true, '12 quota-valid sessions with 10 passes must meet the gate');
assert.equal(gate(validTwelve.slice(0, 11)).complete, false, '11 sessions cannot meet the gate');
assert.equal(gate(validTwelve.map((session, index) => ({ ...session, comprehension: `${index < 9 ? 'Pass' : 'Fail'}: reason` }))).complete, false, '9/12 comprehension cannot meet the gate');
assert.equal(gate(validTwelve.map((session) => session.segment === 'Enterprise procurement user' ? { ...session, segment: 'Engineer' } : session)).complete, false, 'missing a required segment cannot meet the gate');
assert.throws(() => validateSession({ ...validTwelve[0], consent: '' }), /consent and recording status/, 'missing consent must fail evidence validation');

const crlfPlan = plan.replace(/\r?\n/g, '\r\n');
const crlfResults = results.replace(/\r?\n/g, '\r\n');
assert.deepEqual(parseQuotas(crlfPlan), requiredQuotas, 'quota parsing must be LF/CRLF safe');
assert.equal(parseSessions(crlfResults).length, sessions.length, 'ledger parsing must be LF/CRLF safe');

console.log(`Phase 1 user-research kit checks passed; packet BLOCKED at ${sessions.length}/12 sessions.`);
