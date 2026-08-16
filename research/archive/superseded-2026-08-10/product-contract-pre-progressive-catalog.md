> **HISTORICAL — superseded 2026-08-10. Do not use as current product direction.**

# PartSource Authoritative Product Contract

> **Exploration note (2026-08-09):** This file remains the authority for current public claims and safety boundaries. It is not the final product-shape document. The active Wayfinder map is exploring a broader family-first mechanical-component discovery POC before `/to-spec`.

**Status:** Authoritative — sole current source of truth

**Effective:** 2026-07-31

**Execution-plan owner:** `research/production-readiness-plan.md`

**Execution evidence:** `research/production-readiness-checklist.md`

When current product or research documents conflict, this contract wins. Earlier PRDs, grill decisions, business plans, audits, checklists, prototype prompts, and implementation notes remain useful inputs and history; they do not override this contract.

## Authority and precedence

1. This contract controls current product purpose, users, terminology, capability claims, boundaries, and resolved decisions.
2. `research/production-readiness-plan.md` controls implementation sequence, scope, and launch gates.
3. `research/release-truth.md` controls candidate, release, and production-verified identity.
4. `research/production-readiness-checklist.md` controls execution status and recorded evidence.
5. The shipped runtime and its tests prove what is implemented. A mismatch with this contract is a defect to reconcile, not permission to expand a claim.
6. `research/data-source-register.md` controls whether a source may be ingested or published.
7. `research/prd.md`, `research/grill-decisions.md`, `research/data-sourcing-decision.md`, `research/business-plan.md`, `research/pseo-risk-audit.md`, and other research documents are subordinate decision inputs or historical snapshots.
8. Files under `research/archive/` and `archive/` are historical only.

No historical file is deleted or rewritten merely because this contract supersedes one of its claims.

## Product purpose and primary users

PartSource is a standards-first mechanical hardware discovery and sourcing-assistance tool. It helps people search for hardware configurations from simple text, known catalog identifiers, or guided selection; review technical facts; build a browser-local BOM; export their work; and open supplier-site searches for independent verification.

Primary current users are mechanical and prototype engineers and small-company hardware builders doing fastener research and local BOM preparation. Procurement buyers are a validation audience for supplier handoffs and future quote workflows. Company teams, enterprise procurement organizations, and transactional buyers are later-phase users, not current product personas with implemented workflows.

PartSource is not currently a supplier catalog, marketplace, price-comparison engine, approved-vendor system, order system, or procurement system of record.

## Current runtime architecture

- Vite + React SPA: Vite 6, React 19, and TypeScript 5.8.
- Tailwind CSS 4 through `@tailwindcss/vite`, with Radix UI/shadcn components and the existing high-density light-mode styling.
- BrowserRouter with the production base path `/partsource/`.
- Canonical production host: GitHub Pages at https://jrambackup1-lgtm.github.io/partsource/.
- Build-time static metadata for catalog part routes; React provides the interactive runtime.
- Static client deployment: no application backend, server database, customer authentication, checkout, order service, or public admin.
- Browser-local BOM persistence through `localStorage`; CSV import/export and PDF export run client-side.
- The retained legacy ingestion tools are fail-closed, non-production historical experiments.

`partsource.io` is a future custom domain. Until the R5 launch gate changes the deployment contract, GitHub Pages and the `/partsource/` base path remain authoritative.

## Current production capabilities

- Search the bundled standards-derived fastener catalog from generic text such as `M4 screws`.
- Use known catalog identifiers, including McMaster numbers, as search clues when allowed by the local catalog.
- Support guided configuration selection by family, type, size, material, finish, head, drive, and standard.
- Show clearly bounded decoded or candidate configurations without claiming a stocked product, equivalent, approved alternate, replacement, or same item.
- Open part-detail routes, a technical reference library, and an embeddable read-only part view.
- Generate specification-led search handoffs to supplier sites. The destination results require independent verification.
- Add configuration snapshots to a browser-local BOM, edit quantities, delete items, and preserve user-entered or imported costs.
- Import CSV BOM data and export CSV or PDF summaries.
- Keep generated part routes `noindex,follow` and outside the sitemap; only approved root/reference content may be indexable.

