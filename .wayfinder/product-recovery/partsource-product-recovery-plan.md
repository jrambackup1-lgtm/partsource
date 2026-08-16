# PartSource Product Recovery Plan

**Status:** Execution closeout current through 2026-08-16 — implementation/proxy gates recorded; adversarial re-verified; recovered candidate deployed and byte-verified in production
**Authority boundary:** `research/product-contract.md` remains the sole current product contract until Jay explicitly approves a reviewed change.
**Scope of this document:** Product archaeology, recovery decisions, target architecture, phased implementation order, and validation gates.
**Not included:** Product authority changes, supplier integrations, runtime AI, or permission to ship BOM/workspace behavior. `research/product-contract.md` remains sole authority.

---

## 1. Executive decision

PartSource should not restore the old application wholesale, and it should not keep polishing the current POC shell.

The right recovery target is:

> A focused, deterministic mechanical-component catalog product with a modern engineering catalog workspace around the current truth kernel.

The catalog remains the product kernel:

`query → catalog level → family → filters → result list`

Exact-ID behavior remains:

`exact ID → correct catalog/family context → full relevant result list → exact row highlighted → user explicitly selects`

The POC solved the interaction contract. It did not solve product presentation, scalable catalog data, real-data authority, or repeat-use engineering continuity.

The recovery therefore separates three layers:

1. **Catalog truth kernel — build now.** Deterministic navigation, family schemas, typed facts, exact mappings, filters, result list, selection, detail, and provenance.
2. **Engineering continuity — validate before shipping.** Saved work, project lists, notes, quantities, and eventually BOM preflight.
3. **Commercial layer — deferred.** Suppliers, prices, stock, lead time, quote, ordering, brokerage, approved alternates, and equivalence.

The first layer is authorized by the current product contract. The second needs evidence and an explicit contract change. The third is not part of this recovery.

### Product-shell decision

Restore a **small real product shell**, not a pretend platform:

- Home
- Catalog
- contextual data/provenance information
- persistent global search

Do not initially restore:

- dashboard KPI cards;
- empty Workspace/BOM navigation;
- supplier, quote, order, admin, or account destinations.

A Workspace destination appears only after persistent work is validated and authorized. Before that, Home is a start surface, not a dashboard.

---

## 2. What the original PartSource was trying to do

The earliest PartSource direction was broader than the current contract. It combined:

- decoding partial and exact mechanical-part clues;
- finding the underlying mechanical configuration;
- comparing alternatives and suppliers;
- collecting parts into a local BOM;
- preparing a sourcing handoff;
- eventually earning through brokerage, supplier relationships, or high-intent catalog traffic.

The useful insight was not “build a procurement marketplace.” It was:

> Mechanical-part lookup is rarely an isolated search. Engineers need to move from an imperfect clue to a technically legible configuration and preserve the result for later work.

That insight produced valuable product ideas:

- a modern PartSource shell;
- global search;
- browsable component categories;
- dense specification presentation;
- technical part detail;
- local saved work/BOM continuity;
- responsive engineering UI.

But the original implementation mixed those good ideas with unsupported authority:

- simulated price, stock, savings, lead time, and suppliers;
- “approved” or “verified” language;
- equivalence and replacement implications;
- quote, order, fulfillment, and brokerage flows;
- fuzzy or fallback resolution that could present a guessed result as the answer;
- direct navigation to isolated part detail.

That broader product was visually closer to a product, but semantically unsafe.

---

## 3. What exists now

### Current runtime

The current local release candidate is a modern React **Home + Catalog** product shell in `web/src/`, backed by the extracted deterministic catalog package, parser, index, query/exact/filter/facet engine, URL/history model, and a finalized synthetic screw package. The older `web/src/poc/` implementation remains a regression oracle; it is no longer the target shell. The active catalog remains synthetic and is labelled as such.

### What it proves

- Query text is preserved.
- Supported terms become typed filters.
- Filters are deterministic AND constraints.
- Conflicts, unsupported terms, empty results, mapping collisions, unknown IDs, invalid URL state, and catalog failure fail closed.
- Exact IDs resolve before descriptive parsing.
- A unique exact mapping returns the correct family list and highlights the mapped row.
- Exact highlight is separate from explicit user selection.
- Detail opens only after explicit row activation.
- URL, Back, focus, scroll, desktop detail, and narrow-modal behavior have deliberate handling.
- Synthetic origin and mapping/fact provenance are represented.
- No runtime AI or agents run.

### What it does not prove

- A scalable category hierarchy.
- Production family schemas.
- Real mechanical truth.
- Real identifier authority.
- Engineer usability or repeated value.
- A viable workspace/BOM job.
- A commercial business model.

### Current release-candidate verdict

