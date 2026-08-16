# Competitive and category analysis: mechanical parts and engineering data

**Date:** 2026-08-09  
**Phase:** Validation + Targeted Ideation Gate  
**Status:** Desk and first-party interface analysis. Not user validation, a product specification, or permission to publish the current catalog packet.  
**POC boundary:** Fastener specification recovery and safe handoff; no `/to-spec` or production changes.

## Terse verdict

**Opportunity / gold idea:** PartSource should not compete on how many things it can list, render, quote, or discuss. Its defensible bounded job is to turn an imperfect clue into an inspectable engineering decision state: preserve the clue, separate exact mapping from configuration truth, show unresolved or conflicting facts, abstain safely, and freeze the reviewed result for reuse and handoff.

**Evidence:** The inspected products are strongest when they finish a different, well-bounded job: McMaster-Carr moves from family/specification to a stocked catalog item and order; Octopart joins electronics identity to supply-chain data; 3Dfindit and TraceParts get manufacturer CAD into design; Granta supports systematic material selection and simulation export. Their density is usually functional, not accidental.

**Risk:** PartSource becomes a weak catalog if it stops at family filters and rows, a weak distributor if it adds supplier buttons, or evidence theatre if it wraps one confidential source in badges and prose. There are still 0/12 direct-user sessions, no approved public family profile, and no immutable public catalog release.

**Rejected:** Copying catalog scale, CAD libraries, distributor commerce, generic parametric tables, or AI chat. None is a credible POC wedge or a defensible reason to use PartSource.

## Method and evidence boundary

### Evidence

- Read the authoritative product contract, market/customer research, both 2026-08-09 syntheses, the Wayfinder audit, and all current validation reports.
- Exercised current first-party public pages where access permitted. Search-result snippets were used only to locate first-party URLs and are not evidence below.
- McMaster-Carr, Altium/Octopart, CADENAS, TraceParts, and Ansys pages yielded inspectable first-party content.
- MISUMI US/UK/Mexico, Fastenal, Bolt Depot, and MatWeb returned access-denied or security-verification pages to this browser. This is an automation-access limitation, not evidence of poor human UX. No granular interface claim about those blocked pages relies on a search snippet.
- TraceParts was searched for `socket head cap screw` through its own interface. The result exposed classification, supplier, standards-organization, standard, and CAD-format filters, reported more than 10,000 results, and showed repeated-looking supplier entries.
- Repository evidence remains decisive for PartSource: current target-user research is 0/12 sessions; exact identifiers are the strongest entry path; `91290A115` is the corrected repository-safe example mapping to M3 × 0.5 × 10 mm; current rows are not publishable as-is; supplier handoff is secondary.

### Open question

A human follow-up should inspect the current MISUMI, Fastenal, Bolt Depot, and MatWeb interfaces without automation blocking. Until then, their rows below deliberately separate established category role from claims directly observed in this run.

## What each category leader actually optimizes

