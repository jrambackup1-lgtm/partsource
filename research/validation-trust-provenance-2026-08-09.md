# PartSource trust and provenance validation

**Date:** 2026-08-09  
**Phase:** Validation + Targeted Ideation Gate  
**Scope:** Broad search, family refinement, exact identifier, selected configuration, frozen BOM, and supplier-search handoff.  
**Status:** Desk validation and interface analysis; not direct-user evidence, a production schema, or permission to publish the current packet as reviewed truth.

## Terse verdict

**Risk:** PartSource can make its own handling of facts inspectable, but it cannot turn a confidential upstream source into independently auditable public provenance. The useful public trust pattern is a compact claim-scoped sentence, quiet fact-level states, and an evidence drawer backed by immutable release and correction records. A badge, score, evidence count, or bare `reviewed` label is false authority.

**Fundamental requirement:** Publish no selection or handoff state until the user can distinguish the submitted clue, the identifier mapping, the configuration facts, PartSource transformations, missing/conflicting facts, release identity, and the limits of the supplier destination.

**Strong hypothesis:** The right default is less evidence chrome, not less evidence: one compact sentence at the point of decision; fact-level exceptions in the specification table; details on demand; and a durable audit trail only when a saved item changes.

## Method and limits

**Evidence:** This review read the repository synthesis, Wayfinder map, product contract, domain language, source register, mechanical trust report, skeptical review, current-system audit, engineer-workflow validation, BOM challenger, release truth, exact-passport prototype, and compare-first prototype.

**Evidence:** Current repository facts include one approved confidential packet, no independently overlapping approved source, no approved family identity/required-field profiles, no immutable public catalog release, and no direct target-user validation. Current UI also conflates index presence with `verified` state.

**Evidence:** The corrected repository-safe exact example is `91290A115 → M3 × 0.5 × 10 mm`. The initial exact-passport prototype had shown the wrong configuration and was corrected. This is direct evidence that confident interface structure cannot substitute for a frozen truth corpus and release process.

**Evidence:** External primary/first-party interfaces were reviewed only as corroborating patterns. No external page supplied PartSource product facts. The W3C, SLSA, NASA, NIST, Crossref, and Texas Instruments materials cited below are not mechanical-catalog validation and are not authority for PartSource facts.

**Open question:** No desk review can establish whether engineers value public evidence, understand the proposed language, or reuse the frozen artifact. The comprehension tests in this report are required before publication claims.

## The evidence ladder

The evidence shown should increase with commitment and consequence. Broad search needs interpretation evidence. Exact lookup needs mapping evidence. Selection needs claim-level support. A frozen BOM needs reproducibility and change evidence. Supplier handoff needs an inspectable outgoing query and a strict claim boundary.

| Stage | Evidence visible by default | Evidence on demand | Gate / forbidden implication |
|---|---|---|---|
| Broad search | Verbatim input; extracted constraints; unresolved terms; candidate families; active catalog boundary | Why each family was suggested; aliases/rules used; release coverage; parser version | No row, configuration, completeness, suitability, or `available` claim |
| Family refinement | Chosen family; preserved constraints; unresolved required fields; family coverage; candidate count within one release | Family inclusion/exclusion rule; required-field profile; filter origin; fields the release cannot evaluate | One remaining row is not automatically selection-ready |
| Exact identifier | Submitted namespace/value; exact/ambiguous/not-found/withdrawn state; readable mapped configuration; concise source limitation | Namespace normalization; mapping revision; target revision; fact states; correction history | Exact routing is not equivalence, suitability, listing, stock, or source transparency |
| Selected configuration | Stable configuration/revision; all family-required facts; user choices versus supported facts; named noncritical gaps; no critical conflict | Raw supplied values; deterministic rules/versions; field-group evidence; review record; claim boundaries | Selection is blocked if a critical fact is absent, contested, withdrawn, or not evaluable |
| Frozen BOM | Saved configuration facts; quantity/notes/user cost; catalog release/configuration/mapping identity; save time; warnings frozen with the line | Digest; original input; derivations; supplier-query recipe; correction comparison and event history | A later release never silently rewrites the saved line; snapshot is not organizational approval |
| Supplier handoff | Destination name; exact outgoing query; included constraints; `supplier search only` boundary | URL, omitted/unsupported constraints, query-template revision, generated time, copyable configuration text | No listing, match, equivalent, approval, price, stock, certification, or receipt claim |

