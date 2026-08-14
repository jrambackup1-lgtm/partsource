# Decision gate — exact identifier recovery spec delta — 2026-08-12

Status: READY FOR SPEC UPDATE proposal.

This is a Wayfinder decision-gate record.
It is not an implementation ticket.
It does not authorize code changes.
It does not reopen the completed POC.

## Runtime rule

Preserve:

`query → catalog level → family → filters → result list`

PartSource remains deterministic.
No runtime AI or agents.
No fuzzy selection.
No supplier, BOM, procurement, price, stock, availability, quote, checkout, equivalence, replacement, or approved alternate scope.

## Scope

Define the smallest spec delta for:

1. Exact identifier recovery as the primary engineer job.
2. Deterministic interpretation trace.
3. Family-specific typed filters.
4. Unit and terminology truth for current families.
5. Strict exact-ID states.
6. Record and fact provenance.
7. Comparison-ready result rows.

Current selected POC families:

- Socket-head cap screws (`shcs`).
- Button-head socket screws (`bhss`).
- Countersunk socket screws (`css`).

## Resolved decisions from this gate

1. Exact identifier detection stays whole-query only.
   - Supported normalization: trim leading/trailing whitespace and ASCII case-fold only.
   - Do not remove punctuation.
   - Do not route embedded, prefix, partial, or prose identifiers to exact-ID mode.

2. Unknown exact identifier state shows Screws root context and no result list.
   - It preserves the query.
   - It shows clear unknown state.
   - It infers no family.
   - It highlights and selects nothing.

3. Non-unique exact identifier state shows Screws root context and mapping evidence.
   - It preserves the query.
   - It shows clear non-unique state.
   - It shows no catalog result list.
   - It highlights and selects nothing.
   - It never chooses the first mapping.

4. Exact identifier plus extra text is not exact-ID mode.
   - Example: `PSYN-SCR-0006 extra` is not exact-ID recovery.
   - The query is processed as text and unsupported content remains unsupported.
   - No fuzzy recovery.

5. The interpretation trace appears after a submitted query.
   - It can be inline or collapsible, but must be reachable by keyboard and assistive tech.
   - It must use deterministic labels, not recommendation prose.

6. Provenance depth for this delta:
   - record origin/source;
   - relevant displayed fact provenance;
   - identifier mapping provenance;
   - synthetic POC origin where applicable.

7. Comparison remains in result rows only.
   - No separate compare mode.
   - No shortlist, favorite, cart, BOM, export, or comparison workspace.

---

# 1. Exact identifier recovery as primary engineer job

## Product behavior

When the query is a supported exact identifier:

1. Preserve the original query.
2. Resolve the identifier through deterministic identifier mappings only.
3. Keep catalog context visible.
4. Show exact identifier state.
5. Show provenance for the identifier mapping.
6. Require explicit user selection before detail opens.

Unique exact identifier match:

- opens the correct catalog level and family;
- shows the full relevant result list;
- highlights exactly one mapped catalog record;
- does not select the row;
- does not open detail;
- keeps highlight separate from selection.

Unknown identifier:

- shows the Screws root context;
- shows unknown identifier state;
- shows no result list;
- highlights nothing;
- selects nothing;
- infers no family.

Non-unique identifier:

- shows the Screws root context;
- shows non-unique identifier state;
- may show mapping evidence;
- shows no catalog result list;
- highlights nothing;
- selects nothing;
- infers no preferred mapping.

## Acceptance criteria

Pass if:

- unique exact identifier opens the correct family result list;
- exactly one mapped row is highlighted;
- highlight is not selection;
- detail opens only after explicit row activation;
- unknown identifier shows no highlight and no result list;
- non-unique identifier shows no highlight, no result list, and clear mapping state;
- original query stays visible;
- mapping provenance is visible or reachable;
- no fuzzy, prefix, semantic, nearest, or first-result behavior occurs.

Fail if:

- exact query opens detail automatically;
- unknown or non-unique identifier highlights a row;
- any non-exact identifier-like query selects or highlights a row;
- unsupported text is converted into a fact or filter.

## Spec changes

Update exact identifier contract with:

- exact identifier state vocabulary: `unique`, `unknown`, `non_unique`;
- whole-query exact-ID detection rule;
- trim + ASCII case-fold only for supported POC IDs;
- unique mapping highlight rule;
- unknown/non-unique fail-closed rules;
- confirmation happens in context through result list, highlight, trace, provenance, and user selection.

## Required tests

Resolver benchmark:

- `PSYN-SCR-0006` → `unique`, `shcs`, 10 rows, row 06 highlighted, no selection/detail.
- ` psyn-scr-0006 ` → same as above.
- `PSYN-SCR-9999` → `unknown`, Screws root, no list/highlight/selection/detail.
- `PSYN-SCR-COLLIDE` → `non_unique`, Screws root, mapping evidence, no list/highlight/selection/detail.
- `PSYN-SCR-0006 extra` → not exact-ID mode, no fuzzy recovery.
- `PSYN SCR 0006` → not exact-ID mode, no punctuation recovery.
- From unique exact state, activate highlighted row → selection/detail opens; highlight remains identity evidence.
- From unique exact state, activate another visible row → selection changes; highlight remains on exact row; no equivalence language.

Browser tests:

- visible state for unique, unknown, non-unique;
- highlight distinct from selection by text/icon, not color only;
- no automatic detail after exact query;
- keyboard activation required for detail;
- URL refresh preserves state;
- no prohibited claim/control appears.

Adversarial cases:

- partial ID;
- extra digit;
- internal spaces;
- en dash punctuation;
- ID embedded in prose;
- collision ID with direct selected URL;
- unknown ID with direct selected URL.

Domain review:

- state vocabulary is clear to an engineer;
- unknown means unsupported in this catalog, not globally nonexistent;
- non-unique mapping evidence does not imply equivalence or preference;
- highlight is clearly evidence, not confirmation.

## Deferred

- normalized exact identifiers beyond trim + ASCII case-fold;
- manufacturer or supplier identifiers;
- fuzzy/prefix/semantic ID recovery;
- exact-ID state beyond unique/unknown/non-unique.

---

# 2. Deterministic interpretation trace

## Product behavior

After a submitted query, PartSource shows a deterministic interpretation trace.

Trace can show:

- original query;
- recognized identifier or terms;
- catalog level;
- family;
- active typed filters;
- unsupported terms;
- conflicts;
- exact identifier state;
- stop reason;
- provenance reference for relevant record, fact, or mapping.

Trace language uses factual labels:

- Recognized;
- Applied;
- Unsupported;
- Conflict;
- Identifier state;
- Stopped because.

Trace must not include:

- AI explanation;
- confidence score;
- best match;
- recommendation;
- inferred suitability;
- fuzzy recovery;
- implementation internals.

## Acceptance criteria

Pass if:

- trace appears after each submitted query;
- trace preserves the original query;
- trace shows recognized and unsupported content separately;
- trace shows conflicts without silently choosing one value;
- trace shows exact identifier state for exact-ID queries;
- trace gives a deterministic stop reason;
- trace is keyboard reachable and accessible.

Fail if:

- trace says best match, recommended, likely, probably, confidence, approved, equivalent, or suitable;
- trace hides unsupported or conflicting terms;
- trace implies AI reasoning.

## Spec changes

Add a new “Deterministic interpretation trace” section to the product spec.

Add trace fields to the resolver/view-model contract if the spec contains implementation-facing model language.

## Required tests

Resolver benchmark:

- `M6 stainless socket head screws` → recognized family, diameter, material, filters, catalog_list stop reason.
- `M6 titanium socket head screws` → recognized family + M6, unsupported titanium, no list, unsupported stop reason.
- `M4 M6 socket head screws` → conflict on diameter, no list, conflict stop reason.
- `PSYN-SCR-0006` → exact identifier, unique state, mapped family, highlighted row, unique stop reason.
- `PSYN-SCR-COLLIDE` → exact identifier, non-unique state, mapping evidence, non-unique stop reason.

Browser tests:

- trace content is visible or accessible;
- trace updates after new query;
- trace updates after filter removal while original query stays preserved;
- trace contains no banned words/claims.

Adversarial cases:

- typo terms;
- unsupported units;
- bare numbers;
- OR/negation;
- recommendation words in query;
- embedded ID in prose.

Domain review:

- trace terms are mechanically correct for current families;
- stop reasons are clear and not overclaiming.

## Deferred

- natural-language explanation;
- AI/agent interpretation;
- confidence/relevance scoring;
- user-editable trace.

---

# 3. Family-specific typed filters

## Product behavior

Filters come only from supported typed fields in the active family schema or safe catalog scope.

For selected POC families, supported filters remain:

- family at Screws root;
- nominal diameter;
- pitch;
- length;
- material;
- finish.

Rules:

- active filters are visible;
- query-derived filters are removable;
- filters combine with AND;
- filter values are exact typed values;
- filter controls show valid values for the current scope;
- impossible values are removed or disabled deterministically;
- active constraints are never hidden silently.

## Acceptance criteria

Pass if:

- only supported typed fields become filters;
- filters are valid for the active family or safe catalog scope;
- family-specific fields do not silently apply to another family;
- removing a query-derived filter preserves original query;
- zero-result state keeps active filters visible;
- direct URL state respects explicit active filters.

Fail if:

- raw supplier facets appear;
- unsupported terms become filters;
- filters auto-drop or auto-broaden;
- hidden smart-filter behavior changes meaning.

## Spec changes

