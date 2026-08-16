# Validation of the bounded mechanical-data model

**Date:** 2026-08-09  
**Status:** Validation-gate report. Candidate mechanical profiles only; no family, field rule, normalization, row, or release is mechanically approved.  
**Scope:** The approved private fastener packet, current importer/API/SQL path, proposed public family/configuration/identifier/release bridge, and one conceptual O-ring stress test.  
**Boundary:** No private rows or source identity are reproduced. No equivalence, suitability, listing, price, stock, availability, or standards-equivalence claim is made.

## Terse verdict

- **Strong hypothesis:** Keep the four public relations for the bounded POC, but only as an append-only, release-stamped serving projection. They are containers for reviewed family-specific truth, not the truth model by themselves.
- **Risk:** The current flat imported rows cannot be renamed and published. They lose identity-relevant fields, misstate imperial TPI as `N/A`, mix strength concepts, fuse material and finish, have no correction lifecycle, and mutate in place.
- **Fundamental requirement:** No current row is publishable as-is. The 11,973 rows inside the three proposed boundaries are curation candidates only. Publication requires approved family profiles, full-field re-projection, collision review, namespace-aware mapping review, and an immutable release.
- **Strong hypothesis:** A credible first release can stay metric-only and small: three reviewed families, about 150 deliberately selected configurations, reviewed exact mappings, one release manifest, one rollback target, and a 100–150-case truth corpus. This is a working floor, not a mechanically approved threshold.

## Evidence and method

- **Evidence:** The importer was traced before aggregation. It trims supplied strings and changes only blank or exactly `-` to `null`. It imports family/type, reference, private source key, title, thread, metric-style pitch, length, a concatenated head label, material, finish, drive, one coalesced strength string, and standard. It drops supplied head dimensions, drive size, thread type/fit/direction, threading extent, minimum thread length, reach, and other fields (`web/scripts/import-catalog-to-supabase.ts:39-117`).
- **Evidence:** The API later turns blank, dash, or null into `Unknown`, except absent pitch and length become `N/A`. The fallback decoder can derive pitch, material/finish, type, and standard under separate rules. Missingness and origin therefore change by runtime path (`research/mechanical-data-trust-opportunities-2026-08-09.md:50-61`).
- **Evidence:** The packet contains 27,009 rows. After the importer normalizer: 56 known references, 47 materials, 56 drives, 18,275 dedicated pitch values, 20,256 dedicated finishes, and 4,353 supplied standards are missing. Blank and dash are the packet’s observed missing sentinels; no checked `Unknown`/`N/A` token was found in the packet.
- **Evidence:** The source files expose 28–29 technical columns. The public import retains only a narrow subset and stores engineering quantities as text.
- **Evidence:** The three candidate family rules select 6,707 conventional socket-head/internal-hex rows, 2,050 plain button-head/internal-hex rows, and 3,216 pan-head Phillips/slotted rows: 11,973 total. These are disjoint boundary candidates, not canonical configurations or approved release records.
- **Evidence:** The candidate pools contain 3,938 metric rows: 2,182 socket head, 712 button head, and 1,044 pan head. This is ample staging coverage for a small metric-only review without publishing the full packet.
- **Evidence:** Aggregate calculations used only the approved local packet and the importer’s actual blank/dash rule. They did not import blocked evidence, expose raw rows, or establish mechanical correctness.

## Challenge to the four public objects

| Object | Candidate bounded meaning | Minimum fields/behavior | Challenge |
|---|---|---|---|
| Family | One reviewed functional type with one reviewed selection schema in one release | Stable opaque `family_key`; release ID; revision/digest; name/slug; inclusion and exclusion summary; schema/rule version; required axes; public-safe review state | **Risk:** A name plus JSON does not establish a family. Bucket, head shape, and drive labels can hide fit/tooling/geometry changes. Family rules and exceptions need mechanical review. |
| Configuration | One reviewed combination under one family profile, represented immutably in a release | Stable opaque `configuration_key`; configuration revision/digest; family key; supplied display values; typed promoted values; bounded family attributes; missingness/applicability; field-group evidence summary; release state | **Risk:** A source row is not automatically a configuration. A universal tuple either drops distinctions or makes mostly-null fastener fields appear universal. |
| Identifier | One namespace-specific lookup mapping, not product identity | Namespace; permitted display value; namespace-normalized key; mapping state; target configuration key/revision; mapping revision/digest; release ID | **Risk:** Global case-folding or punctuation removal can collide namespaces. `LIMIT 1` hides ambiguity. A corrected mapping must not mutate configuration identity. |
| Release | One immutable public manifest of reviewed family, configuration, and mapping versions | Opaque release ID; manifest digest; publication time; parent release; schema/parser/normalizer versions; public review scope; content state; atomic active pointer/serving decision | **Risk:** A date or frontend build SHA is not release identity. Every search/detail/BOM response must carry the same catalog release ID. |

