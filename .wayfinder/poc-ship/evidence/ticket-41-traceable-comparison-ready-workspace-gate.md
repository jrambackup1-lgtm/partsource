# Ticket 41 — traceable comparison-ready catalog workspace gate

**Date:** 2026-08-14
**Ticket:** [41 — Render the traceable, comparison-ready catalog workspace](../tickets/41-render-traceable-comparison-ready-catalog-workspace.md)
**Scope:** `PS-POC-SYNTHETIC-V1` local synthetic fixture only.
**Decision:** **PASS — implementation and release audit clean.**

## Implementation summary

Ticket 41 rendered the deterministic resolver contract in the catalog workspace without expanding product scope.

Changed runtime surfaces:

- `web/src/poc/PocApp.tsx`
- `web/src/poc/poc.css`

Added/updated regression coverage:

- `web/tests/browser/poc-progressive-traceable-workspace.spec.ts`
- `web/tests/browser/poc-progressive-release.spec.ts`
- `web/scripts/poc/test-resolver.ts`
- `web/scripts/poc/test-documents.ts`
- `web/scripts/poc/test-boundary.ts`

## Acceptance evidence

- Deterministic interpretation trace is visible and keyboard reachable for submitted queries.
- Trace preserves original input and separates recognized, applied, unsupported, conflict, exact-ID state, stop reason, and provenance references.
- Exact-ID states render as `unique`, `unknown`, and `non_unique`; unknown and non-unique states do not select, prefer, or highlight a row.
- Active filters and valid values remain visible; filter changes do not silently broaden or invent constraints.
- Row and detail surfaces expose family, thread/pitch, length with datum, material, finish, drive, head profile, and separated record/fact/mapping provenance.
- Exact highlight and explicit selection use different visible, non-colour state text and ARIA state.
- Rows remain first-pass comparison-ready only; no compare, shortlist, favorite, cart, BOM, export, supplier, price, availability, quote, or procurement control is present.
- Desktop detail preserves catalog context; narrow detail is an accessible modal with focus trap, Escape/Close handling, focus return, and no horizontal scroll at 320 CSS px.
- Filter-driven invalidation clears selected detail, URL `selected`, and pressed row state.

## Subagent review evidence

Three independent subagent reviews were used during implementation:

1. Ticket 41 UI/accessibility gap review before implementation.
2. Ticket 41/42 adversarial/release checklist review.
3. Accessibility/UX runtime review after implementation.

Findings fixed before pass:

- Preserved legacy recognized-filter text expected by existing browser coverage.
- Aligned row provenance text with the runtime bundle notice.
- Added browser coverage for trace visibility, exact states, provenance, no prohibited controls, modal/focus behavior, and selection invalidation.

Remaining subagent concern moved into Ticket 42 and fixed there: release audit needed stronger adversarial/query and boundary checks.

## Audit evidence

Command:

```text
cd C:\Users\jayar\Projects\partsource\web
npm run release:audit
```

Result: **PASS**, exit code `0`.

Observed output:

- `npm run lint` passed.
- `npm test` passed.
  - POC bundle contract passed.
  - POC resolver Ticket 40 contract passed.
  - POC URL-state contract passed.
- `npm run test:documents` passed.
- `npm run build` passed.
- `npm run test:browser` passed: **26 passed**.
- `npm run test:boundary` passed.

## Boundary

This pass is a local deterministic synthetic POC pass only. It is not qualified engineering approval, not publication approval, not deployment approval, and not a real catalog/source-ingestion gate.