Strengthen filter and family schema sections:

- filter values are typed, family-scoped, and deterministic;
- smart filters can only show valid values or remove/disable impossible values from the current typed set;
- no hidden recovery.

## Required tests

Resolver benchmark:

- valid family filter at Screws root changes catalog context;
- removing family filter returns to Screws context;
- query-derived filter removal survives refresh through URL state;
- impossible valid combination returns catalog_empty with active constraints;
- invalid URL filter returns invalid_url_state.

Browser tests:

- active filters visible/removable;
- impossible values removed or disabled without hiding active constraints;
- zero-result state shows constraints;
- keyboard filter use works.

Adversarial cases:

- duplicate URL filters;
- invalid filter enum;
- unsupported field such as supplier, standard, strength, drive as filter;
- filter invalidates selected row.

Domain review:

- each filter belongs to the current family schema;
- filter labels are mechanically clear.

## Deferred

- ranges;
- OR/negation;
- min/max semantics;
- ranked or recommended filter values;
- filters for standards, strength, supplier, CAD, availability.

---

# 4. Unit and terminology truth for current families

## Product behavior

For `shcs`, `bhss`, and `css`, define unit and terminology for every displayed typed field used in query, filters, result rows, and detail.

Required model per relevant typed field:

- original value, when from query or source;
- normalized value;
- unit;
- relation type;
- datum;
- family applicability.

Current POC relation type can be `exact` only.
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

## Acceptance criteria

Pass if:

- every result row and detail display uses correct unit and datum labels;
- supported query values map to typed fields only when unit and meaning are supported;
- unsupported unit or term stays unsupported;
- bare numbers are not treated as dimensions;
- family applicability is clear.

Fail if:

- `20` without `mm` becomes length;
- inch input converts silently;
- CSS overall length is displayed as under-head length;
- pitch and length units are confused;
- unsupported family terms are accepted.

## Spec changes

Add unit/terminology section for current families.

Add a table for selected POC family typed fields:

- field name;
- unit;
- relation type;
- datum;
- family applicability;
- accepted query forms;
- unsupported examples.

## Required tests

Resolver benchmark:

- `M6 20 mm socket head screws` recognizes length exactly.
- `M6 20 socket head screws` keeps bare `20` unsupported.
- `1/4 inch socket head screws` unsupported.
- `M6 0.75 mm socket head screws` unsupported pitch if not in corpus.
- row/detail for SHCS and BHSS show under-head length.
- row/detail for CSS show overall length.

Browser tests:

- filter labels include units;
- rows show length with datum;
- detail shows length with datum;
- unsupported unit trace is visible.

Adversarial cases:

- mixed metric/inch query;
- range syntax;
- overall length term on SHCS/BHSS;
- low-profile, shoulder, flange, collar terms;
- actual diameter wording.

Domain review:

- family datums are correct;
- terms do not imply measured actual values;
- accepted and unsupported terms are clear.

## Deferred

- inch support;
- unit conversion;
- ranges/min/max;
- tolerance;
- standards;
- strength;
- actual measured values;
- added families.

---

# 5. Strict exact-ID states

## Product behavior

Exact identifier states are:

- `unique`: one supported mapping exists;
- `unknown`: zero supported mappings exist;
- `non_unique`: more than one supported mapping exists.

Only `unique` can create a highlight.
No state creates selection.
No state opens detail automatically.
No fuzzy matching exists.

## Acceptance criteria

Pass if:

- state is always one of unique, unknown, non_unique;
- unique highlights exactly one row;
- unknown and non_unique highlight nothing;
- selection remains explicit;
- non_unique never chooses first mapping;
- direct URL cannot force unsafe selected detail.

Fail if:

- any unsupported exact state exists;
- any confidence-like state appears;
- any non-unique result is preferred;
- any fuzzy ID creates highlight.

## Spec changes

Replace loose exact-ID wording with state table:

| State | Mapping count | Context | Result list | Highlight | Selection/detail |
|---|---:|---|---|---|---|
| unique | 1 | mapped family | full family list | mapped row | user action only |
| unknown | 0 | Screws root | none | none | none |
| non_unique | >1 | Screws root | none; mapping evidence only | none | none |

## Required tests

Covered by exact identifier recovery tests.

Additional adversarial tests:

- direct selected URL with non-unique ID;
- direct selected URL with unknown ID;
- selected record outside exact-ID family context;
- mapping collision cannot highlight.

Domain review:

- state names are clear;
- non_unique evidence does not imply equivalence.

## Deferred

- normalized exact state as separate state;
- ID-like unsupported state;
- source-specific external identifier namespaces beyond POC synthetic namespace.

---

# 6. Record and fact provenance

## Product behavior

PartSource shows source/origin for:

- catalog record;
- relevant displayed technical facts;
- identifier mapping.

