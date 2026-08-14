# PartSource Progressive Catalog POC — Technical Specification

**Status:** Spec-ready post-POC UX delta; current POC remains locally implemented and verification complete
**Date:** 2026-08-12
**Deliverable:** Local synthetic POC and technical specification
**Implementation:** Complete locally; no deployment, publication, outreach, production authorization, implementation tickets, or code-change authorization

## Authority

This specification translates approved product decisions into an implementation-ready technical contract. It does not change product direction.

Authority order:

1. `research/product-contract.md` — sole behavioral authority.
2. `research/prd.md` — product requirements.
3. `SPEC_CONFIRMATION.md` — concise approved behavior.
4. `CONTEXT.md` — domain language.
5. `research/data-source-register.md` — source-permission gate.
6. `.wayfinder/poc-ship/tickets/31-resolve-progressive-catalog-poc-definition.md` — approved POC data, family, schema, benchmark, and detail decisions.
7. `.wayfinder/poc-ship/poc-ship-map.md` — planning index and current frontier.
8. `.wayfinder/poc-ship/exact-identifier-recovery-spec-delta-gate-2026-08-12.md` — approved post-POC UX decision gate for exact identifier recovery, deterministic interpretation trace, family-specific typed filters, unit and terminology truth, strict exact-ID states, record/fact provenance, and comparison-ready rows.

If this specification conflicts with the product contract, the product contract wins. Historical research, prototypes, current runtime behavior, and existing tests are implementation evidence only.

## Problem Statement

An engineer may know only a broad component name, some dimensions, material, finish, or an exact identifier. The current runtime sends searches to isolated part views, uses fuzzy and fallback behavior, and exposes legacy BOM, supplier, standards, and provenance concepts. That runtime does not implement the approved product contract.

The current POC proves one deterministic flow:

`query → catalog level → family → filters → result list`

The user must always see where they are in the catalog, which supported filters are active, which records remain, and whether an exact identifier has one, zero, or multiple mappings. Search may highlight one unique exact match. Only the user may select a row and open detail.

The next spec-ready UX focus is exact identifier recovery and confirmation. An engineer can enter an exact identifier as the query, see the deterministic identifier state, inspect why PartSource stopped where it stopped, and confirm the mapped catalog record without losing catalog context.

The POC must prove this behavior without using blocked source data, copied supplier records, runtime AI, or unsupported engineering claims.

## Solution

Build one progressive catalog workspace backed by a static, blank-slate synthetic bundle.

The workspace:

- starts at the Screws catalog level;
- resolves submitted text to the deepest supported catalog level;
- parses only approved terms into typed filters;
- applies exact, AND-only filtering;
- preserves the original query;
- keeps hierarchy, family, filters, result count, and result list visible;
- resolves exact identifiers by namespace and cardinality;
- shows a deterministic interpretation trace after each submitted query;
- keeps family-specific typed filters visible and deterministic;
- shows unit, terminology, and length-datum truth for the selected POC families;
- highlights one unique exact match without selecting it;
- opens detail only after explicit row activation;
- restores catalog state after detail closes;
- fails closed for conflicts, unsupported constraints, absent IDs, non-unique IDs, invalid selected states, and unavailable catalog data;
- labels all fixture facts and identifier mappings as synthetic.

The completed POC is release evidence. This post-POC UX delta updates the specification only. It does not reopen POC implementation tickets and does not authorize code changes.

The POC runs entirely from one validated local bundle. It makes no catalog API call and does not use the legacy Supabase catalog, CSV generators, import scripts, decoder fallbacks, isolated part routes, or supplier/BOM flows.

## User Stories

