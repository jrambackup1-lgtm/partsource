---
title: Accessibility and layout mechanics
status: resolved
resolved: 2026-08-16
label: wayfinder:ticket
created: 2026-08-16
updated: 2026-08-16
audit: user-perspective-issue-audit-2026-08-16.md
---

## Problem (user perspective)

Measured failures that block or mislead whole user groups: the sticky topbar never sticks (`overflow-x: hidden` defeats it), so the global search scrolls away on any result list; the mobile browse rail is permanently clipped — the last family chip is unreachable at 390 px; screen readers hear nothing after search submission (focus stays in the input; result count never announced), while failure cards announce only politely; the focus ring fails 3:1 contrast (2.81:1) and four grey metadata text pairs fail 4.5:1 (3.6–3.98:1); the exact-match label renders at 9 px; `aria-selected` sits on plain `<tr>` rows (invalid ARIA); the search input's good label is overridden by `aria-label="Query"`; the mobile inspector doesn't lock background scroll; tablet/200%-zoom users must horizontal-scroll each row to reach Inspect.

## Evidence

- Audit Part 2 N7, N8, N14, N15.
- `web/src/index.css:5-6,15` — `overflow-x: hidden` on html/body vs `.topbar` sticky; `:10,21-22` — focus outline contrast; `:65,77,79,104` — grey text pairs; `:89` — 9 px match label.
- `web/src/catalog/ui/CatalogApp.tsx:104-107` vs `:128` — search submit omits the focus-move that facet changes already perform; `:151-153` — aria-label override; rows carry `aria-selected` outside any grid role.
- All geometry DOM-measured at 1280/768/390/320 px in the accessibility review; verified-solid list also recorded there (skip link, landmarks, focus trap, inspector semantics, 320 px reflow).

## Scope

1. Restore sticky topbar (scope overflow clipping properly) and fix the mobile rail (`min-width: 0` on the grid item) so all families are reachable.
2. Announce search outcomes: focus the result summary after submit (mirror the existing facet behavior) and use assertive semantics for failure cards.
3. Contrast/size pass: focus indicator ≥3:1; grey metadata text ≥4.5:1; match label ≥11 px (headers with it).
4. Semantics cleanup: remove `aria-selected` from non-grid rows (state is already conveyed by `aria-pressed` + visible labels); drop the overriding `aria-label` on the search input; `scope="col"` on headers; consistent per-row action state.
5. Mobile inspector background scroll lock; keep the verified-good trap/inert behavior unchanged.

## Out of scope / boundaries

- Full keyboard grid navigation and arrow-key row traversal (LATER unless u4's table rework makes it natural).
- No visual redesign.

## Acceptance

- Topbar pinned while scrolling results; last family chip fully reachable at 390 px.
- Screen-reader pass: search outcome announced; failures assertive; no invalid ARIA in results.
- Computed contrast ratios pass 3:1 (UI) / 4.5:1 (text) for the flagged pairs; match label legible at 100%.

## Dependencies

None — independent of u1–u5; safe to run in parallel with any of them.

## Resolution (2026-08-16)

Resolved in full.

- **Sticky topbar restored:** `html`/`body` use `overflow-x: clip` (no scroll container → sticky anchors to the viewport); the mobile `.catalog-content` no longer forces `100vw`; measured pinned at scroll depth in the browser suite.
- **Mobile rail fixed:** `.catalog-layout` uses `minmax(0, 1fr)` and `.browse-panel` gets `min-width: 0`, so the chip rail scrolls internally and the last family chip is reachable at 390 px (browser-measured).
- **Announcements:** search submit moves focus to the result summary (list/chooser/empty) or the failure heading; failure cards are `role="alert"` (assertive), mirroring the existing facet-change behavior.
- **Contrast/size:** focus indicator `#c2410c` (≥4.7:1 on all surfaces); the four flagged grey pairs darkened to ≥4.5:1 (`#5c675f`, `#5f6a62`, `#5c6962`, `#535e58`); match label and table headers ≥11 px. Locked in by `scripts/catalog/test-accessibility-contrast.ts`, which parses the CSS and computes WCAG ratios so edits fail loudly.
- **Semantics:** `aria-selected` removed from plain `<tr>` rows; both per-row actions expose consistent `aria-pressed` selection state; `scope="col"` on all headers; the search input is named by its programmatic label (no overriding `aria-label`); the action column pins sticky-right so tablet/zoom users reach Inspect without per-row scrolling.
- **Mobile inspector:** background scroll locked (`overflow-y: hidden` on body) while the modal is open; verified trap/inert behavior unchanged.
- Tests: Playwright `catalog-accessibility.spec.ts` (7 scenarios: sticky, announcement focus, table semantics, accessible name, rail reachability, scroll lock, label sizes) plus the Node contrast/layout regression test. Full `release:audit` green.
