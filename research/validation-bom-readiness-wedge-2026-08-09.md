# Validation challenger: BOM readiness versus one-at-a-time recovery

**Date:** 2026-08-09  
**Phase:** Validation + Targeted Ideation Gate  
**Status:** Desk and manual challenge evidence; not user validation, a product specification, or a build decision.  
**Decision question:** Is BOM readiness a stronger bounded PartSource POC than one-at-a-time fastener specification recovery?

## Provisional verdict

**BOM readiness is the stronger repeat-value and business hypothesis, but it is not the stronger bounded POC today. Choose A — one-at-a-time specification recovery and safe handoff — as the initial build/proof boundary. Test B as a manual “BOM specification preflight” challenger using real redacted 5–15-line inputs.**

B should replace A as the lead only if direct engineer testing shows clear batch value with zero critical false unique matches. A is not the whole product: its deterministic recovery engine is a prerequisite for B.

Do not market B as `procurement-ready`, `production-ready`, or `BOM approval`. The honest bounded name is **fastener BOM specification preflight**: preserve lines, classify what PartSource can and cannot interpret, surface conflicts and missing engineering decisions, and export a review packet.

## Evidence boundary

- **Evidence:** The repository records 0/12 decision-set user sessions. Frequency, urgency, repeat use, saved effort, failure incidence, and willingness to pay are unvalidated (`research/user-research-results.md`).
- **Evidence:** The approved local packet is identifier-rich but not a reviewed public configuration release. It has 27,009 source rows and 26,953 populated unique known references, while pitch, finish, standards semantics, family classification, and important omitted fields remain problematic (`research/full-problem-space-synthesis-2026-08-09.md`; `research/mechanical-data-trust-opportunities-2026-08-09.md`).
- **Evidence:** Public/open BOM and CAD examples and Autodesk user reports establish that supplier identifiers can escape into durable engineering artifacts with weak descriptions. They establish existence, not prevalence (`research/mechanical-discovery-problem-evidence-2026-08-09.md`).
- **Evidence:** NISTIR 8035 documents human interpretation/transcription and disagreement over terminology and intended field meaning in industrial product-data-sheet exchange. It is authoritative adjacent evidence, not fastener-BOM incidence evidence.
- **Evidence:** NASA fastener material establishes that selection and downstream control include dimensions, material, finish, thread details, procurement, inspection, testing, traceability, and storage. This proves consequence and scope separation, not PartSource demand or savings.
- **Evidence:** External pages were treated as untrusted corroboration. Search results verified the NIST publication record, the NASA-STD-8739.14 scope statement, and SOLIDWORKS support for part numbers/descriptions/custom properties in BOM workflows. No external record was imported as PartSource product truth.
- **Risk:** The only repository-safe exact example used below is `91290A115 → M3 × 0.5 × 10 mm`, as corrected against the permitted source in the synthesis. Every other challenge line is explicitly illustrative and proves only state behavior.

## A and B are different value layers

### A — one-at-a-time specification recovery

**Job:** Given one identifier or rough fastener line, preserve the input, recover an exact released configuration when evidence supports it, expose gaps/conflicts, and freeze a safe handoff.

- **Evidence:** Exact identifiers are the strongest current entry path and best fit to the approved packet.
- **Strong hypothesis:** A crisp opaque-ID-to-readable-configuration transition is a credible demo and acquisition hook.
- **Risk:** Opening the originating supplier may be faster; rights/coverage are fragile; one lookup is episodic; a supplier query may add little.
- **Rejected:** Calling the recovered configuration suitable, equivalent, approved, stocked, or available.

### B — fastener BOM specification preflight

**Job:** Before an engineer hands a small BOM to sourcing, preserve each line and show which lines have an exact supported configuration, partial interpretation, conflict, unsupported category, unknown identifier, or processing failure.

- **Strong hypothesis:** Batch issue discovery and one handoff artifact create more visible and repeated value than isolated lookup.
- **Risk:** Dirty descriptions, variable CSVs, unsafe matching, narrow family coverage, and absent required-field profiles can turn B into a staged demo or false readiness claim.
- **Fundamental requirement:** B must use A’s exact lookup, deterministic parsing, conflict detection, family rules, release identity, and fail-closed behavior. Batch UI cannot compensate for an unsafe line resolver.
- **Rejected:** Treating import success, one remaining row, dataset uniqueness, or a green status as BOM readiness.

