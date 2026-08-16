# Empirical Benchmark / Mechanical-Domain Adjudication — 2026-08-09

**Status:** Completed adjudication; frozen evidence retained  
**Scope:** Empirical/domain validation only  
**Repository:** `C:\Users\jayar\projects\partsource`  
**Decision boundary:** No production changes; `/to-spec` prohibited; no mechanical approval, release approval, supplier claim, equivalence claim, suitability claim, or BOM approval is made.

## Adjudication verdict

**The two reports do not contradict each other at the same claim level, but the later domain evidence materially narrows the benchmark's valid use.** The reproduced **120/120** score is real: the candidate composer exactly satisfies its frozen, self-authored state contract. It remains valid as a **fail-closed composition regression** and as historical evidence of defects in the emulated current artifact. It is **not** a mechanical-accuracy score, an independently reviewed truth score, a family-release gate, or evidence that the source-backed metric facts are well formed.

The mechanical objections are also reproduced from repository evidence rather than accepted on specialist authority:

- the frozen builder's socket predicate misses both hyphenated `Low-Profile` and typed profile `Low`;
- all **255** `DIN 7984` rows in the socket packet are metric and carry `Low-Profile`, so all satisfy the malformed socket-family predicate when pitch and length are present;
- `EXACT-002` and `METRIC-005` were selected from that leaking pool and freeze `candidate_family: socket_head_cap_screws` despite their low-profile source form;
- all **16/16** constrained metric cases put `mm` inside the pitch value while also storing `unit: "mm"`;
- scorer validation uses substring containment for pitch, and the candidate composer does not evaluate pitch, diameter, length, material, or family conformance before returning the expected candidate state;
- **5/16** metric cases place finish-bearing supplied text under `material_supplied`, with no independently normalized base-material and finish facts; and
- `CONFLICT-006` and `CONFLICT-007` encode domain assumptions that are not safe without qualified semantics.

**A corrected, separately versioned benchmark is required before any mechanical/domain or release-acceptance use.** The frozen v1 corpus must not be edited or superseded in place. It remains useful as forensic evidence and as a narrowly described legacy composition regression.

## Question and authority boundary

This adjudication inspected and cross-checked:

- `research/empirical-fastener-truth-benchmark-2026-08-09.md`;
- the frozen corpus and result under `research/fixtures/`;
- the deterministic builder and scorer under `research/validation-tools/`;
- `research/empirical-domain-family-release-review-2026-08-09.md`;
- `research/validation-mechanical-data-model-2026-08-09.md`;
- `research/validation-search-mechanical-reasoning-2026-08-09.md`;
- `research/data-source-register.md`;
- `research/product-contract.md`; and
- the permitted local packet only for bounded technical observations and aggregate counts.

The domain report is an input, not authority. The product contract controls claim boundaries; the source register controls permitted source treatment; repository execution and frozen artifact contents establish the empirical observations here. No complete licensed normative dimensional tables or signed qualified mechanical review were available, so this adjudication does not decide standards conformance or approve any family.

## Required eight-label classification key

This adjudication uses exactly the repository-required finding labels:

1. **Evidence**
2. **Fundamental requirement**
3. **Strong hypothesis**
4. **Opportunity / gold idea**
5. **Nice-to-have**
6. **Open question**
7. **Risk**
8. **Rejected**

The different source-report vocabulary quoted later is mapped into this key and is not adopted as an additional classification scheme.

## Artifacts and integrity

