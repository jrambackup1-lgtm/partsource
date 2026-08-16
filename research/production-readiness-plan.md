# PartSource Production-Ready Restart

> **HISTORICAL — SUPERSEDED EXECUTION PLAN.** Preserve for recovery and decision history. Do not execute its equivalence, BOM, supplier, or restart direction. It is not current implementation authority.

**Status:** Historical — inactive

**Execution tracker:** `research/production-readiness-checklist.md`

**Data-source authority:** `research/data-source-register.md`

## Outcome

Build a US-focused public MVP around one trustworthy workflow:

`McMaster number -> verified equivalent -> named local BOM -> save/export`

Keep the working application and reviewed code. Prices, accounts, bulk SEO, checkout, and lead capture remain deferred.

## 1. Recover and reset safely

- Preserve the current dirty checkout, commits, evidence, and historical planning documents.
- Record old branch/worktree heads in a recovery manifest before retiring obsolete worktrees or branch refs.
- Continue production work only in a new isolated worktree.
- Treat `research/product-contract.md` as product authority, this file as execution authority, and `research/production-readiness-checklist.md` as status authority.

## 2. Establish the data pipeline first

- Limit v1 to socket-head cap screws and require 25 independently reviewed McMaster-to-supplier mappings.
- Model canonical configurations, McMaster identifiers, supplier/manufacturer alternatives, normalized specifications, evidence, reviewers, lifecycle, and withdrawal state.
- Publish only `verified-equivalent` mappings where thread, pitch, length, head, drive, material, grade, finish, applicable standard, and required certifications match.
- Process source data through:

  `raw snapshot -> normalized facts -> schema validation -> conflict checks -> review queue -> published catalog`

- Store factual fields and evidence links, not copied descriptions, images, or standards text.
- Enable an adapter only when `research/data-source-register.md` records commercial reuse permission, permitted fields, attribution, crawl limits, refresh cadence, and takedown procedure.
- Public visibility, search indexing, and `robots.txt` do not by themselves grant commercial reuse permission.

## 3. Complete the core application

- Exact McMaster lookup returns either a reviewed equivalent with evidence and review date, or an explicit `No verified equivalent yet` result.
- Guessed alternatives, synthetic offers, inferred prices, and automatic promotion of similar configurations are prohibited.
- Standards/configuration search remains a separate research feature and is never labeled an equivalent.
- Add multiple named browser-local BOMs with stable IDs, rename/delete/duplicate operations, refresh-safe persistence, CSV import/export, and full JSON backup/restore.
- Each BOM line preserves the original McMaster number, selected verified-alternative record ID, quantity, notes, and verification revision.
- Migrate valid existing single-BOM data once; quarantine malformed storage without crashing.
- Keep the current static deployment. No accounts, backend, checkout, live prices, affiliate offers, or managed lead form in this release.

### R3 exact-lookup result-state contract

The R3 exact McMaster lookup implements the `research/product-contract.md` result-state contract. Its public result union is:

- `verified-equivalent`: exact normalized McMaster identifier matched one current published verified-equivalent record with approved source, complete evidence, approved independent review, lifecycle current, record ID, record revision, normalized facts, alternative identifier/supplier/manufacturer snapshot, evidence references, review revision, and verification date/status.
- `unsupported`: syntactically valid McMaster identifier but no current published verified-equivalent may be returned. Missing, unpublished, stale, withdrawn, conflicted, incomplete, unapproved, and fixture/test records all return public copy `No verified equivalent yet`.
- `configuration-candidate`: separate standards/configuration search or decoder output only. It is never returned from the exact-equivalence endpoint and never becomes an equivalent without a published verified-equivalent record.
- `invalid-input`: input cannot be normalized as a McMaster-Carr identifier.
- `search-unavailable`: exact lookup cannot be evaluated because required catalog/configuration/endpoint/network is unavailable; fail closed without using guessed alternatives or stale fallback data.

Exact McMaster lookup must not fuzzy-promote suggestions. Configuration search may remain available as a visibly separate research feature, but its results are labelled candidate/configuration only and cannot unlock verified-equivalent BOM actions.

### R4 named-BOM state contract

