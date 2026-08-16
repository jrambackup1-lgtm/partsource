# Family-first reference patterns for PartSource

**Wayfinder question:** Resolve the family-first discovery interaction model  
**Research date:** 2026-08-09  
**Status:** Prototype recommendation, not a final specification

## Decision in one paragraph

PartSource should prototype a **dual-intent resolver feeding a family workspace**, not copy either Octopart's part-result list or McMaster-Carr's catalog page wholesale. Generic intent should rank a small set of mechanical families before showing individual configurations. A recognized identifier should open the same family workspace with the resolved configuration selected and an explicit statement that the identifier was an input clue, not an equivalence claim. Inside the family, use ordered, dependent mechanical attributes and a compact valid-configuration view; switch between a matrix and a progressive configurator according to the shape of the data. Keep a stable selection summary beside the controls, then expose evidence, BOM capture, and supplier-site searches from that selected state. The prototype should test whether this shared family context improves broad-intent and exact-identifier tasks without adding friction or false certainty.

## Scope and method

This review used public category, search, product, help, and app pages from Octopart, McMaster-Carr, MISUMI, TraceParts, 3Dfindit, Grainger, Zoro, Bolt Depot, Fastenal, and DigiKey. It also reviewed the current PartSource product contract and proof-of-concept pages. Public pages were inspected as they appeared on 2026-08-09; some sites varied by region, loaded client-side, or challenged automated browsing. In those cases, the finding is limited to official indexed pages or official documentation. No proprietary catalog data was copied.

The comparison is about interaction patterns and information architecture, not catalog completeness or business quality. Supplier prices, stock, purchasing, accounts, scraping, and equivalence remain outside the PartSource POC.

## The important distinction

“Family first” should describe **result priority and context**, not a rule that every query must be forced into one family page.

PartSource needs four separate concepts:

1. **Intent:** the user's original words or identifier.
2. **Family:** a stable kind of component with a coherent selection grammar, such as socket-head cap screws.
3. **Configuration:** a standards-led set of attributes, such as metric, M4 × 0.7, 12 mm, property class 12.9, black oxide, fully threaded.
4. **Commercial identity:** a manufacturer part or supplier listing. This is not present in the POC merely because a configuration exists.

That distinction is stronger than the one most benchmark sites need. McMaster is a seller; Octopart is organized around manufacturer part numbers and distributor offers; MISUMI can generate its own orderable codes. PartSource is currently a neutral configuration-discovery tool. Its UI must preserve that truth.

## What the products actually do

### 1. Octopart: search and compare individual electronic parts

**Observed pattern.** Octopart accepts keywords, manufacturer part numbers, categories, manufacturers, and distributors. Search pages expose category-specific technical filters alongside manufacturer, distributor, lifecycle, compliance, CAD, price, and availability controls. Its redesign separated `Specs` and `Price & Availability` result views because each task needs different columns and information density.[1][2] A part page is centered on a manufacturer part number and divides the record into price/stock, CAD models, alternate parts, compliance, and technical specifications.[3] The BOM tool accepts pasted or uploaded lines, maps fields, finds part matches, and carries matched lines into supplier comparison.[4]

**Transfers well.** One search box can resolve different intent types. Normalized, category-specific parameters are more useful than generic tags. Dense comparison columns should change with the user's task. Exact identifiers deserve a direct, high-confidence route. BOM lines need explicit matching state rather than silent acceptance.

**Fails if copied literally.** Electronics usually has a manufacturer part as the primary identity and many distributor offers beneath it. Standard mechanical hardware often starts with a configuration that may be made by many manufacturers and listed under many supplier SKUs. A flat “one card per part number” result set would duplicate near-identical screws, privilege whichever supplier identifiers were ingested, and blur configuration, manufacturer part, listing, and offer. Octopart's price, inventory, lifecycle, alternate-part, and distributor-centric hierarchy is also unavailable and inappropriate in this POC.

