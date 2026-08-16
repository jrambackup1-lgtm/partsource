# Proxy data-quality review — 2026-08-10

**Status:** Completed bounded proxy/synthetic review. This is not mechanical approval, standards certification, answer-key approval, catalog-release approval, BOM approval, release approval, or human evidence.

## Scope and decisive proxy verdict

- **Evidence — tier 2 (repository observation):** The checked-in packet contains 27,009 rows and enough supplied technical fields to support a bounded *candidate-review* exercise, but the current raw-to-canonical projection loses selection-relevant facts, preserves malformed quantities, conflates material concepts, and has no catalog revision/release lifecycle.
- **Evidence — tier 2 (repository observation):** Frozen v1 reproduced byte-for-byte and rescored at candidate 120/120, 95 abstentions, and zero false-unique matches. The emulated current artifact reproduced 8/120, 47 abstentions, 24 false-unique identities, and 58 false-unique selections/cases.
- **Evidence — tier 3 (deterministic metamorphic test):** The full v1 source check and 120-case score remained 120/120 after all 16 metric pitch units were changed from `mm` to `in`, all 16 family constraints were changed to a wrong family, all 50 source-observation family labels were changed, and all 34 source-backed exact requests were moved to a wrong release. These are independent falsifications of any mechanical, family, unit, or release interpretation of the score.
- **Risk — tier 2/3:** The current exact branch still returned a unique selection for 34/34 source-backed exact cases after all projected technical fields were removed in memory. Injecting two rows with the same exact reference still returned one row because the SQL semantics use `LIMIT 1` without a uniqueness, namespace, lifecycle, or release constraint.
- **Rejected — tier 3:** Reject the current projection, SQL exact behavior, and frozen v1 as a basis for unique engineering selection, catalog release, material normalization, standards conformance, or correction authority.
- **Strong hypothesis — tier 3:** The underlying direction is repairable before specification because the permitted raw packet contains substantially richer facts than the projection and because conservative candidate/abstention behavior can be defined without inventing approval.

**Decisive proxy verdict: A — proceed to human validation only.** Proceed only with a manual, differences-first candidate-review hypothesis inside the correction boundary below. Do **not** proceed to `/to-spec`, a catalog build mandate, unique selection, or release acceptance. If the proposed next direction requires the current broad importer, current exact lookup, frozen v1 as mechanical truth, or silent normalization, its verdict is **C — rethink**.

## Authority, confidentiality, and evidence tiers

- **Fundamental requirement — tier 3:** The source register permits local use of the confidential cofounder-provided packet for supplied technical fields. This review reports aggregates, hashes, predicates, and benchmark case IDs only; it reproduces no raw row or confidential upstream lineage.
- **Fundamental requirement — tier 1/2:** Official public standards/manufacturer sources are used only to interpret field semantics. No protected standards table is copied, and no blocked source in `research/data-source-register.md` was accessed or used.
- **Fundamental requirement — tier 3:** Frozen benchmark v1 remains unchanged. Corrections require a new corpus identity and must not rewrite v1.
- **Open question — tier 3:** Qualified people still must decide positive family membership, required mechanical facts, material taxonomy, product-standard scope, and who may approve a digest-bound catalog release. This proxy cannot close those questions.

Evidence tiers used here are: tier 1 public primary authority; tier 2 repository observation or direct execution; tier 3 proxy/synthetic analysis. Agent agreement is not an additional tier.

## Method and reproducibility

### Exercised artifacts

The audit traced and exercised:

- all three permitted CSV inputs under `data/`;
- `web/scripts/import-catalog-to-supabase.ts`;
- all three `web/scripts/generate-*-prototype-catalog.ts` files;
- `web/src/lib/catalogApi.ts` and the current local decoder exact-lookup behavior;
- Supabase catalog migrations through `20260809_configuration_catalog_contract.sql` and `supabase/functions/catalog-search/index.ts`;
- frozen corpus, frozen result, builder, and scorer;
- the active product contract, source register, gate contract, prior taxonomy audit, domain release review, and benchmark adjudication; and
- `research/release-truth.md`, to distinguish application deployment identity from missing catalog release identity.

### Audit artifact