### Business value is a third layer

- **Strong hypothesis:** Batch preflight can reduce repeated engineering/procurement clarification and avoid carrying opaque supplier-only references into reuse.
- **Open question:** Whether target small teams do this often enough, feel enough urgency, or will pay for it.
- **Risk:** The economically decisive production/procurement fields — approved vendor, manufacturer/listing identity, price, MOQ, lead time, certification, commercial terms, and traceability — are outside the POC.
- **Rejected:** Translating plausible downstream failure modes into claimed dollars, time saved, scrap avoided, or ROI.

## Real workflow shape and bounded handoffs

The practical cleanup/preflight workflow is not “upload CSV, receive a clean BOM.” It is a review loop:

1. **CAD, prior project, supplier page, spreadsheet, or colleague → raw BOM.** Lines may contain an internal number, supplier number, generic phrase, mixed units, quantity, notes, or almost no description.
2. **BOM owner → import/preflight.** Preserve the original file, headers, row number, raw cells, namespace clues, units, and quantity before normalization.
3. **Preflight engine → issue queue.** Run schema checks, conservative exact-ID routing, deterministic parsing of explicit facts, conflict detection, coverage checks, and release lookup. Never create missing mechanical truth.
4. **Issue queue → mechanical engineer.** Ask only questions justified by a domain-reviewed family profile. Group similar issues, but retain line identity and do not bulk-apply a mechanical choice silently.
5. **Engineer → configuration handoff.** A line may become a frozen, release-aware configuration requirement only after required facts are explicit/supported and no critical conflict remains.
6. **Engineering → procurement.** Send original clue, resolved configuration or unresolved requirement, quantity, named gaps, and review state. Procurement still supplies vendor policy and commercial requirements.
7. **Procurement → supplier / receiving / quality.** Listing identity, offer, approval, certificate, lot, inspection, and traceability are separate workflows outside this POC.

### Recurring pain supported by available evidence

- **Evidence:** Supplier/CAD identifiers can persist without useful human-readable descriptions.
- **Evidence:** Product-data exchange can require transcription and interpretation across terminology and field meanings.
- **Evidence:** Current PartSource import projection drops supplied distinctions such as thread fit/direction, threading extent, head dimensions, drive size, and minimum thread length.
- **Evidence:** Current repeated technical signatures cannot safely be auto-merged; omitted fields differ in many groups.
- **Strong hypothesis:** Repeated missing descriptions, mixed terminology, and supplier-locked identifiers cause a useful preflight issue queue.
- **Open question:** Incidence in the target engineer’s recent work and whether clarification is painful enough to change tools.

### Where the bounded POC should stop

- **Rejected:** EBOM-to-MBOM transformation, make/buy planning, routing, operations, work instructions, MRP, or quantity rollups across configurations.
- **Rejected:** PLM/ECO release, organizational approvals, signatures, workflow ownership, revision governance, or audit-trail claims.
- **Rejected:** ERP item-master creation, approved-vendor lists, supplier onboarding, RFQ, purchase orders, punchout, stock, price, lead time, or cost savings.
- **Rejected:** Equivalence, replacement, allowed substitution, application suitability, or automatic preferred-part reuse.
- **Rejected:** Quality acceptance, compliance determination, certificate validation, lot traceability, receiving inspection, or nonconformance disposition.
- **Risk:** Adding any of these to make the demo look commercially complete is PLM/ERP theatre: it adds forms and status chrome without the identities, evidence, organization, integrations, or authority needed to perform the job.

## Line-level state contract

Use two independent axes. Do not compress them into one `verified` badge.

### Interpretation state

| State | Exact meaning | Safe action |
|---|---|---|
| `exact` | One active, reviewed namespace/value mapping resolves to one released configuration. | Show the mapping and configuration; do not imply suitability or supplier identity. |
| `partial` | Some explicit facts were preserved, but family, configuration, or required facts remain unresolved. | Show preserved facts and justified next questions; no auto-selection. |
| `conflict` | Explicit line facts disagree internally or with an exact mapping on a selection-critical fact. | Block selection and show both claims; never pick a winner silently. |
| `unsupported` | The line is outside the reviewed family/category/input boundary. | Preserve and return it unchanged with the boundary explanation. |
| `unknown` | The input is well-formed enough to inspect but no safe interpretation or active mapping exists. | Preserve it; do not fuzzy-match an identifier or nearby configuration. |
| `failure` | File parsing, service, release, or deterministic processor failed. | Fail closed, remove stale answers, preserve raw input, and permit retry/export. |