| Artifact | Reproduced SHA-256 / check | Disposition |
|---|---|---|
| Frozen corpus `research/fixtures/fastener-truth-composition-benchmark-v1.0.0.json` | `0b4acb8152288973a9fa6465d2c4f2d066a5e0566fb33503309e968e2e5c087b` before and after checks | Preserved; not edited or regenerated in place |
| Frozen result `research/fixtures/fastener-truth-composition-benchmark-v1.0.0.results.json` | `8f19f14c3d65844ef1f229cb9cd518a756ef6125b5df9817d7295e88122db160` before and after checks | Preserved; not overwritten |
| Scorer `research/validation-tools/score_fastener_truth_benchmark_v1.py` | `a7a28ec442acb0b9455142935d4026862276e6d94a2d6f5cafc01174bb313f0b` | Inspected and executed without modification |
| Builder `research/validation-tools/build_fastener_truth_benchmark_v1.py` | `ce6abb6cd0fe85cffaa4896474d251e5efc20dd893e0191674f5ad2a57ed19ae` | Inspected and executed to a temporary nonexisting path only |
| Temporary reproduction | 120 cases; corpus hash above; byte comparison identical | Deleted after comparison |
| Temporary score result | Written outside the frozen result path and deleted after scoring | No retained fixture change |

The builder itself refuses to overwrite an existing destination. The adjudication deliberately used a new temporary destination, compared it byte-for-byte with frozen v1, and removed it. This confirms reproducibility while preserving frozen v1 as evidence.

## Reproduced checks

### Frozen benchmark score

A fresh scorer run against frozen v1 returned:

| Measure | Reproduced result |
|---|---:|
| Cases | 120 |
| Candidate composer | 120 pass / 0 fail |
| Candidate abstentions | 95 |
| Candidate false-unique matches | 0 |
| Expected candidate sets | 25 |
| Expected unique selections | 0 |
| Current-artifact baseline | 8 pass / 112 fail |
| Current baseline abstentions | 47 |
| Current baseline false-unique matches | 58 |
| Explicitly unresolved answer-key items | 6 |

This confirms deterministic state-contract self-consistency. It does not add independent evidence to the answer key. The candidate composer returns a fixed safe state from intent and fixture state; for constrained discovery it returns `constrained_candidates`, `many`, and `candidate_set` with two reasons without checking mechanical compatibility of the supplied facts. The scorer checks response state, cardinality, selection state, optional target digest, and required-reason inclusion. It does not score a typed mechanical fact ledger.

### `EXACT-002` and `METRIC-005`

#### `EXACT-002`

The frozen case records:

- a packet-local namespace-qualified reference and candidate release string;
- expected `exact_mapping` with identity cardinality `one`;
- selection state `abstain` and reason `candidate_record_unreviewed`; and
- source metadata `candidate_family: socket_head_cap_screws`.

The permitted source observation is a metric `DIN 7984` **Low-Profile** socket-head form with source profile `Low`. The exact mapping/abstention shape remains conservative, but its frozen candidate-family metadata is wrong under the proposed standard-profile socket-head boundary. The case therefore may remain evidence of a packet-local exact observation, but it cannot serve as a correct family-membership answer key. Its candidate release membership is also only a fixture string, not an approved immutable release manifest.

#### `METRIC-005`

The frozen case records `M8`, length supplied as `60 mm`, family `socket_head_cap_screws`, material supplied as `18-8 Stainless Steel`, and pitch as:

```json
{"unit": "mm", "value": "1.25 mm"}
```

Its permitted source observation is also a metric `DIN 7984` **Low-Profile** form with source profile `Low`. The expected `constrained_candidates`/candidate-set state is safely non-unique, but the source row was admitted through the wrong family predicate and its pitch representation is malformed. The safe cardinality does not repair the family assertion or make the mechanical facts a valid domain answer.

### 255-row family-leakage assertion

The leakage assertion reproduced as follows:

1. Exact packet-content counts returned **255** rows matching `DIN 7984,Metric` and **255** rows matching `DIN 7984` plus `Low-Profile`.
2. The builder's socket branch excludes the literal terms `low profile`, `ultra-low`, `ultra low`, `high profile`, `pilot`, `torx`, and `square drive`.
3. It does not normalize punctuation and does not inspect `socket_head_profile == Low` as an exclusion.
4. Therefore `Low-Profile` does not match `low profile`; profile `Low` also has no effect.
5. The 255 observed rows carry metric thread, pitch, and length fields and therefore satisfy `has_metric_composition`.
6. Selection is then deterministic and evenly spaced from the contaminated pool, which is why two selected source-backed cases are visibly affected.

