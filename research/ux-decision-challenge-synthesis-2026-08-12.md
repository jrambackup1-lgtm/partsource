# PartSource UX decision + challenge synthesis — 2026-08-12

Status: decision/challenge synthesis. No code authority. No implementation tickets created.

Inputs:

- `research/ux-engineer-user-research-innovation-2026-08-12.md`
- `research/product-contract.md`
- `SPEC_CONFIRMATION.md`
- `docs/specs/partsource-progressive-catalog-poc.md`
- `.wayfinder/poc-ship/poc-ship-map.md`

Challenge lanes:

1. Product-contract guardian.
2. Engineer workflow + competitor evidence reviewer.
3. Technical feasibility + safety/trust reviewer.

Non-negotiable preserved rule:

`query → catalog level → family → filters → result list`

Exact ID highlights in context. Non-exact search never auto-selects. Runtime has no AI/agents. No supplier/BOM/commercial/equivalence/CAD-generation scope.

## Executive verdict

The UX research is directionally useful, but it is not a backlog.

The strongest ideas are not new product surfaces. They are stricter forms of the current catalog contract:

- show what the deterministic resolver understood;
- keep filters typed and family-specific;
- keep exact identity separate from user choice;
- make units/datum/provenance explicit;
- make result lists comparison-ready without implying equivalence.

The current POC should not be reopened. It already proves the core loop with a local synthetic screws bundle. New ideas should become product/Wayfinder decisions first, then a later spec only after Jay authorizes it.

## Idea evaluation matrix

| Idea | Decision | Why needed | Evidence support | Engineer problem? | Improves core flow? | Complexity risk | POC or later? |
|---|---|---|---|---|---|---|---|
| Progressive catalog navigation | KEEP | This is the product path. | Contract + competitor category/filter patterns. | Yes: rough intent to family/list. | Directly. | Low; already scoped. | POC/core. |
| Why-this-matched | MODIFY | Trust/recovery: user sees what was recognized and what was not. | McMaster/Digi-Key broad→filter pattern; user praise for rough query routing. | Yes. Reduces black-box search confusion. | Yes, if shown as resolver trace. | Medium: can become AI-style justification/confidence. | Later spec; optional POC only if targeted. |
| Smart filters | MODIFY / DEFER | Prevent impossible combinations and explain zero states. | Mouser Smart Filtering; Digi-Key/range complaints; MSC bad facets. | Yes. Filters are engineer constraints. | Yes. | Medium-high: hidden inference, over-control, count semantics, range model. | Later; not current POC. |
| Family-specific typed filters | KEEP | Raw facets are unsafe. Mechanical fields must be schema-backed. | Contract; MISUMI specs/dimensions; MSC duplicate-value complaint. | Yes. | Directly. | Medium when adding families. | POC/core, expand later. |
| Unit/terminology model | KEEP / DEFER expansion | Prevent silent unit/datum/nominal errors. | Prior gate found metric/unit issues; mechanical ambiguity; current POC length datum. | Yes. | Yes, before broader families. | High if universalized too early. | Keep principle now; fuller model later. |
| Exact-ID states | MODIFY | IDs are brittle workflow artifacts; must avoid fuzzy selection. | CAD filename/part-number workflow evidence; current exact-ID contract. | Yes. | Yes. | Medium: “confidence ladder” can invite fuzzy ID behavior. | POC already has 0/1/many; expanded states later. |
| Result-list comparison fields | KEEP | Engineers compare before detail; avoid pogo-sticking. | McMaster/MISUMI/Digi-Key/Octopart dense specs. | Yes. | Yes. | Medium per family schema. | POC/core as rich rows; future per-family columns. |
| Explicit comparison mode | DEFER | Useful after narrowing. | Competitors support compare. | Yes, but not proven for PartSource yet. | Indirect. | High: shortlist/favorite/BOM/table/accessibility creep. | Later. |
| Provenance | KEEP / MODIFY | Trust boundary; avoid false authority. | Contract requires provenance; competitor/source trust evidence. | Yes. | Yes for safe selection. | Medium for real data field lineage. | POC provenance stays; field-level later. |
| Field-level provenance | DEFER | Needed with real source data. | Trust/provenance evidence. | Yes, later. | Yes. | High: source model, original values, conflicts, release dates. | Later, not synthetic POC. |
| Mobile/table UX | MODIFY / DEFER | Must not break narrow screens/keyboard access. | POC accessibility; weak mobile-primary evidence. | Partial. | Quality bar, not product wedge. | Medium. | Keep baseline; defer advanced mobile/table UX. |
| Accessibility dense UX | KEEP | Engineering table/filter UI must be operable and truthful. | Current POC accessibility spec; Digi-Key accessibility reference. | Yes. | Supports flow. | Medium if over-expanded. | POC quality bar; expand later only as acceptance criteria. |
| Adjacent candidates | DEFER / MODIFY | Helps exploration without claiming equivalence. | Competitor similar/cross-reference features; user need for range/nearby values. | Maybe; needs validation. | Can help within family. | High trust risk: perceived substitute/replacement. | Later only, same-family, explicit reason. |
| CAD availability metadata | DEFER / MODIFY | CAD is expected in engineer workflow. | McMaster/MISUMI/TraceParts/CAD evidence. | Yes, but not current wedge. | Indirect. | High source/geometry/provenance burden. | Later only if source-backed. |
| CAD downloads/generation/add-ins | REJECT now | Not needed for navigator proof. | Competitor table stakes, not differentiation. | Real but out of scope. | No. | Very high legal/truth/data burden. | Future only by new contract. |
| Runtime AI/agentic part finder | REJECT | Violates deterministic trust model. | No valid support for current contract. | Unsafe. | No. | Fatal. | Never under current contract. |
| Natural-language magic answer | REJECT / MODIFY into deterministic parsing | Rough intent is real; magic answer is unsafe. | User rough-query evidence. | Yes only if bounded. | Only as supported token parsing. | High auto-selection risk. | Deterministic parser only. |
| Fuzzy/semantic part-number selection | REJECT | IDs are brittle. | Exact-ID evidence. | Creates wrong-part risk. | No. | Fatal trust risk. | No. |
| Supplier/pricing/availability/procurement/BOM | REJECT now | Real pain but different product. | User supplier/availability pain. | Yes, but outside scope. | No for core navigator. | Fatal scope creep. | Future only by explicit new contract. |
| Equivalence/replacement/substitute claims | REJECT | Mechanical similarity is not equivalence. | Prior gates rejected this. | Unsafe. | No. | Fatal trust risk. | No. |
| Global confidence/verified badges | REJECT | Hides source truth. | Prior gates rejected “verified/confidence.” | Unsafe overtrust. | No. | High. | No. |
| Raw supplier facets | REJECT | Creates duplicate/dirty filters and false authority. | MSC complaint; contract only typed fields. | Hurts. | No. | High. | No. |
| Infinite global result dump | REJECT | Loses family context and comparison stability. | Contract requires catalog context. | Hurts. | No. | Medium-high. | No. |