## Stage-by-stage behavior

### 1. Broad search

**Fundamental requirement:** Preserve the raw query exactly. Separately display only terms deterministically extracted without guessing: identifiers, dimensions, units, standards, material/finish words, drive words, handedness, and negation.

**Fundamental requirement:** Show unresolved or unsupported terms in the first view. A query such as `M4 screw` may preserve `M4` and keep family unresolved; it must not become an arbitrary socket-head row.

**Strong hypothesis:** The compact evidence sentence should answer interpretation, not provenance. Illustrative wording:

> Kept `M4` as a required thread-size clue. More than one family boundary may apply; no configuration is selected.

The word `reviewed` must be omitted from this sentence until an auditable family review record exists.

**Strong hypothesis:** Family suggestions can show a small `Why this family` disclosure: matched words, reviewed alias, excluded alternatives, and whether the candidate exists in the active release. Do not expose confidential source identity.

**Risk:** A source citation or release label at this stage distracts from the key question—what PartSource understood—and can make family ranking look authoritative.

**Rejected:** `M4 available`, `3 reviewed families`, row counts presented as configuration counts, confidence scores, or a positive family badge.

### 2. Family refinement

**Fundamental requirement:** Make the family boundary and the family-required-field profile inspectable. Engineers need to know which facts distinguish configurations and which missing facts block handoff.

**Fundamental requirement:** Every active filter must retain its origin: supplied in the query, chosen by the user, deterministically normalized, or inherited from a reviewed family definition. Dataset uniqueness is not an origin and must not fill a requirement.

**Fundamental requirement:** Distinguish:

- no released configuration matches;
- the release cannot evaluate the constraint;
- the combination violates a reviewed family rule;
- multiple configurations remain;
- one row remains but required facts are unresolved.

**Strong hypothesis:** The default sentence should be task language, not an evidence count:

> Thread size and family are set. Length and material still need a decision; this release cannot evaluate thread fit.

**Opportunity / gold idea:** Put `What still decides this configuration?` above secondary facets. Each item links to its family rule and current fact state. This makes evidence serve the next engineering decision.

**Risk:** Field-group summaries can hide that one critical fact in the group is normalized, missing, or disputed. They may orient the user, but they cannot determine selection readiness.

**Rejected:** `82% complete`, `7 facts verified`, one green family state, or automatic BOM readiness because one source row remains.

### 3. Exact identifier

**Fundamental requirement:** Show the submitted identifier namespace and value, the conservative normalization applied, the mapping state, and the mapped configuration revision as separate objects.

**Evidence:** The corrected local example supports the statement that `91290A115` occurs on one permitted source record with supplied M3, 0.5 mm pitch, and 10 mm length. It does not establish an independently auditable upstream citation, approved canonical family identity, or public release.

**Strong hypothesis:** Honest compact wording for the current prototype state is:

> This identifier occurs on one permitted PartSource source record for M3 × 0.5 × 10 mm. The upstream source identity is confidential, so this mapping cannot be independently checked from this page. No public catalog release exists yet.

Once a real release and scoped mapping review exist, the final clause can name their public records; it must not become `Verified part`.

**Fundamental requirement:** Exact lookup must return `exact`, `ambiguous`, `not found`, `malformed`, `withdrawn`, or `blocked`. It must not choose the first database row or fuzz an unknown identifier into a nearby one.

**Strong hypothesis:** Show the configuration immediately, then one short evidence sentence. Put namespace rules, mapping revision, supplied value, review event, and correction history in `Why this mapping`.

**Risk:** `Direct source record` sounds like an inspectable citation when the source is confidential. `Exact reviewed identifier mapping` sounds independent unless scope, method, reviewer role, date, and record are available.

**Rejected:** `Catalog ID` without namespace, `Exact verified`, `Current PartSource release` before a catalog release exists, or a positive badge based only on a single record.

### 4. Selected configuration