This is **family leakage**, not a claim that the source packet itself mislabeled the parts. The defect is in the benchmark's heuristic candidate-family predicate and in treating that predicate output as answer-key metadata.

### Pitch handling

The corpus inspection found **16/16** constrained metric cases with a pitch object whose string value already ends in `mm` and whose separate unit is also `mm`. Examples include `{"value": "0.5 mm", "unit": "mm"}` and the `METRIC-005` value above.

The builder copies the full supplied `thread_pitch` string into `value` and appends a separate unit. The scorer then does:

```python
supplied_pitch = str(constraints["pitch"][0]["value"])
if supplied_pitch not in str(record["pitch"]):
    raise RuntimeError(...)
```

That is string containment, not decimal parsing, exact typed equality, unit validation, diameter/pitch-plan validation, or a round-trip quantity check. In addition, the candidate composer does not inspect the pitch for a constrained-discovery result. Thus a 120/120 state score cannot establish that any metric pitch was normalized correctly.

All 16 cases also omit a separately typed nominal diameter, thread form/standard, direction, fit/tolerance, extent, and length basis. Those omissions are not necessarily contradictions in a minimal text fixture, but they disqualify the cases as complete mechanical answer keys or release-eligible configuration tests.

### Material and finish handling

The metric fixtures preserve one supplied material string but do not represent a separately normalized base material and finish. Five finish-bearing cases are directly visible:

- `METRIC-003` — black-oxide-bearing supplied material text;
- `METRIC-008` — zinc-plated-bearing supplied material text;
- `METRIC-009` — passivated-bearing supplied material text;
- `METRIC-011` — black-oxide-bearing supplied material text; and
- `METRIC-014` — zinc-plated-bearing supplied material text.

Preserving the supplied string is appropriate evidence handling. Treating that one string as a normalized `material_supplied` constraint without a separate derived base-material fact, finish fact, rule version, and conflict state is not mechanically sufficient. The source-projection loader separately coalesces property class/grade, tensile strength, or hardness into one `strength` string, so neither benchmark source validation nor the current baseline establishes clean material/finish/strength semantics.

`CONFLICT-007` also needs correction or qualification. It treats `stainless_steel` and `alloy_steel` as automatically exclusive because any two material values trigger `conflicting_material`. Stainless steels are alloys in a broad metallurgical sense; the intended controlled vocabulary and exclusivity rule must be explicit before this is a domain truth case.

`CONFLICT-006` has the parallel problem for drive. A physical combination Phillips/slotted recess can legitimately contain both features; two drive tokens are not automatically contradictory. If the intended test is mutually exclusive alternatives, the fixture must say so structurally.

## Contradiction adjudication

| Claim | Adjudication |
|---|---|
| “Candidate contract v1 scored 120/120.” | **True and reproduced.** It measures agreement between the deterministic candidate composer and its frozen contract answer key. |
| “The candidate safely abstained 95 times and produced zero false unique matches.” | **True under the frozen state axes.** Useful as fail-closed composition behavior, not as positive mechanical correctness. |
| “The benchmark is mechanically correct because it scored 120/120.” | **False.** Family metadata, metric quantity representation, and domain assumptions are not independently scored. |
| “The domain defects invalidate every benchmark result.” | **Too broad.** They invalidate mechanical/release uses, not the bounded state-machine regression or historical reproduction. |
| “Exactly two source-backed cases are known to carry low-profile leakage.” | **True for selected frozen cases:** `EXACT-002` and `METRIC-005`. The underlying contaminated source pool contains 255 rows. |
| “All 16 metric cases test exact pitch parsing.” | **False.** They carry duplicate unit representation and are checked by substring containment. |
| “The six originally unresolved cases are the only answer keys needing qualified review.” | **False after domain audit.** They remain unresolved, but additional affected cases and all release-scoped mapping/mechanical claims require qualification. |

There is therefore no legitimate “benchmark versus domain reviewer” vote to resolve. The benchmark already described itself as non-mechanical and self-consistency-only. The domain evidence reveals concrete defects that make any broader reading untenable.

