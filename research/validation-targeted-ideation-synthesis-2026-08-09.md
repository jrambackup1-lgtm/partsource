# PartSource validation + targeted ideation synthesis

**Date:** 2026-08-09  
**Phase:** Validation + Targeted Ideation Gate  
**Status:** Specialist desk validation complete; direct-user and mechanical-domain validation still open. No `/to-spec` approval.

## Decision

### Recommendation: A — fastener specification recovery with a frozen safe-handoff packet

Choose **A now**.

Define it narrowly:

> Preserve an imperfect fastener clue, recover the supported specification without guessing, expose unresolved or conflicting facts, and freeze a release-aware configuration or issue packet for reuse.

Supplier-site translation is a secondary action. It is not the core completion event.

Keep **B — fastener BOM specification preflight** as the highest-priority challenger. It may create stronger repeat use and P&L value, but it is not validated and cannot be safe without A’s line-resolution kernel.

Keep **C — category-scoped specification integrity** as future research only. Rolling bearings falsify the simple universal-mechanical-platform story.

Use **D — stop/rethink** if direct engineer work shows low task frequency or no workflow advantage, or if permitted data and mechanical review cannot support a truthful release.

Do not start `/to-spec` yet.

## Why A wins now

### Evidence

- Exact identifiers are the strongest current entry path and best match the permitted packet.
- `91290A115` is a concrete repository-safe example: the source record is M3 × 0.5 × 10 mm. The earlier prototype’s wrong M4 claim proved why preserved input, mapping state, and release truth matter.
- One-at-a-time recovery has the best current data fit, lowest build risk, and clearest honest demo.
- Current search, publication, and trust models cannot support a broad BOM readiness claim.
- A can become the line resolver inside B. Starting with B does not avoid A’s hard work.
- Supplier handoff tests found that a transparent configuration packet is safer than destination-specific query magic.
- Competitive analysis found a plausible opening between artifacts and roles: supplier identifier → neutral specification → frozen BOM or independent search. It did not prove demand.
- Rolling bearings preserve the truth workflow but break the fastener-centered meaning of one neutral configuration and one required-field checklist. A proves a fastener workflow only.

### Strong hypothesis

The actual product advantage is not better filtering. It is a persistent, inspectable engineering decision state:

- raw clue;
- deterministic interpretation;
- identifier mapping;
- family/configuration state;
- supplied, normalized, missing, conflicting, and non-applicable facts;
- release identity;
- next safe action;
- frozen output.

## What each specialist established

### 1. Real engineer workflow

**Evidence:** The current application and earlier prototypes can silently omit, invent, correct, or carry over facts. They are not direct-validation ready.

**Strong hypothesis:** Engineers may prefer a traceable configuration packet to a superficially complete answer.

**Open question:** Frequency, urgency, normal workaround, owner, budget, and willingness to reuse or pay remain unknown. No direct engineer tested the flow.

### 2. BOM readiness

**Evidence:** A wins current data fit, technical tractability, and demo credibility. B wins only hypothesized repeat value, urgency, cross-role handoff, and P&L leverage.

**Opportunity / gold idea:** A line-resolution kernel plus a local issue queue grouped by the next safe engineering decision.

**Risk:** Calling this `BOM readiness` implies PLM, ERP, procurement, quality, approval, and release authority that PartSource does not have.

**Decision:** Keep B as a concierge challenger. Do not build the upload dashboard.

### 3. Search and mechanical reasoning

**Evidence:** Current PostgreSQL substring search is lexical retrieval, not mechanical reasoning. It has un-namespaced exact fields, `LIMIT 1`, text dimensions, unstable broad results, and unsafe stale/failure behavior.

**Fundamental requirement:** Parse supported technical facts deterministically, apply hard constraints, expose ambiguity, and abstain.

**Opportunity / gold idea:** One constraint ledger drives interpretation, ranking, explanations, tests, and frozen outputs.

### 4. Mechanical-data model

**Evidence:** No current row is publishable as-is.

