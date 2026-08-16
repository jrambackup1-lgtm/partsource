# Proxy Mechanical-Engineering Review — 2026-08-10

> **Status:** Proxy/synthetic mechanical-engineering analysis only. This document is not human evidence, qualified engineering approval, standards certification, production approval, `/to-spec` authorization, family approval, answer-key approval, release approval, suitability advice, or permission to select or buy a fastener.

## 1. Scope and decisive answer

This review asks whether public standards scope pages, official manufacturer catalogs, and repository evidence are enough to **propose** mechanically coherent bounded profiles and fail-closed stopping rules for:

1. socket-head cap screws;
2. external hex-head fasteners; and
3. the rounded-head ingestion bucket, especially pan-head machine screws.

**Decisive proxy verdict:** **Yes, bounded profiles and safe stopping rules can be proposed, but the current three ingestion groupings cannot be accepted as mechanically coherent families.** The defensible proxy proposal is narrower:

- one initial metric, coarse-thread, standard-profile, internal-hex socket-head cap-screw profile;
- two external-hex sibling profiles, separating partially threaded hexagon-head bolts from fully threaded hexagon-head screws;
- two pan-head sibling profiles, separating type H/Z cross-recess machine screws from slotted machine screws.

Every other neighboring form remains excluded, separately profiled, or unresolved. The repository can route records into a private curation queue, but its current projection cannot safely instantiate these profiles or produce a unique engineering selection. The next defensible action is qualified review of the proposed boundaries and a differences-first curation sample. It is not implementation, publication, `/to-spec`, or release.

## 2. Evidence and method

### 2.1 Evidence boundary

- **Evidence:** The product contract defines a configuration as standards-defined technical facts, not stock, listing, equivalence, approval, or availability; it forbids silent substitution of pitch, measurement system, standard, material, or strength class [R2, lines 63–84].
- **Evidence:** The proxy-gate hierarchy permits official public standards pages, official manufacturer technical catalogs, repository observations, and explicitly synthetic specialist reasoning. It says these cannot close human-validation or qualified-approval gates [R1, lines 11–18 and 57–59].
- **Evidence:** The source register permits the supplied local CSV packet for technical configuration fields, but blocks SKDIN, LILY Bearing, Source-Search, Filtersource, and McMaster content [R3, lines 7–16]. This review used none of the blocked sources and does not expose raw private rows.
- **Evidence:** Public ISO pages establish terminology, standard scope, thread range/type, product grade, and neighboring-standard distinctions. They do not provide lawful access to all protected dimensional tables. No standards table is copied here.
- **Evidence:** Official manufacturer catalogs are used only to test whether industry catalogs preserve distinctions such as cap head versus other socket forms, partially threaded bolt versus fully threaded screw, and cross-recess versus slotted pan head. Manufacturer catalog organization does not prove normative conformance or suitability.

### 2.2 Repository material inspected

The review inspected the required contract, source-register, domain-language, prior domain/model reports, frozen benchmark metadata and affected-case locations, all three CSV-consuming generators, and the importer. The checked-in aggregate audit reports these packet totals: 7,864 socket-head rows, 8,850 hex-head rows, and 10,295 rounded-head rows [R8, lines 10–19].

A new raw-CSV aggregate command was attempted but denied by the execution environment. It was not retried or bypassed. Consequently, all packet counts below are cited to checked-in aggregate audits; this review independently inspected the importer/generator logic and benchmark metadata but does not claim a fresh raw-row recount.

### 2.3 Public sources used

Official scope evidence establishes these distinctions:

- ISO 4762:2004 covers coarse-pitch, product-grade-A hexagon socket head cap screws, while ISO 12474:2010 separately covers metric fine-pitch socket-head cap screws [W1] [W2].
- ISO 4014:2022 covers coarse-pitch hexagon-head **bolts**, while ISO 4017:2022 covers coarse-pitch hexagon-head **screws** [W3] [W4]. Fine-pitch hexagon-head bolts and screws have separate scopes under ISO 8765:2022 and ISO 8676:2022 [W5] [W6].
- ISO 4162:2012 separately covers hexagon bolts with flange, and ISO 1479:2011 separately covers hexagon-head tapping screws [W7] [W8].
- ISO 7045:2011 covers pan-head screws with type H or Z cross recess; ISO 1580:2011 covers slotted pan-head screws; ISO 14583:2011 covers hexalobular socket pan-head screws; and ISO 7049:2011 covers cross-recessed pan-head **tapping** screws [W9] [W10] [W11] [W12].
- ISO 261:1998 identifies the ISO general-purpose metric `M` thread system, ISO 965-1 identifies its tolerance system, ISO 888 distinguishes nominal length from thread length, and ISO 225 supplies named dimensional symbols/descriptions [W13] [W14] [W15] [W16]. These public pages support separate typed facts; they do not validate packet dimensions.

