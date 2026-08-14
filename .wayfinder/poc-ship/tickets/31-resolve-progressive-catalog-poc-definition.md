---
title: Resolve progressive-catalog POC definition blockers
status: closed
outcome: READY-for-to-spec
label: wayfinder:decision
created: 2026-08-11
updated: 2026-08-11
---

## Question

Resolve the data, family, schema, corpus, benchmark, and detail decisions needed before `/to-spec`.

Do not implement. Do not start `/to-spec`.

## Resolution

All product-definition blockers are resolved for one synthetic interaction POC.

The POC is ready for `/to-spec` after Jay gives a separate explicit instruction.

## 1. Data provenance

### Decision

Do not use these files or anything derived from them:

- `data/socket-head-cap-screws.csv`;
- `data/hex-head-screws.csv`;
- `data/rounded-head-screws.csv`;
- generated catalogs, database rows, caches, fixtures, tests, or benchmarks made from those files.

`data/README.md` identifies the files as anonymized SKDIN scrape outputs. Anonymization does not change origin or reuse rights. `research/data-source-register.md` blocks SKDIN content and derivatives.

The cofounder approval record does not cure this conflict. It does not prove that these exact files are a separate authorized packet. It also cannot grant rights that the provider does not own.

Calling copied facts `synthetic`, `demo`, or `internal-demo-seed` does not make them synthetic.

### POC source strategy

Use a new blank-slate bundle named `PS-POC-SYNTHETIC-V1`.

Rules:

- Author it without reading, sampling, transforming, matching, or validating against blocked files.
- Use no external identifiers, supplier names, source SKUs, copied titles, standards claims, or supplier category paths.
- Label every record fact `synthetic_fixture`.
- Label every identifier mapping `synthetic_identifier`.
- Show: `Synthetic POC data — not an engineering reference or supplier listing.`
- Record bundle ID, authoring date, allowed use, and fixture version.
- Use it only for the local interaction POC and its deterministic acceptance benchmark.

The old data remains blocked. Salvage would require rights evidence plus a file-level provenance chain. Salvage is outside this POC and does not block it.

## 2. Catalog hierarchy and families

Hierarchy:

`Screws → Hex-socket screws → family`

The POC has exactly three families:

1. `Socket-head cap screws` — `shcs`.
2. `Button-head socket screws` — `bhss`.
3. `Countersunk socket screws` — `css`.

### Shared inclusion boundary

Include only synthetic:

- metric machine screws;
- right-hand coarse threads;
- internal hex drive;
- the three named head profiles;
- the listed POC diameters, pitches, lengths, materials, and finishes.

### Family boundaries

`shcs`:

- cylindrical socket head;
- length datum is under head.

`bhss`:

- button head without flange or collar;
- length datum is under head.

`css`:

- flat countersunk socket head;
- 90-degree synthetic countersink profile;
- length datum is overall length.

Exclude:

- low-profile and ultra-low socket heads;
- flange or collar button heads;
- raised countersunk heads;
- shoulder, set, captive, self-tapping, self-drilling, wood, and sheet-metal screws;
- imperial threads;
- external hex, slot, cross recess, and hexalobular drives;
- standard, strength, certification, suitability, equivalence, or supplier claims.

## 3. Family schemas

### Catalog record

Every record requires:

- `record_id`: immutable PartSource synthetic record identity;
- `family_id`: `shcs`, `bhss`, or `css`;
- `thread_system`: fixed `metric`;
- `nominal_diameter_mm`: numeric;
- `pitch_mm`: numeric;
- `length_mm`: numeric;
- `length_datum`: `under_head` or `overall`;
- `material`: `a2_stainless` or `alloy_steel`;
- `finish`: `passivated` or `black_oxide`;
- `drive`: fixed `internal_hex`;
- `head_profile`: `cylindrical`, `button`, or `countersunk_90`;
- `provenance_bundle_id`: fixed `PS-POC-SYNTHETIC-V1`;
- `provenance_kind`: fixed `synthetic_fixture`.

`record_id` is not an identifier mapping and is not shown as an external product number.

No standard, strength, tolerance, supplier, price, stock, availability, or suitability field exists in this POC.

### Identifier mapping

Each mapping requires:

- `mapping_id`;
- `namespace`: fixed `partsource_synthetic_v1`;
- `identifier_value`;
- `record_id`;
- `provenance_bundle_id`;
- `provenance_kind`: fixed `synthetic_identifier`.

### Units

