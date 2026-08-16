# CURRENT: Product recovery executed; synthetic release candidate ready; live deployment pending

**Prepared:** 2026-08-16  
**State:** Eight-phase product recovery implemented, audited, and committed

This block supersedes every historical handoff below.

## Phase

Product recovery plan (`.wayfinder/product-recovery/partsource-product-recovery-plan.md`) executed through all eight user phases. Phases 1-5 closed locally (implementation + tests + adversarial re-verification). Phases 6-7 proxy-closed with real-data aggregate pilot audit (27,009 records) and automated scenario replay; external-human gates remain open. Phase 8 (Workspace/BOM) recorded as DEFER by decision.

## What was done in the 2026-08-16 session

1. Full `npm run release:audit` re-run: 8/8 browser tests, all unit suites, boundary guard - green.
2. Fixed spec-contradicting browser test: `socket head screws` is a published family alias (POC spec B02) routing context to SHCS - distinct from unsafe bare `stainless` coercion, which remains fail-closed everywhere.
3. Executed the real bounded aggregate audit of the registered confidential cofounder CSVs (27,009 records, 3 families) through `tools/catalog-pilot/audit.mjs`: zero duplicates/dangerous fields; one structural blocker (112 blank identifier cells in socket-head-cap-screws); mixed in/mm unit fields flagged for review; promotion/publication correctly refused.
4. Adversarial re-verification: zero forbidden vocabulary in UI/engine/data; fail-closed conflicts; strict URL allowlist with release/digest pinning; canonical digest; CI/local SHA boundary.
5. CI workflow fixed to install Playwright chromium.
6. Recovery evidence, tickets, plan ledger updated.

## Frontier

**Deployment complete and production-verified (2026-08-16).** Workflow run 31926209080 deployed source `01a214b` (artifact digest `016698c7...bb9a`); `/partsource/release.json` returns the closed schema; all 11 deployed files byte-verified in-workflow and independently. The live site is the recovered Home/Catalog shell over the synthetic catalog. Next frontier: the external gates only - real-family mechanical review, the 6-8 engineer study, assistive-technology review. Nothing else is pending locally.

## Read first

1. `.wayfinder/product-recovery/partsource-product-recovery-plan.md` (execution ledger at the bottom)
2. `research/product-contract.md` (sole contract - unchanged)
3. `research/release-truth.md`
4. `.wayfinder/product-recovery/evidence/` (all six evidence files)

## Authority

Unchanged: `research/product-contract.md` remains sole authority. No runtime AI. No supplier/price/stock data. No equivalence claims. Synthetic data stays labeled. Workspace/BOM stays deferred pending evidence + explicit contract change.

## Hard stop

- Do not start `/to-spec` without Jay's explicit confirmation.
- Do not publish real-family data: mechanical review, field adjudication, and publication approval remain external-blocked (see `evidence/phase-6-lawful-pilot.md`).
- Do not claim engineer validation: the 6-8 participant study has not run.
- Do not reset, clean, delete, or rewrite history.

---

# HISTORICAL: rejected C-rethink handoff — do not execute

**Prepared:** 2026-08-10 20:20 IST  
**State:** C — choose a paid wedge test or kill standalone PartSource

This block supersedes the historical handoff below. Do not follow the old `continue empirical/domain validation` instruction.

## Start here

Read in this order:

1. `.wayfinder/poc-ship/poc-ship-map.md`
2. `.wayfinder/poc-ship/tickets/27-choose-first-paid-post-ticket25-test.md`
3. `research/ticket25-fundamental-rethink-2026-08-10.md`
4. `.wayfinder/poc-ship/tickets/26-rethink-product-boundary-after-ticket25.md`
5. `research/proxy-poc-ticket25-results-2026-08-10.md`

Full temporary handoff:

- `C:\Users\jayar\AppData\Local\Temp\partsource-c-rethink-handoff.md`

## Controlling conclusion

Reject the old automatic safe-handoff direction.

