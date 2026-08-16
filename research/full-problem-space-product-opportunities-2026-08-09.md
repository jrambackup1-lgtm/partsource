# Fundamental product jobs and value opportunities

**Date:** 2026-08-09  
**Status:** Wayfinder exploration; not a spec, roadmap, or validation result.  
**Question:** Which mechanical-part jobs are real and valuable, and what could make PartSource materially better than a supplier catalog or query generator?

## Executive answer

The durable problem is not merely “find a screw” or “decode a McMaster number.” It is **recovering, completing, trusting, and preserving a mechanical requirement as it moves from design into a BOM and then through sourcing, manufacturing, and quality**.

The current configuration-recovery wedge is a good demonstration hook, but a weak complete product wedge:

- an exact identifier becoming readable is crisp;
- it uses the unusually high identifier coverage in the current data;
- but opening the originating supplier may be faster;
- identifier rights and coverage are fragile;
- a configuration alone does not answer supplier capability, approval, price, MOQ, availability, certification, or traceability;
- neutral supplier links risk being only pre-filled searches.

**Recommendation:** keep identifier recovery as one entry path. Test a broader **requirement-preservation wedge**: rough text, known identifier, or BOM line → family and structured requirement → explicit missingness → one supported configuration when possible → frozen, evidence-bearing handoff packet/BOM line. Supplier search remains secondary.

The strongest competing wedge is a **prototype-to-production BOM readiness audit**. It would normalize a small uploaded BOM, identify supplier-only identifiers and underspecified lines, distinguish “resolved,” “needs engineering input,” and “unsupported,” and export a clean handoff. It demonstrates value across multiple roles and is more seller-neutral than a catalog. It is also materially riskier because line-matching accuracy and coverage are unproven.

No primary user research has occurred: the repository records **0/12 sessions**.[I6] Therefore frequency, elapsed-time savings, downstream failure incidence, willingness to reuse, and willingness to pay remain open. Failure costs below are credible failure modes, not measured PartSource savings.

## Evidence boundary

This review separates four claims that earlier work sometimes blended:

| Layer | Finding | Classification |
|---|---|---|
| **Structural problem** | Supplier ecosystems are separate; terminology and field meaning do not transfer cleanly; engineering-to-procurement exchanges still require interpretation. NIST documents human transcription and terminology disagreement in product-data-sheet exchange.[S2] | **Confirmed** |
| **Task pain / frequency** | Supplier identifiers escape into BOM/CAD artifacts, sometimes without useful description; users do recover and re-source them.[S6][S7] | **Confirmed existence; frequency is an Open question** |
| **Solution value** | A seller-neutral, family-first requirement workspace with explicit unknowns could reduce wrong turns and handoff loss. | **Strong hypothesis** |
| **Business value** | Repeated BOM cleanup and downstream handoff could be worth more than one-off lookup, but no direct repeat-use or willingness-to-pay evidence exists. | **Open question** |

Authoritative technical sources establish consequence, not incidence. NASA’s fastener manual shows that selection spans material, plating, corrosion, locking, thread class, fatigue, torque, and other application-sensitive factors.[S1] NASA separately requires supply-chain risk management, procurement, receiving inspection, testing, traceability, and storage for mission fasteners.[S4] Those sources do **not** prove that typical PartSource users make frequent errors or that a web tool can perform application engineering or acceptance.

## Job map across the lifecycle

“Failure cost” means what can happen when the job fails. It is not a quantified estimate.

