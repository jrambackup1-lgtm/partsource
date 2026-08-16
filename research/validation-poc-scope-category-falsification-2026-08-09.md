# POC boundary and category falsification: rolling bearings

**Date:** 2026-08-09  
**Phase:** Validation + Targeted Ideation Gate  
**Status:** Conceptual falsification, not category coverage, user validation, a source approval, or a product specification.  
**Category:** Rolling bearings.  
**Decision question:** Does fastener specification recovery provide a credible basis for a broader mechanical-component platform?

## Terse verdict

**Risk:** Rolling bearings falsify the simple platform story. The truth workflow survives, but the fastener-centered meaning of `configuration` and `selection-ready` does not. Bearing identity can require a manufacturer namespace and execution, while bearing selection can require operating conditions, arrangement decisions, ratings, lubrication, interfaces, and calculations. A seller-neutral dimensional record is neither necessarily the identified product nor an application-qualified selection.

**Strong hypothesis:** Keep **A — fastener specification recovery and safe handoff** as a fastener-only POC boundary. Keep **B — fastener BOM specification preflight** as the manual challenger. Do not use bearings to expand the release.

**Opportunity / gold idea:** If a broader direction is tested later, test **C — category-scoped specification integrity**: preserve an engineering line, identify its namespace and category, separate product identity from application requirements, expose unresolved facts, and produce an honest issue/handoff packet. Do not promise a universal neutral configuration.

**Rejected:** Three screw families plus a conceptual bearing model as proof of a mechanical-parts platform.

**A/B/C/D leaning:** **A (fastener-only) > B (manual challenger) > C (platform research only). D applies now to category expansion and broad platform claims, not yet to the bounded fastener test.**

## Why rolling bearings are the strongest falsifier

**Evidence:** The prior mechanical-data validation already used O-rings as a conceptual envelope check. Repeating O-rings would mostly confirm that category-specific fields can live in JSON. Rolling bearings challenge more than fields: they force separation of catalog identity, manufacturer execution, arrangement, and application selection.

**Evidence:** SKF's first-party selection process starts with performance requirements and operating conditions and proceeds through bearing type and arrangement, bearing size, lubrication, operating temperature and speed, bearing interfaces, bearing execution, sealing, mounting, and dismounting. This is not a flat catalog-facet sequence.

**Evidence:** SKF states that most SKF rolling-bearing designations consist of a basic designation with optional prefixes and suffixes. SKF separately says suffixes indicate internal-clearance variants when clearance differs from Normal.

**Evidence:** Schaeffler says a rolling-bearing designation can indicate type, dimensions, tolerances, internal clearance, and other important features.

**Evidence:** NSK publishes a manufacturer-specific bearing-designation-system brochure. Timken's engineering manual describes itself as a guide to bearing selection and directs complex applications to a Timken engineer.

**Strong hypothesis:** Bearings are a stronger falsifier than another discretely enumerated hardware family because a correct result may depend on both exact manufacturer execution and condition-dependent engineering work. The platform cannot hide either layer inside a generic `configuration` object without overstating what was recovered or selected.

**Risk:** These first-party sources establish category semantics only. They do not establish PartSource demand, data rights, usable coverage, cross-manufacturer equivalence, or a bearing product opportunity.

## Evidence boundary

**Evidence:** Repository facts used here come only from the permitted repository reports and prototypes listed below. The approved PartSource packet is fastener-only; no sanctioned bearing packet was inspected.

**Evidence:** The repository still records no direct target-user validation, no approved family identity/required-field profiles, no immutable public catalog release, and no independently overlapping approved source.

**Evidence:** External research was limited to first-party bearing manufacturers' technical/category material. No bearing record, designation mapping, table, rating, or claimed cross-reference was copied into PartSource.

**Fundamental requirement:** Treat all bearing examples in a future test as participant-supplied or reviewer-created test inputs. They are not PartSource catalog facts until source permission, mapping evidence, domain review, and release controls exist.