## Valid and invalid benchmark uses

### Uses that remain valid for frozen v1

1. Regression of the candidate composer's response-state, identity-cardinality, selection-state, abstention, and required-reason behavior under the **frozen v1 contract**.
2. Reproduction of the local current-artifact baseline's contract mismatch, including the historical 8/120 score and 58 false-unique cases, provided it is described as local emulation rather than a live service measure.
3. Demonstration that exact-identifier, ambiguity, missingness, outside-release, unsupported, withdrawal, unavailable, and service-failure fixtures can be composed to fail closed.
4. Packet-local source-observation and missingness checks, bounded to the permitted packet and without claiming global identifier uniqueness, standards conformance, family approval, or release membership.
5. Forensic regression evidence showing how malformed family and metric assumptions entered a deterministic corpus.

### Uses that are not valid

1. Mechanical accuracy, standards conformance, dimensional correctness, search recall/precision, ranking quality, family-boundary correctness, or material normalization scoring.
2. A golden, blind, independently reviewed, or qualified truth corpus.
3. Acceptance of any family, immutable release, production implementation, BOM selection, supplier listing, equivalence, suitability, or approved alternate.
4. Positive unique-selection correctness: frozen v1 contains zero expected unique engineering selections.
5. Proof that exact mappings are globally unique or active in a real release; the namespace and release are fixture constructs.
6. Proof that a metric query is internally valid merely because the expected result is a candidate set.
7. Comparison of future implementations as “mechanically better” when they merely reproduce malformed v1 metadata.

## Corrected benchmark requirements

A new corpus version is required for mechanical/domain or release-gate use. It must not overwrite, silently mutate, or reuse the identity of frozen v1.

Minimum correction:

1. Freeze qualified, typed family-profile revisions and explicit inclusion/exclusion rules before case selection.
2. Exclude or separately classify all low/high/ultra-low and other neighboring socket forms; include negative-neighbor tests and assert **zero** leakage.
3. Rebuild affected source cases under the approved profiles; at minimum, replace or reclassify `EXACT-002` and `METRIC-005`.
4. Store pitch as an exact decimal value with unit stored once; parse nominal diameter separately; test exact value/unit equality and approved diameter/pitch-plan compatibility.
5. Add typed thread form/standard, direction, fit/tolerance, extent, length value/unit/basis, head and drive geometry, material, finish, strength/loadability, and standard issuer/part/edition assertions where required by the approved profile.
6. Preserve supplied material text while deriving base material/alloy/designation/condition and finish/coating as separate facts with rule versions and conflicts.
7. Separate property class/grade, tensile/yield values, and hardness instead of first-nonblank coalescing.
8. Rewrite `CONFLICT-006` to express mutually exclusive drive alternatives, or model combination drive as one allowed recess value.
9. Define a controlled material taxonomy and then rewrite or qualify `CONFLICT-007`; do not derive conflict from list length alone.
10. Validate candidate-family metadata and normalized fact output against source evidence, not only reference uniqueness, missingness, state, cardinality, and reason subsets.
11. Bind the new corpus to source-packet digest, parser/normalizer version, family-profile revision, standards-review scope, and immutable release-manifest digest.
12. Store independent qualified reviewer decisions separately from the executable fixture, including reviewer, date, scope, decision, disagreement, and adjudication.
13. Keep unresolved or unsupported facts explicitly unresolved; do not create engineering closure to improve a score.

A corrected corpus can coexist with v1. Frozen v1 should be labeled legacy composition/forensic evidence; the corrected version should receive a new filename, schema/corpus version as needed, digest, result artifact, and review record.

## Answer keys requiring qualified review

### Known affected cases

