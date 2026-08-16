# Empirical / Domain Family Release Review — Candidate POC Contract

**Date:** 2026-08-09  
**Scope:** Empirical/domain validation only  
**Repository:** `C:\Users\jayar\projects\partsource`  
**Candidate release:** `candidate-fastener-poc-r0`  
**Report status:** completed domain assessment; **not** a mechanical approval  
**Production changes:** none  

## 1. Gate result

# **GATE: BLOCKED — DO NOT ACCEPT THE CANDIDATE RELEASE PACKET**

No family and no release is marked mechanically reviewed or approved by this report.

The gate is blocked because:

1. **Formal mechanical approval is absent.** There is no named mechanical approver, signed scope, approval date, or approved release-manifest digest.
2. The candidate family predicate leaks a mechanically distinct low-head form into `socket_head_cap_screws`.
3. The current projection does not retain enough thread, geometry, material/finish/strength, standard-edition, provenance, lifecycle, or release identity to satisfy the repository contract.
4. The 120-case benchmark is a useful fail-closed composition test, but its 120/120 candidate score is **not** an independent mechanical validation. Two source-backed cases carry a leaked low-head family assignment, all 16 metric cases encode pitch inconsistently, and several domain-critical facts are not exercised.
5. `hex_socket_button_head_screws` and `pan_head_machine_screws` still have unresolved geometry/drive/standard boundary decisions.
6. No correction, supersession, withdrawal, immutable release-manifest, supplier-listing, offer, suitability, equivalence, or BOM-selection approval contract is release-ready.

**Permitted disposition:** retain the artifacts as candidate/research fixtures and demo-only projections. Do not publish them as a reviewed catalog, do not use them for unique engineering selection, and do not use them to approve a BOM or supplier item.

---

## 2. Authority and approval boundary

This is a repository- and source-based mechanical-domain assessment. It is not an independent PE/SME sign-off and does not certify conformity to any standard.

- **Formal mechanical approval located:** **No**.
- **Named mechanical approver and credentials located:** **No**.
- **Signed approval tied to a release digest:** **No**.
- **Complete licensed normative standards text reviewed:** **No**; only official standards-body abstracts/catalog metadata were accessible.
- **Result:** every family approval state remains **OPEN / NOT APPROVED**, even where the proposed boundary is mechanically plausible.

The words “pass” and “fail” below describe conformance of a candidate rule or artifact to the stated domain contract. They do **not** mean a family has received formal engineering approval.

---

## 3. Severity/status tags used in this source review

The following tags express severity or review status. They are not replacements for the Wayfinder classification vocabulary.

| Label | Meaning in this report |
|---|---|
| `release_blocker` | Must be resolved before accepting a release packet. |
| `high_risk` | Can cause wrong identity, wrong geometry, wrong strength, or unsafe selection. |
| `medium_risk` | Material trust/maintenance defect, but not by itself proof of an unsafe part. |
| `low_risk` | Bounded defect or positive observation with limited release impact. |
| `validated_strength` | A behavior supported by repository execution and/or authoritative evidence. |
| `evidence_gap` | Necessary evidence was absent, inaccessible, or insufficiently scoped. |
| `domain_review_required` | A mechanical taxonomy or interpretation decision needs a qualified approver. |
| `out_of_scope` | Excluded from this candidate release and not established by its data. |

### Wayfinder classification register

The material findings map to the required Wayfinder labels as follows:

- **Evidence:** F-02, F-05, F-06, F-07, F-09, F-11, and F-12 are direct repository or executed benchmark observations within their stated boundaries.
- **Fundamental requirement:** F-01, F-05, F-08, and F-10 must be resolved before a reviewed release can exist.
- **Strong hypothesis:** An approved typed family profile plus a reversible supplied/normalized fact ledger can support a small metric-only release; this remains unproved.
- **Opportunity / gold idea:** Bind each answer key and public release to source-packet, normalization-rule, family-profile, and release-manifest digests so corrections cannot silently rewrite prior truth.
- **Nice-to-have:** Automate digest and manifest checks only after the manual approval and correction workflow is defined.
- **Open question:** F-03, F-04, and F-10 require qualified decisions on family boundaries, drive/recess forms, standards scope, and lawful normative access.
- **Risk:** F-02 through F-08 and F-11 can create wrong family membership, malformed quantities, collapsed facts, or mutable release truth.
- **Rejected:** F-13 commercial/suitability claims and any publication of the candidate packet as mechanically reviewed are rejected.

### Finding register

| ID | Labels | Finding | Disposition |
|---|---|---|---|
| F-01 | `release_blocker`, `domain_review_required` | No formal mechanical approval or signed release digest exists. | Keep all families/release not approved. |
| F-02 | `release_blocker`, `high_risk` | The scorer predicate fails to exclude hyphenated “Low-Profile” / profile=`Low`; 255 metric DIN 7984 rows enter the socket candidate pool, including benchmark cases `EXACT-002` and `METRIC-005`. | Replace text heuristics with an approved typed family profile and regenerate the corpus. |
| F-03 | `high_risk`, `domain_review_required` | The button-head pool mixes generic `ISO 7380`, part-qualified `ISO 7380-1`, tamper-resistant hex geometry, left-hand/fine variants, and records with no product standard. | Decide and encode collar, recess, reduced-loadability, part, edition, and variant rules. |
| F-04 | `high_risk`, `domain_review_required` | Pan-head membership combines Phillips, slotted, and combination Phillips/slotted forms across different product standards. | Either split profiles by drive/product standard or make drive geometry a required configuration discriminator. |
| F-05 | `release_blocker`, `high_risk` | Generators/import projection discard thread direction/extent/form/tolerance and head dimensions, coalesce incompatible strength concepts, and do not carry standard editions. | Extend the candidate fact ledger before any release. |
| F-06 | `high_risk` | Every constrained metric benchmark case stores a pitch string already containing `mm` plus a separate `unit: mm`; the scorer accepts substring containment. | Normalize value and unit separately and assert exact typed equality. |
| F-07 | `high_risk` | Material and finish are not cleanly separated: five of sixteen metric benchmark cases put finish-bearing text in `material_supplied`; aggregate source projections also contain many finish-bearing material strings. | Preserve supplied text, derive separate normalized facts, and retain conflicts. |
| F-08 | `release_blocker`, `medium_risk` | Configuration/revision/release identity and correction/withdrawal are not represented as immutable, related states. | Add manifests, revisions, mapping state, reasons, effective dates, and supersession links. |
| F-09 | `validated_strength` | The candidate oracle abstains safely: execution returned 120/120 contract passes, 95 abstentions, and zero false-unique matches. | Retain as a composition regression test, not a mechanical acceptance test. |
| F-10 | `evidence_gap` | Official abstracts establish scopes, but the review did not have licensed complete standards text or controlled dimensional tables. | Obtain lawful normative access and record clause/table-level review without copying protected tables. |
| F-11 | `medium_risk` | The SQL candidate schema can store units/provenance and verification state, but the importer does not populate a complete typed fact ledger and has no release relation. | Treat schema as scaffolding only. |
| F-12 | `low_risk`, `validated_strength` | Across the 27,009 permitted rows used by current benchmark loading, the audit observed 26,953 nonblank, distinct reference values and no duplicate nonblank value in that packet. | Useful packet observation only; do not infer global uniqueness or omit namespace/release. |
| F-13 | `out_of_scope` | Supplier listings, offers, prices, stock, lead time, certifications, equivalence, suitability, and approval are not supplied by the candidate packet. | Do not display or use them as release facts. |