**Rejected:** Inferring bearing interchangeability from equal boundary dimensions, a shared basic designation, or a similar-looking suffix.

## Conceptual falsification versus empirical validation

### What this report can establish conceptually

**Evidence:** The current four-object bridge can represent a category-specific publication snapshot only if `configuration` remains an intentionally broad container and each category supplies its own identity rules.

**Evidence:** The current recovery workflow contains durable operations: preserve input, route identifiers conservatively, expose interpretation, retain missingness/conflict, freeze identity and evidence, and fail closed.

**Evidence:** Bearing semantics require at least one distinction not explicit in the fastener bridge: a manufacturer product/execution can be the target of an identifier even when a seller-neutral configuration is incomplete or unsafe as a replacement description.

**Strong hypothesis:** The conceptual platform kernel is truth-preserving specification handling, not a universal family/configuration selector.

### What remains empirically unvalidated

**Open question:** Do engineers receive opaque or incomplete bearing lines often enough to value an independent integrity packet?

**Open question:** Is there a useful stopping point between opening the original manufacturer's material and performing application selection?

**Open question:** Can a category-neutral packet save work when cross-manufacturer equivalence is deliberately excluded?

**Open question:** Do users regard a preserved unresolved requirement as useful, or merely as a slower route to the manufacturer or bearing specialist?

**Open question:** Can any sanctioned source support exact bearing identity, revisions, and technical facts without creating a manufacturer-catalog clone?

**Rejected:** Calling this report category validation, product validation, market validation, or evidence that PartSource should cover bearings.

## Which domain objects survive

| Domain object | Bearing-category result | Classification and implication |
|---|---|---|
| Raw input / submitted clue | Survives unchanged | **Fundamental requirement:** preserve the complete designation, punctuation, spacing, namespace clue, source context, and surrounding line. Never normalize by deleting an unfamiliar suffix. |
| Search interpretation / constraint ledger | Survives and becomes more important | **Strong hypothesis:** show which token may be a basic designation, prefix, suffix, dimension, clearance, seal, tolerance, or unresolved manufacturer code, without promoting a parse to truth. |
| Family | Survives only as routing | **Risk:** bearing type is not a complete selection grammar. Arrangement and operating conditions can change the relevant questions and valid execution. |
| Configuration | Does not survive with the fastener meaning | **Risk:** it splits into at least seller-neutral technical description, manufacturer product/execution, and application-qualified selection. Collapsing these creates false identity or suitability. |
| Identifier mapping | Survives only with explicit namespace and target type | **Fundamental requirement:** map an exact designation to a named manufacturer product/execution or return ambiguity/unknown. Do not map it directly to a generic equivalent configuration. |
| Manufacturer product / execution | Missing from the simple platform story | **Fundamental requirement:** if exact designation recovery is offered, this is a first-class target or an explicit external object. It cannot be hidden as provenance on a neutral configuration. |
| Release | Survives as PartSource publication identity | **Strong hypothesis:** immutable release, mapping revision, withdrawal, and correction rules still help. A PartSource release does not establish manufacturer lifecycle status or continued production. |
| Evidence / review / missingness | Survives | **Fundamental requirement:** keep origin, review scope, publication lifecycle, unresolved code, and confidential-source limits separate. |
| Frozen BOM snapshot | Survives if it freezes the exact clue and target type | **Strong hypothesis:** a snapshot can preserve an exact manufacturer designation or an unresolved bearing requirement. A neutralized description must not silently replace the supplied identity. |
| Supplier handoff | Mostly collapses for alternate sourcing | **Risk:** a copied neutral packet can look like an equivalence statement. Source-direct exact opening may survive; alternate-supplier handoff should stay blocked unless the user is plainly starting independent engineering research. |

## Which workflow steps survive

1. **Preserve the input.**  
   **Fundamental requirement:** keep the exact designation and source context before parsing.