1. As an engineer, I want to submit `screws`, so that I can see the broad Screws catalog and all POC records.
2. As an engineer, I want a family query to open the matching family, so that I do not need to understand the internal hierarchy first.
3. As an engineer, I want supported dimensions and materials to become visible filters, so that I can inspect how my query was interpreted.
4. As an engineer, I want the original query preserved, so that normalized fields never replace what I entered.
5. As an engineer, I want the full active catalog path visible, so that I understand the scope of the result list.
6. As an engineer, I want filters to narrow the current result list deterministically, so that the same state always returns the same records.
7. As an engineer, I want to add and remove filters, so that I can broaden or narrow the current family without starting over.
8. As an engineer, I want query-derived filters to remain removable, so that I retain control over the active list while the original query remains preserved.
9. As an engineer, I want one-result text searches to remain unselected, so that result count is never mistaken for my decision.
10. As an engineer, I want zero-result states to retain family and filters, so that I can see which constraints produced zero records.
11. As an engineer, I want conflicting values shown explicitly, so that the system never silently chooses one.
12. As an engineer, I want unsupported constraints shown explicitly, so that the system never presents records that appear to satisfy them.
13. As an engineer, I want unknown terms preserved, so that I can see what PartSource did not understand.
14. As an engineer, I want an exact synthetic ID to open its family list and highlight its record, so that identity lookup does not destroy catalog context.
15. As an engineer, I want absent exact IDs to highlight nothing, so that absence is not converted into a guess.
16. As an engineer, I want non-unique exact IDs to highlight nothing, so that collision handling never chooses the first mapping.
17. As an engineer, I want exact identifier recovery to show a strict `unique`, `unknown`, or `non_unique` state, so that I know whether the identifier is supported, absent, or unsafe to choose.
18. As an engineer, I want the interpretation trace to show recognized terms, active filters, unsupported terms, conflicts, exact-ID state, and stop reason, so that I can confirm what PartSource did without trusting a black box.
19. As an engineer, I want filter options to show only valid typed values and remove or disable impossible values, so that I cannot accidentally use a hidden or unsupported constraint.
20. As an engineer, I want active constraints to stay visible, so that smart filters never change meaning silently.
21. As an engineer, I want unit, datum, and terminology truth for the current families, so that under-head length, overall length, pitch, material, and finish are not silently merged.
22. As an engineer, I want every catalog record, relevant fact, and identifier mapping to carry source or origin, so that provenance stays attached to what it supports.
23. As an engineer, I want comparison-ready result rows, so that I can do first-pass inspection without a separate compare mode.
24. As an engineer, I want highlight and selection to look different, so that I can distinguish system identity evidence from my action.
25. As an engineer, I want to activate any visible row, so that I can inspect its detail.
26. As an engineer, I want to select a row other than an exact highlighted row, so that the highlight remains evidence rather than a forced choice.
27. As an engineer, I want detail to open inside the catalog workspace, so that I retain hierarchy, filters, result list, and exact-match context.
28. As an engineer, I want Close and browser Back to restore my exact catalog state, so that inspecting detail is reversible.
29. As a mobile user, I want a full-height detail layer that returns me to the same list position, so that narrow-screen inspection does not reset my work.
30. As a keyboard user, I want to submit, filter, activate rows, inspect detail, and close detail without a pointer, so that the POC is operable by keyboard.
31. As a keyboard user, I want focus returned to the activated row after detail closes, so that I do not lose my position.
32. As an engineer, I want every displayed fact and identifier mapping labeled synthetic, so that I do not mistake fixture data for engineering or supplier truth.
33. As an engineer, I want length labels to state their datum, so that under-head and overall lengths are not conflated.
34. As an engineer, I want a direct URL to recreate the same safe catalog state, so that refresh and sharing do not change meaning.
35. As an engineer, I want invalid URL state to fail closed, so that hand-edited links cannot create unsupported selection or filters.
36. As a maintainer, I want the bundle rejected when schema, identity, mapping, count, or provenance rules fail, so that invalid fixture data cannot reach the UI.
37. As a maintainer, I want one pure resolution boundary for query, filters, identity, and selection state, so that behavior can be verified without testing implementation details.
38. As a maintainer, I want the approved benchmark, browser tests, adversarial cases, and proxy-evidence gate to pass before implementation changes, so that the post-POC UX delta remains deterministic and safe without claiming qualified approval.
39. As a product owner, I want prohibited claims and controls absent from rendered output, so that the POC cannot imply approval, suitability, supply, procurement, or equivalence.

## Implementation Decisions

### 1. Runtime architecture

Use a client-only deterministic architecture for this POC.

Logical modules:

1. **Fixture bundle** — manifest, family metadata, 30 catalog records, and 32 identifier mappings.
2. **Bundle validator** — validates the complete fixture before it becomes available to the resolver.
3. **Query interpreter** — converts supported query terms into typed recognized values, conflicts, and unsupported terms.
4. **Catalog resolver** — combines query interpretation, URL state, filters, identity cardinality, catalog hierarchy, ordering, highlight, and selection into one catalog view model.
5. **URL-state adapter** — serializes and hydrates catalog state without owning domain decisions.
6. **Catalog workspace** — renders search, context, filters, list, status, highlight, and selection from the view model.
7. **Detail surface** — renders the selected record without replacing the catalog workspace.
8. **Boundary guard** — checks fixture fields and rendered product copy for prohibited data and claims.

No module may infer technical facts from display strings. Parsing and filtering operate on typed values only.

No runtime module calls an LLM, agent, source adapter, catalog API, database, supplier site, analytics service, or external search endpoint.

### 2. Primary behavioral seam

Use one primary domain seam:

- Input: validated bundle, original query, explicit URL filter state, and optional selected record ID.
- Output: one complete catalog view model.

The view model contains:

- original query;
- deterministic interpretation trace;
- current catalog path;
- resolved family, when safe;
- recognized typed values;
- conflicts;
- unsupported terms;
- active filters;
- available valid filter values and removed or disabled impossible values;
- ordered result records;
- exact identifier state: `unique`, `unknown`, `non_unique`, or none;
- exact identifier mapping evidence, when safe;
- highlighted record ID, when uniquely supported;
- selected record ID, when valid;
- detail-open state;
- user-facing state code;
- deterministic stop reason;
- record, fact, and identifier-mapping provenance notices.

The UI consumes this result. It does not repeat parsing, matching, collision, or selection-validity logic.

### 2A. Deterministic interpretation trace

Every submitted query produces an interpretation trace in the view model and UI.

The trace can show only:

- original query;
- recognized identifier or terms;
- catalog level;
- family;
- active typed filters;
- unsupported terms;
- conflicts;
- exact identifier state;
- stop reason;
- provenance reference for the relevant catalog record, fact, or identifier mapping.

The trace uses factual labels only:

- Recognized;
- Applied;
- Unsupported;
- Conflict;
- Identifier state;
- Stopped because.

The trace must not include AI explanation, confidence score, best match, recommendation, inferred suitability, fuzzy recovery, or implementation internals.

The trace can be inline or collapsible. It must remain keyboard reachable and accessible.

### 3. POC bundle

Bundle identity: `PS-POC-SYNTHETIC-V1`.

The bundle manifest requires:

| Field | Requirement |
|---|---|
| Bundle ID | `PS-POC-SYNTHETIC-V1` |
| Version | `1` |
| Authoring date | `2026-08-11` |
| Origin | `blank_slate_synthetic` |
| Allowed use | Local PartSource POC and deterministic acceptance benchmark only |
| Fact provenance | `synthetic_fixture` |
| Mapping provenance | `synthetic_identifier` |
| Record count | 30 |
| Mapping count | 32 |
| Visible notice | `Synthetic POC data — not an engineering reference or supplier listing.` |

The fixture authoring path must not read, import, transform, sample, compare, or validate against:

- the three blocked CSV files;
- generated catalogs made from those files;
- database rows imported from those files;
- tests, caches, titles, source SKUs, standards, mappings, or descriptions derived from those files.

