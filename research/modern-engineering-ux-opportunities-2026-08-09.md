# Modern minimal engineering UX opportunities

**Date:** 2026-08-09  
**Wayfinder question:** Define a modern minimal engineering UX direction  
**Status:** Directional exploration; not validation, a visual redesign brief, or an implementation spec

## Direction in one sentence

PartSource should feel like a **constraint-aware, evidence-backed engineering workspace**: adapt the first view to the input, keep the selected technical state continuously visible, use compact comparison where alignment matters, and progressively disclose explanation and secondary actions—**never the engineering truth needed to judge the result**.

“Minimal” should mean fewer wrong turns, repeated cards, modal detours, and decorative surfaces. It must not mean fewer dimensions, hidden ambiguity, generic confidence badges, or an empty canvas that pushes the answer below the fold.

## Evidence posture

The labels in this report mean:

- **Confirmed:** established by the authoritative product contract, current repository/runtime observation, or prior completed research—not necessarily validated user demand.
- **Strong hypothesis:** supported by multiple reference patterns and the product model, but still needs task testing.
- **Open question:** consequential and not answered by current evidence.
- **Nice-to-have:** potentially useful after the core selection/truth loop works.
- **Rejected:** directionally wrong or unsafe for this POC.

The family-first model itself remains unvalidated. Current evidence supports fragmented terminology, multidimensional fastener choice, and identifier-led recovery, but does not prove PartSource beats McMaster, Google, supplier catalogs, or internal history.[4][5][9]

## What must an engineer see first?

Not “a beautiful part.” First show the **decision state**.

### Always visible

1. **Original input** and the system's interpretation, separately: retained terms, parsed constraints, unresolved terms.
2. **Object type:** family candidate, incomplete requirement, one published configuration, external identifier mapping, or supplier search destination.
3. **Truth state:** unique / multiple remain / invalid by supported rule / not indexed / unknown / unavailable.
4. **Decision-critical facts and omissions:** family-changing geometry plus fit- and specification-changing values. For a screw this likely includes head/drive, measurement system, thread and pitch, length, material/strength, finish, thread coverage, and standard—but the exact first set must be family metadata and user-tested.
5. **Evidence summary:** what record supports the configuration, what mapping supports the identifier clue, catalog release/review state, and conflicts or unsupported fields. Full citations can be one action away; uncertainty cannot.
6. **Reversible next action:** refine, compare, select, save to BOM, or open clearly labeled supplier searches.

### Adapt by intent

- **Broad text (`M4 screw`):** show retained `M4`, unresolved family-changing distinctions, and a short family shortlist with accurate silhouettes—not configurations or a generic product grid.
- **Family-specific text (`M4 socket head screw`):** open the family with M4 applied; lead with unresolved high-consequence attributes and remaining published configurations.
- **Configuration text (`DIN 912 M4 × 12`):** show what is resolved, what is still missing, and whether more than one record remains; do not silently choose strength or finish.
- **Known identifier (`91290A115`):** show the resolved configuration identity and key facts immediately, then the separate identifier-mapping evidence; collapse family exploration until requested.
- **Saved/BOM context:** show the frozen snapshot first and any catalog-release difference second; never silently refresh the line.

This intent-adaptive hierarchy follows the repository's domain distinction among family, configuration, identifier, provenance, supplier destination, and BOM snapshot.[1] It also preserves the leading dual-intent hypothesis without forcing exact lookup through family ceremony.[3][4]

## Fundamental problems and opportunities