Current limitations are part of the product contract: metric catalog coverage is incomplete; imperial decoding/reference support is partial; pins are unsupported; and technical facts do not imply manufacture, stock, listing, equivalence, approval, or availability. The local prototype may additionally load validated hex-head and rounded-head configuration records; they are non-published prototype data, excluded from generated routes, and do not expand production catalog or commercial claims.

## Product Truth Contract

| Term | Meaning |
|---|---|
| Configuration | Standards-defined combination of dimensions and attributes; not necessarily manufactured or stocked. |
| Manufacturer part | Real product with a manufacturer and manufacturer part number. |
| Supplier listing | Supplier-specific listing or SKU for a manufacturer part. |
| Offer | Observed price or availability with currency, unit basis, pack, source, timestamp, and expiry. |
| Candidate match | Possibly relevant result requiring verification. |
| Cross-reference | Relationship explicitly supported by evidence. |
| Exact equivalent | Fit, form, function, material, grade, standard, and required certifications match. |
| Approved alternate | A particular organization approved the item for a defined use. |

Non-negotiable boundaries:

- Never describe a configuration as stocked.
- Never describe a search URL as an offer.
- Never describe a candidate as an equivalent.
- Never describe an equivalent as approved without organizational approval.
- Never display live price, inventory, certification, or lead time without a sanctioned source and timestamp.
- Never silently substitute thread pitch, measurement system, standard, material, or strength class.
- User-entered or imported costs remain user data. They are not PartSource prices, offers, savings, or supplier evidence.

## Sourcing research result-state contract

PartSource search is a sourcing research workflow, not a McMaster API and not an equivalence lookup. A McMaster number, generic text such as `M4 screws`, or guided selection may produce configuration results and supplier search destinations only.

| State | Meaning | Required display/behavior |
|---|---|---|
| `configuration-match` | The input maps to one or more known hardware configurations in the local approved catalog. | Display configuration facts and source/provenance notes. Do not claim a supplier listing, equivalent, approved alternate, replacement, same item, stock, price, availability, buy flow, or quote flow. |
| `configuration-search` | The app can search or filter configurations from generic text such as `M4 screws` or guided selection. | Show candidate configurations and filters. Label them as configurations or candidates only. |
| `supplier-search-destination` | The app can generate a supplier-site search URL from configuration facts. | Label as `Search this configuration on <supplier>`. The user must verify the supplier results on the supplier site. |
| `unsupported-input` | The input cannot be matched to a useful supported configuration. | Say that PartSource does not support this input yet. Do not guess an equivalent or replacement. |
| `invalid-input` | The input is malformed or too vague to search safely. | Ask for clearer part text or guided selection. |
| `search-unavailable` | The local catalog, search index, or URL template needed for safe search is unavailable. | Fail closed. Do not fall back to guessed supplier claims or stale data. |

McMaster identifiers are input clues only. The POC does not use a McMaster API. The POC must not scrape McMaster or any supplier site.

Supplier destinations are search handoffs only. They are not supplier listings, offers, equivalents, approved alternates, replacements, or availability claims.

## Sourcing and data boundary

| Data class | Current permitted source and treatment |
|---|---|
| Standards-defined configuration | Public technical standards or permitted technical references; label as a configuration and retain reviewed provenance. |
| Manufacturer part | Only claim when manufacturer identity and part number are supported by explicit evidence. |
| Supplier listing | Not provided by the current MVP. Requires an approved source record, identity resolution, permission, and freshness controls. |
| Offer | Not provided by the current MVP. Requires an approved listing identity plus observed commercial fields, source, timestamp, and expiry. |
| Candidate match | A supplier-site URL is only a search handoff; a result may become a candidate match only after inspection and still requires verification. |
| Cross-reference | Future-only unless explicit evidence, source permission, and relationship type exist; never bulk-generated from dimensional similarity. |
| Exact equivalent | Out of scope for the POC. Requires the complete Product Truth definition, source permission, legal review, and independent technical review. |
| Approved alternate | Requires a named organization's approval for a defined use and future authorization/audit controls outside the current plan. |

Prohibited current sources and claims:

- No McMaster API dependency for the POC.
- No McMaster-Carr scraping, login-wall circumvention, gray-area third-party scraping, or unsanctioned distributor bulk ingestion.
- No production use of the retained Zoro ingestion experiment.
- No live or synthetic supplier pricing, inventory, availability, lead time, confirmed listing, match status, equivalent claim, replacement claim, or approved-alternate claim.
- A sanctioned official API or partner feed may be evaluated only after its source record is approved.

## Resolved-decision register

| Decision | Current resolution | Owner |
|---|---|---|
| **Scraping** | Unapproved public scraping and gray-area third-party scraping are rejected. Legacy tools remain isolated and fail-closed. Future supplier data must come from written, sanctioned access. | `research/data-source-register.md`; R1-R2. |
| **Commercial pricing and offers** | PartSource supplies no current price, inventory, availability, or offer. BOM totals use only user-entered/imported costs. | Deferred outside the current plan until a sanctioned, fresh commercial feed exists. |
| **Pins** | Pins are not in the supported catalog scope despite the early grill aspiration. | Rejected from the current socket-head-cap-screw scope. |
| **Imperial coverage** | Partial reference/decoder assistance may produce candidates, but complete imperial catalog/search coverage is unsupported. | Preserved research capability; not a verified-equivalence promise. |
| **Currency** | USD is the sole supported cost basis. Any legacy client-side EUR/GBP/CAD formatting is an unsourced prototype display, not commercial data or a conversion promise. | Current US/USD boundary. |
| **Accounts and authentication** | No registration, login, identity, cloud sync, or customer account exists. Anonymous local use remains the default. | Explicitly out of scope; R4 owns named local BOMs. |
| **Company and team features** | No organizations, roles, shared BOMs, approvals, comments, audit history, or cross-device collaboration exists. | Deferred outside the current plan. |
| **Enterprise features** | SSO/SAML, SCIM, punchout/cXML, ERP/PO fields, contractual security, retention, restricted-supplier, and compliance policies are not promised. | Deferred and demand-gated. |
| **Quote validation** | The current mailto/clipboard action is a sourcing-help lead only; it has no dependable submission, acknowledgement, SLA, ownership, frozen snapshot, or status. | Managed lead capture is deferred outside the current plan. |
| **Brokerage and commerce** | No checkout, consolidated ordering, supplier routing, payment, invoicing, tax, fulfilment, tracking, returns, or brokerage transaction exists. | Rejected from the current plan. |
| **pSEO indexing** | Generated part routes remain `noindex,follow` and excluded from the sitemap. No bulk page-per-SKU indexing is approved. | Remains contained; bulk SEO is deferred. |
| **Styling and runtime stack** | The shipped stack is Vite + React SPA, TypeScript, Tailwind CSS 4, Radix UI/shadcn, and GitHub Pages—not Next.js, Vanilla CSS, a server-rendered app, or an AI Studio runtime. | Preserve the current stack; change UI only where the core workflow requires it. |

## Production ownership register

| Restart stage | Owned promises |
|---|---|
| R0 | Recoverable repository reset, reviewed-code reconciliation, and clean verification baseline. |
| R1 | Source audit, commercial reuse permission, permitted fields, attribution, refresh, and takedown controls. |
| R2 | Canonical configuration catalog, reviewed source/provenance notes, disabled-by-default adapters, and a small pilot configuration packet. |
| R3 | Search by known identifier, generic text, and guided selection; supplier search handoffs only; no equivalent or replacement claims. |
| R4 | Multiple named local BOMs, stable configuration snapshots, safe migration, CSV import/export, and JSON backup/restore. |
| R5 | Legal launch pack, privacy-safe analytics, custom domain, monitoring, rollback, complete verification, independent audit, and controlled US pilot. |

Accounts, company collaboration, enterprise controls, live commercial feeds and prices, bulk SEO, quote operations, brokerage, and commerce have no owner in the current plan and remain deferred.

Historical prototype promises without a current production-plan owner—CAD/STEP downloads, torque calculators as product tools, material-substitution tools, embedded commerce widgets, admin portals, localization, and automatic split-order optimization—are rejected unless a later approved contract revision assigns them.

## Change rule

Change this contract only through a reviewed production-readiness packet. A future idea, prototype artifact, archived prompt, or implemented leftover does not become a supported capability until this contract and its execution ownership are deliberately updated.