2. **Classify the request.**  
   **Strong hypothesis:** distinguish exact manufacturer designation recovery, rough product description, and application selection. These are different jobs.

3. **Route conservatively.**  
   **Fundamental requirement:** require or infer only a reviewed manufacturer namespace rule. Unknown suffixes, collisions, or absent namespace produce ambiguity, not a nearby answer.

4. **Expose interpreted and unresolved facts.**  
   **Strong hypothesis:** the constraint ledger and fact-state model transfer well. It should say what was supplied, parsed, not understood, or missing.

5. **Resolve an identity when evidence supports it.**  
   **Fundamental requirement:** an exact result identifies the manufacturer product/execution and revision scope supported by evidence. It does not establish a generic equivalent.

6. **Ask category-specific next questions.**  
   **Risk:** this is no longer a fixed facet sequence. Questions may depend on operating conditions, arrangement, interfaces, and calculations. PartSource must stop before suitability unless it deliberately becomes a reviewed bearing-selection tool.

7. **Freeze a packet.**  
   **Strong hypothesis:** the useful artifact is an exact-identity or unresolved-requirement packet with named limits, not necessarily a completed neutral configuration.

8. **Handoff.**  
   **Fundamental requirement:** source-direct opening and independent alternate research remain separate. No alternate, replacement, fit, life, or suitability claim follows from the packet.

## Which fastener assumptions collapse

### 1. A family has a stable required-field checklist

**Risk:** For the screw POC, a reviewed family profile can plausibly name the facts needed for a configuration handoff. In bearings, the facts needed to decode an existing designation differ from the facts needed to select a bearing for an arrangement. The latter depend on operating conditions and performance targets.

**Rejected:** One universal `bearing required fields` list that makes a record selection-ready when all boxes are populated.

### 2. One configuration can be seller-neutral and still be the useful center

**Risk:** A bearing basic designation, dimensions, and broad type may not preserve manufacturer execution, internal clearance, sealing, tolerance, cage, lubricant, or other designated features. A complete manufacturer designation can be useful precisely because it is not seller-neutral.

**Rejected:** Stripping manufacturer-specific execution into a generic record and then treating that record as the recovered identity.

### 3. Exact identifier resolves to a neutral configuration

**Risk:** The safe target of an exact bearing designation is first the named manufacturer's product/execution. Any mapping to a shared configuration is a separate reviewed relationship and can be incomplete.

**Rejected:** `exact designation → generic configuration → alternate supplier search` as one automatic path.

### 4. Discrete facets are enough to reach a safe handoff

**Risk:** Bearing selection includes condition-dependent choices and performance calculations. A list of type, bore, outside diameter, width, seal, and clearance facets can support discovery but cannot establish life, speed, fit, lubrication, or application suitability.

**Rejected:** Treating one remaining catalog row as bearing-selection readiness.

### 5. A copied specification packet is a neutral supplier handoff

**Risk:** For fasteners, a complete reviewed configuration packet may support independent supplier search while explicitly denying equivalence. For bearings, removing the manufacturer identity can lose execution detail; retaining it can turn the handoff into a cross-reference request. Either path creates stronger replacement implications.

**Rejected:** Alternate-supplier links as a default completion action for bearings.

### 6. Family-first is the main broad-input interaction

**Strong hypothesis:** Family/type routing still helps explain ambiguity, but an early job split is more important: `decode this designation`, `describe this known product`, or `select for this application`.

**Risk:** A family gallery may make application selection look like catalog browsing and hide arrangement-level questions.

## A/B/C/D evaluation

### A — fastener specification recovery and safe handoff

**Evidence:** A remains best aligned with the current identifier-rich fastener packet, the corrected exact fixture, deterministic search direction, and the present product contract.

**Strong hypothesis:** A is still the smallest credible POC, provided `safe handoff` means a frozen fastener configuration/issue packet and supplier translation remains secondary.

