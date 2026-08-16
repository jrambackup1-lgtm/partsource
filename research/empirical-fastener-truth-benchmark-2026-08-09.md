# Empirical Fastener Truth / Composition Benchmark — 2026-08-09

**Status:** Frozen validation artifact executed against a candidate safe-composition contract and a local current-artifact baseline  
**Scope:** Bounded POC empirical/domain validation only  
**Decision boundary:** This is not `/to-spec`, production acceptance, mechanical approval, a reviewed catalog release, or a public claim.  
**Prohibitions observed:** no production edits; no public claims; no supplier offers/equivalence/suitability claims; no raw confidential lineage in the corpus or result output.

## Executive result

A versioned **120-case** truth/composition corpus was built and executed.

- **Candidate contract v1:** **120 pass / 0 fail**, **95 abstentions**, **0 false unique matches**.
- **Current-artifact baseline:** **8 pass / 112 fail**, **47 abstentions**, **58 false unique matches**.
- **Frozen expected selection states:** 95 abstentions, 25 candidate sets, and **0 reviewed unique engineering selections**.
- **Unresolved answer-key items:** 6. Their safe behavior is scored (clarify/abstain), but no unapproved engineering family answer is invented.
- **Corpus SHA-256:** `0b4acb8152288973a9fa6465d2c4f2d066a5e0566fb33503309e968e2e5c087b`.

The candidate score proves that the validation-only state composer is internally consistent with the frozen contract. It does **not** prove production correctness. The current baseline is a local deterministic emulation of the checked-in importer and latest SQL semantics, not a live Edge/database test.

## Frozen artifacts and versioning

| Artifact | Version/path | SHA-256 |
|---|---|---|
| Benchmark corpus | `research/fixtures/fastener-truth-composition-benchmark-v1.0.0.json` | `0b4acb8152288973a9fa6465d2c4f2d066a5e0566fb33503309e968e2e5c087b` |
| Executed result | `research/fixtures/fastener-truth-composition-benchmark-v1.0.0.results.json` | `8f19f14c3d65844ef1f229cb9cd518a756ef6125b5df9817d7295e88122db160` |
| Deterministic scorer | `research/validation-tools/score_fastener_truth_benchmark_v1.py` | `a7a28ec442acb0b9455142935d4026862276e6d94a2d6f5cafc01174bb313f0b` |
| One-time deterministic corpus builder | `research/validation-tools/build_fastener_truth_benchmark_v1.py` | Validation-only helper; corpus hash above is the frozen identity |

The scorer revalidates all 50 source-backed cases against the current permitted local packet before scoring. It checked 50 unique reference observations, 50 missingness observations, and 16 metric compositions. The current importer projection contained 27,009 records.

## Inspected implementation and permitted evidence

The benchmark was grounded in these repository artifacts:

- `research/full-problem-space-synthesis-2026-08-09.md`;
- `research/poc-discovery-benchmark.md`;
- `research/validation-deterministic-architecture-2026-08-09.md`;
- `research/validation-mechanical-data-model-2026-08-09.md`;
- `research/validation-search-mechanical-reasoning-2026-08-09.md`;
- `research/product-contract.md`;
- `research/data-source-register.md`;
- `web/scripts/import-catalog-to-supabase.ts`;
- the three checked-in catalog generators;
- `supabase/migrations/20260808_catalog_search_rpc_expand_fields.sql`;
- `supabase/migrations/20260809_configuration_catalog_contract.sql`;
- `supabase/functions/catalog-search/index.ts`;
- `web/src/lib/catalogApi.ts` and `web/src/hooks/useCatalogSearch.ts`;
- current catalog importer/search validation scripts; and
- the locally approved technical packet under `data/`, accessed only for permitted technical observations and aggregate validation.

Relevant implementation facts reproduced by the baseline:

