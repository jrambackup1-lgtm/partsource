# Mechanical data identity, trust, and confidence

**Date:** 2026-08-09  
**Status:** Wayfinder exploration; decision input, not a production schema or implementation plan.  
**Scope:** Family and configuration discovery, known-identifier routing, local BOM snapshots, and future mechanical categories.  
**Hard boundary:** No equivalence, replacement, approved-alternate, supplier-listing, price, stock, or availability claim.

## Resolution

PartSource should treat trust as a scoped explanation, not a badge.

A user needs to know four different things:

1. Why this record belongs to this family.
2. Why these technical values describe one configuration.
3. Why the submitted identifier routes to that configuration.
4. Which release and review decision the answer came from.

Those statements can have different evidence and different states. One `verified` flag cannot represent them.

The minimum credible POC direction is:

- keep family identity, configuration identity, and identifier mapping separate;
- preserve supplied facts before deriving normalized values;
- make missing, not applicable, not yet normalized, and conflicting values different states;
- publish immutable catalog releases;
- correct or withdraw through a new release rather than mutating history;
- freeze release/configuration/mapping identity into a BOM snapshot;
- show one calm trust explanation near the result and put field detail behind progressive disclosure;
- reserve warning treatment for conflicts, withdrawals, and selection-critical gaps.

The current four-relation bridge remains a reasonable POC direction. It should not be mistaken for sufficient truth semantics. The semantics below can be implemented without first building a universal mechanical ontology.

## Classification language

- **Confirmed** — supported directly by current repository behavior or aggregate inspection of the approved packet.
- **Strong hypothesis** — the best current product/data direction, but not yet proven by user or domain review.
- **Open question** — a decision requires domain judgment, user evidence, or source evidence that is not available.
- **Nice-to-have** — useful after the core truth path works.
- **Rejected** — unsafe, misleading, out of scope, or unjustified for the POC.

## Evidence boundary and method

This audit read the current importer and generators, decoder, catalog API, SQL migrations and search function, Edge Function, detail/BOM flow, source register, product contract, domain language, taxonomy audit, architecture report, synthesis, completion audit, Wayfinder map, and ticket 20.

Aggregate checks were then run locally against the three approved CSV inputs.

No raw rows, private source lineage, local source paths, confidential origin, or record-level values are reproduced here.

### The actual normalizers were traced before counting

This matters because the repository has several incompatible representations of absence.

1. The Supabase importer trims a string and converts only blank or exactly `-` to `null` (`web/scripts/import-catalog-to-supabase.ts:45-48`).
2. The three prototype generators apply the same test but convert absence to an empty string, not `null`.
3. The API adapter converts blank, `-`, or `null` to `Unknown` by default, but converts missing pitch and length to `N/A` (`web/src/lib/catalogApi.ts:115-141`).
4. The fallback decoder uses both `Unknown` and `N/A`. It also derives coarse metric pitch, type, material/finish for selected known series, and a standard from decoded type plus measurement system (`web/src/lib/decoder.ts:156-207, 252-324`).
5. The SQL search trims and lowercases the query. It does not normalize stored units, identifiers by namespace, materials, standards, or dimensional values (`supabase/migrations/20260809_configuration_catalog_contract.sql:74-119`).
6. The database stores most technical values as unconstrained text.

**Confirmed:** A count based only on nonblank CSV cells overstates usable normalized coverage. The clearest example is material: raw rows can contain the dash sentinel, so 47 imported records have `material = null` even though a pre-normalization audit reported 100% material population.

### Aggregate packet facts after the current importer normalizer

| Fact | Aggregate result | Classification |
|---|---:|---|
| Source rows | 27,009 | Confirmed |
| Source SKU populated / unique after trim + case-fold | 27,009 / 27,009 | Confirmed, packet only |
| Known reference populated / unique after trim + case-fold | 26,953 / 26,953 | Confirmed, packet only |
| Missing known reference | 56 (0.2%) | Confirmed |
| Missing thread | 0 | Confirmed |
| Missing length | 0 | Confirmed |
| Missing material | 47 (0.2%) | Confirmed |
| Missing drive style | 56 (0.2%) | Confirmed |
| Missing pitch | 18,275 (67.7%) | Confirmed, but semantically misleading without the thread findings below |
| Missing dedicated finish | 20,256 (75.0%) | Confirmed |
| Missing supplied standard | 4,353 (16.1%) | Confirmed |
| Missing strength after current three-field fallback | 0 | Confirmed, but the combined value is not one coherent quantity |
| Raw blank cells across the packet | 61,353 | Confirmed |
| Raw dash sentinel cells across the packet | 6,480 | Confirmed |
| Other common sentinel strings such as `Unknown` or `N/A` in the packet | none found by the bounded sentinel check | Confirmed for the checked tokens |

These are input-quality observations, not publication approval.

## Current-data failure-mode audit

## 1. Family identity

**Confirmed:** `socket`, `hex`, and `rounded` are file/import buckets. The importer copies the bucket into `family`, derives one `type` for the whole bucket, and the database constraint permits only those three values.

**Confirmed:** The rounded bucket contains at least seven head styles and fourteen drive styles. The socket bucket includes conventional, low, ultra-low, pilot-recess, Torx Plus, and square-drive records. The external-hex bucket contains flange, heavy-hex, and structural records. These differences can change fit, tooling, naming, or selection grammar.

**Confirmed:** The current row ID hashes `file family + source SKU`. Reclassifying a source row into the correct user-facing family therefore changes its identity even if its technical configuration does not change.