The local candidate now presents the focused technical catalog shell rather than the acceptance-harness composition: hierarchy and family choice are legible, facets and an aligned table precede diagnostics, exact highlight remains distinct from selection, and contextual detail opens only after user action. Broad `stainless`, `button head`, and `countersunk` fail closed; the exact published phrase `A2 stainless` is supported by the synthetic fixture.

Application and catalog identities are separate. The built application uses closed `/release.json` metadata (`sourceSha`, `builtAt`, and artifact-manifest link) plus a byte-verifiable artifact manifest. The UI separately exposes catalog `releaseId` and finalized SHA-256 digest. These are verified local candidate properties only: this closeout does **not** claim a production deployment or successful live endpoint.

---

## 4. Earlier implementations and artifacts

### 4.1 Initial mockup — `42b03a0`

This version established:

- a recognisable product home;
- search as the primary action;
- a part-detail destination;
- a broader “find and source” thesis.

It was useful as concept proof, but was too eager to turn a query into an answer.

### 4.2 Dashboard/SaaS shell — `7dfdf1e` and `997ed5a`

This direction added:

- header and sidebar navigation;
- modern card layout;
- dashboard framing;
- BOM, sourcing, order, and supplier concepts;
- a more polished visual system.

It looked like a real application, but the shell implied capabilities and authority the product did not have. Dashboard totals, sourcing overview, savings, suppliers, and orders were platform theatre.

### 4.3 Most mature historical UI — `f141c69`

This is the best historical source for selective reuse. It contained:

- a mature responsive header and sidebar;
- semantic design tokens;
- keyboard and accessibility foundations;
- technical home/search composition;
- detail with schematic and structured specifications;
- local BOM domain and persistence concepts;
- domain work around exact units, taxonomy, material semantics, standards, lifecycle, and provenance.

It was still behaviorally wrong for the current product:

- search could navigate directly to isolated detail;
- identity resolution and fallback logic could overreach;
- supplier/BOM/quote behavior remained coupled to discovery;
- data and trust claims exceeded current authority.

Important history finding: `f141c69` and the deterministic POC commit `d116ab1` diverge from an earlier merge base. The mature UI was not simply the previous state of the current branch. It must be mined selectively, not merged or restored wholesale.

### 4.4 Archived UX prototypes

The strongest artifacts are:

- `001-family-faceted-catalog` — best family layout: visible context, facets, dense table, exact-row emphasis;
- `002-behavioral-family-workspace` — useful requirement strip and progressive narrowing, but too control-panel-like;
- `003-family-geometry-workbench` — useful family orientation diagram, but geometry must not imply source evidence;
- `003-exact-configuration-passport` — strongest field-to-evidence interaction, but too much passport/release authority for the default page;
- `004-compare-first-spec-lab` — useful secondary compare pattern, not the primary flow.

These are design evidence, not current authority.

---

## 5. Exactly what was lost

### Lost and valuable

1. **A coherent product frame**
   - stable brand/header;
   - persistent global search;
   - deliberate navigation;
   - desktop and mobile structure.

2. **A useful first-use experience**
   - browseable categories;
   - example queries;
   - scope explanation;
   - a clear reason to use the product.

3. **Catalog legibility**
   - category and family discovery;
   - compact technical graphics;
   - dense, aligned specification comparison;
   - a sense of progression rather than one long result dump.

4. **Strong selected-part composition**
   - clear identity;
   - grouped specifications;
   - drawing/schematic region;
   - related or neighboring configurations;
   - context-preserving detail.

5. **Engineering continuity**
   - local saved selections;
   - quantity and notes;
   - return to prior work;
   - export/backup concepts.

6. **Reusable frontend foundations**
   - design tokens;
   - component states;
   - focus and keyboard patterns;
   - responsive behavior;
   - exact-unit and domain validation ideas.

### Lost deliberately — and correctly

- automatic answer/detail selection;
- fuzzy identifier resolution;
- first-result fallback;
- simulated suppliers, prices, stock, lead times, and savings;
- equivalence/replacement language;
- approved/verified badges without authority;
- quote, order, fulfillment, and brokerage flows;
- pSEO pages presenting theoretical or generated combinations as real products;
- runtime AI/agent interpretation.

These must stay gone.

---

## 6. Current industry patterns and what PartSource should learn

### McMaster-Carr

Observed/documented patterns:

- global search plus a stable category tree;
- family-specific catalog progression;
- exact part numbers leading to detailed technical information and CAD;
- order/procurement features separated from basic browsing.

Lesson for PartSource:

- search and browse must be equally real entry paths;
- category/family context should remain visible;
- technical detail and CAD belong to an exact selected configuration;
- do not copy commercial behavior without commercial data.

Official references:

- https://www.mcmaster.com/
- https://www.mcmaster.com/cad-models/
- https://www.mcmaster.com/help/api/

### MISUMI

Documented pattern:

- users move from product/family to specification and dimensions;
- a full part number emerges only after the configuration is sufficiently specified;
- CAD preview/download belongs to the resolved configuration.

Lesson:

- distinguish family/model from exact configuration;
- expose unresolved configuration state;
- do not attach exact-part assets to an incomplete selection.

Official references:

- https://us.misumi-ec.com/guide/category/first/ecatalog.html
- https://us.misumi-ec.com/guide/category/ecatalog/use_cad.html

### TraceParts

Observed pattern:

- category hierarchy and visible facets;
- standards and CAD availability as useful filters;
- family identity, viewer/drawing, exact part number, and a family-specific variant table on one page.

Lesson:

- this is the closest composition model for PartSource;
- use a family-specific technical table synchronized with selected-part detail;
- keep CAD format selection in detail, not repeated in every row.

Official references:

- https://www.traceparts.com/en
- https://www.traceparts.com/en/catalogs

### DigiKey/Mouser

Documented patterns:

- category-specific parametric search;
- aligned result tables;
- explicit compare and cross-reference modes;
- BOM tools preserve original rows and expose match state.

Lesson:

- use family-scoped filters and aligned rows;
- comparison must be explicit and relation-labelled;
- any future batch workflow must preserve raw input and never silently substitute.

Official references:

- https://www.digikey.com/en/articles/how-to-use-digi-key-part-search
- https://www.digikey.com/en/help-support/products/cross-reference-tool
- https://www.mouser.com/en/bomtool/

### Octopart/Altium

Documented pattern:

- engineering identity/specification is conceptually separate from supplier offers and supply-chain state;
- BOM matching, lifecycle, compliance, price, and availability are downstream layers.

Lesson:

- PartSource should copy the separation, not the procurement feature count;
- technical catalog truth must not be overwritten by supplier/offer data;
- saved work should be release-aware before it becomes an engineering handoff artifact.

Official references:

- https://octopart.com/
- https://octopart.com/bom-tool
- https://www.altium.com/documentation/altium-365/bom-portal

### Mechanical-engineer expectation versus buyer expectation

Mechanical engineers primarily need:

- geometry and function;
- dimensions, units, datums, tolerances, fits, loads, material, finish, grade/class, and standards scope;
- technical drawings and CAD;
- clear unknowns;
- comparison inside one coherent family.

Buyers primarily need:

- manufacturer and supplier identity;
- price, pack, MOQ, stock, lead time, lifecycle, compliance, and approved-source status.

PartSource must default to the first job. The second is a separate future system layer.

---

## 7. Target product architecture

### 7.1 Publication and catalog-release layer

Produces one immutable, validated catalog package containing:

- package schema version;
- catalog release ID and digest;
- publication timestamp and allowed-use classification;
- category hierarchy;
- family definitions and family-schema revisions;
- typed field definitions;
- configurations and immutable revisions;
- identifier namespaces and mappings;
- fact and mapping provenance;
- search lexicon and alias rules;
- deterministic ordering policy.

The browser consumes a published package. It does not make publication decisions.

### 7.2 Deterministic catalog domain

Pure, browser-free modules:

1. **Catalog package validator** — accepts unknown input and fails closed.
2. **Catalog index** — hierarchy, family, record, identifier, facet, and provenance indexes.
3. **Query interpreter** — original query, normalization, supported typed terms, conflicts, unsupported terms.
4. **Exact identity resolver** — namespace-specific normalization and zero/one/many mapping cardinality.
5. **Hierarchy resolver** — deepest safely supported category/family context.
6. **Filter/facet engine** — typed AND filters, family applicability, self-excluding facet counts, stable order.
7. **Catalog projector** — one complete view model for UI.

No React component should parse mechanical meaning.

### 7.3 Application workspace state

Owns user actions and browser behavior:

- query draft and submit;
- route hydration;
- filter add/change/remove;
- row activation;
- detail open/close;
- browser Back/Forward;
- focus and scroll restoration;
- catalog release mismatch.

Keep three different states:

1. `exactMatchRecordId` — unique identifier evidence;
2. `highlightedRecordId` — exact row currently visible;
3. `selectedRecordId` — explicit user action.

They must never collapse into one “current part.”

### 7.4 Presentation layer

Screen-level modules:

- Home/start;
- global search;
- catalog hierarchy;
- family header;
- active requirement/constraint strip;
- facets;
- result table;
- exact-match status;
- selected-part inspector;
- provenance/evidence sheet;
- fail-closed states;
- responsive and accessibility behavior.

### 7.5 Optional local engineering workspace

This is a separate application module and storage boundary. The catalog engine does not depend on it.

If authorized later, each saved line should contain:

- raw requirement/query;
- accepted typed constraints;
- unresolved/conflicting terms;
- explicitly selected configuration revision;
- catalog release ID and digest;
- frozen displayed facts and provenance references;
- quantity and user notes;
- snapshot timestamp and stale/withdrawn state.