1. importer missingness is outer trim plus blank/exact-dash to null;
2. family is an import bucket (`socket`, `hex`, or `rounded`), not an approved mechanical family;
3. strength is coalesced from grade/class, tensile, or hardness;
4. the import drops selection-relevant fields;
5. the current SQL uses text `ILIKE`, token containment, and un-namespaced exact reference/source-key branches;
6. both exact branches use `LIMIT 1` and have no release or lifecycle state;
7. imported records are mutable demo-only synthetic projections, not a reviewed immutable release; and
8. the checked-in Edge/hook failure path now fails closed and clears result state, which is why the eight injected service cases are the only current-baseline passes.

No blocked source was consulted or represented. Source-backed case labels disclose neither source keys nor raw private lineage.

## Classification schema

Each case is classified on independent axes so “found one row” cannot silently become “safe unique engineering answer.”

### 1. Case class

- `namespaced_exact_id`
- `broad_family_text`
- `constrained_metric_input`
- `partial_input`
- `explicit_conflict`
- `ambiguous_identifier`
- `missing_critical_facts`
- `outside_release`
- `unsupported_family`
- `withdrawn`
- `unavailable`
- `service_failure`

### 2. Evidence basis

- `source_backed_observation` — an exact mapping/missingness observation in the permitted local packet; not mechanically approved.
- `source_backed_composition` — a query composed from observed permitted technical fields; family boundary and resulting candidates remain unreviewed.
- `contract_synthetic` — a state-machine fixture only. It makes no real withdrawal, availability, release, collision, or service-rate claim.

### 3. Expected outcome axes

- **Response state:** `exact_mapping`, `family_candidates`, `constrained_candidates`, `clarification_required`, `conflict`, `ambiguous_identifier`, `not_in_release`, `unsupported_family`, `withdrawn`, `unavailable`, or `service_unavailable`.
- **Identity cardinality:** `zero`, `one`, `many`, or `not_evaluated`.
- **Selection state:** `unique`, `candidate_set`, or `abstain`.
- **Answer-key status:** `resolved_contract_or_observation` or `unresolved_domain_review`.
- **Reason codes:** deterministic causes such as `identifier_collision`, `missing_critical_facts`, `release_mismatch`, or `candidate_record_unreviewed`.

A case passes when response, identity cardinality, selection state, target digest where applicable, and all required reason codes match. Extra conservative reasons are allowed. A **false unique match** is any case where actual identity or selection is unique but the frozen expected axis is not unique. The result also reports identity and selection false-unique counts separately.

## Corpus composition and reviewability

### Composition

| Case class | Cases | Evidence basis | Expected safe shape |
|---|---:|---|---|
| Namespaced exact ID | 24 | Source-backed observation | One mapping; selection abstains because the record/release is unreviewed |
| Broad family text | 12 | Contract/synthetic | 9 family candidate sets; 3 unresolved boundaries clarify/abstain |
| Constrained metric input | 16 | Source-backed composition | Preserve typed facts; candidate set only |
| Partial input | 10 | Contract/synthetic | Clarify/abstain |
| Explicit conflict | 10 | Contract/synthetic | Conflict/abstain |
| Ambiguous identifier | 10 | Contract/synthetic | Ambiguous/abstain |
| Missing critical facts | 10 | Source-backed observation | Preserve exact mapping and gaps; abstain from selection |
| Outside release | 6 | Contract/synthetic | Not in requested release/abstain |
| Unsupported family | 6 | Contract/synthetic | Unsupported/abstain |
| Withdrawn | 4 | Contract/synthetic | Withdrawn/abstain |
| Unavailable | 4 | Contract/synthetic | Unavailable/abstain |
| Service failure | 8 | Contract/synthetic | Fail closed/abstain |
| **Total** | **120** | **50 source-backed; 70 contract/synthetic** | **95 abstentions; 25 candidate sets; 0 unique selections** |

### Can 150 cases be independently reviewed?

**Not merely because 150 cases can be generated.** Neither 150 nor this 120-case corpus should be described as independently reviewed without case-level reviewer identity, date, decision, disagreement, and adjudication evidence. This corpus contains no such signatures and therefore remains a deterministic validation draft.

The 120-case choice is deliberate:

- it stays inside the requested 100–150 range;
- it covers every required failure/composition class with nontrivial repetition;
- it exposes 50 source-backed observations for authorized inspection rather than padding to 150 with more synthetic variants; and
- it leaves six family/standard interpretations explicitly unresolved instead of manufacturing closure.

Before calling this a golden or blind truth corpus:

1. an authorized reviewer should independently verify every source-backed observation against the permitted packet;
2. a separate contract reviewer should verify every synthetic state transition without seeing scorer output first;
3. a mechanical reviewer should adjudicate the six unresolved taxonomy/standard items and the candidate family predicates;
4. reviewer decisions should be stored separately from the executable fixture to preserve a blind comparison path; and
5. only then should additional cases be added for demonstrated coverage gaps. A target of 150 is not a substitute for review capacity.

The current JSON includes its answer key and is therefore a regression corpus, not a participant-blind benchmark.

## Method and answer-key policy

1. The report skeleton was created before implementation inspection or benchmark generation.
2. Source permissions and claim boundaries were checked before reading the permitted packet.
3. The importer, generators, SQL, Edge boundary, client normalizer/fallbacks, and current tests were traced.
4. Source-backed cases were selected deterministically from unique permitted reference observations inside conservative candidate-family predicates.
5. No source-backed record was promoted to a reviewed configuration. Exact mapping identity and engineering selectability are separate axes.
6. Synthetic cases were used only where the current packet cannot truthfully establish a lifecycle/service/release state.
7. Missing, conflict, ambiguity, outside-release, unsupported, withdrawn, unavailable, and service-failure states all abstain. There is no nearest-row fallback or inferred pitch, finish, family, equivalence, suitability, or availability answer.
8. The scorer validates source observations first, then scores both the candidate contract and the local current-artifact baseline from the same fixture.

The answer key intentionally contains **zero reviewed unique engineering selections**. This is a limitation, not a success metric: the repository has no approved family profiles or immutable reviewed catalog release from which such answers could honestly be frozen.

## Measured results

| Measure | Candidate contract v1 | Current-artifact baseline |
|---|---:|---:|
| Total | 120 | 120 |
| Pass | 120 | 8 |
| Fail | 0 | 112 |
| Actual abstentions | 95 | 47 |
| False unique matches (case union) | 0 | 58 |
| False unique identity | 0 | 24 |
| False unique selection | 0 | 58 |
| Unresolved answer-key items | 6 | 6 |

### Results by required case class

| Case class | Candidate pass/fail | Candidate abstain | Current pass/fail | Current abstain | Current false unique |
|---|---:|---:|---:|---:|---:|
| Namespaced exact ID | 24 / 0 | 24 | 0 / 24 | 0 | 24 |
| Broad family text | 12 / 0 | 3 | 0 / 12 | 5 | 0 |
| Constrained metric input | 16 / 0 | 0 | 0 / 16 | 16 | 0 |
| Partial input | 10 / 0 | 10 | 0 / 10 | 2 | 0 |
| Explicit conflict | 10 / 0 | 10 | 0 / 10 | 10 | 0 |
| Ambiguous identifier | 10 / 0 | 10 | 0 / 10 | 0 | 10 |
| Missing critical facts | 10 / 0 | 10 | 0 / 10 | 0 | 10 |
| Outside release | 6 / 0 | 6 | 0 / 6 | 0 | 6 |
| Unsupported family | 6 / 0 | 6 | 0 / 6 | 6 | 0 |
| Withdrawn | 4 / 0 | 4 | 0 / 4 | 0 | 4 |
| Unavailable | 4 / 0 | 4 | 0 / 4 | 0 | 4 |
| Service failure | 8 / 0 | 8 | 8 / 0 | 8 | 0 |
| **Total** | **120 / 0** | **95** | **8 / 112** | **47** | **58** |

“Abstained” does not imply “passed.” For example, all 16 constrained metric baseline cases returned no rows and therefore abstained, but they failed because the system did not preserve/compose the constraints into the required candidate state and reason.

## Findings and falsification notes

