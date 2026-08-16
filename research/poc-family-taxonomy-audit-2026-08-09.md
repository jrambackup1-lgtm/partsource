# PartSource POC family-taxonomy and coverage audit

**Date:** 2026-08-09  
**Status:** Wayfinder evidence. Aggregate technical-field audit only. No raw source rows or confidential source lineage are reproduced here.

## Question

Can the current approved 27,009-row fastener dataset support the intended family-first POC without pretending that three import files are three coherent product families?

## Dataset truth

| Imported source slice | Rows |
|---|---:|
| Socket-head slice | 7,864 |
| Hex-head slice | 8,850 |
| Rounded-head slice | 10,295 |
| **Total** | **27,009** |

Current-file names are ingestion buckets, not a safe public family taxonomy.

## Identifier coverage

- Reviewed input contains 26,953 nonblank known identifier values.
- Coverage is 99.8%.
- 56 rows have no identifier.
- Nonblank identifiers are unique in the current input.
- `91290A115` occurs once in the socket-head slice.

This makes known-identifier resolution one of the strongest demonstrable POC paths.

It does not make the identifier the canonical product identity. The identifier should map to a configuration inside a family.

## Technical-field coverage

Across all 27,009 rows:

| Field | Populated |
|---|---:|
| Thread size | 100.0% |
| Length | 100.0% |
| Material | 100.0% |
| Strength evidence: class, tensile strength, or hardness | 100.0% |
| Head dimensions | 100.0% |
| Drive style or size | 99.8% |
| Known identifier | 99.8% |
| Thread pitch | 32.3% |
| Dedicated raw finish field | 25.0% |
| Normalized standard (`specifications_met`, excluding `-`) | 83.9% |

Consequences:

- Thread, length, material, strength evidence, geometry, and drive can support a useful current-family workspace.
- Missing pitch must remain explicit unknown. The dedicated finish field is sparse; some combined material values encode a finish, but splitting those values requires reviewed normalization rules. Absence is not a default.
- The current dataset can support standard filtering from its supplied `specifications_met` field.
- Standards must still come from the supplied technical field. Do not infer them from shape, dimensions, or an identifier.

## Family-granularity evidence

### Socket-head ingestion slice

The 7,864 rows include materially different head profiles and drives:

- Standard profile + hex drive: 6,707.
- Low profile + hex drive: 466.
- Low profile + pilot recess: 263.
- Ultra-low profile + hex drive: 263.
- Standard profile + Torx Plus: 53.
- High profile + hex: 32.
- High profile + square: 24.
- 56 rows lack reviewed profile/drive values.

`Socket Head Cap Screws` can be a coherent family only after defining its geometry and drive boundary. Low, ultra-low, pilot-recess, Torx Plus, and square-drive records should not silently inherit that family identity.

### Hex-head ingestion slice

- 8,767 rows use external hex drive.
- 60 use external hex/slotted.
- 23 use external hex/Phillips.
- The current fields do not provide a useful head-profile split.

A broad `Hex Head Screws` family may be workable for the POC, but combination-drive records need an explicit boundary or separate family treatment.

### Rounded-head ingestion slice

The 10,295 rows contain at least seven head styles and fourteen drive styles.

Largest style/drive groups include:

- Pan + Phillips: 3,084.
- Button + hex: 2,625.
- Round + slotted: 639.
- Pan + slotted: 619.
- Truss + Phillips: 374.
- Cheese + slotted: 336.
- Fillister + slotted: 324.
- Button + Torx: 267.

`Rounded Head Screws` is an ingestion umbrella, not a credible product family. User-facing families should be curated from functional head style plus drive/geometry where that distinction changes fit, tooling, or terminology.

## POC family recommendation

Do not attempt to publish all inferred families at once.

Use a small reviewed family set that proves different discovery behavior:

1. **Socket Head Cap Screws** — conventional cylindrical/standard profile + internal hex.
2. **Hexagon Socket Button Head Screws** — button head + internal hex, excluding flange/collar forms.
3. **Pan Head Machine Screws** — machine-thread pan heads; drive is a facet. The first coverage slice contains Phillips and slotted records, excluding washer assemblies.

Hold back the external-hex bucket. It mixes ordinary cap screws, flange heads, heavy-hex/structural products, and other standards that do not share one safe selection grammar.

Why three:

- One family would look like a catalog demo, not a discovery platform.
- Three demonstrate intent routing, terminology differences, family-specific facets, exact-identifier mapping, and the case where drive is a facet rather than family identity.
- The remaining rows stay private/unpublished until classified and reviewed.

This is a Wayfinder recommendation, not approved release scope.

### Candidate-boundary check

The refined three-family boundaries select 11,973 rows, or 44.3% of the current input:

| Candidate family | Rows | Known identifier | Raw pitch | Raw finish | Standard |
|---|---:|---:|---:|---:|---:|
| Socket Head Cap Screws | 6,707 | 100% | 32.5% | 0.0% | 83.4% |
| Hexagon Socket Button Head Screws | 2,050 | 100% | 34.7% | 27.4% | 88.7% |
| Pan Head Machine Screws | 3,216 | 100% | 32.5% | 23.3% | 87.6% |

`91290A115` falls inside the proposed Socket Head Cap Screws boundary.

This proves the boundary rules can select substantial, disjoint row groups. It does not prove all 11,973 rows should be published in the POC. A smaller reviewed release may be safer if normalization QA is the constraint.

Important exceptions found during challenge:

- Button + internal hex contains 575 title-marked flange/collar rows, including 106 ISO 7380-2 rows. These are excluded from the plain button-head candidate.
- Pan + Phillips/slotted contains 487 title-marked washer assemblies, including 443 ASME B18.13-family rows. These are excluded from the plain pan-head candidate.
- The external-hex bucket contains at least 1,076 flange, 587 heavy-hex, and 278 structural title-marked rows. Do not publish it as one family.

## Search implications

- Search aliases should resolve names such as `SHCS`, `socket head screw`, and `Allen screw` to a family candidate, while showing the interpreted term.
- Broad `M4 screw` must return multiple family candidates and preserve `M4` as a constraint.
- Exact identifier lookup should map to one configuration and its reviewed family.
- Unknown identifier-shaped input must not be guessed from format.
- Missing standard, pitch, or finish cannot be treated as a failed match unless the query explicitly requires that field and the system explains the coverage gap.

## Trust implications

The UI needs separate truth states for:

1. Family classification reviewed by PartSource.
2. Configuration technical fields present in the current release.
3. Identifier-to-configuration mapping reviewed by PartSource.
4. Supplier destination or listing evidence.

One `verified` badge cannot safely represent all four.

## Decision frontier

Resolved enough:

- Import files are not families.
- Known-identifier resolution has enough current coverage to be a core POC path.
- Three reviewed families are a stronger POC hypothesis than one deep family or all auto-generated groups.
- Standard filtering is supported by the supplied `specifications_met` field; normalization quality still needs review.

Still unresolved:

- Whether the three proposed family names and boundaries match how target users think.
- Whether Pan Head Machine Screws should combine Phillips and slotted drive coverage in one family workspace.
- Whether family classification can be reviewed at row-group level or requires row-level exceptions.

## Reproduction

Counts were produced locally from the three approved CSV inputs using Python `csv` and `collections.Counter`. Only aggregate technical-field results are preserved in this document.
