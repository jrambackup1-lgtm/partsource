# Empirical Rolling-Bearing Falsification — 2026-08-09

## Status and scope

- **Study type:** bounded desk/domain contract falsifier.
- **Evidence status:** official-manufacturer/standards domain evidence plus repository contract inspection; **not direct-user evidence**.
- **Direct participants:** 0.
- **Participant-supplied bearing cases:** 0.
- **Execution boundary:** no person was contacted, no participant was simulated, and no public example was represented as recent participant work.
- **Repository boundary:** this report is the only change. No production code, prototype, source register, category schema, catalog, migration, or route was edited.
- **Prohibited work not performed:** no `/to-spec`; no bearing-category ingestion; no bearing catalog copy; no supplier/equivalence/replacement/suitability claim; no broad mechanical-platform claim.

The report skeleton was created at this path before repository or external-source investigation. Because the required participant-supplied case does not exist, this execution substitutes only a **desk/domain contract falsifier**, not a direct study.

## Falsification question and verdict

**Question:** Can the PartSource primitives—raw clue, namespaced mapping, category schema, configuration/product execution, missing/conditional facts, lifecycle, frozen packet, supplier handoff, and suitability boundary—survive a bounded rolling-bearing test without importing the fastener model's identity and selection assumptions?

> **Falsification verdict: FAIL for unchanged fastener-model transfer; CONDITIONAL PASS for a smaller truth-operations kernel.**

The category-independent operations survive: preserve input, type a namespace and mapping target, expose interpretation and unresolved facts, distinguish evidence/review/publication lifecycle, freeze an immutable issue or identity packet, fail closed, and state claim boundaries. The current fastener-centered object graph does **not** survive unchanged. A bearing task requires an explicit manufacturer **product/execution** target and a separate **application requirement/selection** task. A seller-neutral dimensional configuration cannot safely stand in for either. Consequently, this test falsifies automatic `identifier → neutral configuration → selected product → alternate-supplier handoff` transfer to rolling bearings.

This is a negative domain-contract result. It does not validate bearing coverage, demand, usefulness, implementation, or a platform.

## Evidence policy and source register

External pages were treated as untrusted data and used only for the narrow observations listed below. Citations point to official manufacturer or ISO pages/documents. No page, designation table, rating table, or catalog row was copied into PartSource data. These citations are **not** approvals in `research/data-source-register.md` and do not authorize acquisition, storage, publication, or refresh.

### Official domain sources used