**Failure mode:** A source organization decision becomes public product identity.

**Failure mode:** Every row in a bucket inherits a family and type even when family classification has never been reviewed.

**Strong hypothesis:** Family identity should be a reviewed classification decision with explicit inclusion rules, exclusion rules, and exceptions. The source bucket can remain import metadata but must not answer the user-facing family question.

**Strong hypothesis:** The proposed initial families remain a sensible review set:

- conventional Socket Head Cap Screws with internal hex;
- Hexagon Socket Button Head Screws, excluding flange/collar forms;
- Pan Head Machine Screws with drive as a facet, excluding washer assemblies.

The proposed boundaries select 11,973 rows, but that is a candidate pool, not an instruction to publish all 11,973.

**Open question:** Which dimensions and attributes are identity-defining for each family? A domain reviewer must decide this before deduplication or configuration keys are credible.

## 2. Configuration identity

**Confirmed:** The current catalog row is a source-row-shaped object. It simultaneously acts as source record, canonical configuration, identifier record, search document, public DTO, and review/provenance record.

**Confirmed:** A configuration ID is stable only while the import bucket and source SKU remain stable. It is not derived from reviewed family/configuration identity.

**Confirmed:** The importer keeps only a narrow output signature: family/type, thread, pitch, length, descriptive head, material, finish, drive, one combined strength value, and standard. It drops many supplied technical distinctions.

An aggregate collision probe found:

- 1,591 repeated groups under the current imported technical signature;
- 3,502 rows in those groups (13.0% of the packet);
- 1,311 groups / 2,863 rows where omitted supplied technical fields differ;
- the most frequent omitted differences include minimum thread length, full/partial threading, subcategory, reach, head height, compliance flag, hardness, thread direction, thread type, thread fit, head width, and drive size;
- 290 groups / 659 rows are candidate duplicates even under a broader source-technical signature that excludes identifiers and titles.

**Confirmed:** These counts do not prove duplicate products or equivalence. They prove that the current import projection is too lossy to decide.

**Failure mode:** Distinct configurations can look identical after import because an identity-defining field was dropped.

**Failure mode:** Genuine duplicate source rows can remain separate because identity is the source SKU.

**Failure mode:** An upsert mutates the existing row in place. There is no immutable configuration revision or released before-state.

**Strong hypothesis:** Each reviewed family needs a small, explicit identity profile: the fields that create a distinct configuration, the fields that are descriptive, and the fields that are not applicable. Do not invent one universal identity tuple for all mechanical parts.

## 3. Identifier namespaces and routing

**Confirmed:** The current packet is unusually strong for a known-identifier POC path: all 26,953 populated known references are unique after conservative trim and case-fold in this one packet. No current known-reference-to-multiple-import-signature conflict was found.

**Confirmed:** This does not establish global uniqueness across future sources or namespaces.

**Confirmed:** `reference_number` and `source_sku` have no namespace in the current table. Search tries `reference_number` first, then `source_sku`, and each exact branch uses `LIMIT 1`.

**Confirmed:** The public response currently includes both fields. `source_sku` is a private import concept, while the detail page turns it into a visible/source-note and BOM snapshot.

**Failure mode:** The same spelling in two namespaces can collide.

**Failure mode:** A collision can be hidden by the first row returned instead of becoming an `ambiguous` state.

**Failure mode:** Identifier mapping evidence is inseparable from configuration evidence.

**Failure mode:** Correcting an identifier mapping risks changing the apparent identity of a configuration or silently routing old input somewhere else.

**Strong hypothesis:** Identifier normalization must be namespace-specific and conservative. Case-fold only where the namespace permits it. Do not globally remove hyphens, slashes, decimal points, spaces, or unit punctuation.

**Rejected:** An external identifier as the canonical configuration ID or URL.

**Rejected:** Treating two configurations with similar identifiers as equivalent.

## 4. Dimensions, units, fits, and tolerances

**Confirmed:** The packet contains substantially more geometry than the current public catalog projection uses.

| Supplied field | Populated rows | Current import/public treatment |
|---|---:|---|
| Length | 27,009 | Kept as display text only |
| Head height | 27,008 | Dropped |
| Head diameter | 17,685 | Dropped |
| Head width | 8,850 | Dropped |
| Drive size | 15,713 | Dropped |
| Minimum thread length | 6,363 | Dropped |
| Thread fit | 26,938 | Dropped |
| Thread direction | 26,953 | Dropped |
| Full/partial threading field | 27,009 | Dropped |
| Reach | 24,057 | Dropped |

**Confirmed:** Length and primary head dimensions carry explicit inch or millimetre notation. They are still stored as strings. No canonical numeric quantity, unit dimension, conversion status, tolerance, upper/lower bound, or parse status exists.

**Confirmed:** The packet contains 18,232 inch/imperial rows, 8,760 metric rows, and 17 rows not classified by the bounded aggregate check.

**Confirmed:** All 18,232 classified inch/imperial rows have an explicit TPI-like pattern in `thread_size`. 18,193 also have `thread_spacing`. None has `thread_pitch`. By contrast, 8,734 of 8,760 metric rows have `thread_pitch`.

**High-severity current failure:** The importer reports pitch as missing for every imperial row because it reads only `thread_pitch`. The API then renders missing pitch as `N/A`. Pitch/TPI is applicable to these threaded parts and is already encoded elsewhere. `N/A` is false semantics here.