Official manufacturer catalogs reinforce, without approving, the boundary model:

- Unbrako's Engineering Guide has separate technical treatment for socket-head products, thread/grip facts, dimensions, materials, and mechanical properties [M1].
- TR Fastenings lists cap-head hexagon-socket screws as a distinct catalog form [M2].
- Bossard lists partially threaded hex-head bolts separately from fully threaded hex-head screws [M3] [M4]. TR likewise has separate bolt and fully threaded “set screw” catalog branches, demonstrating that market wording itself must not be the identity rule [M5] [M6].
- TR lists cross-recess H-drive and slotted pan-head machine screws separately and warns on product pages that DIN-to-ISO transitions require checking the supplied standard when dimensions are critical [M7] [M8] [M9].

## 3. Cross-cutting mechanical requirements

### 3.1 Three different gates

- **Fundamental requirement:** A record may be **family-routable** only when the family-defining geometry, drive, thread kind, assembly state, and explicit exclusions are known or retained as unresolved.
- **Fundamental requirement:** A record may be a **configuration-identity candidate** only when every supplied selection distinction is retained, typed, and compared. A source row or external identifier is not configuration identity [R4, lines 31–39 and 51–59].
- **Fundamental requirement:** A **safe handoff** may preserve a bounded configuration search, but it must not imply suitability, equivalence, standard conformity beyond evidence, manufacture, listing, stock, price, or availability [R2, lines 86–113].

### 3.2 Minimum typed fact ledger

The following is a conservative proxy requirement. It is deliberately stricter than the current projection and is not an approved schema.

| Fact group | Minimum proxy representation | Stop condition |
|---|---|---|
| Family/profile | Stable profile key; profile revision; inclusion evidence; explicit neighbor exclusions | Stop family routing if defining geometry, drive, thread kind, flange/collar, or assembly state is missing or conflicting. |
| Thread | System; form/standard; supplied designation; numeric nominal diameter; metric pitch **or** imperial TPI; spacing series; direction; tolerance/fit; lead if relevant | Stop constrained selection on absent, malformed, defaulted, or conflicting identity facts. |
| Length and extent | Numeric value; unit; supplied notation; profile-specific measurement datum; full/partial state; thread/grip length when partial | Stop if overall length is confused with thread length or the datum/extent is unresolved. |
| Head/bearing geometry | Profile; diameter or width across flats; height; bearing-face form; flange/collar/washer state; nominal/tolerance status | Stop if the record can be a standard, low, heavy, flange, washer-assembly, or another neighboring form. |
| Drive/recess | Exact drive type and size; combination/tamper-resistant state; recess type where applicable | Stop if `hex`, `Phillips`, `slotted`, or `rounded` is only an unqualified token. |
| Material | Supplied material text; normalized base material/alloy/condition; derivation rule and state | Stop a material-constrained result if supplied text is fused or normalization conflicts. |
| Finish/coating | Explicit plain/not supplied/coating/treatment state; supplied and normalized facts kept separate | Never infer plain/uncoated from absence. Stop a finish-constrained result on unknown/conflict. |
| Strength/loadability | Property-class or grade namespace; tensile/yield/hardness kept separate with units/test basis; reduced-loadability state where applicable | Never coalesce class, tensile strength, and hardness into one winner. |
| Standard claim | Issuer; number; part; edition/year; amendment; relationship/claim scope; evidence and review state | Stop a conformance claim when edition, part, or relationship is absent or inferred. |
| Identifier | Namespace; supplied value; namespace-specific normalization; mapping type/state; effective release | Stop unique resolution on collision, missing namespace, stale/withdrawn mapping, or first-row selection. |
| Provenance/lifecycle | Source revision/digest; supplied/derived fact linkage; rule version; configuration revision; immutable release ID/digest; correction/withdrawal state | Stop release-scoped behavior if mutable, unavailable, withdrawn, stale, or not independently reviewed. |

### 3.3 Unit and thread semantics

