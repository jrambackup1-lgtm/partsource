import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const planPath = path.join(repoRoot, 'research', 'user-research-plan.md');
const resultsPath = path.join(repoRoot, 'research', 'user-research-results.md');
const checklistPath = path.join(repoRoot, 'research', 'master-plan-checklist.md');

for (const [filePath, purpose] of [
  [planPath, 'MP-1.6 research plan'],
  [resultsPath, 'MP-1.6 evidence ledger'],
  [checklistPath, 'authoritative phase state'],
] as const) {
  assert.ok(fs.existsSync(filePath), `${path.relative(repoRoot, filePath)} must exist for ${purpose}`);
}

const plan = fs.readFileSync(planPath, 'utf8');
const results = fs.readFileSync(resultsPath, 'utf8');
const checklist = fs.readFileSync(checklistPath, 'utf8');

const requiredQuotas = new Map([
  ['Engineer', 3],
  ['Procurement user', 3],
  ['Maintenance user', 2],
  ['Small-company buyer', 2],
  ['Student/hobbyist', 1],
  ['Enterprise procurement user', 1],
]);
const decisionSetSize = 12;
const requiredComprehensionPasses = 10;

type SetTag = 'Decision' | 'Supplemental';
type PacketState = 'BLOCKED' | 'READY_FOR_CHECKLIST_REVIEW' | 'COMPLETE';
type PhaseExitState = 'BLOCKED' | 'READY_FOR_EXIT_GATE_REVIEW' | 'COMPLETE';
type CoreProblemVerdict = 'PENDING' | 'SURVIVE' | 'REVISE_RETEST' | 'KILL';
type MonetizationVerdict = 'PENDING' | 'SURVIVE_QUOTE_LEAD' | 'SURVIVE_REFERRAL' | 'SURVIVE_TEAM_SOFTWARE' | 'REVISE_RETEST' | 'KILL';
type ChecklistStates = { packet: boolean; independentReview: boolean; phaseExit: boolean };
type ResearchDecisions = {
  coreProblem: { verdict: CoreProblemVerdict; evidenceIds: string[]; thresholdAccounting: string };
  monetization: { verdict: MonetizationVerdict; evidenceIds: string[]; thresholdAccounting: string };
};
type DerivedStates = { packet: PacketState; phaseExit: PhaseExitState };
type Session = {
  id: string;
  set: SetTag;
  date: string;
  segment: string;
  durationMode: string;
  taskOutcomes: string;
  unaidedComprehension: string;
  postTaskComprehension: string;
  problemEvidence: string;
  unpromptedMonetization: string;
  aidedRanking: string;
  consent: string;
  detailedNoteRef: string;
};

function section(markdown: string, heading: string, level: number): string {
  const hashes = '#'.repeat(level);
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = markdown.match(new RegExp(`${hashes} ${escaped}\\r?\\n([\\s\\S]+?)(?=\\r?\\n${hashes} |$)`));
  assert.ok(match, `missing section: ${heading}`);
  return match[1];
}