- **Evidence — tier 2:** `research/validation-tools/audit_proxy_data_quality_20260810.py` is an aggregate-only, standard-library Python audit. It prints no raw rows or identifier values, performs in-memory mutations, and writes nothing itself.
- Audit script SHA-256: `583925766af4ba121096340383405ba3c551a861afd9bd856a7993d0d372390b` after the final audit edit and verification run.

### Commands executed from `C:\Users\jayar\projects\partsource`

```bash
python -m py_compile research/validation-tools/audit_proxy_data_quality_20260810.py
python research/validation-tools/audit_proxy_data_quality_20260810.py \
  > research/.tmp-proxy-data-quality-audit.json
python -m json.tool research/.tmp-proxy-data-quality-audit.json > /dev/null

python research/validation-tools/build_fastener_truth_benchmark_v1.py \
  --output research/.tmp-proxy-benchmark-reproduction.json
cmp -s \
  research/fixtures/fastener-truth-composition-benchmark-v1.0.0.json \
  research/.tmp-proxy-benchmark-reproduction.json

python research/validation-tools/score_fastener_truth_benchmark_v1.py \
  --output C:/Users/jayar/projects/partsource/research/.tmp-proxy-benchmark-score-absolute.json

sha256sum \
  research/fixtures/fastener-truth-composition-benchmark-v1.0.0.json \
  research/fixtures/fastener-truth-composition-benchmark-v1.0.0.results.json \
  research/validation-tools/build_fastener_truth_benchmark_v1.py \
  research/validation-tools/score_fastener_truth_benchmark_v1.py \
  research/validation-tools/audit_proxy_data_quality_20260810.py

cd web
npx tsx scripts/test-catalog-import.ts
```

Temporary benchmark reproduction/score files were removed after comparison. The aggregate JSON was also removed after report completion.

- **Evidence — tier 2:** The catalog-import test exited 0 and asserted 27,009 records and 27,009 deterministic importer IDs.
- **Nice-to-have — tier 2:** The scorer accepted the absolute temporary output path. A relative `--output research/...` path wrote the result and then raised `ValueError` while calling `relative_to(ROOT)` on Windows; v1 scoring and hashes were unaffected. A future scorer version should resolve caller paths before reporting them, without changing frozen v1.

### Frozen integrity

| Artifact | Reproduced SHA-256 | Result |
|---|---|---|
| Frozen corpus | `0b4acb8152288973a9fa6465d2c4f2d066a5e0566fb33503309e968e2e5c087b` | Byte-identical builder reproduction |
| Frozen result | `8f19f14c3d65844ef1f229cb9cd518a756ef6125b5df9817d7295e88122db160` | Unchanged |
| Builder | `ce6abb6cd0fe85cffaa4896474d251e5efc20dd893e0191674f5ad2a57ed19ae` | Unchanged |
| Scorer | `a7a28ec442acb0b9455142935d4026862276e6d94a2d6f5cafc01174bb313f0b` | Unchanged |

## Raw-to-canonical trace and missing-value rules

### Field mapping

| Supplied/raw field(s) | Importer/generator projection | Data-quality effect |
|---|---|---|
| CSV file bucket | fixed `family = socket | hex | rounded`; fixed broad `type` | Import bucket is presented as family/type; no positive mechanical profile review occurs. |
| `sku` | `source_sku`; UUID derived from `SHA-256(family + NUL + sku)` | Stable for one bucket/SKU, but it identifies an imported row, not a mechanical configuration revision. Upsert mutates the same ID. |
| `mcmaster_pn` | `reference_number`; generated prototype part number may also use it | Namespace, mapping type/state, effective release, and collision state are absent. |
| `thread_size` | `thread` string | `thread_diameter`, `thread_type`, and measurement system are not composed into typed thread identity. |
| `thread_pitch` | `pitch` string unchanged | No numeric parsing, canonical unit, lead, or diameter/pitch compatibility check. |
| `length` | `length` string unchanged | No numeric value/unit/basis/tolerance or distinction from thread length. |
| profile/style/head type | joined broad `head` string | `head_diameter`, `head_height`, bearing/collar state, and geometry basis are dropped. |
| `drive_style` | `drive` string | `drive_size` and recess geometry are dropped. |
| `material` | `material` string unchanged | Combined material/finish text remains fused; missing is possible despite generator “required” checks. |
| `finish` | `finish` string/null | Absence remains null in import, but the browser `Part` adapter later displays missing general fields as `Unknown`. |
| grade/class, tensile, hardness | first nonblank becomes `strength` | Distinct property namespace, value/unit, and test basis are collapsed; later values are discarded. |
| `specifications_met` | flat `standard` string | Issuer, designation, part, edition/amendment, claim type, and evidence scope are absent. |
| direction, fit, spacing, threading, minimum thread length, reach, detailed dimensions | not projected | Supplied selection-relevant facts are lost before search and result composition. |
| provenance/review | fixed demo/synthetic/prototype fields | Every row receives generic packet provenance and `demo-only`; there is no field-level evidence or qualified review state. |