| Product | Competitor evidence: what it does well | Actual job optimized | Friction or tradeoff | Why density or legacy patterns can be rational |
|---|---|---|---|---|
| **McMaster-Carr** | **Evidence:** The live socket-head-screw page combines a family result with `System of Measurement`, `Thread Size`, and `Length` filters and keeps ordering, order history, image search, and catalog browse in the same shell. Its CAD page states CAD coverage for over 700,000 parts and emphasizes reliable CAD, file types, and design-process integration. [C1–C2] | **Evidence:** Move from a recognizable product family or catalog identifier to a purchasable McMaster item, then order or insert it into a design. | **Strong hypothesis:** The supplier-specific item and purchase are the natural endpoint, so preserving a neutral requirement, exposing unresolved engineering facts, and carrying that neutral state to another supplier are not its primary job. This is a boundary tradeoff, not a design failure. | **Evidence:** A large visible filter set is useful when many variants are real and the user can finish with one item/order. Dense family organization reduces repeated navigation and makes expert scanning possible. |
| **MISUMI** | **Evidence:** Direct US, UK, and Mexico first-party pages were attempted but returned `Access Denied`; no current configurator behavior was independently observed in this run. [C3] | **Strong hypothesis:** Configure a manufacturer/distributor part to explicit dimensions and options, generate a valid part number, obtain CAD, and quote/order it. This category role requires manual confirmation against the accessible first-party UI. | **Strong hypothesis:** Progressive configuration is excellent when the user already chose the MISUMI product family. It is less naturally suited to preserving an ambiguous external clue or explaining why a configuration cannot yet be selected. | **Strong hypothesis:** Long option sequences and disabled combinations can encode manufacturability and ordering grammar. What looks like form density may prevent impossible configurations and produce a valid orderable code. |
| **Fastenal** | **Evidence:** The current product, CAD-resource, and technical-resource URLs were checked but returned `Access Denied`; no detailed current-interface claim is made. [C4] | **Strong hypothesis:** Find a distributor SKU, combine technical support with branch/account context, and transact within an industrial supply relationship. Manual first-party confirmation is required. | **Strong hypothesis:** Distributor taxonomy and account context optimize purchasing, not source-neutral specification recovery. Commercial fields can dominate the interface because they are necessary to the destination job. | **Strong hypothesis:** SKU grids, pack/order fields, branch context, standards, and technical resources can be rationally dense for repeat industrial buyers who know their vocabulary. |
| **Bolt Depot** | **Evidence:** The catalog, fastener-information, printable-tools, and PDF URLs were checked but stopped at Cloudflare security verification; their current contents were not treated as proof. [C5] | **Strong hypothesis:** Help a less-specialist user identify basic fastener type/size, learn terminology, and buy common hardware. Manual first-party confirmation is required. | **Strong hypothesis:** Educational charts and commerce can help recognition but do not create a durable, release-aware configuration record or handle conflicting evidence. | **Strong hypothesis:** Printable charts and conventional taxonomies are rational for shop-floor measurement, teaching, and reference where screen novelty is less useful than stable, printable conventions. |
| **Octopart** | **Evidence:** Altium’s current Octopart page supports keyword, technical-specification, and part-number search. It describes datasheet, parametric, lifecycle, supply-chain, compliance, price, inventory, authorized-distributor, BOM matching, procurement, symbol, footprint, and CAD-model data. [C6] | **Evidence:** Research, select, risk-check, and source electronic manufacturer parts from design through production. The stable manufacturer part number and distributor-offer ecosystem make aggregation valuable. | **Evidence:** It is electronics-specific and combines identity with commercial/risk data that PartSource is not permitted to claim. **Strong hypothesis:** Mechanical configurations often lack an equally universal manufacturer-part identity and clean authorized-offer graph, so direct transfer is unsafe. | **Evidence:** Dense comparison is rational because engineers and buyers need many attributes, lifecycle states, compliance flags, offers, price breaks, and stock positions in one decision. |
| **CADENAS / 3Dfindit** | **Evidence:** CADENAS describes search across manufacturer CAD/BIM catalogs, free download, and search by uploaded 3D shape, 2D sketch/photo, color, and filters. It states that engineering data is provided by manufacturers and lists 150+ native and neutral formats. [C7] | **Evidence:** Find a manufacturer component by geometry or catalog context and insert the correct CAD representation into a design workflow. | **Strong hypothesis:** Geometry and manufacturer content optimize design insertion, not recovery of a sparse BOM clue, evidence conflict, or supplier-neutral fastener requirement. Geometry can also look authoritative when configuration truth is incomplete. | **Evidence:** Multiple search modes and format controls are rational because geometry is the query and CAD export is the completion event. The interface must carry manufacturer, format, and model context. |
| **TraceParts** | **Evidence:** The live site offers a design library spanning MCAD, ECAD, PCB, CAE, and BIM; category browse; supplier catalogs; part-number search; and many CAD formats. Its own search for `socket head cap screw` produced more than 10,000 results plus supplier, standards, and format filters. [C8] | **Evidence:** Discover supplier/manufacturer product content and download a usable CAD asset or datasheet. The supplier’s catalog remains the organizing authority. | **Evidence:** The exercised broad query produced a very large result set and repeated-looking entries, while standards were exposed as long filter lists. That is high retrieval burden for specification recovery, though it may be acceptable when the goal is locating a particular supplier model. | **Evidence:** Supplier, standard, and format density is rational for CAD-content retrieval. Catalog duplication may reflect separately published supplier records rather than a safe equivalence or deduplication opportunity. |
| **MatWeb** | **Evidence:** The home, property-search, and advanced-search URLs were checked but stopped at Cloudflare security verification. No current property-table or comparison behavior was independently observed. [C9] | **Strong hypothesis:** Look up and compare material-property data or find materials meeting numeric property ranges. Manual first-party confirmation is required. | **Strong hypothesis:** Property records can be mistaken for application suitability when condition, processing, test method, temperature, direction, or source context is not carried into the decision. This must be verified against the current interface. | **Strong hypothesis:** Large parametric tables are rational for a property-retrieval job because experts need units, conditions, ranges, and many properties together. They are not automatically a good component-selection UI. |
| **Ansys Granta Selector** | **Evidence:** The current page supports systematic material selection, comparison, visualization, limits on properties, balancing competing requirements, eliminating unsuitable candidates, finding grades/standards/suppliers, similar-material search, detailed reports, and simulation-ready export. [C10] | **Evidence:** Make a repeatable material-selection decision and move the chosen property data into simulation. | **Evidence:** It is a specialist materials workflow, not part/configuration identity recovery. **Strong hypothesis:** Its disciplined elimination and reporting patterns transfer better than its data model or full analytical depth. | **Evidence:** Dense charts, property limits, and reports are rational because the job explicitly balances many competing properties and requires an auditable rationale. |