| ID | Official source | Bounded observation used | Explicit limit |
|---|---|---|---|
| O1 | SKF, **Basic bearing designation system** — https://www.skf.com/us/products/rolling-bearings/principles-of-rolling-bearing-selection/general-bearing-knowledge/bearing-basics/basic-bearing-designation-system | SKF says most rolling-bearing designations use a basic designation with optional prefixes and/or suffixes. | Establishes SKF designation structure only; not a PartSource parser, mapping, or cross-manufacturer rule. |
| O2 | SKF, **Internal clearance** — https://www.skf.com/us/products/rolling-bearings/principles-of-rolling-bearing-selection/general-bearing-knowledge/bearing-basics/internal-clearance | SKF says ISO defines clearance classes for many bearing types and SKF suffixes indicate clearance differing from Normal. | Shows that suffix state can change execution; it does not decode every suffix or establish suitability. |
| O3 | SKF, official product page, **6205-2RSH/C3HMTF7 — Deep groove ball bearings** — https://www.skf.com/tr/productinfo/productid-6205-2RSH/C3HMTF7 | An official manufacturer product page uses the complete designation as its product identity. | Used as an exact external identity probe only. No technical fields were ingested and no current production/lifecycle status is inferred from page existence. |
| O4 | NSK, official **6205 Series** page — https://www.oss.nsk.com/products/bearings/ball-bearings/deep-groove-ball-bearings/single-row-deep-groove-ball-bearings/6205-dgbb-sr.html | NSK identifies 6205 as a single-row deep-groove ball bearing with 25 mm bore, 52 mm outside diameter, and 15 mm width; the page distinguishes open, sealed, and shielded executions and names supplementary designation families. | One manufacturer's published series example; not an equivalence, replacement, or application selection. |
| O5 | NSK, official **6205DDUCM** product page — https://www.oss.nsk.com/products/bearings/ball-bearings/deep-groove-ball-bearings/single-row-deep-groove-ball-bearings/6205dducm-apn.html and NSK, **Bearing Designation Systems** (2024) — https://www.nsk.com/content/dam/nsk-marketing/projects-completed/literature/service/bearing-designation-systems_bochure/en_bearing-designation-systems_bochure/preview-pdf_bearing-designation-systems_bochure_en/EN_Bearing_Designation_Systems_BD_03_2024_low-res.pdf | NSK publishes a full product designation beyond the basic `6205`; its guide explains manufacturer/brand-specific supplementary designations and gives suffix examples. | Establishes that the full manufacturer code carries execution detail. It does not authorize a universal suffix dictionary or imply equivalence to another code. |
| O6 | Timken, **Timken Engineering Manual** — https://engineering.timken.com/wp-content/uploads/2023/07/Timken-Engineering-Manual.pdf | Timken states that application requirements such as fits, bearing setting, lubricant type, cage type, and flange arrangements are determined from speed, temperature, mounting, and loading conditions; it also describes suffix-designated internal geometries optimized for different performance. | Establishes condition-dependent selection and execution differences, not an answer for any PartSource case. |
| O7 | ISO, **ISO 15:2017, Rolling bearings — Radial bearings — Boundary dimensions — General plan** — https://www.iso.org/standard/69977.html; withdrawn **ISO 15:1981** record — https://www.iso.org/standard/3597.html | ISO 15:2017 specifies preferred boundary dimensions; ISO's older 1981 page is marked withdrawn. | Boundary dimensions and document lifecycle do not establish product identity, execution equality, or application suitability. |
| O8 | ISO, **ISO 281:2007, Rolling bearings — Dynamic load ratings and rating life** — https://www.iso.org/standard/38102.html | ISO separates dynamic load ratings/rating-life calculation from boundary dimensions. | Used only to establish that application/rating-life work is a different claim class; no calculation was performed. |

The source set is deliberately small and example-led. The task did not crawl related pages or acquire a manufacturer catalog.

## Repository contract inspected

The falsifier read the requested synthesis, category report, direct-study report, product contract, source register, and current domain definitions, including:

- `research/validation-targeted-ideation-synthesis-2026-08-09.md`;
- `research/validation-poc-scope-category-falsification-2026-08-09.md`;
- `research/empirical-engineer-recent-work-study-2026-08-09.md`;
- `research/empirical-fastener-truth-benchmark-2026-08-09.md`;
- `research/product-contract.md`;
- `research/data-source-register.md`;
- `research/validation-mechanical-data-model-2026-08-09.md`;
- `research/validation-trust-provenance-2026-08-09.md`;
- `research/validation-supplier-handoff-2026-08-09.md`;
- `supabase/migrations/20260809_configuration_catalog_contract.sql`;
- `web/src/lib/catalogApi.ts`;
- `web/src/lib/bomStorage.ts`; and
- `web/src/lib/unpublishedCrossReferenceCatalog.ts` (explicitly test-only/unpublished).

Relevant current-definition observations:

1. The authoritative product contract defines `Configuration` as a standards-defined combination and separately defines manufacturer part, supplier listing, offer, candidate, cross-reference, equivalent, and approved alternate (`research/product-contract.md:63-84`). This separation is useful.
2. The current catalog DTO is a flat fastener projection: `family`, `type`, identifiers, `thread`, `pitch`, `length`, `head`, `material`, `finish`, `drive`, `strength`, and `standard` (`web/src/lib/catalogApi.ts:3-27`; migration return shape at `20260809_configuration_catalog_contract.sql:47-69`).
3. `catalogResultToPart` hard-codes `Screws & Bolts`, fills absent values with `Unknown`/`N/A`, and translates every result into the fastener `Part` shape (`web/src/lib/catalogApi.ts:115-149`).
4. The supplier builder creates destinations from a `Part` configuration without a bearing target-type or suitability layer (`web/src/lib/catalogApi.ts:152-170`).
5. The unpublished canonical configuration requires nonempty fastener facts including thread, pitch, length, material, finish, drive, and standard before publication (`web/src/lib/unpublishedCrossReferenceCatalog.ts:25-31,144-158`). Its cross-reference targets a canonical configuration and carries manufacturer data only as an optional snapshot (`:69-85`).
6. The current BOM snapshot is McMaster/alternative-supplier shaped and stores a flat label/value `configurationFacts` list plus supplier destinations; it has no target-object type, bearing execution identity, application requirement, conditional fact, or manufacturer-lifecycle state (`web/src/lib/bomStorage.ts:9-21`).
7. The current SQL exact routes remain un-namespaced `reference_number`/`source_sku` branches with `LIMIT 1` (`20260809_configuration_catalog_contract.sql:98-119`).

