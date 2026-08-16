# PartSource product directions reconciliation

**Date:** 2026-08-10  
**State:** Direction A approved by Jay; Ticket 30 behavioral prototype closed PASS  
**Mission:** Build and ship a credible deterministic PartSource progressive catalog POC  
**Evidence:** repository, runtime, dataset, proxy, and synthetic evidence only  
**Direct-user validation:** 0  
**Qualified mechanical approval:** 0  
**`/to-spec`:** not started

## Progressive catalog correction

No AI or agents run at runtime. Agents are development and orchestration tools only.

Direction A now uses a deterministic runtime:

`query → catalog level → family → filters → result list`

Exact ID opens the same family result list and highlights the exact item. It does not open an isolated part page.

The old ambiguity, missing-fact, conflict, isolated-result, and agent sections below are historical and superseded. Direction A and the Ticket 30 shell, dataset, responsive, selection, provenance, and fail-closed scope remain.

## Destination correction

The paid manual BOM ambiguity audit is not the PartSource product direction.

It remains a possible business experiment outside this product decision.

The PartSource mission remains:

> Build and ship a credible deterministic mechanical-component discovery POC with progressive catalog navigation.

Ticket 25 is evidence about unsafe authority and bad architecture. It is not evidence that the discovery mission must die.

## Reconciled product thesis

PartSource should help an engineer move from a query to the correct catalog depth and a filtered result list.

A clue can be:

- rough language;
- a partial specification;
- a known identifier;
- a standards designation;
- later, a photo plus measurements.

The product should:

1. parse the query into typed fields;
2. determine the deepest supported catalog level;
3. keep category and family context visible;
4. apply supported fields as filters;
5. show the relevant result list;
6. highlight an exact-ID match in that list;
7. let the engineer choose what to open or use.

The product is not an autonomous mechanical engineer.

The product is not a supplier catalog.

The product is not a manual BOM-audit service.

## Smallest credible PartSource

The smallest credible PartSource is a **progressive mechanical-component catalog navigator**.

It has one primary screen and two core entry paths:

1. non-exact query → deepest supported catalog level → family → filters → result list;
2. exact ID → correct family and result list → exact item highlighted.

A user can select a candidate for the current task and save or copy a **discovery snapshot**.

A discovery snapshot is not a verified part, approved configuration, BOM-ready line, supplier match, or suitability decision.

## Product promise

Recommended promise:

> Turn an imperfect mechanical-component clue into inspectable candidate families or records, show what is known and unknown, and help you decide what to verify next.

Short version:

> From messy clue to inspectable candidate—without hiding uncertainty.

This is credible only if the POC demonstrates useful interpretation, transparent abstention, and fast candidate inspection.

## What PartSource must never claim

The POC must never claim:

- correct component selection;
- application suitability;
- fit, form, function equivalence;
- interchangeability or replacement;
- approved alternate;
- standards conformity beyond the exact source statement;
- certification;
- manufacturer or supplier listing without explicit sanctioned evidence;
- price, stock, availability, lead time, or best supplier;
- procurement readiness or BOM readiness;
- qualified mechanical review when none exists;
- broad mechanical-category coverage from a small fastener fixture;
- agent confidence as mechanical truth;
- one result because code chose the first duplicate;
- a missing fact filled by a common default.

The UI must not use `verified`, `safe`, `approved`, `available`, `equivalent`, or opaque confidence percentages.

## Common core workflow

### 1. Enter the clue

One input accepts rough language, dimensions, standards, and known identifiers.

No dashboard, featured-part grid, or chatbot ceremony.

### 2. Preserve and preflight

Deterministic code:

- stores the original clue;
- detects identifier-shaped input;
- parses supported dimensions and units;
- normalizes only under named rules;
- retains duplicate and conflicting occurrences;
- rejects empty normalized identity;
- creates explicit unsupported and unavailable states.

### 3. Ask bounded specialist agents

Use three runtime roles:

1. **Terminology interpreter** — proposes likely family terms and recognized aliases.
2. **Interpretation critic** — attacks silent defaults, conflicts, and unsupported conclusions.
3. **Question writer** — produces the smallest useful clarification when the state cannot narrow safely.

Each agent returns structured proposals tied to input spans or allowed evidence.

Agent agreement is not confidence.

### 4. Reconcile deterministically

A deterministic policy layer:

- preserves supplied facts as hard facts;
- rejects proposals that contradict supplied facts;
- prevents agents from creating technical values;
- applies hard constraints to the bounded candidate bundle;
- handles identifier cardinality as zero, one, or many;
- controls allowed claim language and actions.

### 5. Show the decision state

