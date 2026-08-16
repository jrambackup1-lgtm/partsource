# Manufacturing/sourcing proxy review — 2026-08-10

**Status:** Completed bounded proxy/synthetic review  
**Scope:** Safe-handoff packet and defensible-next-action usefulness only  
**Direct participants:** 0  
**Qualified manufacturing, sourcing, or mechanical approvers:** 0  
**Production edits, `/to-spec`, outreach, supplier submissions, quote requests, carts, orders, and blocked-source ingestion:** none

## Decisive proxy verdict

**A — proceed to human validation.** Retain the one-line safe packet **A** as the manual lead hypothesis. It produced a defensible state-specific next action for **10/10 synthetic lines**, versus **1/10** for the original-clue/source-direct baseline, while preserving **27/27 explicit input facts** and blocking unsafe alternate-supplier action in **10/10** lines. Treat queue wrapper **B** only as a thin batch wrapper when repeated next-action groups exist: it reduced synthetic review starts from 10 to 8, but added no fact, state, question-quality, or next-action gain over A.

This is **synthetic usefulness only**. It is not user validation, professional approval, manufacturability approval, procurement readiness, supplier confirmation, or evidence of listing, equivalence, suitability, stock, price, offer, availability, certification, or lead time. The repository still has no approved public family profile and immutable release for the tested exact fixture, so this run supported **zero alternate-supplier configuration handoffs**. The positive result is that A creates a defensible *next review action* without creating an unsafe supplier action.

## Gate and evidence boundary

The active proxy contract permits three evidence tiers and leaves direct human and qualified-review evidence absent:

1. **Public primary authority:** official manufacturer technical material and official distributor technical/API documentation. These sources inform field, revision, and failure boundaries; they do not approve PartSource records.
2. **Repository observation:** the authoritative product/source contracts, frozen research reports, and exercised prototypes.
3. **Proxy/synthetic specialist analysis:** the matrix and rubric below. It tests deterministic representation mechanics only.

No copyrighted standards table was copied. No SKDIN, LILY Bearing, Source-Search, Filtersource, McMaster API data, or other blocked source was scraped, captured, normalized, or ingested. Official public technical/help pages were consulted only as documentation. Attempts to retrieve Fastenal and Bolt Depot technical pages returned HTTP 403; no bypass was attempted and their blocked content was not used as evidence.

## Public primary evidence used

| Ref | Official source | Bounded observation used here | What it does **not** establish |
|---|---|---|---|
| P1 | Unbrako, *Engineering Guide* | Its introductory and metric sections state that fastener standards address dimensions, material, strength, and inspection; different standards are not always identical; standards can change; reference data is not certification; the metric socket-head section separately represents thread size/pitch, length, thread class, material/property class, and body/grip or thread-length concepts. | It does not approve PartSource's family schema, fixture mapping, release, packet, application suitability, or a supplier relationship. |
| P2 | Bossard, *Metric ISO Threads: Concept, Dimensions, and Tolerances* | Thread dimensions and profile accuracy affect coating allowance, assembly, and load transmission; the page separates coarse/fine series and tolerance fields. | It does not make every field universally required, identify a selected product, or establish application fit. |
| P3 | TR Fastenings, *General fastener standards* | The official cross-reference page distinguishes DIN, ISO, and BS entries and describes a socket-head-cap-screw entry as a modified version of ISO 4762. This supports preserving the supplied standard expression rather than collapsing standards into silent identity. | It does not prove exact equivalence among standards or approve a PartSource normalization rule. |
| P4 | TR Fastenings, cap-head technical page | The page separately exposes standard, material, and finish and warns that some products are changing from DIN to ISO and that critical dimensions should be checked before specifying. Commercial page fields were deliberately ignored. | No PartSource listing, manufacture, supply, preference, stock, or availability claim was recorded. |
| P5 | McMaster-Carr, *Product Information API* documentation | Access is for approved customers with certificates/authentication and subscription limits; the introduction says specifications change; the schema includes product status; documented malformed, authorization, subscription, and internal-server failures remain distinct. | The API is blocked for PartSource, was not called, and supplies no permission, mapping, listing, price, availability, or equivalence evidence here. |

### Manufacturing/sourcing implication of the public evidence

The eight fields used by prototype 006—family, thread designation/diameter, pitch, length, material, finish, drive, and referenced standard—are a useful **transmission floor** for that fixture, not a universal manufacturing or procurement specification. Public manufacturer documentation shows additional consequential distinctions such as property/strength class, thread class/tolerance, body/grip or thread extent, revision, coating effects, and inspection. Which of these is required depends on a reviewed family profile and the actual application. The packet must therefore preserve known facts and expose missingness; it must not claim that “8/8” means manufacturable, purchasable, suitable, or complete for an application.