**Failure mode:** Text `ILIKE` filtering can match a substring rather than an engineering quantity. It cannot safely order fractions, convert units, compare ranges, or respect tolerances.

**Failure mode:** A rounded conversion can look exact because the original supplied notation and conversion precision are not retained.

**Failure mode:** Nominal dimension, limit dimension, tolerance class, and thread fit can collapse into one display string or disappear.

**Strong hypothesis:** Preserve the supplied display value and separately create a parsed engineering quantity only after a deterministic parser succeeds. A normalized quantity needs its dimension, unit, exact/rounded status, and any limits/tolerance. A failed parse should be `not-yet-normalized`, not `unknown` and not zero.

**Strong hypothesis:** Thread designation should be parsed as a structured designation appropriate to its system. Metric pitch and imperial TPI are comparable concepts but not interchangeable text fields.

**Open question:** Which supplied dimensions are selection-critical for each proposed family and therefore belong in the first family workspace?

## 5. Standards

**Confirmed:** 22,656 rows (83.9%) have a normalized non-dash `specifications_met` value under the current importer.

**Confirmed:** There are 878 distinct supplied standard strings after only trim and case-fold. There is no dedicated standards organization, designation part, edition/revision, publication date, relationship type, or withdrawal/supersession state.

**Confirmed:** 1,078 aggregate groups share all inspected imported configuration fields except that more than one nonblank standard string occurs. This is not automatically a conflict. It may mean the standard is identity-defining, several standards apply, or the strings need reviewed decomposition.

**Confirmed:** The static decoder can derive a standard from type plus thread system. The source-backed import correctly does not do that. Two runtime paths therefore answer standard provenance differently.

**Failure mode:** A combined string such as several designations can be mistaken for a claim that standards are equivalent.

**Failure mode:** A designation without an edition cannot support a date-specific conformance statement.

**Failure mode:** Missing standards can be silently filled by family or geometry inference in the fallback decoder.

**Strong hypothesis:** Treat a standard reference as a claim with an organization/namespace, designation, optional part/edition, and relationship such as `specified by source`, `family definition`, or `informative reference`. Do not imply that two standards are interchangeable.

**Rejected:** Inferring a missing supplied standard from dimensions, family, identifier, or visual similarity.

## 6. Materials, finishes, and strength

**Confirmed:** The current dedicated finish field is present on 6,753 rows (25.0%). Simple aggregate keyword detection found 9,728 rows where finish is null but the material string appears to include a finish/coating term. This is an opportunity for reviewed decomposition, not permission to auto-fill.

**Confirmed:** There are 49 populated raw material strings and 12 populated raw finish strings (10 after a very basic whitespace/hyphen normalization). Vocabulary size is manageable, but meaning is still mixed.

**Confirmed:** The current `strength` value is a fallback across three different evidence kinds:

- property/grade/class on 5,037 rows;
- tensile-strength text on 20,367 rows;
- hardness text on 1,605 rows.

All 27,009 rows therefore receive a nonblank `strength`, but those values are not one coherent property and should not share one unlabeled comparison axis.

**Failure mode:** Base material, alloy/grade, condition, coating, finish, and performance properties can be fused into one string.

**Failure mode:** Coalescing grade, tensile strength, and hardness hides which quantity was supplied and can make unlike values look comparable.

**Failure mode:** A blank dedicated finish can mean “encoded in a combined material label,” “not supplied,” or “not normalized.” The current model cannot say which.

**Strong hypothesis:** Normalize only through reviewed, reversible rules. Keep the supplied label. Separate base material, grade/class, treatment/coating/finish, and measured or specified mechanical properties when the family needs them.

**Rejected:** Defaulting finish from material, family, standard, or common market practice.

## 7. Supplied versus derived facts

**Confirmed:** Current output mixes supplied and derived fields without preserving the distinction.

| Current output | How it is produced |
|---|---|
| `family` | Derived from input filename/bucket for all 27,009 rows |
| `type` | Derived from bucket for all 27,009 rows |
| `head` | Concatenated from several supplied fields; defaulted for 56 rows |
| `strength` | Coalesced from class, tensile strength, then hardness |
| `prototype`, `demo`, `synthetic` | Forced to true for every imported row |
| `provenance_kind` | Forced to `internal-demo-seed` |
| `verification` | Forced to `demo-only` |
| pitch/standard in fallback decoder | May be derived from hard-coded rules |

**Failure mode:** A user cannot tell a supplied fact from a deterministic conversion, a family rule, a heuristic, or a display default.

**Failure mode:** `synthetic = true` on source-supplied technical records conflates “not a supplier/manufactured-item claim” with “fabricated data.”

**Failure mode:** The derivation algorithm has no visible or frozen version.

**Strong hypothesis:** Origin is a property of each claim, not a quality score. Use explicit meanings such as `supplied`, `derived-deterministic`, `derived-heuristic`, and `user-entered`. A derived value should link conceptually to its inputs and rule version.

**Rejected:** Promoting a heuristic result to a supplied/reviewed fact because it looks plausible.

## 8. Duplicates and conflicts

Duplicates and conflicts are different.

- A **duplicate candidate** means two records may describe the same configuration.
- A **conflict** means evidence for the same scoped claim disagrees.
- A **variant** means the difference is identity-defining inside the family.
- An **identifier collision** means one normalized namespace/value points to more than one target.

**Confirmed:** The current packet has no duplicate populated known references after conservative normalization.

**Confirmed:** The packet still has many technical-signature duplicate candidates and many import-signature collisions caused by omitted fields.