The engineer sees:

- original clue;
- supplied facts;
- deterministic parsed facts;
- agent-proposed interpretations;
- conflicts and unknowns;
- family candidates or exact-identifier state;
- compact candidate records;
- evidence scope and bundle limits;
- one next action.

### 6. Human choice

The engineer can:

- choose a family;
- accept, edit, or reject an interpretation;
- inspect or compare candidate records;
- select one candidate for this task;
- copy unresolved questions;
- copy or save a discovery snapshot.

PartSource does not make the final mechanical decision.

## Safe-enough POC data model

This is a semantic model, not a requirement for eight database tables.

### 1. Input clue

- original text or identifier;
- session-local ID;
- created time.

The original value is immutable.

### 2. Fact occurrence

- field;
- supplied display;
- normalized value when deterministic;
- state: `supplied`, `parsed`, `missing`, `not-applicable`, `not-normalized`, `conflicting`, or `unsupported`;
- origin: `user`, `deterministic-rule`, `source`, or `agent-proposal`;
- input span or evidence reference;
- rule version when derived.

Conflicts coexist. Nothing is last-wins.

### 3. Interpretation proposal

- proposed family or meaning;
- input span;
- rationale;
- agent role and run ID;
- state: proposed, accepted, edited, rejected, or contradicted.

An interpretation proposal is not a fact.

### 4. Family profile

- POC-scoped family ID and version;
- plain name and aliases;
- inclusion/exclusion summary;
- ordered discovery facets;
- supported parser rules;
- declared fixture limitation.

Before qualified approval, call it a **POC family profile**, not an approved taxonomy.

### 5. Source record

- immutable source-scoped identity;
- payload hash;
- permission/publication state;
- supplied values;
- private lineage where required.

A source record is not automatically a family or canonical configuration.

### 6. Candidate record

- POC bundle ID;
- one source record or an explicitly reviewed link set;
- family profile ID/version;
- display facts and missingness;
- evidence references;
- bundle version.

A candidate record is scoped to the POC. It is not claimed as universal real-world identity.

### 7. Identifier clue mapping

- namespace;
- supplied value;
- conservative lookup key;
- zero, one, or many candidate links;
- evidence state.

An identifier clue is routing evidence, not configuration identity or equivalence.

### 8. Discovery snapshot

- original clue;
- accepted interpretation state;
- user-selected candidate, if any;
- displayed facts, unknowns, and conflicts;
- evidence references;
- bundle, parser, and schema versions;
- user notes;
- save time.

The snapshot is frozen. It does not become a reviewed release.

### POC versioning

The POC needs:

- fixture-bundle version;
- family-profile version;
- parser/rule version;
- public DTO schema version;
- prompt/agent policy version for reproducibility.

It does not yet need:

- a trusted external manifest root;
- a global catalog-release authority;
- activation/rollback event sourcing;
- a universal claim graph;
- per-field assertion tables;
- a reviewer application;
- a universal mechanical ontology.

Those become necessary only if PartSource publishes reviewed technical truth or supports persistent production decisions.

## Deterministic versus agent-owned work

### Must be deterministic

- raw-input preservation;
- dimensions, units, fractions, and supported thread-token parsing;
- identifier normalization inside a declared namespace;
- zero/one/many identifier handling;
- duplicate and conflict preservation;
- hard-constraint filtering;
- stable ordering;
- missing, unknown, not-indexed, invalid, and unavailable states;
- claim-policy enforcement;
- candidate and bundle identity;
- frozen discovery snapshots;
- URL/share state;
- all gates that enable an action.

### Agents can help

- interpret colloquial or unfamiliar terminology;
- propose family candidates;
- point to the input span behind a proposal;
- surface alternate meanings;
- attack silent assumptions;
- summarize differences already present in allowed evidence;
- write precise clarification questions;
- search and summarize an allowlisted evidence corpus in Direction B;
- red-team draft result copy for prohibited claims.

### Agents must never

- invent dimensions or material facts;
- default pitch, standard, finish, strength, or units;
- override explicit facts;
- merge source records;
- resolve identifier collisions;
- create a canonical configuration;
- select a final candidate for the engineer;
- establish equivalence, suitability, conformance, approval, listing, or availability;
- enable an action because multiple agents agree.

## Modern engineering UX

### First screen

- one persistent resolver input;
- two or three honest examples;
- plain scope statement;
- no dashboard metrics;
- no random parts;
- no supplier logos;
- no AI theater.

### Result composition

Use one intent-adaptive workspace:

1. input and interpretation ledger;
2. current blocker or unresolved distinction;
3. family shortlist or identifier state;
4. compact aligned candidate rows;
5. differences and evidence inspector;
6. one reversible action.