## Compared conditions

### 1. Original clue / source-direct opening

- Preserve the submitted line.
- Only the exact-ID case exposes the source-direct action, preserving the identifier without translation.
- Emit no alternate-supplier action.
- Add no interpretation, blocking-fact explanation, or next question for other states.

This is the conservative baseline: it cannot silently mutate a fact, but usually leaves the recipient to reconstruct the next step.

### 2. One-line safe packet A

Each line contains:

- stable line ID and verbatim clue;
- explicit supplied facts, keeping supplied notation visible;
- interpretation state;
- derived or mapped claims shown separately from supplied claims;
- missing facts or conflicts;
- release/lifecycle/service boundary;
- separate handoff disposition;
- one precise next action or question;
- explicit claim exclusions.

A does not emit an alternate-supplier URL unless a unique, reviewed, active/release-aware public configuration passes every gate. No tested repository fixture met that condition.

### 3. Queue wrapper B

B wraps the exact A line packet and groups lines only by next safe action. It may centralize packet identity, rollup, and repeated boundary text, but may not merge facts, bulk-select a value, suppress a line, or promote readiness. The line kernel and action remain A.

## Predeclared synthetic rubric

| Measure | Rule |
|---|---|
| Fact retention | Every predeclared explicit input fact must occur in the condition's fact representation. The denominator is 27 supplied facts across 10 lines. Derived fixture claims, lifecycle state, and service state are checked separately and are not credited as supplied facts. |
| Unsafe action blocking | One point per line only when no alternate-supplier URL/action is emitted. The exact-ID line may expose only source-direct opening of the submitted identifier; it must still block alternate translation. |
| Question quality | 0 = absent, generic, leading, or unsafe; 1 = state-specific but not precise/answerable; 2 = names the blocking fact and asks for answerable evidence, or gives a precise non-question action when clarification is inappropriate. Maximum 20. This is proxy structural scoring, not human comprehension. |
| Defensible next action | One point only when the artifact explicitly names a bounded action that follows from the preserved state without guessing, stale reuse, substitution, or a prohibited claim. Maximum 10. |
| B orchestration | Count review-start groups, line assignments, and rollup checks separately. Grouping cannot be credited as new line truth. |

## Synthetic task packet

The packet deliberately includes two partial and two withdrawn lines so B has limited grouping opportunity. `SYN-WD-01` and `SYN-WD-02` are synthetic lifecycle controls only; they are not manufacturer, distributor, catalog, or PartSource identifiers.

| ID | Required state | Preserved synthetic input | Predeclared safe disposition |
|---|---|---|---|
| S01 | exact | `91290A115` | Source-direct only; preserve exact ID; disclose absent public profile/release; block alternate translation. |
| S02 | broad | `M4 screw` | Preserve M4 and generic category; ask for functional family/head-drive boundary; do not default to socket head or coarse pitch. |
| S03 | partial | `M4 socket head cap screw` | Preserve family and M4; name profile gaps; ask for missing selection facts; block handoff. |
| S04 | partial | `M4 socket head cap screw, alloy steel, black oxide, left-hand` | Preserve all supplied constraints; do not drop direction/material/finish; ask for pitch, length, fit, and thread extent; block handoff. |
| S05 | conflict | `91290A115 · M4 × 0.7 × 12 mm socket head cap screw` | Show submitted description beside the permitted fixture mapping; choose neither; request correction evidence; block handoff. |
| S06 | missing | `quantity 2; identifier blank; description blank` | Retain malformed row and quantity; request identifier+namespace or description; block handoff. |
| S07 | withdrawn | `SYN-WD-01` | Show synthetic current-release withdrawal; do not revive prior mapping or invent a successor; inspect correction/supersession evidence. |
| S08 | withdrawn | `SYN-WD-02 · M3 × 0.5 × 10 mm socket head cap screw` | Preserve full supplied description but still block because lifecycle state controls; no automatic successor. |
| S09 | service-failure | `91290A115; configuration service failed` | Preserve ID; remove/mark stale output; retry or export unresolved issue; block handoff. |
| S10 | unsupported | `BRG-608ZZ deep groove bearing` | Preserve identifier and bearing category; route outside the fastener release; do not emit `custom fastener`. |

## Executed state-by-state result