- Store dimensional quantities as numbers in millimetres.
- Store the countersink profile angle as numeric degrees in family metadata.
- Display nominal thread as `M4`, `M5`, `M6`, or `M8`.
- Accept metric input only.
- Do not convert inch input.
- A bare length number without `mm` is unsupported.

### Filters

Supported filters are exact, AND-only filters:

- family;
- nominal diameter;
- pitch;
- length;
- material;
- finish.

Drive and head profile define family scope. They are displayed, not duplicate filters.

No ranges, OR, negation, fuzzy values, inferred standards, or inferred material/finish values.

### Query normalization

1. Preserve the original query.
2. Trim and collapse whitespace.
3. Case-fold recognized words and the synthetic identifier namespace.
4. Normalize singular/plural `screw` and `screws`.
5. Treat hyphens as spaces in text queries. Preserve punctuation inside exact IDs.
6. Recognize only these family aliases:
   - `socket head screw(s)` and `socket head cap screw(s)` → `shcs`;
   - `button head screw(s)` and `button head socket screw(s)` → `bhss`;
   - `countersunk screw(s)` and `countersunk socket screw(s)` → `css`.
7. Recognize `M4`, `M5`, `M6`, `M8`, explicit metric pitch, explicit `mm` length, `stainless`, `A2`, `alloy steel`, `passivated`, and `black oxide`.
8. `stainless` and `A2` normalize to `a2_stainless`.
9. Different values for one field are a conflict. Apply no value for that field and show no result list.
10. An unknown constraint is preserved and reported. Show no result list that could appear to satisfy it.
11. Do not correct typos or infer unsupported meaning.
12. Exact-ID mode applies only when the whole trimmed query is one synthetic identifier.

### Identity and collision rules

- Record IDs are unique and immutable. A duplicate record ID rejects the bundle.
- Identifier uniqueness is evaluated after namespace-specific trim and case-fold only.
- Do not remove hyphens or punctuation during identifier normalization.
- One mapping → open the mapped family list and highlight one row.
- Zero mappings → highlight nothing and show exact ID not found.
- More than one mapping → highlight nothing and show non-unique ID.
- Never choose the first mapping.
- The exact match highlight is not selection.
- Result order is family order, diameter, length, material, then record ID.

## 4. POC corpus

The bundle contains 30 records: 10 records in each family.

Apply the same 10 synthetic tuples to `shcs`, `bhss`, and `css`:

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

Unique synthetic exact IDs:

- `PSYN-SCR-0001` through `PSYN-SCR-0030`;
- ordered by `shcs`, `bhss`, `css`, then tuple 01–10.

Collision fixture:

- `PSYN-SCR-COLLIDE` maps to `synrec-v1-shcs-06` and `synrec-v1-bhss-06`;
- it proves non-unique exact IDs fail closed;
- the two records keep their own unique synthetic exact IDs.

The bundle therefore has 30 records and 32 identifier-mapping rows.

## 5. Behavioral benchmark

The benchmark is deterministic. It uses `PS-POC-SYNTHETIC-V1` only.

For every case, preserve the original query and keep the current catalog path visible.

| Case | Query or action | Expected state |
|---|---|---|
| B01 broad category | `screws` | Screws level; 30 rows; no family, filter, highlight, selection, or detail. |
| B02 family | `socket head screws` | `shcs`; 10 rows; no highlight, selection, or detail. |
| B03 second family | `countersunk screws` | `css`; 10 rows; no highlight, selection, or detail. |
| B04 filtered family | `M6 stainless socket head screws` | `shcs`; M6 + A2 stainless filters; 2 rows; no highlight, selection, or detail. |
| B05 filter sequence | Start `M6 socket head screws`; add stainless; add 20 mm; remove 20 mm | Row counts 3 → 2 → 1 → 2. Context stays `shcs`. No automatic highlight or selection. |
| B06 one non-exact result | `M8 30 mm black oxide button head screws` | `bhss`; one row; no highlight, selection, or detail. |
| B07 safe zero results | `M4 40 mm socket head screws` | `shcs`; M4 + 40 mm stay visible; zero rows; clear no-results state; no highlight or selection. |
| B08 exact unique | `PSYN-SCR-0006` | `shcs`; full 10-row family list; row 06 highlighted and scrolled into view; no selection or detail. |
| B09 exact absent | `PSYN-SCR-9999` | Query preserved; exact ID not found; no inferred family, list, highlight, selection, or detail. |
| B10 exact collision | `PSYN-SCR-COLLIDE` | Query preserved; non-unique ID state names two mappings without choosing; no family narrowing, highlight, selection, or detail. |
| B11 conflicting values | `M4 M6 socket head screws` | `shcs` context; both conflicting tokens visible; no diameter filter and no result list, highlight, selection, or detail. |
| B12 unsupported constraint | `M6 titanium socket head screws` | `shcs` context; M6 recognized; `titanium` reported unsupported; no result list, highlight, selection, or detail. |
| B13 select highlighted row | From B08, activate row 06 | Family list remains; exact highlight remains; row 06 becomes selected; detail opens for row 06. |
| B14 select another row | From B08, activate row 05 | Exact highlight remains on row 06; selection moves to row 05; detail shows row 05. Highlight and selection are visually distinct. |
| B15 close or Back | Close detail or use browser Back after B13/B14 | Detail closes; selection clears; exact query, family list, highlight, order, and scroll position restore exactly. |
| B16 narrow screen | At 320 CSS px, run B08, select row 06, then close | Exact query does not auto-open detail. User selection opens full-height detail. Close restores the same list and highlight without rerunning the query. |
| B17 filter invalidates selection | Open detail from a non-exact list, then change a filter so the record leaves the list | Detail closes and selection clears before the filtered list renders. No stale selected record remains. |
| B18 invalid selected deep link | Open URL state with a missing, non-unique, or out-of-list selected record | Keep safe catalog context; open no detail; show an invalid-selection state. |