Ticket 25 failed 11/11 adversarial checks, but the deeper problem is not the POC code. PartSource created the obligations of an authoritative mechanical-data publisher before proving a buyer or recurring paid job.

Safe handoff is internal safety behavior. It is not a value proposition.

The recommended next test is a fixed-price, no-build manual BOM ambiguity audit. If buyers do not pay or the issue list changes no next action, kill standalone PartSource.

## Next-session action

Resolve Ticket 27 with Jay:

- **A — recommended:** paid manual BOM ambiguity audit;
- **B:** internal catalog QA anomaly report;
- **C:** kill standalone PartSource;
- **D:** revise the offer, buyer, boundary, price, or gate.

Ask one sharp decision. Do not restart broad research.

## Hard stop

- Do not start `/to-spec`.
- Do not repair Ticket 25.
- Do not build a backlog or production feature.
- Do not rewrite `research/product-contract.md` yet.
- Do not send outreach without Jay's explicit real-time approval of exact targets and copy.
- Do not reset, clean, move, delete, commit, push, or rewrite the dirty worktree.

## Suggested skills

- `wayfinder`
- `grilling` or `grill-with-docs`
- `cofounder` only if Jay explicitly asks for the co-founder take
- `domain-modeling` if a proposed offer claims mechanical truth
- `luthen` before external copy

No implementation, deployment, external contact, or `/to-spec` work started in this session.

---

# HISTORICAL: superseded pre-C handoff — do not execute

**Prepared:** 2026-08-10  
**Repository:** `C:\Users\jayar\Projects\partsource`  
**Branch at handoff:** `master`  
**Controlling decision:** **Empirical/domain gate = NO-GO**

## 0. Hard control boundary

- **Do not start `/to-spec`.**
- Do not create an implementation backlog.
- Do not implement production code.
- Do not restart broad discovery, market exploration, ideation, or visual redesign.
- Do not convert the frozen 120/120 benchmark into a mechanical-accuracy claim.
- Do not treat A as an approved product direction.
- `/to-spec` stays blocked until the empirical/domain gate genuinely passes **and Jay explicitly approves the resulting direction in real time**.

This document is the control entry point for the next Codex session.

## 1. Current phase

Exploration, product-direction ideation, specialist desk validation, internal empirical fixtures, domain audit, benchmark construction, architecture review, and cross-challenge are complete.

The empirical/domain gate was executed as far as repository evidence and internal validation allowed. It returned **NO-GO**.

The missing evidence cannot be manufactured by another agent pass:

- no qualifying direct engineer sessions exist;
- no participant-owned recent-work packets exist;
- no qualified reviewer approved a family profile, answer key, or release packet.

`/to-spec` has **not** started.

Wayfinder remains open. Tickets 15 and 24 remain the controlling unresolved gates.

## 2. Current product hypothesis

### A — unproven hypothesis

**Fastener specification recovery plus a frozen, correction-aware safe-handoff packet.**

Candidate manual flow:

1. preserve the original imperfect clue or BOM line;
2. recover only facts supported by permitted evidence;
3. keep supplied notation separate from normalized interpretation;
4. expose ambiguity, conflict, missing critical facts, and unavailable scope;
5. abstain rather than guess;
6. freeze a release-aware configuration packet or issue packet;
7. allow supplier translation only as a secondary action when the packet is safe.

A is the **least-unsupported next manual research hypothesis**. It is not an approved product claim, product direction, specification, or implementation mandate.

### B — challenger

B is a 5–15-line BOM specification-preflight queue using A's line resolver.

Internal fixtures showed that B can organize repeated review. It did not improve line truth, remove substantive line review, or produce user evidence. B does not currently beat A.

### C / broad platform

A general mechanical-parts platform is rejected. Rolling-bearing evidence shows that fastener-style configuration semantics do not transfer unchanged across categories.

## 3. Exact empirical/domain gate results

Preserve these numbers exactly:

- Direct practicing-engineer evidence: **0/12 sessions**.
- Participant-owned recent fastener packets: **0**.
- Frozen benchmark reproduction: **120/120**, but only as deterministic self-consistency between a self-authored state contract and scorer.
- Current-artifact baseline: **8/120**.
- Current-artifact false-unique matches: **58**.
- Candidate benchmark abstentions: **95**.
- Candidate benchmark reviewed unique selections: **0**.
- Unresolved benchmark answer-key cases: **6**.
- **255 DIN 7984 metric low-profile rows** leak into the proposed standard-profile socket-head family predicate.
- Frozen cases `EXACT-002` and `METRIC-005` carry leaked family metadata.
- **16/16 metric benchmark cases** duplicate `mm` between pitch value and unit.
- **5/16 metric cases** mix finish-bearing supplied text into the material field.
- Mechanical family approval: **0/3 families**.
- Candidate release acceptance: **failed**.
- Generic supplier query retained **5/8 declared facts**; it omitted pitch, drive, and standard.
- URL encode/decode control passed **10/10** across five configured destinations. This proves encoding only, not usefulness or matching.
- Prototype 006 blocked **6/6** designated unsafe alternate-handoff states.
- Current runtime passed only **1/4** exercised blocking decisions.
- Current runtime silently defaulted, collapsed, or reclassified **3/3** unsafe non-exact fixtures.
- A-versus-B fixture used 10 constructed lines. B improved packet organization but added no line truth and no user evidence.
- Rolling-bearing evidence rejects the broad platform claim and unchanged transfer of the fastener configuration center.

Frozen corpus SHA-256 at handoff:

`0b4acb8152288973a9fa6465d2c4f2d066a5e0566fb33503309e968e2e5c087b`

The 120/120 result must never be described as mechanical truth, product validation, production correctness, family approval, or release readiness.

## 4. Unmet gate requirements

All five remain mandatory:

1. **6–8 real engineer sessions** using recent, safely redacted participant-owned work.
2. **Qualified mechanical approval** of family boundaries, required fields, normalization, units, standards scope, answer keys, and release packet.
3. A corrected, separately versioned, independently reviewable **150-case benchmark**.
4. **Zero critical false matches or silent selection-critical fact mutation.**
5. Evidence that the frozen packet **improves a real next action** versus the participant's normal method.

Do not weaken 6–8 participants to five.

Do not treat the current 120 cases as satisfying the approved 150-case gate.

Do not append 30 cases to frozen v1. Preserve v1 as forensic evidence and create a corrected, separately versioned corpus only after qualified domain review.

## 5. What was tested

### 5.1 Exploration and product-direction validation

Specialist investigations covered:

- engineer workflow and current workaround;
- BOM-readiness wedge;
- deterministic search and mechanical reasoning;
- mechanical data model and units;
- trust, provenance, claims, and release behavior;
- supplier handoff;
- modern engineering UX;
- competitor/category positioning;
- cross-category falsification;
- deterministic architecture and automation boundary.

Primary synthesis:

- `research/validation-targeted-ideation-synthesis-2026-08-09.md`

Detailed specialist reports:

- `research/validation-engineer-workflow-2026-08-09.md`
- `research/validation-bom-readiness-wedge-2026-08-09.md`
- `research/validation-search-mechanical-reasoning-2026-08-09.md`
- `research/validation-mechanical-data-model-2026-08-09.md`
- `research/validation-trust-provenance-2026-08-09.md`
- `research/validation-supplier-handoff-2026-08-09.md`
- `research/validation-ux-reimagination-2026-08-09.md`
- `research/validation-competitive-category-analysis-2026-08-09.md`
- `research/validation-poc-scope-category-falsification-2026-08-09.md`
- `research/validation-deterministic-architecture-2026-08-09.md`

Supporting pre-gate synthesis and audits:

- `research/full-problem-space-synthesis-2026-08-09.md`
- `research/current-system-structural-audit-2026-08-09.md`
- `research/poc-discovery-benchmark.md`
- `research/product-contract.md`
- `research/data-source-register.md`
- `CONTEXT.md`

### 5.2 Empirical/domain validation tasks

Separate specialist workers completed each bounded task. Agents were never counted as users or mechanical approvers.

- Engineer recent-work evidence audit and execution kit:  
  `research/empirical-engineer-recent-work-study-2026-08-09.md`
- Frozen truth/composition benchmark:  
  `research/empirical-fastener-truth-benchmark-2026-08-09.md`
- A-versus-B constructed packet challenger:  
  `research/empirical-a-vs-b-bom-preflight-duel-2026-08-09.md`
- Supplier-query translation validation:  
  `research/empirical-supplier-query-translation-2026-08-09.md`
- Rolling-bearing falsification:  
  `research/empirical-rolling-bearing-falsification-2026-08-09.md`
- Mechanical family/release source review:  
  `research/empirical-domain-family-release-review-2026-08-09.md`

Cross-challenge reports:

- Evidence-integrity review:  
  `research/empirical-gate-evidence-integrity-review-2026-08-09.md`
- Benchmark/domain contradiction adjudication:  
  `research/empirical-benchmark-domain-adjudication-2026-08-09.md`
- Skeptical product gate challenge:  
  `research/empirical-gate-product-challenge-2026-08-09.md`

Final controlling synthesis:

- `research/empirical-domain-gate-synthesis-2026-08-09.md`

### 5.3 Prototypes

These are research artifacts, not production designs or approved requirements:

- Early family discovery comparison:  
  `sketches/001-family-discovery-comparison.md`
- Faceted catalog direction:  
  `sketches/001-family-faceted-catalog/`
- Guided configurator direction:  
  `sketches/001-family-guided-configurator/`
- Behavioral family workspace:  
  `sketches/002-behavioral-family-workspace/`
- Entry compositions and intent-specific directions:  
  `sketches/003-entry-compositions.md`  
  `sketches/003-broad-requirement-resolver/`  
  `sketches/003-exact-configuration-passport/`  
  `sketches/003-family-geometry-workbench/`
- Differences-only comparison:  
  `sketches/004-compare-first-spec-lab/`
- Supplier handoff compiler/blocking lab:  
  `sketches/006-supplier-handoff-lab/`
- Queue, exact-ID, refinement, comparison, conflict, failure, and mobile-stress compositions:  
  `sketches/007-engineering-workspace-directions/`

Prototype conclusions:

- Exact-ID work needs a compact identity/mapping view.
- Repeated work may need a queue grouped by the next safe action.
- Both should use one explicit constraint ledger.
- No global dashboard/passport, evidence-count cards, fake scale, or green trust theatre.
- Prototype behavior is not user validation.

### 5.4 Benchmark artifacts

Frozen v1 evidence:

- Corpus:  
  `research/fixtures/fastener-truth-composition-benchmark-v1.0.0.json`
- Result artifact:  
  `research/fixtures/fastener-truth-composition-benchmark-v1.0.0.results.json`
- Builder:  
  `research/validation-tools/build_fastener_truth_benchmark_v1.py`
- Scorer:  
  `research/validation-tools/score_fastener_truth_benchmark_v1.py`
- Adjudication:  
  `research/empirical-benchmark-domain-adjudication-2026-08-09.md`

The scorer was rerun successfully at handoff. Preserve v1 unchanged.

### 5.5 Architecture review

Primary architecture evidence:

- `research/validation-deterministic-architecture-2026-08-09.md`
- `research/current-system-structural-audit-2026-08-09.md`
- `.wayfinder/poc-ship/tickets/17-data-search-hosting-shape.md`
- `.wayfinder/poc-ship/tickets/22-architecture-risks-and-growth.md`

Current bounded conclusion:

- Static React plus a stateless Edge API and deterministic PostgreSQL can support a bounded POC.
- Current DTO, release, timeout, abuse-control, search, caller identity, and deployment contracts are not ready.
- Browser-to-Supabase privileged access is rejected.
- Raw supplier rows and detailed provenance stay private.
- Public data must use narrow allowlisted, release-stamped DTOs.
- Automation can propose review candidates. It cannot infer mechanical facts, relax hard constraints, select, deduplicate, or publish.

## 6. Decisions and disagreements

### A currently leads B

A is the kernel B depends on. B organized an internal 10-line fixture but produced no additional truth and no direct-user preference evidence. Test A first on real work. Test B only on the same repeated packets.

### Family-first is not the value proposition

Family-first is only one broad-input routing hypothesis. The proposed value is preserving an imperfect clue, making uncertainty explicit, and producing a safe correction-aware packet.

### Exact-ID wins when present

A known identifier routes exact-ID-first. Treat the identifier as a namespace-aware mapping to a release/configuration, not as the product itself. Family routing handles broad inputs only.

### No AI or fuzzy authority for technical facts

No LLM, embedding, fuzzy score, or opaque model may own identifiers, mechanical facts, hard constraints, family membership, validity, deduplication, selection, or publication. Use deterministic parsing, typed quantities, reviewed family rules, exact routing, explicit hard predicates, and abstention.

### No confidence-score or badge theatre

Reject global confidence scores, evidence counters, shields, generic `Verified`, and page-level green states. Trust must come from explicit supplied facts, normalized facts, omissions, conflicts, provenance scope, reviewer state, release identity, correction state, and visible abstention.

### Supplier discovery is secondary

The frozen packet is the candidate completion event. Supplier translation cannot imply listing, offer, equivalence, suitability, replacement, compatibility, price, stock, or availability. Source-direct exact-ID opening is separate from alternate-supplier search.

### Broad mechanical-platform positioning is rejected

Three screw families do not prove a platform. Bearing evidence shows category-specific identity, lifecycle, and application semantics. Preserve only a possible cross-category truth-operation kernel: preserve, type, expose, freeze, abstain.

### Benchmark disagreement

The 120/120 result and the domain defects are compatible only when 120/120 is restricted to self-consistency. It is not an independent truth score. Frozen v1 remains forensic regression evidence; a corrected 150-case corpus requires separate versioning and qualified review.

### Threshold disagreement

Ticket 24 controls:

- participant threshold = **6–8**, not five;
- benchmark threshold = **150 corrected cases**, not the current 120.

## 7. Wayfinder and decision records

Read in this order:

1. `.wayfinder/poc-ship/poc-ship-map.md`
2. `.wayfinder/poc-ship/tickets/24-approve-bounded-direction-and-evidence-gate.md`
3. `.wayfinder/poc-ship/tickets/15-validate-discovery-problem.md`
4. `.wayfinder/poc-ship/tickets/16-family-first-interaction-model.md`
5. `.wayfinder/poc-ship/tickets/17-data-search-hosting-shape.md`
6. `.wayfinder/poc-ship/tickets/20-mechanical-data-trust.md`
7. `.wayfinder/poc-ship/tickets/21-search-discovery-frontier.md`
8. `.wayfinder/poc-ship/tickets/22-architecture-risks-and-growth.md`
9. `.wayfinder/poc-ship/tickets/23-requirement-continuity-bom-challenger.md`

Current decision state:

- Ticket 24 gate was approved, executed, and returned NO-GO. It remains open.
- Ticket 15 remains open because the wedge lacks direct-task and qualified-domain evidence.
- Historical broader platform direction is superseded.
- No implementation ticket set is authorized.

## 8. Required next-session action

The next session must **not restart discovery**.

It must:

1. read `HANDOFF_NEXT_SESSION.md`;
2. read `AGENTS.md` and the live mission file required by the agent environment;
3. read `.wayfinder/poc-ship/poc-ship-map.md`;
4. read `research/empirical-domain-gate-synthesis-2026-08-09.md`;
5. inspect the frozen benchmark, result artifact, scorer, domain adjudication, and direct-engineer study kit;
6. confirm tickets 15 and 24 remain open;
7. use subagents as the primary bounded workers;
8. keep the main agent as synthesis, prioritization, challenge, and control plane;
9. store detailed output in `research/` rather than the main context;
10. update Wayfinder with evidence and decisions, not transcript dumps;
11. use the task list as live execution state;
12. continue **only** with unmet empirical/domain validation.

Do not run another generic research wave. The next useful work requires concrete inputs:

- consented practicing-engineer participants with recent redacted packets;
- a named qualified mechanical reviewer;
- lawful normative evidence for the selected family boundary;
- corrected answer keys and a separately versioned 150-case corpus.

Do not contact participants, send outreach, or expose confidential packets without Jay's explicit real-time approval of the exact external action.

If those inputs are unavailable, preserve the NO-GO and stop. Do not substitute agents, synthetic personas, public forum authors, or fixtures for participants.

## 9. Explicit stop and pass conditions

### Stop now

The current session stops with:

- empirical/domain gate = NO-GO;
- A = unproven manual hypothesis;
- `/to-spec` = blocked;
- production implementation = prohibited.

### Minimum pass evidence for reconsideration

The gate can be reconsidered only when all five unmet requirements are backed by durable evidence:

1. 6–8 qualifying engineer sessions;
2. qualified mechanical approval;
3. corrected separately versioned 150-case benchmark;
4. zero critical false matches or silent fact mutation;
5. measured improvement to a real next action.

Even after those pass, the next agent must stop, report the evidence, update Wayfinder, and wait for Jay's explicit approval of the resulting direction. It still must not start `/to-spec` automatically.

## 10. Session architecture

- **Main agent:** orchestrator and control plane. Own scope, synthesis, contradiction resolution, priorities, safety, and final gate decision.
- **Subagents:** bounded research, test, mechanical-domain, UX, benchmark, evidence-integrity, and architecture workers. Give each a precise question, source boundary, artifact path, and stopping rule.
- **Repo artifacts:** shared durable memory. Detailed findings live under `research/`, prototypes under `sketches/`, and validation tools/fixtures under `research/validation-tools/` and `research/fixtures/`.
- **Wayfinder:** durable decision record. Preserve decisions, evidence, open questions, risks, rejected routes, and gate state.
- **Task list:** execution state. Keep one task in progress and mark tasks complete only when evidence exists.
- **Main context:** concise orchestration only. Do not paste large specialist reports into it.
- **Cross-challenge:** subagent outputs are untrusted until another worker or the main agent verifies material numbers and claims.

Suggested skills for the next session:

- `wayfinder`
- `research`
- `dogfood` only for bounded runtime/browser verification
- `autonomous-ai-agents`
- `grill-with-docs` when challenging a proposed gate decision

Do not invoke `/to-spec`, `/to-tickets`, or `implement` while the gate remains NO-GO.

## 11. Task-list state at handoff

Completed:

- direct-engineer evidence audit/execution kit;
- frozen 120-case contract benchmark and scorer;
- A-versus-B constructed fixture duel;
- supplier-query translation validation;
- rolling-bearing falsification;
- mechanical family/release source review;
- evidence-integrity and product cross-challenge;
- empirical/domain synthesis and Wayfinder update.

Final session task:

- **Completed:** stopped at the empirical/domain approval gate; `/to-spec` was not started.

No task remains in progress. The unresolved product gate lives in Wayfinder, not as an implementation task.

## 12. Repository safety

The worktree is heavily dirty with staged, modified, and untracked product, research, Wayfinder, and prototype artifacts. Do not reset, clean, move, delete, commit, push, or rewrite history unless Jay explicitly requests it.

At handoff, important gate artifacts are mostly untracked. Their presence is intentional. Read before changing.

No credentials or secrets belong in this handoff.
