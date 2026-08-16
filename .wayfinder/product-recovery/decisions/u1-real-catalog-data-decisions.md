---
title: u1 real-catalog data decisions
status: decided
created: 2026-08-16
ticket: ../tickets/u1-real-catalog-ingestion-pipeline.md
authority: This file records build-time data decisions only. `research/product-contract.md` remains sole product contract; `research/data-source-register.md` remains the permission gate.
---

# u1 — Real-catalog ingestion decisions (recorded before ETL code)

Basis: the 2026-08-16 dataset profile (27,009 rows; hex 8,850 / rounded 10,295 / socket 7,864; 192 distinct subcats; 26,953 separator-free unique McMaster PNs, zero duplicates; 76 of 192 subcats mix inch and metric rows) and the user-perspective audit (N1/N2/N5).

## D1 — Family granularity: subcat-as-family (McMaster-like)

- **Decision:** one catalog family per source `subcat` slug (192 families), grouped under three category nodes (hex-head, rounded-head, socket-head-cap) below the `Screws` root.
- **Why not head-form families:** the three head-form families would hold 7,864–10,295 records each with heterogeneous columns, mixed systems, and ~180 length values — no coherent per-family comparison table, which is the product's core job. Subcat families (largest 2,432; median far smaller) match how engineers actually enter the catalog and keep per-family columns meaningful.
- **Why not hybrid:** material/grade/profile are already typed facts inside each subcat family; a second head-form grouping layer adds a state the resolver does not need for any current contract flow.
- **Cross-family comparison** (e.g. 18-8 vs 316 across subcats) is the job of the category level — served by the u2 family chooser with live constraint-aware counts, not by flattening records.

## D2 — Fact model: shared facts + per-file fork facts; dual inch/metric numeric facts

- **Shared string-enum facts** (raw source values, no spelling normalization): `thread_size`, `threading`, `thread_type`, `thread_spacing`, `thread_direction`, `thread_fit`, `drive_style`, `material`, `finish`, `tensile_strength`, `hardness`, `specifications_met`, `rohs_compliance`.
- **Dual numeric facts** parsed per value format (never converted across systems): `nominal_diameter_mm` / `pitch_mm` / `length_mm` / `head_*_mm` for mm values; `diameter_in` / `tpi` / `length_in` / `head_*_in` for inch values. The slot not carried by a row is `not_applicable` with the reason naming the expressed system. 76 subcats mix systems, so every family schema carries both slots.
- **Fork facts** scoped to the files that carry the column: `socket_head_profile` (socket), `rounded_head_style` + `rounded_head_profile` (rounded), `head_width_in/mm` + `fastener_strength_grade_class` (hex), `drive_size` (rounded + socket), `min_thread_length_in/mm` (hex + socket), `head_diameter_in/mm` (rounded + socket), `finish` (hex + rounded only).
- **Parses are limited to decision-critical numerics** (diameter, pitch/TPI, length, head dims). Everything else stays a raw string enum — deterministic, no invented decomposition. `M<n>` diameter comes from `thread_size` (metric rows have blank `thread_diameter`); inch `tpi` from the `thread_size` suffix.
- **Sentinels:** `-` (tensile, specifications, head_diameter) and blanks become `not_supplied` with the source reason. `hardness` "Not Rated" is a real assertion and stays a value.
- **Material strings embedding finish** ("Zinc-Plated Steel") are kept verbatim as material identity — decomposing them is field adjudication, which is an external mechanical-review gate, not an ETL behavior. Same for finish spelling variants ("Zinc Plated" vs "Zinc-Plated").

## D3 — Identifier namespace and the 56 blank-PN rows

- **Namespace `mcmaster_pn`** (trim/upper/NFKC — the profile confirms every PN matches `^\d{5}[A-Z]\d{3}$`), one mapping per non-blank row. Zero duplicates verified → zero collision risk.
- **The 56 socket rows with blank PN are excluded from the release.** They are degenerate rows (blank `part_no`, `title`, `system_of_measurement`, `drive_style`, `head_type` — only 12 of 28–29 columns populated). Representing them would require inferring their thread system, drive, and head facts from family membership. Fail closed: excluded, counted in the evidence file; re-admission requires field adjudication.
- **`reach` column is dropped.** Its only non-blank value is "Compliant" — it duplicates `rohs` and is not a dimension. Recorded, not silently ignored.
- **Confidential origin** is never named in any artifact, log, or UI string beyond the register's own record. Provenance `sourceId` values identify the supplied file set, not the upstream origin.

## D4 — Hierarchy, labels, and lexicon generation

- Hierarchy: `Screws` root → 3 categories → 192 family nodes. Labels derive deterministically from the subcat slug (hyphen → space, small-word title-casing, numerals preserved).
- Lexicon rules are generated, never hand-authored: root/category phrases (singular + plural), one phrase per family label, one phrase per raw `material`/`finish` value, `fully/partially threaded`, `metric`/`inch`, `<spacing> thread` phrases, and safe drive phrases (`external hex`, `phillips`, `slotted`, `torx plus`, `tamper resistant torx`, `square`). Bare `hex` is deliberately not mapped (ambiguous between hex head and hex drive).
- **Collision policy:** globally unique normalized terms only. `thread_type` value phrases are skipped because `metric` collides with the `thread_system` phrase; family-scoped fact phrases (e.g. a generic `button head`) are skipped because the contract allows one rule per term and family labels already carry those words. Each skip is recorded, not silent.

## D5 — Package shape, budgets, and digest (dev release, not publication)

- **Artifact:** `web/catalog-releases/real-screws-v1.json`, produced by `npm run catalog:build-real` (Node ETL). The directory is gitignored and served **only** by the Vite dev server middleware; `vite build`/`vite preview` never include it, so the deployed artifact cannot ship real data (register: publication requires mechanical review, field adjudication, publication approval — decision D2 of the audit).
- **Manifest honestly represents dev status:** `dataOrigin: 'cofounder_private_dev'`, `allowedUse: 'private_dev_only'`, `publicationStatus: 'dev_release'`, no approval metadata. These are new schema literals added for this state; the synthetic and public-projection states are unchanged.
- **Digest computed at build time** with Node crypto over the canonical serialization. The runtime verifies the declared digest against a build-generated pinned identity module instead of re-serializing ~80 MB in the browser (measured ~43 s projected in pure JS). Full byte-level verification still runs in the audit script at build/test time.
- **Budgets re-scoped deliberately** (not just raised): bytes 2 MB → 256 MB, total rows 25k → 200k, per-array items 10k → 60k, structural nodes 100k → 12M — each sized ≥ 2× the measured authorized release shape (109.5 MB artifact, ~84k total array rows, 26,953-item arrays) and documented here. The parser's quadratic configuration-revision scan is fixed to a grouped map so 27k configurations validate in linear time.
- **App default is unchanged:** the synthetic package remains the module-load default. The real package loads only through the explicit `?catalog=real` development affordance and fails closed with a visible error if it cannot be loaded or verified.

## Consequences

- u3 (exact McMaster PN path) gets the `mcmaster_pn` namespace with unique mappings.
- u4 gets subcat-sized families (max 2,432 rows) to make pagination/virtualization tractable, plus the identifier index added with this work.
- Engineers comparing across materials at category level use the u2 chooser; a category-level facet engine remains u4 scope.