**Risk:** A proves a fastener workflow, not a mechanical platform. It also remains vulnerable to low task frequency, opening the originating supplier being faster, confidential lineage, and absent reviewed releases/profiles.

**Strong hypothesis:** Keep A as the immediate, fastener-only learning boundary.

### B — fastener BOM specification preflight

**Evidence:** B can reuse A's exact resolver, conflict states, raw-input preservation, release identity, and fail-closed behavior. The repository's manual challenge showed clearer batch issue-triage value but no direct-user proof.

**Strong hypothesis:** B may create stronger repeat and handoff value than isolated recovery.

**Risk:** Mixed-category BOMs will quickly contain objects such as bearings whose line semantics cannot be processed by fastener profiles. Honest `unsupported` results are acceptable; pretending the batch shell generalizes is not.

**Strong hypothesis:** Keep B as a manual fastener-only challenger, not a category-expansion argument.

### C — category-scoped specification integrity

**Opportunity / gold idea:** Reframe the potential shared product as an integrity layer rather than a universal selector:

- preserve the original line and namespace;
- classify the category and job type;
- recover an exact source/manufacturer identity when supported;
- expose parsed facts, unresolved codes, conflicts, and coverage;
- separate technical description, manufacturer product, and application requirement;
- freeze an issue or identity packet;
- stop before equivalence and suitability.

**Strong hypothesis:** This direction better describes what survives across fasteners and bearings.

**Risk:** It may be merely a careful document parser. Without repeated user pain, sanctioned category data, and a valued downstream artifact, it is not a product or platform.

**Strong hypothesis:** Keep C in research only. It is not more defensible than A today and should not trigger a build or category ingestion.

### D — stop/rethink

**Evidence:** The broad mechanical-platform claim lacks direct-user evidence and cross-category data. Bearings expose missing product/execution and application-selection layers.

**Rejected:** Any current category expansion, universal schema, or platform positioning. Do not yet stop the bounded fastener test; stop it if the direct fastener gate or the kill test below fails.

## Would category expansion add proof or distraction?

**Evidence:** Adding bearing records would require new source permission, manufacturer namespaces, designation rules, product/execution identity, technical fields, correction semantics, and domain review. None of that proves fastener demand.

**Risk:** A small bearing demo would likely select easy exact IDs and hide the application-selection cases that make the category a falsifier. It would increase apparent breadth while weakening truth.

**Risk:** A universal UI would encourage nullable fastener fields, opaque category JSON, or a generic `configuration` label that conceals different identity targets.

**Strong hypothesis:** One direct bearing-category test adds conceptual and user evidence. Bearing ingestion, a prototype catalog, or category facets add distraction before that test.

**Rejected:** Expanding the POC release to bearings, creating a bearing prototype, or adding bearing fields to the fastener model at this gate.

## Smallest direct-user/category kill test

### Platform hypothesis under test

**Strong hypothesis:** Across meaningfully different mechanical categories, PartSource can preserve a real line, recover or clarify the relevant specification without guessing, and produce a useful safe handoff using shared truth operations plus bounded category rules—without becoming a manufacturer-catalog lookup or an application-engineering system.

### Minimum sample

Recruit **three practicing engineers or bearing specialists** who handled a bearing identification, replacement-research, or selection task in the last three months. Each brings two redacted recent cases:

1. one exact or nearly exact bearing designation from a BOM, drawing, machine record, or removed part;
2. one rough requirement or replacement request where operating context mattered.

This yields six real cases. One independent bearing-domain reviewer prepares the answer key and classifies the safe endpoint before the sessions. No bearing data is retained beyond explicit participant permission.

**Fundamental requirement:** The answer key must distinguish:

- exact manufacturer product/execution;
- seller-neutral technical description;
- application requirement;
- unknown or ambiguous designation;
- unsupported equivalence/replacement claim;
- information or calculation needed before selection.