| Area | Status | Problem / opportunity | Direction—and where minimalism must stop |
|---|---|---|---|
| **Search entry** | **Strong hypothesis** | One input must accept rough language, dimensions, standards, and identifiers. Current suggestions are configuration rows and submission routes nearly everything to `/parts/<input>`, hiding intent classification.[3][6][7] | Use one persistent editable combobox, but group suggestions by **intent**: exact identifier, family, interpreted configuration, recent/saved. Preview parsed chips and unresolved text before navigation. Preserve raw input. Follow the WAI combobox pattern and expected arrow/Enter/Escape behavior rather than a visually custom but semantically generic dropdown.[17] |
| **Family discovery** | **Strong hypothesis** | Broad mechanical intent floods variant cards or forces an arbitrary family. Family boundaries are technically meaningful and the dataset's import buckets are not safe families.[4] | Present 3–7 compact family rows, each with plain name, one geometry-changing distinction, matched constraints, and coverage. Use silhouettes to answer “which shape/function?” Cards with repeated screws and marketing descriptions are excess, not clarity. |
| **Configuration** | **Strong hypothesis** | A filter state is a requirement, not a BOM-ready part. Wizards prevent invalid choices but hide comparison; filter walls expose everything but bury dependency.[3] | Use ordered, dependent selectors for consequential choices plus a compact valid-record view. Direct editing remains available to experts. Explain disabled values inline (`conflicts with …`, `not covered`), not only in hover tooltips. Persistent selection summary is non-negotiable. |
| **Technical density** | **Strong hypothesis** | Modern SaaS often mistakes whitespace for clarity; legacy catalogs mistake undifferentiated density for expertise. Current 10–12 px uppercase metadata and repeated cards spend space without increasing understanding.[3][6][7] | Be sparse between concepts and dense within comparisons. Align labels, values, units, and decimal/tabular numerals. Use prose-sized type for reading; reserve monospace for identifiers/code-like values. Compact rows should remain scannable at zoom. Carbon and Observable both treat tables as efficient, sortable, progressively expandable/selectable surfaces—not something to replace with cards by default.[15][16] |
| **Diagrams / geometry** | **Confirmed problem; open solution** | The current generic schematic can depict the wrong head form and labels itself `Scale 1:1`; the local detail layout gives an aspect-square viewer a full column, and the hosted page can place the selected identity below the first viewport.[7][8] Shape is useful, but similarity does not prove fit, material, tolerance, standard, certification, or equivalence.[3] | Geometry is an instrument: accurate family silhouette for disambiguation; source-backed dimensioned drawing for confirmation; optional overlay for comparison. Every callout maps to a text fact and source. Suppress geometry if unsupported. Reject generic hero 3D, false scale, ornamental rotation, and mandatory gestures. |
| **Comparison** | **Strong hypothesis** | Engineers often need “what differs?” rather than five full detail pages. Current related configurations use shared thread/type, not a controlled family comparison.[7] | Let users pin 2–4 configurations, choose a baseline, group rows by fit / strength / environment / standard, and toggle `All facts` / `Differences only`. Unknown, not reported, conflicting, and genuinely different must be visually and textually distinct. CAD systems make graphical/discrete version comparison first-class; Onshape compares workspaces/versions at any history point, and Creo compares geometry, structure, and attributes.[13][14] Never label nearby configurations “equivalent.” |
| **Provenance / confidence** | **Confirmed requirement** | `Indexed` describes storage, not evidence. A single green badge or numeric “93% confidence” collapses different questions: record publication, source support, parser certainty, identifier mapping, and application suitability.[1][2][3] | Use an evidence stack: **configuration record**, **identifier mapping**, **field/source coverage**, **release/review date**, **conflicts**. State scope in plain language. A provenance model can borrow the entity/activity/agent distinction conceptually without implementing W3C PROV-O for the POC.[21] Confidence should be an explainable status and completeness, not theater. |
| **Part / configuration detail** | **Strong hypothesis** | Current detail gives the schematic priority, duplicates identity across a number and subtitle, scatters caveats in similar amber boxes, and places a full BOM form in the research flow.[7][8] | Use two depths: a selection inspector in the family workspace and a deep-linkable technical record. Above the fold: configuration identity, state, critical facts, unknowns, evidence summary, compare/save. Full dimensions, identifiers, sources, notes, and destinations follow. Do not make a standalone SKU-looking page the canonical mental model. |
| **BOM** | **Confirmed foundation; open workflow** | Frozen local snapshots, named BOMs, quantity editing, and export protect historical truth. The unresolved question is whether BOM capture is natural or premature.[2][4][5] | `Add selected configuration` is a lightweight commitment: active BOM + quantity first; notes/cost/new-BOM fields afterward. Show snapshot release and provenance. Keep duplicate behavior explicit. Separate `Save requirement` from `Add configuration` if incomplete lines are later supported. A future batch resolver may be more valuable than a dashboard. |
| **Supplier handoff** | **Confirmed boundary; open value** | Search URLs are not listings, offers, equivalence, availability, or supplier qualification. Prior research says their incremental value may be only query generation.[2][4][5][9] | Keep handoff secondary to complete selection. Show the exact outgoing query, open in a new tab, retain PartSource state, and provide a short verification checklist. Prefer `Copy specification` and `Search this configuration on …` over supplier-logo commerce cards. Do not rank “best” suppliers without sanctioned evidence. |
| **History / reuse** | **Strong hypothesis** | Engineers reuse previous decisions, opaque identifiers, BOM lines, and internal history. Current browser-local BOM snapshots help, but search/configuration history is not first-class.[4][9] | Add recent searches, recent configurations, re-openable URLs, and `Use as starting point`. Later, show a factual diff between a saved snapshot and current release. JupyterLab's named workspaces preserve interface state and Onshape's history supports comparison/restoration; the transferable pattern is recoverable state, not their full document models.[12][13] |
| **Keyboard use** | **Strong hypothesis** | Experts benefit from speed, but shortcuts can become invisible or platform-wrong. The current UI displays `⌘K` even though users may be on Windows, and clickable card containers are not an adequate keyboard model.[6][8] | `/` or Ctrl/Cmd+K focuses search; arrows traverse grouped suggestions; Enter opens; Escape clears/returns; table rows and filters have predictable focus; `C` compares and `B` saves only when not typing. Every action also has a visible button/menu route. Linear exposes search via keyboard, mouse, and command menu; VS Code combines command search, keyboard navigation, high contrast, zoom, screen readers, and an accessible diff view.[10][11] |
| **Responsive behavior** | **Confirmed requirement; open depth** | A shrunken desktop matrix is unusable; a phone may be best for lookup/review/BOM capture rather than exhaustive configuration. The behavioral prototype merely simulates a fixed 390 px phone and is not accessibility validation.[3][4] | Recompose: search → state summary → critical selectors → compact records → sticky selection action. Replace wide tables with user-chosen comparison attributes or stacked difference groups; let genuinely 2D diagrams/tables scroll within a labeled region. WCAG reflow expects content at 320 CSS px without two-dimensional scrolling except content whose meaning requires it.[18] Sticky bars must not obscure keyboard focus.[20] |
| **Empty / error states** | **Confirmed truth model** | `No results` conflates unsupported language, ambiguous intent, invalid combination, absent catalog coverage, unknown validity, and service failure.[2][3][5] | Preserve input and constraints, state what happened, and give the nearest safe recovery. Distinguish: no input; unresolved term; multiple families; multiple configurations; invalid by supported rule; plausible but not indexed; unknown; identifier not found; search unavailable. Never replace failure with guessed cards. |
| **Accessibility** | **Confirmed requirement** | Engineering density can become tiny text, color-only state, hover-only evidence, keyboard traps, or inaccessible canvas interaction. | Target WCAG 2.2 AA. Use native headings/forms/tables where possible; use ARIA grid only for truly interactive cells. Status changes need text plus polite live announcements. Geometry needs text equivalents and keyboard-independent facts. Minimum pointer targets are 24 × 24 CSS px or sufficiently spaced, with larger targets preferable.[19] Support 400% zoom/reflow, visible unobscured focus, reduced motion, high contrast, and no color-only meaning.[11][18][20] |