### 2. McMaster-Carr: editorial family pages with dense valid choices

**Observed pattern.** A broad socket-head-screw route remains inside a product family. The page combines explanatory family sections, drawings, consequential properties, context-specific refinements, and dense product rows rather than presenting a gallery of isolated SKU cards.[5] Filtered routes encode meaningful attributes such as thread size. The public product-information API is part-number based and can report an inactive item with a suggested replacement; McMaster's SolidWorks add-in can also write the McMaster part number and description into a CAD BOM and calculate units or packs.[6][7]

**Transfers well.** Keep the user in family context while constraints narrow. Put application-changing distinctions before a long variant list. Use compact rows for repeated dimensional configurations. Make known identifiers locatable inside their family. A selected configuration should be easy to carry into a BOM.

**Fails if copied literally.** McMaster owns its taxonomy, descriptions, pack quantities, availability, and part numbers. It can collapse research and purchase into one confident catalog because it is the seller. PartSource cannot inherit that authority. McMaster's editorial groups may also reflect its assortment, not a neutral standards model, and its dense desktop pages require care on small screens. “Copy McMaster” is therefore useful at the family-navigation level but unsafe at the identity and commercial-truth levels.

### 3. MISUMI: progressive configuration that produces a code

**Observed pattern.** MISUMI offers catalog/keyword search, category/specification search, CAD search, and part-number search. On configurable product pages, the user chooses required specifications and dimensions; the page distinguishes completed, remaining, and candidate part numbers and updates a generated order code. Many pages pair this with a 3D preview or CAD output.[8][9]

**Transfers well.** Ordered controls are valuable when later choices depend on earlier choices. The system should show what is complete, what remains required, and why a value is unavailable. A persistent configuration code/summary gives confidence that control changes affected the intended item. Visual feedback can clarify geometry when it is accurate.

**Fails if copied literally.** MISUMI frequently configures one manufacturer's made-to-order or semi-configurable product. Its generated code belongs to MISUMI's product grammar; it is not a neutral canonical identifier. Standard fastener choices are often discrete configurations, and some dimensions are tightly constrained by a standard. A long wizard can also obscure comparison among common stock configurations. PartSource should borrow dependency handling, not pretend to generate an orderable manufacturer number.

### 4. TraceParts: provider catalogs and CAD download after configuration

**Observed pattern.** A public search for `socket head screw` returned a very large set of results spanning provider catalogs. The interface offered category/provider and standards-oriented filtering, but many dimension-level variants appeared as separate results. A concrete screw result (`GB/T 70.1 M1.6X10`) led to a product page with `Configure and Download` behavior and CAD-format actions.[10] TraceParts presents the origin catalog/provider prominently and describes published CAD content as supplier-certified.[11]

**Transfers well.** Standard, provider, and catalog origin are useful facets. The detail state should make content provenance visible. When supported later, a configuration should precede CAD export so the downloaded geometry corresponds to a known selection.

**Fails if copied literally.** Variant-level search flooding is poor for broad mechanical intent. Provider catalogs can create parallel taxonomies for the same generic shape. Sponsored/provider ordering does not answer “which family is this?” CAD download is TraceParts' destination, while PartSource's POC destination is understanding and preserving a configuration. A rendered model must not become decorative proof of identity.

### 5. 3Dfindit: multimodal retrieval, including geometry

**Observed pattern.** 3Dfindit combines text and classification with 3D shape, sketch, topology, color, and geometric-similarity search. Results emphasize manufacturer-verified CAD/BIM data, configuration, comparison, and download.[12][13]

**Transfers well.** Mechanical discovery will eventually benefit from shape as an input and from visual comparison. Standards classification and manufacturer provenance are useful alongside text. A picture or drawing can disambiguate head style, drive, flange, shoulder, or retention feature faster than prose.