1. **The current projection cannot support safe unique selection.** All 34 source-backed exact/missing cases return a single demo row under the current exact branch, while the answer key requires an unreviewed/missing-fact selection block.
2. **`LIMIT 1` is measurably unsafe under seeded state contracts.** The current baseline produced one identity for all 10 collision/namespace cases, all 6 other-release cases, and all 8 lifecycle cases. These account for the 24 false-unique identity cases.
3. **Selection false uniqueness is broader than identity collision.** The 58 false-unique selection cases also include 24 ordinary exact mappings and 10 missing-fact mappings that are identifiable but not safely selectable.
4. **Text retrieval does not compose constrained metric intent.** All 16 source-composed metric queries failed the contract. Current string fields, punctuation/token behavior, unapproved family buckets, and absent typed release state prevent a safe constraint ledger.
5. **Broad retrieval is not family-first composition.** Some broad queries return row sets and others return no rows, but none return the required family/clarification state with its reason.
6. **The current checked-in service path does fail closed.** All eight injected service-state compositions pass at the bounded state level. This does not measure live latency, stale deployment behavior, DTO allowlisting, or availability rate.
7. **Candidate 120/120 is not external evidence.** It is a contract self-consistency result. It must not be quoted as search quality, mechanical accuracy, recall, user validation, or readiness.
8. **The benchmark currently cannot test positive unique-selection correctness.** Until an immutable reviewed release exists, adding “correct” configurations would invent engineering answers from unapproved data.

## Reproduction commands

Run from `C:\Users\jayar\projects\partsource` in the repository Git Bash environment.

```bash
# Validate the two Python tools.
python -m py_compile \
  research/validation-tools/build_fastener_truth_benchmark_v1.py \
  research/validation-tools/score_fastener_truth_benchmark_v1.py

# Re-score the frozen corpus against candidate contract v1 and the current local baseline.
python research/validation-tools/score_fastener_truth_benchmark_v1.py

# Print the full measured JSON if needed.
python research/validation-tools/score_fastener_truth_benchmark_v1.py --stdout

# Verify frozen identity.
sha256sum research/fixtures/fastener-truth-composition-benchmark-v1.0.0.json
```

The one-time builder refuses to overwrite an existing frozen artifact. In a clean validation workspace, or with a new nonexisting comparison path:

```bash
python research/validation-tools/build_fastener_truth_benchmark_v1.py \
  --output research/fixtures/fastener-truth-composition-benchmark-v1.0.0.reproduction.json
```

A byte-identical reproduction must have SHA-256 `0b4acb8152288973a9fa6465d2c4f2d066a5e0566fb33503309e968e2e5c087b`. Do not replace the frozen v1 file in place; publish a new corpus version for any case or answer-key change.

## Unresolved answer-key items

| Case | Input issue | What is resolved | What remains unresolved |
|---|---|---|---|
| `BROAD-010` | Low-profile socket terminology | Clarify and abstain | Separate family vs facet vs excluded form |
| `BROAD-011` | Button head with flange | Clarify and abstain | Plain-button boundary vs flange family |
| `BROAD-012` | Pan head with captive washer | Clarify and abstain | Screw family vs washer-assembly boundary |
| `PARTIAL-005` | Standard-only partial input | Preserve input and clarify | Family/edition/relationship interpretation |
| `PARTIAL-006` | Button-head-only partial input | Preserve input and clarify | Drive and exact family boundary |
| `PARTIAL-009` | “Fine thread” partial input | Preserve input and clarify | Numeric thread fact and family applicability |

No engineering target is supplied for these cases. The benchmark scores only the safe response until domain review resolves them.

## Source, confidentiality, and claim notes

- “Source-backed” means only that an input/missingness composition was rechecked against the permitted local technical packet.
- It does not mean standards conformance, mechanical correctness, release membership, manufacturer identity, supplier listing, equivalence, suitability, availability, or approval.
- Synthetic withdrawn/unavailable/release/collision/service cases are contract fixtures, not claims about real identifiers or services.
- Public-safe opaque target digests replace private source identity. Source keys, filenames-as-lineage, raw rows, and private evidence links are not emitted.
- No production file, migration, Edge function, application source, or public route was modified.
