# User-Perspective Issue Audit — 2026-08-16

**Type:** Evidence + ticket basis. Not a contract change.
**Authority:** `research/product-contract.md` remains sole authority. This audit records user-perspective findings only.

## Method

Live product testing (dev build, Playwright walkthroughs at 1280/768/390/320px), engine probes (`resolveCatalogQuery` etc.), code review, real-dataset aggregate inspection, competitor pattern research, and adversarial challenge. Six independent reviews: UX/product, mechanical-engineer workflow, catalog/search architecture, competitor patterns, mobile/accessibility, adversarial.

Separation kept throughout: **internal evidence/debug information is not user experience.** One direct contradiction surfaced: recovery ledger R5 records an "explicit family step" as closed, but every user-path test shows broad queries ("screws", "M4 screw") skip the family step and flatten mixed families into one table. The encoded tests pass; the user experience violates `research/product-contract.md` ("Broad catalog input makes the family step explicit").

Real dataset facts (aggregates, internal only; confidential origin never published): 27,009 rows (hex-head 8,850 / rounded-head 10,295 / socket-head-cap 7,864), 192 distinct subcat families, largest subcat 2,432 rows, 26,953 non-blank McMaster PNs — **zero duplicate PNs, 100% separator-free alphanumeric** — 56 rows with blank PN + part number, inch/metric mixed in every file, material strings embedding finish, per-category schema forks (`socket_head_profile`, `rounded_head_style`, `head_width`, `fastener_strength_grade_class`).

## Part 1 — Confirmed issues (owner's list)

| # | Owner issue | Verdict | Class |
|---|---|---|---|
| 1 | Dataset too small; need scalable catalog structure | **Confirmed.** 30 synthetic records; the approved 27,009-record cofounder dataset is in-repo but cannot load: parser budgets reject it outright (~81 MB package vs 2 MB cap; 27k-item arrays vs 10k cap; ~4.5M structural nodes vs 100k cap), the catalog ships as a TypeScript module parsed at import (no fetch seam), and no CSV→CatalogPackage builder exists. Nuance: publication to production remains gated (mechanical review, field adjudication, publication approval — register + Phase 6 evidence). The pipeline and a dev-loadable catalog release are buildable now; publishing real data is not. | CRITICAL |
| 2 | `M4 screw` must show families first, not 6 mixed rows | **Confirmed — contract violation.** Resolver has no category/family-chooser state; a broad query resolves to a category node with `familyId: null` and returns every family's records flattened (`resolver.ts`, `filter-facets.ts orderedConfigurations`), with **zero facets** at that level. Family identity appears only as a table column and the left browse tree (a nav control, not a result choice). Clicking a family also **drops the query's M4 filter** (browse re-resolves from the family label). Nuance: at real scale "M4" spans ~990 rows across families, so a family step is unavoidable; keep a single-match shortcut so one extra click is never forced when only one family matches. | CRITICAL |
| 3 | Exact McMaster PN → correct family/list + highlighted row | **Confirmed.** Real McMaster PNs can never enter the exact path: `looksLikeUnqualifiedIdentifier` requires ≥2 separators; all 26,953 real PNs are separator-free, so `91290A331` falls through to the query interpreter and dies as "Search terms not recognized" — the wrong failure class for the most common pro workflow. No `mcmaster_pn` identifier namespace exists. Data supports the rule once wired: 0 duplicate PNs; the 56 blank-PN rows must fail closed. | CRITICAL |
| 4 | Detail must show the McMaster PN; preserve family context | **Confirmed.** Inspector shows PSYN synthetic IDs and internal revision IDs (`synrec-v1-shcs-01:r1`) as content; no source PN can be displayed because no mapping data exists. Context preservation itself works well (inspector keeps family/list state; URL restore verified). Detail also lacks the fields engineers select on (strength grade/class, tensile, hardness, standards met, head dims, drive size). | HIGH |
| 5 | Product shell / top-level navigation | **Challenged — no expansion now.** The contract fixes Home + Catalog as the two surfaces; Home is explicitly not a dashboard; Workspace/BOM is deferred. No evidence justifies Dashboard/cart/etc. — that is scope creep. Honest minimal shell fixes only: hardcoded counts ("30"/"10"/"View all 30 configurations"), hardcoded browse tree and table columns, and optionally a "Browse catalog" header link. Recorded as decision, not a ticket. | LATER (fixes folded into u5) |

