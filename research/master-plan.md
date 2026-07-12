# PartSource End-to-End Master Plan

**Status:** Approved execution roadmap
**Execution tracker:** `research/master-plan-checklist.md`
**Session prompt:** `research/phase-execution-prompt.md`

## Outcome

Build PartSource into a trustworthy, standards-first mechanical hardware discovery and sourcing platform that:

1. Resolves exact identifiers reliably.
2. Turns broad queries into product families and engineering filters.
3. Separates configurations, real products, supplier listings, offers, equivalents, and company approvals.
4. Supports useful anonymous personal BOM work.
5. Adds company collaboration only with a secure backend.
6. Adds live supplier data and commerce only through sanctioned partnerships.
7. Scales SEO only after quality and business validation.

Work proceeds one phase at a time. No phase starts until the prior exit gate passes.

## Current Readiness

Technical checks pass, but the product is not production-ready:

- 24 tests, TypeScript, and the production build pass.
- UX audit score: **8/20 — Poor**.
- Deployed direct part routes can return 404.
- Mobile is structurally unusable because of the fixed sidebar.
- Search has no proper category, family, results, or facet architecture.
- Broad searches can suggest arbitrary configurations.
- Explicit pitch and units can be silently changed or lost.
- Standards-derived configurations are presented like real products.
- Supplier search links appear like confirmed offers or equivalents.
- Synthetic prices can enter structured data as `AggregateOffer`.
- Approval, equivalence, live-data, and savings claims lack evidence.
- Data lacks field-level sources, revisions, reviewers, licences, and freshness.
- BOM imports can invent supplier, material, price, or quantity assumptions.
- Personal/local and company/team capabilities are visually mixed.
- Quote submission is not dependable or operationally traceable.
- Privacy, terms, liability, affiliate, retention, and operator policies are absent.
- Analytics, error monitoring, performance budgets, accessibility coverage, and cross-browser QA are incomplete.
- SEO policy says indexing is gated, but hundreds of part URLs are published.
- Deployment protection exists mostly as untracked local work.
- Brokerage, pricing, supplier relationships, unit economics, and primary customer demand remain unvalidated.

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

Non-negotiable rules:

- Never describe a configuration as stocked.
- Never describe a search URL as an offer.
- Never describe a candidate as an equivalent.
- Never describe an equivalent as approved without organizational approval.
- Never display live price, inventory, certification, or lead time without a sanctioned source and timestamp.
- Never silently substitute thread pitch, measurement system, standard, material, or strength class.

## Phase 0 — Contain Current Production Risk

**Objective:** Make the existing MVP truthful, reachable, reversible, and safe before redesign work.

Work packets:

- **MP-0.1 Release truth:** Reconcile tracked, untracked, local, and deployed state.
- **MP-0.2 Routing:** Make direct routes, refreshes, unknown routes, and canonical URLs work.
- **MP-0.3 SEO containment:** Noindex generated part pages and remove them from the sitemap until later gates pass.
- **MP-0.4 Structured-data containment:** Remove synthetic prices and `AggregateOffer`.
- **MP-0.5 Claim audit:** Remove unsupported approval, equivalence, live, stock, savings, profile, notification, login, and compliance language.
- **MP-0.6 CI/deployment:** Require type-check, tests, build, browser tests, immutable artifact, production smoke, and rollback instructions.
- **MP-0.7 Legacy ingestion:** Disable or isolate scrapers and resolvers that conflict with current sourcing policy.

Exit gate:

- Production and source match.
- Deep links return the intended page.
- No synthetic commercial claim reaches users or crawlers.
- Sitemap exposes only approved routes.
- Deployment cannot bypass required checks.
- Rollback has been rehearsed.

## Phase 1 — Lock Product, Users, and Business Boundaries

**Objective:** Replace contradictory documents with one authoritative product contract.

Work packets:

- **MP-1.1 Product source of truth:** Reconcile PRD, decisions, sourcing policy, business plan, SEO audit, and shipping checklist.
- **MP-1.2 MVP boundary:** Standard fasteners, discovery, reference, local BOM, exports, supplier handoffs, and controlled quote validation.
- **MP-1.3 Capability tiers:** Personal/local, company/team, enterprise, and brokerage/commerce.
- **MP-1.4 Monetization validation:** Affiliate, quote lead, SaaS, and brokerage assumptions with bottom-up SOM, CAC, LTV, gross margin, and kill thresholds.
- **MP-1.5 Legal boundary:** Operator entity, privacy, liability, sourcing disclaimers, affiliate disclosure, retention, and acceptable supplier data use.
- **MP-1.6 Primary research:** Recruit engineers, procurement buyers, technicians, and small-company buyers.
- **MP-1.7 Competitive matrix:** Compare McMaster, Grainger, Fastenal, MISUMI, RS, Bolt Depot, and Amazon Business by user task.

Required user testing: at least 12 moderated sessions—three engineers, three procurement users, two maintenance users, two small-company buyers, one student/hobbyist, and one enterprise procurement user.

Exit gate:

- One authoritative product contract exists.
- Every promised capability is assigned to a phase.
- No unresolved contradiction remains about scraping, pricing, pins, imperial coverage, currency, accounts, or commerce.
- At least 80% of participants correctly explain what PartSource does and does not verify.
- The core problem and monetization thesis survive user evidence.

## Phase 2 — Build the Mechanical Domain Foundation

**Objective:** Separate engineering truth from catalog, supplier, and commercial truth.

Canonical model:

- `Taxon`, `ProductFamily`, `Standard`, `StandardCrosswalk`
- `ThreadSpec`, `Configuration`, `ManufacturerPart`
- `SupplierListing`, `Offer`, `CrossReferenceAssertion`
- `CatalogAlias`, `BOMRequirement`, `BOMCandidate`, `ProvenanceRecord`

Work packets:

- **MP-2.1 Taxonomy:** Category → family → subtype → applicable facets.
- **MP-2.2 Standards registry:** Issuer, number, part, edition, status, and source.
- **MP-2.3 Units:** Exact metric/imperial representation, fractions, pitch/TPI, conversion, and display.
- **MP-2.4 Material semantics:** Separate material, specification, strength/property class, finish, and treatment.
- **MP-2.5 Provenance:** Source, permission, evidence, retrieval date, reviewer, confidence, and field coverage.
- **MP-2.6 Cross-reference policy:** Exact, conditional, superseded, related, and rejected.
- **MP-2.7 Catalog migration:** Relabel generated entries as theoretical configurations.
- **MP-2.8 Reference verification:** Named standard editions, citations, and mechanical SME review.
- **MP-2.9 Publishing lifecycle:** Draft, reviewed, approved, published, stale, withdrawn.

Initial complete scope: socket-head, button-head, flat/countersunk, hex-head, nuts, and washers. Pins, bearings, rivets, and other hardware remain unsupported until their taxonomy and evidence exist.

Exit gate:

- Every published technical field has a unit, provenance, edition/revision, and validation status.
- No generated configuration masquerades as a supplier SKU.
- DIN/ISO differences are explicit.
- Two-person review is required for cross-references.
- Integrity tests reject missing provenance and impossible combinations.

## Phase 3 — Rebuild the UI Foundation

**Objective:** Create a responsive, accessible catalog application instead of a fake signed-in dashboard.

Target routes:

- `/` — scope, dominant search, category entry, local BOM continuation.
- `/catalog` — categories.
- `/catalog/:family` — family explanation and valid facets.
- `/search?q=` — interpretation, results, filters, and comparison.
- `/parts/:id` — evidence-backed detail.
- `/bom` — personal workspace.
- `/reference` and `/reference/:slug`.
- `/quote` only after dependable submission exists.

Work packets:

- **MP-3.1 Public shell:** Logo, search, Catalog, Reference, BOM count.
- **MP-3.2 Remove theatre:** No fake avatar, logout, unread notification, “Index Active,” or mock shortcut.
- **MP-3.3 Responsive navigation:** Compact mobile navigation, collapsible tablet rail, compact desktop navigation.
- **MP-3.4 Design tokens:** Semantic colors, spacing, typography, states, and elevation.
- **MP-3.5 Component states:** Default, hover, focus, active, disabled, loading, success, warning, error, empty.
- **MP-3.6 Accessibility foundation:** Landmarks, skip link, focus, labels, live regions, tables, forced colors, reduced motion.
- **MP-3.7 State catalogue:** Loading, empty, ambiguous, partial, offline, failure, permission, and stale-data states.
- **MP-3.8 Visual regression baseline:** Desktop, tablet, and mobile references.

Exit gate:

- WCAG 2.2 AA foundation.
- No horizontal page overflow at 320px.
- 200% text and 400% zoom preserve task completion.
- Touch targets are at least 44×44px.
- One page scroll owner.
- Specifications remain selectable and copyable.

## Phase 4 — Search and Catalog Discovery

**Objective:** Make search safe, explainable, and engineering-aware.

Pipeline: `normalize → classify intent → parse constraints → retrieve → hard-filter → rank → explain`.

Intent classes: exact PartSource ID; manufacturer/supplier ID; standard plus dimensions; structured specification; broad family/category; natural language; typo/synonym; unsupported/unknown.

Work packets:

- **MP-4.1 Query normalization:** Whitespace, punctuation, plurals, aliases, Unicode multiplication, fractions, units, standards.
- **MP-4.2 Identifier namespaces:** Never fuzzy-match identifier-like input.
- **MP-4.3 Metric parser:** Diameter, pitch, length, standard, family, material, finish.
- **MP-4.4 Imperial parser:** Numbered threads, UNC/UNF, TPI, fractions, inches.
- **MP-4.5 Constraint safety:** Explicit pitch, unit, grade, and standard are hard constraints.
- **MP-4.6 Broad discovery:** `M4 screw` returns family choices with M4 preselected.
- **MP-4.7 Results page:** Exact, verified, complete specification, partial, unsupported groups.
- **MP-4.8 Facets:** System, family, thread, pitch, length, material, finish, strength, standard.
- **MP-4.9 Autocomplete:** Accessible grouped combobox with a relevance threshold.
- **MP-4.10 Ranking explanation:** Why matched, confidence, missing constraints, evidence tier.
- **MP-4.11 Query URLs:** Interpretation and filters survive refresh, sharing, and history.
- **MP-4.12 Golden corpus:** At least 200 positive, ambiguous, negative, typo, unit, standard, and identifier queries.

Acceptance targets:

- 100% exact-identifier correctness.
- Zero silent metric/imperial or fine/coarse substitutions.
- Zero arbitrary redirects from broad queries.
- At least 95% correct top-five result on the approved golden corpus.
- Unsupported categories remain explicitly unsupported.
- Search p95 below 100ms for the approved client catalog target.

Exit gate: a user can move from `M4 screw` to a valid family and specification without an invented product.

## Phase 5 — Trusted Detail, Equivalence, and Reference

**Objective:** Show evidence and uncertainty clearly.

Work packets:

- **MP-5.1 Detail hierarchy:** Identity, family, standard, dimensions, material, grade, finish, provenance.
- **MP-5.2 Diagram policy:** Accurate family-specific diagrams or none; no false “1:1.”
- **MP-5.3 Equivalence states:** Candidate, externally cross-referenced, verified equivalent, approved alternate.
- **MP-5.4 Supplier handoff:** Label search links as searches unless a listing is known.
- **MP-5.5 Offer display:** Source, timestamp, currency, UOM, pack, MOQ, and expiry required.
- **MP-5.6 Related items:** Explain compatibility and differences.
- **MP-5.7 Reference library:** Task-grouped search, standards editions, citations, print view, catalog links.
- **MP-5.8 SEO schema:** Engineering facts only; offers only when observed and valid.

Exit gate: a procurement user can explain what is verified, inferred, unknown, related, and commercially observed.

## Phase 6 — Personal and Local BOM Workflow

**Objective:** Deliver a complete workflow without requiring an account.

Work packets:

- **MP-6.1 Named local BOMs:** Project name, revision, notes, target date, destination, save status.
- **MP-6.2 Requirement model:** Requested engineering item remains separate from supplier selection.
- **MP-6.3 Import preview:** Mapping, validation, duplicates, unresolved rows, partial success.
- **MP-6.4 No fabrication:** Never invent supplier, material, price, or quantity.
- **MP-6.5 Editing:** Bulk selection, quantities, sorting, filters, alternates, Undo.
- **MP-6.6 Storage health:** Quota, corruption, migration, recovery, backup, device-only disclosure.
- **MP-6.7 Exports:** CSV and accessible PDF with revision, source, caveats, and currency basis.
- **MP-6.8 Mobile BOM:** Stacked editable rows and sticky primary action.
- **MP-6.9 Offline state:** Clear supported behavior and limitations.

Exit gate:

- Import/export round-trip preserves original data.
- Unresolved rows never enter pricing totals.
- Storage failure cannot silently erase a BOM.
- Personal use needs no fake identity or signup.
- Exact search → detail → add → BOM → export passes mobile, keyboard, and screen-reader testing.

## Phase 7 — Branded Launch, Quote Validation, and Operations

**Objective:** Launch the trustworthy personal product and validate demand.

Work packets:

- **MP-7.1 Custom domain and controllable security headers.**
- **MP-7.2 Legal launch pack:** Privacy, terms, liability, affiliation, affiliate disclosure, retention.
- **MP-7.3 Privacy-friendly analytics:** Collect event metadata, never BOM contents.
- **MP-7.4 Funnel:** Search → result → detail → supplier/BOM → export → quote intent.
- **MP-7.5 Monitoring:** Uptime, content assertions, Web Vitals, frontend errors, domain/TLS expiry, link health.
- **MP-7.6 Quote validation:** Frozen BOM snapshot, consent, ownership, acknowledgement, SLA, status, deletion.
- **MP-7.7 Support operations:** Owner, response standard, correction workflow, incident workflow.
- **MP-7.8 Controlled launch cohort.**

Backend trigger—remain static until one occurs:

- Five qualified quote attempts in one month.
- Evidence of lost submissions or mailto/URL-size failure.
- Need for attachments or multiple staff handlers.
- Three target companies request shared/cross-device workflows.

Exit gate:

- No lost quote can be mistaken for success.
- Funnel and reliability are measurable.
- Named owners exist for alerts, support, corrections, and quotes.
- Zero P0/P1 launch issues.

## Phase 8 — Company Workspace and Backend

**Objective:** Support company use without compromising tenant isolation or auditability.

Architecture: modular API, managed Postgres, encrypted object storage, transactional email, and queue/outbox. Staff authentication first; customer accounts only when required.

Minimum company capabilities: organizations, roles, shared/versioned BOMs, immutable submissions, comments, approvals, supplier policies, audit history, attachments, conflicts, retention, deletion.

Work packets:

- **MP-8.1 Backend ADR and threat model.**
- **MP-8.2 Tenant and identity model.**
- **MP-8.3 RBAC and authorization tests.**
- **MP-8.4 Versioned BOM storage.**
- **MP-8.5 Approval state machine.**
- **MP-8.6 Quote intake and outbox.**
- **MP-8.7 Audit logging.**
- **MP-8.8 Encryption, backups, restore, rate limits, and abuse controls.**
- **MP-8.9 Protected staff administration.**
- **MP-8.10 Anonymous-to-account migration.**

Enterprise extensions remain gated: SSO/SAML, SCIM, punchout/cXML, ERP/PO fields, contractual security, customer retention, restricted supplier and compliance policies.

Exit gate: two-user edit, approval, conflict, permission, audit, deletion, backup, restore, and cross-tenant simulations pass with zero authorization failures.

## Phase 9 — Sanctioned Supplier Data

**Objective:** Move from supplier search assistance to real commercial comparison.

Entry requirements: written permission or agreement, legal approval, rate limits, attribution, freshness, and redistribution rules.

Work packets:

- **MP-9.1 Supplier partnership matrix.**
- **MP-9.2 Adapter contract.**
- **MP-9.3 Listing identity resolution.**
- **MP-9.4 Price/UOM/pack/MOQ normalization.**
- **MP-9.5 Availability and freshness.**
- **MP-9.6 Retry, circuit breaker, caching, queue, and dead-letter handling.**
- **MP-9.7 Equivalence review workflow.**
- **MP-9.8 Expiry and stale-data demotion.**

Exit gate: every displayed listing and offer is traceable, permitted, timestamped, and refreshable. No public scraper or unsanctioned bulk ingestion.

## Phase 10 — Controlled SEO and Growth

**Objective:** Earn search visibility without creating thin or misleading pages.

Entry requirements: custom domain, keyword/SERP validation, backlink threshold, publishing manifest, noindex kill switch, provenance, Search Console, and Bing Webmaster Tools.

Work packets:

- **MP-10.1 Keyword-to-page-type map.**
- **MP-10.2 Publishing/indexability manifest.**
- **MP-10.3 Category and family pages first.**
- **MP-10.4 Manually reviewed configuration-page pilot.**
- **MP-10.5 Canonical, robots, schema, sitemap, and alias policy.**
- **MP-10.6 Content-quality score and review workflow.**
- **MP-10.7 Small indexed cohort and measurement period.**
- **MP-10.8 Rollback and deindex procedure.**
- **MP-10.9 Community, content, partnership, and backlink playbook.**

Exit gate: pilot pages show useful engagement, no misleading rich results, no index leakage, and no thin-content pattern. Never put hundreds of thousands of records in the SPA bundle.

## Phase 11 — Brokerage and Commerce

**Objective:** Add transactions only after commercial and operational proof.

Entry requirements: repeat qualified customers, proven economics, signed suppliers, legal entity, banking, tax process, insurance, terms, returns/quality process, traceability, staff capacity, and support SLA.

Capabilities: vendor quotes, accepted quotes, PO/order, server-owned totals, payment/invoicing, tax, fulfilment, tracking, cancellation, returns, reconciliation, immutable financial snapshots, restricted-party review, and certificate traceability.

Exit gate: quote → acceptance → PO → fulfilment → reconciliation → return simulation passes with immutable totals, audit history, and named operational ownership.

## Phase 12 — Production Hardening and Final Audit

Verification layers:

1. **Implementer evidence:** Tests, before/after evidence, screenshots, accessibility, performance, docs, and limitations.
2. **Independent agent review:** Requirement coverage, truth, regression risk, tests, evidence, and scope.
3. **Phase acceptance:** Run the complete phase gate against deployment, not just localhost.
4. **GPT-5.6 Sol audit:** Clean-context verification of plan coverage, claims, data, UX, accessibility, backend, security, company workflows, SEO, business, operations, and P0–P3 findings. The verifier does not edit code.
5. **Final production audit:** Repeat every route, control, persona, viewport, query class, state, data sample, external link, SEO check, security check, monitoring check, backup, rollback, and incident workflow.

Final release gate:

- Zero P0 and P1 findings.
- Accepted P2 register with owners.
- WCAG 2.2 AA.
- Core Web Vitals green.
- Exact-search accuracy 100%.
- No hard-constraint search violations.
- No unsupported commercial or equivalence claims.
- Production rollback proven.
- GPT-5.6 Sol recommends launch or explicitly bounded limited launch.
- Human product-owner sign-off.

## Agent Execution Protocol

Each checklist item records ID, objective, dependencies, exact scope, allowed files/systems, exclusions, deliverables, acceptance criteria, commands, evidence, implementer, reviewer, status, risks, and follow-ups.

State machine:

`blocked → ready → in_progress → self_verified → independent_review → complete → deployed → production_verified`

Rules:

- Only one phase is active.
- Dependent work packets cannot start early.
- Parallel agents may work only on independent packets.
- Implementers cannot approve their own work.
- Failed verification returns the item to `in_progress`.
- A checked box requires evidence, not an agent claim.
- No phase closes with unresolved P0/P1 findings.
- Documents, tests, runtime behavior, and production must agree.