**Fundamental requirement:** Selection is permitted only when one active configuration revision remains, every field required by the approved family profile is explicit or supported, and no selection-critical conflict or withdrawal exists.

**Fundamental requirement:** The selected view must distinguish:

- **supplied** — present in permitted input evidence;
- **user selected** — a decision made in this session;
- **deterministically normalized** — transformed by a named reversible rule;
- **not supplied** — applicable but absent from source evidence;
- **not yet normalized** — source text exists but has not been safely decomposed;
- **not applicable** — excluded by a reviewed family rule;
- **conflicting** — applicable assertions disagree;
- **withheld/private** — evidence exists but the value or lineage cannot be public;
- **withdrawn** — the released claim or configuration is no longer selectable.

**Fundamental requirement:** Origin and review remain separate. A supplied value can be unreviewed or contested. A deterministic conversion can be rules-checked. Neither becomes suitable for an application merely because it is traceable.

**Strong hypothesis:** Normal supplied values need no badge. Use muted inline explanations only for transformations and gaps, and warning treatment only for conflict, withdrawal, permission block, or selection-critical absence.

**Strong hypothesis:** The default sentence should name the decision gate:

> One released configuration remains. Required thread, length, drive, material, and family identity are supported; standard edition is not supplied and is non-blocking for this discovery scope.

This wording is forbidden until the required-field profile, release, and non-blocking decision are auditable.

**Risk:** A negative disclaimer far from `Add to BOM` cannot offset positive authority created by green states, evidence counts, or `reviewed` language.

**Rejected:** A global `Supported`, `Verified`, or confidence badge without inspectable claim scope; automatic strength/standard/finish defaults; or a generic page-level provenance note.

### 5. Frozen BOM

**Fundamental requirement:** A saved line must freeze what the engineer saw and why it was selectable. Preserve public family/configuration identity, catalog release, configuration revision/digest, submitted input, identifier namespace/value and mapping revision when used, displayed facts and meaningful missingness, public evidence summary, supplier-query recipe revision, save time, quantity, notes, and user-entered cost.

**Fundamental requirement:** Do not freeze private source filenames, raw payloads, internal source SKUs, NDA lineage, permission documents, or internal reviewer notes into the browser-local record.

**Fundamental requirement:** A later correction may produce `A newer catalog correction affects this saved line`; it must not rewrite the snapshot. The user can inspect old versus new claims and deliberately create a new snapshot.

**Strong hypothesis:** Release identity is most useful here because it answers `What did this decision use?` It is secondary chrome during broad search.

**Opportunity / gold idea:** The correction comparison should show only changed claims, their old and new states, the public reason, the effective release, and whether selection/supplier handoff is now blocked. Keep unchanged required facts available on demand.

**Risk:** Calling a browser-local snapshot `released BOM`, `approved`, or an `audit record` imports PLM/quality authority PartSource does not possess.

**Rejected:** BOM readiness percentages, `verified` BOM lines, silent refresh, or a reviewer signature when no controlled organizational approval process exists.

### 6. Supplier handoff

**Fundamental requirement:** Show the exact text and constraints being sent before the user leaves PartSource. The user must be able to copy the configuration independently of the URL.

**Fundamental requirement:** State the claim boundary beside the action:

> Search this configuration on Supplier. Results are supplier search results, not PartSource matches, listings, equivalents, approvals, prices, stock, or certifications.

**Fundamental requirement:** Block the handoff for a withdrawn configuration, a selection-critical conflict, a processing failure, or an unresolved required field. A search URL is not evidence that the supplier has received or can supply the configuration.

**Strong hypothesis:** The drawer should reveal destination host, full query/URL, included constraints, constraints the destination recipe omitted, template revision, and generation time. This is an audit of PartSource’s translation, not supplier provenance.

**Opportunity / gold idea:** Add `Copy reviewed configuration text` next to `Open supplier search`. Compare whether users trust and reuse the transparent text more than an opaque destination link.

**Risk:** Supplier logos, `match` wording, shopping affordances, or a positive state can overpower the disclaimer and imply a commercial relationship.

**Rejected:** `Find this part`, `Buy`, `Matched supplier`, `In stock`, `approved supplier`, or any review/verification claim about destination results.

