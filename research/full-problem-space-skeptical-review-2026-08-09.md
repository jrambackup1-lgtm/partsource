# Skeptical review of the full PartSource direction

**Date:** 2026-08-09  
**Status:** Adversarial Wayfinder review. Not a spec or implementation plan.

## Executive verdict

PartSource currently has a good **truthful demo pattern**, not a proved product.

The useful core is narrower than the current destination:

> Recover a fastener configuration from an identifier or rough line, show what is missing, and preserve a safe handoff.

“Requirement-first family discovery” is promising for broad fastener text. It is not yet a product wedge. The prototype calls catalog constraints a requirement, but it does not capture a mechanical design requirement such as load, joint geometry, environment, thread engagement, installation, certification, or allowed flexibility. PartSource should not imply that it selects a suitable fastener when it only resolves a catalog configuration.

The current data is too weak to prove a broad mechanical-parts platform. It is one confidential, identifier-rich fastener packet. The three proposed families are all screws with similar discrete selection grammars. Bearings, seals, springs, gears, and fittings would stress identity, ratings, tolerances, continuous values, compatibility, and manufacturer-specific facts in different ways.

The strongest challenger is a small **BOM readiness or line-linting service**. It may create repeat value by finding underspecified and supplier-locked lines. It is also a scope trap if built before testing real redacted BOMs by hand.

Do not proceed to a broad platform spec. First prove that target engineers have this problem often, that PartSource is faster or safer than their normal method, and that the data can support a complete-enough configuration without confidence theater.

## What a mechanical engineer needs first

The first need is not geometry, a passport, or supplier buttons.

It is a trustworthy answer to five questions:

1. **What task is PartSource helping with?** Recover an existing specification, complete a rough BOM line, or design/select a component for an application are different jobs. The POC can credibly address the first two. It cannot do application suitability.
2. **What did the system preserve from my input?** Keep the raw line, exact identifier namespace, units, and explicit constraints.
3. **Which selection-critical facts are still absent?** Required fields must be defined per family. Dataset uniqueness is not requirement completeness.
4. **What is the answer based on?** Separate supplied facts, normalization, family classification, identifier mapping, and release state.
5. **What safe artifact can I hand off?** A readable, frozen configuration or unresolved requirement with no equivalence, listing, approval, or stock claim.

For a known identifier, the engineer should see the readable configuration immediately. For a rough line, the engineer should see missing critical fields and the next question. For an application-design question, PartSource should state that configuration discovery is not design validation.

## Classification of the major ideas

