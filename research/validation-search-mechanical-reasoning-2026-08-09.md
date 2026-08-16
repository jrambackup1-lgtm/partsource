# Search and Mechanical-Reasoning Validation

## Verdict

The current PostgreSQL search is acceptable only as bounded lexical retrieval and exact-ID routing over a curated release. It is not a mechanical-reasoning engine. It must abstain when identity, namespace, dimensions, applicability, or compatibility are ambiguous. Exact-ID routing is the strongest current path, but even that path needs explicit namespace and release rules before it can be treated as generally safe.

## Validation method / limits

This report consolidates the completed trace across SQL, Edge, importer, API, decoder, UI, benchmark, and prototypes. Existing catalog, search, decoder, and importer tests passed. The validation also exercised representative exact, broad, related-item, and failure paths.

This was an implementation and behavior validation, not a domain review. The prototype fixtures demonstrate their scripted flows only; they do not establish correctness for arbitrary queries, complete truth states, substitutions, or mechanical applicability.

## Classified findings

### Evidence

- Exact query `91290A115` resolved to an M3×10 socket-head screw.
- The exact path uses `LIMIT 1` and has no namespace ambiguity handling.
- An M4 screw query became `Custom Fastener`, inferred M4×0.7, and returned socket-head configurations despite the broad family request.
- Exact detail displayed unrelated M2 rows as “related.”
- PostgreSQL search is lowercase text matching over unconstrained strings.
- Imperial TPI handling is broken.
- Strength data mixes property class, tensile strength, and hardness.
- Material and finish are fused.
- Standards lack organization, edition, and relationship structure.
- On forced broad-search failure, the UI showed `Failed to fetch` while leaving the preloaded grid visible. Exact detail failed closed.
- The broader prototype flow is safer, but fixture-backed behavior does not validate arbitrary inputs or truth states.

### Fundamental requirement

- Model normalized dimensions, units, fractions, tolerances, thread pitch/TPI, strength concepts, material, finish, and standards separately from display text.
- Represent standard organization, identifier, edition, and relationship explicitly.
- Define identifier namespaces, uniqueness rules, release membership, and ambiguity behavior.
- Parse and validate mechanical constraints deterministically before retrieval or ranking.
- Separate exact identity, lexical discovery, compatibility, relatedness, and substitution into distinct operations.
- Return an explicit abstention when required facts are missing, contradictory, ambiguous, or outside the curated release.

### Strong hypothesis

- Structured fields plus deterministic parsing will remove most false matches caused by substring search and fused attributes.
- A namespace-aware exact resolver will remain the safest and fastest production entry point.
- Related-item quality will improve only when relationships are stored or computed from typed compatibility rules rather than loose text similarity.
- Keeping the previous grid visible during a failed request will cause users to mistake stale content for fresh results unless stale state is unmistakably labeled.

### Opportunity / gold idea

Build a provenance-bearing constraint ledger for every query. It should show each parsed constraint, source span, normalized value, confidence or ambiguity state, applicable release, and whether the candidate satisfies, contradicts, or lacks that fact. Ranking should consume only validated ledger facts. The same ledger can drive explanations, abstentions, conflict reporting, regression fixtures, and audit logs without allowing generated prose to become catalog truth.

### Nice-to-have

- Show matched fields and normalized interpretations in result explanations.
- Offer unit display preferences without changing canonical values.
- Provide curated typo and synonym suggestions as non-authoritative prompts.
- Mark stale cached or preloaded content visibly after request failure.
- Expose release and provenance metadata in exact detail.

### Open question

- Which identifier namespaces and release scopes must be supported first?
- What authoritative sources define standard editions and cross-standard relationships?
- Which compatibility and substitution rules are approved for each product family?
- How should incomplete catalog records be distinguished from true non-applicability?
- What recall target is acceptable when safe abstention lowers result count?

### Risk

- Numeric-looking text matches can silently violate range, fraction, tolerance, conversion, fit, or thread semantics.
- `LIMIT 1` can turn namespace collisions or duplicate release records into arbitrary identity claims.
- Mixed strength fields can create unsafe comparisons.
- Fused material/finish values can produce false filters and substitutions.
- Broad family inference can over-specialize a request and hide valid alternatives.
- Unrelated “related” rows can be interpreted as compatible substitutes.
- A stale grid after failure can present obsolete results as current.
- Automation that publishes inferred facts can contaminate the catalog and compound future ranking errors.

### Rejected

- Treating lowercase substring search as mechanical reasoning.
- Using free text alone for numeric ranges, fractions, tolerances, unit conversion, fit, contradictions, or conditional applicability.
- Treating prototype fixtures as proof of arbitrary-query correctness.
- Selecting the first exact-text row without namespace, uniqueness, and release checks.
- Allowing an automated assistant to publish catalog facts, resolve factual conflicts, or select substitutes.
- Calling loosely similar items “related” or “compatible” without typed rules and evidence.