A workspace item is not approval, suitability, equivalence, procurement readiness, or supplier availability.

---

## 8. Screen and interaction specification

### 8.1 Main/Home

#### Initial authorized version

Purpose: start a query or enter the catalog.

Composition:

1. compact header with PartSource identity and global search;
2. plain-language product statement;
3. example inputs for broad, family, dimensional, and exact-ID cases;
4. Browse catalog section using real supported hierarchy;
5. supported-scope and data-status notice;
6. clear synthetic notice while the dataset remains synthetic.

Do not show:

- fake activity;
- savings or cost metrics;
- order, supplier, or quote state;
- empty project cards;
- vanity catalog counts presented as trust.

#### Later start/resume version

Only after Workspace is authorized:

- recent named local projects;
- last modified time;
- unresolved-line count derived from actual data;
- explicit resume action.

This is still not an enterprise dashboard.

### 8.2 Search

Search is a global input that changes the active catalog view.

It may offer deterministic suggestions grouped as:

- catalog levels;
- families;
- supported typed values;
- exact identifiers;
- examples/help.

Rules:

- preserve original user text;
- show normalization and applied terms on demand;
- never silently add specific facts from broad terms;
- never fuzzy-select an identifier;
- unknown/ambiguous exact IDs highlight nothing;
- query submission always lands in catalog context, never an isolated detail page.

### 8.3 Progressive catalog

#### Broad category state

Example: `screws`.

Show:

- breadcrumb and category title;
- supported child categories/families with short geometry/function descriptions;
- result count and optional category-wide result table only when useful;
- Family as a first-class choice/filter;
- preserved query and active constraints.

The family step must be visually legible. A generic select labelled “Add” is not enough.

#### Family state

Example: `socket head cap screws`.

Show:

- breadcrumb;
- family title and concise functional definition;
- small orthographic family glyph or source-backed drawing;
- supported standards scope only when evidenced;
- active requirement strip;
- family-specific facets;
- dense result table;
- selected-part inspector only after explicit selection.

A diagram is orientation unless its dimensions have provenance. Never use “Scale 1:1” unless that is literally controlled and true.

### 8.4 Filters

Use family-schema-defined controls.

For a screw family, likely fields include:

- thread system/form;
- nominal diameter;
- pitch/TPI;
- nominal length and datum;
- head/drive form;
- material designation;
- property class/grade;
- finish/treatment;
- standard edition/scope, only when supported.

Behavior:

- clear labels and units;
- counts under all other active filters;
- active values as editable chips or compact rows;
- replace/remove without retyping query;
- unavailable/zero states explained;
- unknown values visible as coverage, never treated as a match;
- original query remains unchanged.

### 8.5 Result tables

Use tables for variant-heavy families, not repeated cards.

Required behavior:

- family-specific columns;
- identity column pinned;
- sticky header;
- compact row height;
- stable deterministic sort;
- aligned dimensions with units;
- visible result count;
- keyboard row activation;
- selected and exact-highlight states visually distinct;
- responsive compact-row fallback on narrow screens.

Typical screw columns:

- Identifier
- Thread
- Pitch
- Length
- Length datum
- Material
- Grade/class
- Finish
- Standard, if supported
- CAD/drawing availability, if real and source-backed

Do not turn every available fixture field into a column. Column choice must reflect observed engineer decisions and family profile requirements.

### 8.6 Exact-ID behavior

Exact-ID search stays in the family workspace.

Show a compact status strip above results:

- Exact identifier match
- submitted identifier
- namespace/source
- mapped family
- “Highlighted, not selected”

Then:

- keep the full relevant family list visible;
- scroll or provide “Jump to exact match” without losing context;
- highlight the exact row in amber with icon and text;
- do not open detail;
- click/Enter explicitly selects and opens detail;
- filtering may hide the visible highlight but must not rewrite mapping evidence;
- unknown/non-unique mappings highlight nothing and explain the safe next action.

### 8.7 Part detail

Desktop: contextual inspector or split panel.
Mobile: full-screen sheet/dialog with correct focus and Back restoration.

Composition:

1. exact displayed identifier and configuration title;
2. explicit “Selected” state;
3. family glyph/drawing/CAD preview when real and source-backed;
4. grouped facts:
   - identity;
   - geometry/dimensions;
   - thread/interface;
   - material/finish/strength;
   - standards scope;
5. unknown/conflicting/not-supplied states;
6. source summary;
7. field-level evidence interaction;
8. neighboring configurations or Compare action only when schema-bounded.

Do not show:

- supplier search;
- price, stock, lead time;
- suitability or approval;
- equivalents or replacements;
- quote/order actions;
- raw internal record IDs as the primary presentation.

### 8.8 Compare

