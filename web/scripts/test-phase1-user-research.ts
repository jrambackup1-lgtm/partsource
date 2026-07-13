import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..', '..');
const planPath = path.join(repoRoot, 'research', 'user-research-plan.md');
const resultsPath = path.join(repoRoot, 'research', 'user-research-results.md');
const checklistPath = path.join(repoRoot, 'research', 'master-plan-checklist.md');
const masterPlanPath = path.join(repoRoot, 'research', 'master-plan.md');
const productContractPath = path.join(repoRoot, 'research', 'product-contract.md');
const phasePromptPath = path.join(repoRoot, 'research', 'phase-execution-prompt.md');

for (const [filePath, purpose] of [
  [planPath, 'MP-1.6 readiness kit research plan'],
  [resultsPath, 'MP-1.6 readiness kit and MP-2.10 evidence ledger'],
  [checklistPath, 'authoritative phase state'],
  [masterPlanPath, 'authoritative phase gates'],
  [productContractPath, 'authoritative phase ownership'],
  [phasePromptPath, 'cross-session execution guard'],
] as const) {
  assert.ok(fs.existsSync(filePath), `${path.relative(repoRoot, filePath)} must exist for ${purpose}`);
}

const plan = fs.readFileSync(planPath, 'utf8');
const results = fs.readFileSync(resultsPath, 'utf8');
const checklist = fs.readFileSync(checklistPath, 'utf8');
const masterPlan = fs.readFileSync(masterPlanPath, 'utf8');
const productContract = fs.readFileSync(productContractPath, 'utf8');
const phasePrompt = fs.readFileSync(phasePromptPath, 'utf8');

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
type ReadinessKitState = 'BLOCKED' | 'READY_FOR_CHECKLIST_REVIEW' | 'COMPLETE';
type DeferredStudyState = 'BLOCKED' | 'READY_FOR_CHECKLIST_REVIEW' | 'COMPLETE';
type PhaseExitState = 'BLOCKED' | 'READY_FOR_EXIT_GATE_REVIEW' | 'COMPLETE';
type CoreProblemVerdict = 'PENDING' | 'SURVIVE' | 'REVISE_RETEST' | 'KILL';
type MonetizationVerdict = 'PENDING' | 'SURVIVE_QUOTE_LEAD' | 'SURVIVE_REFERRAL' | 'SURVIVE_TEAM_SOFTWARE' | 'REVISE_RETEST' | 'KILL';
type ChecklistStates = {
  readinessKit: boolean;
  phase1IndependentReview: boolean;
  phase1Exit: boolean;
  phase2Packets: boolean[];
  phase2IndependentReview: boolean;
  phase2Exit: boolean;
};
type ResearchDecisions = {
  coreProblem: { verdict: CoreProblemVerdict; supportingIds: string[]; contraryIds: string[]; thresholdAccounting: string };
  monetization: { verdict: MonetizationVerdict; supportingIds: string[]; contraryIds: string[]; thresholdAccounting: string };
};
type DerivedStates = { readinessKit: ReadinessKitState; deferredStudy: DeferredStudyState; phase2Exit: PhaseExitState };
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
assert.match(section(plan, 'Session note template', 2), /Manual anonymization review: passed/, 'detailed note template needs the exact manual-review attestation');

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
    ['phone', /\b\d{10,15}\b|(?:\+\d{1,3}[ .-]?)?(?:\(\d{3}\)|\d{3})[ .-]?\d{3}[ .-]?\d{4}/],
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
  const notePattern = new RegExp(`(?:^|\\r?\\n)### ${session.id} detailed note\\r?\\n([\\s\\S]+?)(?=\\r?\\n### |$)`, 'g');
  const linkedNotes = [...notesMarkdown.matchAll(notePattern)];
  assert.equal(linkedNotes.length, 1, `${session.id} must have exactly one linked detailed note`);
  const noteBody = linkedNotes[0][1].replace(/[#*_`]/g, '').trim();
  assertSubstantive(noteBody, `${session.id} detailed note`);
  assert.match(noteBody, /^Manual anonymization review: passed$/m, `${session.id} needs Manual anonymization review: passed`);
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
  const phase2Packets = [
    'MP-2.1 Taxonomy',
    'MP-2.2 Standards registry',
    'MP-2.3 Units',
    'MP-2.4 Material semantics',
    'MP-2.5 Provenance',
    'MP-2.6 Cross-reference policy',
    'MP-2.7 Catalog migration',
    'MP-2.8 Reference verification',
    'MP-2.9 Publishing lifecycle',
    'MP-2.10 Moderated primary research execution and decisions',
  ].map(checked);
  return {
    readinessKit: checked('MP-1.6 Primary research readiness kit'),
    phase1IndependentReview: checked('Phase 1 independent review'),
    phase1Exit: checked('Phase 1 exit gate passed'),
    phase2Packets,
    phase2IndependentReview: checked('Phase 2 independent review'),
    phase2Exit: checked('Phase 2 exit gate passed'),
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
    assert.equal(cells.length, 5, `structured decision row must have five cells: ${row}`);
    assertSubstantive(cells[4], `${cells[0]} threshold accounting`);
    const parseIds = (value: string): string[] => value === '—' ? [] : value.split(',').map((id) => id.trim());
    return [cells[0], {
      verdict: cells[1],
      supportingIds: parseIds(cells[2]),
      contraryIds: parseIds(cells[3]),
      thresholdAccounting: cells[4],
    }];
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
    assert.equal(new Set(decision.supportingIds).size, decision.supportingIds.length, `${label} supporting IDs must be unique`);
    assert.equal(new Set(decision.contraryIds).size, decision.contraryIds.length, `${label} contrary IDs must be unique`);
    const classifiedIds = [...decision.supportingIds, ...decision.contraryIds];
    assert.equal(new Set(classifiedIds).size, classifiedIds.length, `${label} supporting and contrary IDs must be disjoint`);
    for (const id of classifiedIds) {
      assert.ok(decisionIds.has(id), `${label} cites non-decision evidence ID: ${id}`);
    }
    assert.deepEqual(new Set(classifiedIds), decisionIds, `${label} supporting and contrary IDs must classify every decision session exactly once`);
    if (decision.verdict !== 'PENDING') {
      assert.equal(decisionIds.size, decisionSetSize, `${label} cannot be finalized before all 12 decision sessions`);
    }
    assertSubstantive(decision.thresholdAccounting, `${label} threshold accounting`);
    const thresholdCount = decision.thresholdAccounting.match(/\b(\d+)\/12\b/)?.[1];
    assert.ok(thresholdCount !== undefined, `${label} threshold accounting needs an exact n/12 result`);
    const count = Number(thresholdCount);
    assert.ok(count >= 0 && count <= decisionSetSize, `${label} threshold count must be within 0/12–12/12`);
    assert.equal(count, decision.supportingIds.length, `${label} threshold count must equal supporting evidence IDs`);
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
  const readinessKitAvailable = plan.trim().length > 0 && results.trim().length > 0;
  assert.ok(!checklistStates.readinessKit || readinessKitAvailable, 'checklist cannot mark MP-1.6 complete while the readiness kit is missing');
  const readinessKit: ReadinessKitState = !readinessKitAvailable
    ? 'BLOCKED'
    : checklistStates.readinessKit ? 'COMPLETE' : 'READY_FOR_CHECKLIST_REVIEW';

  const deferredStudyEvidenceMet = packetEvidenceGateMet(sessions) && decisionsFinalized(decisions);
  const deferredStudyChecked = checklistStates.phase2Packets[9];
  assert.ok(!deferredStudyChecked || deferredStudyEvidenceMet, 'checklist cannot mark MP-2.10 complete while the moderated study or decisions are incomplete');
  const deferredStudy: DeferredStudyState = !deferredStudyEvidenceMet
    ? 'BLOCKED'
    : deferredStudyChecked ? 'COMPLETE' : 'READY_FOR_CHECKLIST_REVIEW';

  const allPhase2PacketsChecked = checklistStates.phase2Packets.length === 10 && checklistStates.phase2Packets.every(Boolean);
  const phase2PrerequisitesMet = allPhase2PacketsChecked && deferredStudy === 'COMPLETE' && decisionsSurvive(decisions) && checklistStates.phase2IndependentReview;
  assert.ok(!checklistStates.phase2Exit || phase2PrerequisitesMet, 'Phase 2 exit gate cannot be checked before MP-2.1 through MP-2.10, surviving decisions, and independent review all pass');
  const phase2Exit: PhaseExitState = checklistStates.phase2Exit
    ? 'COMPLETE'
    : phase2PrerequisitesMet ? 'READY_FOR_EXIT_GATE_REVIEW' : 'BLOCKED';
  return { readinessKit, deferredStudy, phase2Exit };
}

function summaryNumber(markdown: string, label: string, suffix: string): number {
  const escapedSuffix = suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const value = markdown.match(new RegExp(`^\\*\\*${label}:\\*\\* (\\d+)${escapedSuffix}$`, 'm'))?.[1];
  assert.ok(value !== undefined, `results need ${label}`);
  return Number(value);
}

function assertNoContradictoryClaims(markdown: string, states: DerivedStates): void {
  const allowedNegativeForms = [
    /^MP-2\.10 is not complete\.$/,
    /^Phase 2 exit gate has not passed\.$/,
    /^The deferred research gate is not met\.$/,
  ];
  for (const line of markdown.split(/\r?\n/)) {
    const allowedNegative = allowedNegativeForms.some((pattern) => pattern.test(line));
    const studyClaim = /\b(?:MP-2\.10|deferred (?:research|study) gate)\b[^;\r\n]*\b(?:complete|passed|unblocked|met)\b/i.test(line);
    const phaseClaim = /\bPhase 2(?: exit gate)?\b[^;\r\n]*\b(?:complete|passed|unblocked|met)\b/i.test(line);
    if (studyClaim && states.deferredStudy !== 'COMPLETE') {
      assert.ok(allowedNegative, `contradictory deferred-study completion claim: ${line}`);
    }
    if (phaseClaim && states.phase2Exit !== 'COMPLETE') {
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
  const statedKit = markdown.match(/^\*\*Derived MP-1\.6 readiness-kit state:\*\* ([A-Z_]+)$/m)?.[1];
  const statedStudy = markdown.match(/^\*\*Derived MP-2\.10 deferred-study state:\*\* ([A-Z_]+)$/m)?.[1];
  const statedPhase = markdown.match(/^\*\*Derived Phase 2 deferred-study exit readiness:\*\* ([A-Z_]+)$/m)?.[1];
  assert.equal(statedKit, states.readinessKit, 'reported readiness-kit state must derive from kit availability and checklist');
  assert.equal(statedStudy, states.deferredStudy, 'reported deferred-study state must derive from session evidence, decisions, and checklist');
  assert.equal(statedPhase, states.phase2Exit, 'reported Phase 2 readiness must derive from MP-2.10, surviving decisions, review, and exit checklist');

  for (const [label, checked] of [
    ['MP-1.6 checklist', checklistStates.readinessKit],
    ['Phase 1 independent review checklist', checklistStates.phase1IndependentReview],
    ['Phase 1 exit gate checklist', checklistStates.phase1Exit],
    ['MP-2.10 checklist', checklistStates.phase2Packets[9]],
    ['Phase 2 independent review checklist', checklistStates.phase2IndependentReview],
    ['Phase 2 exit gate checklist', checklistStates.phase2Exit],
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

const phase1Plan = masterPlan.match(/^## Phase 1[^\r\n]*\r?\n([\s\S]+?)(?=^## Phase 2)/m)?.[1];
const phase2Plan = masterPlan.match(/^## Phase 2[^\r\n]*\r?\n([\s\S]+?)(?=^## Phase 3)/m)?.[1];
assert.ok(phase1Plan && phase2Plan, 'master plan must contain Phase 1 and Phase 2');
assert.match(phase1Plan, /MP-1\.6 Primary research readiness kit/i);
assert.match(phase1Plan, /user-research-plan\.md[^\r\n]+user-research-results\.md/i);
assert.doesNotMatch(phase1Plan, /Required user testing:/i, 'Phase 1 must not own real-session execution');
assert.match(phase1Plan, /Exit gate:[\s\S]+readiness kit[\s\S]+independent review/i);
assert.doesNotMatch(phase1Plan, /Exit gate:[\s\S]+(?:participants correctly explain|core problem and monetization thesis survive)/i);
assert.match(phase2Plan, /MP-2\.10 Moderated primary research execution and decisions/i);
assert.match(phase2Plan, /exactly 12[^\r\n]+three engineers[^\r\n]+three procurement users[^\r\n]+two maintenance users[^\r\n]+two small-company buyers[^\r\n]+one student\/hobbyist[^\r\n]+one enterprise procurement user/i);
assert.match(phase2Plan, /at least 10(?: of |\/)12[^\r\n]+unaided comprehension/i);
assert.match(phase2Plan, /REVISE_RETEST[^\r\n]+KILL[^\r\n]+block(?:s|ed)? Phase 2 exit/i);
assert.match(productContract, /\| Phase 1 \|[^\r\n]+primary-research readiness kit/i);
assert.match(productContract, /\| Phase 2 \|[^\r\n]+moderated primary research[^\r\n]+MP-2\.10/i);
assert.match(productContract, /\| Phase 3 \|[^\r\n]+blocked[^\r\n]+Phase 2[^\r\n]+MP-2\.10/i);
assert.match(phasePrompt, /Phase 3[^\r\n]+blocked[^\r\n]+Phase 2[^\r\n]+MP-2\.10/i);
assert.match(checklist, /^\| 1 [^|]+\| in_progress \|/m);
assert.match(checklist, /^\| 2 [^|]+\| blocked \|/m);
assert.match(checklist, /^\| 3 [^|]+\| blocked \|/m);
assert.match(checklist, /^\| MP-1\.6 \|[^\r\n]+readiness kit[^\r\n]+0\/12[^\r\n]+pass/im);
assert.match(checklist, /^\| P1-2\.10 \| 2 \|[^\r\n]+0\/12[^\r\n]+MP-2\.10[^\r\n]+Phase 2 exit[^\r\n]+open/im);

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
const syntheticNotes = validTwelve.map((session) => `### ${session.id} detailed note\n\nSynthetic validator fixture only.\n\nManual anonymization review: passed`).join('\n\n');
const decisionIdsFor = (sessionsToClassify: Session[]): string[] => sessionsToClassify
  .filter((session) => session.set === 'Decision')
  .map((session) => session.id);
const pendingDecisionsFor = (sessionsToClassify: Session[]): ResearchDecisions => {
  const ids = decisionIdsFor(sessionsToClassify);
  return {
    coreProblem: { verdict: 'PENDING', supportingIds: [], contraryIds: ids, thresholdAccounting: '0/12 synthetic sessions support the problem decision' },
    monetization: { verdict: 'PENDING', supportingIds: [], contraryIds: ids, thresholdAccounting: '0/12 synthetic sessions support monetization' },
  };
};
const ids = decisionIdsFor(validTwelve);
const pendingDecisions = pendingDecisionsFor(validTwelve);
const survivingDecisions: ResearchDecisions = {
  coreProblem: { verdict: 'SURVIVE', supportingIds: ids.slice(0, 8), contraryIds: ids.slice(8), thresholdAccounting: '8/12 synthetic sessions meet the core threshold' },
  monetization: { verdict: 'SURVIVE_QUOTE_LEAD', supportingIds: ids.slice(0, 4), contraryIds: ids.slice(4), thresholdAccounting: '4/12 synthetic sessions meet one monetization threshold' },
};
const killedDecisions: ResearchDecisions = {
  coreProblem: { verdict: 'KILL', supportingIds: ids.slice(0, 2), contraryIds: ids.slice(2), thresholdAccounting: '2/12 synthetic sessions support the core problem' },
  monetization: { verdict: 'KILL', supportingIds: ids.slice(0, 1), contraryIds: ids.slice(1), thresholdAccounting: '1/12 synthetic sessions support a monetization path' },
};
const unchecked: ChecklistStates = {
  readinessKit: false,
  phase1IndependentReview: false,
  phase1Exit: false,
  phase2Packets: Array(10).fill(false),
  phase2IndependentReview: false,
  phase2Exit: false,
};
const onlyDeferredStudyChecked = [...Array(9).fill(false), true];
const allPhase2PacketsChecked = Array(10).fill(true);

assert.deepEqual(deriveStates(validTwelve, syntheticNotes, pendingDecisions, unchecked), { readinessKit: 'READY_FOR_CHECKLIST_REVIEW', deferredStudy: 'BLOCKED', phase2Exit: 'BLOCKED' });
assert.deepEqual(deriveStates(validTwelve, syntheticNotes, survivingDecisions, unchecked), { readinessKit: 'READY_FOR_CHECKLIST_REVIEW', deferredStudy: 'READY_FOR_CHECKLIST_REVIEW', phase2Exit: 'BLOCKED' });
assert.deepEqual(deriveStates(validTwelve, syntheticNotes, survivingDecisions, { ...unchecked, readinessKit: true, phase2Packets: onlyDeferredStudyChecked }), { readinessKit: 'COMPLETE', deferredStudy: 'COMPLETE', phase2Exit: 'BLOCKED' }, 'readiness-kit completion stays separate from deferred-study completion and Phase 2 exit');
assert.equal(deriveStates(validTwelve, syntheticNotes, survivingDecisions, { ...unchecked, readinessKit: true, phase2Packets: onlyDeferredStudyChecked, phase2IndependentReview: true }).phase2Exit, 'BLOCKED', 'full Phase 2 exit cannot be ready while MP-2.1 through MP-2.9 are unchecked');
assert.deepEqual(deriveStates(validTwelve, syntheticNotes, survivingDecisions, { ...unchecked, readinessKit: true, phase2Packets: allPhase2PacketsChecked, phase2IndependentReview: true }), { readinessKit: 'COMPLETE', deferredStudy: 'COMPLETE', phase2Exit: 'READY_FOR_EXIT_GATE_REVIEW' });
assert.deepEqual(deriveStates(validTwelve, syntheticNotes, survivingDecisions, { ...unchecked, readinessKit: true, phase2Packets: allPhase2PacketsChecked, phase2IndependentReview: true, phase2Exit: true }), { readinessKit: 'COMPLETE', deferredStudy: 'COMPLETE', phase2Exit: 'COMPLETE' });
assert.deepEqual(deriveStates(validTwelve, syntheticNotes, killedDecisions, { ...unchecked, readinessKit: true, phase2Packets: allPhase2PacketsChecked, phase2IndependentReview: true }), { readinessKit: 'COMPLETE', deferredStudy: 'COMPLETE', phase2Exit: 'BLOCKED' }, 'finalized kill decisions complete MP-2.10 but block Phase 2 exit');
assert.throws(() => deriveStates(validTwelve, syntheticNotes, killedDecisions, { ...unchecked, readinessKit: true, phase2Packets: allPhase2PacketsChecked, phase2IndependentReview: true, phase2Exit: true }), /Phase 2 exit gate cannot be checked/);
assert.deepEqual(deriveStates(validTwelve.slice(0, 11), syntheticNotes, pendingDecisionsFor(validTwelve.slice(0, 11)), unchecked), { readinessKit: 'READY_FOR_CHECKLIST_REVIEW', deferredStudy: 'BLOCKED', phase2Exit: 'BLOCKED' });
assert.deepEqual(deriveStates(validTwelve.map((session, index) => ({ ...session, unaidedComprehension: `${index < 9 ? 'Pass' : 'Fail'}: Synthetic fixture reason remains substantive` })), syntheticNotes, survivingDecisions, unchecked), { readinessKit: 'READY_FOR_CHECKLIST_REVIEW', deferredStudy: 'BLOCKED', phase2Exit: 'BLOCKED' });

const supplemental = syntheticSession(13, 'Engineer', true, 'Supplemental');
const supplementalNotes = `${syntheticNotes}\n\n### ${supplemental.id} detailed note\n\nSynthetic supplemental fixture only.\n\nManual anonymization review: passed`;
assert.equal(deriveStates([...validTwelve, supplemental], supplementalNotes, survivingDecisions, unchecked).deferredStudy, 'READY_FOR_CHECKLIST_REVIEW', 'supplemental sessions must be excluded from the exact decision set');
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
assert.throws(() => deriveStates([], '', pendingDecisionsFor([]), { ...unchecked, phase2Packets: onlyDeferredStudyChecked }), /checklist cannot mark MP-2.10 complete/);
assert.throws(() => deriveStates(validTwelve, syntheticNotes, pendingDecisions, { ...unchecked, phase2Packets: onlyDeferredStudyChecked }), /checklist cannot mark MP-2.10 complete/);
assert.throws(() => deriveStates(validTwelve, syntheticNotes, survivingDecisions, { ...unchecked, phase2Packets: onlyDeferredStudyChecked, phase2Exit: true }), /Phase 2 exit gate cannot be checked/);
assert.throws(() => deriveStates(validTwelve, syntheticNotes, survivingDecisions, { ...unchecked, phase2Packets: allPhase2PacketsChecked, phase2Exit: true }), /Phase 2 exit gate cannot be checked/);
assert.throws(() => validateResearchDecisions({ ...survivingDecisions, coreProblem: { ...survivingDecisions.coreProblem, supportingIds: [...ids.slice(0, 7), 'PS-UR-999'] } }, validTwelve), /non-decision evidence ID/);
assert.throws(() => validateResearchDecisions({ ...survivingDecisions, coreProblem: { ...survivingDecisions.coreProblem, supportingIds: ids.slice(0, 7), contraryIds: ids.slice(7), thresholdAccounting: '7/12 synthetic sessions meet the core threshold' } }, validTwelve), /SURVIVE requires at least 8\/12/);
assert.throws(() => validateResearchDecisions({ ...survivingDecisions, monetization: { ...survivingDecisions.monetization, supportingIds: ids.slice(0, 3), contraryIds: ids.slice(3), thresholdAccounting: '3/12 synthetic sessions meet monetization' } }, validTwelve), /SURVIVE requires at least 4\/12/);
const mismatchedDecisions: ResearchDecisions = {
  ...survivingDecisions,
  coreProblem: { ...survivingDecisions.coreProblem, supportingIds: ids.slice(0, 2), contraryIds: ids.slice(2) },
};
assert.throws(() => validateResearchDecisions(mismatchedDecisions, validTwelve), /threshold count must equal supporting evidence IDs/, '8/12 with only two supporting IDs must fail reconciliation');
assert.throws(() => validateResearchDecisions({ ...survivingDecisions, coreProblem: { ...survivingDecisions.coreProblem, contraryIds: ids.slice(9) } }, validTwelve), /classify every decision session exactly once/, 'missing classified ID must fail');
assert.throws(() => validateResearchDecisions({ ...survivingDecisions, coreProblem: { ...survivingDecisions.coreProblem, contraryIds: [ids[0], ...ids.slice(8)] } }, validTwelve), /must be disjoint/, 'supporting/contrary duplicate must fail');
assert.throws(() => validateSession(validTwelve[0], syntheticNotes.replace('\n\nManual anonymization review: passed', '')), /Manual anonymization review: passed/, 'missing manual-review attestation must fail');
assert.throws(() => validateSession(validTwelve[0], syntheticNotes.replace('Manual anonymization review: passed', 'Manual anonymization review: failed')), /Manual anonymization review: passed/, 'failed manual-review attestation must fail');
assert.throws(() => validateSession(validTwelve[0], syntheticNotes.replace('Synthetic validator fixture only.', 'Call (415)555-0123 for details.')), /linked note contains phone/, 'compact parenthesized phone must fail privacy scan');
assert.throws(() => assertNoContradictoryClaims(`${results}\nMP-2.10 complete; review not done.`, { readinessKit: 'COMPLETE', deferredStudy: 'BLOCKED', phase2Exit: 'BLOCKED' }), /contradictory deferred-study completion claim/);
assert.doesNotThrow(() => assertNoContradictoryClaims('MP-2.10 is not complete.\nPhase 2 exit gate has not passed.', { readinessKit: 'COMPLETE', deferredStudy: 'BLOCKED', phase2Exit: 'BLOCKED' }));

const crlfPlan = plan.replace(/\r?\n/g, '\r\n');
const crlfResults = results.replace(/\r?\n/g, '\r\n');
assert.deepEqual(parseQuotas(crlfPlan), requiredQuotas, 'quota parsing must be LF/CRLF safe');
assert.equal(parseSessions(crlfResults).length, sessions.length, 'ledger parsing must be LF/CRLF safe');

const decisionCount = sessions.filter((session) => session.set === 'Decision').length;
const passCount = sessions.filter((session) => session.set === 'Decision' && session.unaidedComprehension.startsWith('Pass:')).length;
console.log(`Primary-research governance passed; MP-1.6 kit ${currentStates.readinessKit}; MP-2.10 study ${currentStates.deferredStudy}; Phase 2 exit ${currentStates.phase2Exit}; decision set ${decisionCount}/${decisionSetSize}; unaided comprehension ${passCount}/${decisionSetSize} (threshold ${requiredComprehensionPasses}).`);