Use whitespace between concepts and density inside technical comparisons.

### Exact identifier path

The first viewport shows:

- submitted identifier and namespace;
- mapping cardinality;
- critical candidate facts;
- missing/conflicting facts;
- mapping evidence versus source-record evidence;
- `Explore family` as secondary.

Do not force an exact identifier through family navigation.

### Rough text path

For `M4 black Allen screw, 12 long`, show:

- `Supplied: M4 · “black” · 12 · “long”`;
- `Parsed: M4`;
- `Confirm: unit for 12`;
- `Ambiguous: socket-head or button-head; “black” is not a safe finish value`;
- `Missing: pitch, material/strength, exact finish`.

Then show family candidates. Do not guess one.

### Candidate comparison

- compact aligned rows, not repeated cards;
- pin two to four candidates;
- `Differences only` and `All facts` views;
- distinct states for different, missing, not reported, conflicting, and unsupported;
- no `similar` or equivalence implication.

### Mobile

Recompose at 320 CSS px:

1. input;
2. current state and blocker;
3. next family/field decision;
4. stacked candidate-difference rows;
5. sticky unresolved or user-selection action.

Do not shrink a desktop table.

### Visual character

- technically calm;
- neutral canvas;
- one restrained action color;
- thin separators;
- modest radii;
- tabular numerals and aligned units;
- identifiers in monospace;
- accurate geometry only when it has a job;
- status with text, not color alone;
- motion only for causality.

## Product directions

## Direction A — bounded intent-adaptive resolver — recommended

### User task

An engineer has a rough part description, partial specification, standard designation, or known identifier and needs to narrow the search without losing uncertainty.

### Product promise

> Interpret the clue, show bounded candidate families or records, and make the missing decisions visible.

### Workflow

1. enter clue;
2. deterministic preflight;
3. three agents propose, criticize, and ask;
4. deterministic reconciliation;
5. family or identifier path;
6. compact candidate inspection;
7. explicit human selection or unresolved-question export;
8. frozen discovery snapshot.

### Completion event

The user either:

- selects one candidate for the current task and saves/copies the discovery snapshot; or
- copies one precise unresolved question because selection is not justified.

Abstention is a successful completion.

### Minimum credible POC

- one primary resolver screen;
- two or three neighboring fastener family profiles that create real ambiguity;
- 24–40 deliberately selected candidate records;
- one permission-cleared or clearly synthetic fixture bundle;
- broad text, family text, exact ID, zero/many ID, conflict, unsupported, not-indexed, model-failure, and service-failure cases;
- three bounded agent roles;
- deterministic policy and candidate gate;
- desktop and 320 px mobile composition;
- no BOM or supplier workflow in the core loop.

### Why it may win

- directly satisfies the discovery mission;
- demonstrates agent value on messy language;
- preserves deterministic mechanical controls;
- reuses the strongest UX and data research;
- small enough to build as one coherent product loop.

### Why it may fail

- familiar searches may be faster in Google or McMaster;
- narrow fixture coverage may feel staged;
- family profiles still need careful curation;
- the user-value claim remains unvalidated.

## Direction B — cited primary-source research resolver

### User task

An engineer has a clue or public identifier and wants the relevant official technical sources gathered and reconciled.

### Product promise

> Find and organize inspectable primary-source evidence around your clue. You verify and choose.

### Workflow

1. preserve and parse clue;
2. search only an allowlisted corpus or allowlisted official domains;
3. independent retrieval agents gather candidate sources;
4. critic agent checks identity, conflicts, and unsupported leaps;
5. deterministic composer shows citations, explicit facts, conflicts, and missing facts;
6. user opens an original source or copies a structured research brief.

### Completion event

The user opens a cited primary source or copies an evidence-backed search brief after choosing a candidate interpretation.

### Minimum credible POC

- one fastener family or two close families;
- one or two permission-cleared official source sets;
- 30–50 source-linked records or document sections;
- exact ID and rough-text cases;
- citations at fact-group level;
- prompt-injection isolation and strict DTO allowlist;
- no autonomous browsing outside the allowlist.

### Why it may win

- strongest visible multi-agent orchestration;
- avoids claiming a universal PartSource catalog;
- citations make agent work inspectable;
- useful for messy clues and document-heavy categories.

### Why it may fail

- source permission, format drift, latency, and retrieval quality are hard;
- prompt injection and stale source content expand the security surface;
- citations can still be misread as suitability;
- implementation scope is larger than Direction A.

## Direction C — photo and measurement family triage

### User task