Compare is secondary and explicit.

Rules:

- user selects a small set from the same coherent family/schema;
- reference configuration is pinned;
- differing values are emphasized;
- unknowns remain visible;
- relationship is labelled honestly;
- visual proximity never implies interchangeability.

Do not make comparison the default result view.

### 8.9 BOM/Workspace role

#### Current decision

Do not implement or expose BOM/Workspace in the first recovery release. The current product contract explicitly excludes it.

#### Proposed future role

A local, user-owned engineering continuity layer:

- named project/workspace;
- saved explicit selections;
- raw requirement or original BOM line;
- quantity and notes;
- unresolved terms/conflicts;
- release-bound frozen snapshot;
- backup/export/import after a separate safety design;
- stale/withdrawn catalog indication.

If batch input is added, each row must preserve the original cells and receive one deterministic state:

- exact;
- partial;
- conflict;
- unsupported;
- unknown;
- processing failure.

No row disappears. No match is silently substituted. No aggregate readiness score is shown.

#### What BOM is not

- supplier comparison;
- price rollup;
- approved BOM;
- procurement readiness;
- equivalent-part list;
- quote/order workflow;
- PLM/ERP/MRP replacement.

Workspace/BOM may ship only after direct-user evidence and an explicit change to `research/product-contract.md`.

### 8.10 Provenance

Provenance should be present but progressive.

#### Default surface

- source type: synthetic, manufacturer, supplied/private-authorized, standard bibliographic fact, or other approved class;
- catalog release/version;
- concise record source state;
- source-backed/unknown markers where decision-relevant.

#### Field evidence sheet

On field activation, show:

- field name and normalized value;
- original source value/notation when public-safe;
- source organization/type and canonical record reference;
- transformation/conversion rule;
- retrieval or publication time;
- catalog/configuration revision;
- what the evidence supports;
- what it does not prove.

Identifier mapping evidence stays separate from fact evidence.

#### Diagnostics

Raw resolver trace, internal IDs, mapping IDs, package references, and all provenance references belong in an opt-in diagnostics view—not above filters or results.

Never use a single opaque “confidence” score.

---

## 9. Modern visual and UX direction

The visual target is a **technical engineering workspace**, not generic SaaS, e-commerce, or prototype lab.

### Principles

- decision density, not decorative density;
- family context and result differences above product chrome;
- clear status hierarchy;
- compact but readable;
- excellent keyboard use;
- desktop optimized for scanning, mobile optimized for lookup and inspection.

### Visual system

- near-white canvas;
- graphite/navy structure;
- technical blue for interaction and explicit selection;
- amber for exact highlight;
- green only for narrowly supported positive states, never vague trust;
- thin neutral rules, minimal shadow;
- 6–10 px radii, no oversized pill-heavy layout;
- tabular numerals and monospace for identifiers/dimensions;
- restrained orthographic line graphics;
- consistent 8 px spacing rhythm;
- 1240–1440 px desktop workspace;
- 14 px minimum operational text;
- motion only for focus, selection, sheet transitions, and jump-to-match.

### Layout

Desktop family workspace:

- 220–260 px facets;
- fluid result table;
- 400–460 px inspector only when selected.

The table should not remain permanently compressed by an empty inspector.

Mobile:

- sticky search and context;
- filters in a sheet;
- compact two-line rows;
- detail as full-screen modal/sheet;
- 44 px touch targets;
- no horizontal page overflow.

The visual language can aspire to instrument-like clarity. Product claims must remain “synthetic catalog demo” until real source and domain gates pass.

---

## 10. Restore, redesign, delete, keep, and defer

### Keep from the current deterministic engine

- exact-before-text resolution;
- zero/one/many identifier cardinality;
- exact highlight separate from selection;
- strict AND filters;
- conflicts and unsupported terms;
- no first-result fallback;
- fail-closed invalid URL/catalog states;
- original-query preservation;
- current URL, history, focus, and scroll behavior;
- synthetic golden fixture, collision fixture, and acceptance corpus;
- distinct record, fact, and mapping provenance concepts;
- no runtime AI/agents.

### Restore selectively

From `f141c69` and archived prototypes:

- mature design tokens and UI primitives;
- responsive header/global search;
- accessibility patterns;
- family-oriented technical graphics;
- dense family table composition;
- contextual detail composition;
- exact rational/unit concepts;
- taxonomy/material/provenance/lifecycle validation ideas;
- local-workspace persistence patterns only after redesign.

### Redesign

- Home into start/resume rather than dashboard;
- hardcoded hierarchy into a versioned data-driven tree;
- flat record type into family schemas and typed facts;
- generic filters into family-scoped facets with counts;
- cards into result tables;
- raw trace into compact interpretation plus diagnostics;
- detail into a grouped contextual inspector;
- provenance into claim-level evidence;
- saved work into immutable release-bound snapshots;
- historical BOM into engineering continuity/preflight.