### Missing-value behavior before counting

- **Evidence — tier 2:** Importer/benchmark cleaning is outer trim followed by blank or exact `-` to `null`/`None`. Other sentinel spellings are not classified.
- **Evidence — tier 2:** Generators validate required fields using raw `row[field]?.trim()` before calling `clean`. Exact `-` therefore passes the required check and is then emitted as an empty string. This matters: 47 material values are exact `-`, so the “required material” generator checks do not establish canonical material presence.
- **Evidence — tier 2:** `catalogResultToPart` maps missing type/thread/material/finish/drive/standard to `Unknown` and missing pitch/length to `N/A`. Those display tokens collapse “not supplied,” “unknown,” and “not applicable”; they are not source facts.
- **Risk — tier 2:** Counting any trimmed nonblank source cell as populated overstates canonical coverage where `-` is a sentinel. Counting `Unknown` or `N/A` after the browser fallback would overstate it again.

Aggregate missing tokens across 27,009 rows:

| Field | Blank after trim | Exact `-` | Canonical missing |
|---|---:|---:|---:|
| SKU | 0 | 0 | 0 |
| Known reference | 56 | 0 | 56 |
| Thread size | 0 | 0 | 0 |
| Length | 0 | 0 | 0 |
| Material | 0 | 47 | 47 |
| Finish | 20,256 | 0 | 20,256 |
| Pitch | 18,275 | 0 | 18,275 |
| Standard string | 0 | 4,353 | 4,353 |

## Aggregate claim reproduction and falsification

### Packet identity and broad field coverage

- **Evidence — tier 2:** Row counts reproduce exactly: socket bucket 7,864; hex bucket 8,850; rounded bucket 10,295; total 27,009.
- **Evidence — tier 2:** The earlier 100% material claim is falsified under the production/import missing rule: 26,962/27,009 (99.826%) are canonically populated; 47 exact-dash values become missing.
- **Evidence — tier 2:** The earlier 100% head-dimensions claim is falsified if “head dimensions” requires head height plus diameter/width: 26,535/27,009 (98.245%) have both. Rounded rows contain 10,294 populated head heights but only 9,821 populated head diameters.
- **Evidence — tier 2:** The remaining rounded aggregate claims reproduce after canonical missing handling: thread size 27,009/27,009; length 27,009/27,009; any strength evidence 27,009/27,009; drive style or size 26,953/27,009 (99.793%); known reference 26,953/27,009 (99.793%); pitch 8,734/27,009 (32.337%); dedicated finish 6,753/27,009 (25.003%); and supplied standard string 22,656/27,009 (83.883%).

| Canonical field observation | Socket | Hex | Rounded | Total |
|---|---:|---:|---:|---:|
| Rows | 7,864 | 8,850 | 10,295 | 27,009 |
| Material populated | 7,864 | 8,833 | 10,265 | 26,962 |
| Pitch populated | 2,838 | 2,575 | 3,321 | 8,734 |
| Dedicated finish populated | 0 | 3,086 | 3,667 | 6,753 |
| Standard populated | 6,341 | 7,674 | 8,641 | 22,656 |
| Any strength concept | 7,864 | 8,850 | 10,295 | 27,009 |
| Multiple strength concepts | 7,452 | 8,489 | 9,463 | 25,404 |
| Material text with a finish-bearing lexical flag | 3,772 | 843 | 4,654 | 9,269 |

“Finish-bearing lexical flag” is a conservative aggregate detector for `oxide`, `plated`, `coated`, or `passivat` in the supplied material string. It flags combined-field review work; it does not establish an approved finish or base-material split.

### Candidate-family counts and family leakage