An engineer, technician, or builder has an unknown physical component and needs to learn what family it may belong to and what to measure next.

### Product promise

> Identify plausible component families and the measurements needed to confirm them.

### Workflow

1. upload photos and known dimensions;
2. vision agents propose families;
3. critic agent lists what the image cannot establish;
4. deterministic family rules request discriminating measurements;
5. user receives two to four family candidates, measurement prompts, and source/search terms.

### Completion event

The user chooses a likely family and leaves with a measurement checklist or source search that can confirm it.

### Minimum credible POC

- eight to twelve visibly distinct mechanical families;
- twenty difficult image cases;
- family-specific measurement prompts;
- calibrated and uncalibrated image states;
- explicit `image cannot determine this` behavior;
- no SKU catalog, suitability, or purchasing flow.

### Why it may win

- strongest public AI demonstration;
- addresses an entry mode text catalogs handle badly;
- lighter catalog-authority burden;
- highly differentiated.

### Why it may fail

- photos hide material, tolerance, internal geometry, and application context;
- it may attract hobbyist curiosity more than engineering use;
- vision ambiguity may make abstention dominant;
- broader family set expands domain and test scope.

## Direction D — one-family cited comparison workbench

### User task

An engineer already knows the family and wants to compare nearby candidate records by consequential differences.

### Product promise

> Compare cited facts inside one bounded family without implying equivalence.

### Workflow

1. choose the family;
2. enter known constraints;
3. filter deterministically;
4. pin two to four candidate records;
5. compare differences, missing facts, and evidence;
6. user chooses a candidate to inspect at the original source.

Agents prepare anomaly suggestions, difference summaries, and result-copy challenge. They do not select.

### Completion event

The user opens an original source or copies an explicit requirement containing resolved and unresolved fields.

### Minimum credible POC

- one tightly bounded family;
- 40–60 permission-cleared source-linked candidate records;
- five to eight selection-critical fields;
- deterministic filters and difference computation;
- missing, conflict, withdrawn, and not-in-bundle examples;
- no BOM, supplier aggregator, or broad category homepage.

### Why it may win

- easiest to understand and benchmark;
- strongest deterministic credibility;
- useful modern comparison UX;
- lowest runtime agent risk.

### Why it may fail

- may be only a polished small catalog;
- weakest proof of frontier-model value;
- one family may not feel like PartSource;
- expansion recreates the catalog-authority burden.

## Direction comparison

| Criterion | A — bounded resolver | B — cited research resolver | C — photo triage | D — comparison workbench |
|---|---|---|---|---|
| Mission fit | **High** | **High** | Medium-high | Medium |
| Visible multi-agent leverage | **High** | **Very high** | **Very high** | Low-medium |
| Small coherent workflow | **High** | Medium | Medium | **High** |
| Data-authority burden | Medium-low | Low catalog / medium evidence | Low catalog / high evaluation | High within one family |
| Runtime/security complexity | Medium | **High** | Medium-high | Low |
| Deterministic safety | **High if gated** | Medium | Medium | **Very high** |
| Public demo differentiation | High | High | **Very high** | Medium |
| Reuse of current research/code | **High** | Medium | Low | High |
| Risk of looking staged | Medium | Medium | Medium-high | High |
| Best role | **Primary recommendation** | Agent-native challenger | Bold challenger | Control/baseline |

## Recommendation

Choose **Direction A — bounded intent-adaptive resolver**.

Why:

1. It is the smallest direction that still feels like PartSource.
2. It uses frontier agents for the hard part: messy language and competing interpretations.
3. It keeps facts, identity, hard constraints, and actions deterministic.
4. It can demonstrate broad text and exact identifier paths in one loop.
5. It absorbs the strongest lessons from the failed POC without inheriting its authority architecture.
6. It creates a credible modern engineering interface instead of another search-results page.

Direction B is the strongest challenger if the product should be more agent-native and less catalog-shaped.

Direction C is the strongest differentiation bet if public wow matters more than reuse and scope.

Direction D is the safest deterministic control, but it underuses the multi-agent mission.

Do not merge all four.

## Classification register

### Fundamental

- one intent-adaptive resolver;
- exact-identifier-first routing;
- raw-input preservation;
- explicit supplied, parsed, proposed, unknown, and conflicting states;
- zero/one/many identity handling;
- human selection;
- deterministic hard constraints and claim gate;
- bounded candidate identity;
- provenance/evidence scope;
- fail-closed unsupported and unavailable states;
- frozen discovery snapshot;
- desktop and mobile accessibility;
- permission-cleared public data.

### Differentiators

