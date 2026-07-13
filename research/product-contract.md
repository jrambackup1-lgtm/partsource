# PartSource Authoritative Product Contract

**Status:** Authoritative — sole current source of truth

**Effective:** 2026-07-13

**Roadmap owner:** `research/master-plan.md`

**Execution evidence:** `research/master-plan-checklist.md`

When current product or research documents conflict, this contract wins. Earlier PRDs, grill decisions, business plans, audits, checklists, prototype prompts, and implementation notes remain useful inputs and history; they do not override this contract.

## Authority and precedence

1. This contract controls current product purpose, users, terminology, capability claims, boundaries, and resolved decisions.
2. `research/master-plan.md` controls phase sequence, entry requirements, work-packet ownership, and exit gates.
3. `research/release-truth.md` controls candidate, release, and production-verified identity.
4. `research/master-plan-checklist.md` controls execution status and recorded evidence.
5. The shipped runtime and its tests prove what is implemented. A mismatch with this contract is a defect to reconcile, not permission to expand a claim.
6. `research/prd.md`, `research/grill-decisions.md`, `research/data-sourcing-decision.md`, `research/business-plan.md`, `research/pseo-risk-audit.md`, `research/aistudio_checklist.md`, and other research documents are subordinate decision inputs or historical snapshots.
7. Files under `research/archive/` and `archive/` are historical only.

No historical file is deleted or rewritten merely because this contract supersedes one of its claims.

## Product purpose and primary users

PartSource is a standards-first mechanical hardware discovery and sourcing-assistance tool. It helps people inspect candidate fastener configurations, resolve known catalog identifiers, review technical reference material, build a browser-local BOM, export their work, and open supplier-site searches for independent verification.

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

`partsource.io` is a future custom domain. Until Phase 7 changes the deployment contract, GitHub Pages and the `/partsource/` base path remain authoritative.

## Current production capabilities

- Search the bundled standards-derived fastener catalog and resolve exact catalog identifiers.
- Show a clearly bounded decoded or candidate configuration for unknown input without claiming a stocked product.
- Open part-detail routes, a technical reference library, and an embeddable read-only part view.
- Generate specification-led search handoffs to supplier sites. The destination results require independent verification.
- Add items to a browser-local BOM, edit quantities, delete items, and preserve user-entered or imported costs.
- Import CSV BOM data and export CSV or PDF summaries.
- Open a prefilled email and copy BOM text for a sourcing-help lead. This is not dependable quote submission, acknowledgement, order creation, or quote status.
- Keep generated part routes `noindex,follow` and outside the sitemap; only approved root/reference content may be indexable.

Current limitations are part of the product contract: metric catalog coverage is incomplete; imperial decoding/reference support is partial; pins are unsupported; and technical facts do not imply manufacture, stock, listing, equivalence, approval, or availability.

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

## Sourcing and data boundary

| Data class | Current permitted source and treatment |
|---|---|
| Standards-defined configuration | Public technical standards or permitted technical references; label as a configuration and retain provenance requirements for Phase 2. |
| Manufacturer part | Only claim when manufacturer identity and part number are supported by explicit evidence. |
| Supplier listing | Not provided by the current MVP. Requires a sanctioned source, identity resolution, permission, and freshness controls in Phase 9. |
| Offer | Not provided by the current MVP. Requires listing identity plus observed commercial fields, source, timestamp, and expiry in Phases 5 and 9. |
| Candidate match | A supplier-site URL is only a search handoff; a result may become a candidate match only after inspection and still requires verification. |
| Cross-reference | May be shown only with explicit evidence and relationship type; never bulk-generated from dimensional similarity. |
| Exact equivalent | Requires the complete Product Truth definition and the Phase 5 review policy. No current blanket equivalence claim exists. |
| Approved alternate | Requires a named organization's approval for a defined use and Phase 8 authorization/audit controls. |

Prohibited current sources and claims:

- No McMaster-Carr scraping, login-wall circumvention, gray-area third-party scraping, or unsanctioned distributor bulk ingestion.
- No production use of the retained Zoro ingestion experiment.
- No live or synthetic supplier pricing, inventory, availability, lead time, confirmed listing, or match status.
- A sanctioned official API or partner feed may be evaluated only under the Phase 9 entry requirements.

## Resolved-decision register