---

## 4. Evidence separation

## 4.1 Repository evidence

The following are repository observations, not external mechanical approval:

| Evidence | Repository observation |
|---|---|
| `research/product-contract.md` | Defines three supported **candidate** families, requires explicit facts and provenance, distinguishes configuration from reference/listing/offer, and says search output is not a suitability or engineering approval. |
| `research/release-truth.md` | States there is no production-approved release and defines fail-closed release behavior. |
| `research/validation-mechanical-data-model-2026-08-09.md` | Already identifies missing thread/geometry/standard/lifecycle semantics and explicitly denies PE/SME approval. |
| `research/empirical-fastener-truth-benchmark-2026-08-09.md` | Freezes a 120-case candidate-contract benchmark and says unresolved family questions remain abstaining. |
| `research/fixtures/fastener-truth-composition-benchmark-v1.0.0.json` | Scope flags include `production_acceptance: false` and `mechanical_approval: false`; six cases are marked `unresolved_domain_review`. |
| `research/validation-tools/build_fastener_truth_benchmark_v1.py` | Candidate family membership is title/profile/drive substring logic; metric composition only requires `M...`, nonblank pitch, and nonblank length. |
| `research/validation-tools/score_fastener_truth_benchmark_v1.py` | Source validation checks packet reference/missingness and 16 metric compositions; it does not perform independent standards or dimensional validation. |
| Prototype generators | Store broad strings for thread, pitch, length, head, material, finish, drive, strength, and standard; mark records demo-only/synthetic. |
| `web/scripts/import-catalog-to-supabase.ts` | Coerces the same broad strings into a candidate import shape and lacks immutable release/configuration revision composition. |
| `supabase/migrations/20260809_configuration_catalog_contract.sql` | Introduces typed facts/references/provenance scaffolding, but no release manifest, configuration revision, supersession, correction, or withdrawal relation. |
| `research/data-source-register.md` | Permits only supplied technical fields from the confidential packet; forbids inferred offers, listings, stock, price, equivalence, and approval. |
| Current generated artifacts | Still contain broad prototype buckets, including mechanically neighboring forms. They are demo-only and are not a bounded reviewed release. |

### Executed repository checks

A fresh in-memory benchmark execution on 2026-08-09 returned:

- Corpus SHA-256: `0b4acb8152288973a9fa6465d2c4f2d066a5e0566fb33503309e968e2e5c087b`
- Cases: **120**
- Candidate oracle: **120 pass / 0 fail**
- Candidate abstentions: **95**
- Candidate false-unique matches: **0**
- Current artifact baseline: **8 pass / 112 fail**
- Current baseline abstentions: **47**
- Current baseline false-unique identity: **24**
- Current baseline false-unique selection/matches: **58**
- Source-backed cases checked: **50**
- Unique packet references checked: **50**
- Missingness observations checked: **50**
- Metric compositions checked: **16**
- Unresolved cases: `BROAD-010`, `BROAD-011`, `BROAD-012`, `PARTIAL-005`, `PARTIAL-006`, `PARTIAL-009`

The repository scorer is internally reproducible. Its result is evidence of contract composition behavior only.

## 4.2 Official-source evidence

Only first-party standards-body catalog/abstract material is treated as official standards evidence here.

