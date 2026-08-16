# u1 — Real-catalog dev release build evidence

**Built:** 2026-08-16T10:04:49.807Z (35.3s) · **Decisions:** [u1 data decisions](../decisions/u1-real-catalog-data-decisions.md)

## Artifact identity

- Release: `partsource.dev.cofounder-screws.v1` · digest: `sha256:7b1f12c9de024f498805f99f74b9846d9be12f694858383271ea9df0d85f1aef`
- Artifact: `web/catalog-releases/real-screws-v1.json` (109.5 MB) — gitignored, dev-server-only
- Manifest: `dataOrigin: cofounder_private_dev`, `allowedUse: private_dev_only`, `publicationStatus: dev_release`

## Import counts

- Rows read: 27,009 (hex 8,850 / rounded 10,295 / socket 7,864)
- Rows excluded (blank PN, fail closed, decision D3): 56
- Configurations / revisions / McMaster PN mappings: 26953 each (zero duplicate PNs asserted at build)
- Families: 192 (hex 66 / rounded 84 / socket 42) · categories: 3
- Fact definitions: 33 · facets: 1110 · lexicon rules: 265

## Recorded lexicon skips (collision policy, decision D4)

- external hex/phillips -> drive_style (ambiguous or unmapped drive phrase)
- external hex/slotted -> drive_style (ambiguous or unmapped drive phrase)
- hex -> drive_style (ambiguous or unmapped drive phrase)
- jis -> drive_style (ambiguous or unmapped drive phrase)
- wrench flats -> drive_style (ambiguous or unmapped drive phrase)
- torx -> drive_style (ambiguous or unmapped drive phrase)
- phillips/slotted -> drive_style (ambiguous or unmapped drive phrase)
- asymmetrical -> drive_style (ambiguous or unmapped drive phrase)
- drilled spanner -> drive_style (ambiguous or unmapped drive phrase)
- tamper-resistant hex -> drive_style (ambiguous or unmapped drive phrase)
- one way -> drive_style (ambiguous or unmapped drive phrase)
- tri-groove -> drive_style (ambiguous or unmapped drive phrase)

Publication of this dataset remains blocked by the external gates in `research/data-source-register.md`.