| ID | Original clue/source-direct result | A result | B result | Synthetic usefulness finding |
|---|---|---|---|---|
| S01 exact | Preserved ID and supplied one defensible source-direct action. | Added exact-mapping/release distinction and kept alternate translation blocked. | Same A line in `source-direct-only`; no batch gain. | A improves boundary visibility, not the next action itself. B adds overhead on a one-line exact case. |
| S02 broad | Preserved input; no next action. | Asked which functional family is required; blocked default family/pitch. | Same line in `choose-family`. | A converts a broad clue into a bounded question without narrowing it. |
| S03 partial | Preserved input; no next action. | Named pitch/length and profile gaps; blocked handoff. | Grouped with S04 in `complete-profile`. | A creates the next engineering-input request; B shares only the entry context. |
| S04 partial | Preserved input; no next action. | Preserved left-hand/material/finish and asked only for unresolved profile facts. | Grouped with S03 while retaining independent facts. | A prevents sourcing loss of supplied constraints; B must not bulk-fill shared gaps. |
| S05 conflict | Preserved both visible clue components; no correction path. | Separated identifier-mapped and description claims, chose neither, requested evidence. | Same line in `resolve-conflict`. | A creates a defensible correction action; no supplier action is safe. |
| S06 missing | Retained malformed input; no repair action. | Requested either identifier+namespace or description and retained quantity. | Same line in `repair-row`. | A prevents row disappearance and creates a repair action. |
| S07 withdrawn | Preserved synthetic ID; lifecycle consequence absent. | Made withdrawal controlling and requested correction/supersession authority. | Grouped with S08 in `review-withdrawal`. | A prevents stale resurrection; B reduces one review-start context only. |
| S08 withdrawn | Preserved complete-looking description; no lifecycle consequence. | Blocked despite apparent completeness and refused an automatic successor. | Grouped with S07 while preserving separate line. | Lifecycle outranks apparent specification completeness. |
| S09 service-failure | Preserved failure clue; no retry/stale-state rule. | Declared no output current, excluded stale state, allowed safe retry/export. | Same line in `retry-service`. | A creates a defensible processing action without an engineering answer. |
| S10 unsupported | Preserved bearing wording; no routing action. | Kept category unchanged and routed outside the fastener scope. | Same line in `outside-scope`. | A changes the next action without pretending bearing coverage. |

## Deterministic scorecard

A temporary, non-production Python harness encoded the frozen rows, representations, scoring rules, forbidden claim patterns, and B grouping. It asserted fact-token retention, alternate-action blocking, absence of forbidden claim/action patterns, A/B line-fact identity, and expected queue groups.

```text
synthetic_rows=10
required_states=broad,conflict,exact,missing,partial,service-failure,unsupported,withdrawn
original:fact_retention=27/27;unsafe_action_blocking=10/10;question_quality=2/20;defensible_next_action=1/10
A:fact_retention=27/27;unsafe_action_blocking=10/10;question_quality=20/20;defensible_next_action=10/10
B:fact_retention=27/27;unsafe_action_blocking=10/10;question_quality=20/20;defensible_next_action=10/10
A:line_action_prompts=10;review_starts=10
B:line_action_prompts=10;review_starts=8;queue_assignments=10;rollup_checks=1
B_fact_delta_vs_A=0;B_state_delta_vs_A=0;B_next_action_delta_vs_A=0
alternate_supplier_urls_emitted=0
forbidden_claim_patterns=0
assertions=passed
```

### Score interpretation

- All three conditions retained the original facts because the baseline was deliberately conservative. A's advantage is **state, exception, and action structure**, not recovery of facts that were absent from the clue.
- The original condition blocked unsafe automation by doing almost nothing. That is safe but usually not actionable.
- A and B's perfect synthetic question scores mean only that the authored prompts satisfy the authored structural rubric. They do not show that an engineer understands, can answer, or values the prompts.
- B reduced review-start groups by 2 because only the two partial lines and two withdrawn lines shared action groups. It still required 10 independent line actions, 10 group assignments, and a rollup check.
- Zero alternate-supplier URLs were emitted. This is the correct outcome under the repository's absent active reviewed release, not evidence that a supplier result is absent.

## Manufacturing/sourcing review

### Handoff completeness

A packet should separate three distinct levels:

1. **Clue completeness:** what the requester actually supplied.
2. **Configuration completeness:** what a reviewed family profile requires to state one configuration in a scoped release.
3. **Manufacturing/procurement completeness:** application-, organization-, manufacturer-, quality-, and transaction-specific requirements needed by the actual recipient.