- **Fundamental requirement:** Use composite release membership such as `(release_id, family_key)`, `(release_id, configuration_key)`, and `(release_id, namespace, normalized_identifier)`. Released content is immutable even if the operational active pointer changes.
- **Fundamental requirement:** Keep a stable logical key and a separate immutable revision/digest. A corrected value can retain the logical key only when review says it is the same real-world configuration. A split creates child keys; a merge retains all permitted identifier history; neither silently changes an old key’s meaning.
- **Fundamental requirement:** The public four-relation bridge depends on private immutable source payload hashes, permission state, normalization version, review decisions, and evidence links. Private evidence need not become a fifth public relation, but “raw files somewhere” is inadequate.
- **Strong hypothesis:** Duplicate complete serving rows per release. At this scale, whole-release copying is simpler and safer than temporal joins or a revision graph.
- **Risk:** Family aliases and supplier-query templates can remain versioned code/config only if their bundle digest is included in the release and old BOM meaning does not depend on mutable code.
- **Rejected:** Mutable master rows with a release label added afterward.
- **Rejected:** External references, private source keys, titles, or import buckets as configuration identity.
- **Rejected:** One shared fastener tuple presented as a general mechanical schema.

## Candidate fastener identity grammar — shared core, not approved

- **Strong hypothesis:** A conservative pre-review configuration fingerprint should include every supplied distinction that could affect selection. Review may later mark a field descriptive or derived; it must not remove it before collision inspection.
- **Strong hypothesis:** Represent thread as a structured designation, not one pitch string:
  - system and thread series/type;
  - supplied designation;
  - nominal diameter;
  - metric pitch **or** imperial TPI, never both as the same property;
  - direction;
  - fit/tolerance class;
  - supplied coarse/fine label as a separate classification, not a numeric substitute.
- **Strong hypothesis:** Represent length as value, unit, supplied display, and family-reviewed measurement datum. Do not assume that all future head styles measure length from the same datum.
- **Strong hypothesis:** Represent threading extent as full/partial plus minimum thread length when partial. Do not collapse extent into overall length.
- **Strong hypothesis:** Preserve head dimensions and drive size as typed dimensions plus supplied display. Until tolerances are supplied and reviewed, label them nominal/unspecified rather than exact limits.
- **Strong hypothesis:** Keep these strength concepts separate: property class/grade, tensile strength with units and basis when known, and hardness with scale. A configuration may have one or several; none may be coalesced into generic `strength`.
- **Strong hypothesis:** Keep base material/alloy/grade/condition separate from coating/treatment/finish. Preserve the combined supplied label until a reviewed split exists.
- **Strong hypothesis:** Represent standards as claims: organization/namespace, designation/part, optional edition, relationship, supplied display. Multiple designations are not an equivalence assertion.

## Candidate family profiles — explicitly not approved

### Socket Head Cap Screws

- **Strong hypothesis:** Candidate boundary: conventional cylindrical/standard socket-head profile with internal hex drive.
- **Rejected:** Quietly including low, ultra-low, high, pilot-recess, Torx Plus, or square-drive records in this family. Those forms change geometry, tooling, or terminology and need separate reviewed treatment.
- **Strong hypothesis:** Conservative configuration identity fields:
  1. family/profile;
  2. structured thread designation, direction, and fit;
  3. length and reviewed datum;
  4. full/partial threading and minimum thread length when partial;
  5. head diameter and height;
  6. internal-hex drive and drive size;
  7. material/alloy/condition;
  8. finish/coating/treatment;
  9. each supplied strength concept;
  10. supplied standards claim set.