### Delete permanently

- fake dashboard KPIs;
- simulated suppliers, prices, stock, lead time, savings, and totals;
- quote, order, fulfillment, brokerage, and admin theatre;
- approved/verified trust badges without authority;
- fuzzy exact-ID matching;
- first-result/custom-part fallback;
- isolated search-to-detail route;
- equivalence/replacement language;
- generated theoretical products presented as catalog facts;
- McMaster-first identity assumptions;
- supplier and cost fields inside the engineering record;
- raw provenance dumps in the default UI.

### Defer

- accounts/cloud sync;
- Workspace/BOM;
- import/export and collaboration;
- comparison beyond a small same-family mode;
- CAD files and downloads;
- supplier offers and procurement;
- pSEO;
- broader mechanical domains;
- enterprise administration.

---

## 11. Phased implementation order

This is an implementation sequence, not a ticket list.

### Phase 0 — Recovery authority and release truth

Decide and record:

- current contract remains authoritative for catalog recovery;
- POC is the behavioral fixture, not the target UI architecture;
- Workspace/BOM is a proposed later contract extension;
- commercial scope remains excluded;
- unsafe aliases require review rather than automatic inheritance;
- application release identity and catalog release identity are separate.

Also restore verifiable production release identity before making professional release claims.

**Gate:**

- no contradiction among product contract, PRD, plan, and public copy;
- `/release.json` or its approved replacement returns immutable application identity;
- exact synthetic bundle identity is separately visible;
- no use of “verified,” “precision instrument,” “approved,” or “production catalog” beyond evidence.

### Phase 1 — UX recovery prototype

Design and test the target composition on synthetic data:

- Home/start;
- broad catalog;
- family workspace;
- filters;
- dense table;
- exact highlight;
- selected-part inspector;
- provenance evidence sheet;
- narrow-screen behavior.

Test table, inspector, and family-step clarity independently. Do not assume the archived layout wins.

**Gate:**

- users identify active category/family without coaching;
- exact highlight is found quickly and not confused with selection;
- table improves comparison rather than merely increasing visible fields;
- diagnostics never push results below the first working viewport;
- no interface structure implies supplier, suitability, equivalence, or approval.

### Phase 2 — Production catalog contracts

Define and validate:

- release manifest and digest;
- hierarchy;
- family schemas;
- typed facts, units, tolerances, and datums;
- immutable configurations/revisions;
- identifier namespace/mappings;
- provenance and public/private evidence references;
- lexicon/aliases;
- facet definitions.

Represent the current synthetic fixture in the new contract without changing behavioral outcomes.

**Gate:**

- closed runtime schema from `unknown` input;
- no duplicate/dangling identity;
- family-field leakage rejected;
- unknown/not-supplied/not-applicable/conflict states represented;
- namespace-specific identifier normalization;
- package replay is deterministic;
- current fixture and adversarial corpus pass.

### Phase 3 — Deterministic engine extraction

Separate:

- query interpreter;
- exact identity resolver;
- hierarchy resolver;
- facet engine;
- projector/view model;
- URL parser;
- application transition model.

Migrate current behavior without semantic expansion.

**Gate:**

- no React component interprets mechanical meaning;
- exact highlight and explicit selection remain separate under all transitions;
- Back/Forward, refresh, direct URL, focus, and scroll preserve behavior;
- no runtime network/AI dependency;
- current acceptance behavior remains green.

### Phase 4 — Product shell and catalog UI

Build the approved Home and Catalog shell around the extracted engine:

- persistent global search;
- real hierarchy browsing;
- family workspace;
- family-specific facets and table;
- exact status and highlight;
- contextual detail;
- progressive provenance;
- responsive/accessibility foundation.

Keep the data visibly synthetic until Phase 5 passes.

**Gate:**

- core workflow works by search and browse;
- users can complete broad, family, constrained, exact, unknown, collision, conflict, unsupported, and empty tasks;
- no non-exact query auto-selects;
- no exact query opens detail;
- no unsafe alias becomes a specific fact;
- keyboard and mobile behavior pass;
- product has no empty/fake destinations.

### Phase 5 — Lawful real-family pilot

Use only a separately reviewed source package approved by `research/data-source-register.md`.

Required work:

- independently reconcile import counts and samples;
- approve family inclusion/exclusion boundaries;
- approve required and optional fields;
- retain raw supplied values and transformations;
- review identifier namespaces/collisions;
- bind source evidence, schema, rules, and review to a release digest;
- define correction, withdrawal, rollback, and old-release replay.

**Gate:**

- at least one bounded family is lawfully publishable;
- qualified mechanical review approves the exact release digest;
- zero critical false unique matches;
- zero silent selection-critical mutation/default;
- all public facts and mappings have permitted provenance;
- confidential origin cannot leak;
- historical/synthetic data does not contaminate the real release.