## Part 2 — New issues found

### CRITICAL

- **N1. Catalog architecture physically rejects real data.** Budgets (`parse-catalog-package.ts`: 2 MB, 25k rows, 10k/array, 100k nodes) vs measured need (~81 MB, 27k, 27k, ~4.5M). Digest verification re-serializes the full graph twice and hashes in pure JS: 47 ms at 30 records → ~43 s at 27k. Catalog is a module-load TS import with no fetch seam, no build artifact, no code splitting.
- **N2. No ingestion path.** Nothing converts CSVs into hierarchy/families/schemas/facts/facets/mappings/provenance/lexicon. Nontrivial mapping: subcat URL paths → 2 category levels + 192 families; per-family schema forks; mixed inch/metric (`thread_system` enum is `metric`-only — rejects about half of real rows); material strings embedding finish; 878 distinct composite `specifications_met` values; lexicon must be generated (thousands of terms), not hand-authored (16 rules today).

### HIGH

- **N3. Engine performance at real scale.** Per-record identifier scan is O(records × mappings): a single "screws" search measures **18.7 s** at 27k mappings (needs a `mappingsByConfigurationRevisionId` index). Facet computation is 222–244 ms per call for the 2,432-record family and runs twice per render (App + Facets) plus on every keystroke in the search box.
- **N4. Result list unusable at family scale.** All records rendered as `<tr>` **and** always-mounted mobile cards (no pagination/virtualization → ~54k DOM nodes); no user sorting; single-select AND-only filters (no OR, no ranges — "18-8 OR 316" impossible); dropdowns list every declared value including selectable (0) dead-ends; a 180-value length dropdown is foreseeable.
- **N5. Family granularity undecided — blocks ingestion.** Family := subcat (McMaster-like) bakes material/grade into family identity and makes the real comparison job cross-family (where no facets exist); family := head form (current) yields one 7,864-record family and loses per-family columns. Drive style is family-defining in real rounded-head subcats but a constant fact in the synthetic model. Must be decided before the ETL is written.
- **N6. URL correctness.** `?q=M4+screws&family=css` hydrates to the css family with the M4 filter **silently dropped** — results contradict the visible query, and the URL round-trips the misleading state. Any unknown param (`utm_source`) triggers the alarming "Catalog link could not be restored" warning. `URL_FACTS` is a fixed 5-param list, so any future filter silently vanishes from shareable URLs.
- **N7. Sticky topbar broken; mobile chip rail clipped.** `overflow-x: hidden` on html/body defeats sticky positioning — the global search scrolls away (measured topbar at −589 px). The mobile browse rail overflows its grid track: the last family chip is permanently unreachable at 390 px and ~110 px is clipped at 320 px.
- **N8. Screen readers get nothing after search.** Focus stays in the input; the result-count heading is neither focused nor announced (facet changes already do this correctly — asymmetric). Failure cards announce politely instead of assertively.
- **N9. Internal jargon above the result task.** The exact-match banner prints `Mapping evidence: synmap-v1-01 · prov.mapping.synthetic.v1` above the results — the contract places raw identifiers in optional diagnostics, not above the result task. The inspector surfaces revision IDs and namespace strings as content.

### MEDIUM