## Final KEEP list

These should stay in the product direction.

1. Progressive catalog flow:
   - `query → catalog level → family → filters → result list`.
2. Exact-ID highlight and user-selection separation.
3. Family-specific typed filters.
4. Unit/datum/terminology truth as a product requirement.
5. Result rows that show family-specific technical fields.
6. Provenance and explicit missing/conflicting/unsupported states.
7. Accessibility as a quality bar: keyboard, focus, non-color-only states, narrow-screen safe inspection.

## Final MODIFY list

Good idea, but needs tighter wording before spec.

1. Why-this-matched
   - Use “deterministic interpretation trace,” not explanation/recommendation.
   - Show only: original query, recognized tokens, catalog level/family, active filters, unsupported terms, conflicts, exact-ID cardinality, stop reason.
   - Ban confidence, “best match,” “recommended,” AI-style prose.

2. Smart filters
   - Use only deterministic counts/disabled impossible options from the current typed set.
   - Never auto-drop constraints, auto-broaden, infer missing values, rank, or recover silently.
   - Keep zero states visible and explain them.

3. Exact-ID states
   - Avoid “confidence ladder” wording.
   - Use deterministic identity states:
     - unique exact;
     - supported normalized exact;
     - ambiguous/non-unique;
     - unknown;
     - ID-like/prefix-like but unsupported.
   - Only unique supported mappings can highlight. None can auto-select.

4. Provenance
   - POC: bundle-level synthetic fact and mapping provenance is enough.
   - Real data later: field-level source kind, original value, normalized value, import/release date, conflict/missing state.
   - Reject “verified/confidence” replacements.

5. Adjacent candidates
   - Use only later, same-family first, deterministic reason per candidate.
   - Label “adjacent candidates,” not similar/equivalent/replacement/substitute.

6. Mobile/table UX
   - Keep responsive accessibility baseline.
   - Defer mobile-first/full comparison UX until real task validation.

## Final DEFER list

Useful later. Not current POC.