**Fails if copied literally.** Similar shape does not prove fit, material, grade, tolerance, thread class, standard revision, certification, or equivalence. Geometry-first retrieval is computationally heavy and has weak value for a small fastener POC. It is also awkward on mobile when it requires manipulating a 3D viewport. PartSource should prototype small, accurate family silhouettes or dimensional drawings before geometry search or a hero 3D viewer.

### 6. Grainger and Zoro: commerce facets, grouped results, and full specification pages

**Observed pattern.** Grainger category pages lead with conventional industrial-commerce refinements such as product type, thread size, length, material, grade/class, finish, and drive details, followed by product tables or cards.[14] Grainger's mobile app adds barcode scanning, lists, and account-aware purchase tasks.[15] Zoro's socket-head-cap-screw category presents filters/sort and result groups/cards. A concrete Zoro item page then separates key features, detailed specifications, identifiers, documents, shipping/commercial data, and related products.[16][17]

**Transfers well.** Familiar facets reduce learning cost. Put the highest-discriminating technical facts in the result row, with the full normalized specification set on detail. Identifier labels should be explicit, not one unlabeled “part number.” Barcode or camera entry is a later useful route for known physical items, but not a POC requirement.

**Fails if copied literally.** Commerce facets mix engineering choice with brand, promotion, pack, availability, delivery, and price. Cards and large product images consume space while repeating nearly identical shapes. The category hierarchy reflects one retailer's assortment. On mobile, a long left filter rail simply becomes a long sheet unless facets are ordered and active constraints remain visible.

### 7. Bolt Depot: simple fastener taxonomy and selection education

**Observed pattern.** Bolt Depot starts with understandable fastener categories and distinguishes US/metric forms. Its metric socket-cap page uses a plain description and common mechanical controls such as material and diameter rather than a generic marketplace grid.[18]

**Transfers well.** Use the user's vocabulary, make measurement system explicit, and pair unfamiliar family terms with a short shape/use explanation. A small number of high-value controls can outperform a comprehensive filter wall.

**Fails if copied literally.** The interaction is optimized for a retailer with a bounded assortment. It does not solve normalized provenance, multiple identifier namespaces, incomplete family coverage, or complex configurable components.

### 8. Fastenal and DigiKey: useful supporting patterns

Fastenal's public user guide says search accepts Fastenal numbers, competitor numbers, customer numbers, manufacturer model numbers, manufacturers, brands, and keywords; typed keywords suggest narrower categories.[19] The useful transfer is **identifier namespace detection plus category suggestions**. The danger is treating a competitor identifier as evidence of interchangeability. PartSource may call such an identifier an input clue only.

DigiKey's official search guide demonstrates normalized category parameters and progressive parametric filtering.[20] This supports the Octopart lesson: filters should be attributes of the selected family, not one global schema. The electronics analogy still breaks at commercial identity and mechanically dependent dimensions.

## Cross-product pattern map

| Need | Strongest reference pattern | What PartSource should take | What it should reject |
|---|---|---|---|
| Search intent to family | McMaster category context; Fastenal category suggestions | Rank families and explain the query interpretation | Immediately flatten every possible variant into cards |
| Identifier to selected variant | Octopart MPN route; McMaster part-number context; MISUMI completed code | Resolve namespace, preserve original input, open family with selected configuration | Call the configuration the “same part,” an equivalent, or a supplier listing |
| Family/variant selection | McMaster dense rows; MISUMI dependency-aware configurator | Hybrid valid-configuration browser with completion state | One fixed table shape for every mechanical family |
| Facets | Octopart/DigiKey category parameters; Grainger engineering filters | Family-specific, ordered, count-aware controls | Global filter soup, brand/commerce filters, impossible combinations |
| Part detail | Octopart tabbed technical record; Zoro key facts + full specs | Stable identity header, key facts first, full facts/evidence below | Price/stock prominence and giant decorative product imagery |
| Supplier discovery | Octopart offers as a future reference; current retailer search | Secondary, clearly labeled supplier-site search destinations | Offers, availability, matches, or ranking without sanctioned evidence |
| Provenance | TraceParts provider origin; Octopart manufacturer record | Attribute/record source, reviewed date, scope, and confidence | A single green “indexed” badge standing in for evidence |
| BOM capture | Octopart upload/matching; McMaster CAD/BOM carry-through | Add the selected frozen configuration and input clue with quantity | Add an unresolved family, silently merge duplicates, or rewrite saved lines |
| Mobile | Retail apps for scan/list tasks; responsive commerce sheets | Search-first, stacked controls, sticky selection summary | Shrunk desktop matrix or mandatory 3D manipulation |