| User / moment | Current job | Workarounds and catalog-failure moment | Handoff and trust need | Failure cost | Finding |
|---|---|---|---|---|---|
| **Mechanical engineer — specify** | Turn functional intent into a complete, valid component requirement; compare family, size, pitch, length, material/strength, finish, thread coverage, and standard. | McMaster/supplier browse, Google, standards/PDFs, old drawings, CAD libraries, colleague memory. Broad queries produce near-duplicate listings; one seller’s assortment can make “not sold here” look like “invalid.” | Must know which facts came from the query, a reviewed source, a user choice, or inference; needs invalid vs not indexed vs unknown. | Wrong fit/load/corrosion choice; redesign, rework, delayed release, unsafe joint. NASA confirms the choice is multidimensional.[S1] | **Confirmed complexity; Open frequency** |
| **Product designer — explore and package** | Discover the right component family, understand geometry-changing choices, fit it into the assembly, and use a standard/preferred part instead of inventing another. | Supplier imagery, CAD downloads, Toolbox/Content Center, copied prior assemblies. CAD libraries can be approximate: SOLIDWORKS warns its fasteners omit accurate thread detail and may be unsuitable for some analysis.[S5] | Needs accurate family silhouette/drawing, envelope dimensions, units, standard, and a clear boundary between reference geometry and manufacturing truth. | Envelope clash, misleading analysis, late redesign, duplicate/nonstandard part proliferation. | **Confirmed workflow/caveat; Strong hypothesis on PartSource value** |
| **Prototype team — find and build now** | Convert a rough request or copied BOM line into a buildable item, preserve quantity and notes, and recover later what was actually chosen. | McMaster, local store, Amazon, spreadsheets, chat, copied project BOM. Speed encourages supplier-number-only lines and silent substitutions. | Engineer-to-builder handoff needs a readable configuration, unresolved fields, original clue, and frozen snapshot. | Build stall, wrong-item reorder, assembly rework, lost test day; magnitude/frequency unmeasured. | **Confirmed workflow existence; Strong hypothesis** |
| **Sourcing / procurement — make requirement sourceable** | Understand what engineering requires, identify candidate suppliers, ask the right questions, and respect vendor policy. | Email engineer, search each catalog, paste terms into Google, spreadsheet comparison, prior PO/history, local distributor calls. A supplier search is not supplier discovery: NIST scouting asks for process, dimensions, tolerances, performance, materials, certifications, regulations, volume, target price, delivery, and packaging.[S3] | Needs a requirement packet, allowed flexibility, manufacturer/listing identity, approvals, certifications and commercial facts. Most of the latter are outside the POC. | Quote loops, wrong request, schedule delay, unapproved buy, excess cost. | **Confirmed deeper job; Rejected as primary POC persona under current boundary** |
| **Manufacturing / assembly — consume the BOM** | Determine exactly what to install, plan tooling/assembly, and resolve ambiguity before work starts. | Drawing notes, traveler, ERP/BOM, physical sample, engineer interruption, supplier page. Catalog descriptions can omit application-critical assembly facts; a configuration is not an assembly instruction. | Needs revision-stable identity, dimensions/units, material/grade/finish, thread coverage, quantity, source/approval state, and escalation owner. | Line interruption, rework/scrap, wrong torque/tool, latent field failure. | **Strong hypothesis; direct incidence Open** |
| **Quality / receiving — accept or reject** | Verify that received hardware is eligible for the intended use and that evidence/lot records satisfy the required level of control. | PO/spec/drawing comparison, certificates, sampling/testing, quarantine, supplier contact. Retail pages and green badges cannot establish lot traceability or acceptance. | Needs listing/manufacturer/lot identity, required certificates, source chain, test/inspection state, and immutable revision. NASA explicitly treats these as separate controls.[S4] | Quarantine, retest, nonconformance, escape, recall/safety exposure. | **Confirmed trust job; Rejected for this POC beyond clear boundary language** |
| **BOM reuse / document control — reuse without drift** | Reuse a known component or prior BOM line, understand its original requirement, and avoid duplicate master parts. | Search PDM/PLM, prior project, supplier number, CAD filename, spreadsheet, personal memory. Autodesk users report McMaster CAD entering a BOM with only a number/no description, numbers disappearing after rename, and BOM exports lacking needed information.[S7] | Needs stable canonical configuration plus original identifiers, provenance/review date, frozen attributes, and explicit change handling. | Repeated research, wrong revision, duplicate internal SKUs, accidental spec drift, lost sourcing context. | **Confirmed examples; Strong hypothesis for repeat value** |

## Handoffs where value is created or destroyed