## Category-level conclusions

### Evidence

1. **The strongest products own a completion event.** McMaster owns order/CAD insertion; Octopart owns electronics research-to-source intelligence; 3Dfindit and TraceParts own CAD retrieval; Granta owns material selection and simulation export.
2. **Density follows decision fan-out.** Many real variants, suppliers, standards, formats, or property dimensions make compact filters and tables efficient for experienced users.
3. **A catalog taxonomy is operating knowledge.** Family pages, attribute order, disabled combinations, and technical tables can encode years of product and support logic. A visually old pattern may still minimize search and support cost.
4. **Supplier/manufacturer identity is often intentionally central.** That identity enables stock, price, CAD, lead time, authorization, and ordering. Neutrality would weaken the incumbent’s completion event.
5. **CAD platforms treat geometry or manufacturer content as the durable artifact.** Material platforms treat the selected material and property set as the artifact. Octopart treats manufacturer-part and supply-chain data as the artifact.
6. **No inspected first-party source proves an unmet PartSource market.** The absence of an observed workflow is not proof that competitors cannot or do not support it elsewhere.

### Fundamental requirement

Evaluate competitive interfaces by the job they optimize, not by aesthetic modernity. Do not call density, tables, legacy navigation, or supplier emphasis friction unless they impair that product’s actual completion event.

### Risk

A superficial benchmark rewards fewer clicks or less chrome while ignoring mechanical correctness, variant fan-out, commerce context, CAD-format requirements, or expert scanning. PartSource’s goal is not to look simpler while omitting the facts that make a decision safe.

## Where friction genuinely appears

### Evidence

- TraceParts’ exercised broad fastener query returned more than 10,000 results, long supplier/standard lists, and repeated-looking catalog entries. This makes retrieval expensive when the user starts from an incomplete requirement rather than a known supplier/model.
- McMaster’s category workflow visibly converges on McMaster items and ordering. That is excellent for its supplier job but does not itself preserve a supplier-neutral decision state.
- Octopart’s value depends on electronics-specific manufacturer-part identity and sanctioned commercial/supply-chain data. PartSource’s current contract explicitly lacks manufacturer-listing, offer, stock, price, equivalence, and approval evidence.
- CADENAS and TraceParts make CAD availability a central completion path. PartSource’s current contract rejects CAD/STEP as an owned product capability.
- Granta’s systematic elimination works because it has a specialist material-property model and analytical purpose. A fastener catalog cannot copy the interaction without approved family rules and typed facts.