## Where the “Octopart for mechanical parts + McMaster family experience” analogy breaks

1. **The canonical object differs.** Octopart's center is a manufacturer part number. PartSource's POC center is a standards-led configuration. Manufacturer parts and supplier listings are later evidence-backed objects beneath or beside that configuration.
2. **A mechanical “family” is not always one result.** `M4 socket head screw` is likely a socket-head-cap-screw family. `M4 screw` remains ambiguous among several head and drive families. Family-first should show a short family chooser, not guess one family.
3. **Variant axes are not universal.** A screw may work as length-by-material rows after thread selection. A bearing, spring, gear, extrusion, or linear actuator has different dependencies and may need a table, range control, or configurator. There is no universal “family matrix.”
4. **Some choices are continuous or generated.** MISUMI-like configurable parts cannot always be enumerated as SKU rows. Conversely, forcing ordinary fasteners through a long configurator hides easy comparison.
5. **Nominal similarity is not equivalence.** Dimensions alone omit material condition, strength class, finish, thread class, tolerance, standard revision, certification, and application constraints. “Alternatives” and “similar” are especially dangerous labels.
6. **A seller can imply availability; PartSource cannot.** McMaster's rows are orderable catalog items. A PartSource row is a configuration unless explicit manufacturer/listing evidence says otherwise.
7. **Family-first can add a needless click for a known identifier.** The family page is useful only if the exact configuration is already selected, visible without hunting, and optionally expandable to nearby configurations.
8. **Coverage may be incomplete.** A matrix can falsely imply that blank cells are impossible rather than merely absent from the local catalog. Availability states must distinguish invalid-by-rule, not indexed, and not yet evaluated.

## Competing interaction models to prototype

These are competing hypotheses, not a final IA.

### Model A — Search result list, then variant detail

**Flow:** Search → faceted configuration list → one configuration detail.  
**Reference:** Octopart, DigiKey, Grainger/Zoro.

**Strengths:** Familiar; easy to implement on the current routes; exact identifiers are fast; every result can expose key specs.  
**Risks:** Broad intent floods the page with near-duplicates; users lose family context; cards encourage false commercial identity; mobile lists become very long.  
**Best test case:** Families where each item is already a real manufacturer part and the family has few variants.

### Model B — Editorial family page with compact variant matrix

**Flow:** Search → family → family sections/facets → valid rows or cells → detail/selection.  
**Reference:** McMaster-Carr and, in simpler form, Bolt Depot.

**Strengths:** Excellent for comparing common discrete fastener configurations; maintains geometry and standards context; efficient on desktop.  
**Risks:** A single fixed matrix cannot handle all component families; dense tables are fragile on mobile; incomplete data can look like impossible data.  
**Best test case:** Socket-head cap screws after system/thread selection, with a bounded set of length/material/finish combinations.

### Model C — Progressive configurator with generated selection summary

**Flow:** Family → choose required attributes in dependency order → completed configuration → detail/BOM.  
**Reference:** MISUMI and TraceParts configurable products.

**Strengths:** Prevents impossible combinations; scales to dependent or continuous dimensions; remaining-required state is explicit; strong on narrow screens when controls stack.  
**Risks:** Slow for experts; hides comparison; can resemble a made-to-order code generator; poor if the constraint graph or source coverage is incomplete.  
**Best test case:** A component whose dimensions depend strongly on one another or include ranges.