### Handoff disposition

| Disposition | Exact meaning |
|---|---|
| `configuration-handoff-supported` | One released configuration remains; every field required by the approved family profile is explicit or supported; no critical conflict exists; release/mapping identity can be frozen. This still does not mean procurement-ready or application-approved. |
| `engineering-input-required` | A person must resolve ambiguity, conflict, or a selection-critical gap. |
| `outside-release` | PartSource cannot evaluate the category/family or no released configuration exists. |
| `processing-blocked` | The system did not complete a trustworthy evaluation. |

- **Fundamental requirement:** Interpretation and handoff disposition stay separate. An `exact` identifier can still be blocked if the mapped configuration/release is incomplete, conflicted, withdrawn, or lacks an approved required-field profile.
- **Fundamental requirement:** Required fields are family- and scope-specific, approved by mechanical domain review. Dataset uniqueness must never define completeness.
- **Opportunity / gold idea:** Group the issue queue by the next safe engineering decision — for example, “family unresolved” or “conflicting pitch” — while keeping every raw line independently reversible.
- **Nice-to-have:** A compact diff between original and proposed export, with supplied, deterministic normalization, user decision, and unresolved values visibly distinct.

## Minimum safe output

A bounded B output must include:

1. Input filename/digest or local import identifier, import time, parser version, catalog release, and clear local-only status.
2. Original header map and every original row/cell, unchanged and exportable.
3. Stable import row ID, original row number, quantity, and notes.
4. Interpretation state and separate handoff disposition for every line.
5. Exact namespace/value when used; never a guessed namespace.
6. Preserved explicit facts with original notation, plus deterministic normalized values and rule version where applicable.
7. Named conflicts, unresolved terms, coverage limits, and missingness reason (`not supplied`, `not yet normalized`, `not in release`, or `unknown`).
8. Justified engineering questions tied to an approved family profile; no generic “complete your BOM” score.
9. Frozen public configuration/revision/mapping identity only for supported handoffs.
10. An issue-list export and a clean configuration-handoff export; unresolved and failed lines must remain present rather than disappearing.
11. A plain boundary: no equivalence, suitability, supplier listing, approval, price, stock, certification, or traceability is established.

- **Fundamental requirement:** The minimum output is useful even when no line resolves: an honest, reversible issue list is still a valid preflight artifact.
- **Rejected:** A BOM-level readiness percentage. It hides severity, coverage, and system failure, and has no defensible denominator before approved family profiles exist.

## What can be deterministic

### Safe now, given bounded syntax and release data

- **Evidence:** CSV parsing, header normalization, row numbering, positive-integer quantity checks, non-negative user cost checks, backup validation, and local storage validation already exist.
- **Fundamental requirement:** Preserve raw rows before transformations and distinguish malformed input from unsupported content.
- **Fundamental requirement:** Conservative exact identifier lookup by explicit namespace; collision returns ambiguity, never `LIMIT 1` behavior.
- **Fundamental requirement:** Explicit token preservation for dimensions, units, thread designations, identifiers, standards, and negations; unsupported tokens remain visible.
- **Fundamental requirement:** Internal contradiction checks such as two incompatible explicit diameters or pitches on one line.
- **Fundamental requirement:** Active-release lookup, withdrawal handling, deterministic state calculation, and export round-trip.
- **Fundamental requirement:** Service failure invalidates current results and cannot reuse a prior line’s answer.

### Deterministic only after domain/release work

- **Open question:** Family inclusion/exclusion rules and identity-critical fields.
- **Open question:** Which fields are required for configuration handoff within each family.
- **Strong hypothesis:** Versioned parsers can safely normalize reviewed forms of metric thread, imperial TPI, length, material/finish vocabulary, and standard designations while retaining the supplied text.
- **Risk:** Material/finish decomposition, standards relationships, unit conversion precision, and duplicate classification become false truth if rules are not reversible and reviewed.
- **Rejected:** LLM or heuristic output promoted to a mechanical fact, unique configuration, or readiness decision.

### Human decisions that must remain human in the POC