If this gate fails, PartSource remains a clearly labelled synthetic product demo.

### Phase 6 — Direct engineer value validation

Run 6–8 practicing engineers through recent, safely redacted, participant-owned tasks:

- broad family discovery;
- dimensional narrowing;
- exact-ID confirmation;
- comparison of near variants;
- unknown/conflict state;
- provenance lookup.

Compare against their normal workflow.

**Gate:**

- majority complete the target task without facilitation;
- majority find a repeated use case;
- exact lookup is not slower or less clear than the normal method;
- majority correctly explain highlight versus selection and known versus unknown;
- zero confident false selections;
- users identify a concrete next action or reusable artifact.

If the tool is only more polished, stop expansion.

### Phase 7 — Workspace/BOM hypothesis

Only after Phases 5 and 6:

- test saved discovery work first;
- test batch/BOM preflight separately;
- test local data safety, backup, migration, deletion, and stale-release behavior;
- use real redacted 5–15-line inputs;
- compare against one-at-a-time resolution.

**Gate for a contract change:**

- repeated return/resume value is observed;
- majority prefer retained work to repeating lookup;
- batch processing reduces meaningful work, not only screen transitions;
- zero critical false matches or dropped raw lines;
- handoff artifact remains understandable later;
- privacy and lifecycle design is accepted;
- `research/product-contract.md` is explicitly reviewed and changed.

If the gate fails, keep PartSource as a focused catalog utility.

### Phase 8 — Independent expansion decisions

Treat each as a separate business/product decision:

- more families;
- more mechanical domains;
- CAD;
- accounts/cloud sync;
- collaboration;
- suppliers/offers;
- procurement;
- pSEO.

None follows automatically from catalog success. Expansion is outside the eight-phase recovery closeout (Phases 0–7).

### Current execution ledger — eight recovery phases

Status terms: **closed** = implemented and covered by repository evidence; **proxy-closed** = strongest lawful/local automated substitute completed but required external evidence is absent; **external-blocked** = cannot truthfully close without permission, qualified review, participants, or an explicit authority change.

| User phase | Plan phase | Current status | Evidence and executable gate | External gap / current decision |
|---:|---:|---|---|---|
| 1 | 0 — authority and release truth | **closed (production-verified)** | `research/product-contract.md` remains sole authority; `research/release-truth.md` records the verified deployment (run 31926209080, source `01a214b`, artifact digest `016698c7…bb9a`, 11/11 live bytes verified 2026-08-16); release and catalog identities separately surfaced | Catalog remains synthetic by design; real-family publication still external-blocked |
| 2 | 1 — UX recovery | **proxy-closed** | `evidence/ux-prototype-decision.md`; production Home/Catalog Playwright scenarios in `npm run test:browser` (8/8 green, 2026-08-16) | No practicing-engineer or assistive-technology participant evidence |
| 3 | 2 — catalog contracts | **closed for synthetic scope** | closed package parser, finalized catalog SHA-256, trusted approval boundary, adversarial/truth-state tests in `npm run test:catalog` | Contract self-consistency is not real mechanical truth or publication permission |
| 4 | 3 — deterministic engine | **closed for synthetic scope** | engine, exact-revision, facets, URL v2/history and regression suites in `npm run test:catalog`; runtime boundary in `npm run test:boundary`; adversarial re-verification 2026-08-16 confirms zero forbidden vocab, fail-closed conflicts, strict URL allowlist, canonical digest, CI/local boundary | No external domain review; no runtime AI/network dependency |
| 5 | 4 — product shell and catalog UI | **closed for synthetic release candidate** | modern Home/Catalog shell; exact highlight-not-select, explicit selection, spec-published family routing aliases, failure states, keyboard/mobile flows in eight Playwright tests; spec-contradicting alias test fixed 2026-08-16 | Human usability/accessibility validation remains open |
| 6 | 5 — lawful real-family pilot | **proxy-closed / external-blocked** | `evidence/phase-6-lawful-pilot.md`; permission-attested aggregate-only pilot tooling, `test-pilot-boundary.ts`; **real bounded aggregate audit 2026-08-16**: 27,009 records across 3 families (hex-head-screws 8,850 / rounded-head-screws 10,295 / socket-head-cap-screws 7,864), zero duplicates/dangerous fields, one structural blocker (112 blank identifiers in SHCS), mixed in/mm unit fields flagged for review | No candidate family has passed field mapping, mechanical review, exact-digest approval, and publication-boundary review. Remain synthetic; no real-family completion claimed |
| 7 | 6 — direct engineer validation | **proxy-closed / external-blocked** | `evidence/engineer-validation-proxy.md` replays bounded scenarios from automated engine/browser evidence | No external engineer participants; external-human gate is **OPEN** |
| 8 | 7 — Workspace/BOM hypothesis | **external-blocked; DEFER** | `evidence/workspace-bom-decision.md` and current contract exclusion | No implementation, route, storage, or claim. Requires prior real-family and engineer gates plus explicit review/change of `research/product-contract.md` |

