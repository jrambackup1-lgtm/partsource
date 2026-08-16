# UX prototype decision — focused catalog workspace

**Date:** 2026-08-15  
**Status:** Disposable Phase 2 recovery prototype completed; composition accepted for usability evaluation, not production implementation  
**Authority boundary:** This record does not change `research/product-contract.md`, authorize runtime work, or establish mechanical/data truth. The prototype is static, local, and wholly synthetic.

## Decision

Use a focused **Home/start + Catalog/family workspace** composition as the UX recovery direction to test:

1. Home starts a query and exposes the supported hierarchy without dashboard framing.
2. Persistent search and hierarchy browsing are equally valid entry paths.
3. Broad queries stop at a legible family-choice step.
4. Family pages combine family context, typed requirements, family-scoped facets, and an aligned technical table.
5. A unique exact identifier keeps the full family table, marks one row in amber, and explicitly says **Highlighted, not selected**.
6. A user row activation adds a separate blue **Selected** state and opens contextual detail.
7. Provenance appears as a concise source summary first and a claim-level evidence sheet on request.
8. Mobile preserves the same meanings with compact rows, a filter sheet, and full-screen selected-part detail.
9. The synthetic boundary remains prominent in the global surface and selected-part detail.

This composition is accepted as a disposable test surface because it makes the current deterministic interaction contract feel like a coherent technical catalog without restoring unsupported platform scope. It is not approval to reuse the prototype code in production.

## Prototype boundary

The prototype lives entirely in `.wayfinder/product-recovery/prototype/` and uses plain HTML, CSS, and JavaScript. It has:

- no build step;
- no network/API dependency;
- no persistence;
- no runtime AI;
- no changes to application runtime or package configuration;
- 30 locally generated, illustrative records derived from the current synthetic fixture concepts: three screw families × ten dimension/material/finish tuples;
- synthetic identifiers `PSYN-SCR-0001` through `PSYN-SCR-0030`, plus a deliberately non-unique `PSYN-SCR-COLLIDE` mapping.

Family orientation graphics are explicitly labelled **not dimensional / not to scale**. The prototype does not add standard, grade, suitability, or real-product claims missing from the fixture; grade/class is shown as **Not supplied** in detail.

## Patterns adopted

### From the recovery target and strongest historical/industry evidence

- **Small real shell:** compact PartSource identity, global search, Home, Catalog, and data-boundary information only.
- **Search + browse parity:** users can submit a clue or select a visible family card.
- **Visible hierarchy:** `Home / Screws / Family` remains above the workspace; broad search shows families as first-class choices.
- **Family orientation:** restrained orthographic line glyph helps distinguish cylindrical, button, and countersunk head families without implying dimensional evidence.
- **Requirement strip:** original query and applied typed values remain visible above filters and results.
- **Family-scoped facets:** labelled controls show self-excluding counts, units, query-locked values, clear behavior, and strict AND filtering.
- **Dense aligned table:** stable identifier/thread/pitch/length/datum/material/finish/drive columns replace repetitive result cards; identity and headers are sticky on desktop.
- **Exact/selection separation:** amber, icon, text, and status strip encode exact evidence; blue, icon, text, and inspector encode explicit selection. A row can visibly carry both states.
- **Contextual inspector:** detail appears only after click/Enter and groups identity, dimensions, form, material, unknown coverage, and source summary.
- **Progressive provenance:** per-field `ⓘ` opens normalized value, original notation, source type, canonical fixture reference, transformation, revision, support, and explicit non-support.
- **Fail-closed state design:** unknown identifiers, non-unique mappings, conflicts, unsupported terms, and empty result sets do not highlight or select.
- **Responsive semantic parity:** 375 px layout uses compact stacked result rows, a full-screen filter surface, full-screen detail, 44 px detail controls, focus return, and no page-level horizontal overflow.
- **Accessible interaction baseline:** semantic landmarks and tables, skip link, visible focus, keyboard row activation, live-region announcements, dialog focus trapping/Escape, reduced-motion, and forced-color rules.

## Patterns rejected

- Dashboard, KPI, activity, or “resume work” theatre.
- Sidebar destinations without a real job, including Workspace/BOM, account, admin, orders, or quotes.
- Supplier, price, stock, lead-time, availability, savings, procurement, or commercial actions.
- Suitability, approval, verified, equivalent, alternate, replacement, or interchangeability claims.
- Search-to-isolated-detail navigation.
- Exact-ID auto-selection or auto-opening detail.
- Fuzzy identifier matching, first-result fallback, or silent nearest-configuration substitution.
- Treating broad `stainless` as the specific `A2 stainless` fixture value; the prototype reports broad stainless as unsupported.
- Presenting unsupported standards, grades/classes, CAD, or dimensional drawings as facts.
- A default provenance dump containing raw traces, mapping IDs, or package internals above results.
- Glossy “passport” framing or opaque confidence scores that could give synthetic records false authority.
- Permanent empty inspector space that compresses the result table.
- Repeated result cards for variant-heavy family comparison.