1. **Intent → engineering requirement.** Preserve raw wording and parsed constraints. Never turn an unresolved filter state into a part.
2. **Requirement → selected configuration.** Explain every remaining choice and distinguish invalid, absent from this release, and unknown.
3. **CAD → BOM.** Carry a readable description and technical attributes as well as the external identifier. Public user reports show this metadata can be lost.[S7]
4. **Prototype BOM → procurement.** Mark what is fixed, what may vary, and what still needs engineering input. Do not make procurement reverse-engineer a supplier number.
5. **Procurement → supplier.** A configuration is only part of the request. Capability, capacity, certification, commercial, delivery, and packaging fields remain separate.[S3]
6. **Supplier/listing → quality.** Preserve manufacturer/listing/lot evidence when it exists; do not let configuration provenance masquerade as traceability.[S4]
7. **Released BOM → reuse.** Freeze the historical selection and show later catalog changes instead of silently rewriting the BOM.[I2]

The cross-role trust model must answer five different questions independently:

- **Interpretation:** what did PartSource think the user meant?
- **Configuration:** what technical facts define this requirement?
- **Evidence:** which source supports which fact, and when was it reviewed?
- **Identity:** what identifier maps to the configuration, with what provenance?
- **Commercial/quality state:** is there a real listing, offer, approval, certificate, or traceable lot? These are absent in the POC.

One `verified` badge cannot answer all five.[I2]

## Moments where existing catalogs structurally fail

These are not claims that supplier catalogs are poor products. McMaster is strong counterevidence and often completes discovery and purchase extremely well.[I3]

A supplier catalog ceases to be sufficient when:

- the input belongs to another supplier or an internal/CAD namespace;
- the user has broad intent and needs family education before SKU rows;
- the requirement must be preserved independently of any seller’s current assortment;
- an empty result must be interpreted as invalid, not indexed, or unknown rather than “unavailable”;
- multiple near-identical variants need technical comparison without price/brand/card noise;
- a BOM contains many lines with mixed identifiers, descriptions, units, and missing fields;
- engineering must hand procurement a requirement rather than a buy link;
- manufacturing or quality needs revision, provenance, or traceability that the retail page does not prove;
- the team wants to reuse what it approved before, not rediscover what one seller offers today.

PartSource is not materially better merely by recreating catalog facets with cleaner styling. Its defensible difference is **seller-neutral requirement state, explicit missingness, layered evidence, and continuity across a project/BOM**.

## Competing wedges

### Wedge A — Exact-identifier configuration recovery (current lead)

**Job:** “Tell me what this opaque supplier number means.”  
**Why it works:** high-intent input, visually crisp result, strong current identifier coverage, direct BOM/CAD examples.[S6][S7][I2]  
**Why it may fail:** opening McMaster can be faster; proprietary mapping rights/coverage are fragile; one decoded line is episodic; it invites equivalence expectations; and downstream search links may add little.  
**Verdict:** **Strong hypothesis as acquisition/demo hook; Rejected as the whole wedge.**

### Wedge B — Requirement-first family workspace

**Job:** “Turn what I know into a complete requirement without hiding what I do not know.”  
**Difference from a catalog:** retains raw intent, ranks families, orders dependent facets, explains conflicts, and preserves invalid/not-indexed/unknown states independently of a seller.  
**Verdict:** **Strong hypothesis.** Best fit with current architecture and three-family POC, but user performance is untested.

### Wedge C — Prototype-to-production BOM readiness audit

**Job:** “Before I hand this BOM to sourcing, show which lines are understandable, complete, ambiguous, supplier-locked, or unsupported.”  
**POC shape:** local CSV import; normalize only reviewed fastener lines; exact identifier and text matching; per-line status; missing-field questions; frozen export. No ERP, account, price, stock, approval, or equivalence.  
**Why it may be stronger:** batch value is visible; it spans engineering/procurement; it makes unknowns useful; and it creates a durable artifact rather than a click-out.  
**Risk:** sparse/dirty descriptions, false line matches, family coverage, and CSV variability could make a tiny demo look staged.  
**Verdict:** **Strongest competing wedge; Open question until tested on real redacted BOM lines.**