- **Fundamental requirement:** Metric pitch is an exact numeric quantity in millimetres and nominal diameter is a separate exact numeric quantity in millimetres. `M4`, `0.7 mm`, and `coarse` are three different facts.
- **Fundamental requirement:** Imperial TPI is a count per inch, not metric pitch and not `N/A`. Supplied fractions and thread-series notation must be retained. A deterministic unit conversion may be stored separately, with exact/rounded state, but display rounding is not equality.
- **Rejected:** Defaulting coarse pitch from diameter, family, a common catalog pattern, or an unqualified product-standard string.
- **Rejected:** Substring quantity checks. Frozen benchmark v1 stores the unit twice in all 16 metric cases and checks pitch by substring containment [R6, lines 125–139].
- **Strong hypothesis:** A metric-coarse-only initial curation profile minimizes unsafe inference. Fine-pitch and imperial variants should be separately profiled only after their parsing, tolerance, standard, and round-trip rules are reviewed.

## 4. Candidate profile: socket-head cap screws

### 4.1 Proposed proxy boundary

**Proposed name:** `metric_standard_profile_hex_socket_head_cap_screw_coarse`.

Include only records for which all family-defining facts support:

- a conventional cylindrical/standard socket-head cap-screw profile;
- an internal hexagon drive, with drive size retained;
- ISO metric `M` coarse-pitch thread in the claimed ISO 4762 scope;
- explicit right/left direction, tolerance/fit state, and full/partial thread extent;
- explicit nominal length and under-head/profile-specific datum;
- no collar, flange, washer assembly, shoulder, captive component, or special head/recess feature.

ISO 4762 supports the public scope terminology; it does not validate any row or permit dimensions to be reconstructed from protected tables [W1]. Fine-pitch socket-head cap screws belong in a separate proposed child profile because ISO provides a separate fine-pitch scope [W2].

### 4.2 Boundary attacks

- **Evidence:** The socket ingestion slice is not one family. The checked-in audit reports 6,707 standard-profile/internal-hex rows, 466 low-profile/internal-hex, 263 low-profile/pilot-recess, 263 ultra-low/internal-hex, 53 standard-profile/Torx Plus, 32 high-profile/internal-hex, 24 high-profile/square, and 56 without reviewed profile/drive values [R8, lines 57–72].
- **Evidence:** Frozen benchmark v1's heuristic admits 255 metric DIN 7984 low-profile rows because it misses hyphenated `Low-Profile` and the typed `Low` profile. `EXACT-002` and `METRIC-005` preserve the leaked family assignment [R6, lines 112–123].
- **Risk:** Head-height, recess engagement, tooling, bearing geometry, and loadability distinctions are hidden if low/high/ultra-low, pilot, non-hex drives, button, shoulder, countersunk, or set-screw forms inherit this family.
- **Rejected:** Title-substring membership, including a normalized punctuation-only variant of the current predicate. A typed profile value and explicit exclusions are required.
- **Rejected:** Treating `DIN 912, ISO 4762` as an equivalence. The supplied relationship, edition, and actual claim scope must remain explicit.

### 4.3 Required profile facts

In addition to the common ledger: socket-head profile, head diameter, head height, internal-hex size, bearing-face state, thread extent, minimum thread/grip length when partial, and standard-claim edition/relationship must be present or explicitly unresolved. Finish, material, and strength remain separate facts.

- **Evidence:** The current generator retains broad head, thread, pitch, length, material, finish, drive, one coalesced strength value, and standard strings, but drops thread direction/fit/extent, head dimensions, drive size, and minimum thread length [R10, lines 31–54].
- **Evidence:** The current aggregate reports no dedicated finish on any of the 6,707 proposed standard/internal-hex candidates and only 32.5% dedicated pitch coverage [R8, lines 120–128].

### 4.4 Proxy disposition

- **Strong hypothesis:** This is mechanically coherent enough to submit as a bounded profile proposal.
- **Risk:** No current projected socket record is sufficient for a unique constrained selection under this profile.
- **Open question:** A qualified reviewer must decide approved editions, accepted material/property regimes, which nominal head dimensions are identity-defining versus validation constraints, and whether any non-ISO or imperial child profile belongs in future scope.

## 5. Candidate grouping: external hex head

### 5.1 Proposed proxy boundary

A single broad `hex_head_screws` profile is not mechanically coherent from current evidence. Propose two sibling profiles instead:

1. `metric_external_hex_head_bolt_partial_thread_coarse` — ordinary non-flanged external-hex head, metric coarse thread, partial thread/grip explicitly represented, under the claimed ISO 4014:2022 scope [W3].
2. `metric_external_hex_head_screw_full_thread_coarse` — ordinary non-flanged external-hex head, metric coarse thread, full thread explicitly represented, under the claimed ISO 4017:2022 scope [W4].

Fine-pitch bolt and screw profiles remain separate because ISO 8765:2022 and ISO 8676:2022 have separate scopes [W5] [W6]. Bossard's catalog also separates partially threaded hex-head bolts from fully threaded hex-head screws [M3] [M4].