### Concierge procedure

1. Observe the participant's normal workflow and final artifact.
2. Manually produce a PartSource-style packet: verbatim line, namespace, interpreted facts, unresolved tokens, target object, evidence boundary, and safe next action.
3. Do not recommend a replacement or calculate suitability. If the task requires those actions, mark that boundary.
4. Ask the participant to correct every parsed fact, missing question, target identity, and safe next action.
5. Give the packet to the actual next recipient where permission allows, or run a recipient-role comprehension check.
6. Record active time, source openings, manufacturer-data dependencies, calculations, wrong unique mappings, unresolved-code detection, whether the packet changes the next action, and whether it would be reused.

### Kill conditions

Kill the broad platform hypothesis if **any safety condition** or **either structural/value condition** occurs:

**Safety kill**

- Any case produces a confident wrong unique product/execution or drops a designation token that changes meaning.
- Any participant or recipient interprets a neutralized packet as an equivalent, replacement, or application-qualified selection because of the workflow.

**Structural kill**

- In four or more of six cases, the useful endpoint requires either manufacturer-specific product data or application calculation/selection outside the boundary, and the intermediate integrity packet does not change the next action.

**Value kill**

- Two or more of three participants say the packet adds no useful decision, handoff, or error check over opening the manufacturer source or asking a bearing specialist, and they cannot name a recent case where they would reuse it.

**Fundamental requirement:** A kill result is sufficient to reject the shared platform hypothesis. Passing this tiny test is not platform validation; it only justifies a larger sanctioned category study.

### What would survive a non-kill result

**Strong hypothesis:** Continue only if all exact cases preserve complete designation meaning, rough cases produce better scoped questions without pretending to select, and at least two participants use the packet to change or improve a real next action.

**Open question:** A larger study would still need source rights, coverage, namespace collision tests, manufacturer lifecycle handling, and comparison against normal manufacturer tools.

**Rejected:** Treating six successful concierge cases as proof of coverage, automation, product-market fit, or a mechanical-parts platform.

## Decision register

### Evidence

- The current permitted packet and strongest exact path are fastener-specific.
- No sanctioned bearing packet or direct bearing-user evidence was inspected.
- First-party bearing guidance separates designation semantics from a multi-step application selection process.
- The shared truth operations transfer; a universal neutral `configuration` and selection-ready checklist do not.
- The repository's supplier-handoff validation already makes handoff secondary and blocks unsupported categories.

### Fundamental requirement

- Keep raw clue, namespace, target object, interpretation, evidence, missingness, release, and claim boundary separate.
- Add manufacturer product/execution as a distinct identity target before any exact bearing-designation claim.
- Separate product decoding from application selection before category routing.
- Keep alternate/replacement/equivalence and suitability outside the POC.
- Run the direct kill test before data ingestion, prototype work, or platform positioning.

### Strong hypothesis

- A remains the best immediate fastener-only POC.
- B remains the strongest repeat-value challenger.
- C is the most coherent cross-category concept, but only as a testable research direction.
- Bearings are useful as a falsifier, not as expansion scope.

### Opportunity / gold idea

- Make the target object explicit in every packet: `family`, `seller-neutral description`, `manufacturer product/execution`, or `application requirement`.
- Use an unresolved but precise integrity packet as a valid outcome instead of forcing every category into a selected configuration.

### Nice-to-have

- A designation-token explanation after domain review and source permission.
- Category-specific calculation handoff links that carry raw requirements without claiming the calculation result.
- Cross-release correction comparison for exact manufacturer designations after real lifecycle evidence exists.

### Open question

- Whether a specification-integrity packet has independent value between manufacturer lookup and application engineering.
- Whether target users encounter enough cross-category line ambiguity to support a shared product.
- Whether a sanctioned bearing source can support exact identity without unacceptable rights, freshness, or lifecycle risk.
- Whether the next recipient understands the packet without inferring replacement or suitability.