### Model D — Dual-intent resolver into a hybrid family workspace

**Flow:** Search resolver → family shortlist or exact selection → one workspace with ordered facets, valid-configuration view, and sticky selected summary → evidence/BOM/supplier searches.  
**Reference:** Combines McMaster family context, Octopart intent resolution, and MISUMI completion state.

**Strengths:** One mental model for broad and exact queries; families are primary without penalizing identifier lookup; the configuration view can switch between compact rows and progressive controls; truth and provenance stay attached to selection.  
**Risks:** More stateful to build; URL and browser history must preserve filters and selection; the UI can become crowded if family explanation, facets, matrix, and detail all compete.  
**Best test case:** The current POC's generic text, known McMaster clue, guided selection, frozen BOM, and supplier-search handoffs.

**Recommendation for testing:** Model D is the leading hypothesis. Prototype it against Model A or B rather than declaring it the final specification.

## Leading prototype anatomy

### 1. Resolve the query before rendering results

Classify the input into visible states:

- **Broad family intent:** `M4 screws` → show a short family shortlist; retain the M4 constraint.
- **Family-specific intent:** `M4 socket head screw` → put `Socket-head cap screws` first and disclose interpreted chips such as `Metric`, `M4`, `Socket head`.
- **Configuration text:** `DIN 912 M4 × 12 class 12.9` → open the likely family with those attributes applied; ask only for required unresolved attributes.
- **Known identifier:** `91290A115` → if an approved local mapping exists, open the family with the mapped configuration selected and show `Resolved from identifier clue 91290A115`.
- **Ambiguous identifier:** show candidate namespaces/records; do not auto-select.
- **Unsupported or unavailable:** preserve the current fail-closed behavior.

A recognized identifier should not land on a generic search-results page. It should land on the selected state. But the heading must be the configuration identity, not an assertion that PartSource owns or duplicates the supplier item.

### 2. Make the family page a workspace, not a landing page

Recommended regions:

1. **Family header:** plain-language family name, one accurate silhouette/drawing if available, standards scope, short disambiguation text, and coverage note.
2. **Interpreted intent:** removable chips showing what came from the query versus what the user selected later.
3. **Ordered family controls:** highest-consequence choices first. For a socket-head cap screw prototype: measurement system → thread size/pitch → length → material/strength → finish → thread coverage/standard. The exact order should be validated with data and users.
4. **Valid-configuration browser:** compact rows by default; use a 2D matrix only after the row/column axes are low-cardinality and meaningful. Let users choose the secondary comparison dimension if needed.
5. **Persistent selected summary:** canonical configuration label, all resolved values, missing required values, evidence state, and actions. Never make the user infer selection only from filter state.
6. **Technical and evidence detail:** key facts first; dimensions/standard and identifier namespaces next; provenance available per group or attribute.
7. **Secondary actions:** add frozen selection to BOM; then supplier-site search destinations.

The family workspace should distinguish three empty states:

- **Invalid combination:** known to violate the family/standard constraint model.
- **Not indexed:** potentially valid, absent from the local catalog.
- **Unknown:** insufficient evidence to decide.

A blank table cell is not enough.

### 3. Matrix only when the data earns it

A matrix works when:

- the family is discrete;
- one or two axes explain most choice;
- all displayed cells share the same identity grammar;
- constraints and absence states are known;
- labels fit at accessible text sizes.

For socket-head cap screws, first lock measurement system, thread and perhaps pitch; then rows might be lengths and columns might be material/strength/finish groups. If there are too many combinations, use compact rows with sortable technical columns instead. For continuous dimensions or strong dependencies, use Model C's configurator. This rule should be component-family metadata, not hand-coded page behavior.

### 4. Separate selected configuration from part detail

Prototype two detail depths:

- **Selection inspector in the family workspace:** enough to confirm the exact configuration, see unresolved fields, save to BOM, or continue.
- **Deep-linkable configuration detail:** full normalized specifications, standards references, identifiers, provenance, notes, and supplier search destinations.

This avoids forcing a page change for every comparison while preserving a stable link for a resolved configuration. A known identifier can deep-link to either state, but the selected summary must be above the fold.

### 5. Treat provenance as product information

Show evidence in plain labels:

- record type: `Standards-derived configuration`, `Manufacturer part`, or `External identifier clue`;
- source title/organization and link where publication is allowed;
- fields supported by that source;
- review or retrieval date;
- prototype/coverage status;
- original identifier namespace and exact input;
- conflicts or unresolved fields.

Do not use `Indexed catalog` plus a green pulse as a proxy for truth. Indexing says where a record lives, not who supports each fact. Provenance can be collapsed for ordinary browsing, but it must be one action away and included in the frozen BOM snapshot.

### 6. Keep supplier discovery secondary and honest

After a complete configuration is selected, show `Search this configuration on <supplier>` with the query text visible or inspectable. Explain once that destinations are searches, not offers, matches, or availability. Do not rank suppliers as “best,” show result counts, or infer that an identifier accepted by a supplier is equivalent. Preserve the configuration in the current page when a supplier opens in a new tab.

### 7. Make BOM capture a lightweight commitment

The default family-workspace action should be `Add selected configuration to BOM`, asking only for quantity if an active local BOM exists. Expand project notes, new-BOM creation, and user-entered cost after or in a small sheet. Save:

- original input and detected namespace;
- family and canonical configuration key;
- complete selected attributes and any unresolved fields;
- identifier clues without equivalence language;
- evidence/source snapshot and revision/date;
- supplier search destinations;
- quantity and user notes.

Do not add a family with unresolved required dimensions as though it were a part. Offer `Save requirement` as a visibly different future concept if users need incomplete BOM lines. Keep frozen snapshots immutable by catalog refresh and make duplicate behavior explicit; the current POC already has this useful foundation.

## Mobile behavior to prototype

Do not shrink the desktop matrix.

- Keep a prominent search entry and preserve the original query.
- Show family candidates as short rows with silhouettes and matched-attribute chips, not image-heavy cards.
- Put filters/configuration controls in a full-height sheet, but keep active constraints and result count visible on the page.
- Stack dependency controls in selection order. Put invalidity explanations immediately below the affected control.
- Replace wide matrix cells with grouped row cards or a user-selected comparison axis.
- Use a sticky bottom selection bar: short configuration label, completion state, and `Review`/`Add to BOM` action. It must not cover content or become a purchase bar.
- Present specifications and provenance as meaningful accordions, not one accordion per attribute.
- Avoid mandatory 3D gestures. A static accurate silhouette or dimensioned drawing should open into a larger viewer.
- Use at least comfortable body text and touch targets; do not carry the current 10–12 px desktop labels onto a phone.
- Preserve browser Back behavior across family, filters, and selected configuration. Encode meaningful state in the URL so exact-identifier links reopen the selection.

A later camera/barcode entry can borrow from Grainger/Fastenal mobile workflows, but it should first identify the namespace and show a candidate, not silently assert identity.

## Modern mechanical-software visual principles

“Modern” should mean legible, responsive, stateful, and technically calm—not consumer-commerce decoration.