| Official source | Scope established by the accessible official abstract/catalog | Review implication |
|---|---|---|
| [ISO 4762:2004](https://www.iso.org/standard/34460.html) | Hexagon socket head cap screws, coarse-pitch M1.6 through M64, product grade A. | Supports a standard-profile metric SHCS boundary; does not authorize low-head DIN 7984 leakage or establish every material/finish. |
| [ISO 7380-1:2022 catalogue](https://www.iso.org/committee/626538/x/catalogue/) | Button-head screws with reduced loadability, Part 1: hexagon socket button-head screws. | Plain button head and reduced loadability are material family facts. |
| [ISO 7380-2:2022](https://www.iso.org/standard/78700.html) | Hexagon socket button-head screws **with collar**, reduced loadability, steel, metric coarse-pitch M3–M16, product grade A. | Collar/flange form is not interchangeable with Part 1. |
| [ISO 7045:2011](https://www.iso.org/standard/57372.html) | Pan-head screws with type H or type Z cross recess; official page reports it confirmed in 2026. | Cross-recess pan head has a drive-qualified product-standard scope. |
| [ISO 1580:2011](https://www.iso.org/standard/57369.html) | Slotted pan-head screws, product grade A, M1.6–M10. | Slotted and cross-recessed pan screws cannot be treated as the same standard claim. |
| ISO 14583 official collection/catalog listing | Hexalobular socket pan-head screws. | A visually similar pan head with another recess is a neighboring product boundary, not a synonym for Phillips/slotted. |
| [ISO 261:1998](https://www.iso.org/standard/4165.html) | ISO general-purpose metric screw threads `M` with the ISO 68-1 basic profile. | `M` designation is a thread system/profile context, not merely a unit flag. |
| [ISO 965-1 catalogue](https://www.iso.org/standard/87889.html) | Tolerance system for ISO general-purpose metric screw threads conforming to ISO 261/ISO 68-1. | Diameter and pitch do not replace tolerance class/fit where fit is a selection fact. Edition must be bound explicitly. |
| [ISO 888:2012](https://www.iso.org/standard/50946.html) | Nominal lengths and thread lengths for bolts, screws, and studs for product standards/drawings. | Nominal length and thread extent are separate facts. |
| [ISO 225:2010](https://www.iso.org/standard/45872.html) | Symbols and dimension descriptions for bolts, screws, studs, and nuts. | Length/head dimensions need named bases and symbols, not an unqualified `length` string. |
| [ISO 898-1:2013](https://www.iso.org/standard/60610.html) | Mechanical/physical properties for carbon/alloy-steel bolts, screws, and studs at stated ambient test conditions. | Material family, property class, hardness, and tensile values are not interchangeable strings. |
| [ISO 3506-1:2020](https://www.iso.org/standard/70045.html) | Mechanical/physical properties for corrosion-resistant stainless-steel bolts, screws, and studs, including coarse/fine threads, at stated test conditions. | Stainless designation/property class needs its own normative basis; do not translate it to an ISO 898 class. |
| [ISO 4042:2022](https://www.iso.org/standard/77913.html) and [2026 amendment](https://www.iso.org/standard/91743.html) | Requirements for electroplated coating systems on fasteners; amendment identity is explicit. | Finish/coating is a separate fact and standards claims need edition/amendment identity. |

**Official-source limit:** these abstracts do not provide sufficient lawful access to validate every numeric diameter, pitch, length, head, recess, tolerance, or thread-length value in the packet. No protected dimensional table is reproduced here.

## 4.3 First-party manufacturer evidence

Manufacturer evidence is supporting implementation evidence, not a substitute for normative standards or formal approval.

| Manufacturer source | Relevant observation | Implication |
|---|---|---|
| [Unbrako Engineering Guide](https://unbrako.com/docs/engguide.pdf), extracted locally for review | Its metric socket-head section separates threads (ISO 261/262 coarse series), property class, material, hardness, dimensions, and length tolerance. It also states metric socket cap screws are not sold in one strength level. | Confirms the need for separate typed facts rather than one `strength` or `material` label. |
| Unbrako guide, button-head section | Lists ISO 7380 as a similar specification and describes button-head screws as moderate-fastening products. | Supports reduced-loadability caution and rejects unrestricted strength inference from a generic head/family label. |
| [TR Fastenings button head](https://www.trfastenings.com/Products/Catalogue/Screws-and-Bolts/Hexagon-Socket-Screws/Button-Head) and [button flange head](https://www.trfastenings.com/Products/Catalogue/Screws-and-Bolts/Hexagon-Socket-Screws/Button-Flange-Head) | Maintains separate product ranges for button and button-flange forms. | Supports an explicit collar/flange discriminator. |
| [TR Fastenings pan-head cross-recess](https://www.trfastenings.com/Products/Catalogue/Screws-and-Bolts/Machine-Screws/Pan-Head/Cross-Recess-H-Drive) | Identifies drive, material/grade, and DIN/ISO relationship separately; product pages warn that DIN-to-ISO transitions require checking the supplied standard when dimensions are critical. | `DIN 7985 ~ ISO 7045` is not a safe unqualified equivalence or edition claim. |

## 4.4 Specialist engineering judgment

The following are this assessment's domain judgments and therefore remain subject to formal approval:

1. A POC family should be a mechanically coherent search boundary, not an import bucket.
2. Head profile, collar/flange, and recess geometry are load/fit/tooling facts, not cosmetic aliases.
3. Standard-profile socket head, low head, high head, button head, and button-with-collar should not share an undifferentiated family key.
4. Pan head can be a broad discovery concept, but a selectable configuration must preserve the exact drive/recess and applicable product-standard scope.
5. Right-hand, coarse, and fully threaded must never be silently defaulted from family membership when the source has explicit left-hand, fine/extra-fine, or partial variants.
6. Standard conformance is a scoped claim: publisher/namespace + designation + part + edition/amendment + claim type + evidence.
7. A packet row is not automatically a unique mechanical configuration. Multiple source records may normalize to one configuration; one source record may also be internally incomplete or conflicting.
8. Search candidate status is not suitability, interchangeability, approved alternate, procurement approval, or supplier availability.

## 4.5 Unresolved questions

1. Who is authorized to give formal mechanical approval, and what credentials/signature format are required?
2. Is the POC limited to metric product-standard configurations, or may non-standard/drawing-defined products be included?
3. Is `socket_head_cap_screws` strictly ISO 4762 standard-profile, or a broader parent with typed child profiles? The current contract wording suggests the former.
4. Are tamper-resistant hex button heads excluded, a child profile, or an allowed drive variant?
5. Is `pan_head_machine_screws` one head-form family with drive-qualified configurations, or separate product-standard families by recess?
6. What tolerance classes are release-required, and when may a product standard supply a verified default?
7. How is nominal length measured for each accepted head form, and where is that basis stored?
8. Which standards editions/amendments are approved, and how are legacy DIN claims treated without asserting equivalence?
9. What evidence is required to turn supplied material/finish/strength strings into normalized facts?
10. What is the correction policy when a released fact changes without changing physical configuration identity?
11. What is the withdrawal policy for mappings, configurations, and whole releases?
12. What exact gate, reviewer, and evidence can authorize a configuration for BOM selection?

---

## 5. Candidate family-profile assessment

### Status definitions

- **PASS:** the proposed rule is mechanically coherent for candidate design purposes and no reviewed evidence contradicts it; this is not formal approval.
- **FAIL:** the current predicate/projection/answer key violates the proposed domain boundary.
- **OPEN:** evidence or mechanical approval is insufficient to decide.

### Candidate family-profile table

| Candidate family | Proposed mechanically bounded profile | Boundary design | Current source projection | Benchmark answer-key use | Formal mechanical approval | Overall release status |
|---|---|---:|---:|---:|---:|---:|
| `socket_head_cap_screws` | Metric standard-profile cylindrical socket head; internal hex; explicit M thread, pitch, direction, tolerance/fit, extent, nominal length/basis, head/socket geometry; exclude low/high/ultra-low, pilot, collar/flange, button, countersunk, shoulder, set-screw, tamper-resistant, square/hexalobular, and drawing-special forms unless separately profiled. | **PASS** — proposed bounded profile only | **FAIL** — low-profile DIN 7984 leakage and dropped facts | **FAIL** — two source-backed cases are assigned through the leaking predicate | **OPEN** — absent | **FAIL** — not approved |
| `hex_socket_button_head_screws` | Metric button head without collar; internal hex; reduced-loadability state explicit; exact recess geometry; product-standard part/edition explicit; exclude collar/flange and other recess forms. | **OPEN** — tamper-resistant and non-standard variants need a decision | **FAIL** — generic/partless standards, missing finish, no reduced-loadability field, and variant mixing | **OPEN** — safe abstention is preserved, but profile semantics are not independently checked | **OPEN** — absent | **FAIL** — not approved |
| `pan_head_machine_screws` | Metric machine-thread screw with pan head; no captive/free washer assembly; drive/recess required; applicable cross-recess, slotted, combination, or hexalobular standard scope explicit and not treated as equivalent. | **OPEN** — parent-vs-drive-specific family decision required | **FAIL** — mixed standards/drives, absent edition, missing slotted drive size, and broad string projection | **FAIL** — combination-drive conflict assumption and standard-family composition are not mechanically complete | **OPEN** — absent | **FAIL** — not approved |

### Neighbor and exclusion matrix

| Observed/requested form | Candidate handling | Mechanical reason | Status |
|---|---|---|---:|
| Standard-profile internal-hex socket head | Candidate SHCS profile if all required facts/evidence exist | Matches intended ISO 4762-like profile | **PASS** design; not approved |
| DIN 7984 low head | Separate/excluded profile | Different head height/drive engagement/loadability; current predicate misses hyphenated wording and profile=`Low` | **FAIL current handling** |
| High/ultra-low/pilot socket forms | Separate/excluded profiles | Distinct head/recess geometry | **OPEN approval** |
| Plain internal-hex button head | Candidate button profile | ISO 7380-1-type boundary; reduced loadability | **OPEN approval** |
| Button head with collar/flange | Separate/excluded from plain button | ISO 7380-2 explicitly distinguishes “with collar” | **PASS** exclusion design; not approved |
| Tamper-resistant hex button head | Separate recess profile or explicit allowed child variant | Center pin changes drive geometry/tool compatibility | **OPEN** |
| Cross-recess pan head | Pan profile with explicit H/Z recess and product standard | ISO 7045 scope | **OPEN approval** |
| Slotted pan head | Pan profile only if slotted drive and ISO 1580-like scope are explicit | Different recess and product standard | **OPEN approval** |
| Phillips/slotted combination drive | Explicit combination-drive value; not automatically a conflict | One physical head may intentionally contain both drive features | **FAIL current conflict assumption** |
| Pan head with captive washer | Separate assembly/excluded | Assembly geometry and BOM identity differ | **PASS** exclusion design; not approved |
| Hexalobular socket pan head | Neighboring drive-qualified profile | ISO 14583 scope; not Phillips/slotted | **OPEN / outside current profile** |
| Hex-head source bucket | Non-published prototype outside this three-family benchmark release | External-hex head is not any of the three candidate profiles | **OUT OF SCOPE** |

---

## 6. Required facts and conditionally non-blocking facts

### 6.1 Required for a release-eligible searchable configuration

A fact may be supplied directly or derived only by an approved, versioned rule with retained source evidence. Unknown is not a default.

| Domain | Required facts | Release treatment |
|---|---|---|
| Family | Qualified family/profile key, inclusion/exclusion decision, review state | Missing/conflict blocks family release. |
| Thread identity | Measurement system; thread standard/form; nominal diameter; pitch/lead; direction; tolerance class/fit where applicable | Missing/conflict blocks configuration identity. |
| Thread extent | Fully/partially threaded state; usable/thread length basis where partial; special thread features | Missing/conflict blocks selection when grip/engagement can differ. |
| Length | Numeric value; unit; nominal basis/reference points; tolerance/standard basis where claimed | Bare string is insufficient. |
| Head geometry | Head form; collar/flange state; diameter/width; height; bearing geometry as applicable | Required for bounded family and clearance/fit use. |
| Drive geometry | Drive/recess type; size; tamper-resistant/combination state; depth where release contract requires it | Missing/conflict blocks tool/geometry selection. |
| Material | Base material/alloy family and supplied designation; normalized value and rule/evidence | Do not infer from head or finish. |
| Finish/coating | Plain/coated state; coating system supplied/normalized; process/standard when claimed | Keep separate from material. |
| Strength | Property class/grade namespace; tensile/yield/hardness values with units/test basis when supplied; reduced-loadability applicability | Do not coalesce class, tensile value, and hardness. |
| Standard claims | Issuer namespace; designation; part; edition/year; amendment/corrigendum; claim type (`conforms`, `dimensions`, `material`, `test`, `similar`) | Unqualified comma-separated text is not a release claim. |
| Identifier | Identifier namespace, value, mapping type/state, effective release, and collision handling | Unqualified identifier may not resolve uniquely. |
| Provenance | Source record identity, source/retrieval revision, field-level evidence, normalization rule version, reviewer state | Configuration-level source note alone is insufficient for derived facts. |
| Lifecycle | Stable configuration identity, immutable revision, release-manifest identity/digest, status/effective dates | Mutable upsert is not a release. |
| Truth state | Known/unknown/not-applicable/conflicting/withdrawn/unavailable for each applicable fact/mapping | Never convert absence to false/default. |

### 6.2 Conditionally non-blocking for **discovery only**

The following can remain absent without blocking a research/demo discovery candidate only when the UI explicitly shows them as unavailable and no constrained query or release promise depends on them:

- marketing description, imagery, CAD, packaging, and merchandising copy;
- supplier listing, offer, price, stock, lead time, minimum order, and package quantity;
- equivalence, approved-alternate status, application suitability, and procurement approval;
- certifications/test reports not claimed by the candidate configuration;
- unsupported families and standards outside the bounded release.

These facts are **not** non-blocking for supplier selection, purchasing, certification-dependent work, or BOM approval. They are outside this POC rather than silently satisfied.

---

## 7. Detailed mechanical-domain audit

## 7.1 Metric thread representation

**Status: FAIL — `release_blocker`, `high_risk`.**

Required representation:

```text
thread.system = metric
thread.form_standard = ISO metric M / qualified standard
thread.nominal_diameter = numeric + mm
thread.pitch = numeric + mm
thread.lead = explicit when multi-start or otherwise applicable
thread.direction = right_hand | left_hand | other/unknown
thread.tolerance_class = qualified value or unknown
thread.spacing_series = coarse | fine | extra_fine | other/unknown
```

Repository projection currently retains `thread_size` and `thread_pitch` mainly as display strings. It drops direction, spacing series, fit, and thread type in prototype/import records.

The current metric candidate pools contain explicit variants that prove defaults are unsafe:

- SHCS: **2,447** metric rows; **30 left-hand**; **61 fine**; **19 extra-fine**.
- Button: **741** metric rows; **16 left-hand**; **13 fine**.
- Pan: **1,064** metric rows; all observed right-hand/coarse in this projection, which is an observation, not a family invariant.

All 16 constrained metric benchmark cases encode pitch as, for example, supplied text ending in `mm` while also setting `unit: "mm"`. The benchmark scorer accepts the pitch if its expected text is a substring of the source text. It does not prove exact numeric/unit normalization.

## 7.2 Nominal diameter and pitch

**Status: FAIL — `high_risk`.**

- `M4` is a designation, not a substitute for a separately typed `4 mm` nominal diameter.
- The benchmark's 16 metric cases have `thread_designation` and `pitch`, but **0/16** have a separate nominal-diameter fact.
- Diameter/pitch compatibility must be checked against an approved thread plan/edition; coarse pitch must not be inferred merely because a pitch is common.
- Fine and extra-fine are configuration facts, not separate head families.

## 7.3 Length and length basis

**Status: FAIL — `high_risk`, `evidence_gap`.**

- All 16 metric benchmark cases carry supplied length text, but **0/16** encode a length basis.
- The prototype generators preserve only the source `length` string.
- ISO 888 distinguishes nominal lengths from thread lengths; ISO 225 supplies dimension definitions/symbols.
- A selectable fact needs value, unit, basis/reference points, and applicable tolerance/standard evidence.
- No claim is made here that one under-head convention applies universally to all neighboring head forms; the basis must be family/profile-specific and approved.

## 7.4 Thread form, direction, tolerance/fit, and extent

**Status: FAIL — `release_blocker`, `high_risk`.**

- Current projection drops `thread_type`, `thread_direction`, `thread_fit`, `thread_spacing`, `threading`, and `min_thread_length`.
- SHCS source projection includes **837 partially threaded** metric records and **1,610 fully threaded** records.
- Button projection includes one partially threaded metric record with no minimum-thread-length value.
- Left-hand records are present, so a right-hand default would create false configurations.
- Product standard, property standard, and thread tolerance standard are separate claims.

## 7.5 Head and drive geometry

**Status: FAIL — `release_blocker`, `domain_review_required`.**

Current source rows contain head diameter, head height, and drive size for many records, but generators/importers reduce these to broad head/drive strings. That prevents validation of:

- standard vs low/high/button/pan geometry;
- collar/flange state;
- head diameter/height and bearing clearance;
- internal hex vs tamper-resistant internal hex;
- cross-recess type, slot, and combination drive;
- drive size and recess depth.

Specific observed gaps:

- **255** metric DIN 7984 rows enter the benchmark's SHCS candidate pool because `Low-Profile` is not matched by the exclusion term `low profile`.
- Button pool contains **29** tamper-resistant hex rows.
- Pan pool contains **20** `Phillips/Slotted` rows; these demonstrate that two drive features are not universally contradictory.
- Pan slotted records have **275** missing `drive_size` values in the source projection.

## 7.6 Material, finish, and strength

**Status: FAIL — `release_blocker`, `high_risk`.**

The current generator/import shape is mechanically lossy:

```text
strength = property_class OR tensile_strength OR hardness
```

This collapses different dimensions and normative namespaces. In the metric candidate pools, records frequently contain more than one strength concept:

- SHCS: **2,372** records with multiple populated strength concepts.
- Button: **718**.
- Pan: **890**.

Finish is also materially incomplete:

- SHCS: finish missing on **2,447/2,447** metric candidate rows.
- Button: finish missing on **647/741**.
- Pan: finish missing on **787/1,064**.

Finish-bearing terms also occur inside supplied material strings:

- SHCS: **1,133/2,447**.
- Button: **551/741**.
- Pan: **515/1,064**.
- Benchmark metric cases: **5/16** put a finish-bearing phrase under `material_supplied`.

Required correction:

1. retain supplied text unchanged as evidence;
2. derive base material, alloy/designation, finish/coating, property class/grade, tensile/yield/hardness as separate facts;
3. attach each derivation to a versioned normalization rule and source field;
4. preserve disagreement rather than choosing one value;
5. encode reduced-loadability/product-geometry caveats separately from nominal material property class.

## 7.7 Standards, parts, editions, and amendments

**Status: FAIL — `release_blocker`, `high_risk`.**

Current `specifications_met` values are flat strings mixing product, material/property, process/test, military, and flammability standards. No issuer namespace, claim type, edition, amendment, or source scope is retained.

Aggregate missing product-standard strings among metric candidates:

- SHCS: **139/2,447**.
- Button: **59/741**.
- Pan: **100/1,064**.

Examples of domain ambiguity seen in aggregate projection include generic `ISO 7380` versus `ISO 7380-1`, mixed `DIN 912, ISO 4762`, and mixed DIN/ISO pan-head strings. A list of names does not establish:

- which edition applies;
- whether the claim is conformity, dimensions only, material only, test method, or “similar”;
- whether a withdrawn predecessor was actually used;
- whether standards are dimensionally equivalent;
- whether an amendment/corrigendum applies.

Required key form:

```text
standard_claim_id
issuer_namespace
standard_number
part
edition_or_year
amendment_or_corrigendum
claim_type
claim_scope
source_evidence_id
verification_state
```

## 7.8 Namespace-qualified identifiers

**Status: FAIL for release; PASS as a benchmark concept — `release_blocker`, `validated_strength`.**

The benchmark correctly tests `{namespace, value, release_id}` and ambiguity/collision behavior. However:

- `permitted-reference-clue` is a benchmark namespace, not a public supplier-authority assertion;
- packet uniqueness is not global uniqueness;
- generated `partNumber` values are prototype IDs based on broad bucket/source identity, not immutable mechanical configuration/revision IDs;
- current database references are not composed through a frozen release mapping;
- a source identifier may map to a configuration, listing, or historical record; mapping type must be explicit.

Observed packet fact: 26,953 nonblank references were distinct among 27,009 loaded source rows, with 56 missing references. This does not justify unqualified exact lookup outside that packet, namespace, and release.

## 7.9 Missingness and conflict states

**Status: FAIL — `release_blocker`, `high_risk`.**

The benchmark's fail-closed states are a strength, but the source projection mainly turns `-`/blank into empty string or null. It does not distinguish:

- not supplied;
- unknown after review;
- not applicable;
- conflicting sources;
- intentionally withheld;
- withdrawn;
- unavailable;
- not in this release.

Conflict resolution must be per fact, with competing values and evidence retained. A single current value plus generic `verification_state` cannot explain why a value won or whether it is safe to use.

Two benchmark conflict assumptions need correction or explicit semantics:

1. `Phillips and slotted drive only` is not automatically impossible because combination drives exist in the packet. The input must specify mutually exclusive single-drive alternatives if conflict is intended.
2. `stainless and alloy steel base material` is taxonomically ambiguous because stainless steels are alloys; the controlled categories and exclusivity rule must be named.

## 7.10 Normalization

**Status: FAIL — `high_risk`, `medium_risk`.**

Release-safe normalization must retain:

- supplied field/value/unit;
- parsed numeric value and canonical unit;
- normalized controlled term and namespace;
- parser/rule version;
- evidence and confidence/review state;
- conflict and override history.

Current behavior uses trimming, `parseFloat`, title substring rules, and first-nonblank coalescing. Those are useful ingestion aids but are not a mechanically reviewed normalization policy.

No normalization rule may silently:

- turn missing finish into plain/uncoated;
- turn missing direction into right-hand;
- turn `ISO 7380` into `ISO 7380-1:2022`;
- equate DIN and ISO product standards;
- convert tensile strength or hardness into property class;
- collapse combination drives into a contradiction;
- treat source row identity as unique configuration identity.

## 7.11 Configuration, revision, and release identity

**Status: FAIL — `release_blocker`.**

Required separation:

```text
configuration_id      stable mechanical identity
configuration_revision_id  immutable fact snapshot
release_id             immutable manifest
release_item_id        revision included in release
reference_mapping_id   namespace/value -> target with state/effective release
source_revision_id     source packet/version
```

Current candidate migration has mutable configuration/catalog rows and provenance links, but no immutable release manifest or configuration-revision layer. Upserting a deterministic row changes what the same ID means over time.

The benchmark uses `candidate-fastener-poc-r0`, but that string is not backed by a database release manifest/digest and reviewed membership.

## 7.12 Correction and withdrawal

**Status: FAIL — `release_blocker`, `evidence_gap`.**

The benchmark synthetically tests `withdrawn` and `unavailable`, which is useful. The repository lacks an implemented domain contract for:

- correcting one fact while preserving the old released revision;
- replacing a bad identifier mapping;
- withdrawing a mapping but retaining audit history;
- superseding a configuration/profile/standard edition;
- withdrawing a whole release;
- stating reason, authority, effective time, and replacement;
- preventing stale BOM snapshots from silently changing.

Correction must create a new revision/release; it must not rewrite historical truth in place. Withdrawal must be explicit and must fail closed in exact lookup and selection.

## 7.13 Supplier and BOM selection gates

**Status: BLOCKED / OUT OF SCOPE — `release_blocker`, `out_of_scope`.**

A configuration may appear in candidate discovery without being selectable for a BOM. A BOM/supplier selection gate must require all of the following:

1. release and configuration revision are active, immutable, and mechanically approved for the stated scope;
2. every user hard constraint is represented as a typed fact and matches without unknown/conflict;
3. thread, length basis, extent, head/drive geometry, material, finish, strength, and standard requirements are complete for the use;
4. the mapping is namespace-qualified and active in the same release;
5. suitability/equivalence is either explicitly reviewed under a separate policy or clearly not claimed;
6. supplier listing is sanctioned, current, and linked to the exact configuration with evidence;
7. offer facts—seller, quantity/package basis, price, stock, lead time, certification—are separate, fresh, and not inferred from configuration data;
8. the BOM preserves the user's requirement separately from any selected configuration/listing/offer;
9. selection records reviewer/user action, timestamp, release, and reason;
10. withdrawn/unavailable/conflicting/stale items are blocked or require an explicit external exception workflow.

None of those supplier/offer/approval facts is established by the current POC packet. Generated supplier searches are handoffs for independent verification, not selections.

---

## 8. Current source-projection audit

The aggregate audit was performed without reproducing private raw rows.

### 8.1 Candidate-pool aggregates under the benchmark predicate

| Metric candidate pool | Rows | Key observed facts | Blocking projection defects |
|---|---:|---|---|
| SHCS | 2,447 | 30 left-hand; 80 fine/extra-fine; 837 partial | 255 DIN 7984 low-profile leaks; all finish absent; 139 standard strings absent; direction/extent/head dimensions dropped |
| Button | 741 | 16 left-hand; 13 fine; 29 tamper-resistant hex; one partial | 647 finish absent; 59 standard strings absent; reduced-loadability/collar/recess semantics not typed |
| Pan | 1,064 | 769 Phillips; 275 slotted; 20 combination Phillips/slotted | 787 finish absent; 100 standard strings absent; all 275 slotted drive sizes absent; product standards mixed |

The source packet has richer columns than the prototype projection. The problem is not only source missingness; it is also loss during generation/import.

### 8.2 Configuration-cardinality warning

Using a technical signature that included thread, pitch, length, head/profile, drive, material, finish, strength concepts, standards, extent, direction, and fit, the SHCS metric candidate pool still had **145 duplicate signature groups covering 311 rows**. This does not prove the rows are duplicates in every commercial sense. It proves that source row identity cannot be assumed to equal unique mechanical configuration identity without an explicit deduplication/mapping policy.

### 8.3 Prototype/release mismatch

- Current generated socket/rounded/hex artifacts are broad demo buckets, not the three approved family profiles.
- The benchmark loads socket and rounded source files only; the hex-head prototype is outside the benchmark's three-family scope.
- The SQL/import candidate contract does not yet have a frozen candidate data artifact and approved release manifest that reconcile repository, generated, database, and benchmark membership.

---

## 9. 120-case benchmark answer-key audit

## 9.1 What the benchmark validly demonstrates

**Status: PASS — `validated_strength`.**

- Exact identifier composition can require namespace and release.
- Broad and partial input can abstain rather than invent one part.
- Missing, collision, outside-release, unsupported, withdrawn, unavailable, and service-failure states can fail closed.
- The candidate oracle returns no false-unique match under the frozen contract.
- The current artifact baseline remains demonstrably unsafe as a contract implementation: 8/120 passes and 58 false-unique matches.

## 9.2 What the benchmark does not validate

**Status: FAIL as release evidence — `release_blocker`, `evidence_gap`.**

The 120/120 candidate result is produced by scoring a contract implementation against an answer key built from the same contract rules. It is not an independent domain oracle and does not validate:

- dimensional conformance to product standards;
- diameter/pitch plan validity;
- tolerance class/fit;
- right/left-hand correctness;
- full/partial thread extent;
- length basis;
- head/recess dimensions;
- material/finish normalization;
- property class or reduced-loadability;
- standard part/edition/amendment;
- formal review/approval;
- suitability, equivalence, supplier listing, or offer.

### Metric answer-key coverage

For the 16 constrained metric cases:

| Domain assertion | Cases with explicit typed assertion |
|---|---:|
| Pitch value already includes `mm` while separate unit is also `mm` | 16/16 (**invalid representation**) |
| Separate nominal diameter | 0/16 |
| Thread form/standard | 0/16 |
| Thread direction | 0/16 |
| Thread extent | 0/16 |
| Length basis | 0/16 |
| Head geometry | 0/16 |
| Drive geometry | 0/16 |
| Strength | 0/16 |
| Standard edition | 0/16 |
| Finish-bearing text under `material_supplied` | 5/16 |

## 9.3 Answer-key assumptions by case class

| Case class | Domain assessment | Status |
|---|---|---:|
| 24 namespaced exact mappings | Exact mapping may be one while engineering selection abstains; valid if mapping namespace/release is real and active. One selected case carries leaked low-head family metadata. | **OPEN/FAIL source profile** |
| 12 broad family inputs | Safe non-unique/clarification behavior is valid. Low-profile, flange/collar, and captive-washer boundaries can be mechanically resolved after approval rather than remaining permanently generic. | **PASS safe state / OPEN taxonomy** |
| 16 constrained metric inputs | Safe candidate-set behavior is valid; typed mechanical coverage is inadequate and one case uses a leaked low-head source row. | **FAIL as domain test** |
| 10 partial inputs | Clarification is safe. `DIN 912`, `button head`, and fine-thread interpretation need more precise reasons; fine thread is a facet, not inherently a family. | **PASS safe state / OPEN reasons** |
| 10 explicit conflicts | Diameter, pitch, exact length, finish, and family conflicts are useful. Drive and material conflict semantics are overbroad as written. | **FAIL** — two assumptions require correction |
| 10 ambiguous identifiers | Correctly tests namespace/collision abstention. | **PASS contract** |
| 10 missing-critical cases | Correctly preserves exact mapping while abstaining selection; missingness set is narrower than the required fact contract. | **OPEN** — coverage is incomplete |
| 6 outside-release | Correct contract behavior; database release composition is not implemented. | **PASS synthetic / FAIL implementation** |
| 6 unsupported-family | Correct bounded-scope behavior. | **PASS** |
| 4 withdrawn + 4 unavailable | Correct synthetic states; lifecycle implementation absent. | **PASS synthetic / FAIL implementation** |
| 8 service failures | Correct fail-closed composition. | **PASS** |

## 9.4 Required benchmark correction before release acceptance

1. Freeze approved typed family profiles first.
2. Exclude/reclassify DIN 7984 low-head records and regenerate all affected cases.
3. Store numeric pitch value without embedded unit; use exact decimal/unit assertions.
4. Add diameter, form, direction, fit/tolerance, extent, length basis, head/drive geometry, material, finish, strength/loadability, and standard edition assertions.
5. Add negative neighbor cases for low/high/ultra-low, collar/flange, tamper-resistant recess, captive washer, combination drive, hexalobular pan, and non-standard/drawing-defined forms.
6. Correct the combination-drive conflict fixture.
7. Define controlled material taxonomy before asserting stainless/alloy exclusivity.
8. Validate candidate-family metadata and normalization outputs, not only response state/reason subsets.
9. Bind fixture to source-packet digest, normalization-rule version, family-profile revision, and release-manifest digest.
10. Obtain formal mechanical approval of the answer key; retain unresolved states until that occurs.

---

## 10. Release-packet acceptance checklist

**Acceptance rule:** every required item must be **PASS**. An **OPEN** item blocks acceptance.

| # | Acceptance item | Status | Evidence needed to pass |
|---:|---|---:|---|
| 1 | Named qualified mechanical approver, signed scope, date | **OPEN** | Approval record and credentials/authority. |
| 2 | Approved family-profile revision for all three candidate families | **FAIL** | Typed profiles, inclusion/exclusion matrix, reviewer sign-off. |
| 3 | SHCS low-profile leakage removed | **FAIL** | Predicate/profile tests and regenerated corpus showing zero leakage. |
| 4 | Button collar, tamper-resistant recess, and reduced-loadability rules | **OPEN** | Approved profile and negative tests. |
| 5 | Pan drive/product-standard parent-vs-child decision | **OPEN** | Approved taxonomy and combination-drive semantics. |
| 6 | Required/non-blocking fact policy approved | **OPEN** | Signed policy tied to release use cases. |
| 7 | Metric thread typed model and exact unit parsing | **FAIL** | Decimal/unit tests and standard-plan validation. |
| 8 | Diameter, pitch, form, direction, fit, extent retained | **FAIL** | Field-level ledger and coverage report. |
| 9 | Nominal length and profile-specific basis retained | **FAIL** | Approved length-basis definitions and tests. |
| 10 | Head/drive dimensions and variant geometry retained | **FAIL** | Typed geometry facts with source evidence. |
| 11 | Material, finish, property class, tensile/yield/hardness separated | **FAIL** | Normalization rules, conflicts, field provenance. |
| 12 | Reduced-loadability represented where applicable | **FAIL** | Product-profile/loadability fact and approved display/selection behavior. |
| 13 | Standards issuer/part/edition/amendment/claim scope qualified | **FAIL** | Standards registry and lawful review record. |
| 14 | Licensed/authorized normative evidence access | **OPEN** | Source register entry and review citations. |
| 15 | Namespace-qualified identifier mappings | **FAIL** | Mapping type/state/release and collision tests in implementation. |
| 16 | Missing/unknown/not-applicable/conflict states per fact | **FAIL** | Fact-state schema and conflict fixtures. |
| 17 | Supplied and normalized values with rule version | **FAIL** | Reproducible normalization ledger. |
| 18 | Stable configuration identity + immutable revision identity | **FAIL** | Versioned configuration schema and migration tests. |
| 19 | Immutable release manifest, membership, digest | **FAIL** | Release artifact and database/API composition. |
| 20 | Correction/supersession/withdrawal lifecycle | **FAIL** | State machine, reasons, effective dates, regression tests. |
| 21 | Benchmark mechanical answer key corrected and approved | **FAIL** | Regenerated fixture, independent review, digest. |
| 22 | Current baseline has zero false-unique matches | **FAIL** | Executed report; current result is 58. |
| 23 | Full source-to-projection coverage report | **FAIL** | Per-field coverage, missingness, conflicts, exclusions. |
| 24 | No broad prototype bucket presented as reviewed release | **OPEN** | Runtime/build/database tests and visible release identity. |
| 25 | Supplier listing/offer gate remains separate | **PASS for exclusion** | Continue no-offer contract; separate future phase approval. |
| 26 | BOM stores requirement separately from candidate/selection | **OPEN** | Typed BOM contract and tests. |
| 27 | BOM/supplier selection blocks unknown/conflict/withdrawn/stale | **FAIL** | Selection policy, UI/API tests, audit record. |
| 28 | Public claims limited to approved evidence | **OPEN** | Claim matrix and release review. |
| 29 | Release digest tied to mechanical approval | **FAIL** | Signed approval references exact manifest and fixture digests. |
| 30 | Final go/no-go record | **FAIL** | Explicit **GO** by authorized owner after all above pass. |

**Checklist result:** **0 families approved; release packet not accepted.** Item 25 passes only because supplier offers remain excluded; it does not offset any blocker.

---

## 11. Minimum acceptable remediation sequence

1. Approve typed family profiles and neighboring-form exclusions.
2. Build a field-level source ledger preserving supplied values and states.
3. Normalize metric thread, length/basis, geometry, material, finish, strength, and standard claims with versioned rules.
4. Introduce stable configuration identity, immutable revisions, and an immutable release manifest.
5. Implement correction, supersession, withdrawal, and release-scoped mappings.
6. Regenerate the benchmark from approved profiles; add mechanical conformance/negative cases.
7. Run independent mechanical answer-key review against lawful normative sources.
8. Run source coverage, conflicts, duplicate-signature, and false-unique gates.
9. Obtain formal mechanical approval tied to exact source, rule, benchmark, and release digests.
10. Only then consider a release go/no-go. Supplier/BOM selection remains separately gated.

This sequence is a release recommendation, not a `/to-spec` plan and not authorization for production edits.

---

## 12. Final disposition

- **Socket-head family:** **FAIL for candidate release; not mechanically approved.**
- **Hex-socket button-head family:** **FAIL for candidate release; open questions remain; not mechanically approved.**
- **Pan-head machine-screw family:** **FAIL for candidate release; open questions remain; not mechanically approved.**
- **120-case benchmark:** **PASS as a fail-closed composition regression; FAIL as a mechanical release-acceptance oracle.**
- **Current source projection:** **FAIL for reviewed release use.**
- **Supplier/BOM selection:** **BLOCKED / outside candidate evidence.**
- **Candidate POC release packet:** **BLOCKED — NO GO.**

No independent PE/SME approval is claimed. No family or release is marked reviewed/approved. No production file, migration, importer, generator, benchmark, fixture, or `/to-spec` artifact was modified by this assessment.