- **Fundamental requirement:** For a supported selectable record, family membership, thread diameter, pitch/TPI, length, threading extent, direction, fit, head dimensions, drive size, material state, finish state, and typed strength state must be explicit and reviewed. Standard state must be explicit; an absent standard cannot be inferred.
- **Risk:** The candidate pool has no dedicated finish values. Some finish information may be embedded in material labels. Therefore none of the 6,707 rows can satisfy this profile from the current projection alone.
- **Open question:** Whether a supplied head dimension or standard claim is identity-defining, a validation constraint, or descriptive for each standards-defined subset requires mechanical review.

### Hexagon Socket Button Head Screws

- **Strong hypothesis:** Candidate boundary: button head plus internal hex, excluding flange/collar forms.
- **Rejected:** Including title-marked flange/collar forms or ISO 7380-2-marked flange forms in the plain button-head family merely because the drive is internal hex.
- **Strong hypothesis:** Conservative configuration identity fields are the shared screw core plus rounded-head profile, button style, head diameter/height, internal-hex drive size, and explicit flange absence under a reviewed rule.
- **Fundamental requirement:** The same thread, length, threading, fit/direction, geometry, drive-size, material/finish, typed-strength, standard-state, evidence, and release requirements apply. `flange = false` must be a reviewed family rule, not absence inferred from a missing word.
- **Risk:** Of 2,625 raw button/internal-hex rows, 575 are excluded by the current flange-marked boundary, leaving 2,050 curation candidates. This rule is evidence of a boundary problem, not domain approval of every remaining row.
- **Open question:** Whether rounded-head profile values inside the remaining button group represent configuration variants or separate families needs review.

### Pan Head Machine Screws

- **Strong hypothesis:** Candidate boundary: machine-thread pan head, initially Phillips or slotted drive, excluding washer assemblies.
- **Rejected:** Treating the entire rounded-head bucket as this family or including washer assemblies because their visible screw head is pan-shaped.
- **Strong hypothesis:** Conservative configuration identity fields are the shared screw core plus pan-head profile, head diameter/height, exact drive style, and drive size. Phillips versus slotted is a variant distinction inside the candidate family, not a synonym.
- **Fundamental requirement:** Washer-assembly absence, drive style, and drive size must be supported. A generic `Pan Head` record is not uniquely selectable when tooling remains unresolved.
- **Risk:** The initial pan/Phillips-or-slotted group contains 487 washer-marked records, including a large standards-marked assembly subset. After exclusion, 3,216 rows remain curation candidates. The current source projection still omits drive size on many pan candidates.
- **Open question:** Target-user and mechanical review must decide whether Phillips and slotted belong in one workspace with drive as an axis or in separate families.

## Required-field and missingness profile

| Field group | Supported/selectable candidate | Limited discovery candidate | Blocked/candidate-only |
|---|---|---|---|
| Family | Reviewed boundary and exception rule | Not applicable | Bucket/heuristic classification only |
| Thread | System, diameter, pitch or TPI, direction, fit/type parsed and reviewed | Noncritical display gap only if the family reviewer permits it | Missing pitch/TPI, failed parse, conflicting designation, or guessed coarse pitch |
| Length/threading | Typed length and datum; extent; minimum thread length when partial | Tolerance absent but explicitly described as not supplied, if nominal discovery is allowed | Missing/ambiguous datum, partial thread with unresolved minimum where identity depends on it |
| Head/drive | Reviewed style/profile; dimensions; drive style and size | Named noncritical nominal-dimension limitation only if approved | Missing style/size, flange/assembly uncertainty, or conflicting dimensions |
| Material/finish | Reviewed base material/grade/condition and finish/treatment, or an approved explicit no-finish state | `not supplied`/`not yet normalized` only if the reviewer says selection remains safe for discovery | Fused label that could hide a variant, inferred/default finish, or conflict |
| Strength | Separate reviewed class/grade, tensile, and hardness claims; no false comparison | Named absent concept where another approved descriptor is sufficient | Generic coalesced strength, unknown scale/unit, or conflict |
| Standards | Structured supplied claim or explicit `not supplied`; relationship and edition limits shown | Missing edition when edition is not release-critical | Inferred designation, unexplained multi-standard string, or equivalence implication |
| Evidence/release | Field-group origin/review, configuration digest, mapping state, release ID | Named public-safe limitations | Private-lineage leak, `Indexed`/`Verified` shortcut, mutable or unreleased record |

