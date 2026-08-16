# PartSource Production Readiness Checklist

> **HISTORICAL — INACTIVE EXECUTION RECORD.** Preserve checked state and failure evidence. This is not a live tracker and does not control current product or implementation.

**Status:** Historical — inactive

The checklist below records a superseded execution route.

## Control note — Proxy Validation Gate, 2026-08-10

The Proxy Validation Gate initially selected **B — bounded POC despite missing human validation**. Ticket 25 then failed its controlling adversarial matrix 11/11. The current decision is **C — rethink**. See `proxy-validation-gate-synthesis-2026-08-10.md`, `proxy-poc-ticket25-results-2026-08-10.md`, and Wayfinder Ticket 25.

- No checklist item below was completed by proxy/synthetic review.
- R0-R5 are not activated by this decision.
- Tickets 15/24 remain open and `/to-spec` remains blocked.
- The current runtime and catalog release path failed the proxy gate.
- The bounded instrument was attempted and failed. Do not integrate, deploy, or continue feature implementation from it.
- `research/product-contract.md` controls. Any stale equivalence language below is non-authoritative and must be reconciled before R0-R5 can be activated.

### Proxy-bounded research tasks — failed gate

- [ ] Complete Wayfinder Ticket 25's constraint/release ledger and blocked-first packet compiler as a local research instrument.
- [ ] Pass collision, critical-field deletion, wrong-unit/family/release, conflict, lifecycle, stale-state, and private-field-leakage tests.
- [ ] Prove zero BOM, copy, export, and supplier actions in every blocked synthetic state.
- [ ] Return results to Ticket 24 for a new decision; do not move directly to `/to-spec`.

Recorded outcome:

- Intended compiler matrix: 19/19 passed.
- Intended real-browser matrix: passed 16 blocked fixtures with zero observed unsafe controls.
- Independent adversarial matrix: **0/11 passed; 11/11 failed**.
- Remaining blockers: content-bound trust root, conflict-aware compound parsing, global identity uniqueness, descriptor-safe schemas, exception-safe rejection, closed lifecycle validation, append-only corrections/rollback, shared fact-state ledger, and field-specific next actions.
- Decision: **FAIL — C — rethink**.

## R0 - Repository reset

- [ ] Record dirty-tree and branch/worktree recovery manifest.
- [ ] Preserve old branch heads with recoverable archive refs.
- [ ] Create the isolated `production-ready-v1` worktree.
- [ ] Reconcile reviewed Phase 2-4 code into the clean baseline.
- [ ] Resolve all unit, build, and browser baseline failures.
- [ ] Complete independent reset review.

## R1 - Data-source clearance

- [ ] Audit candidate sources in `research/data-source-register.md`.
- [ ] Record permission or license evidence for every enabled source.
- [ ] Confirm permitted fields, attribution, refresh, and takedown requirements.
- [ ] Select the first approved source for socket-head cap screws.
- [ ] Acquire a lawful 25-record pilot sample.
- [ ] Complete independent source-clearance review.

## R2 - Catalog and verification pipeline

- [ ] Implement canonical configuration and source-record schemas.
- [ ] Implement cross-reference evidence and lifecycle schemas.
- [ ] Implement the disabled-by-default adapter contract.
- [ ] Implement normalization, validation, conflicts, and review queue.
- [ ] Publish only independently reviewed verified equivalents.
- [ ] Implement correction, withdrawal, and catalog-version behavior.
- [ ] Complete independent data-pipeline review.

## R3 - McMaster lookup

- [ ] Resolve exact normalized McMaster identifiers against only current published verified-equivalent records.
- [ ] Return only the documented lookup states: `verified-equivalent`, `unsupported`, `configuration-candidate`, `invalid-input`, `search-unavailable`.
- [ ] Show evidence, review revision, verification date/status, and alternative identifier/supplier/manufacturer snapshot only for `verified-equivalent`.
- [ ] Return public copy `No verified equivalent yet` for missing, unpublished, stale, withdrawn, conflicted, incomplete, unapproved, fixture, or otherwise non-publishable mappings.
- [ ] Keep candidates/configurations visibly separate from verified equivalents and prohibit fuzzy promotion from exact McMaster lookup.
- [ ] Prohibit synthetic prices, offers, inventory, and equivalence claims.
- [ ] Complete independent lookup review.

Evidence note — 2026-08-08 Supabase catalog wiring:
- Deployed `catalog-search` Edge Function to `gbtnyldvoujukolbmwgp`.
- Wired local frontend env for Supabase URL, publishable key, function URL, and anon key in `web/.env.local`.
- Applied DB-backed search rate-limit RPC and verified `service_role` execute is true and `anon` execute is false.
- Passed live `npm run test:catalog-search`, `npm run test:catalog-boundary`, `npm run test:catalog-api`, `npm run test:browser`, plus lint/test/build in `web/`.

## R4 - Named local BOMs

- [ ] Implement the versioned `BomStore`, `Bom`, and `BomItem` contract in `production-readiness-plan.md`, including stable UUIDs, active selection, immutable selection snapshots, and legacy/import verification status.
- [ ] Implement explicit create, rename, duplicate, switch, and confirmed delete behavior, including empty state after the final deletion.
- [ ] Preserve original McMaster number, cross-reference record ID, alternative identifier, supplier snapshot, notes, user cost, and verification revision on verified selections.
- [ ] Migrate recognized legacy `partsource_bom` arrays and v1/v2 wrappers only when no named store exists; quarantine malformed payloads or rows before starting empty.
- [ ] Export/import selected-BOM CSV with documented fields and visible row errors; never promote imported data to verified status without an exact published-record-and-revision match.
- [ ] Export full versioned JSON backup; reject invalid/unsupported restore payloads without mutation and require confirmation before replacing all local BOMs.
- [ ] Verify persistence, accessibility, mobile layout, storage-failure messaging, and deletion/data isolation.
- [ ] Add unit/browser coverage for migration ordering, quarantine recovery, duplicate UUID isolation, active-BOM deletion selection, stale/withdrawn snapshots, CSV round trips, and atomic JSON restore.
- [ ] Complete independent BOM review.

## R5 - Production launch

- [ ] Publish accurate privacy, terms, disclaimer, and correction paths.
- [ ] Add content-safe analytics without BOM-content collection.
- [ ] Verify custom domain, canonical URLs, monitoring, rollback, and release identity.
- [ ] Pass 25/25 mapping reviews with zero ambiguous published mappings.
- [ ] Pass typecheck, unit, build, browser, accessibility, and production smoke checks.
- [ ] Complete independent production-readiness audit.
- [ ] Launch the controlled US pilot.