- 27,009 source rows;
- 11,973 rows inside three candidate family boundaries;
- 3,938 metric candidates inside those boundaries;
- 18,232 imperial rows whose TPI-like designation is lost by the current pitch projection;
- 1,591 repeated imported-signature groups across 3,502 rows;
- 1,311 of those groups, covering 2,863 rows, differ on omitted supplied fields;
- 290 broader duplicate-candidate groups still need human review.

**Fundamental requirement:** Approve family boundaries and required fields, re-project complete source facts, preserve supplied notation, review collisions, and publish an immutable release.

**Strong hypothesis:** A small metric-only release can test three reviewed families with about 150 deliberately selected configurations and a 100–150-case truth corpus. These counts are planning hypotheses, not proof of mechanical approval or demand.

### 5. Trust and provenance

**Evidence:** Confidential lineage prevents independently auditable public provenance.

**Fundamental requirement:** Public trust must distinguish submitted clue, mapping, configuration facts, transformations, missing/conflicting facts, release identity, and supplier-destination limits.

**Strong hypothesis:** Use one compact claim-scoped sentence, quiet fact-level exceptions, evidence on demand, and correction-aware saved snapshots.

**Rejected:** Confidence scores, evidence counts, shields, generic `verified`, `reviewed`, `indexed`, or positive green states without auditable scope.

### 6. Supplier handoff

**Evidence:** Current fallback behavior can alter pitch, compile partial input, misclassify unsupported input, and expose unsafe links. Direct exact-ID opening preserves the clue with no translation.

**Fundamental requirement:** Separate:

1. source-direct exact-ID opening;
2. alternate-supplier specification packet.

Block the second for partial, conflicting, unsupported, unavailable, confidential-lineage, withdrawn, or unreviewed states.

**Decision:** Secondary completion only. The frozen packet is the core output.

### 7. UX reimagination

**Evidence:** The current dashboard/page funnel makes users reconstruct what the system understood and what remains unresolved.

**Opportunity / gold idea:** A hybrid engineering workspace:

- decision queue for repeated or batch work;
- exact identity view separating clue, mapping, and configuration;
- family refinement when one missing fact controls the branch;
- differences-only comparison for coherent candidates;
- a shared constraint ledger in every composition.

**Decision:** Recompose by intent. Do not force broad, family, exact-ID, and batch work into one result page.

### 8. Competitive/category analysis

**Evidence:** McMaster owns item/order and CAD insertion; Octopart owns electronics identity plus supply data; CADENAS/TraceParts own manufacturer CAD retrieval; Granta owns material selection and simulation export. Their density is often rational.

**Opportunity / gold idea:** PartSource can own the transition from imperfect clue to reproducible decision state. No inspected product proves the market gap.

**Rejected:** Catalog scale, CAD library, distributor commerce, generic parametric table, AI chat, `Octopart for mechanical parts`, or polished filter chrome as differentiation.

### 9. POC scope and category falsification

**Evidence:** Rolling bearings require manufacturer execution, designation suffixes, operating conditions, arrangement, ratings, lubrication, interfaces, and calculations. A seller-neutral dimensional configuration is not necessarily product identity or application-qualified selection.

**Decision:** Fastener-only POC. Bearings are a falsifier, not a release category.

**Opportunity / gold idea:** The cross-category concept that survives is `category-scoped specification integrity`, not a universal neutral configuration catalog.

### 10. Architecture

**Evidence:** Current Edge isolation and private RPC grants point in the right direction, but the live contract lacks immutable release identity, strict DTO construction, typed facts, stable search, bounded execution, dynamic smoke, and adequate abuse controls.

**Strong hypothesis:** Static React + server-side Supabase Edge + deterministic PostgreSQL is enough for the bounded POC and materially more data.

**Fundamental requirement:** Browser → versioned Edge DTO → deterministic private RPC → one immutable active release. Raw evidence remains private.