### 5.2 Boundary attacks

- **Evidence:** The 8,850-row hex ingestion bucket contains 8,767 external-hex, 60 external-hex/slotted, and 23 external-hex/Phillips records; current fields do not provide a useful head-profile split [R8, lines 74–81].
- **Evidence:** The same audit found at least 1,076 flange-marked, 587 heavy-hex, and 278 structural title-marked rows in the external-hex bucket [R8, lines 134–138].
- **Evidence:** ISO separately scopes flanged hexagon bolts and hexagon-head tapping screws [W7] [W8]. These are not synonyms for an ordinary ISO 4014/4017-like form.
- **Evidence:** Manufacturer terminology is not a safe identity rule: TR catalogs partially threaded forms as bolts and fully threaded forms under a “set screw” branch [M5] [M6]. The technical facts and product-standard claim must control, not the noun alone.
- **Risk:** Heavy-hex/structural geometry, flange bearing area, tapping threads, combination drives, partial/full extent, and fine/coarse pitch can change fit, tooling, grip, and applicable property/installation rules.
- **Rejected:** A broad external-hex family that treats bolt/screw, partial/full thread, flange/plain bearing face, ordinary/heavy/structural, machine/tapping thread, or combination drive as cosmetic facets.
- **Rejected:** Inferring ordinary head profile merely because the source head field is blank or the drive says `External Hex`.

### 5.3 Required profile facts

In addition to the common ledger: ordinary versus heavy/structural head state; width across flats; head height; bearing-face/flange state; full/partial thread; unthreaded grip and thread length when partial; external-hex-only versus combination drive; machine-thread versus tapping-thread form; and exact product-standard relationship are required.

- **Evidence:** The hex generator defaults missing head to `Hex` and missing drive to `External Hex`; it then projects one coalesced strength string [R9, lines 16–43]. These defaults can create false family certainty.
- **Evidence:** The shared importer labels every hex-file row `Hex Head Screw`, computes identity from ingestion bucket plus private source key, omits richer geometry/thread facts, and performs mutable upserts [R12, lines 39–76, 88–117, and 160–169].

### 5.4 Proxy disposition

- **Strong hypothesis:** The two sibling profiles are mechanically coherent proposals when narrowed to metric coarse threads and ordinary non-flanged geometry.
- **Risk:** The current broad hex projection cannot populate either profile safely because profile, bearing form, structural state, and extent are not preserved as required typed facts.
- **Open question:** A qualified reviewer must decide whether “bolt” versus “screw” is represented as separate families, child profiles, or a thread-extent axis under one user-facing parent. The immutable technical identities must remain distinct regardless of the UX decision.

## 6. Candidate grouping: rounded and pan head

### 6.1 Proposed proxy boundary

`Rounded Head Screws` is rejected as a family; it is an ingestion umbrella. For pan-head machine screws, propose two sibling profiles:

1. `metric_pan_head_machine_screw_cross_recess_h_or_z_coarse` — metric machine thread, pan head, type H or Z cross recess explicitly identified, no washer assembly, under the claimed ISO 7045 scope [W9].
2. `metric_pan_head_machine_screw_slotted_coarse` — metric machine thread, pan head, slotted drive explicitly identified, no washer assembly, under the claimed ISO 1580 scope [W10].

A user-facing parent may later present both, but drive/recess and product-standard scope must remain mandatory configuration discriminators. TR's official catalog separates cross-recess H-drive from slotted pan-head machine screws [M7] [M8].

### 6.2 Boundary attacks

- **Evidence:** The 10,295-row rounded bucket contains at least seven head styles and fourteen drive styles. Large groups include pan/Phillips, button/hex, round/slotted, pan/slotted, truss/Phillips, cheese/slotted, fillister/slotted, and button/Torx [R8, lines 83–98].
- **Evidence:** The checked-in proposed pan/Phillips-or-slotted boundary still found 487 washer-assembly records before exclusion, including 443 ASME B18.13-family records [R8, lines 134–138].
- **Evidence:** ISO scopes cross-recess pan, slotted pan, hexalobular socket pan, and cross-recess tapping pan under separate standards [W9] [W10] [W11] [W12].
- **Risk:** A combination Phillips/slotted recess is a legitimate physical drive form; it is not automatically a conflict. Frozen benchmark `CONFLICT-006` therefore encodes an unsafe universal assumption [R6, lines 151–155]. Combination drive remains excluded pending a separate profile, not declared impossible.
- **Risk:** `Phillips` is not enough to establish type H or Z, and a pan-shaped tapping screw is not a machine screw.
- **Rejected:** Button, round, truss, cheese, fillister, hexalobular, tapping, thread-forming, self-drilling, captive/free-washer assemblies, and combination-drive records from these two pan profiles.
- **Rejected:** A generic `Pan Head` record as uniquely selectable when recess, drive size, washer state, or thread form is unknown.