## Comparing the evidence patterns

| Pattern | Best use | Failure mode | Decision |
|---|---|---|---|
| Compact evidence sentence | Default orientation at every stage | Can compress distinct claims into one reassuring sentence; qualifiers may be overlooked | **Strong hypothesis:** lead with it, but keep claims grammatically scoped and state the strongest limitation |
| Fact-level states | Selection, exact inspection, comparison | Badge clutter; origin may be confused with correctness | **Fundamental requirement:** represent internally for every published fact; show inline only for exceptions and decisions |
| Evidence drawer | Raw value, transformation rule, mapping, review, and correction detail | Empty drawer repeats labels and creates audit theatre | **Strong hypothesis:** one small disclosure, deep-linked from the relevant claim; no hidden action gate |
| Claim boundary | Prevent equivalence, suitability, listing, approval, and stock inference | Boilerplate far from the action is ignored | **Fundamental requirement:** place it beside the result/action and repeat in exported handoff |
| Audit trail | Release correction, identifier remap, withdrawal, frozen BOM comparison | Timeline chrome implies governance without controlled events | **Fundamental requirement:** retain complete private events and publish a safe change summary only after real events exist |
| Badge / score / evidence count | Rapid decoration | Collapses scope, source authority, completeness, disagreement, and release status into false precision | **Rejected:** no global badge, score, star, `Indexed`, `Verified`, or direct/normalized/missing count card |

### Compact sentence rules

**Fundamental requirement:** A sentence must separately answer only the claims relevant to the current decision: what matched; what is supported; what was transformed; what important gap remains; and what this does not establish.

**Fundamental requirement:** Use subjects that reveal scope: `identifier mapping`, `configuration facts`, `family classification`, `supplier query`, or `saved snapshot`. Never use the unscoped subject `this part is verified`.

**Strong hypothesis:** Keep the default to one or two short sentences. If more is needed, the UI should expose structured facts rather than a paragraph of legal fog.

### Fact-level state rules

**Fundamental requirement:** Keep at least three independent dimensions in the underlying record:

1. **Origin:** supplied, user-selected, deterministic derivation, heuristic/candidate, or withheld.
2. **Evidence/review:** no review record, rules checked, reviewed for named scope, contested, or blocked.
3. **Publication lifecycle:** draft, active release, superseded, or withdrawn.

**Risk:** Combining these axes into `supported` may be acceptable as task shorthand only if the expanded evidence reveals the exact conditions. It cannot be the stored truth or a universal visual badge.

### Evidence drawer minimum

**Fundamental requirement:** For a fact or mapping, the drawer must contain:

- exact subject and claim;
- displayed value and supplied notation where public;
- origin;
- applicability/missingness state;
- deterministic transformation and version, if any;
- public-safe source class and an explicit confidentiality limitation;
- review scope, method, role, date, and public event ID, if review is claimed;
- catalog release and configuration/mapping revision;
- conflict, supersession, withdrawal, or correction state;
- the applicable claim boundary.

**Rejected:** A drawer that says only `reviewed normalization`, `trusted source`, or `current release` without the raw input, rule, scope, and event.

## Can confidential lineage create public trust?

**Evidence:** The source register permits technical-field publication but forbids publishing the confidential upstream origin or raw dataset. Public users cannot inspect source authority, context, revision, or collection method.

**Evidence:** W3C Data on the Web Best Practices says provenance should provide complete origin and change information so consumers can judge quality. PartSource cannot meet that strong public-origin standard for this packet.

**Open question:** Confidential lineage may still be acceptable for a bounded POC if engineers explicitly understand that they are auditing PartSource’s handling, not independently verifying upstream authority.

**Strong hypothesis:** Confidential lineage can create limited operational trust through stable identities, supplied-versus-normalized distinctions, permission controls, deterministic transformations, explicit gaps/conflicts, immutable releases, and honest corrections. Call this **inspectable PartSource handling**, not transparent or independently auditable provenance.

**Fundamental requirement:** Public wording must say:

> Supplied in a permitted PartSource dataset. Upstream source identity is confidential and cannot be independently inspected here.