1. Full smart-filter counts/disabled options/range semantics.
2. Explicit comparison mode.
3. Field-level provenance for real source data.
4. Expanded unit/terminology relation model across multiple families.
5. Expanded exact-ID states beyond current exact 0/1/many.
6. Adjacent candidates.
7. CAD/drawing availability metadata, only if source-backed.
8. Search within selected family.
9. Pinned columns, keyboard expert shortcuts, export/copy comparison.
10. Mobile inspection polish beyond current responsive baseline.

## Rejected ideas

1. Runtime AI/agents.
2. Auto-selecting non-exact results.
3. Fuzzy/semantic part-number selection.
4. Natural-language magic answer UX.
5. Supplier/pricing/stock/availability/lead-time/quote/checkout.
6. BOM/procurement/account/approved-vendor workflow.
7. Equivalence/replacement/substitute/approved-alternate claims.
8. Generated or approximate CAD as product truth.
9. CAD downloads/add-ins in current scope.
10. Global confidence, verified, approved, suitability, or recommendation badges.
11. Raw supplier facets as filters.
12. Commerce-first detail/result pages.
13. Infinite global result dumps detached from family context.
14. Silent unit conversion or silent nominal/actual merging.
15. Cross-family adjacent/similar candidates.

## Required product/spec changes

No immediate spec change is authorized by this decision phase.

Prepare these as proposed changes only:

1. Add “deterministic interpretation trace” to the product model.
2. Add deterministic identity-state vocabulary beyond the current exact-ID contract, but preserve highlight-only unique mappings.
3. Add unit/terminology truth model before expanding families:
   - original value;
   - normalized value;
   - unit;
   - relation type: exact/range/min/max/nominal;
   - datum;
   - family applicability.
4. Add smart-filter constraints:
   - option counts/disabled values only from typed current result set;
   - no silent recovery;
   - explicit zero/conflict explanation.
5. Add result-list comparison-field rule:
   - family-specific canonical columns;
   - no equivalence/replacement implication.
6. Add provenance model for real data:
   - record-fact provenance;
   - identifier-mapping provenance;
   - normalized-field provenance;
   - missing/conflicting source state.
7. Add accessibility/dense-table acceptance rules beyond the current POC only if a next UX prototype is approved.

## Wayfinder decisions required

Do not create implementation tickets yet.

Next Wayfinder work should be decision tickets only:

1. Choose first post-POC engineer task to validate.
   - vague family discovery;
   - exact identifier recovery;
   - dimensional filtering/comparison;
   - provenance/trust inspection.

2. Decide if “deterministic interpretation trace” becomes the next prototype/spec focus.

3. Decide unit/terminology model depth for the next family expansion.

4. Decide smart-filter scope:
   - counts only;
   - disabled impossible values;
   - range/min/max semantics;
   - zero-state recovery copy.

5. Decide same-family comparison boundary:
   - rich result rows only;
   - explicit compare mode;
   - no cross-family comparison.

6. Decide provenance depth for next real-data gate:
   - bundle/source-level;
   - field-level;
   - original/normalized dual display;
   - release/import timestamp.

7. Decide exact-ID state vocabulary:
   - unique exact;
   - normalized exact;
   - non-unique;
   - unknown;
   - ID-like unsupported.

8. Decide validation gate before implementation:
   - minimum 3–5 lightweight engineer reviews for direction;
   - stronger 6–8 recent-work sessions before calling it validated;
   - qualified domain review before real data/family truth.

## Should the existing POC change?

Decision: NO.

The existing POC should not change in this phase.

Reasons:

- It already proves the approved core flow.
- It already has typed filters, exact-ID zero/one/many, fail-closed states, provenance labels, URL safety, accessible detail, and no external calls.
- The new ideas add useful future direction but not a defect in the current POC.
- Reopening the POC would turn completed release evidence into scope churn.

Only revisit the POC if a targeted audit finds a violation of the current contract, such as:

- non-exact auto-selection;
- exact collision highlighting;
- unsupported term becoming a fact/filter;
- missing synthetic provenance;
- fallback/first-result behavior;
- detail opening without user selection;
- external calls or prohibited claims.

## Proposed Wayfinder/spec changes prepared

Prepared, not applied to authority:

- Use a new Wayfinder decision frontier for post-POC UX validation.
- Keep current POC map closed/complete.
- Add decision tickets only after Jay approves the new frontier.
- Proposed spec themes:
  - deterministic interpretation trace;
  - identity-state vocabulary;
  - unit/terminology model;
  - smart-filter constraints;
  - same-family comparison boundary;
  - provenance model;
  - accessibility/dense-table acceptance.

## Stop condition

This decision phase stops before implementation.

No code changes. No implementation tickets. No runtime AI/agents.