1. **Technical density with hierarchy.** Use a neutral canvas, thin borders, restrained radius, little shadow, and whitespace between conceptual groups. Put dense data inside aligned rows, not dozens of floating cards.
2. **Geometry is evidence, not decoration.** Prefer a source-backed silhouette or drawing that communicates family-changing features. Suppress an inaccurate generic 3D hero rather than imply that it depicts the selected configuration.
3. **Numbers align; prose breathes.** Align comparable dimensions and units in columns. Use tabular numerals where helpful. Reserve monospace for identifiers and codes, not every technical value.
4. **Semantic state is redundant.** Selected, unresolved, invalid, not indexed, and sourced states need text/icon/border treatment as well as color. Avoid decorative green pulses.
5. **Selection remains visible.** A sticky inspector or bottom bar should show the configuration produced by the controls. Every change has immediate, reversible feedback.
6. **Progressive disclosure without hiding identity.** Family explanation, common dimensions, and selected facts stay visible. Full standards notes, provenance, and secondary identifiers can expand.
7. **Keyboard and pointer parity.** Search suggestions, facets, tables, and row selection need visible focus, predictable arrow/Enter behavior, and no hover-only facts.
8. **Plain technical language.** Use sentence case and familiar terms. Avoid excessive uppercase, letter spacing, “AI match,” “verified,” or confidence theater.
9. **URL as engineering state.** Family, constraints, selected configuration, and clue should survive refresh/share. State should not be trapped in a modal.
10. **Responsive by re-composition.** Desktop can use a left control rail, central rows, and right inspector. Mobile should sequence the same information; it should not horizontally scale the whole workspace.

## Implications for the current PartSource POC

The current implementation has several sound foundations:

- It distinguishes configuration matches, supplier-search destinations, unsupported input, and unavailable search.
- It warns users to verify a decoded configuration.
- Supplier links are accurately labeled as searches.
- BOM lines are frozen snapshots with source notes and explicit duplicate behavior.
- The visual palette is restrained and the detail page already separates specifications, sourcing, and related configurations.

The main mismatch is structural:

- Search suggestions are individual configurations and every submitted input navigates to `/parts/<input-or-part-number>`; there is no first-class family route or family candidate state.
- `M4 socket head screw` can therefore become an arbitrary result/detail rather than a family workspace.
- The current home result grid uses one card per configuration, which repeats near-identical mechanical objects.
- Part detail leads with an aspect-square schematic card even when the drawing is generic, while the selected identity and evidence are less visually stable.
- The page presents `Indexed Catalog` as a positive status even though indexed status is not provenance.
- The full BOM form is placed directly in detail; a small selection action followed by progressive fields would better preserve the research flow.
- “Related configurations” based on shared thread or type is weaker than a family-controlled valid-configuration browser.
- Many labels are 10–12 px and uppercase/letter-spaced, which looks precise on desktop but will be difficult on mobile.

Do not rewrite the whole visual system for the experiment. The prototype can preserve the light neutral styling while changing the object model, route, selection state, and information priority.

## Recommended prototype question

> **For both generic mechanical intent and a known external identifier, does a shared family workspace—with the exact configuration selected when known—let users reach and correctly describe the intended configuration faster and with less false certainty than a flat configuration-list-to-detail flow?**

Prototype Model D against Model A or the current flow using the same small, well-evidenced socket-head-cap-screw dataset. Test at desktop and phone widths with these tasks:

1. `M4 socket head screw` — choose a family, then a 12 mm class 12.9 configuration.
2. `M4 screw` — recognize and resolve family ambiguity without losing M4.
3. `DIN 912 M4 × 12` — preserve standard, size, and length; surface unresolved material/strength if needed.
4. `91290A115` — land with the locally mapped configuration highlighted and correctly explain what is and is not known.
5. Change length while holding the other constraints; return to the original selection.
6. Save the selected configuration to a BOM and open a supplier-site search without interpreting it as a verified listing.
7. Enter an unsupported or ambiguous identifier and avoid a confident guess.

Measure:

- correct family and configuration completion;
- time and interactions to a complete selection;
- whether the exact identifier result is visible without hunting;
- constraint loss when moving between family and detail;
- invalid or not-indexed combinations misread as unavailable products;
- ability to explain `configuration` versus `manufacturer part` versus `supplier search`;
- BOM snapshot completeness;
- back/refresh/share recovery;
- mobile task completion without horizontal table manipulation.