Repository verification for this closeout is `cd web && npm run release:audit`, which covers TypeScript lint, POC/catalog/release suites, document guard, Vite build, eight Playwright tests, and runtime boundary. This is candidate evidence, not external validation, mechanical approval, publication permission, or production deployment evidence.

---

## 12. Validation gates summary

### Truth

- no invented fact, record, mapping, or default;
- no specific grade/material/drive inferred from a broader clue without an approved rule;
- no exact highlight without one supported mapping;
- no supplier/equivalence/suitability/approval implication;
- every displayed fact and mapping has release-bound provenance.

### Behavior

- core progression always remains visible;
- family choice is explicit;
- filters are family-scoped and deterministic;
- non-exact search never selects;
- exact search highlights in context and waits;
- selection/detail is explicit;
- invalidation clears selection safely;
- URLs and browser history are deterministic.

### UX

- category/family understood without coaching;
- relevant row found quickly;
- users can compare near variants;
- exact highlight and selection are not confused;
- results and filters appear before diagnostics;
- desktop and mobile preserve the same meaning.

### Data

- package parsed from untrusted input;
- hierarchy and family schemas versioned;
- typed units/datums/tolerances retained;
- mappings namespace-qualified and collision-safe;
- source permission covers public use;
- release digest reproducible;
- corrections/withdrawals do not rewrite history.

### Accessibility

- full keyboard workflow;
- visible focus;
- screen-reader announcements for result count, exact match, selection, and fail-closed states;
- 320 px reflow;
- 200% zoom;
- no color-only meaning;
- 44 px touch targets;
- focus and scroll return after detail;
- reduced-motion and forced-color support.

### Release

- application release identity independently fetchable;
- catalog release identity independently visible;
- production smoke confirms the deployed artifact;
- synthetic and real catalogs cannot be confused;
- rollback is documented and tested.

---

## 13. Internal challenge and resolved decisions

### Challenge: “Restore the old product shell now.”

Rejected as stated. A header, search, Home, and Catalog are justified. Sidebar/dashboard/BOM/supplier destinations are not justified until their jobs exist.

### Challenge: “Engineers like dense tables, so the table is decided.”

Partially rejected. A family-specific table is the strongest hypothesis and is supported by TraceParts/DigiKey patterns, but its columns and density must be tested against actual engineer decisions. More data is not automatically better.

### Challenge: “A contextual inspector makes it look professional.”

Rejected as a reason. The inspector stays only if it improves selected-part understanding without permanently crushing the table or giving synthetic data passport-like authority.

### Challenge: “BOM was part of the original goal, so bring it back.”

Rejected. Historical presence is not validation. BOM becomes a future engineering-continuity hypothesis and requires a contract change, user evidence, release-bound snapshots, and local-data safety.

### Challenge: “Provenance creates trust, so show all of it.”

Rejected. Raw provenance dumps create noise; glossy passports create false precision. Use claim-level evidence and opt-in diagnostics.

### Challenge: “A polished synthetic UI is a real product.”

Rejected. A polished synthetic catalog can be a credible demo and usability test surface. It is not an authoritative engineering catalog until real-source, family, review, and release gates pass.

### Challenge: “The current POC is correct because Tickets 32–42 passed.”

Rejected as a complete claim. The interaction contract is strong, but test success proves the encoded contract, not mechanical truth. The unsafe generic `stainless → A2` alias was removed; only the explicit synthetic-fixture phrase `A2 stainless` creates that typed constraint.

### Challenge: “PartSource needs a dashboard to feel substantial.”

Rejected. Substantial comes from solving the catalog decision well. A focused utility beats an empty platform shell.

### Final challenged direction

Continue with a modern, focused catalog product. Restore product quality, not old scope. Treat Home, family tables, and detail as hypotheses with explicit usability gates. Keep Workspace/BOM out of the first recovery release. Do not call the product authoritative until a real bounded family passes source and mechanical review.

---

## 14. Final recovery target

The approved target should be understood as:

> PartSource is a deterministic mechanical-component catalog navigator that helps an engineer enter at the right catalog depth, narrow a coherent family through typed filters, compare configurations in an aligned result list, inspect a selected record with evidence, and preserve context throughout. Exact identifiers highlight; users decide. No runtime AI guesses mechanical truth.

The initial product surface is Home + Catalog. A local Workspace/BOM layer is a later, separately validated continuity feature. Supplier and procurement behavior remain outside the recovery.

That is enough to become a real product without becoming a fake marketplace.