- **N10. Fail-closed over-fails on partial queries.** "M6 socket head cap screw 20mm A2" returns nothing because the lone token `a2` isn't a lexicon phrase; "M3" fails (not in allowedValues); "button head" fails though a Button-head family exists. The contract's own wording ("apply only supported typed filters; keep unsupported query terms as query text") suggests recognized facts should apply while unknown terms stay text. Needs a reviewed decision — determinism is preservable either way.
- **N11. Exact-banner false statements.** Selecting a row other than the exact match flips the banner to "the mapped configuration is selected" (it isn't); after a filter excludes the exact row, the banner still claims a highlighted row exists. Also: filter-excluding-exact-row silently drops the highlight with no note.
- **N12. Terminology mismatch.** "Configurations" vs engineer vocabulary (parts / part numbers); "A2 stainless" vs the dataset's and US engineers' 18-8 / 316 / Grade 5 / Class 8.8; `PSYN-SCR-0001` IDs encode nothing; placeholder says "exact synthetic ID".
- **N13. Synthetic story over-told; hero sells internals.** Four stacked disclaimers plus a sha256 chip that reads like a build hash; hero copy ("small, deterministic catalog… traceable synthetic evidence") describes the test harness, not the user value.
- **N14. Contrast/size cluster.** Focus ring 2.81:1 (<3:1); four grey metadata text pairs 3.6–3.98:1 (<4.5:1); exact-match label at 9 px; table headers 10 px.
- **N15. ARIA/semantics cluster.** `aria-selected` on plain `<tr>` (invalid outside a grid); search input's `aria-label="Query"` overrides its good label; two focusable actions per row with inconsistent state exposure; `th` lacks `scope`; mobile inspector doesn't lock background scroll; tablet/zoom users must horizontal-scroll each row to reach Inspect.
- **N16. Hardcoded UI values.** Counts ("30", "10"), table columns (contract promises family-specific columns; `countersink_angle_deg` never shown for the css family), and the browse tree are literals.

### LATER

- Latent `invalid_selection` engine dead-end (unreachable from UI today); lexicon build-out scale (measured fine to ~5.3k rules, ~20 ms); mobile cards repeating the full 8-fact grid; identification aids at the family decision point (Bolt-Depot-style); numeric range selection on spec columns (McMaster's most-requested gap — genuine differentiator); public-projection provenance flow for eventual real-data publication; identification chips/series context (PN anatomy à la MISUMI).

## Part 3 — Root causes

1. **The catalog was built as a contract fixture, not a data product.** One TS module, module-load parsing, budgets sized for 30 records, runtime pure-JS digest, hardcoded counts/columns/tree, no build/ingestion seam. Every scale failure follows from this.
2. **The resolution state machine has no category-level state.** Broad queries jump straight to a flattened record list; facets are gated on `familyId`; family browse re-resolves instead of switching context with constraints. The recovery tests encoded "family step" as something the user never experiences on the primary path.
3. **The identifier model was designed around synthetic shapes.** The separator heuristic matches `PSYN-SCR-0001` and nothing real; no namespace-pattern recognition; no McMaster namespace.
4. **Family/schema modeling was never decided against the real taxonomy** (subcat granularity, inch/metric, material-embedded finish, family-specific columns). This single undecided question blocks ingestion, facets, and table design.
5. **UI mechanics debt concentrated in accessibility** (sticky header, post-search announcement, contrast, focus) — small fixes with outsized trust impact.

## Part 4 — Recorded decisions (no direction change)

- **D1 — Shell:** keep Home + Catalog as the only surfaces. No Dashboard, cart, workspace, or global nav expansion without new evidence and a reviewed contract change. Shell fixes are limited to removing hardcoded values (u5) and optional "Browse catalog" affordance.
- **D2 — Data gates hold:** building the ingestion pipeline and loading real data as a **dev/local catalog release** is authorized work; publishing real data to production still requires mechanical review, field adjudication, and publication approval per `research/data-source-register.md` and Phase 6 evidence. Confidential origin is never exposed.

## Part 5 — Ticket set and order

Tickets in `.wayfinder/product-recovery/tickets/`:

| Ticket | Title | Class | Depends on |
|---|---|---|---|
| [u1](tickets/u1-real-catalog-ingestion-pipeline.md) | Real-catalog ingestion pipeline + scalable package loading | CRITICAL | — |
| [u2](tickets/u2-family-step-resolution.md) | Family-step resolution for broad queries | CRITICAL | — |
| [u3](tickets/u3-exact-mcmaster-part-number-path.md) | Exact McMaster part-number path + identifier display | CRITICAL | u1 (data); engine part can land earlier |
| [u4](tickets/u4-scalable-result-list.md) | Scalable result list, facets, and URL correctness | HIGH | u1, u2 |
| [u5](tickets/u5-honest-detail-and-language.md) | Honest detail view + UI language pass | HIGH | u3 for PN display; copy fixes independent |
| [u6](tickets/u6-accessibility-layout-mechanics.md) | Accessibility and layout mechanics | HIGH | — (independent) |

Order: **u1 ∥ u2 ∥ u6 first** (unblock everything, independent), **u3 next**, **u4 after u1+u2**, **u5 last** (u3-dependent parts; copy fixes anytime).

Mapping to confirmed issues: #1→u1; #2→u2; #3→u3; #4→u5 (+u3); #5→D1/u5. New-issue coverage: N1/N2/N5→u1; N10→u2; N6/N3/N4→u4; N9/N11/N12/N13/N16→u5; N7/N8/N14/N15→u6.