- Persist one versioned browser-local `BomStore` at `partsource_boms:v1`: `{ version: 1, activeBomId: string | null, boms: Bom[] }`. A `Bom` has an immutable UUID, a trimmed unique case-insensitive name (1-80 characters), `createdAt`, `updatedAt`, and its own `BomItem[]`.
- A `BomItem` has an immutable UUID, positive integer quantity, notes, user-entered/imported USD unit cost, and an immutable selection snapshot: original McMaster number, selected cross-reference record ID, alternative part number, supplier, description/material where available, and verification revision. `origin` and `verificationStatus` distinguish a verified selection from imported or legacy user data.
- Snapshot fields never silently change when the catalog changes. When the current catalog can compare the record, it may warn that the saved revision is stale or withdrawn; it must not rewrite the line or imply a replacement is verified.
- Start with no BOM. Create is explicit and uses the next available `BOM n` name; adding a lookup result requires choosing or creating a BOM. Rename rejects blank or colliding names. Duplicate deep-copies line snapshots into new UUIDs and a unique `name copy` name. Delete requires confirmation, removes only that BOM, selects the next retained BOM (or previous when deleting the last visible one), and leaves `activeBomId: null` after the final deletion.
- All updates address BOM and line UUIDs, validate the complete resulting store before write, and never mutate another BOM. Storage failure keeps the current in-memory state usable and shows that persistence failed.
- Migrate only when `partsource_boms:v1` is absent. Recognize the legacy `partsource_bom` array and version-1/version-2 wrappers; migrate valid rows into one `Migrated BOM`, with new UUIDs and `origin: legacy`. Copy malformed payloads or rejected rows to `partsource_bom_quarantine:v1` with source key, capture time, and reason before starting empty; offer recovery download and clear. Write the new store before removing the legacy key, so a failed migration remains recoverable.
- CSV is a selected-BOM interchange, not verification evidence. Export documented fields: McMaster number, alternative part number, cross-reference record ID, verification revision, part number, description, material, supplier, quantity, unit cost, and notes. Import validates every row and reports rejected rows; valid rows append as separate snapshots only after confirmation. Imported references become verified only after an exact current published-record-and-revision match; otherwise they remain `unverified-imported` and never become an equivalent claim.
- JSON backup is the only full-state portability format: `{ format: "partsource-bom-backup", version: 1, exportedAt, activeBomId, boms }`. Restore validates the entire payload before any write, rejects unsupported versions or any invalid BOM/line, and replaces the complete local store only after explicit confirmation. A failed or cancelled restore changes nothing; quarantined payloads are never restored automatically.

## Public interfaces

- `SourceRecord`: permission, attribution, refresh, and takedown metadata.
- `CanonicalConfiguration`: normalized mechanical attributes and units.
- `CrossReferenceRecord`: source identifier, alternative identifier, relationship status, evidence, review revision, and lifecycle state.
- `PublishedCatalog`: versioned build artifact containing only approved records.
- `BomStore`, `Bom`, and `BomItem`: versioned named-local BOM state, stable IDs, immutable selection snapshots, and verification references.
- Source adapters share one ingest interface and remain disabled unless their source record is approved.

## Verification and launch

- Restore a clean baseline: typecheck, unit tests, production build, and all browser tests.
- Test malformed source records, unit normalization, duplicates, conflicts, incomplete evidence, stale/withdrawn mappings, and unpublished-record containment.
- Test BOM migration, quarantine and recovery of corrupted storage, multiple named BOMs, refresh persistence, deletion isolation, CSV round trips, and atomic JSON backup/restore.
- Browser-test verified and unsupported lookups, evidence display, named-BOM operations, persistence, import/export, keyboard navigation, 320 px reflow, and absence of unapproved prices.
- Launch only when 25/25 mappings pass schema and independent review, zero ambiguous mappings are published, CI/browser suites pass, and production smoke confirms the deployed commit.
- Publish legal/privacy/disclaimer pages matching actual storage and outbound-link behavior.
- Use privacy-friendly analytics for lookup outcomes and BOM create/save/export events without collecting BOM contents.
- Start with a controlled `partsource.io` pilot; expand categories only after observed demand and mapping accuracy justify another reviewed data packet.

## Fixed assumptions

- Market: US buyers; USD context.
- Initial family: socket-head cap screws.
- Alternative policy: verified equivalents only.
- Pilot corpus: 25 independently reviewed mappings.
- No public price display until a sanctioned, fresh commercial feed exists.
- No automated collection without confirmed commercial reuse permission.
- Named local BOMs are the primary retention feature; cloud accounts are out of scope.