### 6.3 Required profile facts

In addition to the common ledger: pan-head profile and dimensions; machine-thread form; exact H/Z or slotted recess; drive size; combination state; captive/free-washer absence supported by evidence; and product-standard claim are required.

- **Evidence:** The rounded generator concatenates broad profile/style/head strings, keeps drive as supplied, and coalesces strength; it does not retain a typed washer/assembly state, thread direction/fit/extent, head dimensions, or drive size [R11, lines 16–45].
- **Evidence:** The checked-in domain audit reports all 275 slotted records in its metric pan candidate projection lacked drive size, while 20 combination-drive records were present [R5, lines 339–345].
- **Evidence:** TR warns that DIN-to-ISO transitions require checking what standard is supplied when dimensions are critical [M9]. A comma-separated DIN/ISO label cannot be normalized into equivalence.

### 6.4 Proxy disposition

- **Strong hypothesis:** The two drive-qualified pan profiles are mechanically coherent proposals. A broader rounded profile is not.
- **Risk:** Current projection and missing drive-size/assembly semantics prevent safe unique constrained selection.
- **Open question:** Qualified review must decide whether H and Z are one profile with a required recess axis or separate child profiles, and whether slotted and cross-recess forms share one user-facing family.

## 7. Conflicts, missing facts, and false-unique controls

### 7.1 Conflict semantics

- **Fundamental requirement:** Preserve competing fact values and evidence. Do not choose first-nonblank, majority, newest, or “most standard-looking” values automatically.
- **Fundamental requirement:** Distinguish `not supplied`, `unknown after review`, `not applicable`, `not yet normalized`, `conflicting`, `withheld/private`, `not in release`, `withdrawn`, `unavailable`, and `stale` [R7, lines 100–115].
- **Risk:** Frozen `CONFLICT-007` treats `stainless_steel` and `alloy_steel` as universally exclusive, but that depends on an unapproved controlled taxonomy [R6, lines 141–155]. Conflict rules must name mutually exclusive controlled categories.
- **Rejected:** Converting missing direction to right-hand, missing finish to plain, missing pitch to coarse, missing profile to ordinary, `ISO 7380` to a current part/edition, or a DIN/ISO pair to equivalence.

### 7.2 False-unique identity and selection

- **Evidence:** The frozen 120-case candidate composer reproduces 120/120 contract agreement, 95 abstentions, and zero false-unique matches; the local current-artifact baseline records 58 false-unique matches. The result is composition-only, not mechanical validation [R6, lines 68–87].
- **Evidence:** The frozen fixture explicitly declares `mechanical_approval: false`, `production_acceptance: false`, and `public_claims_allowed: false` [R13, lines 4048–4060].
- **Evidence:** The checked-in model audit found 1,591 duplicate groups across 3,502 rows under the imported signature; 1,311 groups/2,863 rows differ in omitted supplied fields. Even a broader source signature left 290 candidate duplicate groups/659 rows [R7, lines 152–160].
- **Fundamental requirement:** Exact mapping and engineering selection are separate axes. A namespace-qualified identifier may map to one source observation while selection still abstains because profile membership or critical facts are unreviewed.
- **Fundamental requirement:** One active target is required per `(release, namespace, normalized identifier)` or the state must be explicitly ambiguous/withdrawn. Never use `LIMIT 1`, row order, source-row identity, or title similarity as uniqueness.

## 8. Safe stopping rules

These are proxy/synthetic rules for qualified review, not approved product behavior.