## Five deliberately different experience concepts

These are competing learning vehicles, not screens to merge indiscriminately.

### A. Truth-first resolver cockpit

**Metaphor:** a restrained engineering workbench.  
**Flow:** universal resolver → family shortlist or exact selected state → left constraints / center configurations / right evidence inspector. Exact lookup collapses the left and center until `Explore family`.

**Why it could win:** one model serves broad and exact intent; it directly extends the leading family-workspace hypothesis; dense comparison and provenance remain adjacent to selection.[3][4]  
**Failure mode:** three panes become a crowded enterprise admin UI; inspector competes with configuration rows; mobile composition may feel sequential rather than “the same app.”  
**Highest-uncertainty question:** can users identify the configuration and explain its evidence within seconds while exact lookup remains as fast as direct detail?

### B. Mechanical notebook

**Metaphor:** a scientific/developer notebook with an inspectable derivation.  
**Flow:** type a phrase or identifier; each interpretation becomes an editable step (`Family = …`, `Thread = …`, `Unresolved = …`); results react below; pin a complete state as a named selection. The transcript is history, share link, and rationale.

**Why it is radical:** it makes parsing, constraint changes, and provenance auditable rather than hiding them behind filters. It is naturally keyboard-first and supports reuse. Reactive scientific tools demonstrate that inputs, tables, and outputs can remain tightly coupled; Observable tables can lazily render, sort, select, and react to search.[15]  
**Failure mode:** feels like a developer tool, overexposes system mechanics, and makes ordinary lookup verbose.  
**Highest-uncertainty question:** do engineers value an inspectable derivation enough to accept the unfamiliar interaction, or do they only want the resolved facts?