The prototype's 8-field packet can be complete against its own fixture denominator while still omitting strength/property class, fit or thread class, thread extent, direction, dimensional tolerance, coating effects, inspection/certification, quantity/pack basis, revision/edition, approved manufacturer, and application conditions. The correct behavior is not to make every item universally mandatory. It is to label which fields are supplied, required by the reviewed family profile, conditionally required, or outside PartSource's claim.

### Supplier-query limit

A search string is lossy even when URL encoding is correct. Repository execution already found the current generic query retained 5/8 fixture fields and that destination-specific variants did not preserve all 8. The public technical evidence also shows why silent field loss can matter: standard revisions can differ; dimensions, material, strength, inspection, thread tolerance, coating, and thread extent are separate concepts.

Therefore:

- the visible packet is the durable artifact;
- a destination query is a derived, editable convenience only;
- an automatic field-loss diff must be visible before any allowed navigation;
- destination behavior cannot upgrade the packet into a listing, match, equivalent, offer, or availability statement;
- access denial, bot verification, timeout, or service failure cannot be interpreted as item absence.

### Source-direct limit

Opening `91290A115` at its submitted source preserves the user's identifier and is not a translation. It does not establish that PartSource has a released configuration, that another supplier has the same item, or that any candidate is suitable. A must name this path `source-direct-only` and keep it separate from configuration-derived supplier search.

### Lifecycle limit

A complete-looking specification must still stop when its mapping or release is withdrawn. The packet should retain:

- the saved clue and supplied facts;
- the release/revision against which prior interpretation occurred;
- current lifecycle state;
- correction, supersession, or withdrawal evidence if permitted;
- the absence of an approved successor when none exists.

It must never silently rewrite a saved packet or translate “withdrawn” into “use this replacement.”

## Recommended safe packet contract

Use A as the line kernel with these mandatory fields:

| Field | Requirement |
|---|---|
| Packet and line identity | Stable local packet ID, stable line ID, and creation/revision context; not a supplier or manufacturer identifier. |
| Preserved clue | Verbatim input, including units, punctuation, identifier namespace when supplied, handedness, standards, negations, quantity, and blank/missing state. |
| Interpretation state | Exactly one bounded state such as exact, broad, partial, conflict, missing, withdrawn, service-failure, unsupported, or unknown; state is separate from readiness. |
| Claim ledger | Supplied facts, deterministic normalization, mapped facts, and derived facts kept distinct. Never let normalization erase supplied notation. |
| Exceptions | Named missing facts, conflicts, unsupported tokens/category, reviewer disagreement, and confidentiality exclusions. |
| Family/profile boundary | Profile ID/version when approved; otherwise state that no approved profile exists. Do not use a generic universal fastener checklist. |
| Release/lifecycle | Immutable release ID and active/corrected/superseded/withdrawn state. A prior release cannot be silently presented as current. |
| Handoff disposition | Separate value such as `source-direct-only`, `engineering-input-required`, `outside-release`, `processing-blocked`, or `configuration-handoff-supported`. |
| Next safe action | One precise correction, evidence request, routing action, retry, source-direct opening, or stop. Never imply that every line should reach a supplier. |
| Public projection | Strict allowlist that excludes confidential origin, raw row IDs, source SKUs, private lineage, account data, and unapproved mappings before packet, query, URL, or BOM snapshot construction. |
| Claim boundary | Explicitly state that no suitability, equivalence, replacement, organizational approval, supplier listing, offer, stock, price, availability, certification, or order is established. |
| Query diff | Only after every gate passes: show every packet field included, omitted, or transformed in the editable outgoing query. Any selection-critical loss blocks automatic opening. |

### Allow/block rule

Alternate-supplier handoff is allowed only when all are true:

- one supported configuration is uniquely selected;
- a reviewed family profile defines the required public fields;
- all required fields are present and mutually consistent;
- the mapping and immutable release are active and not withdrawn/superseded without review;
- current service evaluation succeeded and no stale state is shown;
- the public projection contains no confidential/private field;
- the query/link is derived only from the approved public packet;
- omitted/transformed fields are visible and accepted without silently changing selection-critical truth;
- wording remains a search handoff requiring independent verification.

Any failed gate emits an issue packet, not an alternate-supplier URL.

## B wrapper rule

Use B only when a packet contains repeated next-safe-action classes. B must:

- embed A unchanged for every line;
- preserve every line and unresolved/failure state;
- group by action, not by guessed identity or superficial text similarity;
- make group actions reversible and line-scoped;
- prohibit bulk pitch, material, finish, standard, lifecycle, or disposition choices;
- show disposition counts rather than a readiness percentage;
- avoid B entirely for a clean one-line exact/source-direct case unless packet identity is independently needed.

The synthetic batch supplied only weak leverage: 8 groups for 10 lines. That is enough to keep B as a conditional wrapper, not enough to promote it over A.

## Classified findings

- **Evidence:** Public manufacturer documentation separates dimensions, material, strength, inspection, thread pitch/class, length, and body/grip or thread-length concepts; it also warns that standards can differ and change and that reference data is not certification.
- **Evidence:** Bossard's official thread guidance ties thread dimensions/profile accuracy to coating allowance, assembly, and load transmission. TR's official documentation preserves standard/material/finish separately and warns against specifying critical dimensions without confirming the standard supplied.
- **Evidence:** McMaster's official API documentation limits access to approved authenticated customers, describes changing specifications and product status, and distinguishes malformed, authorization, subscription, and internal-server failures. The API remained blocked and unused.
- **Evidence:** Repository evidence says prototype 006's visible packet retains 8/8 declared fixture fields, while the current generic compiler retains 5/8 and omits pitch, drive, and standard. Prototype 006 blocks the explicit unsafe states, while prior browser exercise found the current runtime emitted alternate links for partial, conflict, and unsupported routes.
- **Evidence:** The executed synthetic matrix retained 27/27 explicit facts and blocked unsafe alternate action in all three conditions. A and B each scored 20/20 for structural question quality and 10/10 for defensible next action, versus 2/20 and 1/10 for the conservative original-clue baseline.
- **Evidence:** B grouped 10 lines into 8 action starts but added 10 queue assignments and one rollup check. It added zero facts, states, question-quality points, or next actions over A.
- **Fundamental requirement:** Treat the complete public packet as a transmission artifact, not evidence of manufacturability, procurement readiness, application suitability, supplier identity, or commercial state.
- **Fundamental requirement:** One fail-closed public-projection and release/lifecycle gate must run before packet export, query construction, URL construction, source notes, or BOM snapshot. It must block partial, broad, conflict, missing, unsupported, withdrawn, unavailable, stale, unreviewed, non-released, and confidentiality-unsafe states.
- **Fundamental requirement:** Keep source-direct exact-ID opening separate from alternate-supplier configuration translation. Preserve the submitted ID exactly and never translate it into an alternate identity.
- **Fundamental requirement:** A family-specific reviewed profile, not a universal 8-field checklist, must define configuration-required and conditional fields. Missing property/strength, fit/tolerance, thread extent/direction, revision, or inspection requirements must remain visible when relevant.
- **Strong hypothesis:** A one-line packet that preserves the clue, exposes exceptions, and names one safe next action will be more useful in real engineering-to-sourcing handoff than opening the original clue alone, but this requires direct participant testing.
- **Strong hypothesis:** The packet will be more dependable than destination-specific syntax because it is reviewable before navigation and does not depend on destination parsing. Destination success and user reformulation effort remain unmeasured here.
- **Opportunity / gold idea:** Make the correction-aware public packet the durable completion artifact and generate any editable destination query from it with an automatic field-loss diff. The supplier click becomes optional and subordinate.
- **Opportunity / gold idea:** Let B appear only when repeated action groups exceed its orchestration cost; retain A as the exact same line kernel and show unresolved disposition counts rather than “readiness.”
- **Nice-to-have:** Add a print-safe public packet, local packet diff across releases, and a non-commercial local trace of query fields and destination outcome class only after safety and direct-comprehension gates pass.
- **Open question:** Whether practicing engineers or sourcing recipients understand the packet without facilitation, answer its questions, act safely, send it onward, reuse it, or prefer it to their normal source opening remains unknown.
- **Open question:** Which fields each bounded family must require, which are application-conditional, and whether an independently reviewed release can support any alternate-supplier handoff remain unresolved.
- **Open question:** Whether B's grouping prevents more follow-ups than it creates on recent real packets remains unmeasured; the synthetic packet produced only two repeated groups.
- **Risk:** The 20/20 question score is authored against an authored rubric. It can expose missing structural elements but cannot prove question comprehension, answerability in practice, saved time, or value.
- **Risk:** “8/8 complete” can create false manufacturing or procurement authority if property class, thread class/fit, thread extent, revision, inspection/certification, application conditions, or organization-specific requirements sit outside the denominator.
- **Risk:** A polished queue can imply packet readiness while every line remains engineering-input-required, outside-release, or processing-blocked.
- **Risk:** A withdrawal, correction, source failure, or blocked destination can be mistaken for absence or replacement unless lifecycle and destination state remain explicit and stale output is removed.
- **Rejected:** Advancing B over A from synthetic mechanics, calling either condition user validated, or describing proxy agreement as professional manufacturing/sourcing approval.
- **Rejected:** Automatic alternate-supplier links from broad, partial, conflict, missing, unsupported, withdrawn, unavailable, stale, unreviewed, non-released, or confidentiality-unsafe states.
- **Rejected:** Treating a complete packet, exact identifier, standards cross-reference, supplier search, or visible destination result as a listing, equivalent, replacement, approved alternate, suitable item, offer, stock state, price, availability state, certification, or order authority.
- **Rejected:** Scraping/ingesting blocked sources, bypassing access controls, outreach, forms, quotes, carts, purchases, production edits, or starting `/to-spec` in this gate.