| Major idea | Classification | Skeptical finding |
|---|---|---|
| Seller-neutral preservation of raw intent, explicit unknowns, and selected facts | **Strong hypothesis** | This is the most durable possible value. It still lacks direct task and repeat-use evidence. |
| Requirement-first family discovery as the primary product | **Open question** | It may be a clean way to demonstrate ambiguity rather than a job people repeat. “Requirement” currently means catalog constraints, not functional engineering requirements. |
| Family-first routing for broad fastener text | **Strong hypothesis** | `M4 screw` should not become an arbitrary row. Test task performance, not preference. |
| Exact-identifier, inspector-first entry | **Strong hypothesis** | The packet has 99.8% identifier coverage, so this is a strong capability demo. User value, rights durability, and advantage over opening the originating supplier remain open. |
| Three curated screw families as proof of a broad mechanical platform | **Rejected** | Three closely related screw families test routing and facets, not broad mechanical identity or configuration behavior. |
| Small reviewed fastener release as a learning lab | **Confirmed** | The current packet can support a bounded experiment after family and identity review. It cannot support current broad claims unchanged. |
| A user-facing configuration passport in its current dashboard form | **Rejected** | Counts of direct, normalized, and missing facts look authoritative without showing source quality, requiredness, reviewer, method, or consequence. |
| A compact, frozen, release-aware configuration record | **Strong hypothesis** | It may improve handoff and correction handling if users reuse it. Keep it small and task-linked. |
| Public provenance as a differentiator | **Open question** | Confidential origin prevents independent source inspection. Public labels may become self-attestation rather than auditable provenance. |
| Private lineage, scoped review, missingness, correction, and release controls | **Confirmed** | These are needed to avoid false public claims and silent history changes, whether or not users value a provenance UI. |
| Geometry-led configuration guidance | **Nice-to-have** | Accurate drawings can teach selector meaning. They should not lead until source-backed geometry improves measurable task outcomes. |
| Geometry or shape as evidence of identity, fit, or equivalence | **Rejected** | Shape omits material, strength, fit, tolerances, standard edition, certification, and application context. |
| BOM cleanup/readiness audit | **Strong hypothesis** | This may have clearer batch and handoff value than one-line lookup. Test it as a concierge workflow before building a BOM product. |
| Supplier-specific query translation | **Nice-to-have** | Keep only if it reduces reformulation on real supplier sites. It is not a product wedge. |
| Neutral supplier links carrying a “sourcing” promise | **Rejected** | A search URL does not identify a listing, supplier capability, MOQ, price, stock, certification, or approval. |
| Delta-only configuration comparison | **Nice-to-have** | Useful after selection correctness is proved. It can also imply interchangeability if framed carelessly. |
| Deterministic identifier lookup, explicit parsing, and fail-closed states | **Confirmed** | Preserve this direction. Semantic or generative search would add risk before a measured need. |
| Four-relation POC bridge | **Strong hypothesis** | Preserve as a bounded serving model if implementation proceeds. Do not expand into a universal ontology or pretend it supports full field-level provenance. |
| Frozen local BOM snapshots | **Strong hypothesis** | The current deep-copy behavior is sound. Repeat-use and handoff value are not validated. |
| Broad “Octopart for mechanical parts” positioning now | **Rejected** | The canonical identity, data rights, offers, and category behavior differ too much. Use it as an analogy, not evidence or a claim. |

## Cross-challenge of the product direction

### 1. Is requirement-first family discovery a real product or a clean demo?

Today it is a clean demo.

It demonstrates three sound ideas:

- broad text can preserve a known constraint;
- family ambiguity should remain visible;
- a filter state is not automatically a part.

It does not yet demonstrate:

- that engineers encounter this task often;
- that they cannot resolve it faster in McMaster, Google, a CAD library, or internal history;
- that family selection is the hard part rather than recovering one missing attribute;
- that users want a saved requirement after the immediate search;
- that the current family names and boundaries match their language;
- that the workflow produces a handoff another person trusts.

The word **requirement** is currently too broad. `M4`, head family, length, and material form a configuration search. A real fastener requirement may also depend on load, preload, fatigue, joint materials, corrosion, temperature, clearance, engagement, thread fit, locking, assembly access, certifications, and organizational standards. PartSource explicitly lacks application-suitability evidence. Rename or bound the job as **specification recovery** until a fuller requirement model is proved.

### 2. Does a configuration passport create value or bureaucracy?

A passport creates value only when it prevents repeated interpretation, supports a handoff, or makes a later correction understandable.

The current passport mostly creates audit-shaped chrome:

- `7 direct facts`, `2 reviewed normalizations`, and `1 missing optional fact` have no common denominator and no decision meaning;
- a direct source fact is not automatically correct, current, complete, or selection-critical;
- “reviewed” does not identify review scope, method, reviewer role, or rule version;
- “optional” is asserted without a released family identity profile or application context;
- one source cannot demonstrate agreement or conflict;
- the evidence drawer says a normalization was reviewed but does not show the supplied value, normalization rule, or reason the result is safe.

Keep the underlying record. Replace the dashboard with one plain sentence, critical facts, named gaps, release identity, and an expandable explanation. Test the record as an exported BOM line or correction comparison. If nobody reuses or hands it off, the passport is bureaucracy.

### 3. Can provenance differentiate when the source is confidential?

Not in the strong, externally auditable sense.

The approved packet permits public technical fields but forbids publishing its upstream origin. A public label such as `Direct source record` therefore asks the user to trust PartSource's assertion. It cannot let the user inspect the origin or independently assess authority, revision, or context.