These are inspected current artifacts, not production-change requests.

## Method and bounded desk probes

Each probe is a **research task state**, not a participant case and not a PartSource catalog record. The official examples test object boundaries; injected conflict/lifecycle/failure states test category-independent contract behavior. No probe asserts a bearing replacement.

The answer axes are kept separate:

- **Input state:** what clue or job was presented.
- **Identity state:** what object, if any, is uniquely identified.
- **Execution state:** whether complete manufacturer execution is preserved.
- **Application-selection state:** whether operating context supports selection.
- **Packet state:** what can be frozen honestly.
- **Handoff state:** source-direct, research-only, blocked, or not applicable.

### Probe D1 — full manufacturer designation

- **Desk input:** `SKF 6205-2RSH/C3HMTF7`, taken verbatim from O3.
- **Job:** decode/open a known designation, not select a bearing for an application.
- **Expected identity state:** candidate exact **SKF manufacturer product/execution**, subject to a scoped live/reviewed mapping; never an exact seller-neutral configuration merely because the official page exists.
- **Required behavior:** preserve every character; namespace as SKF; keep basic designation and all suffix text visible; retain source URL and observation date in the desk packet; leave unreviewed token meanings unresolved.
- **Required stop:** no alternate supplier, equivalent, replacement, life, fit, lubrication, or suitability conclusion.
- **Falsification result:** raw clue and typed namespaced mapping transfer. The fastener mapping target fails because a neutral configuration would erase or demote execution-bearing suffixes.

### Probe D2 — shared basic designation, different published executions

- **Desk inputs:** NSK `6205` (O4) and NSK `6205DDUCM` (O5); O4 also documents sealed/shielded supplementary designation families.
- **Job:** test whether basic dimensions/basic designation are sufficient for unique product selection.
- **Expected identity state:** the basic `6205` can route to a type/series/dimensional description in NSK context, while the full `6205DDUCM` targets a more specific NSK execution. They are not collapsed into one identity.
- **Required behavior:** preserve the suffix-bearing designation; keep boundary dimensions as facts scoped to their official record; represent seal/shield/clearance or unresolved supplementary code as execution facts, not decoration.
- **Required stop:** dimensions or shared basic digits cannot create an equivalence or replacement relation.
- **Falsification result:** family/category routing and normalized facts transfer, but `one row/configuration after filtering = selected part` fails. Product execution is an independent identity layer.

### Probe D3 — dimension-only research clue

- **Desk input:** the O4 boundary-dimension tuple `25 mm bore × 52 mm OD × 15 mm width`, with no manufacturer designation and no application context.
- **Job:** dimensional discovery only.
- **Expected identity state:** candidate set or unresolved requirement; identity cardinality is not one merely because one official example has those dimensions.
- **Required behavior:** preserve units and dimension roles; make category/type, manufacturer execution, seal/shield, clearance, tolerance, cage/lubrication and other execution fields missing or unevaluated rather than defaulted.
- **Required stop:** do not infer `6205`, a manufacturer, a product, interchangeability, or suitability.
- **Falsification result:** typed constraints and honest candidate/unknown states transfer. The fastener-style discrete facet funnel cannot promote dimensions to selection readiness.

### Probe D4 — application-selection request