| Rule | Trigger | Required safe result |
|---|---|---|
| S0 — scope stop | Family/profile is unsupported, excluded, or needs application/manufacturer-specific authority outside the bounded claim | Return unsupported/unresolved. Preserve input; do not route to the nearest visual family. |
| S1 — family stop | Defining head, drive, thread kind, flange/collar, washer/assembly, structural/heavy, or extent state is absent or conflicting | Do not assign one family. Show bounded alternatives or request the missing fact. |
| S2 — quantity stop | Diameter, pitch/TPI, length, unit, datum, direction, or fit is malformed, duplicated, defaulted, or contradictory | Abstain from constrained matching; identify the exact fact requiring correction. |
| S3 — candidate-set stop | More than one configuration satisfies known hard constraints, or unknown facts could change the set | Return a candidate set or clarification. Never select the first or “closest.” |
| S4 — exact-map stop | One namespace-qualified identifier maps to one record, but profile or selection-critical facts are missing/unreviewed | Report exact mapping only; selection remains abstaining. Do not call it equivalent, approved, or suitable. |
| S5 — claim stop | Standard issuer/part/edition/relationship, material/finish normalization, strength namespace, or loadability basis is incomplete/conflicting | Preserve supplied text and suppress the normalized conformance/property claim. |
| S6 — lifecycle stop | Release/configuration/mapping is mutable, unavailable, stale, superseded, withdrawn, outside release, or lacks a digest-bound review | Fail closed. No cached nearby substitute, stale result, Add-to-BOM selection, or supplier handoff. |
| S7 — handoff stop | Any user hard constraint was dropped/mutated/defaulted, or the handoff would imply listing, stock, availability, equivalence, approval, or suitability | Block the handoff. Otherwise transmit only preserved configuration search terms and require independent supplier-site verification. |
| S8 — profile kill stop | A proposed profile cannot be bounded without application-specific suitability, protected dimensional reconstruction, unsanctioned source use, or manufacturer-specific claims | Reject the profile direction or shrink it. Do not fill the evidence gap synthetically. |
| S9 — review stop | Proxy checks are internally consistent but no qualified reviewer is tied to exact source/rule/profile/fixture/release digests | Stop before family approval, answer-key approval, publication, release, or `/to-spec`. |

### 8.1 Minimum rule order

1. Preserve raw input and supplied facts.
2. Check source permission and release/lifecycle state.
3. Parse typed quantities without defaults.
4. Apply explicit inclusion **and exclusion** rules.
5. Retain all conflicts and missing states.
6. Compute identity cardinality separately from selection cardinality.
7. Stop on every unresolved hard constraint.
8. Only then create a bounded configuration-search handoff; never create a suitability or equivalence result.

- **Opportunity / gold idea:** Generate a differences-first review packet for every curation candidate: supplied versus parsed facts, profile inclusion and each exclusion result, omitted fields, conflicting values, duplicate-signature neighbors, identifier/release state, source/rule/profile digests, and the exact stopping rule fired. This turns the safe-stop policy into inspectable review evidence without building a production platform.
- **Nice-to-have:** Add a reviewer UI, dimensional anomaly visualization, and cross-release change view only after manual profiles, state semantics, and digest-bound review are accepted.

## 9. Aggregate repository checks

| Repository observation | Mechanical implication |
|---|---|
| Three CSV files total 27,009 rows but are ingestion buckets, not families [R8, lines 10–19]. | Never map one file to one public family. |
| Across the packet, thread size, length, material, strength evidence, and head dimensions are highly populated, but pitch is 32.3%, dedicated finish 25.0%, and normalized standard 83.9% [R8, lines 33–55]. | Missingness and fused labels require explicit states; coverage is not correctness. |
| The socket bucket contains at least eight materially different profile/drive states [R8, lines 57–72]. | Only standard-profile/internal-hex rows are proposed for the initial profile. |
| The hex bucket lacks a useful typed profile split and contains flange/heavy/structural and combination-drive neighbors [R8, lines 74–81 and 134–138]. | Split partial/full ordinary external-hex profiles and hold the bucket back. |
| The rounded bucket contains at least seven head and fourteen drive styles [R8, lines 83–98]. | Reject `rounded` as a family; use drive-qualified pan profiles. |
| Generators/importer drop geometry, drive size, thread direction/fit/extent, and coalesce strength [R9] [R10] [R11] [R12]. | Current projection cannot meet the proposed required-field contract. |
| Frozen v1 has known low-profile leakage, malformed metric quantities, and overbroad conflict assumptions [R6, lines 89–155]. | Preserve v1 as synthetic composition/forensic evidence only; do not use it as a mechanical answer key. |
| Fixture metadata explicitly denies mechanical and production acceptance [R13, lines 4048–4060]. | No benchmark score can be cited as qualified approval. |

No production file, importer, generator, fixture, source data file, migration, or `/to-spec` artifact was edited. Only this report was created.

## 10. Finding register