Provenance can still create operational value through:

- supplied versus normalized distinctions;
- public-safe source class and review scope;
- stable release identity;
- explicit missingness and conflicts;
- correction and withdrawal history;
- reproducible frozen snapshots.

That is **truth operations**, not yet differentiation. It becomes differentiating only if users make better decisions, find errors, or avoid rework because of it. The POC should test a real normalization or correction case. Do not market an anonymous-source label as transparent provenance.

A second approved, overlapping source is also important. Until then, PartSource cannot show that its evidence model handles disagreement rather than merely formatting one packet.

### 4. Is fastener data too weak to prove a broader platform?

Yes.

The packet is useful but structurally narrow:

- 27,009 source rows are not 27,009 canonical configurations;
- the proposed 11,973-row three-family slice is a candidate boundary, not a reviewed release;
- all three proposed families are screws;
- pitch is sparsely represented in the current projection and imperial TPI is currently misrepresented as `N/A`;
- finish, standards, and normalization are incomplete;
- important supplied facts such as thread coverage, fit, head dimensions, drive size, and minimum thread length are dropped;
- 1,311 repeated imported-signature groups contain differences in omitted fields;
- one confidential source cannot test cross-source conflict, freshness, or source replacement.

Fasteners favor discrete enumeration and familiar facets. Bearings, O-rings, springs, gears, and fittings introduce ratings, tolerances, service conditions, connection ends, continuous ranges, and stronger manufacturer identity. Do not claim platform proof until one contrasting category survives the same identity, search, truth, and task tests.

### 5. Are geometry guidance, BOM cleanup, and supplier translation useful or scope traps?

**Geometry guidance:** a scope trap if it leads. A small accurate silhouette may help family disambiguation. A source-backed dimensioned drawing may help confirmation. The current generic drawing does not prove dimensions and should not carry visual authority. Do not build CAD, geometry search, or interactive dimension tooling before a simple drawing ablation shows fewer mistakes.

**BOM cleanup:** the strongest adjacent hypothesis. It may convert episodic search into repeated batch work and produce a durable handoff. It also expands input formats, matching states, review workflow, and error cost. Test 5–15 real redacted lines manually before building upload infrastructure. Preserve unresolved lines; require zero confident false matches.

**Supplier query translation:** useful only as measured convenience. Test the actual outgoing queries on multiple supplier sites. If it saves no reformulations or users still start over, remove the sourcing promise. Never compensate by inventing listing, price, stock, or equivalence data.

## Visual review of the 003 prototypes

All three local prototypes were opened and inspected in a browser, including selected states and the passport evidence drawer.

### Broad requirement resolver

What works:

- the raw query and preserved `M4` are visible;
- family ambiguity is not silently collapsed;
- the screen is calmer than a flat configuration grid.

False confidence and hidden assumptions:

- `PartSource found the size` overstates `M4`; pitch and fit are unresolved;
- `3 reviewed families` conflicts with the map and taxonomy audit, which say the proposed family set is not approved;
- green `M4 available` can read as stock availability even though it means dataset presence;
- the selected panel changes `6,707 records` into `6,707 configurations`, despite unresolved canonical duplicates and omitted identity fields;
- three similar side silhouettes make “choose the geometry” look easier than it is; drive is poorly visible and non-geometric differences disappear;
- `Choose length, material, and strength` implies a complete universal choice order while pitch, finish, standard, threading, fit, and drive size may matter;
- the tiny three-family set makes family ranking look solved. Real unsupported, close-ranked, misnamed, and cross-category cases are absent;
- the right-side `Next decision` panel assumes family choice is useful work rather than an extra click.

### Family geometry workbench

What works:

- the selected requirement remains visible;
- aligned rows are better than repeated cards;
- BOM action is disabled before one row remains.

False confidence and hidden assumptions:

- input `M4 socket head cap screw` becomes `M4 × 0.7` without asking for pitch. That is a silent coarse-pitch assumption and conflicts with the product contract;
- choosing only length and material reduces the mock data to one row and activates `Add configuration to BOM`;
- strength and standard are then silently inherited from dataset uniqueness rather than resolved as requirements;
- the benchmark itself says the equivalent task must not silently choose finish or strength;
- the drawing is generic, not scaled to 12/16/20 mm, and does not show the internal hex drive clearly;
- `Head profile` appears interactive but does not participate in the shown configuration logic;
- `dk` has no numeric value or source. The diagram looks dimensioned while disclaiming that it proves dimensions;
- only four rows avoid real density, pagination, long values, missing fields, conflicts, duplicate candidates, and not-indexed states;
- large empty center and inspector areas make this look like a control panel rather than an efficient engineering tool;
- one matching published row is treated as BOM-ready even though current import projection drops selection-critical fields.

Automatic uniqueness is not BOM-readiness. The gate should be: one released configuration remains **and every family-defined required fact is selected or explicitly supported**, with no critical conflict.

### Exact configuration passport

What works:

- exact lookup is inspector-first;
- identifier mapping is separate from configuration facts;
- the screen explicitly denies manufacture, stock, listing, equivalence, and approval;
- missing and normalized values are visually distinct.

False confidence and hidden assumptions:

- the most confident prototype claim conflicts with another repository artifact: the passport displays `91290A115` as `M4 × 0.7 × 12 mm`, while `research/poc-discovery-benchmark.md` specifies `M3 × 0.5 × 10 mm` for that identifier. This must be resolved against the approved source before either example is used;
- `Exact reviewed identifier mapping`, `Current PartSource release`, and a green review treatment look production-authoritative although the trust audit says imported records are forced to `demo-only` and no catalog release lifecycle exists;
- `Catalog ID` hides the identifier namespace. That reduces user understanding while still exposing the identifier;
- count cards imply measurable completeness without a released required-field set;
- the fact list omits potentially important supplied fields such as threading, fit, head dimensions, drive size, and minimum thread length;
- `ISO 4762` lacks edition and relationship semantics;
- the evidence drawer says only that a normalization was reviewed. It gives no raw value, rule version, reviewer scope, source class, or independent citation;
- `Direct source record` cannot be audited publicly because the origin is confidential;
- prominent BOM and supplier actions make the page feel complete even though supplier links are placeholders and the configuration may be incomplete.

The passport is the clearest example of **false precision through interface structure**. The disclaimers are correct, but the review language, counts, release badge, and actions create more confidence than the disclosed evidence earns.

## Decisions to reverse, test, narrow, or preserve

### Reverse

1. Stop treating family-first discovery as the destination. Treat it as one candidate interaction model for configuration recovery.
2. Stop using three screw families or row count as evidence of a mechanical-parts platform.
3. Stop equating one remaining published row with BOM-readiness.
4. Remove confidence counts and review theater from the passport until required-field profiles and real release/review records exist.
5. Remove geometry from the lead position until the drawing is source-backed and task-tested.
6. Drop “sourcing” as a core promise if supplier handoffs remain query links.
7. Do not use `available` for dataset coverage.

### Test

1. Frequency and cost of recent identifier/rough-line recovery work.
2. Family-first performance against normal tools and a simpler text/table resolver.
3. Whether a minimal evidence summary improves calibrated understanding more than the current passport.
4. BOM readiness/cleanup on real redacted lines.
5. Supplier-query utility on real destination results.
6. One contrasting component category before any platform claim.

### Narrow

1. Position the POC as **fastener specification recovery and handoff**, not broad mechanical selection.
2. Publish one deeply reviewed family plus enough neighboring families to test ambiguity; do not publish thousands of candidate rows for visual scale.
3. Define the family identity and required-field profile before designing selectors.
4. Reduce the passport to identity, critical facts, named gaps, mapping scope, and release statement.
5. Keep provenance public-safe and task-oriented; keep confidential lineage private.
6. Run BOM cleanup as a manual or local thin experiment before building workflows, accounts, collaboration, or ERP integration.
7. Keep supplier translation secondary and removable.