- **Desk input:** task state `select a rolling bearing for an application`; no fabricated loads, speeds, temperatures, interfaces, life target, or arrangement are supplied.
- **Job:** application selection, not product decoding.
- **Expected identity state:** no product identity evaluated.
- **Conditional facts:** O6 makes fits, setting, lubricant, cage/flange arrangement dependent on speed, temperature, mounting and load; O8 treats rating life as a calculation domain. Bearing type/arrangement and interfaces determine which next facts matter.
- **Required behavior:** classify the job before category routing; list required operating-context groups as missing/conditional; send to manufacturer selection material or a bearing specialist without selecting.
- **Required stop:** PartSource performs no rating-life, speed, fit, clearance, lubrication, arrangement, or suitability calculation in this boundary.
- **Falsification result:** missingness and safe abstention transfer. A fixed required-field checklist and a static `complete configuration` predicate do not.

### Probe D5 — explicit designation/description conflict

- **Desk input:** injected contract state: a full designation asserted to be a sealed execution while adjacent user text asserts `open bearing`. This is not a real participant line and does not claim a fact about O3/O5.
- **Job:** conflict handling.
- **Expected identity state:** `conflict`; no winner.
- **Required behavior:** retain both assertions, scope the suffix interpretation to a reviewed manufacturer rule, and block selection/freeze only an issue packet.
- **Required stop:** no silent trust preference for designation, description, dimensions, or nearest record.
- **Falsification result:** conflict preservation is category-independent. A first-row/one-row result is unsafe.

### Probe D6 — lifecycle and source failure

- **Desk inputs:** (a) O7's real document-lifecycle contrast—ISO 15:1981 is withdrawn while ISO 15:2017 is a separate edition; (b) injected states `manufacturer mapping withdrawn/superseded` and `manufacturer source unavailable` with no claim that any cited bearing product is actually withdrawn.
- **Job:** test release, correction, withdrawal, and failure semantics.
- **Expected identity state:** a PartSource mapping/release may be active, superseded, withdrawn, outside-release, or unavailable independently of manufacturer product status; manufacturer lifecycle remains unknown unless separately evidenced.
- **Required behavior:** preserve old packet meaning; return bounded withdrawal/unavailable state; do not redirect to a nearby execution; do not turn a page failure into product absence.
- **Required stop:** no stale result, silent mapping mutation, availability claim, or substitute.
- **Falsification result:** immutable release/lifecycle operations transfer, but one lifecycle field on a neutral cross-reference does not represent source-document, PartSource-publication, mapping, manufacturer-product, and application-approval lifecycles simultaneously.

## Task-state falsification matrix

| State | Raw clue | Mapping/identity | Missing or conditional facts | Frozen packet | Supplier handoff | Suitability | Result |
|---|---|---|---|---|---|---|---|
| D1 full SKF designation | Preserve verbatim | SKF namespace → manufacturer product/execution candidate | Unreviewed suffix meanings and all application context remain unresolved | Exact-clue/external-identity research packet | Source-direct official page only; alternate blocked | Not evaluated | Kernel transfers; neutral-config target falsified |
| D2 NSK basic vs full execution | Preserve both separately | Basic series/description is not the same object as full execution | Execution details cannot be dropped | Two separate scoped identity observations | No cross-manufacturer or alternate handoff | Not evaluated | Product/execution layer required |
| D3 dimensions only | Preserve values, units, dimension roles | Candidate/unknown; no exact identity | Type, namespace, execution, tolerances, application all unresolved | Requirement/issue packet | Independent research only, with no match claim | Blocked | Flat completion/uniqueness falsified |
| D4 application selection | Preserve task and supplied context (none here) | No identity evaluated | Conditions and calculations are task-dependent | Unresolved application-requirement packet | Specialist/manufacturer-selection handoff only | Blocked inside PartSource | Fixed schema/selectability falsified |
| D5 explicit conflict | Preserve both claims | Conflict; choose neither | Conflict itself is blocking | Conflict packet | Blocked | Blocked | Conflict primitive transfers |
| D6 withdrawn/unavailable | Preserve clue and prior packet | Withdrawn/unavailable/outside-release are distinct | Manufacturer status may remain unknown | Historical packet plus current warning | Blocked except honest source retry | Not evaluated | Lifecycle/fail-closed transfer; lifecycle layers split |

## Primitive-by-primitive transfer test