- Choose among ambiguous families or configurations.
- Resolve conflicting source claims.
- Decide application suitability and allowed flexibility.
- Approve equivalence, substitutes, manufacturer parts, listings, or suppliers.
- Define organizational preferred parts, approvals, compliance, and quality requirements.
- Decide whether a missing field is acceptable in the actual application or handoff.

## Current implementation fit

- **Evidence:** `validateBomCsvRows` accepts rows with an effective part number and valid quantity/cost, but description-only rough lines are rejected as “Missing part number.” This blocks the most interesting rough-line B input.
- **Evidence:** The UI calls `validateBomCsvRows(rows)` without current reviewed records, so UI CSV imports become `unverified-imported`; the exact-current-record restoration path is not used there.
- **Evidence:** Import normalizes many header aliases and reports accepted/rejected rows, but its job is syntactic storage, not mechanical line interpretation.
- **Evidence:** Missing descriptions become `Imported Part`, which can hide that descriptive engineering state was absent.
- **Evidence:** BOM snapshots deep-copy rendered configuration facts and preserve local quantities, notes, user costs, and supplier-search destinations.
- **Evidence:** Snapshots do not carry stable public family/configuration revision, catalog release, identifier namespace/mapping revision, parser version, or meaningful required-field readiness.
- **Evidence:** Current `origin`/`verificationStatus` is one coarse state and cannot represent exact/partial/conflict/unsupported/unknown/failure.
- **Evidence:** The importer summarizes only rejected syntactic rows; it has no mechanical issue queue, family profile, conflict state, or engineering-question export.
- **Risk:** Reusing the existing BOM manager visually could make B appear nearly built while preserving unsafe semantics underneath.
- **Opportunity / gold idea:** Reuse only the proven local portability primitives — parser shell, raw-file handling, quarantine, local storage, named snapshots, CSV/JSON export — while designing preflight state separately from selected BOM items.

## Manual mini-challenge

### Method

No prototype was created. A prototype would have added interface confidence without resolving the key truth question. The challenge instead applied the state contract manually to an 11-line fixture.

- Line 1 uses the sole repository-safe exact mapping cited above.
- Lines 2–11 are illustrative behavior fixtures, not catalog records or claims that the configurations exist.
- The challenge assumes only a narrow fastener release and does not invent an approved required-field profile.
- Therefore no line is labeled procurement-ready or application-ready.

### Inputs and observed safe outputs

| Line | Raw illustrative input | Observed interpretation | Safe output / action |
|---:|---|---|---|
| 1 | ID `91290A115`; qty `8`; no description | `exact` | Show repository-supported mapping to M3 × 0.5 × 10 mm. Because the repository still lacks an approved family profile and immutable catalog release, do **not** assert `configuration-handoff-supported` in the current system. |
| 2 | ID `91290A115`; qty `8`; description `M4 × 0.7 × 12 mm socket head cap screw` | `conflict` | Identifier mapping and supplied description disagree on diameter/pitch/length. Block; show both; no nearby match. |
| 3 | qty `20`; description `M4 socket head cap screw` | `partial` | Preserve M4 and family words. Pitch, length, and other family-required facts remain unresolved; exact questions wait for an approved profile. |
| 4 | qty `12`; description `M4 × 0.7 × 12 mm socket head cap screw, alloy steel, black oxide` | `partial` | Preserve every explicit fact. Do not infer strength, standard, threading, fit, release presence, or suitability. Do not auto-select from display-text similarity. |
| 5 | qty `4`; description `M4 × 0.7 and M4 × 0.5 × 12 mm socket head cap screw` | `conflict` | Two explicit pitches conflict. Block and ask the engineer to choose/correct; never use coarse pitch by default. |
| 6 | qty `20`; description `M4 screw` | `partial` | Diameter is preserved; family remains ambiguous. Do not choose socket head because it is the first supported family. |
| 7 | ID `BRG-608ZZ`; qty `4`; description `deep groove bearing` | `unsupported` | Preserve unchanged; category is outside the fastener POC. Do not reuse screw fields or infer a bearing configuration. |
| 8 | ID `ZZ-404`; qty `3`; no description | `unknown` | No active reviewed namespace/mapping is established. Do not fuzzy-match the identifier or infer a family from its shape. |
| 9 | qty `2`; identifier and description blank | `failure` | Report malformed line with original row number; keep it in the issue export. Do not silently drop it. |
| 10 | ID `91290A115`; qty `2`; injected catalog-service failure | `failure` | Preserve the line and show service unavailable. Do not reuse line 1’s exact result as stale output. |
| 11 | qty `10`; description `M4 button head screw` | `unsupported` under a one-family release | Explain current family coverage. Do not silently reinterpret as socket head or claim invalidity. |