function parseQuotas(markdown: string): Map<string, number> {
  const rows = section(markdown, 'Segment quotas', 3)
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
assert.equal([...quotas.values()].reduce((sum, value) => sum + value, 0), decisionSetSize);

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

const protocol = section(plan, 'Moderator protocol', 2);
const task1Index = protocol.indexOf('Run Task 1');
const unaidedIndex = protocol.indexOf('Score unaided comprehension immediately after Task 1');
const laterTasksIndex = protocol.indexOf('Run Tasks 2–5');
assert.ok(task1Index >= 0, 'protocol must explicitly run Task 1 before comprehension');
assert.ok(unaidedIndex > task1Index, 'unaided comprehension must follow Task 1');
assert.ok(laterTasksIndex > unaidedIndex, 'Tasks 2–5 must not reveal boundaries before unaided scoring');
assert.match(protocol, /post-task comprehension[^\r\n]+separate/i);
assert.match(protocol, /post-task[^\r\n]+cannot replace[^\r\n]+unaided/i);

const consentSection = section(plan, 'Consent and privacy script', 2);
for (const rule of ['voluntary', 'stop at any time', 'anonymized evidence ID', 'no names or contact details']) {
  assert.match(consentSection, new RegExp(rule, 'i'), `consent script missing: ${rule}`);
}
assert.match(consentSection, /recording[^\r\n]+separate[^\r\n]+opt-in/i);

const handling = section(plan, 'Evidence IDs and handling', 2);
for (const policy of ['Recording retention:', 'Note retention:', 'Access owner:', 'Deletion path:']) {
  assert.match(handling, new RegExp(policy, 'i'), `evidence handling needs ${policy}`);
}
assert.match(handling, /Recording retention:[^\r\n]+\d+ days/i);
assert.match(handling, /Note retention:[^\r\n]+\d+ months/i);
assert.match(handling, /manual anonymization review[^\r\n]+before[^\r\n]+qualif/i, 'manual anonymization review must precede qualification');

const comprehensionSection = section(plan, 'Comprehension rubric', 2);
assert.match(comprehensionSection, /unaided[^\r\n]+immediately after Task 1/i);
assert.match(comprehensionSection, /post-task comprehension[^\r\n]+separate/i);
assert.match(comprehensionSection, /10 of 12/);
for (const boundary of [
  'not a supplier catalog',
  'not a marketplace',
  'not a price-comparison engine',
  'independent verification',
  'browser-local BOM',
]) {
  assert.match(comprehensionSection, new RegExp(boundary, 'i'), `rubric missing product boundary: ${boundary}`);
}

const monetization = section(plan, 'Monetization questions', 2);
const unpromptedIndex = monetization.indexOf('### Unprompted monetization capture');
const aidedIndex = monetization.indexOf('### Aided path ranking');
assert.ok(unpromptedIndex >= 0, 'capture unprompted monetization before showing paths');
assert.ok(aidedIndex > unpromptedIndex, 'aided path ranking must follow unprompted capture');

const expectedLedgerHeader = '| Evidence ID | Set | Date | Segment | Moderated duration and mode | T1–T5 outcomes | Unaided comprehension verdict | Post-task comprehension | Problem evidence | Unprompted monetization | Aided path ranking | Consent and recording | Detailed note reference |';
const ledger = section(results, 'Session evidence ledger', 2);
assert.ok(ledger.includes(expectedLedgerHeader), 'ledger must expose the complete evidence contract');

function parseSessions(markdown: string): Session[] {
  return section(markdown, 'Session evidence ledger', 2)
    .split(/\r?\n/)
    .filter((line) => /^\| /.test(line) && !/^\| (?:Evidence ID|-{3})/.test(line))
    .map((line) => {
      const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
      assert.equal(cells.length, 13, `session row must have 13 cells: ${line}`);
      return {
        id: cells[0],
        set: cells[1] as SetTag,
        date: cells[2],
        segment: cells[3],
        durationMode: cells[4],
        taskOutcomes: cells[5],
        unaidedComprehension: cells[6],
        postTaskComprehension: cells[7],
        problemEvidence: cells[8],
        unpromptedMonetization: cells[9],
        aidedRanking: cells[10],
        consent: cells[11],
        detailedNoteRef: cells[12],
      };
    });
}

function assertSubstantive(value: string, label: string): void {
  assert.ok(value.trim().length >= 12, `${label} is non-substantive`);
  assert.doesNotMatch(value.trim(), /^(?:tbd|n\/?a|none|unknown|placeholder|test|no (?:evidence|data|answer)(?: yet)?|-+)$/i, `${label} is a placeholder`);
}

function assertPrivacySafe(value: string, label: string): void {
  const directIdentifiers: Array<[string, RegExp]> = [
    ['email', /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i],
    ['phone', /\b\d{10,15}\b|(?:\+\d{1,3}[ .-]?)?(?:\(?\d{3}\)?[ .-])\d{3}[ .-]\d{4}/],
    ['IP address', /\b(?:\d{1,3}\.){3}\d{1,3}\b/],
    ['direct URL', /\b(?:https?:\/\/|www\.)\S+/i],
    ['labeled direct identifier', /\b(?:name|employer|company|address|account|calendar|linkedin|slack)\s*[:=]\s*\S+/i],
  ];
  for (const [kind, pattern] of directIdentifiers) {
    assert.doesNotMatch(value, pattern, `${label} contains ${kind}`);
  }
}

function validateSession(session: Session, notesMarkdown: string): void {
  assert.match(session.id, /^PS-UR-\d{3}$/, 'evidence ID must be anonymized');
  assert.ok(session.set === 'Decision' || session.set === 'Supplemental', `${session.id} has an invalid set tag`);
  assert.match(session.date, /^\d{4}-\d{2}-\d{2}$/, `${session.id} needs an ISO date`);
  assert.ok(requiredQuotas.has(session.segment), `${session.id} has an invalid segment`);

  const duration = session.durationMode.match(/^(\d+) min; (video|audio|in person)$/i);
  assert.ok(duration, `${session.id} needs moderated duration and mode`);
  assert.ok(Number(duration[1]) >= 20, `${session.id} duration must be at least 20 minutes`);

  for (let task = 1; task <= 5; task += 1) {
    const outcome = session.taskOutcomes.match(new RegExp(`(?:^|<br>)T${task}=(Complete|Partial|Failed): ([^<]+)(?=<br>|$)`, 'i'));
    assert.ok(outcome, `${session.id} needs a substantive T${task} outcome`);
    assertSubstantive(outcome[2], `${session.id} T${task} outcome`);
  }

  assert.match(session.unaidedComprehension, /^(Pass|Fail): .+/, `${session.id} needs a reasoned unaided verdict`);
  assertSubstantive(session.unaidedComprehension.split(':').slice(1).join(':'), `${session.id} unaided comprehension`);
  assert.match(session.postTaskComprehension, /^(Improved|Unchanged|Regressed): .+/, `${session.id} needs separate post-task comprehension`);
  assertSubstantive(session.postTaskComprehension.split(':').slice(1).join(':'), `${session.id} post-task comprehension`);
  assertSubstantive(session.problemEvidence, `${session.id} problem evidence`);
  assertSubstantive(session.unpromptedMonetization, `${session.id} unprompted monetization`);
  assertSubstantive(session.aidedRanking, `${session.id} aided ranking`);
  assert.match(
    session.consent,
    /^Session consent: consented; anonymized notes: retained; recording: (opted in|not recorded)$/i,
    `${session.id} has invalid consent or recording state`,
  );

  const anchor = session.id.toLowerCase();
  assert.equal(session.detailedNoteRef, `[${session.id}](#${anchor}-detailed-note)`, `${session.id} needs a linked detailed note reference`);
  const notePattern = new RegExp(`^### ${session.id} detailed note\\r?\\n([\\s\\S]+?)(?=\\r?\\n### |$)`, 'gm');
  const linkedNotes = [...notesMarkdown.matchAll(notePattern)];
  assert.equal(linkedNotes.length, 1, `${session.id} must have exactly one linked detailed note`);
  const noteBody = linkedNotes[0][1].replace(/[#*_`]/g, '').trim();
  assertSubstantive(noteBody, `${session.id} detailed note`);
  assertPrivacySafe(Object.values(session).join(' '), `${session.id} ledger fields`);
  assertPrivacySafe(noteBody, `${session.id} linked note`);
}

function validateEvidence(sessions: Session[], notesMarkdown: string): void {
  const ids = new Set<string>();
  for (const session of sessions) {
    assert.ok(!ids.has(session.id), `duplicate evidence ID: ${session.id}`);
    ids.add(session.id);
    validateSession(session, notesMarkdown);
  }

  const decision = sessions.filter((session) => session.set === 'Decision');
  assert.ok(decision.length <= decisionSetSize, `decision set cannot exceed exactly ${decisionSetSize} rows`);
  for (const [segment, quota] of requiredQuotas) {
    const count = decision.filter((session) => session.segment === segment).length;
    assert.ok(count <= quota, `decision-set ${segment} count ${count} exceeds quota ${quota}`);
  }
}

function parseChecklistStates(markdown: string): ChecklistStates {
  const checked = (label: string): boolean => {
    const state = markdown.match(new RegExp(`^- \\[([ xX])\\] ${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm'))?.[1];
    assert.ok(state !== undefined, `authoritative checklist must contain ${label}`);
    return state.toLowerCase() === 'x';
  };
  return {
    packet: checked('MP-1.6 Primary user research'),
    independentReview: checked('Phase 1 independent review'),
    phaseExit: checked('Phase 1 exit gate passed'),
  };
}

function packetEvidenceGateMet(sessions: Session[]): boolean {
  const decision = sessions.filter((session) => session.set === 'Decision');
  if (decision.length !== decisionSetSize) return false;
  for (const [segment, quota] of requiredQuotas) {
    if (decision.filter((session) => session.segment === segment).length !== quota) return false;
  }
  return decision.filter((session) => session.unaidedComprehension.startsWith('Pass:')).length >= requiredComprehensionPasses;
}

function parseDecisionGates(markdown: string): ResearchDecisions {
  const rows = section(markdown, 'Structured decision gates', 2)
    .split(/\r?\n/)
    .filter((line) => /^\| (Core problem|Monetization thesis) \|/.test(line));
  assert.equal(rows.length, 2, 'results need exactly two structured research decision rows');

  const parsed = new Map(rows.map((row) => {
    const cells = row.split('|').slice(1, -1).map((cell) => cell.trim());
    assert.equal(cells.length, 4, `structured decision row must have four cells: ${row}`);
    assertSubstantive(cells[3], `${cells[0]} threshold accounting`);
    const evidenceIds = cells[2] === '—' ? [] : cells[2].split(',').map((id) => id.trim());
    return [cells[0], { verdict: cells[1], evidenceIds, thresholdAccounting: cells[3] }];
  }));
  const core = parsed.get('Core problem');
  const monetizationDecision = parsed.get('Monetization thesis');
  assert.ok(core && monetizationDecision, 'both structured decisions must be parseable');
  assert.match(core.verdict, /^(?:PENDING|SURVIVE|REVISE_RETEST|KILL)$/);
  assert.match(monetizationDecision.verdict, /^(?:PENDING|SURVIVE_QUOTE_LEAD|SURVIVE_REFERRAL|SURVIVE_TEAM_SOFTWARE|REVISE_RETEST|KILL)$/);
  return {
    coreProblem: core as ResearchDecisions['coreProblem'],
    monetization: monetizationDecision as ResearchDecisions['monetization'],
  };
}

function validateResearchDecisions(decisions: ResearchDecisions, sessions: Session[]): void {
  const decisionIds = new Set(sessions.filter((session) => session.set === 'Decision').map((session) => session.id));
  for (const [label, decision] of [
    ['core problem', decisions.coreProblem],
    ['monetization', decisions.monetization],
  ] as const) {
    const pending = decision.verdict === 'PENDING';
    assert.equal(decision.evidenceIds.length === 0, pending, `${label} verdict and evidence IDs must agree`);
    assert.equal(new Set(decision.evidenceIds).size, decision.evidenceIds.length, `${label} evidence IDs must be unique`);
    for (const id of decision.evidenceIds) {
      assert.ok(decisionIds.has(id), `${label} cites non-decision evidence ID: ${id}`);
    }
    assertSubstantive(decision.thresholdAccounting, `${label} threshold accounting`);
    const thresholdCount = decision.thresholdAccounting.match(/\b(\d+)\/12\b/)?.[1];
    assert.ok(thresholdCount !== undefined, `${label} threshold accounting needs an exact n/12 result`);
    const count = Number(thresholdCount);
    assert.ok(count >= 0 && count <= decisionSetSize, `${label} threshold count must be within 0/12–12/12`);
    if (label === 'core problem') {
      if (decision.verdict === 'SURVIVE') assert.ok(count >= 8, 'core problem SURVIVE requires at least 8/12');
      if (decision.verdict === 'REVISE_RETEST') assert.ok(count >= 5 && count <= 7, 'core problem REVISE_RETEST requires 5–7/12');
      if (decision.verdict === 'KILL') assert.ok(count <= 4, 'core problem KILL requires 0–4/12');
    } else {
      if (decision.verdict.startsWith('SURVIVE_')) assert.ok(count >= 4, 'monetization SURVIVE requires at least 4/12');
      if (decision.verdict === 'REVISE_RETEST') assert.ok(count >= 2 && count <= 3, 'monetization REVISE_RETEST requires 2–3/12');
      if (decision.verdict === 'KILL') assert.ok(count <= 1, 'monetization KILL requires 0–1/12');
    }
  }
}

function decisionsFinalized(decisions: ResearchDecisions): boolean {
  return decisions.coreProblem.verdict !== 'PENDING' && decisions.monetization.verdict !== 'PENDING';
}

function decisionsSurvive(decisions: ResearchDecisions): boolean {
  return decisions.coreProblem.verdict === 'SURVIVE' && decisions.monetization.verdict.startsWith('SURVIVE_');
}

function deriveStates(
  sessions: Session[],
  notesMarkdown: string,
  decisions: ResearchDecisions,
  checklistStates: ChecklistStates,
): DerivedStates {
  validateEvidence(sessions, notesMarkdown);
  validateResearchDecisions(decisions, sessions);
  const packetEvidenceMet = packetEvidenceGateMet(sessions);
  assert.ok(!checklistStates.packet || packetEvidenceMet, 'checklist cannot mark MP-1.6 complete while packet evidence gate is unmet');

  const packet: PacketState = !packetEvidenceMet
    ? 'BLOCKED'
    : checklistStates.packet ? 'COMPLETE' : 'READY_FOR_CHECKLIST_REVIEW';

  assert.ok(
    !checklistStates.independentReview || (packet === 'COMPLETE' && decisionsFinalized(decisions)),
    'Phase 1 independent review cannot be checked before packet completion and structured decisions',
  );
  const phasePrerequisitesMet = packet === 'COMPLETE' && decisionsSurvive(decisions) && checklistStates.independentReview;
  assert.ok(!checklistStates.phaseExit || phasePrerequisitesMet, 'Phase 1 exit gate cannot be checked before all exit prerequisites pass');
  const phaseExit: PhaseExitState = checklistStates.phaseExit
    ? 'COMPLETE'
    : phasePrerequisitesMet ? 'READY_FOR_EXIT_GATE_REVIEW' : 'BLOCKED';
  return { packet, phaseExit };
}

function summaryNumber(markdown: string, label: string, suffix: string): number {
  const escapedSuffix = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const value = markdown.match(new RegExp(`^\\*\\*${label}:\\*\\* (\\d+)${escapedSuffix}$`, 'm'))?.[1];
  assert.ok(value !== undefined, `results need ${label}`);
  return Number(value);
}

function assertNoContradictoryClaims(markdown: string, states: DerivedStates): void {
  const allowedNegativeForms = [
    /^MP-1\.6 is not complete\.$/,
    /^Phase 1 exit gate has not passed\.$/,
    /^The evidence gate is not met\.$/,
  ];
  for (const line of markdown.split(/\r?\n/)) {
    const allowedNegative = allowedNegativeForms.some((pattern) => pattern.test(line));
    const packetClaim = /\b(?:MP-1\.6(?: packet)?|packet|evidence gate)\b[^;\r\n]*\b(?:complete|passed|unblocked|met)\b/i.test(line);
    const phaseClaim = /\bPhase 1(?: exit gate)?\b[^;\r\n]*\b(?:complete|passed|unblocked|met)\b/i.test(line);
    if (packetClaim && states.packet !== 'COMPLETE') {
      assert.ok(allowedNegative, `contradictory packet completion claim: ${line}`);
    }
    if (phaseClaim && states.phaseExit !== 'COMPLETE') {
      assert.ok(allowedNegative, `contradictory phase completion claim: ${line}`);
    }
  }
}

function parseQuotaProgress(markdown: string): Map<string, { completed: number; remaining: number }> {
  const rows = section(markdown, 'Quota progress', 2)
    .split(/\r?\n/)
    .filter((line) => /^\| (Engineer|Procurement user|Maintenance user|Small-company buyer|Student\/hobbyist|Enterprise procurement user) \|/.test(line));
  return new Map(rows.map((row) => {
    const cells = row.split('|').slice(1, -1).map((cell) => cell.trim());
    assert.equal(cells.length, 4, `quota progress row must have four cells: ${row}`);
    assert.equal(Number(cells[1]), requiredQuotas.get(cells[0]), `${cells[0]} required quota drifted`);
    return [cells[0], { completed: Number(cells[2]), remaining: Number(cells[3]) }];
  }));
}

function assertResultsConsistency(markdown: string, sessions: Session[], checklistStates: ChecklistStates): DerivedStates {
  const decisions = parseDecisionGates(markdown);
  const states = deriveStates(sessions, markdown, decisions, checklistStates);
  const statedPacket = markdown.match(/^\*\*Derived MP-1\.6 packet state:\*\* ([A-Z_]+)$/m)?.[1];
  const statedPhase = markdown.match(/^\*\*Derived Phase 1 exit readiness:\*\* ([A-Z_]+)$/m)?.[1];
  assert.equal(statedPacket, states.packet, 'reported packet state must derive from packet evidence and checklist');
  assert.equal(statedPhase, states.phaseExit, 'reported phase readiness must derive from packet, decisions, review, and exit checklist');

  for (const [label, checked] of [
    ['MP-1.6 checklist', checklistStates.packet],
    ['Phase 1 independent review checklist', checklistStates.independentReview],
    ['Phase 1 exit gate checklist', checklistStates.phaseExit],
  ] as const) {
    const stated = markdown.match(new RegExp(`^\\*\\*${label.replace('.', '\\.')} state:\\*\\* (checked|unchecked)$`, 'm'))?.[1];
    assert.equal(stated, checked ? 'checked' : 'unchecked', `${label} state must match authoritative checklist`);
  }

  const decision = sessions.filter((session) => session.set === 'Decision');
  const supplemental = sessions.filter((session) => session.set === 'Supplemental');
  const passes = decision.filter((session) => session.unaidedComprehension.startsWith('Pass:')).length;
  assert.equal(summaryNumber(markdown, 'Decision-set sessions', `/${decisionSetSize}`), decision.length);
  assert.equal(summaryNumber(markdown, 'Supplemental sessions', ' excluded'), supplemental.length);
  assert.equal(summaryNumber(markdown, 'Unaided comprehension', `/${decisionSetSize}; threshold ${requiredComprehensionPasses}`), passes);

  const progress = parseQuotaProgress(markdown);
  assert.deepEqual([...progress.keys()], [...requiredQuotas.keys()], 'quota progress must contain every exact segment once');
  for (const [segment, quota] of requiredQuotas) {
    const completed = decision.filter((session) => session.segment === segment).length;
    assert.deepEqual(progress.get(segment), { completed, remaining: quota - completed }, `${segment} progress must derive from decision rows`);
  }
  assertNoContradictoryClaims(markdown, states);
  return states;
}

const sessions = parseSessions(results);
const checklistStates = parseChecklistStates(checklist);
const currentStates = assertResultsConsistency(results, sessions, checklistStates);
assert.match(results, /Secondary research[^\r\n]+does not count/i);
assert.doesNotMatch(results, /participant name|email address|phone number/i, 'ledger must not request identity fields');

// Synthetic contract fixtures only. They do not represent real participants or evidence.
const syntheticSession = (id: number, segment: string, pass = true, set: SetTag = 'Decision'): Session => {
  const evidenceId = `PS-UR-${String(id).padStart(3, '0')}`;
  return {
    id: evidenceId,
    set,
    date: '2099-01-01',
    segment,
    durationMode: '30 min; video',
    taskOutcomes: [1, 2, 3, 4, 5].map((task) => `T${task}=Complete: Synthetic fixture outcome for task ${task}`).join('<br>'),
    unaidedComprehension: `${pass ? 'Pass' : 'Fail'}: Synthetic fixture boundary explanation recorded`,
    postTaskComprehension: 'Unchanged: Synthetic fixture comparison remained stable',
    problemEvidence: 'Synthetic fixture describes a concrete sourcing consequence',
    unpromptedMonetization: 'Synthetic fixture volunteers a workflow before options',
    aidedRanking: 'Synthetic fixture ranks quote lead after options appear',
    consent: 'Session consent: consented; anonymized notes: retained; recording: not recorded',
    detailedNoteRef: `[${evidenceId}](#${evidenceId.toLowerCase()}-detailed-note)`,
  };
};
const syntheticSegments = [...requiredQuotas.entries()].flatMap(([segment, count]) => Array.from({ length: count }, () => segment));
const validTwelve = syntheticSegments.map((segment, index) => syntheticSession(index + 1, segment, index < 10));
const syntheticNotes = validTwelve.map((session) => `### ${session.id} detailed note\n\nSynthetic validator fixture only.`).join('\n\n');
const pendingDecisions: ResearchDecisions = {
  coreProblem: { verdict: 'PENDING', evidenceIds: [], thresholdAccounting: '0/12 synthetic sessions assessed for the problem decision' },
  monetization: { verdict: 'PENDING', evidenceIds: [], thresholdAccounting: '0/12 synthetic sessions assessed for monetization' },
};
const survivingDecisions: ResearchDecisions = {
  coreProblem: { verdict: 'SURVIVE', evidenceIds: ['PS-UR-001', 'PS-UR-002'], thresholdAccounting: '8/12 synthetic sessions meet the core threshold' },
  monetization: { verdict: 'SURVIVE_QUOTE_LEAD', evidenceIds: ['PS-UR-003', 'PS-UR-004'], thresholdAccounting: '4/12 synthetic sessions meet one monetization threshold' },
};
const killedDecisions: ResearchDecisions = {
  coreProblem: { verdict: 'KILL', evidenceIds: ['PS-UR-001'], thresholdAccounting: '2/12 synthetic sessions support the core problem' },
  monetization: { verdict: 'KILL', evidenceIds: ['PS-UR-002'], thresholdAccounting: '1/12 synthetic sessions support a monetization path' },
};
const unchecked: ChecklistStates = { packet: false, independentReview: false, phaseExit: false };

assert.deepEqual(deriveStates(validTwelve, syntheticNotes, pendingDecisions, unchecked), { packet: 'READY_FOR_CHECKLIST_REVIEW', phaseExit: 'BLOCKED' });
assert.deepEqual(deriveStates(validTwelve, syntheticNotes, pendingDecisions, { ...unchecked, packet: true }), { packet: 'COMPLETE', phaseExit: 'BLOCKED' }, 'packet completion stays separate from Phase 1 exit readiness');
assert.deepEqual(deriveStates(validTwelve, syntheticNotes, survivingDecisions, { packet: true, independentReview: true, phaseExit: false }), { packet: 'COMPLETE', phaseExit: 'READY_FOR_EXIT_GATE_REVIEW' });
assert.deepEqual(deriveStates(validTwelve, syntheticNotes, survivingDecisions, { packet: true, independentReview: true, phaseExit: true }), { packet: 'COMPLETE', phaseExit: 'COMPLETE' });
assert.deepEqual(deriveStates(validTwelve, syntheticNotes, killedDecisions, { packet: true, independentReview: true, phaseExit: false }), { packet: 'COMPLETE', phaseExit: 'BLOCKED' }, 'finalized kill decisions complete research but block Phase 1 exit');
assert.throws(() => deriveStates(validTwelve, syntheticNotes, killedDecisions, { packet: true, independentReview: true, phaseExit: true }), /Phase 1 exit gate cannot be checked/);
assert.deepEqual(deriveStates(validTwelve.slice(0, 11), syntheticNotes, pendingDecisions, unchecked), { packet: 'BLOCKED', phaseExit: 'BLOCKED' });
assert.deepEqual(deriveStates(validTwelve.map((session, index) => ({ ...session, unaidedComprehension: `${index < 9 ? 'Pass' : 'Fail'}: Synthetic fixture reason remains substantive` })), syntheticNotes, pendingDecisions, unchecked), { packet: 'BLOCKED', phaseExit: 'BLOCKED' });

const supplemental = syntheticSession(13, 'Engineer', true, 'Supplemental');
const supplementalNotes = `${syntheticNotes}\n\n### ${supplemental.id} detailed note\n\nSynthetic supplemental fixture only.`;
assert.equal(deriveStates([...validTwelve, supplemental], supplementalNotes, pendingDecisions, unchecked).packet, 'READY_FOR_CHECKLIST_REVIEW', 'supplemental sessions must be excluded from the exact decision set');
assert.throws(() => deriveStates([...validTwelve, syntheticSession(13, 'Engineer')], supplementalNotes, pendingDecisions, unchecked), /cannot exceed exactly 12 rows/);
assert.throws(() => deriveStates([...validTwelve, { ...validTwelve[0] }], syntheticNotes, pendingDecisions, unchecked), /duplicate evidence ID/);
assert.throws(() => validateSession({ ...validTwelve[0], durationMode: '19 min; video' }, syntheticNotes), /at least 20 minutes/);
assert.throws(() => validateSession({ ...validTwelve[0], taskOutcomes: validTwelve[0].taskOutcomes.replace(/<br>T5=.+$/, '') }, syntheticNotes), /substantive T5 outcome/);
assert.throws(() => validateSession({ ...validTwelve[0], problemEvidence: 'TBD' }, syntheticNotes), /non-substantive/);
assert.throws(() => validateSession({ ...validTwelve[0], id: 'PERSON-001' }, syntheticNotes), /evidence ID must be anonymized/);
assert.throws(() => validateSession({ ...validTwelve[0], detailedNoteRef: '[PS-UR-001](#missing)' }, syntheticNotes), /linked detailed note reference/);
assert.throws(() => validateSession({ ...validTwelve[0], detailedNoteRef: '[PS-UR-001](#ps-ur-001-detailed-note)' }, ''), /exactly one linked detailed note/);
assert.throws(() => validateSession({ ...validTwelve[0], consent: 'Session consent: consented; recording: declined' }, syntheticNotes), /invalid consent or recording state/);
assert.throws(() => validateSession(validTwelve[0], syntheticNotes.replace('Synthetic validator fixture only.', 'Contact fixture@example.com was disclosed.')), /linked note contains email/);
assert.throws(() => validateSession(validTwelve[0], syntheticNotes.replace('Synthetic validator fixture only.', 'Call 415-555-0123 for details.')), /linked note contains phone/);
assert.throws(() => validateSession(validTwelve[0], syntheticNotes.replace('Synthetic validator fixture only.', 'Observed IP 192.168.1.20 in session.')), /linked note contains IP address/);
assert.throws(() => validateSession(validTwelve[0], syntheticNotes.replace('Synthetic validator fixture only.', 'See https:\/\/example.invalid\/identity for details.')), /linked note contains direct URL/);
assert.throws(() => validateSession(validTwelve[0], syntheticNotes.replace('Synthetic validator fixture only.', 'Employer: ExampleCo was disclosed.')), /linked note contains labeled direct identifier/);
assert.throws(() => deriveStates([], '', pendingDecisions, { ...unchecked, packet: true }), /checklist cannot mark MP-1.6 complete/);
assert.throws(() => deriveStates(validTwelve, syntheticNotes, pendingDecisions, { packet: true, independentReview: false, phaseExit: true }), /Phase 1 exit gate cannot be checked/);
assert.throws(() => deriveStates(validTwelve, syntheticNotes, pendingDecisions, { packet: true, independentReview: true, phaseExit: false }), /independent review cannot be checked/);
assert.throws(() => validateResearchDecisions({ ...survivingDecisions, coreProblem: { ...survivingDecisions.coreProblem, evidenceIds: ['PS-UR-999'] } }, validTwelve), /non-decision evidence ID/);
assert.throws(() => validateResearchDecisions({ ...survivingDecisions, coreProblem: { ...survivingDecisions.coreProblem, thresholdAccounting: '7/12 synthetic sessions meet the core threshold' } }, validTwelve), /SURVIVE requires at least 8\/12/);
assert.throws(() => validateResearchDecisions({ ...survivingDecisions, monetization: { ...survivingDecisions.monetization, thresholdAccounting: '3/12 synthetic sessions meet monetization' } }, validTwelve), /SURVIVE requires at least 4\/12/);
assert.throws(() => assertNoContradictoryClaims(`${results}\nMP-1.6 complete; review not done.`, { packet: 'BLOCKED', phaseExit: 'BLOCKED' }), /contradictory packet completion claim/);
assert.doesNotThrow(() => assertNoContradictoryClaims('MP-1.6 is not complete.\nPhase 1 exit gate has not passed.', { packet: 'BLOCKED', phaseExit: 'BLOCKED' }));

const crlfPlan = plan.replace(/\r?\n/g, '\r\n');
const crlfResults = results.replace(/\r?\n/g, '\r\n');
assert.deepEqual(parseQuotas(crlfPlan), requiredQuotas, 'quota parsing must be LF/CRLF safe');
assert.equal(parseSessions(crlfResults).length, sessions.length, 'ledger parsing must be LF/CRLF safe');

const decisionCount = sessions.filter((session) => session.set === 'Decision').length;
const passCount = sessions.filter((session) => session.set === 'Decision' && session.unaidedComprehension.startsWith('Pass:')).length;
console.log(`Phase 1 user-research contract passed; packet ${currentStates.packet}; Phase 1 exit ${currentStates.phaseExit}; decision set ${decisionCount}/${decisionSetSize}; unaided comprehension ${passCount}/${decisionSetSize} (threshold ${requiredComprehensionPasses}).`);