| Requested primitive | Transfer result | Category-independent contract that survives | Bearing-specific addition or break |
|---|---|---|---|
| **Raw clue** | **Transfers** | Preserve exact input, context, punctuation, spacing, units, negation and every unknown token; transformations are additive and reversible. | Prefix/basic designation/suffix boundaries are manufacturer/category rules. Deleting or reordering an unknown suffix can change execution identity. |
| **Namespaced mapping** | **Transfers after target typing** | Namespace, supplied value, namespace-normalized key, cardinality, mapping revision/release, ambiguity/withdrawal state and target type remain first-class. | The safe target for a full bearing designation is often `manufacturer_product_execution`, not `canonical_configuration`. Namespace-less basic codes remain unresolved unless a reviewed rule says otherwise. |
| **Category schema** | **Transfers only as a scoped schema registry** | Category/job classification chooses the applicable interpretation contract; unsupported is a valid result. | Bearing decoding schema and bearing application-selection schema are different. Required questions depend on bearing type/arrangement, load, speed, temperature, interfaces, life, fit and lubrication; one universal completion list fails. |
| **Configuration / product execution** | **Does not transfer unchanged** | A seller-neutral technical description may exist as one target type. Product identity remains separate from supplier listing and offer. | Add a first-class manufacturer product/execution with complete designation and manufacturer-scoped facts. Do not demote it to provenance on a neutral configuration. Application-qualified selection is a third object, not a richer configuration. |
| **Missing / conditional facts** | **Transfers and expands** | Keep `not supplied`, `not understood`, `not applicable`, `not yet normalized`, `conflicting`, `withheld`, `outside release`, `withdrawn`, and `processing unavailable` separate. | Add `conditional/not evaluated`: the fact or calculation becomes applicable only after job/type/arrangement/conditions are known. Absence from a designation is not the same as Normal/default. |
| **Lifecycle** | **Transfers with multiple subjects** | Immutable PartSource release, mapping revision, correction, supersession, withdrawal, observed-at and source-unavailable states remain useful. | Separate source-document lifecycle, PartSource publication lifecycle, identifier-mapping lifecycle and manufacturer product/execution lifecycle. None proves the others. Application approval has its own organization/use scope and is outside this test. |
| **Frozen packet** | **Transfers after generalization** | Freeze raw clue, target type, mapping state, interpreted/unresolved facts, evidence/release identities, observation time, conflicts, limits and safe next action; never rewrite old meaning. | A valid bearing packet may freeze an exact manufacturer designation or unresolved application requirement. It need not and often must not freeze a neutral selected configuration. |
| **Supplier handoff** | **Transfers only as path separation and gating** | Source-direct identity opening, independent research, alternate-specification handoff and specialist handoff are distinct actions; failures and omitted facts remain visible. | For exact bearing execution, source-direct may survive. Alternate-supplier translation is blocked by default because neutralization can erase execution, while retaining manufacturer code can imply cross-reference/replacement. |
| **Suitability boundary** | **Transfers as a hard stop** | Identity, technical description, listing, equivalence, replacement, organizational approval and suitability are separate claims. | Loads, speeds, temperatures, arrangement, fits, clearance after mounting/temperature, lubrication, rating life and interfaces require bearing-specific evidence/calculation/review. PartSource does not perform that work here. |

## Exact breakpoints in the fastener configuration model

The unchanged model breaks at identifiable object and predicate boundaries, not merely because bearings need different columns.

### Break 1 — fixed fastener fields are structurally inapplicable

Current `CatalogSearchResult` and SQL return `thread`, `pitch`, `length`, `head`, `drive`, fastener `strength`, and `standard`. Bearings need none of thread/head/drive as a universal identity grammar, while they may need manufacturer designation, bearing type/design, boundary dimensions, tolerances, internal clearance, seals/shields, cage, lubricant/execution codes, load ratings and speed data. Adding nullable bearing columns would hide two incompatible semantics behind one `configuration` object.

**Exact failure:** `completeConfiguration()` in the unpublished contract requires nonempty thread, pitch, length, material, finish, drive and standard. A truthful rolling-bearing execution would either fail forever or receive fabricated `N/A` values. The current API already converts absence to `Unknown`/`N/A`, which collapses applicable absence, non-applicability and unevaluated conditional state.