- **Evidence — tier 2:** The earlier refined-family counts reproduce exactly under strict profile/style, exact drive, and exclusion predicates: 6,707 socket-head, 2,050 plain hex-socket button-head, and 3,216 pan-head rows, totaling 11,973. These are predicate results, not approved family memberships.
- **Evidence — tier 2:** The benchmark's looser metric pools reproduce: 2,447 socket, 741 button, and 1,064 pan.
- **Evidence — tier 2:** The reported 255 metric DIN 7984 `Low-Profile` leak is true, but it is not the complete typed low-profile leakage count. The socket packet has 729 rows with typed profile `Low`; the punctuation-sensitive benchmark predicate admits 466 of them, and 265 admitted rows satisfy its metric-composition test. Of those 265, 255 are the reported DIN 7984 subset and 10 have another or missing standard string.
- **Evidence — tier 3:** Normalizing `Low-Profile`/typed `Low` to `low profile` changed all 466 admitted typed-low rows from included to excluded. Family membership therefore depends on punctuation rather than stable profile semantics.
- **Evidence — tier 2:** Frozen cases affected by typed-low leakage remain exactly `EXACT-002` and `METRIC-005`.
- **Risk — tier 3:** The 255 claim is accurate only when explicitly scoped to DIN 7984. Calling it the total family leak understates the observed typed-low admission by 10 metric rows or 211 all-row admissions, depending on the denominator.

| Candidate predicate | Rows | Finish missing | Standard missing | Material text lexically finish-bearing | Multiple strength concepts |
|---|---:|---:|---:|---:|---:|
| Benchmark metric socket | 2,447 | 2,447 | 139 | 1,133 | 2,372 |
| Benchmark metric button | 741 | 647 | 59 | 551 | 718 |
| Benchmark metric pan | 1,064 | 787 | 100 | 515 | 890 |

### Material, finish, and strength

- **Evidence — tier 2:** Material is not 100% canonically present, dedicated finish is absent in 20,256 rows, and 9,269 material strings carry a finish-bearing lexical flag.
- **Evidence — tier 2:** The prior metric-pool claims reproduce exactly: finish missing on 2,447/2,447 socket, 647/741 button, and 787/1,064 pan rows; finish-bearing material text on 1,133/2,447, 551/741, and 515/1,064 respectively.
- **Evidence — tier 2:** Strength coalescing is materially lossy. Across the complete packet, 25,404/27,009 rows contain more than one of property class/grade, tensile strength, and hardness, yet the canonical projection keeps only the first populated concept.
- **Evidence — tier 2:** The frozen metric benchmark reproduces 5/16 finish-bearing values under `material_supplied`; no separate normalized material and finish assertions are scored.
- **Fundamental requirement — tier 1/3:** Preserve supplied material text as evidence and keep base material/designation, coating/finish, property class/grade, tensile/yield values, and hardness as separate facts with units, namespaces, rule versions, and review/conflict states.
- **Risk — tier 3:** A lexical split can identify review candidates but cannot safely assert the normalized base material or finish. No automated split is inside the conservative correction boundary.

### Quantities and units

- **Evidence — tier 2:** Importer and generators keep `thread_pitch` and `length` as supplied strings; there is no typed numeric/unit parse or round-trip invariant.
- **Evidence — tier 2:** All 16/16 frozen constrained metric cases store a pitch value already ending in `mm` and also store `unit: "mm"`.
- **Evidence — tier 2:** Source validation checks pitch by substring containment and ignores the asserted pitch unit. The candidate composer ignores pitch, diameter, length, material, and family for a constrained candidate state.
- **Evidence — tier 3:** Changing all 16 pitch units from `mm` to `in` still passed all 50 source checks and all 120 cases. Removing embedded `mm` from all 16 values also retained 120/120. The score cannot distinguish the malformed duplicate-unit form from a cleaner value/unit separation, and it cannot reject a contradictory unit.
- **Evidence — tier 3:** Changing each metric pitch value to `999` left the candidate composer's response unchanged in 16/16 cases. Full source validation would reject that particular value mutation; the state composer itself does not evaluate it.
- **Fundamental requirement — tier 1/3:** A corrected corpus must store exact decimal value and canonical unit once, nominal diameter separately, and test exact equality plus approved thread-system/diameter/pitch compatibility. Unknown direction, fit/tolerance, form, and extent must remain unknown.

## Identifier identity, duplicates, and false uniqueness

### Packet observations