Do not replace this with `direct`, `authoritative`, `trusted`, `verified source`, or an anonymous citation number that implies access.

**Risk:** A public reviewer or release label can launder the confidential source into apparent authority. Review may detect transcription and normalization errors; it does not establish upstream truth unless the review method independently checks the claim against a disclosable authority.

**Opportunity / gold idea:** Test two clearly separated trust questions: `Can you audit how PartSource transformed this value?` and `Can you independently audit where the supplied value originally came from?` The correct current answers are yes only when the transformation detail exists, and no for the upstream origin.

**Rejected:** Marketing the current confidential packet as transparent provenance, source consensus, independently verified data, or a trust advantage before users demonstrate calibrated understanding and task benefit.

## Is field-group evidence enough?

**Strong hypothesis:** Field groups—identity/thread, dimensions, material/finish, strength, and standards—are enough for a compact public overview in a one-source POC.

**Fundamental requirement:** Field-group evidence is not enough for selection-critical transformed, missing, conflicting, corrected, or withdrawn facts. Those need fact-level state and an inspectable claim detail.

**Fundamental requirement:** Even without a universal assertion platform, the private publication record must be able to answer which supplied field and transformation produced every public fact. Otherwise the public drawer cannot be real.

**Risk:** A `Dimensions supported` group can hide that length is supplied, pitch is parsed, head height is missing, and thread fit is dropped. A group status is therefore never a selection gate or proof that every member fact shares one origin/review state.

**Strong hypothesis:** Use a bounded hybrid:

- public default: one sentence plus group summary;
- specification table: quiet fact-level values and exception states;
- drawer: claim detail for transformed/gapped/contested facts;
- private release packet: source-field-to-public-claim mapping and review events;
- richer multi-source assertion/adjudication only when a second source overlaps, the first conflict appears, or the first technical correction must remain interpretable.

**Rejected:** Provenance badges on every cell, one row-level source note, or a field-group state used as proof of all facts.

## Release, reviewer, and correction language

### Release

**Evidence:** The existing `release.json` identifies a frontend deployment SHA, not the catalog facts returned by Supabase. The current catalog mutates rows in place.

**Fundamental requirement:** `Catalog release` may be shown only for an immutable, atomic fact set with a stable ID, creation time, included configuration/mapping revisions, and defined supersession/withdrawal behavior.

**Fundamental requirement:** Release means reproducible publication, not technical correctness, completeness, approval, or suitability. Prefer `Catalog snapshot 2026-…` if tests show users interpret `release` as approval.

**Rejected:** `Current release` as a positive quality state, or using the frontend commit SHA as catalog-evidence identity.

### Reviewer

**Fundamental requirement:** `Reviewed` is publishable only with an inspectable event that states:

- exact subject/claims reviewed;
- scope and acceptance criteria;
- method and evidence classes inspected;
- reviewer role and relevant independence/qualification claim that PartSource can substantiate;
- date and event ID;
- outcome, exceptions, and unresolved issues;
- release affected.

**Risk:** A name or initials alone add status but not auditability. `Independent review` is forbidden unless organizational independence and method are real and recorded.

**Strong hypothesis:** Public UI usually needs `Rules checked` or `Reviewed for identifier mapping in snapshot X`, not a person’s name. The full public-safe event can remain in the drawer/audit history.

**Rejected:** `Engineer reviewed`, `approved`, `certified`, or `verified` without the controlled scope and record above.

### Correction and withdrawal

**Evidence:** Crossref’s Crossmark makes current status and corrections/retractions inspectable, while explicitly saying the mark itself is not a guarantee. TI’s PCN workflow identifies affected products, detailed change, reason, tracking number, expected impact, qualification information, and effective dates. NASA configuration status accounting retains current and historical identities, proposed-change status, discrepancy disposition, and audit results.

**Fundamental requirement:** A public correction event must include event ID, affected public subjects/claims, old and new values/states, reason category, effective release, impact on identifier routing/selection/BOM/supplier handoff, and withdrawal/supersession state. Private evidence and actor details may be richer.

**Fundamental requirement:** Exact lookup of a withdrawn identifier returns the bounded withdrawal explanation. It never redirects to a nearby or replacement configuration.

