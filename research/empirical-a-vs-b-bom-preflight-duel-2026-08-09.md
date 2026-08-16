# Empirical A-vs-B BOM Preflight Duel — 2026-08-09

## Executive result

This was an **internal fixture dry run**, not user research. No agent was counted or described as an engineer, buyer, participant, or user. The same 10-line repository-safe fixture packet and the same fail-closed line-resolution rules were applied first as **A: ten isolated one-at-a-time resolutions**, then as **B: one manually maintained issue queue**.

Both A and B produced the same line truth: **10/10 terminal classifications, 1 exact fixture recovery, 7 semantic abstentions, 2 processing failures, 46/46 critical-fact checklist items surfaced, 0 false unique matches, and 0 configuration handoffs supported**. B did not improve resolution accuracy or remove any of the 10 substantive line reviews. It reduced review-start contexts from 10 isolated cards to 8 issue groups and produced a more complete single artifact (12/12 structural checks versus A's 9/12), while adding 10 group assignments and one rollup check.

The strongest falsification result is that B's queue added **no line truth** and little grouping leverage on this deliberately heterogeneous packet (8 groups for 10 lines). On the exact-only L01 subcase it added bookkeeping with no state, fact, or safety gain. Calling this output “BOM readiness” would overclaim: even the exact line lacked an approved family profile and immutable public release, so the measured queue was an issue packet, not a readiness or approval artifact.

## Scope and guardrails

- Approved scope: empirical/domain validation using repository-safe fixtures.
- No production code, route, data, `/to-spec`, UI/dashboard, or prototype was created or edited.
- B was a manual research queue, not an implemented feature.
- No supplier listing, equivalence, suitability, approval, stock, price, availability, certification, or procurement claim was made.
- No user preference, task frequency, saved time, adoption, repeat use, willingness to pay, or business value was measured.
- The fixture packet tests workflow mechanics and safe state behavior. It is not a sample of recent engineer BOMs and cannot establish incidence.

## Required finding-label key

The authoritative eight-label taxonomy found consistently in the validation reports is:

1. **Evidence**
2. **Fundamental requirement**
3. **Strong hypothesis**
4. **Opportunity / gold idea**
5. **Nice-to-have**
6. **Open question**
7. **Risk**
8. **Rejected**

All findings in the classified register use one of these labels.

## Fixture provenance and safety boundary

The packet was selected from fixture states already present and explicitly bounded in the repository:

| Source artifact | Relevant fixture material | Safety statement |
|---|---|---|
| `research/validation-bom-readiness-wedge-2026-08-09.md` | Existing 11-line manual challenge and line-state contract | Only `91290A115 → M3 × 0.5 × 10 mm` is repository-supported exact evidence; other lines are illustrative state fixtures. |
| `sketches/006-supplier-handoff-lab/index.html` and `README.md` | Exact, partial, conflict, unsupported, and service-unavailable fixture states | Explicitly “validation fixture only,” not catalog evidence or a released configuration. |
| `sketches/007-engineering-workspace-directions/index.html`, `README.md`, and `critique.md` | Ambiguity, exact, conflict, failure, left-hand/material/finish preservation, and queue direction | Explicitly illustrative states, not released catalog truth; queue counts are warned against becoming dashboard theatre. |

Frozen source SHA-256 values at execution:

- `validation-bom-readiness-wedge-2026-08-09.md`: `f9f41c521ac321af8496198f9a26af477db6a4e19f2c9365c66da5bcc4c41848`
- `006-supplier-handoff-lab/index.html`: `4613a799629194482a6e135bb9dd58df1b4737eae6b77f77384bb57add5cb211`
- `007-engineering-workspace-directions/index.html`: `a5ee9873090e680de69d34cef136c32f998599135fbb4900043155ae92ad4859`

### Selected 10-line mixed-quality packet

This packet uses the repository's existing fixture wording and states; it does not reproduce confidential raw lineage.

| Row | Qty | Preserved fixture input | Fixture provenance |
|---|---:|---|---|
| L01 | 8 | ID `91290A115`; no description | BOM challenger L1 / prototype 006 exact |
| L02 | 8 | ID `91290A115`; `M4 × 0.7 × 12 mm socket head cap screw` | BOM challenger L2 / prototype 007 conflict |
| L03 | 20 | `M4 socket head cap screw` | BOM challenger L3 / prototype 006 partial |
| L04 | not supplied | `M4 socket head cap screw, alloy steel, black oxide, left-hand` | Prototype 007 mobile/preservation fixture |
| L05 | 4 | `M4 × 0.7 and M4 × 0.5 × 12 mm socket head cap screw` | BOM challenger L5 |
| L06 | 20 | `M4 screw` | BOM challenger L6 / prototype 007 ambiguity |
| L07 | 4 | ID `BRG-608ZZ`; `deep groove bearing` | BOM challenger L7 / prototype 006 unsupported |
| L08 | 3 | ID `ZZ-404`; no description | BOM challenger L8 |
| L09 | 2 | identifier blank; description blank | BOM challenger L9 |
| L10 | 2 | ID `91290A115`; injected catalog-service failure | BOM challenger L10 / prototype 006 unavailable |

The bearing line is deliberately retained because an outside-scope line is part of a mixed-quality packet and tests whether the fastener resolver abstains instead of inventing a screw state.

## Experimental protocol

### Shared line-resolution rules

The following rules were frozen before the measurement pass and applied unchanged to A and B:

1. Preserve row identity, raw input, supplied quantity, and explicit notation before interpretation.
2. Use only the repository-supported fixture mapping `91290A115 → M3 × 0.5 × 10 mm`; do not infer another identifier, namespace, mapping, or nearby configuration.
3. Preserve explicit family, diameter, pitch, length, handedness, material, finish, and category terms. Do not fill absent fields.
4. If explicit facts disagree internally or with the exact mapping on diameter, pitch, or length, return `conflict` and choose neither claim.
5. Return `partial` for safely preserved but incomplete supported-fastener text, `unsupported` for outside-category content, `unknown` for an unmapped identifier, and `failure` for malformed input or unavailable processing.
6. Never fuzzy-match identifiers, default pitch, silently narrow a family, merge rows, reuse stale state, or convert text similarity into a unique configuration.
7. Keep interpretation state separate from handoff disposition.
8. Because there is no approved family required-field profile or immutable public release, do not assert `configuration-handoff-supported`, including for L01.
9. Keep failed and unresolved lines in the artifact.
10. B may group rows by next safe action, but it may not bulk-apply a mechanical decision or suppress line identity.

### Measurement definitions

- **Terminal classification:** one of `exact`, `partial`, `conflict`, `unsupported`, `unknown`, or `failure` was recorded. This measures fixture-state completion, not engineering readiness.
- **Exact fixture recovery:** the one permitted mapping was surfaced without contradiction. It is not a released configuration or supplier identity.
- **Semantic abstention:** a `partial`, `conflict`, `unsupported`, or `unknown` result in which no unique configuration was asserted.
- **Processing failure:** malformed input or injected service failure, retained fail-closed.
- **Critical fact surfaced:** one predeclared, row-specific selection/safety checklist item remained visible. Compound phrases were counted once when the checklist treated them as one claim; the same checklist was used for A and B.
- **False unique match:** any unique configuration claim outside the sole permitted exact fixture, or any unique claim despite explicit conflict/failure.
- **Substantive review action:** a row-specific human correction, missing decision, boundary routing, or retry. Grouping does not erase this work.
- **Review start:** opening one isolated line card in A or one grouped next-action bucket in B.
- **Repeated work:** shared setup repeated after the first line and a post-hoc line reread performed only to construct a batch rollup. B-specific queue assignments are reported separately rather than hidden.
- **Artifact usefulness:** only structural/mechanical utility against a 12-item rubric; not perceived usefulness or value.

### Twelve-item artifact-mechanics rubric

1. packet identity;
2. raw lines;
3. stable row IDs;
4. quantity/notes state;
5. interpretation state;
6. separate disposition;
7. critical facts/conflicts/missingness;
8. next review action;
9. release/mapping boundary;
10. failed/unresolved retention;
11. batch rollup/grouping;
12. one exportable artifact.

## A — one-at-a-time execution trace

A treated each row as a fresh isolated resolution card. The shared rule/boundary context was reapplied to each card. Only after all ten cards were complete was a batch tally produced by rereading them.

| Row | Interpretation | Handoff disposition | Critical-fact checklist hit | Safe next action |
|---|---|---|---:|---|
| L01 | `exact` | `engineering-input-required` | 5/5: ID; M3; 0.5 mm pitch; 10 mm length; absent approved profile/release boundary | Review profile/release before any frozen handoff; do not treat exact mapping as readiness. |
| L02 | `conflict` | `engineering-input-required` | 5/5: mapped claim; supplied claim; diameter, pitch, and length conflicts | Correct the identifier or description; choose neither automatically. |
| L03 | `partial` | `engineering-input-required` | 4/4: M4; socket-head family words; pitch unresolved; length unresolved | Supply pitch and length under a reviewed family profile. |
| L04 | `partial` | `engineering-input-required` | 9/9: socket family; M4; left-hand; alloy steel; black oxide; pitch, length, fit, and thread extent unresolved | Preserve all four supplied constraints; obtain missing thread/length decisions. |
| L05 | `conflict` | `engineering-input-required` | 6/6: M4; socket family; 12 mm; both supplied pitches; pitch conflict | Choose/correct the pitch; do not default to coarse. |
| L06 | `partial` | `engineering-input-required` | 4/4: M4; family unresolved; pitch unresolved; length unresolved | Choose the family boundary before asking configuration-specific questions. |
| L07 | `unsupported` | `outside-release` | 3/3: identifier; bearing category; outside fastener scope | Route outside this POC unchanged; do not create a custom-fastener state. |
| L08 | `unknown` | `outside-release` | 3/3: identifier; namespace absent; no mapping/no fuzzy route | Establish a reviewed namespace/mapping or leave unresolved. |
| L09 | `failure` | `processing-blocked` | 4/4: quantity; blank ID; blank description; malformed row retained | Repair the row; do not drop it from the issue artifact. |
| L10 | `failure` | `processing-blocked` | 3/3: identifier retained; service failure; stale mapping prohibited | Retry processing; show no prior or nearby answer. |

### A mechanics observed

- Terminal classifications: 10/10.
- Exact fixture recoveries: 1.
- Semantic abstentions: 7.
- Processing failures: 2.
- Critical-fact checklist hits: 46/46.
- False unique matches: 0.
- Substantive row reviews: 10.
- Review starts: 10 isolated cards.
- Shared-context repetitions beyond the first card: 9.
- Post-hoc collation: 10 card rereads plus one rollup operation.
- Artifact rubric: 9/12. The isolated cards contained every line-level rubric item but lacked packet identity, native batch grouping/rollup, and one exportable packet.

## B — manual issue-queue execution trace

B inserted the identical ten rows into one packet and applied the identical line rules. It then grouped rows only by the next safe action; row identity and all facts remained independent.

### Per-line outcome check

B reproduced A's outcome for every row: L01 `exact`; L02/L05 `conflict`; L03/L04/L06 `partial`; L07 `unsupported`; L08 `unknown`; L09/L10 `failure`. Dispositions and 46 critical-fact checklist items were identical. No line was promoted, merged, or omitted.

### Manual queue

| Next-safe-action group | Rows | Review starts | Constraint on action |
|---|---|---:|---|
| Review profile/release boundary | L01 | 1 | Exact fixture mapping remains blocked from configuration handoff. |
| Resolve explicit conflict | L02, L05 | 1 | Inspect each row independently; no bulk winner. |
| Supply pitch/length | L03, L04 | 1 | L04's fit/thread-extent gaps remain visible; no bulk values. |
| Choose family | L06 | 1 | Preserve M4; do not default to socket head. |
| Route outside scope | L07 | 1 | Preserve bearing line unchanged. |
| Establish namespace/mapping | L08 | 1 | No fuzzy identifier inference. |
| Repair malformed row | L09 | 1 | Keep the rejected row in the packet. |
| Retry service | L10 | 1 | No stale answer reuse. |

Queue rollup: `exact` 1; `partial` 3; `conflict` 2; `unsupported` 1; `unknown` 1; `failure` 2. Dispositions: `engineering-input-required` 6; `outside-release` 2; `processing-blocked` 2; `configuration-handoff-supported` 0.

### B mechanics observed

- Terminal classifications: 10/10.
- Exact fixture recoveries: 1.
- Semantic abstentions: 7.
- Processing failures: 2.
- Critical-fact checklist hits: 46/46.
- False unique matches: 0.
- Substantive row reviews: 10; grouping did not remove line decisions.
- Review starts: 8 action groups, versus A's 10 isolated cards.
- Shared-context repetitions beyond initial packet setup: 0.
- Post-hoc collation rereads: 0; the queue accumulated the rollup during insertion.
- Added B bookkeeping: 10 group assignments and one rollup-count check.
- Artifact rubric: 12/12; all rows, states, facts, actions, boundaries, counts, and failures existed in one packet.

## Measured comparison

| Metric | A: isolated line resolutions | B: manual issue queue | Measured delta / interpretation |
|---|---:|---:|---|
| Terminal classifications | 10/10 | 10/10 | No difference. |
| Exact fixture recoveries | 1 | 1 | No difference; not a release/readiness result. |
| Semantic abstentions | 7 | 7 | No difference; both failed closed. |
| Processing failures retained | 2 | 2 | No difference. |
| Critical facts surfaced | 46/46 | 46/46 | No accuracy or visibility lift from queueing under the checklist. |
| False unique matches | 0 | 0 | Both passed the fixture safety check. |
| Configuration handoffs supported | 0 | 0 | Queueing created no readiness. |
| Substantive line reviews | 10 | 10 | B did not remove engineering review work. |
| Review starts | 10 cards | 8 groups | B reduced entry contexts by 2 (20%), but groups still require per-row inspection. |
| Shared-context repetitions after first setup | 9 | 0 | B centralized packet boundary/provenance text. |
| Post-hoc collation line reads | 10 | 0 | B accumulated rollup state; A needed a separate tally pass. |
| Added queue bookkeeping | 0 | 10 assignments + 1 count check | B paid explicit orchestration overhead. |
| Artifact-mechanics rubric | 9/12 | 12/12 | B added packet identity, native grouping/rollup, and one exportable artifact. This is not a user-value score. |

### Deterministic verification

A temporary fixture-aware Python counter outside the repository encoded the already-recorded manual states, fact-checklist counts, action groups, and rubric. It did **not** act as a product resolver or independently prove mechanical correctness; it checked arithmetic and A/B consistency. It completed with assertions passing and reported:

```text
lines=10
states=conflict:2,exact:1,failure:2,partial:3,unknown:1,unsupported:1
dispositions=engineering-input-required:6,outside-release:2,processing-blocked:2
terminal_classifications=10
exact_recoveries=1
semantic_abstentions=7
processing_failures=2
critical_fact_checklist_hits_A=46/46
critical_fact_checklist_hits_B=46/46
false_unique_A=0;false_unique_B=0
substantive_review_lines_A=10;substantive_review_lines_B=10
review_starts_A=10;review_groups_B=8
artifact_rubric_A=9/12
artifact_rubric_B=12/12
shared_context_repetitions_A=9;shared_context_repetitions_B=0
posthoc_collation_line_reads_A=10;posthoc_collation_line_reads_B=0
queue_group_assignments_A=0;queue_group_assignments_B=10
queue_count_checks_A=0;queue_count_checks_B=1
```

Harness SHA-256 at execution: `0a9d102a704d98ebb9a51a6afa1b9fd15a2f674c1f61b84e83b4840c7d80caa4`. The temporary harness was removed after verification; no runtime or production file depended on it.

## Attempt to falsify B

### 1. Queueing did not improve line truth

B produced exactly the same 10 states, 46 checklist hits, 0 false unique matches, 7 abstentions, and 2 failures as A. Its measured advantage was orchestration and artifact structure, not resolution correctness. If the line kernel is wrong, B would batch the wrong result.

### 2. Queueing did not remove substantive review

Every row still required a row-specific review/boundary/retry action: 10 for A and 10 for B. Grouping reduced only the number of entry contexts, from 10 to 8. Because this packet deliberately spans many states, 8 groups for 10 rows is weak consolidation.

### 3. Exact-only subcase: queue adds no value

On L01 alone, A and B both surface the same five critical items, the same `exact` interpretation, the same blocked handoff, and the same required release/profile review. A one-row B queue additionally needs packet setup, one group assignment, and a rollup count. For this clean/exact-sized case, B adds structure without any accuracy, review, or handoff gain.

### 4. Heterogeneous or low-repeat packets weaken B

When next actions are mostly unique, B approaches one queue group per row and adds categorization overhead. B gains more mechanical leverage only when multiple lines genuinely share the same next safe decision; this packet provided only two two-row groups.

### 5. “BOM readiness” is falsified by the disposition rollup

The queue has 0 `configuration-handoff-supported` lines, including the exact identifier. Six require engineering input, two are outside the release, and two are processing-blocked. Any green packet status, readiness percentage, or “BOM ready” label would contradict the measured line dispositions and the absent approved profile/release.

### 6. Fixture selection cannot prove real batch value

The packet was assembled from repository validation fixtures designed to exercise state boundaries. It does not show that recent real BOMs contain these states, that grouping recurs, that a reviewer saves time, that the output changes a handoff, or that anyone prefers it. The 12/12 artifact score proves structural coverage only.

## Findings classified with all eight required labels

- **Evidence:** Under one frozen fixture packet and one rule set, A and B both produced 10/10 terminal classifications, 1 exact fixture recovery, 7 semantic abstentions, 2 failures, 46/46 critical facts surfaced, 0 false unique matches, and 0 supported handoffs.
- **Evidence:** B reduced review-start contexts from 10 to 8 and eliminated 9 repeated shared-context setups plus a 10-line post-hoc collation read, but it added 10 queue-group assignments and one count verification.
- **Evidence:** B scored 12/12 versus A's 9/12 on the declared artifact-mechanics rubric because it supplied packet identity, native rollup/grouping, and one exportable artifact. This does not measure perceived usefulness.
- **Fundamental requirement:** B must continue to use A's exact same deterministic line kernel, preserve raw line identity, keep interpretation separate from disposition, retain failures/unresolved rows, and forbid bulk application of mechanical choices merely because rows share an issue group.
- **Fundamental requirement:** A queue must not be called ready, approved, or handoff-supported unless each claimed line independently satisfies a reviewed family profile and immutable release gate; this run satisfied zero such lines.
- **Strong hypothesis:** B will show larger mechanical gains than the 2-review-start reduction measured here only on real packets with repeated next-safe-action classes and recipients who can use a single issue artifact without facilitator explanation.
- **Opportunity / gold idea:** Treat A as the resolution kernel and make B only a thin, local, reversible issue-packet wrapper that is justified by repeated action groups; show the disposition rollup rather than a readiness percentage.
- **Nice-to-have:** A differences view or compact packet diff may improve review scanning after state correctness is established, but it was not needed to execute or verify this duel.
- **Open question:** Real recent-work incidence, packet size, repeated issue density, time and backtracks, recipient comprehension, follow-up reduction, reuse, preference, willingness to change, and willingness to pay remain unmeasured.
- **Risk:** A polished queue can turn deterministic classification into false authority. In this run, displaying a green packet or “1 exact” headline without the 0-supported-handoff result would overclaim BOM readiness.
- **Risk:** The constructed state-balanced packet may exaggerate queue visibility while under- or over-estimating grouping leverage in actual work.
- **Rejected:** Treating agents as users, treating fixture completion as user validation, claiming saved time or value, promoting B over A from this run, emitting a readiness percentage, auto-merging lines, bulk-applying decisions, or building a dashboard/`/to-spec`/production implementation.

## Limits: measured mechanics versus unproven preference/value

### Measured here

- deterministic state/disposition consistency on ten existing fixture lines;
- safe abstention and failure retention;
- critical-fact checklist coverage;
- false unique fixture matches;
- repeated setup/collation mechanics;
- line-review and grouped-review counts;
- queue bookkeeping overhead;
- structural artifact coverage.

### Explicitly not measured

- practicing-engineer behavior or comprehension;
- preference for A or B;
- real packet frequency, issue distribution, or urgency;
- task time, elapsed time, backtracking, interruptions, or avoided follow-ups;
- whether a downstream recipient can use the packet;
- repeat intent, adoption, willingness to pay, ROI, cost avoidance, or business value;
- mechanical approval, application suitability, release readiness, procurement readiness, or production readiness.

## Conclusion

**Measured workflow mechanics favor B only as a batch artifact wrapper, not as a better resolver or a readiness product.** B preserved the same safe line outcomes as A, reduced isolated review contexts by 2 and removed repeated setup/collation work, but added queue bookkeeping, did not reduce the 10 substantive reviews, and added no critical facts or accuracy. Its value disappeared on the one-line exact subcase and was limited on a heterogeneous packet with 8 issue groups for 10 rows.

The defensible output is therefore an **issue packet with 0 supported handoffs**, not a ready BOM. User preference and product/business value remain unproven and require permitted direct testing on recent redacted engineer packets; this internal fixture duel cannot supply that evidence.