- **Fundamental requirement:** Preserve these different states: `not supplied`, `not applicable`, `not yet normalized`, `withheld/private`, `conflicting`, `not in this release`, and `withdrawn`. `null`, `Unknown`, and `N/A` are not interchangeable.
- **Risk:** “Required field” must mean required for a defined family and release task. It must not imply application suitability. Environmental, load, certification, and installation requirements remain outside a catalog configuration unless separately supplied and approved.
- **Open question:** Mechanical review must decide which gaps block all selection versus only a query that explicitly requires the missing field.

## Metric, imperial, pitch/TPI, and dimensions

- **Evidence:** The packet contains 18,232 classified imperial rows, 8,760 metric rows, and 17 not classified by the bounded check. All classified imperial rows carry a TPI-like designation in the supplied thread field, while the importer reads only `thread_pitch`; public imperial pitch therefore becomes false `N/A` semantics.
- **Fundamental requirement:** Use mutually explicit representations: `pitch_mm` for metric threads and `threads_per_inch` for imperial threads. Keep the complete supplied designation and thread series/type.
- **Fundamental requirement:** A `coarse`, `fine`, or `extra fine` label is not a numeric pitch/TPI value. It can support classification but cannot fill a missing number.
- **Strong hypothesis:** A metric-only first release is safer. Select only rows with supplied metric pitch and parseable metric dimensions. Keep all imperial rows private until the TPI/fraction grammar, fit semantics, display, search, and round-trip corpus pass review.
- **Risk:** Converting inch to millimetres is mathematically deterministic, but treating rounded display values as engineering equality is not. Store supplied notation, exact conversion where possible, rounding status, and tolerance separately.
- **Rejected:** Deriving a default coarse pitch from nominal diameter, family, standard, or common practice.
- **Rejected:** Using text substring equality for dimensions, fractions, ranges, fits, or tolerances.

## Normalization decisions

### Reversible and safe for bounded automation

- **Fundamental requirement:** Preserve every supplied display value privately and publish it where permitted. Add normalized derivatives; never overwrite the source value.
- **Strong hypothesis:** These transformations are reversible enough for automation when they pass a round-trip test and carry a rule version:
  - outer whitespace trimming;
  - mapping confirmed packet blank/dash sentinels to explicit `not supplied` while retaining raw evidence privately;
  - a separate case-folded lookup key where the identifier namespace permits case folding;
  - parsing metric decimals and inch fractions into exact numeric/rational quantities with units;
  - parsing a supplied numeric TPI from the complete imperial designation without converting coarse/fine into a number;
  - parsing tensile values into value/unit and hardness into value/scale without comparing the concepts;
  - deterministic unit conversion stored as a derived value with exact/rounded status;
  - stable sorting/formatting that does not change identity.
- **Risk:** “Reversible” does not mean mechanically approved. Grammar coverage, units, and applicability still need tests and review before release.

### Requires mechanical or source review

- **Fundamental requirement:** Review family inclusion/exclusion, identity fields, measurement datum, fit/tolerance meaning, thread validity, full/partial-thread semantics, minimum thread length, and which dimensions are selection-critical.
- **Fundamental requirement:** Review material/grade/condition and finish/coating decomposition one bounded vocabulary at a time. Ambiguous combined labels remain `not yet normalized`.
- **Fundamental requirement:** Review strength class, tensile basis, hardness scale, and which property is sufficient for each family/release subset.
- **Fundamental requirement:** Review standards organization/designation/part/edition and relationship. Formatting cleanup cannot create conformance or equivalence.
- **Fundamental requirement:** Review every proposed duplicate merge, split, and configuration correction.
- **Rejected:** Global punctuation stripping for identifiers; global material aliases; finish defaults; standards inference; cross-unit equality after display rounding; or automatic duplicate collapse.