The fixture contains no external identifier, source SKU, supplier name, source URL, copied title, standard, strength, tolerance, certification, price, stock, availability, or suitability field.

### 4. Catalog hierarchy and family metadata

Hierarchy:

`Screws → Hex-socket screws → family`

Families:

| Family ID | Display name | Head profile | Length datum | Family metadata |
|---|---|---|---|---|
| `shcs` | Socket-head cap screws | `cylindrical` | `under_head` | Internal hex drive; metric right-hand coarse thread; `countersink_angle_deg = null` |
| `bhss` | Button-head socket screws | `button` | `under_head` | No flange or collar; internal hex drive; metric right-hand coarse thread; `countersink_angle_deg = null` |
| `css` | Countersunk socket screws | `countersunk_90` | `overall` | Flat synthetic countersink; internal hex drive; metric right-hand coarse thread; `countersink_angle_deg = 90` |

Low-profile, ultra-low, flange, collar, raised-countersunk, shoulder, set, captive, self-tapping, self-drilling, wood, sheet-metal, imperial, external-hex, slot, cross-recess, and hexalobular forms are outside the family set.

### 5. Catalog-record schema

Every record requires:

| Field | Type | Rules |
|---|---|---|
| `record_id` | String | Immutable; unique in bundle; internal PartSource identity |
| `family_id` | Enum | `shcs`, `bhss`, or `css` |
| `thread_system` | Enum | `metric` only |
| `nominal_diameter_mm` | Number | Positive; one of 4, 5, 6, 8 |
| `pitch_mm` | Number | Positive; one of 0.7, 0.8, 1.0, 1.25; must match the approved tuple |
| `length_mm` | Number | Positive; approved tuple value only |
| `length_datum` | Enum | Must match family metadata |
| `material` | Enum | `a2_stainless` or `alloy_steel` |
| `finish` | Enum | `passivated` or `black_oxide` |
| `drive` | Enum | `internal_hex` only |
| `head_profile` | Enum | Must match family metadata |
| `provenance_bundle_id` | String | `PS-POC-SYNTHETIC-V1` only |
| `provenance_kind` | Enum | `synthetic_fixture` only |

Display names and formatted dimensions are derived from typed fields. They are not stored as technical facts.

### 5A. Unit and terminology truth for current families

The selected POC families must define unit and terminology truth before PartSource adds more families.

For every displayed typed field used in query interpretation, filters, result rows, or detail, define:

- original value, when from query or source;
- normalized value;
- unit;
- relation type;
- datum;
- family applicability.

Current POC units are metric only. Current POC relation type is exact only.

| Typed field | Unit | Relation type | Datum | Family applicability | Accepted query forms | Unsupported examples |
|---|---|---|---|---|---|---|
| `nominal_diameter_mm` | mm | exact nominal | thread nominal diameter | `shcs`, `bhss`, `css` | `M4`, `M5`, `M6`, `M8` | bare `4`, inch diameter, actual diameter |
| `pitch_mm` | mm | exact nominal | thread pitch | `shcs`, `bhss`, `css` | explicit approved metric pitch values | unsupported pitch, inch pitch, standard thread classes |
| `length_mm` | mm | exact nominal | family `length_datum` | `shcs`, `bhss`, `css` | explicit number followed by `mm` | bare number, inch length, ranges, tolerance |
| `material` | none | exact categorical | declared material label | `shcs`, `bhss`, `css` | `stainless`, `A2`, `A2 stainless`, `alloy steel` | titanium, brass, strength class |
| `finish` | none | exact categorical | declared finish label | `shcs`, `bhss`, `css` | `passivated`, `black oxide` | coating not in corpus, certification |
| `drive` | none | exact categorical | drive type | `shcs`, `bhss`, `css` | displayed fact only | drive filter, external hex, slot, cross recess |
| `head_profile` | none | exact categorical | family head profile | family-specific | displayed fact only | head-profile filter outside supported family |

Length datum by family:

- `shcs`: under-head;
- `bhss`: under-head;
- `css`: overall.

Do not silently merge:

- under-head and overall length;
- nominal and actual values;
- metric and inch units;
- pitch and length;
- material and finish.

Unsupported units or terms remain unsupported. No silent unit conversion is allowed.

### 6. Identifier-mapping schema

Every mapping requires:

| Field | Type | Rules |
|---|---|---|
| `mapping_id` | String | Unique in bundle |
| `namespace` | Enum | `partsource_synthetic_v1` only |
| `identifier_value` | String | Non-empty; normalized only by trim and ASCII case-fold |
| `record_id` | String | Must reference one existing catalog record |
| `provenance_bundle_id` | String | `PS-POC-SYNTHETIC-V1` only |
| `provenance_kind` | Enum | `synthetic_identifier` only |

Record identity and identifier identity remain separate.

### 7. Exact corpus

Create the same ten typed tuples in each of the three families:

| Tuple | Diameter | Pitch | Length | Material | Finish |
|---|---:|---:|---:|---|---|
| 01 | M4 | 0.7 mm | 12 mm | A2 stainless | passivated |
| 02 | M4 | 0.7 mm | 20 mm | alloy steel | black oxide |
| 03 | M5 | 0.8 mm | 16 mm | A2 stainless | passivated |
| 04 | M5 | 0.8 mm | 25 mm | alloy steel | black oxide |
| 05 | M6 | 1.0 mm | 16 mm | A2 stainless | passivated |
| 06 | M6 | 1.0 mm | 20 mm | A2 stainless | passivated |
| 07 | M6 | 1.0 mm | 30 mm | alloy steel | black oxide |
| 08 | M8 | 1.25 mm | 20 mm | A2 stainless | passivated |
| 09 | M8 | 1.25 mm | 30 mm | alloy steel | black oxide |
| 10 | M8 | 1.25 mm | 40 mm | A2 stainless | passivated |