**Prototype decision threshold:** prefer the family workspace only if it materially reduces variant scanning and truth errors on broad queries while keeping exact-identifier completion close to direct-detail speed. If it adds friction for exact lookup, test an inspector-first exact route that still reveals family context rather than abandoning the family model.

## Sources

Public pages were retrieved or checked on 2026-08-09 unless noted.

1. Octopart, “Introducing the Octopart Way to Search for Components,” official product article: https://octopart.com/pulse/p/introducing-a-new-way-to-search-for-components
2. Octopart, “Exploring Octopart’s Powerful Search Filters”: https://octopart.com/pulse/p/introducing-redesigned-search-filters
3. Octopart, representative part page showing the current part-level IA labels (`Price & Stock`, `CAD Models`, `Alternate Parts`, `Compliance`, `Tech Specs`): https://octopart.com/0201zd472mat2a-kyocera+avx-122142156
4. Octopart, “Getting Started with the Octopart BOM Tool”: https://octopart.com/pulse/p/getting-started-octopart-bom-tool
5. McMaster-Carr, “Socket Head Screws” public family route and representative exact part route: https://www.mcmaster.com/products/socket-head-screws/ and https://www.mcmaster.com/91290A115
6. McMaster-Carr, Product Information API: https://www.mcmaster.com/help/api/
7. McMaster-Carr, SolidWorks add-in: https://www.mcmaster.com/solidworksaddin/
8. MISUMI, eCatalog guide: https://us.misumi-ec.com/guide/category/first/ecatalog.html
9. MISUMI, specification narrowing, product-page selection, CAD preview, and a representative configurable product: https://us.misumi-ec.com/guide/category/ecatalog/spec.html, https://us.misumi-ec.com/guide/category/ecatalog/detail.html, https://us.misumi-ec.com/guide/category/ecatalog/use_cad.html, and https://us.misumi-ec.com/vona2/detail/110300538420/
10. TraceParts, public search and representative configured fastener result: https://www.traceparts.com/en/search/socket%20head%20screw and https://www.traceparts.com/en/product/gb-hexagon-socket-head-cap-screw-gbt-701-m16x10?CatalogPath=TRACEPARTS%3ATP01001013001009&Product=50-25082011-070544&PartNumber=GB%2FT%2070.1%20M1.6X10
11. TraceParts, supplier-certified CAD content overview: https://info.traceparts.com/designers/
12. 3Dfindit, public CAD/BIM search: https://www.3dfindit.com/en/cad-bim-library
13. CADENAS, geometric search and combined search-method overviews: https://www.cadenas.de/en/products/partsolutions/finding-information/intelligent-finding/geometric-search-3d and https://www.cadenas.de/en/products/partsolutions/finding-information/intelligent-finding/combination-of-search-methods
14. Grainger, socket-drive cap-screw category: https://www.grainger.com/category/fasteners/screws/socket-screws/socket-head-cap-screws
15. Grainger, mobile app features: https://www.grainger.com/content/mc/serving-customers/mobile-app-features
16. Zoro, socket-head cap-screw category: https://www.zoro.com/socket-head-cap-screws/c/4951/
17. Zoro, representative M8 × 1.25 × 30 mm item page inspected for key-feature/detail IA: https://www.zoro.com/i/G510397567/
18. Bolt Depot, metric socket-cap category: https://boltdepot.com/Metric_socket_cap
19. Fastenal, eBusiness user guide, catalog search page: https://www.digiedition.fastenal.com/ebusiness/ebusiness-user-guide-catalog/?Page=4
20. DigiKey, “How to Use DigiKey's Part Search More Efficiently”: https://www.digikey.com/en/articles/how-to-use-digi-key-part-search
21. PartSource internal product contract: `research/product-contract.md`
22. PartSource current discovery and detail implementations: `web/src/pages/Home.tsx`, `web/src/components/Header.tsx`, and `web/src/pages/PartDetail.tsx`
23. PartSource prior benchmark research: `research/competitive-matrix.md` and `research/poc-completion-discovery-2026-08-09.md`