## Duplicates, collisions, and identity corrections

- **Evidence:** The packet has 26,953 populated known references, all unique after conservative trim/case-fold within this packet; 56 are absent. This supports a strong exact-lookup experiment but does not establish global namespace uniqueness.
- **Evidence:** Under the current imported technical signature, 1,591 groups repeat across 3,502 rows. In 1,311 groups/2,863 rows, omitted supplied technical fields differ. The projection therefore creates false duplicate candidates.
- **Evidence:** Even a broader source-technical signature leaves 290 candidate duplicate groups/659 rows. These still require review; they are not proof of duplicate configurations or equivalence.
- **Fundamental requirement:** Release validation must enforce one active target or an explicit ambiguous/withdrawn state for each `(release, namespace, normalized identifier)` key. Never select the first row.
- **Fundamental requirement:** Duplicate review must compare all candidate identity fields and show agreement, difference, missingness, and parse state. Retain every permitted identifier and prior released route after a reviewed merge.
- **Risk:** Over-conservative identity may leave duplicate-looking configurations. That is safer for the first release than merging real variants. Result clutter should be solved by review, not loss of distinctions.
- **Rejected:** Dimensional similarity as duplicate proof, equivalence, compatibility, or substitution.

## Corrections, withdrawal, and release identity

- **Fundamental requirement:** Publish a new immutable release for every public technical correction, mapping correction, split, merge, supersession, or withdrawal. Do not upsert released facts in place.
- **Strong hypothesis:** Correction semantics for the bounded POC:
  - wording/format correction: same logical key, new revision digest;
  - wrong technical value but same reviewed real-world configuration: same key only after explicit review, new digest;
  - one row found to contain two variants: withdraw/supersede old key and create child keys;
  - reviewed duplicate merge: one surviving/new configuration key with all permitted mappings and preserved old routing history;
  - wrong identifier mapping: mapping revision, not configuration mutation.
- **Fundamental requirement:** A withdrawal disappears from browse and Add to BOM. Exact lookup returns a bounded `withdrawn` state and safe reason, with no nearby substitute or supplier handoff. Old BOM snapshots retain the old release, key, digest, displayed facts, and warning state.
- **Fundamental requirement:** Release identity must include an opaque ID and content digest, not just a date. Freeze family schema, parser, normalizer, configuration revisions, mapping revisions, and public DTO contract into the manifest.
- **Risk:** Whole-release copying is acceptable now, but split/merge history becomes awkward if corrections become frequent. That is a migration trigger, not a reason to build a temporal claim graph before the POC.

## Which current rows are publishable candidates

- **Evidence:** **Zero current imported rows are publishable as-is.** Every imported row is forced to `demo-only`, `synthetic`, and `internal-demo-seed`; family is an import bucket; identity is bucket plus private source key; important fields are dropped; and no catalog release exists.
- **Evidence:** The three code-level pilot records are also synthetic demo seeds. They are not replacements for source-backed reviewed configurations and do not establish standard relationships or mechanical approval.
- **Strong hypothesis:** Use the 11,973 boundary-selected rows only as a private curation queue:
  - 6,707 Socket Head Cap Screw candidates;
  - 2,050 plain Hexagon Socket Button Head Screw candidates;
  - 3,216 Pan Head Machine Screw candidates.
- **Strong hypothesis:** Start review from the 3,938 metric boundary candidates, then prefer rows with supplied pitch, complete threading/geometry/drive facts, a supplied standard, a reviewable material/finish label, a typed strength claim, and no unresolved duplicate-signature group.
- **Risk:** No honest final publishable count can be computed until mechanical reviewers approve the identity profiles and material/finish/standard rules. A database non-null count is not publication readiness.
- **Rejected:** Publishing all 11,973 because they match boundary predicates, all 27,009 because identifiers are mostly unique, or any row because it passes the current importer tests.

## Minimum credible reviewed release without a platform project