## Candidate golden corpus

| Case | Input | Required result |
|---|---|---|
| Exact known ID | `91290A115` with its declared namespace and release | Resolve uniquely to M3×10 socket-head; show provenance. |
| Exact missing namespace | `91290A115` where more than one namespace is possible | Request or apply an explicit namespace rule; never use arbitrary `LIMIT 1`. |
| Duplicate exact ID | Same namespace/ID appears twice in one release | Fail validation or abstain; do not choose one. |
| Broad metric request | `M4 screw` | Preserve broad family intent; do not silently force socket-head or infer pitch as a catalog fact. |
| Explicit metric thread | `M4 x 0.7 x 20 mm socket head` | Parse typed diameter, pitch, length, unit, and head style; reject contradictions. |
| Imperial thread | `1/4-20 x 1 in` | Parse diameter, 20 TPI, and length correctly; do not treat TPI as metric pitch. |
| Fraction/range | `3/8 in length, 1/4-20` and `10–12 mm length` | Normalize exact fraction and inclusive range deterministically. |
| Conversion boundary | Equivalent inch and millimetre constraints | Convert with declared precision and tolerance; avoid equality by rounded display text. |
| Contradiction | `M4 x 0.8` when the selected standard requires another pitch | Report the conflict and abstain from exact claims. |
| Strength distinction | Queries for property class, tensile strength, and hardness | Search separate typed fields; never compare them as one scale. |
| Material and finish | `steel, zinc plated` | Constrain base material and finish independently. |
| Standard edition | Standard identifier with and without edition | Honor edition when given; expose ambiguity when omitted and material. |
| Related items | Exact M3×10 detail | Return only items supported by a declared relationship; exclude unrelated M2 rows. |
| No safe match | Valid constraints with no candidate | Return no result plus a reason; do not relax silently. |
| Broad-search failure | Forced API/network failure | Show a clear error and mark or remove stale preloaded results. |
| Exact-detail failure | Forced exact-detail failure | Fail closed with no substitute identity. |

## Measurable gates

1. **Exact identity:** 100% unique resolution for golden exact IDs when namespace and release are supplied; 100% abstention for collisions, duplicates, or unresolved namespaces.
2. **Parsing:** 100% expected typed parses for the golden metric, imperial, fraction, range, conversion, and standard-edition cases.
3. **Contradictions:** 100% of seeded conflicts are surfaced; zero contradictory candidates presented as valid.
4. **Thread correctness:** Zero metric-pitch/TPI conflations in the corpus.
5. **Typed properties:** Zero cross-comparisons among property class, tensile strength, and hardness; zero material/finish fusion in filtering.
6. **Relatedness:** 100% of shown related items carry an allowed relationship and provenance; zero unrelated M2 rows for the M3 exact case.
7. **Abstention:** 100% safe abstention for missing required facts, unsupported applicability, ambiguous identity, and no-match cases.
8. **Failure state:** 100% of failed requests prevent stale content from appearing current; exact detail always fails closed.
9. **Release integrity:** 100% of returned records belong to the requested curated release.
10. **Regression:** Existing catalog, search, decoder, and importer tests remain passing, and every golden case becomes an automated fixture.

## Deterministic / assistive boundary

Deterministic code must own parsing, unit conversion, namespace and uniqueness rules, release membership, typed validation, conflict detection, applicability checks, ranking policy, and abstention. It must also decide whether a candidate satisfies a constraint and whether a stored relationship permits relatedness or substitution.

Automation may propose synonyms, typo corrections, family interpretations, parser-rule candidates, anomaly reports, and golden-corpus additions. Those proposals require deterministic checks and human approval before release. Automation must not publish facts, erase conflicts, invent compatibility, or select substitutes.

## Required prototype / product corrections

1. Replace unconstrained lowercase text matching with typed retrieval; retain lexical search only as bounded candidate discovery.
2. Make exact lookup namespace-aware, release-scoped, and uniqueness-checked; remove arbitrary `LIMIT 1` identity behavior.
3. Add deterministic parsers for metric pitch, imperial TPI, fractions, ranges, tolerances, and unit conversions.
4. Split strength, material, finish, and standard data into typed fields with provenance and edition metadata.
5. Preserve broad query intent; label optional assumptions and require confirmation before narrowing family or configuration.
6. Replace loose “related” results with declared, typed, provenance-bearing relationships and separate substitution rules.
7. Add explicit conflict, missing-fact, unsupported-applicability, and ambiguity responses instead of silent relaxation.
8. On broad-search failure, clear results or mark retained content as stale and not produced by the failed request; keep exact detail fail-closed.
9. Convert the candidate golden corpus into end-to-end regression tests covering API, decoder, retrieval, ranking, and UI truth states.
10. Gate publication of generated suggestions behind deterministic validation and human approval.