### Strong hypothesis

The open friction is **between artifacts and roles**, not inside a single catalog page:

1. a supplier identifier appears in a drawing or BOM but its human-readable configuration is missing;
2. a rough line contains some explicit constraints and some unresolved engineering decisions;
3. a user moves from source catalog to neutral requirement to BOM or another supplier;
4. search cannot distinguish `invalid`, `unknown`, `outside this release`, and `service unavailable`;
5. a saved line later needs to remain interpretable after a catalog correction.

These transitions are not the primary completion event of the inspected leaders. That makes them plausible openings, not proven demand.

### Rejected

- Treating a login, bot challenge, registration requirement, or automation denial observed in this run as evidence of normal human-user friction.
- Calling catalog density bad merely because PartSource should be calmer.
- Assuming duplicated-looking supplier records are duplicates or equivalents.
- Assuming a long standards list can be safely collapsed without edition and relationship semantics.

## Genuine PartSource openings — opportunity hypotheses, not competitor facts

### Opportunity / gold idea 1: a recoverable constraint ledger

Turn every query into a small inspectable ledger:

- verbatim input and source span;
- exact identifier namespace/value when present;
- deterministically parsed facts with supplied notation;
- user-chosen facts;
- unresolved terms and family-required decisions;
- conflicts and non-applicable facts;
- active release and parser version;
- candidate satisfaction, contradiction, or missing-fact state.

**Why this is workflow-level differentiation:** The ledger persists from search through family refinement, selection, frozen BOM, and handoff. It is not another result explanation or chatbot answer. The same structure drives abstention, regression tests, and exported review packets.

**Strong hypothesis:** Users will value a correct statement of what still decides the configuration more than a larger candidate list.

### Opportunity / gold idea 2: exact ID as a mapping, not the product

For `91290A115`, show separately:

1. the submitted identifier and namespace;
2. the mapping state and mapping evidence limit;
3. the released configuration, if one exists;
4. gaps or conflicts in configuration facts;
5. the original-source direct-open action, if reviewed and safe.

**Why this differs:** Catalogs naturally make their item number the endpoint. PartSource can use an identifier as an entry clue into a source-neutral configuration without claiming equivalence, replacement, stock, or supplier listing.

**Fundamental requirement:** Never fuzz an unknown identifier, choose `LIMIT 1`, or silently route a withdrawn mapping.

### Opportunity / gold idea 3: abstention as useful work

Return mechanically meaningful negative states with the preserved clue:

- malformed or contradictory;
- exact mapping ambiguous;
- family unresolved;
- required fact unresolved;
- potentially valid but not in the active release;
- unsupported category;
- service unavailable;
- withdrawn.

**Why this differs:** The output is a next safe engineering decision, not `no results` or a relaxed query. A blocked action can still export an honest issue record.

**Strong hypothesis:** Calibrated abstention will reduce wrong-family turns and false handoffs enough to offset lower recall.

### Opportunity / gold idea 4: a frozen, correction-aware configuration packet

Freeze the selected public facts, original clue, mapping/configuration revision, catalog release, unresolved warnings, quantity/notes/user cost, and handoff recipe in the browser-local BOM.

When a correction exists, show only changed claims, reason, effective release, and effect on selection/handoff. Never rewrite the old snapshot.

**Why this differs:** The durable output is the decision state, not a CAD file, supplier cart, generic table, or conversation transcript.

**Risk:** No current public release or correction lifecycle exists, so this cannot be marketed as a current capability or audit record.

### Opportunity / gold idea 5: two-path completion

- **Source-direct exact-ID path:** preserve and open the reviewed user-supplied identifier without translation.
- **Alternate-supplier path:** after unique reviewed selection, copy/export a transparent, editable public-specification packet.