## Decision rationale against proxy kill rules

The direction does **not** hit the packet-usefulness kill rule in this synthetic test: A created an explicit defensible next action on 9 lines where the original condition supplied none, without losing an input fact or exposing alternate-supplier action. It also blocks rather than promotes critical missing, conflicting, withdrawn, stale, or unsupported states.

The result still cannot close the human or qualified-review gates. It does not prove a lawful public release, a correct family profile, a real recipient's task improvement, or any supplier result. Therefore the supported next direction is a direct A-versus-normal-method human study using consented recent redacted work and independently frozen answer keys—not a bounded production POC and not `/to-spec`.

## Reproducibility

- Temporary harness: `%TEMP%\partsource-manufacturing-proxy-matrix.py`
- Harness SHA-256: `a6a91f700794f32e82e00fe6ba5e3e0c26f038f2ff9e1daeb755da77e9b8f725`
- Harness status: assertions passed; no repository/runtime dependency.
- Key repository source hashes at execution:
  - proxy contract: `73530ce12ab5128dd0acd45bdfad79267e3ec9d8565d62eaf2c4c7952cbf7605`
  - product contract: `aa073aeb09f3636b6f625ef6efb19c8c9e5da74b4b15a55b269238db883e4ac1`
  - data-source register: `e902eacfb2b5c1f6eaee382e6e0f5c1e1c9df8769fbb089da73b5c47f92d77bf`
  - empirical supplier-query report: `ad80fe38c08d37857c6012dfa79e6724c0d52f42d1f46f55a0514733359e0d6f`
  - A/B preflight duel: `ce8e15da835b6ee4655a7d858ce5a406e0c9f7fb584413be687047b1ac4f135d`
  - prototype 006 HTML: `4613a799629194482a6e135bb9dd58df1b4737eae6b77f77384bb57add5cb211`
  - prototype 007 HTML: `a5ee9873090e680de69d34cef136c32f998599135fbb4900043155ae92ad4859`

## Sources

### Public primary documentation

- P1 — Unbrako, *Engineering Guide*: https://unbrako.com/docs/engguide.pdf
- P2 — Bossard, *Metric ISO Threads: Concept, Dimensions, and Tolerances*: https://www.bossard.com/global-en/assembly-technology-expert/technical-information-and-tools/technical-information/metric-iso-threads/
- P3 — TR Fastenings, *General fastener standards*: https://www.trfastenings.com/knowledge-base/engineering-data/fastener-standards
- P4 — TR Fastenings, cap-head technical page used only for technical-field/revision wording: https://www.trfastenings.com/Products/Catalogue/Screws-and-Bolts/Hexagon-Socket-Screws/Cap-Head/TR00005506-000
- P5 — McMaster-Carr, *Product Information API*: https://www.mcmaster.com/help/api/

### Repository evidence

- `research/proxy-validation-gate-contract-2026-08-10.md`
- `research/product-contract.md`
- `research/data-source-register.md`
- `CONTEXT.md`
- `research/empirical-supplier-query-translation-2026-08-09.md`
- `research/empirical-a-vs-b-bom-preflight-duel-2026-08-09.md`
- `research/validation-supplier-handoff-2026-08-09.md`
- `research/empirical-engineer-recent-work-study-2026-08-09.md` — protocol/evidence boundary only
- `sketches/006-supplier-handoff-lab/README.md` and `index.html`
- `sketches/007-engineering-workspace-directions/README.md`, `index.html`, and `critique.md`