### Break 2 — mapping target is wrong

The current conceptual identifier bridge maps a namespaced identifier to a neutral canonical configuration; manufacturer information is at most an optional snapshot on a cross-reference. O1–O5 show that full designation tokens can carry manufacturer execution detail.

**Exact failure:** mapping `SKF 6205-2RSH/C3HMTF7` directly to a neutral `6205 / 25 × 52 × 15`-style configuration would change the target object and can discard execution-bearing suffixes. The correct first target is the SKF product/execution scoped to manufacturer evidence. Any neutral description is a separate, lossy, reviewed projection—not identity and not equivalence.

### Break 3 — one required-field profile cannot mean both decoding and selection

Fastener validation proposes a family-specific checklist that can gate a bounded configuration handoff. D1/D2 only decode a designation/product execution. D4 is an application-selection task. O6/O8 establish that selection involves conditional operating facts and calculations.

**Exact failure:** a boolean such as `all required bearing fields present` cannot be defined without first naming the job. Completing catalog fields may identify an execution yet say nothing about life, fit, speed, lubrication or arrangement. Completing application inputs may still require calculation and expert judgment rather than selecting a catalog row.

### Break 4 — candidate cardinality cannot become readiness

The current exact SQL uses un-namespaced identifiers and `LIMIT 1`; broad filtering returns flat rows. D2/D3 show why one surviving dimensional/basic-designation row is not one product execution or one suitable bearing.

**Exact failure:** `result count = 1` conflates retrieval cardinality, identity cardinality, execution completeness and application suitability. These must be independent axes. Unknown namespace, suffix, release, conflict or application context forces abstention even when one row is retrieved.

### Break 5 — the frozen BOM object presupposes a selected alternative part/supplier

`BomSelectionSnapshot` requires `originalMcmasterNumber`, `alternativePartNumber`, `supplier`, description/material, flat configuration facts and supplier destinations.

**Exact failure:** a bearing integrity packet may legitimately contain only a preserved designation plus unresolved suffix, or only an application requirement plus missing operating conditions. Forcing `alternativePartNumber`/`supplier` either invents identity or makes the safe unresolved result unrepresentable. A generalized frozen packet must type its target and disposition before an optional BOM-selection snapshot exists.

### Break 6 — automatic supplier destination generation is too early

`buildSupplierSearchDestinations(part)` emits destinations for a flat `Part`. Bearings require path separation.

**Exact failure:** neutralizing D1 can erase manufacturer execution; retaining D1's exact manufacturer code in an alternate-supplier query can look like a replacement/cross-reference request. Therefore an exact identity does not automatically satisfy alternate-handoff gates. Source-direct opening and bearing-specialist/manufacturer-selection handoff are separate; alternate handoff remains blocked without explicit relationship evidence and a permitted task.

### Break 7 — lifecycle has the wrong subject granularity

The unpublished cross-reference model attaches one lifecycle record to a relationship; current catalog rows have no immutable release lifecycle. D6 shows separate source standard, mapping and publication lifecycle states.

**Exact failure:** one `current/withdrawn` flag cannot say whether the source document, PartSource mapping, PartSource release, manufacturer product/execution or application approval is current. A current PartSource snapshot must not imply current manufacture; a withdrawn mapping must not silently redirect; an old frozen packet must remain interpretable.

## Category-independent truth operations

These operations survive the bearing falsifier and are the maximum shared kernel supported by this desk evidence:

1. Preserve every raw clue and the supplied context before parsing.
2. Classify the job (`decode identity`, `describe product`, `discover candidates`, or `select for application`) before choosing a category workflow.
3. Use explicit namespace rules and typed mapping targets; expose zero/one/many/not-evaluated cardinality.
4. Keep supplied values, deterministic transformations, user choices, interpretations, unknown tokens, conflict and evidence scope separate.
5. Represent missingness, non-applicability, conditionality, outside-release, withdrawal and service failure as different states.
6. Track lifecycle by subject and freeze immutable publication/mapping identity.
7. Freeze a correction-aware identity, requirement, configuration or issue packet without forcing resolution.
8. Fail closed on conflict, ambiguity, missing critical evidence, withdrawn mapping and processing failure.
9. Separate source-direct, alternate-research and specialist/application-selection handoffs.
10. State beside every output that identity/description does not establish listing, equivalence, replacement, approval or suitability.