**Why this differs:** PartSource audits its translation rather than pretending to aggregate listings or find equivalents.

**Fundamental requirement:** Supplier handoff remains a secondary action and is blocked for partial, conflicting, unsupported, unavailable, confidential-lineage, withdrawn, or unreviewed states.

### Strong hypothesis: a BOM specification-preflight challenger

A future thin batch layer could classify 5–15 redacted lines into exact, partial, conflict, unsupported, unknown, and failure states, then group them by the next safe engineering decision.

This is a higher-repeat-value hypothesis than one-at-a-time recovery, but it is not the bounded POC now. It depends on the same safe line-resolution kernel and must first pass a concierge test with zero critical false unique matches.

### Nice-to-have

- Differences-first comparison that never implies equivalence and never hides unknowns.
- Accurate text-equivalent geometry only if measured task performance improves.
- Unit display preference without changing canonical values.
- Public-safe correction history after real corrections exist.

## What makes the opening defensible

### Strong hypothesis

The defensible asset is not a novel screen. It is the accumulated workflow contract:

1. mechanically reviewed family boundaries and required-field profiles;
2. namespace-aware identifier mappings kept separate from configuration identity;
3. deterministic, reversible parsers for supported dimensions and units;
4. explicit conflict, missingness, applicability, withdrawal, and failure semantics;
5. immutable release and correction behavior;
6. a frozen truth corpus covering exact, broad, ambiguous, conflict, outside-release, withdrawal, and failure cases;
7. measured direct-engineer performance on accuracy, review effort, wrong turns, and safe handoff.

A competitor can copy a layout. It is harder to copy a reviewed decision-state corpus and a proven transition from dirty clue to reproducible handoff without silently manufacturing truth.

### Risk

This is process and domain defensibility, not a guaranteed moat. It becomes real only after mechanical review, permitted data, immutable releases, and target-user evidence. With one confidential source and three candidate screw families, PartSource cannot claim broad coverage or transparent provenance.

## Bounded POC differentiation

### Strong hypothesis

The smallest credible POC should prove one connected workflow:

1. **Enter:** exact identifier or rough metric fastener description.
2. **Preserve:** keep the original input and every explicit constraint.
3. **Interpret:** expose deterministic parsing, unresolved terms, and conflicts.
4. **Resolve:** route an exact mapping or a coherent reviewed family without guessing.
5. **Narrow:** ask only family-approved questions; explicit dimensions and standards are hard constraints, not ranking boosts.
6. **Abstain:** distinguish invalid, unknown, outside release, withdrawn, and unavailable.
7. **Select:** enable selection only for one active released configuration with required facts supported and no critical conflict.
8. **Freeze:** save a release-aware local configuration packet.
9. **Complete secondarily:** direct-open the original source ID or copy an editable alternate-supplier specification packet.

### Strong hypothesis

A practical review floor remains metric-only, three mechanically approved fastener families, about 150 deliberately reviewed configurations, reviewed exact mappings, and a 100–150-case truth corpus. Those counts are working hypotheses, not evidence of user value or mechanical approval.

### Fundamental requirement

POC comparison must measure:

- zero silent substitution of explicit facts;
- 100% abstention for seeded identifier collisions and critical conflicts;
- correct metric pitch handling and no imperial TPI conflation;
- preserved raw input through every state;
- no stale answer after failure or case switch;
- no BOM or supplier action while selection-critical facts are unresolved;
- user comprehension that configuration is not suitability, equivalence, listing, stock, price, or approval;
- task time and review effort against the participant’s normal workflow.

## Explicitly rejected competitive directions

### Rejected: catalog scale

Do not compete on SKU, row, category, or configuration count. McMaster, MISUMI, TraceParts, 3Dfindit, and distributors have supply relationships, catalog operations, and content depth that a bounded POC cannot credibly reproduce. Publishing all 27,009 source rows would amplify lossy identity and provenance problems, not create advantage.

### Rejected: CAD library or geometry search

