---
title: Exact-match visibility at real scale and URL truth
status: resolved
resolved: 2026-08-16
label: wayfinder:ticket
created: 2026-08-16
updated: 2026-08-16
audit: ../live-product-root-cause-2026-08-16.md
fixes: RC4
depends: f1, f2 (for real-scale verification)
---

## Problem (user perspective)

Pasting `92655A331` at real scale lands in the correct family (108 parts) and the banner says "Part 92655A331 matches — highlighted below" — but no highlighted row is visible: the exact row sits on page 2 (50-per-page pagination) and nothing jumps to it. Additionally, opening a canonical real-catalog deep link shows a spurious "Catalog link could not be restored" warning above correctly restored results.

## Root cause

`CatalogApp.tsx` pagination always starts at page 1; the scroll-into-view effect (~line 271) only works if the highlighted row is already mounted; no page is derived from `highlightedRecordId`. The spurious warning: initial hydration runs against `SYNTHETIC_INDEX` even when `?catalog=real` is present (so `release`/`digest` params evaluate invalid), and the real-load effect (~lines 174–189) never calls `setUrlWarning(false)` after a successful re-hydration. Minor: filtering a live chooser down to exactly one family stays `catalog_chooser` (`resolver.ts:340`) while the identical single-family condition at query time auto-opens — one extra forced click.

## Scope

1. On a resolution with an exact match, derive the page containing the highlighted row and land the user there (URL `page` param stays truthful); banner, highlight, and scroll agree.
2. Clear `urlWarning` after successful real-catalog hydration; avoid computing the initial warning against the wrong index.
3. Chooser symmetry: a filter/facet edit that narrows a chooser to exactly one family auto-opens that family (same rule as query time; keep the rule recorded in u2's decision file).
4. Banner truthfulness already largely fixed by u5 — extend its assertions to the paginated case ("highlighted below" must never be shown while the row is on another page).

## Out of scope

Changing the exact-ID contract (family list + highlight + user selects, never an isolated result); pagination size; virtualization.

## Verification (resolved 2026-08-16)

- Real-catalog browser probe, `92655A331`: lands on **page 2** of 3 (108 parts, 50/page) where the highlighted row lives; `.exact-row` rendered and scrolled into the viewport; banner "highlighted below" now true; URL round-trips `page=2`.
- Page-follow logic keys on resolution/sort transitions only — manual paging away is never snapped back; the scroll-into-view effect re-fires after the page lands (deps extended with `page`).
- urlWarning truth (landed with f2): initial warning computed only for the synthetic selection; re-decided from hydration against the active package after the real release loads; canonical real deep links show no warning card.
- Chooser symmetry: engine change in `chooserResolution` — constraints narrowing a category-level chooser to exactly one family open that family directly (rule recorded here as the u2 single-match shortcut applied symmetrically). Engine regression added: `head_profile=button` from `screws` → `catalog_list` bhss/10 records; `material=a2_stainless` still yields a 3-family chooser.
- Suites: lint green; `test-engine`, `test-engine-url-history`, `test-real-package` green; browser 16/16.