### What the challenge clarified

- **Evidence:** One engine can deterministically separate exact, partial, conflict, unsupported, unknown, malformed, and unavailable states without inferring mechanical truth.
- **Evidence:** The batch surface makes conflicts and coverage visible together and preserves unresolved work as an artifact; this is clearer batch demonstration value than repeating eleven independent search screens.
- **Evidence:** The current data/release state cannot safely convert even the exact line into a readiness claim. Exact recognition and readiness are different.
- **Evidence:** A plausible, highly specified text line still cannot be auto-resolved safely with current substring search, lossy projection, and absent family profile.
- **Risk:** The challenge is constructed. It says nothing about how common these states are in real BOMs, whether the issue list saves work, or whether engineers prefer it.
- **Strong hypothesis:** B can be demonstrated honestly as classification and issue triage before it can be demonstrated as automatic cleanup.
- **Rejected:** Building a polished upload dashboard on the strength of this fixture.

## Wedge comparison

Ratings are directional desk judgments, not measured scores. `5` means stronger/higher; for build risk, `5` means riskier.

| Criterion | A: one-at-a-time recovery | B: BOM specification preflight | Finding |
|---|---:|---:|---|
| Frequency | 2 | 4 | **Open question:** A appears episodic; B may recur at BOM handoff/release, but no participant incidence exists. |
| Urgency | 3 | 4 | **Strong hypothesis:** Batch preflight is deadline-linked and exposes blocking questions together. The POC still omits decisive production/commercial readiness. |
| Current data fit | 5 | 2 | **Evidence:** Identifier coverage strongly favors A. B must handle sparse text, mixed categories, CSV variability, and absent profiles. |
| Demo credibility now | 5 | 3 | **Evidence:** A has a crisp repository-safe exact case. B looks valuable on a constructed fixture but can look staged until tested on real redacted lines. |
| Repeat value | 2 | 4 | **Strong hypothesis:** Saved issue queues and frozen handoffs could recur by project/revision; A alone ends after a lookup. |
| Build risk | 2 | 5 | **Evidence:** B adds import preservation, line orchestration, state aggregation, questions, review, and export on top of A’s unresolved truth work. |
| P&L leverage | 2 | 4 | **Strong hypothesis:** B could reduce clarification loops and repeated research across roles. No cost, time, or willingness-to-pay evidence exists. |

### Interpretation

- **Evidence:** A wins the bounded POC criteria that matter before user validation: data fit, technical tractability, and demo credibility.
- **Strong hypothesis:** B wins the upside criteria: repeat value, cross-role handoff value, urgency, and eventual P&L leverage.
- **Risk:** Choosing B now invites scope inflation precisely where the decisive procurement/production data is unavailable.
- **Opportunity / gold idea:** Position A as the line-resolution kernel and test B as a thin batch orchestration layer. This preserves strategic upside without pretending the batch surface creates truth.

## Direct-engineer test criteria

Run a concierge duel before building B. Use 5–8 mechanical/prototype engineers and their own recent redacted 5–15-line fastener inputs where permission permits. A mechanical domain reviewer must establish the answer key and inspect every proposed unique mapping.

### Procedure

1. Confirm the lines came from recent work and record the actual handoff destination.
2. Have the participant process the lines using their normal method.
3. Have them process the same task using A one line at a time.
4. Return a manual B preflight issue list and configuration-handoff export.
5. Ask the participant to correct every wrong state, missing question, and unnecessary question.
6. Record active effort, elapsed waiting, backtracks, engineer interruptions, preserved facts, false unique matches, unresolved lines, and whether the export changes the next handoff.
7. Keep observation notes and task results separate from conclusions; do not infer market validation from Jay’s dry run.

### B promotion gate

Promote B over A only if all safety gates and the value gates pass:

**Safety gates**

- Zero critical false unique configuration matches.
- Every explicit identifier, dimension, unit, standard, material/finish phrase, quantity, and conflict remains visible in raw or normalized form; no silent substitution.
- Every malformed line and service failure remains present and fails closed.
- Every `configuration-handoff-supported` line has an active released configuration, approved family profile, all required facts explicit/supported, no critical conflict, and a reviewer-confirmed answer.
- Participants do not interpret preflight status as equivalence, supplier approval, stock, application suitability, or production approval.