Do not copy McMaster CAD, 3Dfindit, or TraceParts. CAD generation, format support, manufacturer certification, model maintenance, and design-tool integration are different businesses. Generic geometry would add false authority before it adds recovery value.

### Rejected: distributor commerce

Do not copy Fastenal, McMaster ordering, MISUMI quote/order, or Octopart offers. No sanctioned current listing, price, stock, availability, lead-time, approved-vendor, checkout, or fulfillment data exists. A supplier search URL is not an offer.

### Rejected: generic parametric tables

Do not build a universal mechanical table or transplant Granta/Octopart columns. Family-specific facts, applicability, units, and identity rules matter. A dense table is useful only after the product owns complete and comparable facts for the user’s actual decision.

### Rejected: AI chat

Do not put a conversational layer over incomplete catalog truth. Chat does not solve identifier namespace, release membership, missingness, conflict, standards relationship, or mechanical suitability. Automation may propose aliases or parser cases; deterministic code and review must own published facts and selection gates.

### Rejected: an “Octopart for mechanical parts” clone

Octopart’s value depends on stable manufacturer-part identities plus authorized supply-chain and commercial data. Mechanical fastener configuration, manufacturer part, supplier listing, and offer are distinct objects. Copying its offer grid without those identities and feeds would be theatre.

### Rejected: polished filter chrome as differentiation

Family-first filters are a leading interaction hypothesis, not a value proposition. If the output is only a narrower row list, PartSource is a thinner catalog. The differentiation begins when input, interpretation, unresolved decisions, release identity, and handoff remain continuous.

## Decision register

### Evidence

- Category leaders are strong at commerce, configure-to-order, CAD insertion, electronics supply intelligence, or material selection.
- Their information density often serves real variant, supplier, format, or property fan-out.
- The directly exercised TraceParts fastener query exposed large-result and catalog-normalization burden.
- PartSource’s exact-ID path best fits the current packet; no target-user validation exists.
- Current PartSource data and publication lifecycle cannot support broad catalog, equivalence, offer, or audited-provenance claims.

### Fundamental requirement

- Preserve raw clues and explicit facts.
- Keep identifier mapping, configuration truth, supplier listing, offer, and approval separate.
- Use family-specific required fields and deterministic hard constraints.
- Abstain on ambiguity, conflict, outside-release state, withdrawal, and processing failure.
- Freeze release-aware decisions without silent mutation.
- Keep supplier handoff secondary, transparent, and editable.

### Strong hypothesis

- Specification recovery plus a durable configuration packet is a stronger bounded wedge than neutral search links or a generic family browser.
- Workflow continuity from clue to frozen handoff can matter even with deliberately small catalog coverage.
- BOM specification preflight has greater repeat-value upside but should remain a manual challenger until safe line resolution and user value are proved.

### Opportunity / gold idea

- A provenance-bearing constraint ledger shared by search, abstention, selection, regression fixtures, frozen BOM, and handoff.
- Exact ID resolved as a scoped mapping into a neutral released configuration.
- `What still decides this configuration?` as the primary family-workspace question.
- Correction-aware, differences-only review of a frozen configuration packet.

### Nice-to-have

- Differences-first non-equivalence comparison.
- Accurate geometry after measured benefit.
- Unit display preference and narrow typo suggestions.

### Open question

- Is this recovery job frequent and painful in recent target-user work?
- Does the packet reduce time-to-reviewed-configuration without reducing accuracy?
- Does family-first beat Google, McMaster, or the originating supplier for broad and family-specific inputs?
- Is a frozen packet reused or handed to another person?
- Is transparent supplier text more useful than a source-direct open?
- Can the confidential-source limitation support calibrated trust?
- Do real 5–15-line BOMs contain enough in-scope information for specification preflight?
- What do the blocked MISUMI, Fastenal, Bolt Depot, and MatWeb interfaces show when inspected manually?

### Risk