| ID | Finding label | Proxy/synthetic finding |
|---|---|---|
| F-01 | **Evidence** | ISO public scopes distinguish coarse/fine socket-head forms, partial/full external-hex bolt/screw forms, flanged/tapping neighbors, and cross-recess/slotted/hexalobular/tapping pan forms [W1]–[W12]. |
| F-02 | **Evidence** | Official manufacturer catalogs preserve the same practical distinctions rather than presenting one undifferentiated fastener family [M1]–[M8]. |
| F-03 | **Evidence** | Repository aggregates show the three CSVs are mixed ingestion buckets; current generators/importer discard or default selection-critical facts [R8]–[R12]. |
| F-04 | **Fundamental requirement** | Family inclusion needs typed geometry, drive, thread kind, assembly state, and explicit neighbor exclusions. Configuration identity additionally needs typed thread, length/extent, geometry, material, finish, strength, standards, provenance, and lifecycle facts. |
| F-05 | **Fundamental requirement** | Exact identifier mapping, configuration identity, engineering selection, and supplier handoff must remain separate states. Any unresolved hard constraint stops unique selection. |
| F-06 | **Strong hypothesis** | The five narrow metric-coarse profiles proposed here are mechanically coherent enough for qualified review: one socket profile, two external-hex profiles, and two pan profiles. This is not approval. |
| F-07 | **Strong hypothesis** | A differences-first private curation sample can test these profiles without publishing the full packet or building production machinery. |
| F-08 | **Opportunity / gold idea** | Bind each review packet and future corrected benchmark to source, parser/normalizer, profile, fixture, and release digests, with every exclusion and stopping-rule result visible. |
| F-09 | **Nice-to-have** | Reviewer UI, anomaly graphics, and cross-release visualization may improve review speed later but are not gate evidence. |
| F-10 | **Open question** | Qualified reviewers must decide family-versus-child-profile UX, accepted standards editions/relationships, material/property regimes, identity-defining dimensions, and any future fine-pitch or imperial scope. |
| F-11 | **Risk** | Broad `hex`, `rounded`, or title-derived membership can produce wrong geometry, tooling, grip, loadability, thread, and assembly identity. |
| F-12 | **Risk** | Sparse pitch/finish, fused material/finish, coalesced strength, missing drive sizes, mutable identity, and omitted thread/geometry facts can create false-unique selections even when an identifier is packet-unique. |
| F-13 | **Rejected** | Reject the three ingestion buckets as approved families; reject low/high/ultra-low leakage, broad external-hex aggregation, broad rounded aggregation, inferred standards/equivalence, defaults, substring quantities, first-row selection, and automatic duplicate collapse. |
| F-14 | **Rejected** | Reject using proxy agreement, frozen benchmark scores, public abstracts, manufacturer catalogs, or packet aggregates as human evidence, qualified mechanical approval, release acceptance, suitability, equivalence, supplier identity, BOM approval, or `/to-spec` authority. |

## 11. Decisive proxy verdict

- **Strong hypothesis:** Public authority and repository evidence are sufficient to propose mechanically coherent bounded profiles and explicit stopping rules.
- **Fundamental requirement:** Treat those profiles as hypotheses for qualified review only. A qualified reviewer must inspect lawful normative material and sign exact profile/source/rule/fixture/release digests before any stronger claim.
- **Risk:** The current projection fails the proposed profiles because it broadens family membership, drops critical facts, fuses concepts, uses mutable source-row identity, and has no approved immutable release.
- **Rejected:** No family, configuration, mapping, answer key, release, BOM line, supplier item, equivalence, suitability decision, production change, or `/to-spec` action is approved by this report.

**Final proxy decision:** proceed only to a small, private, differences-first qualified review of the five proposed profiles and the safe-stop rules. If qualified review cannot bound a profile without application-specific suitability, protected-table reconstruction, or unsanctioned evidence, apply S8 and shrink or reject that profile.

## References

All web sources were accessed **2026-08-10**. Public scope/metadata only is summarized; no protected standards table is reproduced.

### Repository references

- **[R1]** `research/proxy-validation-gate-contract-2026-08-10.md`.
- **[R2]** `research/product-contract.md`.
- **[R3]** `research/data-source-register.md`.
- **[R4]** `CONTEXT.md`.
- **[R5]** `research/empirical-domain-family-release-review-2026-08-09.md`.
- **[R6]** `research/empirical-benchmark-domain-adjudication-2026-08-09.md`.
- **[R7]** `research/validation-mechanical-data-model-2026-08-09.md`.
- **[R8]** `research/poc-family-taxonomy-audit-2026-08-09.md` (checked-in aggregate audit of the three approved CSVs).
- **[R9]** `web/scripts/generate-hex-head-prototype-catalog.ts`.
- **[R10]** `web/scripts/generate-socket-head-prototype-catalog.ts`.
- **[R11]** `web/scripts/generate-rounded-head-prototype-catalog.ts`.
- **[R12]** `web/scripts/import-catalog-to-supabase.ts`.
- **[R13]** `research/fixtures/fastener-truth-composition-benchmark-v1.0.0.json`.
- Approved local data inputs reviewed through checked-in aggregate evidence and their importer/generator paths: `data/socket-head-cap-screws.csv`, `data/hex-head-screws.csv`, and `data/rounded-head-screws.csv`.