### C. Geometry atlas

**Metaphor:** a lightweight CAD family map.  
**Flow:** broad query opens a field of accurate orthographic silhouettes; choose geometry-changing features directly on the drawing; dimension callouts become selectors; valid records update beside it; selected and baseline drawings can overlay.

**Why it could win:** head shape, drive, flange, shoulder, and retention features are faster to recognize visually than taxonomy terms. CAD comparison establishes geometry overlays/diffs as a credible engineering pattern.[13][14]  
**Failure mode:** geometry becomes decorative authority, source coverage is inadequate, text/keyboard access becomes second class, and materials/standards disappear behind “looks right.”  
**Highest-uncertainty question:** which decisions become faster and more correct with a drawing, and can users still notice non-geometric differences and unknowns?

### D. Compare-first specification lab

**Metaphor:** a test-result diff, not a catalog.  
**Flow:** every query produces a small candidate set; select a baseline; columns show only consequential differences by default; family silhouettes or drawings annotate changed geometry; choosing one opens its evidence record.

**Why it could win:** transforms variant scanning into difference detection and challenges card-per-part repetition. It could work especially well for family ambiguity and “nearby configuration” tasks.  
**Failure mode:** comparison is overhead when one exact result exists; too many candidate columns; users may infer interchangeability merely because items are compared.  
**Highest-uncertainty question:** does a differences-first view reduce wrong selections without causing false-equivalence interpretation?

### E. BOM inbox and line resolver

**Metaphor:** issue triage for engineering inputs.  
**Flow:** paste/upload identifiers and descriptions first; each line gets a visible state (`resolved`, `needs family`, `needs attribute`, `not indexed`, `unknown`); open a line in a compact family resolver; frozen results return to the batch; export plus supplier handoffs happen at the batch level.

**Why it could win:** makes repeat work, history, and handoff the center rather than an afterthought; handles the observed reality that identifiers arrive inside BOM/CAD artifacts.[9]  
**Failure mode:** prematurely turns a discovery POC into a BOM application; casual one-off search becomes heavier; CSV matching and lifecycle questions expand scope.  
**Highest-uncertainty question:** do target engineers encounter enough multi-line recovery work for batch resolution to be the differentiated job rather than a later feature?

## Recommended prototype candidates, in order

### 1. First-15-seconds intent-adaptive shell — **prototype now**

Build only two high-fidelity states using the same reviewed data:

- `M4 screw` → family shortlist with retained constraint and unresolved distinctions;
- `91290A115` → selected configuration first, key facts and mapping evidence visible, family controls collapsed.

Compare against the current flow and the existing behavioral workspace. Test first visible facts, time to correct explanation, exact-lookup speed, focus order, 400% zoom/320 px reflow, and whether any state implies listing/equivalence. This is the highest-leverage uncertainty because it determines the hierarchy before visual styling.

### 2. Compare-first lab versus compact configuration rows — **prototype next**

Use 3–4 socket-head records with meaningful differences and explicit `unknown`/`not reported` values. Test baseline + differences-only against the hybrid table. Measure wrong selection, time, attribute recall, and false-equivalence language.

