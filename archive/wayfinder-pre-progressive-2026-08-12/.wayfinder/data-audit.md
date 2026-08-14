# Wayfinder data audit — 2026-08-05

## Verdict

**Technical merge: yes. Production coexistence: no.** All 27,009 CSV rows and generated records have collision-free generated identities. However, the source register marks the apparent source (`SKDIN`) **blocked**: these records may not be stored, normalized, tested, or published for PartSource pending written permission. The product contract permits only non-published hex/rounded prototype data and does not name socket-head data.

## Counts and identity integrity

| Dataset | CSV rows | Generated rows | SKU null / duplicate | McMaster ref null / duplicate |
|---|---:|---:|---:|---:|
| Hex head | 8,850 | 8,850 | 0 / 0 | 0 / 0 |
| Rounded head | 10,295 | 10,295 | 0 / 0 | 0 / 0 |
| Socket-head cap | 7,864 | 7,864 | 0 / 0 | 56 / 0 |
| **Total** | **27,009** | **27,009** | **0 / 0** | **56 / 0** |

- Cross-file duplicates: **0** for source SKU, McMaster reference, `part_no`, generated `partNumber`, and generated `sourceSku`.
- Every CSV SKU has exactly one generated record; no generated record has an unknown SKU.
- `part_no` is a duplicate copy of `sku` where present (8,850 / 10,295 / 7,808 rows); it adds no identity value.
- The 56 socket-head rows without a McMaster ref also lack title and several related attributes. Generator fallback `PROTO-SHCS-{sku}` preserves unique identity; this is technically safe.

## Nulls / unavailable values

Blank-field counts (not counting literal `-`):

| Dataset | Material | Thread pitch | Finish | Other material fields |
|---|---:|---:|---:|---|
| Hex head | 0 | 6,275 | 5,764 | thread diameter 2,575; reach 1,722; RoHS 1,398; min thread length 5,142; strength grade 3,813 |
| Rounded head | 0 | 6,974 | 6,628 | thread diameter 3,347; drive size 2,390; reach 626; RoHS 128; thread fit 15 |
| Socket-head cap | 0 | 5,026 | 0 | title/McMaster/part no/system/head type/profile/spacing/direction/fit/drive/drive size: 56 each; thread diameter 2,894; reach 604; RoHS 207; min thread length 5,209 |

Literal `-` is also used as missing data: `specifications_met` (hex 1,176; rounded 1,654; socket 1,523) and `material` (hex 17; rounded 30). Generators preserve `-` as an asserted string instead of normalizing it to unavailable.

## Generator field mapping audit

| Catalog | Accurate mappings | Material omissions / inaccuracies |
|---|---|---|
| Socket-head cap | `thread`, `length`, `material`, `standard`, `drive`, `pitch`, `title`; preserves McMaster ref when present | `finish` is always empty because no source finish column exists. 56 incomplete rows flow through with empty title/drive/pitch/standard. |
| Rounded head | `thread`, `length`, `material`, `standard`, `drive`, `pitch`, `finish`, `title`, McMaster ref | `-` values remain literal strings. |
| Hex head | `thread`, `length`, `material`, `standard`, source SKU | **8,850 titles intentionally discarded; all 8,850 McMaster refs discarded; `drive_style` discarded and replaced with `Hex Outer`; source `thread_pitch` discarded on 2,575 populated rows; source `finish` discarded on 3,086 populated rows.** `finish` is always empty and title always empty. |

The hex mapping changes data, not merely representation: every source `drive_style` differs from emitted `Hex Outer` (8,850 rows). Whether that is acceptable depends on the catalog's intended meaning; it is not a faithful source-field mapping.

## Provenance / contract evidence

- All 27,009 `subcat` values retain source-style `/products/...` paths.
- 18,103 generated records expose direct McMaster references (all rounded plus 7,808 socket-head); their titles are source-derived. The anonymizer removes only named URL/image columns and `skdin` text, not `subcat`, `mcmaster_pn`, or source-derived titles.
- `research/data-source-register.md` says blocked SKDIN content cannot be collected, stored, normalized, tested against, or published. Current records therefore fail the active production data gate regardless of collision cleanliness.
- `research/product-contract.md` restricts local non-published prototype data to validated hex-head and rounded-head configurations, excluded from routes. The runtime currently also loads socket-head records, though static route generation filters all `isPrototype` records.

## Safe coexistence conclusion

1. **Within a local technical catalog:** all three datasets can coexist without identifier overwrite or record collapse.
2. **As current PartSource data:** do not retain, regenerate, test, or ship them until source permission is approved; socket-head additionally falls outside the stated prototype allowance.
3. **If permission is later approved:** normalize literal `-`; decide whether to retain source fields (especially McMaster/title); repair or explicitly document the hex field losses before treating its emitted catalog as faithful.