### Wedge D — Evidence-bearing specification packet

**Job:** “Give the next person a compact, unambiguous packet of what is required and what still needs verification.”  
**POC shape:** export/shareable local packet with original clue, family/configuration, all selected and unresolved attributes, evidence layer, release ID, and neutral supplier query text.  
**Why it matters:** turns trust and handoff into the output; complements either Wedge A, B, or C.  
**Verdict:** **Strong hypothesis; should be tested as the completion event, not a detail-page ornament.**

### Wedge E — Preferred-part reuse and part-proliferation control

**Job:** “Use what our team already knows and approves before introducing another part.”  
**Why valuable:** likely recurring organizational value and stronger retention than public catalog search.  
**Why not now:** needs internal part masters, approval/policy state, revision history, team access, and often PLM/PDM integration—all excluded from the POC.  
**Verdict:** **Open question for later; not a current POC wedge.**

### Wedge F — Incoming-part/quality verification

**Job:** “Does this received item and its evidence satisfy the released requirement?”  
**Why valuable:** high consequence.  
**Why not now:** requires manufacturer/listing/lot/certificate identity, inspection rules, and authorization. Configuration data cannot prove acceptance.[S4]  
**Verdict:** **Rejected for POC.** Preserve the future data boundary; do not simulate quality approval.

## Opportunity scoring

Scores use **1 (low) to 5 (high)**. For **risk**, 5 means greatest product/trust/scope risk. No weighted total is used because the project has not chosen weights.

| Opportunity | Classification | User value | POC proof value | Data feasibility | Risk | Why / smallest honest proof |
|---|---|---:|---:|---:|---:|---|
| **Requirement-first family workspace** | **Strong hypothesis** | 5 | 5 | 4 | 3 | Compare broad, family-specific, exact, ambiguous, and absent-release tasks against normal methods; current parser/family data can support a bounded test.[I5] |
| **BOM readiness audit / line linting** | **Strong hypothesis + Open accuracy question** | 5 | 5 | 3 | 4 | Import a real redacted CSV; classify each line and generate engineering questions. Proves batch/handoff value, but wrong matches are costly. |
| **Evidence-bearing handoff packet** | **Strong hypothesis** | 5 | 4 | 4 | 3 | Export one frozen resolved line with raw intent, explicit nulls, provenance states, and release identity. |
| **Transparent missingness, conflict, and coverage states** | **Confirmed trust need** | 4 | 5 | 5 | 2 | Demonstrate invalid vs not indexed vs unknown and field-level evidence. This is foundational differentiation, not a standalone business. |
| **Identifier/CAD-BOM metadata repair** | **Strong hypothesis** | 4 | 5 | 4 | 4 | Resolve reviewed identifiers and produce a useful description/configuration; direct user examples exist, but mapping rights and breadth remain fragile.[S7] |
| **Neighboring-configuration comparison within a family** | **Strong hypothesis** | 4 | 4 | 4 | 3 | Change one attribute while holding the rest; show consequence and evidence without claiming suitability or equivalence. |
| **Local reuse memory: “used in this BOM/project before”** | **Open question** | 4 | 3 | 4 | 2 | Browser-local history can be tested without accounts; organizational preferred/approved status cannot. |
| **Supplier-specific search query generation** | **Nice-to-have, not a wedge** | 2 | 3 | 5 | 4 | Test destination usefulness. Reject if users say it merely recreates Google or assume it proves a match.[I5] |
| **Geometry/image/barcode discovery** | **Nice-to-have / deferred** | 3 | 3 | 1 | 5 | Useful for unknown physical parts and family disambiguation, but shape cannot prove material, tolerance, standard, or equivalence. |
| **Preferred/approved internal-part reuse** | **Open question, later** | 5 | 2 | 1 | 4 | High organizational value; needs accounts, policy, internal data, and integrations. |
| **Incoming quality acceptance** | **Rejected for POC** | 5 | 1 | 1 | 5 | Cannot be proven from configuration records; requires traceable item/lot/certificate and inspection evidence. |
| **Equivalence, price/stock, or “best supplier”** | **Rejected** | 5 | 1 | 1 | 5 | Decisive commercial value but expressly outside evidence, source rights, and POC truth boundaries.[I1][I4] |