## Deterministic scenario corpus

| State | Input/action | Expected prototype behavior |
|---|---|---|
| Home | Initial load | Start statement, two search surfaces, examples, three family cards, synthetic boundary |
| Broad | `screws` | Screws level, three family choices, 30 matching configurations, no selection |
| Broad constrained | `M4 screws` | Family step remains visible; family-card counts reflect M4 |
| Family | `socket head cap screws` | Socket-head family, facets, ten-row table, no selection |
| Family constrained | `M6 20 mm socket head cap screws` | Query chips and one strict-AND result, no selection |
| Exact unique | `PSYN-SCR-0006` | Socket-head context, all ten rows, amber row/status, no detail |
| Explicit selection | Click/Enter exact row | Same row carries exact evidence plus blue Selected state; detail opens |
| Exact unknown | `PSYN-SCR-9999` | Zero-mapping explanation; nothing highlighted/selected |
| Mapping collision | `PSYN-SCR-COLLIDE` | Non-unique explanation; neither mapped family is chosen |
| Conflict | `M4 M5 screws` | Conflict explanation; no results or implicit preference |
| Unsupported | `brass screws` | Unsupported-term explanation; no fallback |
| Unsafe broad alias | `stainless screws` | Unsupported-term explanation; not converted to A2 |
| Empty | `M4 25 mm socket head cap screws`, or equivalent facets | Family remains visible, zero-result explanation, no nearest result |
| Provenance | Select row, activate a fact `ⓘ` | Claim-level evidence modal with explicit limits |

## Acceptance checklist

### Implemented in the disposable prototype

- [x] Home/start surface is not a dashboard.
- [x] Persistent global search is available on Home and Catalog.
- [x] Supported hierarchy and family cards are visible.
- [x] Broad search makes the family step explicit.
- [x] Family workspace retains breadcrumb, family definition, orientation-only glyph, original query, and active constraints.
- [x] Facets are family-scoped, labelled, counted, deterministic, and removable.
- [x] Result list is a dense family-specific table with deterministic ordering and mobile compact-row fallback.
- [x] Non-exact search never auto-selects.
- [x] Unique exact search keeps the full family list and highlights one row without opening detail.
- [x] Exact highlight uses amber plus icon/text; explicit selection uses blue plus icon/text.
- [x] Detail opens only through explicit click/Enter and preserves family/list context.
- [x] Detail shows grouped facts, `Not supplied` coverage, source summary, and per-field evidence.
- [x] Unknown, collision, conflict, unsupported, and empty states fail closed.
- [x] Synthetic notice is prominent globally and repeated inside selected detail.
- [x] No dashboard/supplier/price/stock/procurement/equivalence/suitability behavior is present.
- [x] Desktop keyboard selection, modal focus/Escape, mobile filter sheet, mobile full-screen detail, reduced motion, forced colors, and 375 px no-overflow behavior are represented.

### Requires user or specialist validation before adoption beyond prototype

- [ ] Unfacilitated users identify active category and family quickly.
- [ ] Users find an exact-highlighted row quickly and correctly explain highlight versus selection.
- [ ] Table columns improve real near-variant comparison rather than only increasing density.
- [ ] Contextual inspector improves selected-part understanding without hiding too much table context.
- [ ] Filter labels, counts, and query-locked values are understandable to practicing mechanical engineers.
- [ ] Claim-level evidence is discoverable without dominating the default workspace.
- [ ] 320 px reflow, 200% zoom, screen-reader announcements, and forced-color behavior receive dedicated assistive-technology review.
- [ ] Any family glyph or future drawing is reviewed for mechanical clarity and evidence boundaries.
- [ ] Any production implementation is rebuilt against approved production catalog contracts rather than copying this fixture-specific code.

## Test evidence

### Automated browser smoke

Served locally with:

```text
python -m http.server 4173 --bind 127.0.0.1
```

Executed from `.wayfinder/product-recovery/prototype/`:

```text
node --check app.js && node smoke-test.mjs
```

Result on 2026-08-15: **PASS**, with nine reported checks:

1. Home/start, global synthetic notice, persistent search, and three family cards.
2. Broad query and 30-record family step.
3. Family/dimensional strict-AND query with no auto-selection.
4. Facet updates and empty state.
5. Amber exact highlight, keyboard selection, blue selected state, and inspector.
6. Focused progressive evidence dialog and evidence limits.
7. Unknown, collision, conflict, and unsupported fail-closed states.
8. No uncaught JavaScript errors during the desktop run.
9. 375 × 812 mobile no-overflow layout, filter sheet, and full-screen detail.

The test writes `prototype/mobile-evidence.png` as a disposable narrow-screen visual artifact. Manual browser inspection also found no console errors on Home or the exact/selected workspace.

## Follow-up decision gate

Proceed only to moderated composition testing, not production runtime implementation. The next review should compare task clarity for the family step, table, and contextual inspector independently. Keep or revise each pattern based on observed task performance. Do not infer mechanical authority, real-data readiness, workspace value, or commercial scope from a successful synthetic UX test.
