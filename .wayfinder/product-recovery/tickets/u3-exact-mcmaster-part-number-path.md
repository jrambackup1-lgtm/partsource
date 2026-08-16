---
title: Exact McMaster part-number path and identifier display
status: resolved
resolved: 2026-08-16
label: wayfinder:ticket
created: 2026-08-16
updated: 2026-08-16
audit: user-perspective-issue-audit-2026-08-16.md
---

## Problem (user perspective)

An engineer pasting a real McMaster part number — the single most common professional lookup — is told "Search terms not recognized." Real PNs never reach the exact-identifier path: `looksLikeUnqualifiedIdentifier` requires ≥2 separator characters and all 26,953 real PNs are separator-free alphanumerics. No `mcmaster_pn` namespace exists, so even with real data loaded the flow would fail. And when a part is opened, the detail view shows synthetic PSYN IDs and internal revision strings, not the McMaster number the user came with.

## Evidence

- Audit Part 1 issues 3 and 4; Part 3 root cause 3.
- `web/src/catalog/engine/resolver.ts:26-28,43-44` — separator heuristic; `web/src/catalog/engine/exact-identifier.ts` — namespace resolution (sound; just unregistered for McMaster).
- Dataset aggregates (internal): 26,953 non-blank PNs, zero duplicates across all three files, 100% separator-free; 56 blank-PN rows must fail closed.
- Existing exact flow for PSYN IDs is contract-correct and praised by every review (family list + highlighted row + scroll-into-view + context preserved) — this ticket extends it to real identifiers; it does not redesign it.
- Adversarial check: PN display is an identifier mapping with provenance, not a supplier/equivalence claim — permitted within claim boundaries.

## Scope

1. Identifier recognition: replace the separator heuristic with namespace-pattern awareness (e.g. a McMaster PN pattern registered with the namespace), so PN-shaped input enters the exact path and absent PNs return **"exact identifier not found"** (with the submitted identifier echoed), never "search terms not recognized."
2. Register the `mcmaster_pn` namespace and per-row mappings via u1's build artifact; blank-PN rows stay unmapped (fail closed); collisions use the existing `exact_non_unique` state.
3. Identifier display: McMaster PN as the primary row identity in result lists and prominent in the detail inspector, labeled as an identifier mapping with its provenance; no stock/price/equivalence/availability framing; confidential origin never shown.
4. Row identity fallback decision for the 56 identifier-less rows (internal configuration ID, clearly non-PN-labeled).

## Out of scope / boundaries

- No isolated part page (contract: exact ID opens family/list context).
- No supplier link-out, equivalence, or alternate-supplier behavior.

## Acceptance

- Searching a real PN in a dev build with the u1 package: correct family list opens, exact row highlighted, user selects to open detail — identical contract behavior to PSYN IDs today.
- Absent PN → exact-not-found message with the identifier echoed; colliding PN → non-unique fail-closed.
- Detail and rows show the McMaster PN clearly while family/list context stays intact.

## Dependencies

u1 (namespace + mappings data). Engine recognition + failure-message split (items 1) can land earlier against the synthetic package.

## Resolution (2026-08-16)

Resolved in full, on top of u1's mcmaster_pn namespace and 26,953 unique mappings.

- **Recognition:** identifier namespaces now declare an anchored `identifierPattern` (schema + parser validated, compiled onto the catalog index). The resolver routes identifier-shaped input through the exact path via `matchesNamespaceRecognition`, replacing reliance on the separator heuristic (kept for legacy generality). PN-shaped input that matches no mapping fails as `exact_not_found` with the submission echoed — never "Search terms not recognized".
- **Packages:** `mcmaster_pn` declares `^\d{5}[A-Z]\d{3}$` (matches all 26,953 PNs); the synthetic namespace declares its PSYN shape. The 56 blank-PN rows were excluded at build (u1 D3), so identifier-less rows no longer exist in the release; the configuration-ID fallback remains for any future mapping-less configuration.
- **Display:** row/detail identity is the mapped PN (identifier projection now carries `namespaceLabel` — "McMaster-Carr part numbers"); the inspector identifier-mapping section shows the identifier itself, its namespace label, and mapping provenance; the not-found card echoes the submitted identifier. No supplier/stock/price/equivalence framing anywhere; confidential origin never surfaces.
- **Tests:** synthetic (`psyn-x1` now correctly `exact_not_found` with echo), real package (`99999Z999` → `exact_not_found` + echoed; lowercase PN identical), browser (not-found alert contains the echoed identifier). Full suites green.