- **Evidence — tier 2:** Known references: 26,953 nonblank, 26,953 distinct exact and case-folded values, 56 missing, and zero duplicate groups in this packet.
- **Evidence — tier 2:** Source SKUs: 27,009 nonblank and distinct globally and within each bucket. No case-folded value appears in both the known-reference and source-SKU namespaces in this packet.
- **Evidence — tier 2:** The importer test confirms 27,009 deterministic UUIDs. This is row-key uniqueness under current bucket/SKU inputs, not mechanical-configuration uniqueness.
- **Evidence — tier 2:** A 22-field technical signature over the benchmark socket metric pool has 145 duplicate groups covering 311 rows; the largest group has three rows. Distinct source rows and references therefore do not prove distinct mechanical configurations.

### Implementation and mutations

- **Evidence — tier 2:** The database has ordinary indexes, not unique constraints, on `reference_number` and `source_sku`. Exact search is un-namespaced, un-released, case-insensitive equality followed by `LIMIT 1`.
- **Evidence — tier 3:** Injecting two projected rows with one exact reference returned one row through the exact branch. The current behavior hides rather than reports a collision.
- **Evidence — tier 3:** Removing all projected thread, pitch, length, head, material, finish, drive, strength, and standard facts left the exact result unchanged and uniquely selected in 34/34 source-backed exact cases.
- **Evidence — tier 3:** The full v1 score remained 120/120 when all 34 source-backed exact requests named a wrong release because the source-backed candidate branch does not evaluate requested release.
- **Risk — tier 2/3:** “One packet row,” “one database row,” “one identifier mapping,” and “one selectable configuration” are four different cardinalities. Current data/search collapses them.
- **Fundamental requirement — tier 3:** Exact resolution must use namespace + value + mapping type/state + immutable release, detect zero/one/many before limiting output, and keep mapping identity separate from mechanical selection state.

## Benchmark reproduction and metamorphic review

### Reproduced score

| Measure | Candidate contract v1 | Current-artifact emulation |
|---|---:|---:|
| Cases | 120 | 120 |
| Pass / fail | 120 / 0 | 8 / 112 |
| Abstentions | 95 | 47 |
| False-unique identities | 0 | 24 |
| False-unique selections | 0 | 58 |
| False-unique case union | 0 | 58 |

- **Evidence — tier 2:** Expected states remain 95 abstentions, 25 candidate sets, and zero unique engineering selections; six answer keys remain explicitly unresolved.
- **Evidence — tier 2:** The result is a deterministic composition regression. It validly reproduces safe state output for its self-authored contract and the unsafe behavior of the emulated current artifact.
- **Rejected — tier 2/3:** It is not a mechanical benchmark, family-classification benchmark, unit parser test, material normalizer test, release implementation test, search-quality test, or independently reviewed answer key.

### Metamorphic mutations accepted by the full v1 check and score

| In-memory mutation | Mutated cases | Source checks | Candidate score |
|---|---:|---:|---:|
| Pitch unit `mm` → `in` | 16 | 50/50 complete | 120/120 |
| Remove embedded `mm` from pitch value | 16 | 50/50 complete | 120/120 |
| Replace metric family constraint with one wrong family | 16 | 50/50 complete | 120/120 |
| Replace source-observation candidate family with one wrong family | 50 | 50/50 complete | 120/120 |
| Change requested release on source-backed exact inputs | 34 | 50/50 complete | 120/120 |

“Complete” means the existing source-validation function ran without error; it does not mean it checked the mutated semantic field.

- **Evidence — tier 3:** These mutations independently falsify a stronger reading of the score. A result can remain perfect while unit, family, source-family metadata, or requested release is wrong.
- **Opportunity / gold idea — tier 3:** Make benchmark mutations first-class negative assertions: every critical-field deletion, incompatible unit, wrong family/profile, wrong release, collision, conflict, stale revision, and withdrawal should be required to change the state or trigger abstention for an explicit reason. Record a mutation matrix beside each corpus result.
- **Fundamental requirement — tier 3:** A separately versioned benchmark must validate normalized fact output and invariants, not only response state/cardinality/reason subsets. Its answer keys require independent qualified review for mechanically meaningful facts.

## Release, revision, correction, and withdrawal gaps