### Preserve

1. Exact identifier resolution before generic search.
2. Raw input, preserved constraints, unresolved terms, and fail-closed states.
3. Separate family, configuration, identifier, supplier destination, and BOM snapshot identities.
4. No equivalence, alternate, availability, price, or approval claims.
5. Deterministic parsing and family aliases before AI or embeddings.
6. Rejection of import buckets as public families and automatic duplicate merging.
7. Frozen BOM snapshots, with future release identity added only when real releases exist.
8. Intent-adaptive composition: broad input may show families; exact input should show the configuration first.
9. The small four-relation bridge as an experiment boundary, not a claim of platform completeness.

## Five highest-information tests

### 1. Recent-work task study with participants' own lines

Recruit 6–8 mechanical/prototype engineers. Ask each for two or three redacted fastener lines or identifiers they handled in the last month. Observe their normal method first, then PartSource.

Measure occurrence, baseline time, correct recovered facts, missing facts noticed, backtracks, handoff destination, and whether they would use the result again.

**High-information decision:** If fewer than half had repeated recent recovery work, or normal tools are as fast and clear, do not make requirement recovery the product wedge. This test separates a real recurring job from a polished demo.

### 2. Blind truth-and-composition benchmark

Build a domain-reviewed answer set containing broad text, family text, exact IDs, fine/coarse pitch, omitted fields, invalid combinations, plausible-not-indexed cases, and conflicts. Resolve the internal `91290A115` contradiction first.

Compare:

- a plain text + compact-row resolver;
- the broad family resolver;
- the geometry workbench;
- a minimal exact inspector;
- the current passport.

Measure correct family/configuration, critical omissions, false BOM-ready states, time, and whether users can state what is known versus inferred.

**High-information decision:** Preserve a composition only if it reduces wrong decisions. Exact lookup must stay close to direct-inspector speed. Any confident false selection is a stop signal. Geometry or passport chrome that raises confidence without correctness should be removed.

### 3. BOM-readiness concierge duel

Give 5–8 target users a manual service that processes 5–15 real redacted BOM lines into `resolved`, `ambiguous`, `needs engineering input`, and `unsupported`. Compare its usefulness with resolving the same lines one at a time.

Do not build upload infrastructure. Have a mechanical reviewer check every unique match and every generated question.

Measure lines safely classified, critical false matches, engineer follow-up avoided or created, export usefulness, and preference for batch versus one-line work.

**High-information decision:** Pursue BOM cleanup only if it creates clear batch value with zero critical false unique matches. Otherwise keep local BOM capture as connective tissue.

### 4. Supplier-query translation field test

For 20 reviewed configurations, generate supplier-specific queries and compare them with a simple copied specification and the user's normal query on at least three destination sites.

Measure reformulations, useful candidate pages reached, time, lost constraints, and whether the user mistakes results for matches or equivalents.

**High-information decision:** Keep translation only if it materially reduces reformulation across sites and users remain correctly skeptical. If it performs like Google or supplier search, remove it and narrow the product promise.

### 5. Cross-category platform falsification

Use a small sanctioned dataset for one category unlike screws, preferably bearings, O-rings, springs, or fittings. Define its identity-critical fields, three realistic queries, one exact identifier case, one missing-data case, and one invalid/unknown distinction. Run the same requirement, configuration, evidence, and snapshot model without hiding new category logic in free text.

Have two domain reviewers challenge the configuration identity and required fields.

**High-information decision:** Keep the broad platform claim rejected unless the shared model survives while allowing honest category-specific rules. If the exercise requires a new identity model, continuous configurator, rating conditions, or manufacturer-part center, position PartSource as a fastener tool until those jobs are separately proved.

## Bottom line

Preserve the truth boundaries and exact-identifier strength. Narrow the immediate claim to fastener specification recovery. Treat family-first, passport, geometry, BOM cleanup, and query translation as competing hypotheses, not a bundle.

The next product decision should come from real recent tasks and blind mechanical truth checks. More prototype polish or more rows will increase confidence without increasing evidence.
