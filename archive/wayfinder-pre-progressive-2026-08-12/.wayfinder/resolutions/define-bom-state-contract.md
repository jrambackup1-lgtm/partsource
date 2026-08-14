# Resolution comment — Define the named-BOM state and portability contract

- R4 uses a versioned browser-local multi-BOM store with stable UUIDs, an explicit active BOM, and an empty state after the final deletion.
- BOM lines are immutable selection snapshots. Verified selections preserve original McMaster number, cross-reference record, alternative identifier, supplier snapshot, notes, user cost, and review revision; imports and legacy data cannot assert verification without an exact catalog match.
- Rename, duplicate, switching, and deletion are identity-based and isolated. Duplication creates new IDs; deletion affects only its target and requires confirmation.
- The legacy single-BOM key migrates once only when the named store is absent. Valid rows migrate; malformed payloads and rejected rows are quarantined before an empty state is used.
- CSV carries one selected BOM and reports row errors. JSON is the full-state format and replaces local state only after whole-payload validation and explicit confirmation; invalid or cancelled restore leaves state unchanged.

Implementation and verification details are now owned by `research/production-readiness-plan.md` and `research/production-readiness-checklist.md`.
