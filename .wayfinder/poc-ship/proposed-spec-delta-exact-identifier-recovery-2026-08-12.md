# Proposed spec delta — exact identifier recovery and interpretation trace — 2026-08-12

Status: proposal only. Not product authority until reviewed and applied to the product/spec documents.

Source Wayfinder gate:

- `.wayfinder/poc-ship/exact-identifier-recovery-spec-delta-gate-2026-08-12.md`

## Delta summary

Add the smallest spec change set for exact identifier recovery and confirmation.

Keep the runtime rule:

`query → catalog level → family → filters → result list`

No runtime AI or agents.
No fuzzy selection.
No supplier, BOM, procurement, price, stock, availability, quote, checkout, equivalence, replacement, or approved alternate scope.

## Product contract delta

### Product purpose

Add:

PartSource supports exact identifier recovery and confirmation as the next primary engineer job.

An engineer can enter an exact identifier as the query and confirm the mapped catalog record without losing catalog context.

### Exact identifier contract

Replace or extend with:

`exact identifier → identifier state → catalog level/family context → result list or fail-closed state → highlight only when unique → user selection`

Exact identifier states:

| State | Mapping count | Catalog context | Result list | Highlight | Selection/detail |
|---|---:|---|---|---|---|
| `unique` | 1 | mapped family | full family list | mapped catalog record | user action only |
| `unknown` | 0 | Screws root | none | none | none |
| `non_unique` | >1 | Screws root | none; mapping evidence only | none | none |

Rules:

- Detect exact identifier mode only when the whole query is a supported identifier form.
- For current POC identifiers, normalize only by trimming leading/trailing whitespace and ASCII case-folding.
- Do not remove punctuation.
- Do not route embedded, prefix, partial, or prose identifiers to exact-ID mode.
- Unique exact identifier match highlights one mapped row in the relevant result list.
- Highlight is not selection.
- Detail opens only after explicit user selection.
- Unknown and non-unique identifiers do not highlight.
- Non-unique identifiers never choose the first mapping.
- No fuzzy, semantic, nearest, or prefix selection exists.

### Deterministic interpretation trace

Add:

After a submitted query, PartSource shows a deterministic interpretation trace.

Allowed trace fields:

- original query;
- recognized identifier or terms;
- catalog level;
- family;
- active typed filters;
- unsupported terms;
- conflicts;
- exact identifier state;
- stop reason;
- provenance reference for relevant record, fact, or identifier mapping.

Allowed labels:

- Recognized;
- Applied;
- Unsupported;
- Conflict;
- Identifier state;
- Stopped because.

Banned trace content:

- AI explanation;
- confidence score;
- best match;
- recommendation;
- inferred suitability;
- fuzzy recovery;
- implementation internals.

### Family-specific typed filters

Strengthen:

- Filters use only supported typed fields.
- A typed field is valid only inside its family schema or safe catalog scope.
- Active filters stay visible.
- Query-derived filters remain removable.
- Deterministic smart filters can show valid values and remove or disable impossible values.
- Smart filters must never hide active constraints silently.
- Smart filters must never auto-drop constraints, auto-broaden, infer missing values, or rank by guessed intent.

### Unit and terminology truth

Add:

For the current selected POC families, every displayed typed field used in query, filters, result rows, and detail must define:

- original value, when from query or source;
- normalized value;
- unit;
- relation type;
- datum;
- family applicability.

Current POC relation type is exact only.
Current POC units are metric only.
Unsupported units remain unsupported.

Length datum:

- `shcs`: under-head;
- `bhss`: under-head;
- `css`: overall.

Do not silently merge:

- under-head and overall length;
- nominal and actual values;
- metric and inch units;
- pitch and length;
- material and finish.

### Provenance

Strengthen:

PartSource shows source or origin for:

- catalog record;
- relevant displayed technical fact;
- identifier mapping.

Identifier mapping provenance is separate from catalog record or fact provenance.

Banned trust labels:

- verified;
- approved;
- certified;
- confidence score;
- recommended;
- suitable;
- equivalent;
- replacement.

### Result rows

Add:

Result rows must be comparison-ready, without adding a compare mode.

For current POC families, each row shows:

- exact synthetic identifier;
- family;
- nominal thread and pitch;
- length and datum;
- material;
- finish;
- drive;
- head profile;
- provenance.

A result row remains a catalog record and activation control.
It is not approval, suitability, equivalence, replacement, supplier listing, offer, or selection.
A one-row non-exact result still does not highlight, select, or open detail.

### Fail-closed behavior

Strengthen:

A fail-closed state shows no unsupported:

- result list;
- filter;
- selection;
- highlight;
- inferred family;
- inferred fact;
- inferred identifier mapping.

A fail-closed state keeps the query visible where safe and shows a deterministic stop reason.

## Technical spec delta

Add or update sections:

1. User stories:
   - exact identifier recovery and confirmation;
   - deterministic interpretation trace;
   - strict exact-ID states;
   - unit/datum truth;
   - provenance per record/fact/mapping;
   - comparison-ready rows.

2. Query submission and exact-ID detection:
   - whole-query exact-ID mode;
   - trim + ASCII case-fold only;
   - no punctuation removal;
   - no embedded/prose ID exact mode.

3. View model:
   - interpretation trace;
   - exact identifier state;
   - stop reason;
   - provenance references.

4. Filters:
   - deterministic smart-filter constraints.

5. Unit/terminology:
   - selected POC family typed-field table.

6. Result rows:
   - comparison-ready field set.

7. Provenance:
   - record/fact/mapping provenance.

8. Tests:
   - deterministic benchmark;
   - browser tests;
   - adversarial cases;
   - domain review.

## Required test delta

Add deterministic benchmark cases for:

- unique exact ID;
- trimmed/lowercase exact ID;
- unknown ID;
- non-unique ID;
- ID with extra text;
- ID with punctuation removed/changed;
- exact highlight then row activation;
- exact highlight then different-row activation;
- interpretation trace for catalog list, unsupported, conflict, unique ID, non-unique ID;
- unit/datum truth for SHCS/BHSS/CSS;
- filter removal and URL preservation;
- provenance per row/detail/trace;
- one-row non-exact result with no selection/detail;
- 320 CSS px row preservation.

Add browser tests for:

- visible exact-ID states;
- highlight vs selection;
- no automatic detail;
- trace visible/accessibly reachable;
- active filters visible/removable;
- zero-result constraints visible;
- row fields visible on desktop and narrow screens;
- provenance labels present;
- prohibited claims/controls absent;
- keyboard focus and Close/Back behavior.

Add adversarial cases for:

- partial IDs;
- extra digits;
- internal spaces;
- en dash punctuation;
- embedded IDs;
- unsupported units;
- bare numbers;
- OR/negation;
- invalid URL filters;
- direct selected URL with unknown/non-unique ID;
- missing provenance;
- equivalence/verified/supplier/BOM/control creep.

Add domain review for:

- exact-ID state wording;
- unit and datum correctness;
- family typed-field applicability;
- provenance granularity;
- row-field sufficiency;
- no suitability/equivalence/approval implication.

## Deferred from this delta

Do not include:

- implementation tickets;
- code changes;
- reopening POC tickets 32–38;
- fuzzy/prefix/semantic ID matching;
- normalized ID state beyond trim + ASCII case-fold;
- manufacturer/supplier IDs;
- separate compare mode;
- shortlist/favorite/cart/BOM/export;
- ranges/min/max/OR/negation;
- inch support or unit conversion;
- standards, strength, tolerance, actual measured values;
- field-level real-source conflict/release history beyond POC synthetic scope;
- CAD, drawings, generated geometry, CAD availability metadata;
- adjacent candidates;
- new families;
- deployment/publication/outreach/commercial launch.

## Readiness verdict

READY FOR SPEC UPDATE