**Confirmed:** The database enforces neither normalized identifier uniqueness nor reviewed configuration uniqueness.

**Failure mode:** Automatic deduplication can destroy real variants.

**Failure mode:** Keeping every source row can inflate results and make one configuration appear several times.

**Failure mode:** `LIMIT 1` can suppress an identifier collision.

**Strong hypothesis:** Duplicate review should show the exact fields that agree, differ, are missing, and were omitted by the current projection. A merge must be a review decision with retained identifier mappings and history.

**Strong hypothesis:** A selection-critical conflict blocks automatic configuration selection and Add to BOM. A noncritical conflict can allow inspection but must remain visible.

**Rejected:** Treating dimensional similarity as equivalence or interchangeability.

**Rejected:** Choosing a “winning” source solely by source priority and deleting the losing assertion.

## 9. Missingness

The product currently uses `null`, empty string, `-`, `Unknown`, and `N/A` for overlapping meanings.

**Confirmed:** The API changes missing pitch and length to `N/A`, while other missing facts become `Unknown`.

**Confirmed:** The family taxonomy audit already warns that missing pitch, finish, or standard must not automatically eliminate a result unless the user explicitly requires the field and the coverage gap is explained.

### Required missingness meanings

These are semantic states, not proposed database columns.

- **Not supplied** — the approved source did not provide an applicable value.
- **Not applicable** — the reviewed family rules say this fact does not apply to this configuration.
- **Not yet normalized** — a supplied value exists, but PartSource has not safely parsed/decomposed it.
- **Withheld/private** — PartSource has evidence but may not publish the value.
- **Conflicting** — applicable evidence disagrees and no release decision resolves it.
- **Not in this release** — the fact or configuration is not part of the active published set.
- **Unknown** — a public umbrella label only when a more precise safe reason is not available.

**Strong hypothesis:** The UI can collapse most noncritical absence to a quiet em dash plus a plain explanation on demand. It must preserve the exact reason internally and in exported snapshots when the reason matters.

**Rejected:** Using `N/A` as a generic fallback for null.

**Rejected:** Treating missing as false, zero, default/coarse pitch, plain finish, or failed match.

## 10. Provenance granularity

**Confirmed:** Provenance is currently one free-text note per source-shaped row plus a broad kind and verification enum.

**Confirmed:** The importer includes the packet filename in the public-returned note. The RPC also returns `source_sku`. Both are too close to private import lineage.

**Confirmed:** The client drops `provenance_kind`, `provenance_note`, `verification`, `demo`, and `synthetic` when converting the result to its `Part` model. It then invents new source notes from result state, title, source SKU, and reference number.

**Confirmed:** There is no separate provenance for:

- family classification;
- each technical claim;
- derived values and rule versions;
- identifier mapping;
- review decision;
- publication release.

**Strong hypothesis:** The POC does not need field-level evidence for every fact on day one. It does need separate public summaries for family classification, configuration facts, and identifier mapping. Private source/import evidence must remain available for review without crossing the public boundary.

**Strong hypothesis:** Field-group provenance is a useful intermediate step: identity/thread, dimensions, material/finish, strength, and standards. Move to per-field assertions only when the triggers later in this report fire.

## 11. Confidence and review

**Confirmed:** `verification` currently allows `unreviewed`, `reviewed-configuration`, or `demo-only`, but all imported rows are forced to `demo-only`.

**Confirmed:** The detail page instead presents `Indexed Catalog` as a positive status and marks every indexed BOM item `verified`. Index presence is not technical review, and configuration review is not equivalence verification.

**Confirmed:** A BOM snapshot’s `verificationRevision` is null on the configuration-detail path.

### Confidence should not be a global score

A single percentage would blend unrelated questions:

- Was the family classification reviewed?
- Was this field supplied or inferred?
- Did validation rules pass?
- Do sources agree?
- Is the identifier mapping exact?
- Is the released record current?

There is no defensible weighting for those dimensions yet.

**Rejected:** A global confidence percentage, star rating, or green `Verified` badge.

**Strong hypothesis:** Use decision-readiness language scoped to the object:

- **Supported** — approved evidence supports the scoped claim, required validations pass, no unresolved selection-critical conflict exists, and the claim is in the active release.
- **Limited** — the released configuration is usable for discovery, but named noncritical facts are missing or not normalized.
- **Candidate** — classification or technical interpretation remains heuristic/unreviewed; do not auto-select or present as BOM-ready.
- **Blocked** — a selection-critical conflict, invalid combination, permission problem, or withdrawal prevents use.

“Supported” never means manufactured, stocked, equivalent, approved for use, or supplier-verified.

### Review levels

- **Unreviewed** — imported or derived, no recorded validation decision.
- **Rules checked** — deterministic schema/range/collision tests passed; not a human technical review.
- **Reviewed for scope** — a named review process accepted the claim for a defined family/release scope.
- **Contested** — correction/conflict evidence exists and a decision is pending.
- **Blocked** — it cannot be released under current evidence or permission.

A review statement must say what was reviewed. “Configuration facts reviewed” and “identifier mapping reviewed” are valid separate statements. “Verified part” is not.

## 12. Correction, release, supersession, and withdrawal

**Confirmed:** The current importer upserts by mutable source-derived ID. There is no catalog release identity, immutable configuration revision, correction decision, supersession, withdrawal, or catalog rollback in the data path.

**Confirmed:** Frontend `release.json` identifies a frontend build SHA, not the catalog facts returned by Supabase.

### Concrete lifecycle semantics