- **Strong hypothesis:** Candidate floor: one metric-only release with three approved family versions and about 150 configurations—roughly 50 per family, adjusted to cover real axes rather than a forced equal split.
- **Fundamental requirement:** The release must cover, for each family, several thread diameters and lengths, both full and partial threading where supported, more than one reviewed material/strength/finish combination, and every in-scope drive distinction. Pan head must include both in-scope drives or explicitly narrow the family.
- **Fundamental requirement:** Review 100% of the released family memberships, configuration fingerprints, required values/missingness, and identifier mappings. Hold every unresolved collision or selection-critical conflict out of release.
- **Fundamental requirement:** Ship one immutable manifest, one prior/empty rollback target, release ID on every DTO, stable configuration/mapping digests, public-safe field-group evidence, and a correction/withdrawal drill.
- **Fundamental requirement:** Freeze a 100–150-case query corpus covering exact IDs, broad and family-specific text, metric quantities, missing fields, collisions, not-in-release, withdrawal, and service failure. This corpus is separate from the configuration count.
- **Strong hypothesis:** Use scripts plus reviewed CSV/JSON manifests for this gate. Do not build a reviewer UI, EAV model, field-assertion graph, supplier graph, or general unit ontology.
- **Open question:** The proposed count is a practical demonstration floor, not user or domain evidence. If 150 configurations cannot be reviewed with complete identity and correction semantics, the credible action is to shrink the family set or stop—not label incomplete rows verified.

## Contrasting-category stress test: O-rings, conceptual only

- **Evidence:** No sanctioned O-ring packet was inspected. This is a model falsification exercise, not category coverage, source validation, or a platform claim.
- **Strong hypothesis:** The four object boundaries still make sense:
  - family: one reviewed O-ring type/schema;
  - configuration: one nominal/toleranced geometry and compound/property combination;
  - identifier: a namespace-specific standard size code or manufacturer reference mapping;
  - release: one immutable reviewed public set.
- **Fundamental requirement:** The O-ring family schema must not inherit thread, pitch/TPI, threading extent, head, drive, fastener strength class, or fastener standards fields.
- **Strong hypothesis:** Candidate O-ring identity would instead need standard/series context, nominal inside diameter, cross-section, tolerances, compound/material specification, hardness with scale, and construction. Color may be descriptive unless review proves it identifies a compound. Media/temperature compatibility and certification are conditional claims, not safe facts derived from `rubber` or a size code.
- **Risk:** A dash-size-like identifier is not globally unique without namespace and standard context. Geometry equality does not establish compound, tolerance, service compatibility, manufacturer part, or interchangeability.
- **Risk:** If PartSource later filters by media, temperature, pressure, squeeze, or service life, four serving relations plus opaque JSON are no longer enough by themselves. Conditioned property claims, tolerances, and evidence become a deliberate migration trigger.
- **Strong hypothesis:** The bridge survives this conceptual test as an identity/release envelope. The fastener attribute model does not generalize, and this exercise does not prove an O-ring product.
- **Rejected:** Adding nullable O-ring columns to the fastener tuple or claiming three screw families plus a conceptual example prove a general mechanical-parts platform.

## Decision summary

- **Evidence:** Current source coverage is useful for exact lookup and private curation, but the public projection is lossy and mutable.
- **Fundamental requirement:** Approve family boundaries, identity/required fields, normalizers, metric/imperial scope, duplicate decisions, and release size through mechanical review before publication.
- **Strong hypothesis:** Keep the four-relation bridge, metric-only initial review, conservative over-splitting, field-group evidence, and whole-release replacement.
- **Opportunity / gold idea:** Make the release validator produce a differences-first review packet: family-rule result, supplied versus parsed values, all omitted-field differences, identifier collision state, missingness, configuration digest, and the exact reason a row is held. The same artifact can become the golden truth corpus without building a data platform.
- **Nice-to-have:** Per-field assertions, a reviewer UI, cross-source comparison, anomaly detection, richer split/merge history, and a user-facing release change log after real volume justifies them.
- **Open question:** Whether the proposed families, 150-configuration floor, metric-only boundary, and limited-record policy are useful and mechanically correct remains unapproved.
- **Risk:** Calling candidates configurations, `Indexed` truth, or `Verified` BOM lines before this gate passes would overstate both data and product capability.
- **Rejected:** Automatic inference, automatic deduplication, mutable released rows, silent remaps, generic confidence scores, and universal mechanical schemas for the POC.