| Cases | Required qualification |
|---|---|
| `EXACT-002` | Correct/reclassify low-profile candidate-family metadata; separately verify namespace/release mapping if retained. Its packet-local exact observation and abstention can remain evidence. |
| `METRIC-005` | Correct/reclassify family, normalize pitch, add required typed facts, and review the resulting candidate expectation. |
| `METRIC-001`–`METRIC-016` | Replace duplicate-unit pitch representation; review family membership, diameter/pitch validity, material/finish decomposition, omitted thread/geometry/standard facts, and candidate-set answer. |
| `METRIC-003`, `METRIC-008`, `METRIC-009`, `METRIC-011`, `METRIC-014` | In addition, review supplied combined material/finish text and approved normalized decomposition. |
| `CONFLICT-006` | Review combination-drive semantics; current answer is not a safe universal conflict truth. |
| `CONFLICT-007` | Review controlled material categories and exclusivity; current answer assumes an unapproved taxonomy. |
| `BROAD-010`, `BROAD-011`, `BROAD-012`, `PARTIAL-005`, `PARTIAL-006`, `PARTIAL-009` | Preserve safe clarification/abstention, but obtain the already-declared family/standard/domain decisions and improve reasons where warranted. |

### Qualification required before stronger benchmark naming or release use

- `EXACT-001`–`EXACT-024` and `MISSING-001`–`MISSING-010`: an authorized source reviewer must independently verify packet observations; a qualified release reviewer must verify namespace, mapping type/state, and immutable release membership. Exact identity does not imply engineering selection.
- Every source-backed family assignment, including all metric cases: qualified mechanical review must check membership under an approved profile.
- Every synthetic case: an independent contract reviewer must verify the state transition without using scorer output as the oracle.
- Every mechanically meaningful answer in a corrected corpus: qualified review must be tied to lawful normative evidence and exact profile/release/corpus digests.

The remaining synthetic ambiguity, lifecycle, unsupported, and service fixtures can remain useful contract cases without inventing real-world states, but they cannot be cited as evidence that those lifecycle/release mechanisms exist in production.

## Mapping the domain report's different taxonomy

`research/empirical-domain-family-release-review-2026-08-09.md` used a different eight-term vocabulary: `release_blocker`, `high_risk`, `medium_risk`, `low_risk`, `validated_strength`, `evidence_gap`, `domain_review_required`, and `out_of_scope`. That report remains unchanged. Those terms are quoted here only to identify its source findings; this adjudication maps the material findings into the required key as follows.

| Domain finding | Required-label mapping in this adjudication | Adjudicated content |
|---|---|---|
| F-01 | **Fundamental requirement**, **Open question**, **Risk** | Qualified approval and signed release digest are required; approver and approval scope remain unresolved; absence blocks stronger use. |
| F-02 | **Evidence**, **Fundamental requirement**, **Risk** | The 255-row leak and two affected cases reproduce; corrected typed profile and zero-leak test are required. |
| F-03 | **Open question**, **Risk** | Button collar/recess/loadability/standard boundaries require qualified decisions. |
| F-04 | **Open question**, **Risk** | Pan parent-versus-drive-specific family and combination-drive semantics remain unresolved. |
| F-05 | **Evidence**, **Fundamental requirement**, **Risk** | Current projection drops or fuses selection facts; a complete typed ledger is required for release use. |
| F-06 | **Evidence**, **Fundamental requirement**, **Risk** | All 16 pitches duplicate the unit and substring validation is inadequate; exact typed quantity checks are required. |
| F-07 | **Evidence**, **Fundamental requirement**, **Risk** | Five metric cases fuse finish-bearing text into supplied material; supplied and normalized facts must be separated. |
| F-08 | **Fundamental requirement**, **Risk** | Immutable configuration/revision/release and correction/withdrawal composition are required for release claims. |
| F-09 | **Evidence** | The 120/120, 95-abstention, zero-false-unique state result reproduces and remains valid only as composition regression evidence. |
| F-10 | **Open question**, **Risk** | Lawful complete normative review and clause/table-level qualification are still missing. |
| F-11 | **Evidence**, **Risk** | Existing schema is scaffolding; current population and release relations are insufficient. |
| F-12 | **Evidence** | Packet-local reference distinctness is a bounded observation, not global uniqueness. |
| F-13 | **Rejected** | Supplier listing, offer, equivalence, suitability, approval, and commercial uses are not established and are rejected as benchmark conclusions. |