### Official standards scope pages

- **[W1]** ISO, “ISO 4762:2004 — Hexagon socket head cap screws,” https://www.iso.org/standard/34460.html.
- **[W2]** ISO, “ISO 12474:2010 — Hexagon socket head cap screws with metric fine pitch thread,” https://www.iso.org/standard/51434.html.
- **[W3]** ISO, “ISO 4014:2022 — Fasteners — Hexagon head bolts — Product grades A and B,” https://www.iso.org/standard/72579.html.
- **[W4]** ISO, “ISO 4017:2022 — Fasteners — Hexagon head screws — Product grades A and B,” https://www.iso.org/standard/72585.html.
- **[W5]** ISO, “ISO 8765:2022 — Hexagon head bolts with metric fine pitch thread,” current-version link from https://www.iso.org/standard/56454.html.
- **[W6]** ISO, “ISO 8676:2022 — Fasteners — Hexagon head screws, with fine pitch,” https://www.iso.org/standard/72582.html.
- **[W7]** ISO, “ISO 4162:2012 — Hexagon bolts with flange — Small series,” https://www.iso.org/standard/56451.html.
- **[W8]** ISO, “ISO 1479:2011 — Hexagon head tapping screws,” https://www.iso.org/standard/54040.html.
- **[W9]** ISO, “ISO 7045:2011 — Pan head screws with type H or type Z cross recess,” https://www.iso.org/standard/57372.html.
- **[W10]** ISO, “ISO 1580:2011 — Slotted pan head screws — Product grade A,” https://www.iso.org/standard/57369.html.
- **[W11]** ISO, “ISO 14583:2011 — Hexalobular socket pan head screws,” https://www.iso.org/standard/56457.html.
- **[W12]** ISO, “ISO 7049:2011 — Cross-recessed pan head tapping screws,” https://www.iso.org/standard/54046.html.
- **[W13]** ISO, “ISO 261:1998 — ISO general purpose metric screw threads — General plan,” https://www.iso.org/standard/4165.html.
- **[W14]** ISO, “ISO 965-1 — ISO general purpose metric screw threads — Tolerances,” https://www.iso.org/standard/87889.html.
- **[W15]** ISO, “ISO 888:2012 — Bolts, screws and studs — Nominal lengths and thread lengths,” https://www.iso.org/standard/50946.html.
- **[W16]** ISO, “ISO 225:2010 — Fasteners — Bolts, screws, studs and nuts — Symbols and descriptions of dimensions,” https://www.iso.org/standard/45872.html.

### Official manufacturer technical catalogs

- **[M1]** Unbrako, *Engineering Guide — Socket Products*, https://unbrako.com/docs/engguide.pdf.
- **[M2]** TR Fastenings, “Cap Head Hexagon Socket Drive Screw,” https://www.trfastenings.com/Products/Catalogue/Screws-and-Bolts/Hexagon-Socket-Screws/Cap-Head.
- **[M3]** Bossard, “Hex head bolts partially threaded,” https://www.bossard.com/global-en/eshop/screws-and-bolts-with-external-drive/hex-head-bolts-partially-threaded/p/55/.
- **[M4]** Bossard, “Hex head screws fully threaded,” https://www.bossard.com/global-en/eshop/screws-and-bolts-with-external-drive/hex-head-screws-fully-threaded/p/624/.
- **[M5]** TR Fastenings, “Hexagon Head Bolt,” https://www.trfastenings.com/Products/Catalogue/Screws-and-Bolts/Hexagon-Screws-and-Bolts/Bolts.
- **[M6]** TR Fastenings, “Hexagon Head Set Screw,” https://www.trfastenings.com/products/Catalogue/Screws-and-Bolts/Hexagon-Screws-and-Bolts/Set-Screws.
- **[M7]** TR Fastenings, “Pan Head Cross Recess H Drive Machine Screw,” https://www.trfastenings.com/Products/Catalogue/Screws-and-Bolts/Machine-Screws/Pan-Head/Cross-Recess-H-Drive.
- **[M8]** TR Fastenings, “Pan Head Slotted Drive Machine Screw,” https://www.trfastenings.com/Products/Catalogue/Screws-and-Bolts/Machine-Screws/Pan-Head/Slotted-Drive.
- **[M9]** TR Fastenings, representative technical product page with DIN-to-ISO supply warning, https://www.trfastenings.com/products/Catalogue/Screws-and-Bolts/Machine-Screws/Pan-Head/Cross-Recess-H-Drive/TR00009546-100.