Record IDs:

- `synrec-v1-shcs-01` through `synrec-v1-shcs-10`;
- `synrec-v1-bhss-01` through `synrec-v1-bhss-10`;
- `synrec-v1-css-01` through `synrec-v1-css-10`.

Unique exact IDs:

- `PSYN-SCR-0001` through `PSYN-SCR-0030`;
- assign 0001–0010 to `shcs`, 0011–0020 to `bhss`, and 0021–0030 to `css`;
- within each family, assign in tuple order 01–10.

Collision mapping:

- `PSYN-SCR-COLLIDE` maps to `synrec-v1-shcs-06` and `synrec-v1-bhss-06`;
- both records also retain their unique exact IDs.

### 8. Bundle validation

Reject the complete bundle before rendering any catalog record when any condition fails:

- bundle ID, version, authoring date, origin, allowed use, or visible notice differs from the manifest contract;
- record count is not 30;
- mapping count is not 32;
- family count is not three;
- a required field is absent or an unknown field is present;
- a value has the wrong type, is non-finite, or is outside its enum;
- a record ID or mapping ID is duplicated;
- a mapping references an absent record;
- a family-fixed field differs from its family metadata;
- `countersink_angle_deg` is not numeric 90 for `css` or is not null for the other families;
- the 10 approved tuples are not present exactly once in every family;
- the 30 unique exact IDs do not map one-to-one to the approved records;
- the deliberate collision does not map to exactly the two approved records;
- another normalized identifier collision exists;
- provenance is missing or differs from the approved synthetic values;
- a prohibited supplier, source, standard, strength, commercial, suitability, or equivalence field appears.

Bundle failure produces `catalog_unavailable`. It renders no records, filters, highlight, selection, or detail.

### 9. Query submission

- Initial load shows the search form, synthetic-data notice, and Screws root context. It has no catalog resolution, filters, result list, highlight, selection, or detail until the user submits a query.
- Search executes only on form submission by Search button or Enter.
- Do not provide typeahead results, fuzzy suggestions, automatic correction, or a first-result action.
- Preserve the submitted query exactly for display and URL serialization.
- Trim and collapse whitespace only for interpretation.
- A new query clears prior user filter overrides and selection, then derives a fresh catalog state.

### 10. Text-query interpretation

Interpretation order:

1. Detect exact-ID mode only when the whole trimmed query matches `PSYN-SCR-` followed by exactly four ASCII digits, or equals `PSYN-SCR-COLLIDE`, using ASCII case-insensitive comparison.
2. Otherwise treat the input as text.
3. Case-fold recognized text.
4. Normalize hyphens to spaces for text interpretation only.
5. Normalize singular/plural `screw` and `screws`.
6. Resolve one supported family alias, if present.
7. Parse supported diameter, pitch, length, material, and finish values.
8. Detect multiple different values for the same field as conflict.
9. Preserve every unmatched constraint as unsupported text.
10. Produce no inferred value.

Supported family aliases:

| Input | Family |
|---|---|
| `socket head screw` or `socket head screws` | `shcs` |
| `socket head cap screw` or `socket head cap screws` | `shcs` |
| `button head screw` or `button head screws` | `bhss` |
| `button head socket screw` or `button head socket screws` | `bhss` |
| `countersunk screw` or `countersunk screws` | `css` |
| `countersunk socket screw` or `countersunk socket screws` | `css` |

Supported typed terms:

- diameter: `M4`, `M5`, `M6`, `M8`;
- explicit metric pitch from the approved corpus;
- explicit length followed by `mm`;
- `stainless`, `A2`, or `A2 stainless` → `a2_stainless`;
- `alloy steel` → `alloy_steel`;
- `passivated` → `passivated`;
- `black oxide` → `black_oxide`.

A bare number is not a dimension. Inch input, ranges, OR, negation, typos, standards, strength, other materials, other finishes, and other drive terms are unsupported.

### 11. Catalog depth

- The submitted query `screws` resolves to Screws. Before any submission, the resolver remains in `initial`.
- A supported family alias resolves to that family.
- Supported field values without a family remain at Screws and filter records across all three families.
- A family context always displays the full path through Hex-socket screws.
- The hierarchy is context, not a separate isolated page.
- The POC does not infer a family from diameter, material, finish, result count, or exact-one non-ID result.