The mapping is intentionally contextual rather than word-for-word: a source severity term becomes **Risk**, a blocking remedy becomes **Fundamental requirement**, a supported observation becomes **Evidence**, an approval/evidence gap becomes **Open question** and often **Risk**, and excluded claims become **Rejected** for current benchmark use.

## Findings classified with all eight required labels

### Evidence

- The frozen builder reproduced a byte-identical 120-case corpus with the same SHA-256 without touching v1.
- The fresh scorer reproduced candidate 120/120, 95 abstentions, zero false-unique matches, and current baseline 8/120 with 58 false-unique matches.
- Packet-content and predicate inspection reproduced 255 metric `DIN 7984`/`Low-Profile` rows admitted by the socket heuristic and identified `EXACT-002` and `METRIC-005` as selected affected cases.
- Corpus/scorer inspection reproduced malformed pitch in 16/16 metric cases, finish-bearing material text in 5/16, and overbroad drive/material conflict logic.

### Fundamental requirement

- Preserve v1 unchanged and issue a new version for any corrected case or answer key.
- Mechanical/domain use requires approved typed profiles, exact typed quantity assertions, separate material/finish/strength facts, immutable release identity, source/rule/profile digests, and independent qualified answer-key review.

### Strong hypothesis

- A small corrected corpus generated only after profile approval, with independent answer keys and negative neighbors, can become a credible mechanical/domain gate; this is not yet demonstrated.

### Opportunity / gold idea

- Produce a differences-first review packet beside the new corpus: supplied versus normalized facts, profile predicate/exclusion result, omitted fields, conflicts, identifier/release state, source/rule digests, and reviewer disposition. This can make future defects visible without modifying the frozen evidence.

### Nice-to-have

- A reviewer UI, richer anomaly detection, cross-source comparison, and release-change visualization may improve review efficiency later, but none substitutes for the minimum corrected corpus and qualified decisions.

### Open question

- Qualified reviewers still must decide the three family boundaries, neighboring forms, combination-drive semantics, controlled material taxonomy, required fact policy, standards editions, and who can sign a digest-bound mechanical approval.

### Risk

- Leaving v1 named or reported without its composition-only qualifier invites the real 120/120 score to be misread as mechanical accuracy. Future systems could also be rewarded for reproducing the known family leak and malformed facts.

### Rejected

- Reject using frozen v1 for mechanical acceptance, release go/no-go, positive unique selection, BOM approval, supplier identity, equivalence, suitability, search-quality claims, or any production-readiness claim.

## Reproduction record

Executed from `C:\Users\jayar\projects\partsource`:

```bash
# Integrity and a fresh score were checked with a temporary output path.
sha256sum \
  research/fixtures/fastener-truth-composition-benchmark-v1.0.0.json \
  research/fixtures/fastener-truth-composition-benchmark-v1.0.0.results.json \
  research/validation-tools/score_fastener_truth_benchmark_v1.py \
  research/validation-tools/build_fastener_truth_benchmark_v1.py

python research/validation-tools/score_fastener_truth_benchmark_v1.py \
  --output C:/Users/jayar/projects/partsource/research/.tmp-benchmark-domain-adjudication-results.json

# Builder reproduction used a nonexisting path, then byte comparison.
python research/validation-tools/build_fastener_truth_benchmark_v1.py \
  --output research/fixtures/.tmp-fastener-truth-composition-benchmark-v1.0.0.reproduction.json
cmp -s \
  research/fixtures/fastener-truth-composition-benchmark-v1.0.0.json \
  research/fixtures/.tmp-fastener-truth-composition-benchmark-v1.0.0.reproduction.json
```

Both temporary files were removed. Frozen corpus and result hashes were checked again afterward and were unchanged. No production file, fixture, scorer, builder, domain report, source register, product contract, or `/to-spec` artifact was modified by this adjudication.