## Priority decision

### What to prove first

Use one bounded experiment with three connected completion events:

1. **Recover:** exact identifier or rough description resolves to a family and preserved requirement state.
2. **Complete honestly:** the user reaches one published configuration or understands exactly why they cannot; no silent assumptions.
3. **Hand off:** save/export a frozen, evidence-bearing BOM line or mini-packet that another role can interpret.

Then run a second thin experiment for the strongest challenger:

- import 5–15 real redacted fastener BOM lines;
- classify `resolved`, `ambiguous`, `needs engineering input`, and `unsupported`;
- never guess a unique configuration;
- ask whether the resulting issue list is more valuable than processing lines one at a time in supplier sites.

This reframes family-first as the **interaction model**, not the value proposition. The value proposition is requirement continuity and reduced ambiguity.

### What not to claim

- Do not claim measured time, rework, scrap, downtime, or savings.
- Do not call a configuration suitable for an application.
- Do not treat a supplier destination as a listing, candidate match, availability signal, or equivalent.
- Do not imply a BOM line is procurement-ready if commercial, approval, certification, or traceability fields are required but absent.
- Do not position procurement, manufacturing, or quality as “served personas” merely because they consume an export.

## Decisions by classification

### Confirmed

- Mechanical fastener selection is multidimensional and can be consequential.[S1]
- Engineering/procurement product-data exchange can require human transcription and suffer terminology/field-meaning disagreement.[S2]
- Serious supplier discovery requires technical and business context beyond a part search.[S3]
- Quality/receiving trust includes procurement, inspection/testing, traceability, and storage controls separate from design configuration.[S4]
- Standard-part libraries and supplier CAD are real design/BOM inputs; CAD representations and metadata have important limits.[S5][S7]
- Supplier identifiers appear in external BOM/CAD workflows.[S6][S7]
- Current PartSource data is unusually identifier-rich but incomplete in pitch/finish and not safely classified by its three import buckets.[I2]
- There is no direct participant validation.[I6]

### Strong hypotheses

- Requirement preservation across handoffs is a larger and more durable job than identifier decoding.
- Family-first is valuable for broad/configuration intent if exact lookup remains inspector-first.
- A BOM readiness audit can create clearer POC value than one-line lookup.
- Explicit missingness and layered provenance can differentiate PartSource from seller catalogs.
- A frozen handoff packet is a better completion event than supplier click-through alone.

### Open questions

- Which role feels the pain often enough to adopt: engineer, prototype lead, buyer, or BOM owner?
- Is line-by-line recovery frequent, or mostly an edge case?
- Do real BOM descriptions contain enough information for safe normalization?
- Does family-first beat McMaster/Google on time, wrong turns, and confidence?
- Does procurement accept a configuration packet, or still need an engineer-written drawing/spec?
- Are neutral supplier searches useful after users inspect the destination?
- Does local BOM history create repeat use?
- Is fastener-only coverage broad enough to feel credible?
- Can identifier mapping remain publishable, correct, and current at useful breadth?
- What failure costs and willingness to pay exist in the target small-team segment?

### Nice-to-have

- Static, source-backed silhouettes/drawings.
- Barcode/camera entry and geometry search.
- CAD downloads or direct CAD integration.
- Local “used before” history.
- Supplier query templates, only if task testing proves incremental value.

### Rejected

- Configuration recovery as the entire product wedge.
- “Prettier supplier catalog” as differentiation.
- Neutral supplier links as proof of sourcing success.
- Equivalence/replacement/approved-alternate claims.
- Price, stock, purchasing, accounts, ERP, team approval, or supplier scraping in the POC.
- Quality acceptance or application-suitability claims from configuration data.
- AI/semantic search before deterministic task failures establish a need.