These are product semantics, not a production schema.

1. **Draft** — private working data; never routable publicly.
2. **Released** — immutable public facts for one catalog release.
3. **Superseded** — a later revision is current, but the old revision remains interpretable for old links/BOM snapshots.
4. **Withdrawn** — unsafe, unsupported, permission-blocked, or identity-invalid. It is removed from browse/selection, but exact lookup can return a bounded withdrawal explanation.
5. **Rejected correction** — proposed evidence did not change released truth; retain the review decision privately.

### Correction rules

- Formatting, spelling, or public wording corrections can preserve configuration identity while creating a new released revision.
- A corrected technical value can also preserve identity if the old value was simply wrong and the reviewed real-world configuration is still the same.
- If one old row actually combined two variants, split it into distinct configurations. Do not rewrite the old identity to mean one arbitrary child.
- If two records are reviewed as duplicate descriptions of one configuration, merge through a release decision while preserving both permitted identifiers and the old routing history.
- An identifier remap is a mapping correction, not a configuration mutation.
- A released identifier that becomes ambiguous or wrong must not silently route to a new target.

### Withdrawal behavior

- Remove the configuration from normal browse and selection in the new release.
- Exact identifier lookup returns `withdrawn`, a safe public reason, family context when still valid, and no supplier handoff.
- Do not redirect to a nearby configuration.
- Preserve previous release/revision identity so a saved BOM still says what the user selected.

**Rejected:** In-place mutation of released truth.

**Rejected:** Silent identifier remapping or nearest-configuration fallback after withdrawal.

## 13. BOM snapshots

**Confirmed:** The current BOM correctly deep-copies rendered configuration facts and supplier destinations into browser-local storage. Catalog refreshes do not rewrite the displayed snapshot.

**Confirmed:** The snapshot does not carry a catalog release ID, stable public family/configuration key, configuration revision, identifier namespace/mapping revision, derivation version, or meaningful review revision.

**Confirmed:** The snapshot may preserve reconstructed source notes and a private source SKU. It also labels indexed rows as verified.

### Minimum future snapshot semantics

A frozen BOM line should preserve:

- public family and configuration identity;
- catalog release and configuration revision/digest;
- submitted input;
- matched identifier namespace/value when display is permitted;
- identifier-routing state/revision;
- displayed technical facts, units, tolerances, and meaningful missingness states;
- public-safe provenance/review summary;
- supplier-search destination and recipe/template revision;
- save time;
- user quantity, notes, and user-entered cost.

It should not preserve private source lineage, raw payloads, source filenames, permission evidence, or internal reviewer notes.

A later visit may say `A newer catalog correction is available`, but must never rewrite the saved line. The user can explicitly compare and add a new snapshot.

**Strong hypothesis:** Release-aware BOM snapshots are a visible trust advantage because they answer “what did I base this decision on?” without claiming that the BOM is an approved engineering record.

## Product-facing truth-state contract

The following semantics should guide later design. They deliberately avoid a production schema.

### A. Family result states

| State | Meaning | Allowed behavior |
|---|---|---|
| `reviewed-family` | Inclusion/exclusion rules were reviewed for this release. | Browse and configure. |
| `candidate-family` | Search interpretation suggests a family, but classification/coverage is not release-ready. | Show as a suggestion; no auto-selection. |
| `ambiguous-family` | More than one family remains plausible. | Show bounded choices and preserved constraints. |
| `unclassified` | PartSource cannot safely assign a family. | Explain unsupported coverage; do not invent a configuration. |
| `withdrawn-family` | Previously released family is no longer supported. | Historical explanation only. |

### B. Configuration result states

| State | Meaning | Allowed behavior |
|---|---|---|
| `released-configuration` | One immutable configuration revision is in the active release and has no unresolved selection-critical conflict. | Inspect; BOM/supplier search only after unique selection. |
| `limited-configuration` | Released for discovery with named noncritical gaps. | Inspect and possibly select if family rules say the gaps are noncritical; show limitations. |
| `candidate-configuration` | Parsed/derived/unreviewed or not in the release. | Compare/request review; no BOM-ready claim. |
| `conflicted-configuration` | Evidence disagrees on a selection-critical fact. | Inspect conflict; no auto-select, BOM, or supplier action. |
| `invalid-combination` | Reviewed family rules reject the combination. | Explain which constraint fails. |
| `not-indexed` | The combination may be valid, but no released record exists. | Do not show a generated product-like record as if indexed. |
| `withdrawn-configuration` | Previously released record was removed. | Historical explanation; no substitute. |

### C. Identifier result states

| State | Meaning | Allowed behavior |
|---|---|---|
| `exact` | One active reviewed namespace/value mapping resolves to one released configuration. | Open its family with that configuration selected. |
| `ambiguous` | More than one reviewed target/namespace is possible. | Show bounded choices; never choose first. |
| `not-found` | No active mapping exists. | Continue to generic intent search without calling it an identifier match. |
| `malformed` | It violates the selected/detected namespace grammar. | Ask for correction. |
| `withdrawn` | A previous mapping is no longer active. | Explain; never reroute silently. |
| `blocked` | Permission or review state prevents public resolution. | Fail closed. |

### D. Claim origin and review

Every user-visible fact should be explainable through two independent questions:

1. **Origin:** supplied, deterministic derivation, heuristic derivation, or user-entered.
2. **Review:** unreviewed, rules checked, reviewed for scope, contested, or blocked.