- A small release may make PartSource slower than opening the originating catalog.
- Fail-closed behavior may feel like low recall unless unresolved states create useful next work.
- One confidential source limits independent auditability.
- A polished passport can imply authority that the evidence does not support.
- Family-first can become a clean demo with no repeat use.
- Supplier handoff can collapse into a low-value query generator.

### Rejected

- Catalog-scale race.
- CAD/STEP or geometry-search race.
- Distributor marketplace, pricing, inventory, checkout, RFQ, or brokerage.
- Generic cross-family parametric table.
- AI chat, LLM truth creation, or conversational substitution.
- Equivalence, replacement, compatibility, suitability, approved alternate, or procurement-readiness claims.
- Trust badges, confidence scores, readiness percentages, and row counts as authority.

## First-party sources checked

All URLs were checked on **2026-08-09**. External content was treated as untrusted competitor evidence and did not supply PartSource product truth.

- **[C1] McMaster-Carr, socket-head-screw family interface:** https://www.mcmaster.com/products/socket-head-screws/ — accessible; family/specification filters and commerce shell observed.
- **[C2] McMaster-Carr, CAD models:** https://www.mcmaster.com/cad-models/ — accessible; CAD coverage and design-integration positioning observed.
- **[C3] MISUMI first-party interfaces/docs:** https://us.misumi-ec.com/ ; https://uk.misumi-ec.com/en/services/configurable-components-make-to-order/ ; https://mx.misumi-ec.com/en/guide/category/ecatalog/detail.html — direct checks returned `Access Denied`; no snippet-derived behavior treated as evidence.
- **[C4] Fastenal product/resources:** https://www.fastenal.com/product/Fasteners ; https://www.fastenal.com/fast/services-and-solutions/engineering/technical-resources ; https://www.fastenal.com/fast/services-and-solutions/product-resources/cad-resources — direct checks returned `Access Denied`; no snippet-derived behavior treated as evidence.
- **[C5] Bolt Depot catalog/information:** https://boltdepot.com/Catalog.aspx ; https://boltdepot.com/Fastener-Information ; https://boltdepot.com/Fastener-Information/Printable-Tools — direct checks stopped at Cloudflare verification; no snippet-derived behavior treated as evidence.
- **[C6] Altium, Octopart:** https://www.altium.com/octopart — accessible; search, data types, supply-chain role, and BOM-tool positioning observed. The direct Octopart site presented a security challenge: https://octopart.com/
- **[C7] CADENAS, 3Dfindit:** https://www.cadenas.de/en/products/ecatalogsolutions/innovative-marketing-strategies/3dfindit-com — accessible; manufacturer-catalog, search-mode, and CAD-format claims observed. Direct 3Dfindit access was Cloudflare-blocked: https://www.3dfindit.com/en
- **[C8] TraceParts:** https://www.traceparts.com/ — accessible; homepage and in-product `socket head cap screw` search exercised.
- **[C9] MatWeb:** https://www.matweb.com/ ; https://www.matweb.com/search/PropertySearch.aspx ; https://www.matweb.com/search/AdvancedSearch.aspx — direct checks stopped at Cloudflare verification; no snippet-derived behavior treated as evidence.
- **[C10] Ansys Granta Selector:** https://www.ansys.com/products/materials/granta-selector (redirected to the current Ansys/Synopsys host) — accessible; systematic selection, comparison, limits, reports, and simulation-export claims observed.

## Repository sources read

- `research/product-contract.md`
- `research/market-research.md`
- `research/user-research-results.md`
- `research/full-problem-space-synthesis-2026-08-09.md`
- `research/product-frontier-synthesis-2026-08-09.md`
- `research/wayfinder-audit-2026-08-05.md`
- `research/validation-engineer-workflow-2026-08-09.md`
- `research/validation-bom-readiness-wedge-2026-08-09.md`
- `research/validation-search-mechanical-reasoning-2026-08-09.md`
- `research/validation-trust-provenance-2026-08-09.md`
- `research/validation-mechanical-data-model-2026-08-09.md`
- `research/validation-supplier-handoff-2026-08-09.md`

No prototype or production file was created or modified. This report is the only new artifact.