**Opportunity / gold idea:** A correction notice attached to a frozen BOM is a better trust demonstration than a static provenance badge because the user can inspect what changed and decide whether to adopt it.

**Rejected:** Silent mutation, `data updated` without a diff/reason, deletion of historical meaning, or `corrected by reviewer` without an event record.

## Audit-trail contract

**Fundamental requirement:** The private append-only event trail should record:

- event ID and type;
- event time and effective release;
- subject identity and previous/new revision;
- exact claims changed;
- before/after value and state;
- reason and evidence references;
- transformation/parser version where relevant;
- actor role and review/disposition;
- affected identifier mappings;
- release publication/rollback/withdrawal action.

**Fundamental requirement:** The public-safe trail exposes stable IDs, times, changed claims, reason category, effect, and current status. It excludes confidential source identity, raw records, filenames, permission documents, personal reviewer notes, and private actor details.

**Risk:** An append-only database is not by itself an audit claim. PartSource must also control event creation, preserve identities, define who can disposition a correction, and test that history cannot be silently rewritten.

**Rejected:** Calling ordinary application logs, Git history, or a UI timeline a technical audit trail without the subject, claim, evidence, disposition, and release links.

## Direct-user comprehension tests

No users were contacted for this report.

### Test design

**Fundamental requirement:** Establish a mechanically reviewed answer key and prohibited-inference checklist before testing. Do not test with the current production UI while it still labels indexed records as verified.

**Strong hypothesis:** Compare three evidence compositions, counterbalanced across participants:

1. compact sentence only;
2. compact sentence plus fact-level exception states;
3. compact sentence plus fact-level states and evidence drawer.

Use the audit trail only in saved-BOM correction tasks. Do not ask visual preference until all task and comprehension measures are complete.

**Fundamental requirement:** Include cases for all six stages and these states: broad ambiguity, family coverage limit, exact identifier, unknown identifier, deterministic normalization, not supplied, not yet normalized, conflict, service failure, corrected saved line, withdrawn mapping, and supplier search. The known exact fixture may use the corrected `91290A115` record; all other non-catalog states must be labelled test fixtures, not product evidence.

### Neutral comprehension prompts

Ask participants to answer without opening a new site first:

1. What did the user type, and what did PartSource change or preserve?
2. What object is exact: the identifier mapping, the configuration, a supplier item, or something else?
3. Which displayed values were supplied, normalized, chosen by the user, missing, or disputed?
4. What decision can safely be made now? What action is blocked, and why?
5. What does the release/snapshot label prove? What does it not prove?
6. Can you inspect the upstream source? Can you inspect PartSource’s transformation?
7. If two facts disagree, which one did PartSource choose?
8. Does the selected configuration establish application suitability or equivalence?
9. What will be sent to the supplier, and what might the supplier results still get wrong?
10. After a correction, what did the saved BOM originally contain, what is current, and did PartSource rewrite the old line?

### Behavioral tasks

**Fundamental requirement:** Observe whether the participant:

- chooses a family without losing explicit constraints;
- notices an unresolved required fact before selecting;
- finds raw and normalized values in the drawer;
- refuses a conflicted/withdrawn BOM or supplier action;
- distinguishes a frozen snapshot from current truth;
- copies or inspects the supplier query before leaving;
- avoids equivalent/listing/stock/approval language;
- can recover the same explanation on a narrow/mobile layout and by keyboard.

**Strong hypothesis:** Test first-glance comprehension after five seconds, then allow up to thirty seconds to inspect details. The sentence should orient the user; the drawer should support the explanation, not reverse a misleading first impression.

### Publication pass rules

**Fundamental requirement:** Do not publish the trust treatment if any participant makes a critical unsafe decision because the interface implied suitability, equivalence, supplier match, approval, stock, source transparency, or technical review that does not exist.

**Fundamental requirement:** Do not publish if participants repeatedly treat `release` as approval, `supplied` as correct, `normalized` as source-authored, a confidential source as independently inspectable, or a supplier query as a match.

**Fundamental requirement:** Every participant must be able to locate the blocking fact and state why the action is blocked. Every participant must preserve the old saved meaning during the correction task. These are safety gates, not average usability scores.