Catalog depth selected by an exact identifier follows the strict exact-ID state table in [14. Exact-identifier resolution](#14-exact-identifier-resolution). Unknown and non-unique identifiers keep the Screws root context and do not infer family context.

### 12. Filters

Supported filters:

- family;
- nominal diameter;
- pitch;
- length;
- material;
- finish.

Rules:

- Filters use exact typed equality.
- Active filters combine with AND.
- No range, fuzzy, substring, OR, or negation matching.
- Query-derived and user-applied filters share one visible active-filter set.
- At the Screws level, family is available as a filter.
- Applying a family filter at the Screws level moves the catalog context to that family; removing that family filter returns the context to Screws.
- Inside a family, family is fixed by context and is not shown as a duplicate filter control.
- Drive and head profile are displayed facts, not filter controls.
- Available controls show values valid for the current catalog scope. They do not show inferred values or result-count promises.
- Filter controls may remove or disable impossible values, but only from the current typed result set and active family schema.
- Active constraints are always visible. Smart-filter behavior must never hide constraints silently.
- Filter controls must not auto-drop constraints, auto-broaden a query, infer missing values, rank values by guessed intent, or use AI or agentic filtering.
- Applying a valid combination with no matching tuple produces a safe zero-result list.
- Removing a filter updates the list synchronously and preserves query text and catalog context.
- If a query-derived filter is removed, the URL's explicit active-filter state becomes authoritative for that history entry. The preserved query remains unchanged.

### 13. Result ordering and rows

Order records by:

1. family order: `shcs`, `bhss`, `css`;
2. nominal diameter ascending;
3. length ascending;
4. material enum order: `a2_stainless`, then `alloy_steel`;
5. record ID ascending.

The POC renders all records in the resolved list. It does not paginate, virtualize, rank, or cap results.

Every result row displays:

- synthetic exact ID;
- family;
- nominal thread and pitch;
- length with datum label;
- material;
- finish;
- drive;
- head profile;
- record origin/source provenance;
- relevant displayed fact provenance;
- identifier-mapping provenance when the row has a supported exact synthetic ID;
- `Synthetic POC fixture` provenance label.

A result row is an activation control and a comparison-ready catalog record. It is not an approval, recommendation, supplier listing, equivalent, replacement, or selection until activated.

The row field set exists for first-pass inspection only. It does not create a separate compare mode, shortlist, favorite, cart, BOM, export, or comparison workspace.

A one-row non-exact result still does not highlight, select, or open detail.

### 14. Exact-identifier resolution

Identifier normalization is namespace-specific:

- trim leading and trailing whitespace;
- ASCII case-fold;
- preserve hyphens and all other punctuation;
- do not remove internal whitespace or punctuation;
- do not route partial identifiers to exact-ID mode.

Strict exact-ID states:

| State | Mapping count | Catalog context | Result list | Highlight | Selection/detail |
|---|---:|---|---|---|---|
| `unique` | 1 | mapped family | full family list | mapped catalog record | user action only |
| `unknown` | 0 | Screws root | none | none | none |
| `non_unique` | More than 1 | Screws root | none; mapping evidence only | none | none |

State behavior:

- `unique`: resolve the mapped family, show its complete 10-record list, scroll the mapped row into view, and highlight it. Do not select or open detail.
- `unknown`: preserve query, keep the Screws root path visible, show exact ID not found, infer no family, show no list, and highlight/select nothing.
- `non_unique`: preserve query, keep the Screws root path visible, show a non-unique mapping state and mapping evidence, narrow to no family, show no catalog result list, and highlight/select nothing. Never choose the first mapping.

Mapping evidence in the non-unique state may show the synthetic namespace, mapping count, mapped record IDs, and their families. It must not present either mapping as selected, preferred, approved, or equivalent.

Exact identifier plus extra text is not exact-ID mode. Example: `PSYN-SCR-0006 extra` is processed as text. It must not trigger fuzzy exact-ID recovery.

### 15. Catalog state codes

The resolver returns one state code:

| State | Required visible behavior |
|---|---|
| `initial` | Search form, synthetic notice, and Screws root context; no resolved list or derived state |
| `catalog_list` | Safe catalog path, filters, count, and ordered list |
| `catalog_empty` | Safe path and filters with zero matching rows |
| `query_conflict` | Deepest safe context and conflicting values; no result list |
| `query_unsupported` | Deepest safe context, recognized values, and unsupported terms; no result list |
| `exact_not_found` | Screws root path, original ID, and not-found message; no inferred family or result list |
| `exact_non_unique` | Screws root path, original ID, and mapping evidence; no family narrowing or result list |
| `catalog_unavailable` | Catalog unavailable notice; no records or derived state |
| `invalid_selection` | Safe catalog state plus invalid-selection notice; no detail |
| `invalid_url_state` | Safe root context plus every rejected URL field; no filters, result list, highlight, selection, or detail |

No unsafe state may contain a highlighted or selected record.

### 16. Highlight and selection

- Highlight exists only for one supported unique exact-ID mapping.
- Highlight is derived from the original exact-ID query. It is not stored as user selection.
- A unique exact-ID query does not open detail.
- A one-row non-exact result has no highlight.
- Selection requires pointer click or keyboard activation on a visible row.
- A selected row may also be the highlighted row.
- Selecting another row does not move or erase the exact-ID highlight.
- Changing query clears selection.
- Changing filters clears selection before rendering when the selected row is no longer visible.
- A selected record ID that is absent, non-unique, or outside the current visible list produces `invalid_selection` and opens no detail.

### 17. URL-state contract

Use one catalog workspace route. Do not use an isolated part route for POC detail.

URL state fields:

| Parameter | Meaning |
|---|---|
| `v` | Canonical URL-state version; `1` marks the encoded family and filter set as complete |
| `q` | Original submitted query |
| `family` | Resolved family, when safe; omitted at Screws root and in family-neutral failure states |
| `diameter_mm` | Active diameter filter |
| `pitch_mm` | Active pitch filter |
| `length_mm` | Active length filter |
| `material` | Active material filter |
| `finish` | Active finish filter |
| `selected` | Explicit selected record ID, when valid |

Rules:

- Query submission pushes one new catalog history entry.
- The canonical URL after submission sets `v=1` and includes all active typed filters.
- Filter edits replace the current catalog entry to avoid one history entry per facet click.
- Because the URL stores the complete active-filter set, removing a query-derived filter survives refresh without changing the preserved query.
- Row activation pushes one selected-state history entry.
- The selected history entry retains a return-catalog snapshot containing the latest valid query, path, filters, ordering, highlight, scroll position, and row-focus target.
- Exact highlight is derived from `q`; there is no highlight parameter.
- Browser Back from detail removes selected state and restores prior query, catalog path, filters, ordering, highlight, and scroll.
- Close detail produces the same visible result as Back. For a selection pushed from the list, Close navigates to the prior catalog entry. For a direct selected-state URL with no prior in-app catalog entry, Close replaces the URL with the same resolved state minus `selected` rather than leaving PartSource.
- A direct URL with valid `selected` is an explicit detail request and opens detail only when the record resolves uniquely and belongs to the encoded visible list.
- On hydration, re-run deterministic resolution. If any encoded family or filter value is invalid, unsupported, inconsistent with the bundle, or unsafe, preserve the rejected field for display and return `invalid_url_state`. Do not silently drop it into a broader list.
- A valid direct URL without `v=1` derives the approved query filters once, then canonicalizes the URL with `v=1` and the complete active-filter set. In a `v=1` URL, absence of a filter parameter means that filter is intentionally inactive, even when the preserved query contains the term.
- In a valid `v=1` URL, `q` remains the original-query provenance and is always rechecked for supported family context, conflicts, and unsupported terms. The explicit structured filter parameters are authoritative for the active-filter set, so they may intentionally differ from query-derived values after user edits.
- More than one occurrence of any recognized state parameter returns `invalid_url_state`; do not use first-value or last-value wins.
- If `selected` is invalid for the resolved visible list, show `invalid_selection` with detail closed.
- Malformed URL encoding returns `invalid_url_state` and must not crash the workspace.

History behavior while detail is open:

- A new submitted query pushes a new unselected catalog entry and clears selection.
- A filter edit first resolves the new list.
- If the selected row remains visible, keep detail open, replace the selected entry with the new filters, and update its return-catalog snapshot so Close and Back both restore the latest filtered catalog state.
- If the selected row leaves the list, clear selection and replace the selected entry with the new unselected filtered state before rendering the list. A later Back must not reopen the invalidated selection.

### 18. Catalog workspace

The workspace contains, in order:

1. product name and synthetic-data notice;
2. search form;
3. preserved original query and deterministic interpretation trace;
4. visible category hierarchy;
5. family context, when resolved;
6. supported filter controls and active-filter tokens;
7. result count or fail-closed status;
8. result list;
9. detail surface after explicit selection.

Do not add dashboards, KPI cards, random default suggestions, AI indicators, confidence percentages, supplier panels, commerce controls, or decorative controls without behavior.

Loading is limited to application startup. Search and filtering are synchronous after the bundle validates.

### 19. Detail behavior

Desktop at 768 CSS px and above:

- open detail in a right-side panel;
- keep hierarchy, family, filters, result count, list, highlight, and selected row visible;
- keep the visible desktop filter controls operable while detail is open so a filter can invalidate the selection deterministically;
- keep list scroll position stable;
- provide explicit Close.

Below 768 CSS px:

- open detail as a full-height modal layer;
- keep the catalog workspace mounted underneath;
- prevent background interaction while open;
- Close or Back restores the same list state and scroll position.

Detail displays only:

- synthetic exact ID;
- family;
- nominal thread and pitch;
- length with datum;
- material;
- finish;
- drive;
- head profile;
- fixture bundle and version;
- record-fact provenance;
- identifier-mapping provenance;
- synthetic-data notice.

Detail contains no generic geometry drawing, scale claim, engineering visualization, application note, editable fact, standard, strength, certification, suitability, approval, equivalent, replacement, supplier link, price, stock, availability, BOM, cart, quote, shortlist, comparison, favorite, quantity, ordering, account, or AI control.

### 20. Accessibility

- The search field has a persistent accessible label.
- Search works by Enter and explicit button.
- Filter controls use native labels and expose active state without color alone.
- Result rows use buttons or links with a clear accessible name; do not make a non-semantic table row the only activation target.
- Highlight and selection each have text or icon meaning in addition to color.
- Exact-match status is announced without moving focus automatically.
- Detail has dialog semantics on narrow screens and complementary-panel semantics on desktop.
- Opening detail moves focus to its heading or Close control.
- Initial detail focus goes to the explicit Close control.
- Closing detail returns focus to the activating result row. For a valid direct selected-state URL, it focuses the corresponding visible selected row after removing selected state.
- When a filter invalidates and removes the selected row, focus remains on the filter control that caused the change; if that control no longer exists, focus moves to the result-count/status heading.
- An invalid selected-state URL opens no detail and places focus normally at the page/search entry point; it never attempts focus return to a missing row.
- Escape closes detail.
- Focus remains trapped only while the narrow-screen modal is open.
- All controls have visible focus indicators.
- At 320 CSS px, the result list becomes stacked records and requires no horizontal page scroll.
- Touch targets are at least 44 CSS px in their primary activation dimension.
- Respect reduced-motion preferences; no behavior depends on animation.

### 21. Provenance and claim boundary

Render one persistent notice:

`Synthetic POC data — not an engineering reference or supplier listing.`

Record facts and identifier mappings carry separate provenance labels even though they share one bundle.

PartSource must show source or origin for:

- each catalog record;
- each relevant displayed technical fact;
- each identifier mapping.

Identifier mapping provenance is separate from catalog record and fact provenance.

Do not use a generic verified badge, approval badge, certification badge, or global confidence score.

The UI and metadata must not claim or imply:

- engineering approval;
- application suitability;
- manufacture or supply;
- supplier listing identity;
- equivalence, replacement, or alternate status;
- certification or standard compliance;
- price, stock, availability, or lead time;
- ordering, checkout, quote, BOM, account, or procurement capability;
- broad catalog coverage;
- AI-generated or agent-reviewed technical truth.

Do not emit Product structured data, offer metadata, supplier metadata, isolated part metadata, or indexable detail routes for the synthetic POC.

### 22. Failure handling

- Invalid bundle: `catalog_unavailable`; no catalog content.
- Resolver exception: `catalog_unavailable`; log a non-sensitive diagnostic locally; show no partial result.
- Malformed URL: preserve readable query text where safe; discard unsafe state; show no unsupported filter, highlight, or selection.
- Invalid or inconsistent encoded family/filter: `invalid_url_state`; show each rejected field and no result list.
- Unsupported text: `query_unsupported`; show recognized and unsupported terms separately; no list.
- Conflicting text: `query_conflict`; show every conflicting value; no list.
- Safe filter combination with zero records: `catalog_empty`; keep path and filters visible.
- Absent exact ID: `exact_not_found`.
- Non-unique exact ID: `exact_non_unique`.
- Invalid selected ID: `invalid_selection` with safe catalog context retained.

A fail-closed state shows no unsupported result list, filter, selection, highlight, inferred family, inferred fact, or inferred identifier mapping. It keeps the query visible where safe and shows a deterministic stop reason.

### 23. Legacy-runtime migration boundary

The existing runtime contradicts this specification in active routes, components, data generation, backend schema, search behavior, tests, and metadata.

Implementation must treat these as legacy and outside the POC runtime:

- isolated part-detail routing;
- exact-ID navigation to a part page;
- fuzzy matching and decoder fallbacks;
- first-result or parsed-custom-part fallback;
- search suggestions that can become selection;
- blocked CSV generators and generated catalogs;
- legacy Supabase catalog schema, RPC, and Edge Function;
- source SKU, McMaster, standard, strength, verification, and old provenance fields;
- supplier-search destinations;
- BOM and cost workflows;
- embed routes;
- Product structured data and generated part pages;
- references and navigation that imply broader current product scope.

The current build and test pipeline invokes blocked CSV generation. POC implementation cannot be accepted until the POC build and acceptance path no longer reads or generates any derivative from those files.

This migration boundary does not authorize deletion, deployment, or public release. It defines what the later implementation must replace or isolate.

## Testing Decisions

### 1. Testing principle

Test externally observable catalog behavior, not component structure or internal call order.

The highest useful domain seam is the catalog resolver. Most behavior tests supply the validated synthetic bundle plus query/URL state and assert the complete view model. This avoids separate parser, filter, identity, and selection tests that can pass while the integrated behavior is wrong.

Use narrower validator tests only for bundle rejection rules. Use browser tests only for rendered behavior, accessibility, history, focus, scroll restoration, and responsive composition.

Do not use snapshot tests as acceptance evidence.

### 2. Required test layers

#### Bundle-contract tests

Verify:

- exactly 30 records, 32 mappings, and three families;
- exact tuple replication across families;
- stable record IDs and mapping IDs;
- approved one-to-one unique mappings;
- deliberate two-record collision only;
- family-fixed metadata consistency;
- typed numeric values and enums;
- record and mapping provenance;
- rejection of unknown fields and prohibited data fields;
- rejection of malformed, duplicate, missing, or extra records/mappings;
- no build or test dependency on blocked CSVs or their generated derivatives.

#### Resolver behavior tests

Verify:

- query preservation;
- supported aliases and typed normalization;
- unsupported term preservation;
- conflict detection;
- deepest safe catalog level;
- exact AND filters;
- stable ordering;
- zero-result distinction from unsafe-query states;
- exact-ID zero/one/many cardinality;
- highlight versus selection;
- invalid selected state;
- URL canonicalization and safe hydration.

#### Browser acceptance tests

Use the existing Playwright harness as prior art, but replace legacy product expectations with this specification. Run against the built POC with no catalog-network mocks because the bundle is local.

At minimum, assert:

- visible hierarchy, family, filters, counts, rows, notices, and state messages;
- deterministic interpretation trace contents and stop reason;
- no automatic detail after any query;
- exact highlight and selection distinction;
- strict exact-ID states: `unique`, `unknown`, and `non_unique`;
- active constraints remain visible when filter options are removed or disabled;
- unit, datum, and terminology labels for current families;
- record, fact, and identifier-mapping provenance labels;
- comparison-ready row fields without compare-mode controls;
- pointer and keyboard row activation;
- Close, Escape, and browser Back;
- focus return and scroll restoration;
- direct valid and invalid selected URLs;
- 320 CSS px behavior without horizontal page scroll;
- no console errors, uncaught page errors, or external catalog/supplier requests;
- absence of prohibited claims, controls, routes, and Product/Offer structured data.

#### Product-document guard

Keep a machine-checked guard that the product contract, PRD, confirmation, glossary, approved Wayfinder decision, and this specification retain:

- the catalog flow;
- the exact-ID flow;
- no automatic selection;
- deterministic runtime;
- source and claim boundaries.

### 2A. Post-POC UX delta validation gate

Before implementation changes for the approved seven UX decisions, pass:

1. deterministic benchmark;
2. browser tests;
3. adversarial cases;
4. proxy-evidence gate: public standards scope, manufacturer technical data, and independent adversarial challenge.

The gate must cover:

- exact-ID `unique`, `unknown`, and `non_unique` states;
- highlight versus selection;
- deterministic interpretation trace contents;
- unsupported and conflict trace states;
- unit and datum truth for `shcs`, `bhss`, and `css`;
- family-specific typed filter visibility and zero states;
- provenance per record, fact, and mapping;
- comparison-ready row fields;
- keyboard and focus behavior;
- 320 CSS px row behavior;
- absence of prohibited claims and controls.

Adversarial cases must include:

- partial identifiers;
- extra digits;
- internal spaces;
- changed punctuation;
- embedded identifiers in prose;
- unsupported units;
- bare numbers;
- OR and negation;
- invalid URL filters;
- direct selected URL with unknown or non-unique ID;
- missing provenance;
- equivalence, verified, supplier, BOM, and compare-control creep.

The proxy-evidence gate must assess:

- exact-ID state wording;
- unit and datum correctness;
- family typed-field applicability;
- provenance granularity;
- result-row field sufficiency;
- no suitability, equivalence, approval, or supplier implication.

Every conclusion must be labeled `proxy evidence`. The gate supports only bounded synthetic POC terminology, deterministic behavior, and claim boundaries. It does not establish qualified approval, mechanical correctness, standards conformance, supplier identity, equivalence, suitability, or commercial status.

### 3. Deterministic acceptance benchmark

Every benchmark case must pass at the resolver seam and at the browser seam where a visible interaction exists.

| Case | Input or action | Required result |
|---|---|---|
| B01 | `screws` | Screws; 30 rows; no family, filter, highlight, selection, or detail |
| B02 | `socket head screws` | `shcs`; 10 rows; no highlight, selection, or detail |
| B03 | `countersunk screws` | `css`; 10 rows; no highlight, selection, or detail |
| B04 | `M6 stainless socket head screws` | `shcs`; M6 + A2 stainless; 2 rows; no highlight, selection, or detail |
| B05 | `M6 socket head screws`; add stainless; add 20 mm; remove 20 mm | Counts 3 → 2 → 1 → 2; context stays `shcs`; no automatic highlight or selection |
| B06 | `M8 30 mm black oxide button head screws` | `bhss`; one row; no highlight, selection, or detail |
| B07 | `M4 40 mm socket head screws` | `shcs`; active M4 + 40 mm; zero rows; no highlight or selection |
| B08 | `PSYN-SCR-0006` | `shcs`; full 10 rows; row 06 highlighted and in view; no selection or detail |
| B08A | ` psyn-scr-0006 ` | Same as B08; trim and ASCII case-fold only |
| B08B | `PSYN-SCR-0006 extra` | Not exact-ID mode; no fuzzy recovery, highlight, selection, or detail |
| B08C | `PSYN SCR 0006` | Not exact-ID mode; punctuation is not removed for exact-ID recovery |
| B09 | `PSYN-SCR-9999` | Exact ID not found; no inferred family, list, highlight, selection, or detail |
| B10 | `PSYN-SCR-COLLIDE` | Non-unique mapping evidence; no family narrowing, list, highlight, selection, or detail |
| B11 | `M4 M6 socket head screws` | `shcs` safe context; both conflicting values; no diameter filter or list |
| B12 | `M6 titanium socket head screws` | `shcs` safe context; M6 recognized; titanium unsupported; no list |
| B13 | From B08, activate row 06 | Exact highlight remains; row 06 selected; detail opens |
| B14 | From B08, activate row 05 | Highlight remains on 06; selection/detail move to 05; meanings remain distinct |
| B15 | Close or Back after B13/B14 | Detail closes; selection clears; query, list, order, highlight, focus, and scroll restore |
| B16 | At 320 CSS px, run B08, activate row 06, then close | Query does not auto-open detail; selection opens full-height detail; close restores list and highlight |
| B17 | Open non-exact detail; apply a filter that removes the selected row | Selection clears and detail closes before the filtered list renders |
| B18 | Open URL with missing, non-unique, or out-of-list `selected` | Safe catalog context; no detail; `invalid_selection` visible |
| B19 | `M6 20 socket head screws` | Bare `20` unsupported; no silent length filter |
| B20 | `1/4 inch socket head screws` | Inch input unsupported; no silent unit conversion |
| B21 | `M6 stainless socket head screws` | Interpretation trace shows original query, recognized terms, active filters, stop reason, and provenance reference |
| B22 | `screws`; inspect rows | Rows show exact synthetic ID, family, thread/pitch, length datum, material, finish, drive, head profile, and provenance; no compare/BOM/export controls |

Acceptance requires all benchmark cases, zero prohibited claims or controls, zero external catalog/supplier requests, and zero console or page errors.

### 4. Verification commands to define during implementation

The later implementation plan must expose one release audit command that runs, in order:

1. type checking;
2. bundle-contract tests;
3. resolver behavior tests;
4. product-document guard;
5. production build;
6. browser acceptance tests;
7. prohibited-claim, route, metadata, and network boundary checks.

This specification does not define concrete script names because implementation tickets do not yet exist.

## Out of Scope

- Any AI or agent in the PartSource runtime.
- Live catalog APIs, Supabase catalog search, remote databases, source adapters, or data refresh.
- The blocked CSV files and every derivative of them.
- Confidential dataset reuse.
- McMaster, SKDIN, LILY Bearing, Source-Search, Filtersource, supplier, or external identifier data.
- Standards, strength, tolerance, certification, dimensional geometry, CAD, or application-suitability facts.
- Engineering approval or component selection advice.
- Equivalence, replacement, alternate, compatibility, or interchangeability.
- Supplier search, listing identity, offers, price, stock, availability, lead time, ordering, checkout, quote, or brokerage.
- BOM, procurement, account, saved search, favorite, shortlist, comparison, quantity, or export workflows.
- Isolated part pages, embed routes, static part-page generation, Product structured data, or pSEO.
- Typeahead, fuzzy search, typo correction, ranges, OR, negation, natural-language inference, or unsupported unit conversion.
- Image, camera, barcode, CAD, geometry, CSV, PDF, or batch input.
- Production deployment, public publication, outreach, analytics, monitoring integration, or commercial launch.
- Broad category coverage beyond the three approved synthetic families.
- Implementation tickets, estimates, sequencing, commits, or code changes.

## Further Notes

### Approval gate

This specification is complete when:

- every approved product and Wayfinder decision is represented once;
- no historical runtime behavior has been promoted into product behavior;
- independent reviewers find no material authority contradiction, unsafe data path, ambiguous state transition, or untestable acceptance rule;
- Jay approves the specification.

Approval authorizes implementation planning only if Jay separately requests it. It does not authorize code, tickets, deployment, publication, or outreach by itself.

### Non-blocking limits

- The synthetic corpus proves interaction behavior only.
- It does not prove mechanical truth, standards compliance, supplier identity, or user value.
- Legacy CSV rights and lineage remain unresolved for future reuse; the POC excludes them.
- Direct-user validation and qualified mechanical review remain later evidence gates.