### Risk

- Manufacturer-specific suffixes and executions can be lost by neutral normalization.
- Family-first UI can hide arrangement and operating-condition decisions.
- Category JSON can conceal incompatible identity models behind one object name.
- A polished bearing example can create platform theatre while testing only hand-picked exact IDs.
- `Safe handoff` can be heard as safe replacement unless the endpoint and claim boundary are explicit.

### Rejected

- Bearings in the current POC release.
- A universal mechanical configuration tuple or required-field checklist.
- Boundary dimensions or basic designation as equivalence proof.
- Automatic cross-manufacturer mapping or alternate-supplier search.
- Bearing suitability, life, fit, lubrication, or replacement recommendations.
- Another prototype before the direct kill test.

## First-party category sources consulted

These sources were used only to understand bearing-category semantics. They are not PartSource catalog sources and do not establish PartSource coverage.

1. SKF, **Bearing selection process** — performance/operating conditions through type/arrangement, size, lubrication, temperature/speed, interfaces, execution, sealing, mounting, and dismounting.  
   https://www.skf.com/us/products/rolling-bearings/principles-of-rolling-bearing-selection/bearing-selection-process
2. SKF, **Performance requirements and operating conditions**.  
   https://www.skf.com/us/products/rolling-bearings/principles-of-rolling-bearing-selection/bearing-selection-process/performance-and-operating-conditions
3. SKF, **Basic bearing designation system** — basic designation with optional prefixes/suffixes.  
   https://www.skf.com/us/products/rolling-bearings/principles-of-rolling-bearing-selection/general-bearing-knowledge/bearing-basics/basic-bearing-designation-system
4. SKF, **Internal clearance** — clearance classes and designation suffix treatment.  
   https://www.skf.com/us/products/rolling-bearings/principles-of-rolling-bearing-selection/general-bearing-knowledge/bearing-basics/internal-clearance
5. Schaeffler medias, **Bearing data** — designation covers type, dimensions, tolerances, clearance, and other features.  
   https://medias-at.schaeffler.com/en/knowledge-center/rolling-bearings/bearing-data
6. NSK, **Bearing Designation Systems**, 2024 brochure.  
   https://www.nsk.com/content/dam/nsk-marketing/projects-completed/literature/service/bearing-designation-systems_bochure/en_bearing-designation-systems_bochure/preview-pdf_bearing-designation-systems_bochure_en/EN_Bearing_Designation_Systems_BD_03_2024_low-res.pdf
7. Timken, **Timken Engineering Manual**, 2025 hosted edition.  
   https://engineering.timken.com/wp-content/uploads/2025/03/Timken-Engineering-Manual_10424.pdf

## Repository sources read

- `research/full-problem-space-synthesis-2026-08-09.md`
- `research/wayfinder-audit-2026-08-05.md`
- `research/product-contract.md`
- `research/validation-bom-readiness-wedge-2026-08-09.md`
- `research/validation-search-mechanical-reasoning-2026-08-09.md`
- `research/validation-mechanical-data-model-2026-08-09.md`
- `research/validation-trust-provenance-2026-08-09.md`
- `research/validation-engineer-workflow-2026-08-09.md`
- `research/validation-supplier-handoff-2026-08-09.md`
- `research/data-source-register.md`
- `research/poc-family-taxonomy-audit-2026-08-09.md`
- `research/mechanical-discovery-problem-evidence-2026-08-09.md`
- `research/full-problem-space-skeptical-review-2026-08-09.md`
- `sketches/002-behavioral-family-workspace/README.md`
- `sketches/003-broad-requirement-resolver/README.md`
- `sketches/003-exact-configuration-passport/README.md`
- `sketches/004-compare-first-spec-lab/README.md`
- `sketches/006-supplier-handoff-lab/README.md`

No production code or prototype was created or modified. No `/to-spec` work was started.