### 3. Geometry selector with a text-parity challenge — **prototype as a bounded spike**

Use three genuinely different reviewed families or profiles, not generic screw variants. Test silhouette-only recognition, labeled drawing selection, and text-only parity. Include one non-geometric trap (same shape, different standard/strength) to see whether geometry steals authority.

### 4. BOM line inbox — **prototype only if interviews show repeated/batch recovery**

Paper or low-fidelity first: five mixed lines, explicit match states, reopen/freeze/export. The decision is not visual preference; it is whether batch handling saves real work and produces repeat use.

The notebook concept is best tested with a lightweight clickable transcript after the first shell. Do not build all five concepts or combine their chrome before one proves a task advantage.

## Visual and interaction character

- **Technically calm:** neutral canvas, one restrained action accent, thin separators, minimal shadow, modest radii; no gradients, glass, animated “live index,” or bento dashboard as product identity.
- **Dense by alignment, not compression:** tables and property grids for comparable facts; whitespace between semantic groups; no sea of cards. Allow a later comfortable/compact density preference, but never solve density with 10 px essential text.
- **Geometry with a job:** small family silhouette near family identity; larger drawing only when accurate and interactive/inspectable. Selection facts remain visible beside it.
- **Typographic semantics:** sentence case; identifiers in monospace; numbers/units aligned; multiplication sign and unit spacing consistent; abbreviations expanded on first use.
- **State without theater:** text + icon/border/pattern, not color alone; no green pulse; no unqualified `verified`, `matched`, `available`, `similar`, or `alternative`.
- **URL as engineering state:** family, input, constraints, selected configuration, comparison baseline, and release survive refresh/share/back. Modal-only state is rejected.
- **Motion only for causality:** immediate restrained feedback when a constraint changes; respect reduced motion; never animate trust.

## Classification register

### Confirmed

- Configuration, identifier, supplier destination, provenance, and BOM snapshot are distinct objects with non-negotiable claim boundaries.[1][2]
- Current search/list/detail structure is configuration- and card-first rather than family-first.[3][6][7]
- The current large generic schematic receives too much visual priority and may inaccurately imply geometry/scale.[7][8]
- Current family taxonomy and data coverage are incomplete; blank/absent cannot mean impossible.[4]
- BOM snapshots must remain frozen; supplier actions are searches only.[1][2][4]
- Empty/error states must fail closed rather than guess.[2][5]
- Responsive, keyboard, zoom, focus, non-color state, and pointer-target behavior are core quality, not polish.[17][18][19][20]

### Strong hypotheses

- Intent-adaptive first views outperform one universal results/detail template.
- A shared family workspace with an inspector can preserve context without slowing known identifiers.
- Compact aligned rows and explicit diffs are more modern and useful than repeated cards for near-identical configurations.
- Evidence attached to selection is more understandable than a separate generic “trust” page or badge.
- Lightweight BOM capture followed by progressive fields preserves research momentum.
- Recoverable URLs and recent/saved states can turn one-off search into useful engineering reuse.

### Open questions

- Which facts must be first for each family and task—and who decides when standards conflict with common practice?
- Does family-first beat normal tools on real tasks, not visual preference?
- Matrix, rows, configurator, drawing, or diff: which representation wins for which family shape?
- How much provenance is enough for a quick decision without becoming disclaimer wallpaper?
- Do neutral supplier searches save meaningful work?
- Is phone use primarily lookup/review/capture, or must full configuration and comparison work equally well?
- Do engineers have enough repeated or batch identifier recovery to justify history/workspaces or BOM inbox?
- Can accurate, publishable geometry be sourced at sufficient coverage to earn a central role?

### Nice-to-have

- Search/command palette with discoverable, remappable shortcuts.
- Saved local workspaces, pinned comparisons, and named reusable requirements.
- Comfortable/compact density toggle.
- Barcode/camera identifier entry that returns candidates, never silent identity.
- Catalog-release diff for frozen BOM lines.
- Dark/high-contrast themes after the light theme and semantic states work correctly.

### Rejected