**Strong hypothesis:** For noncritical usability, require a clear majority to identify supplied versus transformed facts and find the detailed evidence without facilitator explanation. If the drawer is rarely needed but comprehension stays calibrated, keep it quiet; if the sentence causes conflation, split it rather than adding badges.

**Risk:** Confidence ratings are weak evidence. A polished passport may raise self-reported confidence while reducing correctness. Measure explanations and actions first.

**Rejected:** A preference-only test, a five-star trust score, facilitator-led comprehension, hard-coded prototype success treated as resolver evidence, or publication based on average confidence.

## Publication rules

These rules apply before any public trust or provenance language ships.

1. **Fundamental requirement:** Publish only permitted public fields. The source register remains the gate; private lineage never crosses the DTO/export boundary.
2. **Fundamental requirement:** Every public claim has a stable subject, scoped predicate, value/state, applicability, origin, and catalog release/revision.
3. **Fundamental requirement:** Preserve supplied notation. A normalized value must be reversible to its public supplied value where permitted and name the deterministic rule/version.
4. **Fundamental requirement:** Approve family inclusion/exclusion, identity-critical fields, required fields, and non-blocking fields before selection can be called supported.
5. **Fundamental requirement:** Review family classification, configuration facts, and identifier mapping separately. One review cannot stand in for all three.
6. **Fundamental requirement:** Selection-critical missingness, conflict, permission block, processing failure, or withdrawal blocks BOM and supplier handoff.
7. **Fundamental requirement:** Publish one immutable atomic catalog release across search, detail, evidence, and BOM. Corrections create a new revision/release; old snapshots remain interpretable.
8. **Fundamental requirement:** State confidential-source limits in plain language wherever source authority matters. Do not imply an inspectable citation.
9. **Fundamental requirement:** Put the claim boundary beside selection, BOM, export, and supplier actions; retain it in exported packets.
10. **Fundamental requirement:** A public correction route carries safe subject/release/claim identity. The resulting status and public-safe disposition are inspectable.
11. **Rejected:** Badges, confidence/completeness/readiness scores, evidence-count cards, `Indexed`, `Verified`, `approved`, `certified`, anonymous `expert reviewed`, or `independently reviewed` without an auditable record.
12. **Rejected:** Public release language before a catalog release exists; frontend build identity as data-release identity; or source-row count as evidence of reviewed coverage.
13. **Rejected:** Field-group evidence as a selection gate; one row-level provenance note; or per-cell badge clutter.
14. **Rejected:** Silent correction, identifier remap, fallback substitution, automatic conflict winner, or withdrawn-to-nearest redirect.
15. **Risk:** Until an overlapping approved source or disclosable independent check exists, PartSource can demonstrate handling integrity but not source agreement or strong externally auditable provenance.

## Decision register

### Evidence

- The current approved packet has confidential upstream origin and no public source citation.
- Current publication has no immutable catalog release, correction, supersession, or withdrawal lifecycle.
- Current UI turns index presence into `verified` state.
- The exact-passport fixture required a factual correction despite confident evidence/release presentation.
- Existing BOM snapshots freeze display strings but not durable release/configuration/mapping identity.
- External first-party patterns consistently separate current status, provenance/changes, verification, and fitness for purpose.

### Fundamental requirement

- Evidence depth must follow commitment: interpretation → family rule → identifier mapping → claim support → frozen decision → outgoing query.
- Store fact-level origin/review/lifecycle state even when the default UI summarizes by sentence or field group.
- Make release, review, correction, and withdrawal auditable by scoped records, not labels.
- Gate selection and handoff on approved family requirements and absence of critical conflict/withdrawal.

### Strong hypothesis

- One sentence plus quiet exception states and an evidence drawer is the best low-clutter composition.
- Field groups are enough for public orientation, not fact adjudication or selection gating.
- Release-aware frozen snapshots and correction comparisons can produce more trust value than a passport dashboard.
- `Inspectable PartSource handling` is credible language for confidential lineage; `transparent provenance` is not.

### Opportunity / gold idea