For synthetic POC data, provenance states synthetic origin.

Identifier mapping provenance is separate from record-fact provenance.
A generic verified badge is not allowed.
A global confidence score is not allowed.

## Acceptance criteria

Pass if:

- row shows record/fact provenance or an accessible provenance label;
- exact-ID trace/state shows identifier mapping provenance;
- detail shows record and mapping provenance separately;
- non-unique mapping evidence includes mapping provenance;
- unsupported/conflict states do not imply unsupported terms are verified.

Fail if:

- one generic badge replaces provenance;
- provenance is detached from the fact or mapping it supports;
- UI implies approval, suitability, equivalence, certification, supplier listing, stock, price, availability, or lead time.

## Spec changes

Update provenance section:

- record provenance;
- fact provenance;
- identifier mapping provenance;
- provenance display requirements in result row, trace, and detail;
- banned trust labels.

## Required tests

Resolver/data benchmark:

- every record has origin/source provenance;
- every mapping has provenance;
- displayed facts used by row/detail have provenance or declared synthetic origin;
- non-unique mapping evidence preserves mapping provenance.

Browser tests:

- provenance visible in row/detail/trace;
- no verified/confidence/approved/certified labels;
- no Product/Offer/supplier structured data.

Adversarial cases:

- missing provenance rejects bundle or produces catalog_unavailable;
- mapping provenance missing;
- non-unique evidence shown as preferred list;
- external supplier name leaks into synthetic POC UI.

Domain review:

- provenance wording is clear and not overclaiming;
- mapping and fact provenance are distinct.

## Deferred

- real-source import timestamp;
- release history;
- correction/withdrawal state;
- field-level source conflict resolution beyond selected POC scope.

---

# 7. Comparison-ready result rows

## Product behavior

Result rows must show enough family-specific typed fields for first-pass confirmation.

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

Rows remain catalog records.
A row is not approval, suitability, equivalence, replacement, supplier listing, offer, or selection.
A one-row non-exact result still does not highlight, select, or open detail.

## Acceptance criteria

Pass if:

- rows show the canonical typed fields above;
- row order is deterministic;
- rows stay readable at desktop and 320 CSS px;
- activation target is accessible;
- exact highlight does not change row facts;
- one-row non-exact result does not auto-select;
- no compare mode or shortlist/cart/BOM/export controls appear.

Fail if:

- rows hide datum or provenance;
- cross-family list implies equivalence;
- row title merges facts in a way that changes meaning;
- row becomes recommendation or selection.

## Spec changes

Update result row section:

- define comparison-ready row fields for current families;
- state no separate compare mode now;
- state row is activation control only;
- preserve prohibited-claim boundary.

## Required tests

Resolver/browser benchmark:

- `socket head screws` shows 10 rows with canonical fields;
- `M6 stainless socket head screws` shows two rows with canonical fields;
- `M8 30 mm black oxide button head screws` shows one row with no selection/detail;
- `screws` cross-family list shows family and datum for each row;
- exact-ID highlighted row keeps same fields.

Browser tests:

- desktop dense fields visible;
- 320 CSS px stacked row preserves identifier, family, thread/pitch, length datum, material, finish, provenance;
- activation accessible name is clear;
- prohibited controls absent.

Adversarial cases:

- one-result auto-open;
- row without datum;
- row without provenance;
- cross-family equivalence language;
- hidden critical fields on mobile.

Domain review:

- row fields are sufficient for first-pass exact identifier confirmation;
- wording does not imply suitability or replacement.

## Deferred

- explicit compare mode;
- pinned columns;
- export/copy comparison;
- saved rows;
- shortlist/favorite/cart/BOM;
- cross-family comparison;
- adjacent candidates.

---

# Cross-delta validation gate

Before implementation changes, the spec must require:

1. Deterministic benchmark.
2. Browser tests.
3. Adversarial cases.
4. Domain review.

The gate must cover:

- exact-ID unique/unknown/non_unique;
- highlight versus selection;
- interpretation trace contents;
- unsupported and conflict trace states;
- unit and datum truth;
- smart-filter visibility and zero states;
- provenance per record/fact/mapping;
- comparison-ready row fields;
- keyboard/focus behavior;
- 320 CSS px row behavior;
- prohibited claims/controls absence.

## Do not test yet

Do not add test requirements for:

- runtime AI/agents;
- fuzzy/semantic ID search;
- supplier/pricing/availability/BOM/procurement;
- equivalence/replacement/substitute;
- CAD download/generation;
- full compare mode;
- universal unit conversion;
- ranges/min/max;
- new families.

## Wayfinder impact

This gate resolves the next decision shape.

Recommended next action, if Jay approves:

Update the product contract / technical specification with this delta.

Do not create implementation tickets until the spec update is reviewed and accepted.

## Readiness verdict

READY FOR SPEC UPDATE