A deterministic unit conversion can be derived and reviewed. A directly supplied value can still be unreviewed or conflicting. Origin is not confidence.

## Making provenance a visible product advantage without badge clutter

Trust should reduce work, not add a wall of compliance labels.

### 1. Put one sentence under identity

Example:

> Mapped directly from a known identifier. Configuration facts are released and reviewed for PartSource discovery. Pitch is represented as 20 TPI; finish was not supplied.

This answers routing, configuration state, and the material gap without three badges.

For a generic search:

> Family chosen from your words “socket head”; M4 was kept as a required thread constraint. No configuration is selected yet.

### 2. Use a small “Why this result” disclosure

Two rows are enough at first:

- **Identifier mapping:** exact / ambiguous / not used.
- **Configuration evidence:** supported / limited / candidate, release date or release label.

An expanded view can show field groups, derivations, review dates, and limitations. It must never expose confidential origin.

### 3. Let the specification table carry quiet truth

- Supplied, reviewed values appear normally.
- Deterministic conversions use muted text such as `converted from 1/2 in`.
- Unknown values show an em dash plus a reason on focus/expand.
- Not-applicable facts are omitted or explicitly say `Not applicable` only where the family rule supports it.
- Conflicting selection-critical values receive the rare warning treatment.

Do not put a provenance badge on every cell.

### 4. Show coverage in task language

Prefer:

> Enough reviewed data to choose thread, length, drive, and material. Finish is not supplied.

Avoid:

> 82% confidence.

A compact completeness count is acceptable only against the selected family’s reviewed required-field list, not against every possible column.

### 5. Explain derivations where they matter

A user should be able to inspect:

> Pitch: 20 TPI — parsed from the supplied thread designation by parser v2.

This can be more useful than a generic “trusted source” badge because it lets an engineer audit the transformation.

### 6. Make release identity calm but durable

A small footer or evidence line can say:

> Catalog release 2026-08-09. Saved BOM snapshots keep this release.

Only show an interruption when a newer correction or withdrawal affects the viewed/saved item.

### 7. Turn conflicts and corrections into credibility

A product that says:

> Two permitted records disagree on head height. This configuration is held from selection while reviewed.

is more trustworthy than one that silently picks a value.

### Badge budget

- No positive badge for “indexed.”
- No universal “verified” badge.
- At most one compact result-state treatment near identity.
- Use plain sentences for normal provenance.
- Use strong warning styling only for conflict, withdrawal, permission block, or selection-critical missingness.

## High-value data opportunities

## Priority 0 — required to make the POC credible

### 1. Repair missingness and review state end to end — **Confirmed need**

Stop converting applicable missing pitch to `N/A`. Preserve configuration review and identifier-mapping state through API, detail, and BOM. Remove `Indexed Catalog` and generic `verified` semantics.

**Value:** Prevents the UI from making false confidence claims with data already present.

### 2. Curate a small family release — **Strong hypothesis**

Review the three proposed boundaries, define identity fields and exceptions, and publish only the reviewed subset.

**Value:** Converts ingestion buckets into a useful product taxonomy without boiling the ocean.

### 3. Recover high-value supplied dimensions — **Confirmed opportunity**

Prioritize thread designation/system, full/partial threading, fit, head dimensions, drive size, and minimum thread length according to family selection needs.

**Value:** Differentiates PartSource from a thin title/identifier lookup and prevents current projection collisions.

### 4. Introduce release-aware truth — **Confirmed need**

Give every public answer one catalog release identity. Freeze it into BOM snapshots. Define correction and withdrawal before the first public family release.

**Value:** Makes answers reproducible and corrections honest.

### 5. Build a duplicate/collision review queue — **Confirmed opportunity**

Start with the 1,311 import-signature groups where omitted supplied fields differ and the 290 broader duplicate-candidate groups. Show differences; do not auto-merge.

**Value:** Improves result density and identity credibility while exposing which omitted fields actually matter.

### 6. Separate exact identifier evidence from configuration evidence — **Confirmed need**

Namespace exact lookup, return ambiguity instead of first row, and never expose a private source SKU as provenance.

**Value:** Known-identifier routing is the strongest current path and can become the clearest trust moment.

## Priority 1 — high leverage after the first reviewed release

### 7. Reviewed material/finish decomposition — **Strong hypothesis**

Create reversible rules for the bounded vocabulary. Hold ambiguous combined strings as `not-yet-normalized`.

**Value:** Could recover useful finish coverage from many of the 9,728 likely combined labels without inventing defaults.

### 8. Standards reference cleanup — **Strong hypothesis**

Separate multiple designations and relationship types. Capture editions only when evidence supplies them. Never present designation pairs as equivalence.

**Value:** Standards-first discovery becomes inspectable rather than a free-text filter.

### 9. Field-group evidence and limitations — **Strong hypothesis**

Track identity/thread, dimensions, material/finish, strength, and standards as separate evidence groups before investing in every-field lineage.

**Value:** Supports clear public explanations and targeted review at moderate complexity.

### 10. Correction intake with release context — **Strong hypothesis**

A report action should carry only safe public configuration/release identity and the disputed field. User evidence is optional and private.

**Value:** Creates a data-quality flywheel and demonstrates that PartSource maintains truth rather than merely indexing it.

### 11. Coverage-aware search — **Strong hypothesis**

When a user requires a field the release does not contain, distinguish `no matching configuration` from `catalog cannot evaluate this constraint`.

**Value:** Honest missingness becomes useful search guidance rather than empty results.

## Priority 2 — later advantages

