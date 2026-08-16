# PartSource competitive matrix

> **HISTORICAL COMPETITIVE RESEARCH.** Preserve source comparisons. Old PartSource capability, phase, BOM, supplier-handoff, and roadmap cells are not current product claims or plans.

**Packet:** MP-1.7
**Evidence snapshot:** 2026-07-13
**Authority:** Historical evidence only. `research/product-contract.md` controls current product claims.

This is a task comparison, not a claim that similarly named features have equivalent scope, evidence quality, permissions, or commercial terms. It uses current official public pages only. Account-only behavior was not tested, no accounts were created, and no purchase flow was completed.

## Evidence-state legend

- `Documented` — the named capability is explicitly shown or described by a current official public page.
- `Partial` — official evidence supports only part of the task, or a material boundary remains undocumented.
- `Not confirmed` — the reviewed official public evidence did not confirm the capability. This does not prove absence.
- `Not applicable` — the task does not fit the product's stated role; this is not a quality judgment.
- `PartSource target — Phase X` — not a current PartSource capability; the master plan assigns it to the named phase. `X` is a placeholder in this legend only.

Each capability cell begins with exactly one controlled evidence state. Source keys resolve to direct official URLs under [Official sources](#official-sources).

## Capability matrix

| User task | McMaster-Carr | Grainger | Fastenal | MISUMI | RS | Bolt Depot | Amazon Business | PartSource |
|---|---|---|---|---|---|---|---|---|
| Exact identifier lookup | **Documented** — Public search and product pages expose McMaster part numbers; the approved-customer API retrieves product information by part number. [M1] [M5] [M7] | **Partial** — Lists can store Grainger and customer part numbers, but the reviewed help did not explicitly define exact-search behavior. [G2] | **Partial** — Official help documents catalog search and product cross-reference access, but exact-result guarantees are not stated. [F1] | **Documented** — Search by keyword or part number and part-number specification are documented. [MI1] | **Documented** — RS stock numbers and manufacturer part numbers can be entered in search. [R2] | **Not confirmed** — Public catalog and quick-add cart are visible, but exact identifier resolution was not documented in the reviewed pages. [B1] [B2] | **Partial** — Bulk RFQ item entry accepts ASIN, URL, supplier SKU, or manufacturer part number; normal exact catalog resolution was not confirmed. [A3] | **Documented** — Current bundled-catalog exact identifiers resolve; unknown input remains a candidate/configuration, not a stocked product. [P1] |
| Broad discovery and filtering | **Documented** — Category browsing and attribute filters are public. [M1] | **Documented** — Fastener categories, counts, and engineering filters such as thread size, material, grade, finish, and length are public. [G1] | **Documented** — Official help documents cross-category search and brand/manufacturer refinement. [F1] | **Documented** — Category, specification, keyword/part-number, and maker/brand search are documented. [MI1] | **Documented** — Public guides document category browsing, keyword search, filters, comparison, and technical support. [R1] [R2] | **Documented** — The catalog exposes US/metric categories and filters for material, grade, diameter, pitch, length, drive, and head. [B2] | **Partial** — Wide selection and search are documented, but mechanical-engineering facets and hard-constraint behavior are not confirmed. [A1] | **Partial** — Current bundled fastener search is useful but coverage and broad-query handling are incomplete. **PartSource target — Phase 4** — Safe family discovery, hard constraints, facets, explanations, and query persistence. [P1] [P2] |
| Technical specification and reference | **Documented** — Product families expose dimensions, materials, standards, cautions, package basis, and identifiers. [M5] | **Documented** — Category pages explain engineering attributes and expose structured specification columns. [G1] | **Documented** — Official help documents product specifications, SDS, material reports, calculators, and CAD resources. [F1] [F2] | **Documented** — Specification-led configuration, e-catalog data, and 2D/3D drawings are documented. [MI1] [MI4] | **Documented** — Specifications, datasheets, certificates, product comparison, and technical support are documented. [R1] [R4] | **Documented** — Public fastener guides, sizing tools, category definitions, and engineering filters are provided. [B1] [B2] | **Not confirmed** — Reviewed official pages describe purchasing selection and offers, not a mechanical standards/reference system. [A1] | **Partial** — Current reference content exists, but provenance, standards editions, and SME review are incomplete. **PartSource target — Phase 2** — Provenance, standards registry, units, cross-reference policy, and reviewed publishing. [P1] [P2] |
| CAD availability | **Documented** — Public product CAD plus a SolidWorks add-in with model search, insertion, replacement, and BOM generation. [M2] [M5] | **Not confirmed** — The reviewed official public pages did not confirm a general CAD-download capability. | **Documented** — Thousands of product models in 19 CAD formats plus 2D drawings are documented. [F2] | **Documented** — 2D/3D downloads and generated CAD for configured products are documented. [MI1] [MI4] | **Documented** — RS documents downloadable CAD models and 3D product views for part of its range. [R4] | **Not confirmed** — No CAD capability was confirmed in the reviewed official catalog and information pages. [B1] [B2] | **Not confirmed** — No mechanical CAD capability was confirmed in the reviewed Amazon Business sources. [A1] | **Not applicable** — CAD/STEP downloads are not on the approved roadmap; adding them requires a future contract revision. [P1] |
| Alternatives and cross-reference status | **Partial** — The CAD add-in can replace a model with another that meets design needs; it does not publicly define an exact-equivalence review standard. [M2] | **Not confirmed** — No official public evidence reviewed here defined alternative or cross-reference semantics. | **Partial** — Product pages may show alternatives described as same fit, form, and function; the public page does not state the evidence/review method. [F3] | **Partial** — “Search Similar Products” is documented, but exact-equivalence or cross-reference evidence is not. [MI1] | **Partial** — Alternative search and manual filtering are documented; the BOM workflow separately labels potential matches for user acceptance. [R1] [R3] | **Not confirmed** — No alternative/cross-reference workflow was confirmed in the reviewed official pages. [B1] [B2] | **Not confirmed** — Multiple offers and sellers are documented, but mechanical cross-reference or exact-equivalence verification is not. [A1] [A3] | **PartSource target — Phase 5** — Typed candidate, cross-reference, and exact-equivalence states with evidence and review; none is currently verified by PartSource. [P1] [P2] |
| Public commercial visibility | **Documented** — Product pages show price and package basis; McMaster says website pricing and lead times are available and an account is not required to order. [M4] [M5] | **Partial** — Category pages expose price columns and lists show price/availability, but list access requires sign-in and public values can be context-dependent. [G1] [G2] | **Partial** — Availability and product information are public; local availability and custom pricing are account/location dependent. [F1] [F3] | **Partial** — Price, ship date, freight, and formal quotes are documented in the registered ordering workflow. [MI2] [MI3] | **Documented** — Product and BOM help documents price and stock visibility, including explicit potential-match states. [R2] [R3] | **Partial** — Stock and buy-by-piece/bag/bulk are public; a general price-visibility rule was not documented in the reviewed pages. [B1] | **Documented** — Business pricing, quantity discounts, multiple supplier offers, and RFQ offers are documented. [A1] [A3] | **Not applicable** — PartSource provides no live prices, inventory, availability, lead times, supplier listings, or offers; BOM costs are user data. [P1] |
| Supplier search and handoff | **Not applicable** — The reviewed task is fulfilled inside McMaster's own distributor catalog, not through cross-supplier discovery. [M1] | **Not applicable** — The reviewed task is fulfilled inside Grainger's distributor catalog, not through cross-supplier discovery. [G1] | **Not applicable** — Fastenal documents its own catalog and supply-chain/partner availability, not a user-facing cross-supplier handoff. [F1] [F3] | **Not applicable** — The reviewed sources describe MISUMI catalog/configurator and ordering workflows, not external supplier handoffs. [MI1] [MI4] | **Not applicable** — The reviewed sources describe RS catalog, matching, quote, and order workflows, not external supplier handoffs. [R1] [R3] | **Not applicable** — Bolt Depot is a direct fastener retailer in the reviewed sources. [B1] | **Documented** — Marketplace selection and RFQ can match buyers with multiple sellers and expose offers for evaluation. [A1] [A3] | **Documented** — Current supplier-site links are specification-led search handoffs only; destination results require independent verification and are not listings or offers. [P1] |
| BOM and list workflow | **Documented** — The SolidWorks add-in creates a BOM, calculates units/packs, supports copy, and can send an order to McMaster. [M2] | **Partial** — Signed-in personal/shared lists support saved quantities, internal part numbers, price/availability, and cart transfer; engineering BOM import is not confirmed. [G2] | **Partial** — Registered order templates, Excel upload, order history, and eQuotes are documented; a neutral engineering BOM workspace is not. [F1] | **Documented** — Copy/paste or file import of a BOM into quoting plus quote/order history is documented. [MI2] [MI3] | **Documented** — BOM upload, field mapping, accepted/potential/unmatched states, saved quotes, and checkout are documented. [R3] | **Partial** — Cart/quick-add ordering is public, but BOM import, named lists, and export were not confirmed. [B1] [B2] | **Partial** — Reorder lists and multi-SKU bulk RFQ are documented; an engineering BOM with requirement/selection separation is not. [A2] [A3] | **Documented** — Browser-local BOM, CSV import/export, and PDF export exist; current supplier/price fields remain user data. **PartSource target — Phase 6** — Named local BOMs, requirement/selection separation, safe import, storage health, and explicit export basis. [P1] [P2] |
| Company procurement controls | **Documented** — Punchout, approved-customer product API, and cXML/EDI procure-to-pay integration are documented. [M3] | **Documented** — OMS provides roles, approval/rejection, spend and budget limits, notifications, PO references, and admin controls. [G4] | **Documented** — Users/permissions, request-only buyers, approvals, PO/job numbers, cross-reference access, and spend visibility are documented. [F1] | **Partial** — Shared customer-code history and internal order authorization are documented; full policy/role semantics are not. [MI2] [MI3] | **Partial** — Cost centres, saved quotes, purchase-order support, and account services are documented; approval policy controls were not confirmed. [R1] [R3] | **Not confirmed** — No company roles, approvals, budgets, or procurement integration were confirmed in the reviewed public pages. [B1] | **Documented** — Multi-user accounts, buying policies, approvals, budgets, preferred/restricted sellers, integrations, and spend tools are documented. [A1] [A2] | **PartSource target — Phase 8** — Secure backend, organizations, roles, shared/versioned BOMs, approvals, policy, and audit history. No current account or company workflow exists. [P1] [P2] |
| Anonymous and local use | **Partial** — Public browse is available and an account is not required to order; browser-local project storage is not documented. [M1] [M4] | **Partial** — Public catalog browse is available; saved lists and OMS require sign-in. [G1] [G2] [G4] | **Partial** — Public product research is documented; templates, permissions, custom pricing, and personalized availability require registration/sign-in. [F1] [F3] | **Partial** — Public e-catalog discovery exists, while quoting/ordering requires registration; local-only work is not documented. [MI1] [MI3] | **Partial** — Public search/browse is documented; saved BOM/quote work is account-based rather than confirmed local-only. [R2] [R3] | **Partial** — Public browse and cart are visible; local persistence and export were not confirmed. [B1] [B2] | **Not confirmed** — Reviewed Amazon Business capabilities are account/organization workflows; anonymous local use was not confirmed. [A1] [A2] | **Documented** — Anonymous browser-local BOM persistence and client-side import/export are current defaults; no registration, cloud sync, or account exists. [P1] |
| Verification boundary | **Partial** — McMaster says it verifies specifications and offers traceable certificates for selected products; no cross-vendor equivalence boundary was confirmed. [M1] [M6] | **Partial** — Structured product data is public, but reviewed pages did not define provenance or exact-equivalence review. [G1] | **Partial** — Alternatives are presented as same fit, form, and function, but the public evidence/reviewer boundary was not stated. [F3] | **Partial** — Configured MISUMI parts generate identifiers and CAD; cross-manufacturer exact-equivalence verification was not confirmed. [MI4] | **Partial** — BOM results distinguish accepted, potential, and unmatched; the buyer must accept potential matches. Exact-equivalence review is not claimed. [R3] | **Partial** — Reference tools and customer help are documented; provenance and equivalence review were not confirmed. [B1] | **Partial** — Seller offers and ratings support purchasing evaluation; mechanical specification/equivalence verification was not confirmed. [A3] | **Documented** — Product Truth separates configuration, candidate, cross-reference, exact equivalent, approved alternate, supplier listing, and offer; current handoffs always require independent verification. [P1] |

## Role and category distinction

- **Retailer/distributor catalog:** McMaster-Carr, Grainger, Fastenal, RS, and Bolt Depot organize items they sell or source, expose commercial/order flows, and are authoritative only for their own presented catalog/listing context.
- **Manufacturer/configurator:** MISUMI combines distribution with made-to-order configuration; user-selected parameters can generate a MISUMI part number, CAD, price, and lead-time presentation. [MI4]
- **Marketplace:** Amazon Business connects organizational buyers to products and offers from multiple sellers, with business purchasing controls and bulk RFQ. [A1] [A2] [A3]
- **PartSource role:** PartSource is a standards-first discovery and local-BOM tool. It interprets hardware requirements, keeps user work local, and opens supplier searches for independent verification. It does not become the catalog, listing, offer, or order authority.

These roles are not interchangeable. Catalog breadth, seller breadth, configurability, standards interpretation, local work, and procurement governance solve different tasks.

## Task-based findings by persona

### Engineers

Incumbent advantage: McMaster, Fastenal, MISUMI, and RS document CAD and dense product detail; Grainger, McMaster, and Bolt Depot expose strong category/attribute discovery. PartSource opportunity: explain standards and query interpretation before a user commits to a seller-specific item. PartSource must preserve units, pitch, grade, material, finish, and evidence state; it must not imply a candidate is manufactured, stocked, or equivalent.

### Procurement users

Incumbent advantage: Grainger, Fastenal, McMaster, MISUMI, and Amazon Business document account, ordering, approval, integration, or quote controls. PartSource can reduce requirement ambiguity and produce a clean handoff/export, but current local BOM and supplier searches are not an approval workflow, quote system, or procurement system of record. Procurement collaboration stays in Phase 8; sanctioned supplier data stays in Phase 9; transactions stay in Phase 11.

### Maintenance users

Incumbent advantage: distributor catalogs combine availability, order history, saved lists, local branches, and replacement flows. RS explicitly distinguishes potential BOM matches for user acceptance; this is a useful truth pattern. PartSource can help decode an identifier or structure a requirement, but must show unsupported/ambiguous states and never turn dimensional similarity into an equivalent replacement.

### Small-company buyers

Incumbent advantage: Bolt Depot documents no-minimum fastener purchases, Amazon Business supports broad multi-seller buying, and industrial distributors expose order and quote workflows. PartSource can offer a no-account local workspace and portable BOM before supplier selection. It must not promise cheapest sourcing, live availability, split orders, consolidated checkout, or brokerage until later phase entry gates pass.

## Product and roadmap decisions

### Defensible wedge

1. **Standards-first interpretation before catalog selection:** make dimensions, units, thread, standard, material, finish, strength, and uncertainty explicit.
2. **Truthful bridge across seller-specific catalogs:** generate specification-led searches without representing destination pages as listings, offers, matches, or equivalents.
3. **Anonymous local preparation:** let a small team build, import, edit, and export a BOM without adopting another supplier account.
4. **Visible verification boundary:** preserve candidate, cross-reference, exact-equivalent, approved-alternate, supplier-listing, and offer distinctions competitors' public task flows do not consistently expose.

### Table stakes

- Phase 2: trustworthy taxonomy, standards/edition registry, exact units, provenance, and review lifecycle.
- Phase 4: exact identifier correctness, safe broad discovery, metric/imperial parsing, hard constraints, facets, and explanation.
- Phase 5: evidence-backed detail and typed candidate/cross-reference/equivalence states.
- Phase 6: durable named local BOMs, safe import, requirement/selection separation, and honest exports.

CAD is valuable in incumbent engineering workflows, but the authoritative contract explicitly rejects CAD/STEP downloads from the current roadmap. It is not table stakes for the approved PartSource wedge.

### Gaps

- Current catalog/reference provenance and complete metric/imperial coverage are incomplete (Phase 2).
- Broad queries, facets, hard-constraint guarantees, and ranking explanations are incomplete (Phase 4).
- PartSource does not verify cross-references/equivalents or provide sourced offers (Phase 5, then sanctioned data in Phase 9).
- The local BOM lacks the complete requirement/selection and storage-health model (Phase 6).
- No organizations, shared BOMs, approvals, roles, or audit history exist (Phase 8).
- No sanctioned supplier listings, prices, availability, freshness controls, or adapters exist (Phase 9).
- No checkout, order, payment, fulfilment, returns, or brokerage operation exists (Phase 11).

### Explicit no-build decisions

- Do not clone a retailer catalog or marketplace, and do not ingest competitor catalogs without sanctioned rights (Phase 9 entry gate).
- Do not add CAD/STEP downloads, automatic split-order optimization, embedded commerce widgets, or a public admin portal; these have no current roadmap owner. [P1]
- Do not add accounts, team sharing, approvals, or procurement theatre before the secure Phase 8 backend trigger.
- Do not display supplier listings, live prices, inventory, availability, certifications, or lead times before Phase 5 display rules and Phase 9 sanctioned sources/freshness controls.
- Do not claim verified alternatives or exact equivalents before Phase 5 evidence and review policy.
- Do not add checkout, consolidated ordering, payments, or brokerage before Phase 11 commercial, legal, supplier, operational, and support entry requirements pass.

## Product Truth disclaimers

PartSource is not a supplier catalog, marketplace, price-comparison engine, approved-vendor system, order system, or procurement system of record.

A configuration is not necessarily manufactured or stocked. A supplier-site search URL is not an offer. A candidate is not an equivalent. An equivalent is not approved without organizational approval.

PartSource has no live offers, verified equivalents, approvals, supplier listings, accounts, or commerce.

Any competitor capability marked `Documented` means only that its official page documents that capability. It does not mean PartSource independently verified an item, specification, stock state, price, seller, replacement, certification, or commercial term.

## Official sources

All competitor sources below are official public pages. Retrieved: 2026-07-13.

### McMaster-Carr

- [M1 — Catalog, search, categories, and public service claims](https://www.mcmaster.com/) — Retrieved: 2026-07-13.
- [M2 — SolidWorks add-in, CAD replacement, and BOM workflow](https://www.mcmaster.com/solidworksaddin/) — Retrieved: 2026-07-13.
- [M3 — Punchout, product API, cXML, and EDI](https://www.mcmaster.com/punchout/) — Retrieved: 2026-07-13.
- [M4 — Ordering, account boundary, pricing, and quote guidance](https://www.mcmaster.com/international/) — Retrieved: 2026-07-13.
- [M5 — Example public product specification, identifier, price basis, and CAD](https://www.mcmaster.com/products/grinding-bits/shape-number~w152/) — Retrieved: 2026-07-13.
- [M6 — Material certificates and traceability](https://www.mcmaster.com/info-certificates) — Retrieved: 2026-07-13.
- [M7 — Approved-customer product-information API and part-number retrieval](https://www.mcmaster.com/help/api/) — Retrieved: 2026-07-13.

### Grainger

- [G1 — Fastener categories, engineering filters, specifications, and price columns](https://www.grainger.com/category/fasteners/bolts-screws?attrs=Finish+Type%7CHot+Dipped+Galvanized&filters=attrs) — Retrieved: 2026-07-13.
- [G2 — Personal/shared lists](https://www.grainger.com/content/mc/help/my-lists) — Retrieved: 2026-07-13.
- [G3 — Help desk and account/order capabilities](https://www.grainger.com/content/help) — Retrieved: 2026-07-13.
- [G4 — Order Management System roles and controls](https://www.grainger.com/content/mc/help/order-management-system) — Retrieved: 2026-07-13.

### Fastenal

- [F1 — Search, order templates, eQuotes, Excel upload, users, permissions, and cross-reference help](https://www.fastenal.com/fast/help) — Retrieved: 2026-07-13.
- [F2 — CAD resources](https://www.fastenal.com/fast/services-and-solutions/product-resources/cad-resources) — Retrieved: 2026-07-13.
- [F3 — Availability states and alternative-item claims](https://www.fastenal.com/fast/help/product-availability-help-page) — Retrieved: 2026-07-13.

### MISUMI

- [MI1 — Search, filters, similar products, CAD, quote/order, and My Components guide](https://my.misumi-ec.com/guide/) — Retrieved: 2026-07-13.
- [MI2 — Pricing, BOM import, order history, and internal authorization](https://us.misumi-ec.com/pr/wos/index.html) — Retrieved: 2026-07-13.
- [MI3 — Web ordering FAQ, registration, shared history, pricing, and BOM](https://account.misumi-ec.com/contents/us/en/help/faqs.html) — Retrieved: 2026-07-13.
- [MI4 — Configurable made-to-order components](https://uk.misumi-ec.com/en/services/configurable-components-make-to-order/) — Retrieved: 2026-07-13.

### RS

- [R1 — Product search, comparison, specifications, alternatives, and BOM support](https://my.rs-online.com/web/content/support/rs-technical-support) — Retrieved: 2026-07-13.
- [R2 — Product-number search, browsing, filters, specifications, and public price](https://za.rs-online.com/web/content/support/all-articles/finding-products) — Retrieved: 2026-07-13.
- [R3 — BOM upload, matching states, quotes, price, and stock](https://au.rs-online.com/web/content/support/all-articles/bom) — Retrieved: 2026-07-13.
- [R4 — CAD models, datasheets, and certificates](https://at.rs-online.com/web/content/hilfe/hilfe-inhalte/produkte) — Retrieved: 2026-07-13.

### Bolt Depot

- [B1 — Catalog role, stock, order quantities, and fastener reference](https://boltdepot.com/) — Retrieved: 2026-07-13.
- [B2 — Public catalog filters and cart](https://boltdepot.com/Catalog.aspx) — Retrieved: 2026-07-13.

### Amazon Business

- [A1 — Purchasing solutions, integrations, controls, bulk buying, and RFQ](https://business.amazon.com/en/solutions) — Retrieved: 2026-07-13.
- [A2 — Guided Buying policies and approvals](https://business.amazon.com/en/solutions/compliance-management/guided-buying) — Retrieved: 2026-07-13.
- [A3 — Multi-seller Request for Quote](https://business.amazon.com/en/solutions/bulk-buying/request-for-quote) — Retrieved: 2026-07-13.

## Internal authority sources

- [P1 — Authoritative product contract](product-contract.md) — current authority read 2026-07-13.
- [P2 — Archived master plan](archive/paused-2026-07-31/master-plan.md) — historical phase ownership read 2026-07-13.

## Research limitation

This is a public-evidence snapshot, not a usability test or account-level feature audit. Regional pages may differ. `Not confirmed` is deliberately used when reviewed official evidence is absent or ambiguous; it must not be restated as “does not exist.” Commercial prices, feature entitlements, catalog counts, and account behavior can change and require fresh verification before operational use.