- **Evidence — tier 2:** `research/release-truth.md` defines immutable *application deployment* identity through commit SHA and build timestamp. That does not create catalog release identity or reviewed catalog membership.
- **Evidence — tier 2:** `catalog.catalog_configurations` has one mutable row per deterministic import ID. `ON CONFLICT (id) DO UPDATE` can change every projected field while preserving the ID.
- **Evidence — tier 2:** No Supabase migration defines stable mechanical configuration identity, immutable configuration revision, catalog release manifest/membership/digest, release-scoped reference mapping, correction, supersession, or withdrawal relations.
- **Evidence — tier 2:** `candidate-fastener-poc-r0` is a benchmark fixture string, not a database manifest or approved release digest.
- **Evidence — tier 2:** Synthetic withdrawn/unavailable/outside-release benchmark cases test composition only. The current database/RPC cannot represent or enforce those states.
- **Risk — tier 2:** A re-import can silently rewrite what the same importer ID means. Exact lookup cannot distinguish active, superseded, withdrawn, corrected, stale, or outside-release mappings.
- **Fundamental requirement — tier 3:** Any future catalog release needs stable configuration identity; immutable revision; immutable manifest and digest; explicit membership; namespace-qualified mapping state; source/rule/profile revisions; correction reason/authority/effective time; supersession links; withdrawal; and rollback. Saved snapshots must retain the prior revision rather than silently inherit current facts.

## Public primary semantic checks

These sources establish semantics and scope only; they do not validate packet rows or replace qualified review.