- Make correction comparison on a frozen BOM the trust demonstration.
- Show `Copy configuration text` beside an inspectable supplier query.
- Ask users separately whether they can audit PartSource transformation and upstream source authority.

### Nice-to-have

- Public-safe source agreement/conflict views after a second approved overlapping source exists.
- Richer per-field adjudication only after real conflict/correction volume justifies it.
- Accurate source-backed geometry after it improves task performance without becoming evidence theatre.

### Open question

- Do engineers understand and value this evidence enough to change behavior or reuse the packet?
- Is confidential-source limitation acceptable for the bounded POC?
- Which family fields are required, identity-defining, or non-blocking?
- Does supplier-query inspection reduce reformulation without increasing false-match belief?

### Risk

- Review and release language may launder one confidential record into apparent independent authority.
- Evidence drawers can become empty compliance theatre.
- Public field-group states can hide critical mixed evidence.
- Positive visual hierarchy can overpower accurate disclaimers.

### Rejected

- Global trust badges, confidence/readiness/completeness scores, star ratings, evidence counts, or `Indexed Catalog` as trust.
- `Verified part`, `reviewed release`, `trusted source`, or `independent review` without inspectable scope and records.
- Any equivalence, suitability, supplier-listing, approval, stock, price, availability, or certification inference.
- Silent mutation, remap, conflict winner, or correction.

## External primary / first-party references

External content was treated as untrusted corroboration and did not supply PartSource catalog facts.

1. **W3C, Data on the Web Best Practices** — provenance should provide origin and change information; version indicators/history and known quality issues support trust. https://www.w3.org/TR/dwbp/
2. **SLSA, Verifying artifacts** — provenance does nothing unless inspected; verification checks the subject, signature/builder identity, expected parameters, and roots of trust. This is a software-supply-chain analogy, not a mechanical-data standard. https://slsa.dev/spec/v1.0/verifying-artifacts
3. **NASA Systems Engineering Handbook, 6.5 Configuration Management** — configuration status accounting retains current/historical documentation and unique IDs, proposed-change status, discrepancy disposition, version comparison, and audit results. https://www.nasa.gov/reference/6-5-configuration-management/
4. **NIST Technical Note 2156, Metrological Traceability** — traceability is scoped to a measurement result through a documented chain; the provider supports the claim, the user assesses it, and traceability alone does not guarantee fitness for purpose. This is a scope analogy, not a claim that PartSource offers metrological traceability. https://www.nist.gov/metrology/metrological-traceability
5. **Crossref, Crossmark** — one-click current status and correction/retraction/update records can aid verification; Crossref explicitly says the mark itself is not a guarantee. https://www.crossref.org/documentation/crossmark/
6. **Texas Instruments, Product change notification** — a practical change record includes detailed description, reason, tracking number, affected products, expected impact, qualification information, and dates. https://www.ti.com/quality-reliability/quality/product-change-notification.html
7. **Texas Instruments, LM358 product page** — a first-party product interface separates product lifecycle status, part identity, parameters, and a revision-labelled datasheet. It shows useful claim boundaries but is not a template for PartSource authority. https://www.ti.com/product/LM358

## Repository sources

- `CONTEXT.md`
- `.wayfinder/poc-ship/poc-ship-map.md`
- `research/product-contract.md`
- `research/data-source-register.md`
- `research/full-problem-space-synthesis-2026-08-09.md`
- `research/mechanical-data-trust-opportunities-2026-08-09.md`
- `research/full-problem-space-skeptical-review-2026-08-09.md`
- `research/current-system-structural-audit-2026-08-09.md`
- `research/validation-engineer-workflow-2026-08-09.md`
- `research/validation-bom-readiness-wedge-2026-08-09.md`
- `research/release-truth.md`
- `sketches/003-entry-compositions.md`
- `sketches/003-exact-configuration-passport/README.md`
- `sketches/003-exact-configuration-passport/index.html`
- `sketches/004-compare-first-spec-lab/README.md`
- `sketches/004-compare-first-spec-lab/index.html`

No production code or existing prototype was modified. No new prototype was created; the corrected exact-passport and compare-first artifacts were sufficient to resolve the evidence-composition decision for this gate.