### 12. Geometry/drawing evidence — **Nice-to-have**

Reviewed drawings or geometry can disambiguate styles and dimensions. Do not use the current generic schematic as evidence or call it 1:1 CAD.

### 13. Source comparison view — **Nice-to-have after multiple sources**

Show agreement and conflict by field group to reviewers, with a public-safe summary for users.

### 14. Confidence analytics — **Nice-to-have**

Measure how often users expand evidence, encounter gaps, report corrections, or abandon on conflict. Do not log raw BOM/query contents.

### 15. Automated anomaly detection — **Nice-to-have**

Flag impossible ranges, unit outliers, and unusual family combinations for review. It must not publish corrections automatically.

## Migration triggers, not an up-front platform

The four-relation POC bridge can stay small until a concrete trigger fires.

| Trigger | Required migration in truth capability | Why |
|---|---|---|
| Before a second independent source overlaps a released family, or at the first overlapping field conflict | Add claim/field-group evidence and adjudication history | Row-level provenance cannot preserve disagreement. |
| Before the first released technical correction must remain interpretable in an old BOM | Add immutable configuration revision identity | Whole-row mutation breaks snapshots. |
| Before the first public catalog release | Add atomic release identity and withdrawal behavior | Search/detail/BOM must agree on one fact set. |
| At the first identifier collision, or before a second external identifier namespace is published | Add namespace-specific mapping lifecycle and ambiguity | `LIMIT 1` is unsafe. |
| Before numeric range filtering, cross-unit comparison, tolerance filtering, or a family mixing measurement systems | Add typed quantities, units, parse status, and tolerance semantics | Text matching cannot protect engineering meaning. |
| Before standards edition affects inclusion, or more than one edition is active/relevant | Add reviewed standards/edition relationships | A designation string is insufficient. |
| Before material/finish becomes a hard compatibility filter | Add reviewed decomposition and explicit unknown/not-normalized states | Combined labels and defaults can cause false exclusions. |
| If more than 5% of staged configurations have evidence conflicts for two consecutive releases, or more than three independent sources contribute to a family | Move from field-group to field-level assertions/evidence | Conflict volume justifies finer granularity. |
| If more than six materially different families are published and identity/facet rules repeatedly diverge | Add governed family attribute definitions or typed family extensions | Hard-coded shared columns stop being clear. |
| If more than 25 families are published and over 40% of attributes are family-specific, or more than 30 promoted columns would be mostly null | Revisit the richer taxonomy model | This matches the architecture stress signal; do not jump directly to generic EAV. |
| When manufacturer parts or supplier listings become approved scope | Introduce those identities separately from configurations | A standards configuration still does not prove manufacture/listing. |

**Rejected now:** A universal EAV/unit ontology, knowledge graph, or source-assertion system for every possible mechanical fact before the family POC is validated.

## Future-category stress test

The POC should avoid fastener-only mistakes while not modeling every category now.

### Bearings — **Strong future test**

Identity may depend on bearing type, boundary dimensions, internal clearance, precision class, seals/shields, cage/material, load ratings, and manufacturer series. A standard designation alone may not define a stocked/manufactured part.

**Trigger:** Introduce rating conditions and manufacturer-part identity before publishing load-based compatibility claims.

### O-rings and seals — **Strong future test**

Nominal geometry, actual tolerance, compound, hardness, temperature/media compatibility, and certification can all matter. “Rubber” is not a sufficient material identity.

**Trigger:** Add property conditions and range/tolerance semantics before service-condition filtering.

### Springs — **Strong future test**

Free length alone is insufficient. Wire diameter, OD/ID, rate, load at length, travel, ends, direction, material, and tolerance may define the configuration.

**Trigger:** Add dependent properties and test conditions before claiming load/rate matching.

### Gears — **Strong future test**

Module or diametral pitch, tooth count, pressure angle, helix, face width, bore/keyway, quality, and handedness interact.

**Trigger:** Add family-specific validity rules before generic faceting can auto-select a configuration.

### Fittings and fluid components — **Strong future test**

Thread standard, nominal tube/pipe size, gender, orientation, material, seal method, pressure rating, temperature, and certification are conditional facts.

**Trigger:** Add standards edition, rating conditions, and connection-end identity before compatibility search.

### Pins, inserts, washers, and retaining hardware — **Open question**

These may be reasonable nearer-term categories, but current authority says pins are unsupported. Category expansion needs a reviewed family identity profile and source coverage; it must not inherit screw fields or sentinels.

### Cross-category lesson

A future-proof claim needs:

- a subject with stable identity;
- a family-specific definition of what distinguishes a configuration;
- values with units, ranges/tolerances, and applicability;
- supplied versus derived origin;
- scoped evidence/review;
- immutable release context.

That is enough direction. It does not require one universal production schema now.

## Decision register

### Confirmed

- Family, configuration, and identifier are different identities.
- The three files are not three safe public families.
- The current row ID is source-bucket/source-SKU identity, not canonical configuration identity.
- Current identifier coverage is strong and unique inside this packet, but no durable namespace rule exists.
- Current imported technical signatures collapse differences present in omitted technical fields.
- Imperial pitch/TPI is misrepresented as `N/A` by the current importer/API path.
- Important dimensions, fit, threading, and drive details are supplied but dropped.
- Standards have good aggregate coverage but no edition or relationship semantics.
- Material, finish, grade/class, tensile strength, and hardness are not normalized into coherent claim types.
- Provenance is too coarse privately and too leaky publicly, then is dropped by the client.
- `Indexed Catalog` and BOM `verified` are not valid confidence semantics.
- There is no catalog release, correction, revision, or withdrawal lifecycle.
- BOM values are frozen, but their catalog/configuration/mapping identity is not.
- Current conflict prevalence across independent sources cannot be measured because there is only one approved packet in scope.
- Equivalence is excluded.

