---
title: Open accessible in-workspace detail after explicit selection
status: complete
label: wayfinder:implementation
created: 2026-08-11
source-spec: docs/specs/partsource-progressive-catalog-poc.md
---

# 36 — Open accessible in-workspace detail after explicit selection

**What to build:** Explicit pointer or keyboard activation opens synthetic record detail inside the catalog workspace. Desktop preserves the list beside a right-side panel; narrow screens use a full-height modal over the retained workspace. Highlight remains identity evidence, never a forced selection.

**Blocked by:** 33 — Build progressive catalog query and deterministic filters.

**Status:** complete — final release audit passed on 2026-08-12: desktop complementary detail, narrow inert modal, focus/scroll restoration, B15/B16/B17 browser coverage, and no console/page errors.

- [x] Visible result rows use accessible activation controls and open detail only after pointer click or keyboard activation.
- [x] Desktop detail at 768 CSS px and above preserves hierarchy, filters, count, list, highlight, selected row, and operable filters alongside the panel.
- [x] Narrow detail below 768 CSS px is a full-height modal over the retained mounted catalog workspace.
- [x] Detail renders only approved synthetic record facts, bundle/version, separate fact and mapping provenance, and the persistent synthetic notice.
- [x] Detail contains no prohibited commercial, supplier, BOM, AI, geometry, standards, suitability, approval, equivalence, or editable-fact surface.
- [x] Highlight and selection have non-colour meaning; selecting another row retains the exact highlight.
- [x] Focus return, Escape, visible focus indicators, 44 CSS px targets, 320 CSS px behavior, and reduced-motion rules are covered by the POC shell and browser tests.
- [x] Chromium browser tests cover highlight/selection separation plus desktop and mobile selection behavior.