## Key disagreements with the current frontier

1. **Configuration recovery should not lead the product story.** It is an entry hook inside the larger requirement-continuity job.
2. **Family-first is not itself a wedge.** It is a candidate interaction model; success must be judged by correct completion and handoff, not preference.
3. **Supplier handoff is too weak to carry “sourcing.”** NIST’s supplier-scouting schema shows how much capability, certification, business, delivery, and packaging context lies beyond a query URL.[S3]
4. **The BOM should be treated as a diagnostic and continuity surface, not only storage/export.** Readiness states and unresolved questions are potentially the strongest POC differentiator.
5. **Procurement, manufacturing, and quality are downstream stakeholders, not current primary users.** The POC omits the fields and controls that complete their jobs.
6. **Trust cannot be solved by provenance display alone.** Interpretation, configuration evidence, identifier mapping, listing/offer identity, approval, and lot traceability are separate states.
7. **High consequence does not prove high frequency or business value.** Current evidence justifies careful design and direct testing, not ROI claims.

## Sources

### External evidence

- **[S1]** NASA, *Fastener Design Manual* — selection topics include materials, platings, corrosion, locking, threads/classes, fatigue, and torque: https://ntrs.nasa.gov/citations/19900009424
- **[S2]** NISTIR 8035, *Product Data Sheet Ontology* — human interpretation/transcription and terminology/field-meaning disagreement in engineering/procurement data exchange: https://www.nist.gov/publications/product-data-sheet-ontology
- **[S3]** NIST MEP, *Supplier Scouting Opportunity Synopsis* — technical, certification, regulatory, volume, price, delivery, packaging, capability, capacity, and business-interest fields: https://meis.nist.gov/supplierscouting/submit
- **[S4]** NASA-STD-8739.14, *Fastener Procurement, Receiving Inspection, and Storage Practices for NASA Mission Hardware*: https://standards.nasa.gov/standard/NASA/NASA-STD-873914
- **[S5]** SOLIDWORKS Help, *Toolbox Overview* — integrated standard-part library; configurable standards; approximate fasteners without accurate thread detail: https://help.solidworks.com/2021/English/SolidWorks/toolbox/c_toolbox_overview.htm
- **[S6]** Intel SAWR open hardware assembly guide — McMaster-numbered BOM with links as reference and permission to use other suppliers: https://github.com/intel/sawr/blob/master/sawr_hardware/ASSEMBLY.md
- **[S7]** Autodesk Fusion community, direct user evidence: missing descriptions/default material, lost numbers after rename, and incomplete McMaster BOM outputs: https://forums.autodesk.com/t5/fusion-design-validate-document/am-i-missing-something-bom-descriptions-for-mcmaster-parts/td-p/6858553 ; https://forums.autodesk.com/t5/fusion-support-forum/mcmaster-part-numbers-after-renaming/td-p/8076535 ; https://forums.autodesk.com/t5/fusion-design-validate-document/create-list-of-inserted-mcmaster-parts/td-p/7469511
- **[S8]** McMaster-Carr, Product Information API — part-number retrieval is an approved-customer, credentialed workflow rather than an assumed public API: https://www.mcmaster.com/help/api/

### Internal synthesis and boundaries

- **[I1]** `research/product-contract.md` — authoritative current claim and scope boundary.
- **[I2]** `research/product-frontier-synthesis-2026-08-09.md` — data audit, family/search direction, trust separation, and unresolved frontier.
- **[I3]** `research/mechanical-discovery-problem-evidence-2026-08-09.md` — direct workflow evidence, counterevidence, and current wedge.
- **[I4]** `research/competitive-matrix.md` and `research/family-first-reference-patterns-2026-08-09.md` — official catalog/task comparison and transfer limits.
- **[I5]** `research/poc-discovery-benchmark.md` — planned external-method comparison and falsification thresholds.
- **[I6]** `research/user-research-results.md` — 0/12 sessions; no primary validation.
- **[I7]** `research/data-source-register.md` — allowed dataset and blocked supplier/mapping sources.