**Rejected:** Direct browser-to-database access, fuzzy technical identifiers, vector truth retrieval, generated facts, automatic deduplication/publication, and premature search infrastructure.

## Cross-agent disagreements resolved

### Exact passport vs decision queue

Not a product disagreement. They fit different intent.

- Exact-ID work uses a compact identity/configuration view.
- Repeated or multi-line work uses the queue.
- Both use the same constraint ledger and release state.
- The old dashboard-style passport with counts and badges remains rejected.

### A vs B

- A is the buildable and demonstrable kernel.
- B is the stronger business hypothesis.
- B cannot be chosen from desk evidence.
- A/B must be tested on the same recent redacted lines before scope approval.

### Family-first vs exact-ID-first

- Exact ID is the safest entry when present.
- Family routing is required for broad text.
- Family-first is an interaction rule, not the value proposition.

### Three families vs one-family pilot

- One family lowers review cost but makes broad ambiguity and family routing theatrical.
- Three candidate families create a credible broad/family/exact test surface.
- Public scope remains conditional on mechanical approval and source completeness.
- Do not publish all 11,973 candidate rows. Use a deliberately reviewed metric subset.

### Public provenance vs confidential source

- PartSource can expose its own mapping, transformation, review scope, release, correction, and limits.
- It cannot imply that users can independently inspect confidential upstream lineage.
- Public copy must say what is supported and what cannot be checked.

### Public no-JWT API

- JWT and CORS do not make anonymous public facts private.
- A public endpoint is acceptable only with strict DTOs, private database grants, bounded cost, timeouts, telemetry, release identity, and tested deployment configuration.

### Mechanical platform vs fastener POC

- The truth-preserving operations transfer.
- The fastener configuration object does not transfer unchanged.
- The POC must not claim general mechanical-platform validation.

## Fundamental requirements before `/to-spec`

1. Direct engineer evidence from recent redacted work.
2. Mechanical approval of candidate family boundaries and required/non-blocking facts.
3. A permitted, full-field, metric review packet.
4. Namespace-aware exact mapping and collision states.
5. A frozen 100–150-case truth corpus covering exact, broad, partial, conflict, ambiguity, outside-release, withdrawn, unsupported, and unavailable cases.
6. Immutable catalog release, configuration revision, mapping revision, correction, withdrawal, and rollback semantics.
7. Typed quantities and explicit metric pitch versus imperial TPI.
8. Deterministic hard-constraint filtering and abstention.
9. Strict public DTO allowlist with private lineage containment.
10. Selection, BOM, and supplier gates tied to approved family profiles.
11. A/B concierge evidence before choosing one-at-a-time versus batch shell.
12. Controlled Edge latency, failure, abuse, and deployment smoke evidence.

## Direct validation plan

Run one combined study, not ten disconnected interviews.

### Participants

- 5–8 practicing mechanical, product-design, or prototype engineers;
- recent fastener research or BOM handoff in the last three months;
- each provides one exact/opaque-ID case and a redacted 5–15-line fastener set where permitted;
- one independent mechanical-domain reviewer creates and checks the answer key.

### Duel

1. Participant uses the normal workflow.
2. Participant uses A one line at a time.
3. Participant uses a manual B issue queue powered by the same resolver.
4. Participant tests the source-direct and alternate-supplier handoff language.
5. Participant explains the result states back in their own words.

### Measures

- task frequency and urgency;
- time to correct stopping point;
- wrong-family turns;
- critical unresolved facts noticed;
- false unique matches;
- accepted silent substitutions;
- review effort;
- downstream clarification avoided;
- artifact reuse;
- preference between A and B;
- repeat intent and willingness to pay.

### Kill rules

Stop or rethink if:

- fewer than half the participants had a relevant recent task;
- the normal source/catalog workflow is consistently faster with equal correctness;
- any critical false unique match occurs;
- participants cannot explain configuration versus suitability/listing/equivalence;
- the packet is not reused or considered useful;
- B adds no material value over A;
- no permitted data packet can meet the approved family profiles;
- mechanical review cannot define a bounded non-suitability selection gate.