These are truth-handling operations, not evidence of a cross-category product.

## Bearing-specific identity and application selection

### Identity / product execution

A bearing identity workflow needs domain-reviewed, manufacturer-scoped rules for:

- manufacturer/brand namespace;
- exact complete designation and raw typography;
- basic designation, prefixes, suffixes and unresolved tokens;
- bearing type/design and dimensional series;
- boundary dimensions and tolerances;
- internal clearance designation;
- seal/shield state;
- cage, lubricant, material/heat treatment and special-execution codes where designated;
- manufacturer product/execution revision and lifecycle evidence; and
- explicit mapping to any seller-neutral description as a separate reviewed relationship.

O1–O5 support only the need for these distinctions, not a complete schema or parser.

### Application selection

A bearing application-selection workflow is a different engineering job. O6 and O8 establish the need to consider or calculate condition-dependent items including:

- performance target and rating life;
- loads and load direction/duty;
- speed and operating temperature;
- bearing type and arrangement;
- shaft/housing interfaces and fits;
- internal clearance under mounting/temperature conditions;
- lubrication and sealing environment;
- mounting/setting/flange/cage decisions; and
- manufacturer-specific limits and specialist review.

This report performs none of those calculations and makes no recommendation. The safe PartSource result is an application-requirement packet and a stop/handoff, not a selected product.

## Findings classified with all eight required labels

### Evidence

- Official SKF and NSK sources use complete manufacturer designations containing more than a basic designation; the manufacturers publish supplementary/suffix semantics and distinct product pages.
- NSK's official 6205 example supplies boundary dimensions while also distinguishing open, sealed and shielded executions. Boundary dimensions therefore do not exhaust execution identity.
- Timken's official manual and ISO 281 separate application conditions/rating-life work from dimensional identification.
- ISO's withdrawn 1981 and later 2017 ISO 15 records demonstrate that evidence/reference lifecycle is meaningful and must be versioned.
- Repository inspection shows a flat fastener DTO, a fastener-only completeness predicate, an un-namespaced `LIMIT 1` exact route, a McMaster/alternative-shaped BOM snapshot and automatic configuration-to-supplier destinations.
- No participant or participant-supplied bearing case exists; this result is domain/contract evidence only.

### Fundamental requirement

- Add no bearing data or claim. Before any future bearing identity work, distinguish raw clue, manufacturer namespace, mapping target, seller-neutral description, manufacturer product/execution and application requirement.
- Preserve complete designation text and unknown suffixes; an unknown token blocks unique execution mapping rather than disappearing.
- Keep identity cardinality, execution completeness and application selectability as separate axes.
- Model conditional/not-evaluated facts separately from not supplied and not applicable.
- Freeze unresolved identity/application packets without requiring an alternative part, supplier or selected configuration.
- Block equivalence, replacement, alternate-supplier and suitability inferences absent explicit permitted evidence and domain review.

### Strong hypothesis

- The durable cross-category kernel is a typed, correction-aware specification-integrity workflow rather than a universal configuration catalog.
- A manufacturer-execution packet may add value between an opaque line and the original manufacturer/specialist, but only a direct participant case can test whether it changes a real next action.
- Job-first routing (`decode`, `describe`, `discover`, `select`) is more important for bearings than family-first browsing.

### Opportunity / gold idea

- Make `target_object` mandatory in every packet: `manufacturer_product_execution`, `seller_neutral_description`, `application_requirement`, `configuration`, or `unresolved_clue`.
- Make conditional fact groups first-class: show which job decision makes each group applicable and which external calculation/reviewer owns it.
- Allow a frozen unresolved packet to be the successful output, with source-direct or specialist handoff rather than a supplier click.

### Nice-to-have

- After source permission and domain review only: designation-token explanations, correction diffs for manufacturer execution mappings, and links to official manufacturer selection tools that transmit only user-approved raw requirements and make no result claim.
- A print-safe identity/issue packet and differences-only view could be tested after safety comprehension passes.

### Open question