**Value gates**

- A majority prefer B to one-at-a-time processing for task reasons, not visual polish.
- For a majority, B produces a concrete next action: a corrected line, a precise engineering question, an unsupported-coverage decision, or a usable handoff artifact.
- B avoids more engineer follow-ups than it creates; generic or unanswerable questions count against it.
- A majority say they would use the preflight on the next comparable BOM/revision, and can name when that would occur.
- The exported issue/configuration packet is understandable to the actual next recipient without the facilitator explaining its statuses.

### Kill or narrow signals

- Any confident critical false match.
- Real BOMs are mostly outside the reviewed fastener release.
- Description-only lines do not contain enough information to ask better questions than a human already asks.
- Participants still open the originating supplier and consider A equally fast/clear.
- B creates a review backlog instead of reducing clarification.
- The desired value is actually price, approved vendors, equivalence, availability, ERP/PLM sync, or quality evidence.
- Participants do not reuse or hand off the output.

## Decision register

- **Evidence:** Current repository data and exact lookup make A the safer and more credible bounded POC.
- **Evidence:** The manual challenge shows B can expose useful batch states, but not that it saves real work or that any line is mechanically/procurement ready.
- **Fundamental requirement:** Build no B readiness claim before approved family identity/required-field profiles, immutable release identity, conservative exact routing, and zero-false-match review behavior exist.
- **Strong hypothesis:** B has greater repeat value and P&L leverage than A if real small BOMs contain enough safely interpretable fastener lines.
- **Opportunity / gold idea:** A line-resolution kernel plus a local “BOM specification preflight” issue queue is the most coherent future sequence.
- **Nice-to-have:** Grouped issue remediation, original-versus-export diff, local reuse memory, and compact correction comparison after the safe state model works.
- **Open question:** Real frequency, urgency, line quality, batch preference, follow-up reduction, repeat intent, and willingness to pay.
- **Risk:** Calling a narrow configuration audit “BOM readiness” invites PLM, ERP, procurement, and quality expectations the POC cannot meet.
- **Rejected:** Building B as an upload dashboard, approval workflow, ERP/PLM layer, equivalence engine, or procurement-readiness score before concierge evidence.

## Final A-vs-B recommendation

**Choose A now. Keep B as the highest-priority challenger.**

A is the stronger bounded PartSource POC because the present packet and truth model can most credibly prove conservative exact/rough-line recovery. B is the stronger product/business hypothesis because batch issue triage can create repeated handoff value, but its advantage is not validated and its safe operation depends on A plus domain/release work that does not yet exist.

The next gate is not another prototype. It is a direct-engineer concierge duel on real redacted 5–15-line inputs. If B passes the safety and value gates above, reframe the POC around **fastener BOM specification preflight**, with A as its line-level engine. If it does not, retain local BOM capture as connective tissue around A.

## Repository sources read

- `research/full-problem-space-synthesis-2026-08-09.md`
- `research/product-frontier-synthesis-2026-08-09.md`
- `research/wayfinder-audit-2026-08-05.md`
- `research/product-contract.md`
- `research/poc-discovery-benchmark.md`
- `research/full-problem-space-product-opportunities-2026-08-09.md`
- `research/full-problem-space-skeptical-review-2026-08-09.md`
- `research/mechanical-discovery-problem-evidence-2026-08-09.md`
- `research/mechanical-data-trust-opportunities-2026-08-09.md`
- `research/current-system-structural-audit-2026-08-09.md`
- `research/data-source-register.md`
- `research/user-research-results.md`
- `web/src/lib/bom.ts`
- `web/src/lib/bomStorage.ts`
- `web/src/hooks/useBOM.ts`
- `web/scripts/test-bom-domain.ts`
- `web/scripts/test-bom-storage.ts`
- `web/tests/browser/bom-manager.spec.ts`
- `sketches/002-behavioral-family-workspace/README.md`
- `sketches/002-behavioral-family-workspace/critique.md`
- `sketches/003-entry-compositions.md`
- `sketches/003-broad-requirement-resolver/README.md`
- `sketches/003-family-geometry-workbench/README.md`
- `sketches/003-exact-configuration-passport/README.md`
- `sketches/004-compare-first-spec-lab/README.md`

No production implementation or existing prototype was modified. No new prototype was created.