### Strong hypotheses

- Publish a small reviewed family subset rather than all candidate rows.
- Define identity-critical fields per family.
- Use separate family, configuration, and identifier trust explanations.
- Use scoped readiness (`supported`, `limited`, `candidate`, `blocked`) instead of a global score.
- Preserve supplied display values beside typed, versioned derivations.
- Start provenance at field-group level and migrate to per-field assertions on evidence triggers.
- Treat release-aware corrections and BOM snapshots as a visible product advantage.
- Use calm evidence sentences and disclosures; reserve warning styling for real blockers.

### Open questions

- Are the three proposed family names and boundaries correct in target-user language?
- Which fields define identity versus description in each family?
- Can classification be reviewed by rules plus exception groups, or must every row be reviewed?
- Which missing fields are selection-critical for the first release?
- What do the 290 broader duplicate-candidate groups represent after domain review?
- How should the 878 standard strings be decomposed without implying equivalence?
- Which material labels can be reversibly split into base material, grade, and finish?
- Does visible lineage improve task confidence and correction behavior in user tests?
- What public review date/granularity is useful without exposing confidential lineage?
- Is neutral supplier search still useful after the trust explanation makes limitations clearer?

### Nice-to-have

- Reviewer source-comparison tooling after a second source.
- Reviewed drawings/geometry.
- Anomaly detection and richer correction analytics.
- Per-field evidence where conflict volume justifies it.
- A user-facing release change log for material corrections and withdrawals.

### Rejected

- One `verified` badge or confidence percentage.
- `Indexed` as a proxy for evidence.
- External identifier or source SKU as canonical configuration identity.
- File bucket as user-facing family identity.
- Null or absent as generic `N/A`.
- Automatic standards, pitch, material, or finish defaults presented as supplied truth.
- Text-substring dimensional comparison as engineering equality.
- Automatic deduplication, silent conflict winners, or `LIMIT 1` collision handling.
- Silent correction, remap, substitution, or withdrawal fallback.
- Dimensional similarity as equivalence.
- A universal EAV/knowledge-graph model for the POC.

## Major blockers

1. **No approved family identity profiles.** The three proposed families and their identity-critical fields still need mechanical-domain review.
2. **No reviewed normalization rules.** Thread parsing, unit conversion, material/finish decomposition, standard decomposition, and tolerance semantics are not release decisions yet.
3. **Lossy current projection.** At least 1,311 repeated imported-signature groups contain differing omitted technical fields. Publication cannot assume those rows are duplicates.
4. **No independent-source overlap.** Source agreement/conflict rates and source-confidence policies cannot be validated from one approved packet.
5. **No release/correction/withdrawal mechanism.** Current upserts cannot preserve what an old result or BOM meant.
6. **No stable public configuration revision in BOM.** Snapshots preserve rendered strings but cannot be compared safely with a correction.
7. **Public/private provenance boundary is not clean.** Current DTOs expose source-row concepts/free text while the client drops authoritative review fields.
8. **Trust UX is untested.** The proposed low-clutter evidence treatment has not been measured with engineers or buyers.
9. **Standards editions and source granularity are absent.** The current packet can support a supplied standard filter, but not date-specific or conformance-depth claims.
10. **Current product states are misleading.** Applicable imperial pitch becomes `N/A`, and indexed configurations become `verified` BOM lines.

## Evidence map

- `CONTEXT.md:3-67` — family, configuration, identifier, provenance, trust, and BOM snapshot language.
- `research/product-contract.md:63-121` — truth boundaries, result states, source/claim limits, and no equivalence.
- `research/data-source-register.md:3-46` — approved packet, private lineage, allowed fields, and source gate.
- `web/scripts/import-catalog-to-supabase.ts:39-117, 120-169` — bucket families, normalizer, derived fields, source-SKU ID, and mutable upsert.
- `web/src/lib/decoder.ts:95-207, 252-324, 327-463` — sentinels, derivations, and separate generated standards catalog.
- `web/src/lib/catalogApi.ts:3-27, 115-149` — API result fields, fallback sentinels, and dropped provenance/review state.
- `supabase/migrations/20260805_catalog.sql:5-38` and `20260809_configuration_catalog_contract.sql:1-123` — flat text model, enums/defaults, exact lookup, and `LIMIT 1`.
- `supabase/functions/catalog-search/index.ts:13-135` — public filter/API boundary.
- `web/src/pages/PartDetail.tsx:214-243, 280-340, 413-473` — exact lookup, reconstructed source notes, indexed badge, and BOM verification conflation.
- `web/src/lib/bomStorage.ts:6-39, 129-240` — current frozen snapshot and verification language.
- `research/poc-family-taxonomy-audit-2026-08-09.md` — family boundaries and earlier aggregate coverage.
- `research/poc-family-search-architecture-2026-08-09.md` — identity separation, publication lifecycle, and architecture stress triggers.
- `research/product-frontier-synthesis-2026-08-09.md` — four-relation bridge decision and POC boundary.

Aggregate counts in this report were recomputed locally after applying the importer’s actual blank/dash normalizer. They are structural evidence only and do not publish raw/private rows or source lineage.
