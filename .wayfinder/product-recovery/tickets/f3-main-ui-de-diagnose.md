---
title: Remove internal/diagnostic content from the main UI
status: resolved
resolved: 2026-08-16
label: wayfinder:ticket
created: 2026-08-16
updated: 2026-08-16
audit: ../live-product-root-cause-2026-08-16.md
fixes: RC3
depends: f1 (parallel with f2)
---

## Problem (user perspective)

The detail view still reads like a debug harness. The inspector always renders a "Diagnostics: identity and mapping evidence" section whose content is internal evidence: `mapping map-hex-0262fa00072 · prov.mapping.hex`, source strings (`cofounder-csv:hex-head-screws.csv`), evidence refs (`evidence:private:cofounder-csv-hex-identifiers`), and "Internal revision `real-v1-hex-02`". The main notice bar shows a release digest chip. The contract places raw identifiers in **optional** diagnostics — these are not optional.

## Root cause

u5 (decision T4) deliberately relocated mapping/provenance/revision identifiers into a always-visible inspector section rather than making them optional; the notice bar's "Synthetic data" label and digest chip were left as-is. The ticket's own problem statement quotes the contract's "optional diagnostics" wording, so u5's resolution preserved part of what it was filed to fix.

## Scope

1. Inspector: keep **Part number** (the real PN, primary identity) and a clean one-line provenance label (e.g. "Cofounder dataset — local development"). Move mapping IDs, provenance IDs, evidence refs, and the internal revision ID behind a collapsed, clearly optional "Technical evidence" disclosure (or remove entirely — decide and record). Default view: none of these strings.
2. Notice bar: remove the digest chip from the default view (available in the optional disclosure); the bar states only what data the user is looking at.
3. Loading/error cards: user-language copy; no `npm run` commands, no file paths (f2 overlaps on the mislabel; coordinate).
4. Sweep for remaining internal shapes in user-facing strings (namespace labels, `synrec-*`/`real-v1-*`/`prov.*`/`map-*` patterns) — extend the existing contrast/accessibility sweep script pattern if useful.

## Out of scope

Removing provenance from the data model (it stays; only presentation changes); the synthetic-package PSYN IDs themselves while synthetic remains a visible fallback (f2 decides defaults).

## Verification (resolved 2026-08-16)

- Inspector identity section is now "Part number": the real PN (or PSYN id) plus one clean source label ("Cofounder dataset (local dev)" / "Synthetic fixture"). Mapping IDs, provenance IDs, source IDs, evidence refs, and the internal revision ID live in a **collapsed** "Technical identifiers" disclosure — recorded decision: optional disclosure, not removal, so audit evidence stays reachable.
- Notice bar: digest text removed; "Catalog: {releaseId}" remains with the full digest on the chip's tooltip.
- Browser spec updated to the disclosure-state contract: "Diagnostics" heading absent; "Part number" heading visible; technical disclosure closed by default (no `open` attribute), opens to reveal `synmap-…`/evidence refs/`Internal revision`, re-closes; per-fact `Evidence` disclosures unchanged (already optional). Note: Playwright `toContainText` reads `textContent`, which includes closed `<details>` content — absence is asserted via disclosure state, not raw text.
- Real-catalog probe: inspector title `92655A687`; default identity line exactly "Part number | 92655A687 | Cofounder dataset (local dev)"; disclosure closed; notice shows no digest text.
- Suites: lint green; browser 16/16 (shell 9/9 re-run after spec update).