- independent interpretation proposals;
- critic agent that attacks assumptions;
- field-level interpretation diff;
- precise next-question generation;
- candidate differences view;
- cited evidence summaries;
- useful abstention as a completion event;
- later, photo-plus-measurement entry.

### Nice-to-have

- recent searches;
- saved comparisons;
- keyboard expert mode;
- accurate source-backed silhouettes;
- optional geometry overlay;
- camera/barcode identifier entry;
- supplier search with exact outgoing query;
- local BOM after the resolver proves useful;
- release comparison after real reviewed releases exist.

### Remove from the first POC

- generic dashboard and KPI cards;
- random default configuration cards;
- broad catalog homepage;
- chatbot-first UI;
- agent avatars, token streams, and consensus badges;
- confidence percentages;
- `Indexed`, `Verified`, `Safe`, or `BOM-ready` labels;
- automatic configuration selection;
- giant generic CAD/3D hero or false scale;
- current generic schematic when it does not match the family;
- Add to BOM in the core resolver;
- CSV/PDF batch workflow;
- supplier-logo cards and supplier click as success;
- price, stock, availability, offers, affiliates, quote, checkout, or commerce;
- broad `Octopart for mechanical parts` claim;
- all-27,009-row publication;
- the three import files as user-facing families;
- full release graph and trusted-manifest machinery;
- universal ontology, EAV, knowledge graph, or per-field claims graph;
- accounts, teams, ERP, PLM, and cloud collaboration;
- live unrestricted agent browsing.

## What Ticket 25 changes

Ticket 25 does not kill PartSource.

It creates these permanent rules:

- never use first-row or last-wins behavior for truth;
- preserve all conflicting occurrences;
- namespace identifiers;
- reject empty normalized identity;
- separate source record, family, candidate, identifier, and snapshot;
- keep agent proposals separate from facts;
- gate UI actions from deterministic state;
- make every blocked state precise;
- freeze saved output;
- do not call a fixture bundle a reviewed release;
- do not build publication authority before the product requires it.

## Product-contract impact

`research/product-contract.md` remains the authority for current public behavior until a reviewed contract revision is approved.

This synthesis does not change production claims.

After direction approval, the contract should be revised before implementation planning to:

- keep all non-equivalence, non-commercial, and source-permission boundaries;
- replace current production-capability language with the approved POC promise;
- distinguish candidate records and user-selected discovery snapshots from reviewed configurations;
- define bounded agent authority;
- remove supplier/BOM actions from the core product promise if Direction A, B, or C wins;
- preserve historical runtime facts without presenting them as the future product.

Direction approval is now recorded. Contract revision remains a separate controlled step and was not started here.

## Decision resolution

Jay approved:

- **A — bounded intent-adaptive resolver.**

Directions B, C, and D remain documented challengers, not the active route.

The approval closes only the product-direction decision. It does not authorize `/to-spec`, production implementation, deployment, new public claims, source publication, product-contract changes, or outreach.

The bounded behavioral prototype and truth-state test was later executed under `.wayfinder/poc-ship/tickets/30-prototype-bounded-intent-adaptive-resolver.md` and closed **PASS — behavioral-prototype scope only**.

That result proves interaction-state coherence in a synthetic fixture. It does not prove engineer comprehension, mechanical correctness, product value, live-model behavior, or production readiness. No next execution ticket is approved.

## Evidence used

- `research/product-contract.md`
- `CONTEXT.md`
- `research/product-frontier-synthesis-2026-08-09.md`
- `research/full-problem-space-skeptical-review-2026-08-09.md`
- `research/modern-engineering-ux-opportunities-2026-08-09.md`
- `research/validation-ux-reimagination-2026-08-09.md`
- `research/validation-mechanical-data-model-2026-08-09.md`
- `research/mechanical-data-trust-opportunities-2026-08-09.md`
- `research/poc-architecture-risk-red-team-2026-08-09.md`
- `research/proxy-poc-ticket25-results-2026-08-10.md`
- `research/ticket25-fundamental-rethink-2026-08-10.md`
- `research/ticket30-bounded-intent-adaptive-resolver-results-2026-08-10.md`
- `sketches/008-bounded-intent-adaptive-resolver/critique.md`
- current runtime and repository code
- three independent specialist reviews in product/job, mechanical data/safety, and engineering UX/agent orchestration

## Hard stop

- No `/to-spec`.
- No production implementation backlog.
- No production code changes.
- No product-contract rewrite without its own controlled step.
- No deployment.
- No source publication.
- No outreach.
- Direction A is approved and Ticket 30 passed at behavioral-prototype scope only; stop until Jay explicitly chooses proceed, revise, or reject.