Acceptance requires every expected state and zero prohibited claims or controls.

## 6. Detail behavior

### Desktop

At 768 CSS px and above:

- explicit row click or keyboard activation opens a right-side detail panel;
- hierarchy, family, active filters, result count, list, exact highlight, and selected row remain visible;
- the panel does not replace the catalog route.

### Narrow screen

Below 768 CSS px:

- explicit row activation opens a full-height detail layer;
- the catalog stays mounted underneath;
- Close and Back restore query, hierarchy, filters, order, scroll, highlight, and list state exactly.

### Highlight and selection

- Highlight belongs only to one supported unique exact-ID mapping.
- Highlight never opens detail and never becomes selection.
- Selection requires row activation.
- A row can be highlighted and selected at the same time.
- Selecting another row does not erase the exact-ID highlight.
- Query or filter changes clear any selection that is no longer in the visible result list.

### URL and history

- URL state contains original query, resolved family, supported filters, and optional selected record ID.
- A submitted query pushes one catalog state.
- Filter edits update the current catalog state without creating noisy history entries.
- Row selection pushes one selected state.
- Browser Back removes selection and restores the prior catalog state.
- Close has the same visible result as Back.
- A direct selected-state URL may open detail only when the record exists uniquely and belongs to the encoded visible list.
- An exact-ID query without selected state never opens detail.

### Detail fields

Show only:

- synthetic exact ID;
- family;
- nominal thread and pitch;
- length with datum label;
- material;
- finish;
- drive;
- head profile;
- fixture bundle/version;
- fact and mapping provenance labels;
- synthetic-data notice.

Do not show:

- BOM, cart, quote, shortlist, comparison, favorites, or quantity controls;
- supplier links, source SKUs, price, stock, availability, lead time, or ordering;
- standards, strength, certification, suitability, equivalence, replacement, or approval;
- AI controls, recommendations, summaries, or generated claims;
- editable catalog facts.

## Unresolved issues

No unresolved issue blocks `/to-spec` for this synthetic POC.

Non-blocking limits:

- The legacy CSV lineage remains unresolved for any future reuse. Those files stay excluded.
- The synthetic corpus does not establish mechanical truth, standards compliance, supplier identity, or user value.
- Direct-user validation and qualified mechanical review remain future evidence gates, not claims this POC can make.
- Visual styling, implementation structure, and runtime migration belong after specification.

## Readiness

**READY FOR `/to-spec` after a separate explicit instruction from Jay.**

This ticket does not start `/to-spec`, implementation, deployment, publication, or outreach.

## Evidence and review

Primary authority:

- `research/product-contract.md`;
- `research/prd.md`;
- `SPEC_CONFIRMATION.md`;
- `CONTEXT.md`;
- `research/data-source-register.md`;
- `research/product-definition-audit-2026-08-11.md`.

Three delegated review lanes covered provenance, catalog/data design, and benchmark/detail behavior. Two initial lanes timed out after reading and were rerun as narrow decision reviews. Main-session verification rejected the benchmark review's unrelated machine/wood/sheet-metal family model and rejected copied-data relabeling, first-result collision handling, isolated detail, and fake precision not needed by this POC.