- Does one real engineer find an integrity packet useful, or is opening the manufacturer's source/asking a bearing specialist always the same or better next action?
- Which exact designation tokens and lifecycle facts can a sanctioned source support without copying a manufacturer catalog?
- Can a recipient understand an unresolved packet without treating common boundary dimensions or a basic designation as interchangeability?
- Is there any bounded bearing identity task worth supporting independently of application selection?

### Risk

- Neutralization can erase manufacturer execution; retaining the manufacturer code in alternate search can imply cross-reference/replacement.
- A fixed bearing required-field list can hide that decoding and application selection are different jobs.
- `Unknown`/`N/A` can conceal not applicable, missing, unparsed, conditional and not evaluated states.
- A polished official example can create category/platform theatre while testing only a hand-picked designation.
- Manufacturer page availability can be mistaken for current manufacture or supplier availability.
- A single future participant case can falsify safety but cannot validate coverage or a platform.

### Rejected

- Bearings in the current catalog, schema, release or POC.
- Adding nullable bearing fields to the fastener table or treating opaque category JSON as generalization.
- `basic designation/boundary dimensions → neutral configuration → alternate supplier` as an automatic path.
- Cross-manufacturer equivalence or replacement from dimensions, designation similarity or suffix translation.
- Bearing life, fit, clearance, lubrication, speed, arrangement or suitability recommendations.
- Calling this desk execution direct-user, empirical participant, category-validation, product-validation or platform evidence.
- Production edits, `/to-spec`, category ingestion and platform positioning from this result.

## Required direct participant case still missing

The remaining empirical requirement is **one participant-supplied, safely redacted recent rolling-bearing case** inside a qualifying moderated session—not an official product example and not a moderator-created fixture.

Minimum case requirements:

1. A consenting practicing engineer or bearing specialist personally handled the case in the last three months.
2. The case is either identification/replacement research or application selection and includes one exact redacted line/designation plus only the minimum nonconfidential context the participant is permitted to share.
3. An independent bearing-domain reviewer freezes an answer key before the session, including every prefix/basic designation/suffix token, claimed namespace, supported manufacturer product/execution, seller-neutral facts, unresolved tokens, application facts/calculations still needed, safe endpoint and prohibited inferences.
4. Observe the participant's normal workflow first, then review a manual PartSource-style packet containing preserved line, namespace, interpreted/unresolved facts, typed target object, evidence boundary and safe next action.
5. Record whether the packet changes the real next action or merely adds a step before the manufacturer/specialist; test recipient comprehension if permitted.
6. Do not recommend a replacement, calculate suitability, open alternate-supplier handoffs, retain the artifact, or ingest the designation without separate permission.

Required safety kill: any dropped meaning-changing token, confident wrong unique product/execution, or induced belief in equivalence/replacement/suitability falsifies the proposed shared workflow. A non-kill single case only keeps further research open; it does not validate bearings or a platform.

## Constraints and non-claims

- No official manufacturer example is a PartSource catalog fact.
- No source listed here was added to or approved in the data-source register.
- No cited product page is evidence of price, stock, supplier listing, availability, continued manufacture or application fitness.
- No comparison in this report asserts that two bearings are interchangeable or equivalent.
- No rating, tolerance, suffix table, or catalog dataset was ingested.
- No production behavior was changed or verified for bearings.
- No platform, market, demand, time-saving, reuse or willingness-to-pay claim follows.
- This report authorizes neither `/to-spec` nor category expansion.

## Final falsification decision

**Unchanged fastener configuration model: FALSIFIED for rolling bearings.** The first hard break is the identifier target: a full bearing designation maps, when supported, to a manufacturer product/execution rather than directly to a seller-neutral configuration. The second is the completion predicate: product decoding and application selection require different schemas and stopping rules. The third is handoff: exact identity does not authorize neutral alternate sourcing. The fourth is lifecycle: publication, mapping, source and manufacturer-product status are distinct.

**Shared truth-operation kernel: NOT FALSIFIED by this desk test, but unvalidated with users.** Preserve, namespace, type targets, expose missing/conflicting/conditional facts, freeze, version, fail closed and stop before unsupported claims. Retain that kernel only as a research contract. Run the missing participant-supplied case before any bearing ingestion, prototype, `/to-spec`, or broader claim.