## What must change from current PartSource

These are direction changes, not implementation tickets:

- product center: result card → engineering decision state;
- completion event: supplier click → frozen configuration/issue packet;
- search: substring list → deterministic interpretation, constraints, and abstention;
- identity: source row/reference → family, configuration, namespaced mapping, immutable release;
- trust: badge/prose → fact states, scoped evidence sentence, correction history;
- BOM: selected product list → immutable release-aware snapshots, with B tested separately as preflight;
- supplier handoff: automatic links → gated, editable, secondary packet;
- architecture: mutable row DTO → immutable serving release with strict Edge projection.

## Opportunities / gold ideas retained

1. Constraint ledger as shared product and technical primitive.
2. Decision queue grouped by next safe engineering action.
3. Exact identifier as a mapping, not the product.
4. Useful abstention and exportable issue records.
5. Frozen correction-aware configuration packet.
6. Two-path completion: source-direct and alternate-specification packet.
7. Differences-only comparison that never hides unknowns.
8. BOM preflight as the highest-priority challenger.
9. Category-scoped specification integrity as later platform research.

## Nice-to-have

- accurate geometry after measured comprehension benefit;
- keyboard expert mode;
- print-safe packet;
- saved searches;
- public-safe correction timeline;
- release-keyed API caching after measured load;
- CAD/geometry search only with sanctioned data and a different validated job.

## Rejected and why

- **Broad mechanical platform:** bearings falsify the shared fastener configuration model.
- **Publish all current rows:** projection loses critical facts and creates false duplicate candidates.
- **BOM readiness score:** hides severity, coverage, and system failures.
- **Supplier handoff as core value:** implies sourcing results the product cannot support.
- **Equivalence, replacement, suitability, approval:** no relationship or application evidence.
- **Price, stock, availability, offers:** no sanctioned fresh commercial feed.
- **AI chat or LLM parser as authority:** generated output cannot own mechanical truth.
- **Embeddings/fuzzy technical matching:** unsafe for identifiers and hard constraints.
- **Universal EAV/ontology:** premature and obscures category semantics.
- **CAD/geometry library:** different business and false authority risk.
- **Cosmetic SaaS redesign:** does not solve truth continuity.
- **Green badges/confidence counts:** manufacture trust without claim scope.

## Gate status

### Proven enough for a directional recommendation

- A is the best bounded current direction.
- B is the correct challenger.
- Fastener-only scope is required.
- The constraint ledger and frozen packet are the strongest product primitives.
- Deterministic PostgreSQL and an Edge-only public DTO are the right architecture class.
- Supplier handoff is secondary.
- Broad platform, commerce, equivalence, and AI authority are rejected.

### Still uncertain

- real task frequency and urgency;
- A versus B preference and repeat value;
- approved family profiles and release size;
- whether confidential provenance is trusted enough;
- whether the packet beats opening the original source;
- supplier handoff usefulness;
- willingness to pay;
- controlled public API performance and cost.

**Gate conclusion:** Direction recommendation is ready. Product validation is not complete. Remain in Wayfinder. Await explicit approval to run the empirical/domain gate; do not start `/to-spec`.

## Evidence index

- `research/validation-engineer-workflow-2026-08-09.md`
- `research/validation-bom-readiness-wedge-2026-08-09.md`
- `research/validation-search-mechanical-reasoning-2026-08-09.md`
- `research/validation-mechanical-data-model-2026-08-09.md`
- `research/validation-trust-provenance-2026-08-09.md`
- `research/validation-supplier-handoff-2026-08-09.md`
- `research/validation-ux-reimagination-2026-08-09.md`
- `research/validation-competitive-category-analysis-2026-08-09.md`
- `research/validation-poc-scope-category-falsification-2026-08-09.md`
- `research/validation-deterministic-architecture-2026-08-09.md`
- `sketches/006-supplier-handoff-lab/`
- `sketches/007-engineering-workspace-directions/`