- Generic SaaS dashboard metrics as the default entry point.
- Random “featured” configuration cards under an empty search box.
- One global filter wall or one mandatory wizard for every family.
- Giant generic CAD/3D hero, false `1:1` labels, or geometry as proof of identity.
- Hiding pitch, standard, material/strength, finish, unknowns, coverage, or evidence to look minimal.
- One green `Indexed`/`Verified` badge or opaque numeric confidence score.
- `Similar`, `alternate`, `equivalent`, `available`, or supplier ranking without the required evidence.
- Shrinking desktop tables onto phones; hover-only facts; icon-only critical actions; keyboard shortcuts without visible alternatives.
- AI chat as the primary search surface. Natural language may be an input, but parsed facts and uncertainty must be deterministic and inspectable.

## Prototype decision principle

Choose the concept that lets engineers **reach and correctly explain one supported configuration, its unknowns, and its evidence with the least interaction cost**. Reject a “minimal” direction if users are faster only because the interface omitted a consequential fact.

## Sources

Local files were inspected on 2026-08-09. Public pages were checked the same date unless their own update date differs.

1. PartSource domain language: `CONTEXT.md`.
2. PartSource authoritative product contract: `research/product-contract.md`.
3. Family-first reference patterns: `research/family-first-reference-patterns-2026-08-09.md`.
4. Product-frontier synthesis: `research/product-frontier-synthesis-2026-08-09.md`.
5. Discovery benchmark: `research/poc-discovery-benchmark.md`.
6. Current finder/BOM UI: `web/src/pages/Home.tsx`, especially search routing, configuration cards, labels, and BOM tables.
7. Current detail UI: `web/src/pages/PartDetail.tsx`, especially `FastenerSchematic`, aspect-square viewer, status, specifications, BOM form, supplier searches, and related configurations.
8. Current public runtime, finder and representative detail route: https://jrambackup1-lgtm.github.io/partsource/ and https://jrambackup1-lgtm.github.io/partsource/parts/91290A115 ; behavioral prototype: `sketches/002-behavioral-family-workspace/`.
9. Mechanical discovery evidence and POC wedge: `research/mechanical-discovery-problem-evidence-2026-08-09.md`.
10. Linear, search via keyboard, mouse, command menu, filters, and recent searches: https://linear.app/docs/search
11. Visual Studio Code, accessibility, keyboard navigation, zoom, high contrast, screen readers, table-column keyboard resize, accessible views and diff navigation: https://code.visualstudio.com/docs/configure/accessibility/accessibility and https://code.visualstudio.com/docs/editing/tips-and-tricks
12. JupyterLab, interface, commands, and named workspaces: https://jupyterlab.readthedocs.io/en/stable/user/interface.html and https://jupyterlab.readthedocs.io/en/stable/user/commands.html
13. Onshape, graphical/discrete history comparison and keyboard shortcut search: https://cad.onshape.com/help/Content/Document/compare.htm and https://cad.onshape.com/help/Content/Home/keyboard_shortcuts_and_hotkeys.htm
14. PTC Creo View, part/assembly comparison across geometry, structure, and attributes: https://support.ptc.com/help/creo/view/r12.1/en/creo_view/visualization/creo_view/About_Compare.html and https://support.ptc.com/help/creo/view/r12.0/en/creo_view/visualization/creo_view/Comparing_Sub_Assemblies.html
15. Observable Framework, fast lazy-rendered, sortable, selectable, searchable/reactive table inputs: https://observablehq.com/framework/inputs/table and https://observablehq.com/framework/inputs/
16. Carbon Design System, data-table usage and accessibility: https://carbondesignsystem.com/components/data-table/usage/ and https://carbondesignsystem.com/components/data-table/accessibility/
17. WAI-ARIA Authoring Practices, combobox pattern and keyboard interaction: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
18. W3C, WCAG 2.2 Understanding SC 1.4.10 Reflow: https://www.w3.org/WAI/WCAG22/Understanding/reflow
19. W3C, WCAG 2.2 Understanding SC 2.5.8 Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
20. W3C, WCAG 2.2 Understanding SC 2.4.11 Focus Not Obscured (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum
21. W3C Recommendation, PROV-O provenance ontology: https://www.w3.org/TR/prov-o/