- **Evidence — tier 1:** [ISO 261:1998](https://www.iso.org/standard/4165.html) describes ISO general-purpose metric screw threads (`M`) with the ISO 68-1 basic profile. `M` is therefore thread-system/profile context, not merely a display unit.
- **Evidence — tier 1:** [ISO 965-1:2026](https://www.iso.org/standard/87889.html) defines a tolerance system for ISO metric threads conforming to ISO 261. Nominal diameter and pitch do not represent tolerance/fit.
- **Evidence — tier 1:** [ISO 888:2012](https://www.iso.org/standard/50946.html) separately addresses lengths and thread lengths for bolts, screws, and studs. One unqualified `length` string cannot encode both semantics.
- **Evidence — tier 1:** [ISO 4042:2022](https://www.iso.org/standard/77913.html) is explicitly about electroplated coating systems. Coating is not safely interchangeable with base material.
- **Evidence — tier 1:** [ISO 898-1:2013](https://www.iso.org/standard/60610.html) addresses mechanical/physical properties of carbon/alloy-steel bolts, screws, and studs, while [ISO 3506-1:2020](https://www.iso.org/standard/70045.html) addresses corrosion-resistant stainless-steel fasteners with grades and property classes. Material, property class, tensile values, and hardness need scoped namespaces rather than first-nonblank coalescing.
- **Evidence — tier 1:** [ISO 7045:2011](https://www.iso.org/standard/57372.html) identifies pan-head screws with type H or Z cross recess, while [ISO 1580:2011](https://www.iso.org/standard/57369.html) identifies slotted pan-head screws. A generic pan-head family may aid discovery, but drive and product-standard scope must remain explicit.
- **Evidence — tier 1:** [ISO 7380-2:2022](https://www.iso.org/standard/78700.html) identifies button-head screws with collar and reduced loadability. [TR Fastenings](https://www.trfastenings.com/Products/Catalogue/Screws-and-Bolts/Hexagon-Socket-Screws/Button-Head) also publishes distinct button-head and [button-flange-head](https://www.trfastenings.com/products/Catalogue/Screws-and-Bolts/Hexagon-Socket-Screws/Button-Flange-Head) ranges. Collar/flange is not a cosmetic alias.
- **Evidence — tier 1:** The official [Unbrako Engineering Guide](https://unbrako.com/docs/engguide.pdf) describes metric socket-head threads and property class under separate standards/fields, supporting a typed fact ledger rather than the current collapsed `strength` string.

## Conservative correction boundary

### Corrections permitted without inventing mechanical truth

- **Fundamental requirement — tier 2/3:** Correct aggregate documentation to use the importer missing rule: material 26,962/27,009, paired head dimensions 26,535/27,009, pitch 8,734/27,009, finish 6,753/27,009, and standards 22,656/27,009. State exact denominator and field-presence definition.
- **Fundamental requirement — tier 3:** Treat all three CSV filenames as ingestion buckets only. A conservative parser may *exclude* typed/normalized neighboring forms from a narrow candidate pool; it may not positively approve the remaining rows as a family.
- **Fundamental requirement — tier 3:** Preserve supplied values and explicit missingness. Never map absent finish to plain, absent direction to right-hand, absent pitch to coarse, absent standard to a presumed standard, or `N/A` to a source fact.
- **Fundamental requirement — tier 3:** Preserve all strength concepts independently; do not select one by precedence. Flag finish-bearing material strings for review while retaining the original supplied string.
- **Fundamental requirement — tier 3:** Report packet-local identifier distinctness only. Detect and surface mapping collision before applying result limits. Do not merge the 145 duplicate-signature groups automatically.
- **Fundamental requirement — tier 3:** Keep v1 immutable and label it legacy composition/forensic evidence. Any changed case, typed fact, profile, mutation assertion, or answer key requires a new corpus version and digest.
- **Fundamental requirement — tier 3:** Until a catalog release model exists, every packet result remains demo/candidate only and must abstain from unique engineering selection.

### Corrections requiring qualified authority

- **Open question — tier 3:** Positive family/profile inclusion and neighboring-form treatment, including all typed-low records and button/pan variants.
- **Open question — tier 3:** Metric diameter/pitch plan, thread form, direction, fit/tolerance, extent, and profile-specific length basis.
- **Open question — tier 3:** Base-material taxonomy, finish/coating decomposition, property class/grade namespace, and conflict/exclusivity rules.
- **Open question — tier 3:** Product-standard issuer/part/edition/amendment and claim type; accessible public metadata is insufficient for row-level numerical conformance.
- **Open question — tier 3:** Which facts are mechanically required for a family candidate, a reviewed configuration, a supplier handoff, and any later BOM selection. Those are different gates.

### Explicitly outside the correction boundary

- **Rejected — tier 1/2/3:** Silent row merge, silent source-field overwrite, inferred equivalence, inferred suitability, inferred supplier listing/offer/stock/price/availability, or claim that packet identity equals configuration identity.
- **Rejected — tier 3:** Editing v1 in place, using the current 120/120 as an acceptance threshold, or rewarding a future implementation for reproducing wrong family/unit/release metadata.
- **Rejected — tier 3:** Calling deterministic proxy agreement human validation, qualified mechanical review, independent answer-key review, release approval, or production evidence.

## Finding register using the required classifications

- **Evidence:** Packet row counts, most rounded coverage claims, refined predicate counts, the 255 DIN subset, two affected frozen cases, packet-local identifier distinctness, duplicate signatures, benchmark scores, and schema/lifecycle gaps reproduced. Material and paired-head-dimension 100% claims were falsified under actual missing rules; typed-low metric leakage is 265, not only 255.
- **Fundamental requirement:** Preserve raw/supplied facts and missing states; separate typed facts and namespaces; detect collisions; bind immutable revisions/releases; preserve v1; and obtain qualified review before positive mechanical truth or release use.
- **Strong hypothesis:** A small manual candidate-review packet built from conservative exclusions, supplied-versus-normalized differences, and explicit abstention can be tested with humans before implementation.
- **Opportunity / gold idea:** Use a digest-bound differences-and-mutations packet: supplied facts, parsed candidates, omitted fields, exclusion reasons, collision/signature groups, release state, and expected state changes under each critical mutation.
- **Nice-to-have:** Improve audit visualization and fix future scorer relative-output handling after the manual correction/review contract is settled.
- **Open question:** Family profiles, typed mechanical requirements, material taxonomy, standards editions, answer-key authority, and release signer remain unresolved.
- **Risk:** Current exact lookup can yield a unique result after technical facts are dropped or a collision is injected; mutable upserts and display fallbacks can obscure missingness and revision truth.
- **Rejected:** Current projection and frozen v1 are rejected for mechanical acceptance, unique selection, catalog release, supplier/BOM approval, equivalence, suitability, or production-readiness claims.

## Final bounded disposition

- **Evidence — tier 3:** The data-quality proxy supports one defensible next action: test a manual, non-selecting, differences-first candidate packet with actual target users while preserving the original source and explicit unknowns.
- **Fundamental requirement — tier 3:** Human validation must compare whether that packet improves a defensible next action over opening/preserving the source. Qualified mechanical and independent answer-key review remain separate later gates.
- **Rejected — tier 3:** No production edit, `/to-spec` action, mechanical approval, release approval, or human-evidence claim follows from this report.