| Decision | Current resolution | Owner |
|---|---|---|
| **Scraping** | Unapproved public scraping and gray-area third-party scraping are rejected. Legacy tools remain isolated and fail-closed. Future supplier data must come from written, sanctioned access. | Rejected now; sanctioned adapters only in Phase 9 (MP-9.1–MP-9.8). |
| **Commercial pricing and offers** | PartSource supplies no current price, inventory, availability, or offer. BOM totals use only user-entered/imported costs. | Current boundary; evidence-backed display in Phase 5 (MP-5.5) and sanctioned data in Phase 9. |
| **Pins** | Pins are not in the supported catalog scope despite the early grill aspiration. | Rejected from current scope; reconsider after Phase 2 taxonomy and evidence gates (MP-2.1, MP-2.8). |
| **Imperial coverage** | Partial reference/decoder assistance may produce candidates, but complete imperial catalog/search coverage is unsupported. | Current limitation; exact representation in Phase 2 (MP-2.3) and parsing in Phase 4 (MP-4.4). |
| **Currency** | USD is the sole supported cost basis. Any legacy client-side EUR/GBP/CAD formatting is an unsourced prototype display, not commercial data or a conversion promise. | Current USD boundary; explicit export basis in Phase 6 (MP-6.7), offer normalization in Phase 9 (MP-9.4). |
| **Accounts and authentication** | No registration, login, identity, cloud sync, or customer account exists. Anonymous local use remains the default. | Current anonymous MVP; staff/customer identity only in Phase 8 (MP-8.1–MP-8.3, MP-8.10). |
| **Company and team features** | No organizations, roles, shared BOMs, approvals, comments, audit history, or cross-device collaboration exist. | Current exclusion; Phase 8 after a backend trigger. |
| **Enterprise features** | SSO/SAML, SCIM, punchout/cXML, ERP/PO fields, contractual security, retention, restricted-supplier, and compliance policies are not promised. | Rejected from current scope; individually demand-gated after the Phase 8 foundation. |
| **Quote validation** | The current mailto/clipboard action is a sourcing-help lead only; it has no dependable submission, acknowledgement, SLA, ownership, frozen snapshot, or status. | Current lead only; controlled validation in Phase 7 (MP-7.6). |
| **Brokerage and commerce** | No checkout, consolidated ordering, supplier routing, payment, invoicing, tax, fulfilment, tracking, returns, or brokerage transaction exists. | Rejected now; Phase 11 only after all commercial entry requirements pass. |
| **pSEO indexing** | Generated part routes remain `noindex,follow` and excluded from the sitemap. No bulk page-per-SKU indexing is approved. | Current containment; controlled cohorts only in Phase 10 (MP-10.1–MP-10.9). |
| **Styling and runtime stack** | The shipped stack is Vite + React SPA, TypeScript, Tailwind CSS 4, Radix UI/shadcn, and GitHub Pages—not Next.js, Vanilla CSS, a server-rendered app, or an AI Studio runtime. | Current runtime; UI-system changes belong to Phase 3. |

## Phase ownership register

Every capability promised by the reconciled inputs is either assigned below or rejected in the decision register.

| Master-plan phase | Owned promises |
|---|---|
| Phase 0 | Release identity, routing, SEO/structured-data containment, unsupported-claim removal, CI/deploy/rollback, and legacy-ingestion isolation. Complete; its original readiness findings are historical. |
| Phase 1 | Current MVP boundary, capability tiers, monetization evidence and kill thresholds, legal boundary, primary user research, and competitive validation. |
| Phase 2 | Fastener taxonomy; standards and editions; metric/imperial units; material semantics; provenance; cross-reference policy; configuration relabeling; reference verification; publishing lifecycle; pins only after taxonomy/evidence approval. |
| Phase 3 | Public responsive shell, removal of prototype theatre, design tokens, complete component/state treatment, accessibility foundation, and visual regression baselines. |
| Phase 4 | Safe exact/broad search, identifier namespaces, metric and imperial parsing, hard constraints, results/facets/autocomplete, explanations, persistent queries, and golden corpus. |
| Phase 5 | Evidence-backed detail, accurate diagrams, candidate/cross-reference/equivalence states, truthful supplier handoffs, sourced offer display, compatibility, references, and engineering-only schema. |
| Phase 6 | Named local BOMs, requirement/selection separation, safe import, no fabrication, editing, storage health, CSV/PDF exports with currency basis, mobile use, and offline limits. SmartCart/split-BOM optimization is not owned here and remains blocked pending sanctioned data and commercial validation. |
| Phase 7 | Custom domain, legal launch pack, privacy-safe analytics, funnel/monitoring, dependable quote validation, support operations, and a controlled launch cohort. |
| Phase 8 | Secure backend, organizations, roles, shared/versioned BOMs, approvals, comments, policies, audit history, attachments, staff admin, and anonymous-to-account migration. Enterprise extensions remain separately demand-gated. |
| Phase 9 | Sanctioned supplier partnerships/adapters, listing identity, price/currency/UOM/pack/MOQ normalization, availability/freshness, reliability controls, equivalence review, and stale-data demotion. |
| Phase 10 | Keyword/page map, publishing manifest, category/family pages, reviewed configuration pilot, canonical/robots/schema/sitemap policy, quality workflow, small indexed cohort, deindex rollback, and growth playbook. Historical 10,000/100,000/600,000-page targets are not approvals. |
| Phase 11 | Vendor quotes, accepted quotes, PO/order, server-owned totals, payments/invoicing/tax, fulfilment/tracking, cancellation/returns/reconciliation, and compliance/traceability—only after the phase entry requirements pass. |
| Phase 12 | Production hardening, independent audits, complete production gates, accepted risk register, and human product-owner sign-off. |

Historical prototype promises without a current master-plan owner—CAD/STEP downloads, torque calculators as product tools, material-substitution tools, embedded commerce widgets, admin portals, localization, and automatic split-order optimization—are rejected from the current roadmap unless a later approved contract revision assigns them to a phase.

## Change rule

Change this contract only through a reviewed master-plan packet. A future idea, prototype artifact, archived prompt, or implemented leftover does not become a supported capability until this contract and its phase ownership are deliberately updated.
