# PartSource Master Plan Execution Tracker

This file is the cross-session source of truth. Agents must update it only after verification.

## Phase Status

| Phase | Status | Started | Completed | Evidence |
|---|---|---|---|---|
| 0 — Contain Current Production Risk | complete | 2026-07-11 | 2026-07-12 | commits through `ec4a003`; CI `29203431947`; deploy/smoke `29203432018`; clean rehearsal + independent review pass |
| 1 — Product, Users, Business Boundaries | ready | — | — | Phase 0 exit gate passed; entry dependencies satisfied |
| 2 — Mechanical Domain Foundation | blocked | — | — | — |
| 3 — UI Foundation | blocked | — | — | — |
| 4 — Search and Catalog Discovery | blocked | — | — | — |
| 5 — Detail, Equivalence, Reference | blocked | — | — | — |
| 6 — Personal and Local BOM | blocked | — | — | — |
| 7 — Branded Launch and Operations | blocked | — | — | — |
| 8 — Company Workspace and Backend | blocked | — | — | — |
| 9 — Sanctioned Supplier Data | blocked | — | — | — |
| 10 — Controlled SEO and Growth | blocked | — | — | — |
| 11 — Brokerage and Commerce | blocked | — | — | — |
| 12 — Production Hardening and Final Audit | blocked | — | — | — |

Valid phase statuses: `blocked`, `ready`, `in_progress`, `verification`, `complete`.

## Phase 0

- [x] MP-0.1 Release truth
- [x] MP-0.2 Routing and canonical URLs
- [x] MP-0.3 SEO containment
- [x] MP-0.4 Structured-data containment
- [x] MP-0.5 Unsupported-claim removal
- [x] MP-0.6 CI, deployment, smoke, rollback
- [x] MP-0.7 Legacy ingestion isolation
- [x] Phase 0 independent review
- [x] Phase 0 exit gate passed

## Phase 1

- [ ] MP-1.1 Authoritative product source
- [ ] MP-1.2 MVP boundary
- [ ] MP-1.3 Capability tiers
- [ ] MP-1.4 Monetization validation
- [ ] MP-1.5 Legal boundary
- [ ] MP-1.6 Primary user research
- [ ] MP-1.7 Competitive matrix
- [ ] Phase 1 independent review
- [ ] Phase 1 exit gate passed

## Phase 2

- [ ] MP-2.1 Taxonomy
- [ ] MP-2.2 Standards registry
- [ ] MP-2.3 Units
- [ ] MP-2.4 Material semantics
- [ ] MP-2.5 Provenance
- [ ] MP-2.6 Cross-reference policy
- [ ] MP-2.7 Catalog migration
- [ ] MP-2.8 Reference verification
- [ ] MP-2.9 Publishing lifecycle
- [ ] Phase 2 independent review
- [ ] Phase 2 exit gate passed

## Phase 3

- [ ] MP-3.1 Public shell
- [ ] MP-3.2 Remove fake product theatre
- [ ] MP-3.3 Responsive navigation
- [ ] MP-3.4 Design tokens
- [ ] MP-3.5 Component states
- [ ] MP-3.6 Accessibility foundation
- [ ] MP-3.7 State catalogue
- [ ] MP-3.8 Visual regression baseline
- [ ] Phase 3 independent review
- [ ] Phase 3 exit gate passed

## Phase 4

- [ ] MP-4.1 Query normalization
- [ ] MP-4.2 Identifier namespaces
- [ ] MP-4.3 Metric parser
- [ ] MP-4.4 Imperial parser
- [ ] MP-4.5 Hard-constraint safety
- [ ] MP-4.6 Broad discovery
- [ ] MP-4.7 Results page
- [ ] MP-4.8 Facets
- [ ] MP-4.9 Accessible autocomplete
- [ ] MP-4.10 Ranking explanations
- [ ] MP-4.11 Persistent query URLs
- [ ] MP-4.12 Golden corpus
- [ ] Phase 4 independent review
- [ ] Phase 4 exit gate passed

## Phase 5

- [ ] MP-5.1 Detail hierarchy
- [ ] MP-5.2 Diagram policy
- [ ] MP-5.3 Equivalence states
- [ ] MP-5.4 Supplier handoff truth
- [ ] MP-5.5 Offer provenance
- [ ] MP-5.6 Related-item compatibility
- [ ] MP-5.7 Reference library
- [ ] MP-5.8 Truthful SEO schema
- [ ] Phase 5 independent review
- [ ] Phase 5 exit gate passed

## Phase 6

- [ ] MP-6.1 Named local BOMs
- [ ] MP-6.2 Requirement versus selection
- [ ] MP-6.3 Import preview
- [ ] MP-6.4 No-fabrication rules
- [ ] MP-6.5 Editing and Undo
- [ ] MP-6.6 Storage health
- [ ] MP-6.7 Exports
- [ ] MP-6.8 Mobile BOM
- [ ] MP-6.9 Offline behavior
- [ ] Phase 6 independent review
- [ ] Phase 6 exit gate passed

## Phase 7

- [ ] MP-7.1 Custom domain and headers
- [ ] MP-7.2 Legal launch pack
- [ ] MP-7.3 Privacy-friendly analytics
- [ ] MP-7.4 Funnel instrumentation
- [ ] MP-7.5 Monitoring
- [ ] MP-7.6 Quote validation workflow
- [ ] MP-7.7 Support operations
- [ ] MP-7.8 Controlled launch cohort
- [ ] Phase 7 independent review
- [ ] Phase 7 exit gate passed

## Phase 8

- [ ] MP-8.1 Backend ADR and threat model
- [ ] MP-8.2 Tenant and identity model
- [ ] MP-8.3 RBAC
- [ ] MP-8.4 Versioned BOM storage
- [ ] MP-8.5 Approval state machine
- [ ] MP-8.6 Quote intake and outbox
- [ ] MP-8.7 Audit logging
- [ ] MP-8.8 Security, backup, restore, abuse controls
- [ ] MP-8.9 Staff administration
- [ ] MP-8.10 Anonymous-to-account migration
- [ ] Phase 8 independent review
- [ ] Phase 8 exit gate passed

## Phase 9

- [ ] MP-9.1 Supplier partnership matrix
- [ ] MP-9.2 Adapter contract
- [ ] MP-9.3 Listing identity
- [ ] MP-9.4 Commercial normalization
- [ ] MP-9.5 Availability and freshness
- [ ] MP-9.6 Reliability controls
- [ ] MP-9.7 Equivalence review
- [ ] MP-9.8 Stale-data demotion
- [ ] Phase 9 independent review
- [ ] Phase 9 exit gate passed

## Phase 10

- [ ] MP-10.1 Keyword/page map
- [ ] MP-10.2 Publishing manifest
- [ ] MP-10.3 Category/family pages
- [ ] MP-10.4 Configuration pilot
- [ ] MP-10.5 Canonical/robots/schema/sitemap
- [ ] MP-10.6 Content quality workflow
- [ ] MP-10.7 Indexed cohort
- [ ] MP-10.8 Rollback/deindex
- [ ] MP-10.9 Growth playbook
- [ ] Phase 10 independent review
- [ ] Phase 10 exit gate passed

## Phase 11

- [ ] Commercial entry requirements passed
- [ ] Quote and supplier workflow
- [ ] PO and order states
- [ ] Server-owned totals
- [ ] Payment, invoicing, and tax
- [ ] Fulfilment and tracking
- [ ] Cancellation, returns, and reconciliation
- [ ] Compliance and traceability
- [ ] End-to-end transaction simulation
- [ ] Phase 11 independent review
- [ ] Phase 11 exit gate passed

## Phase 12

- [ ] Complete implementer evidence packs
- [ ] Independent agent reviews complete
- [ ] All phase gates re-run against production
- [ ] GPT-5.6 Sol clean-context audit complete
- [ ] Original exhaustive audit repeated
- [ ] Zero P0/P1 findings
- [ ] Accepted P2 register
- [ ] Human product-owner sign-off
- [ ] Phase 12 exit gate passed

## Evidence Log

Append one row per completed packet.

| Packet | Date | Implementer | Reviewer | Commit/PR | Tests | Evidence | Result |
|---|---|---|---|---|---|---|---|
| MP-0.2 | 2026-07-11 | implement_routes_seo | review_routes_seo | `fe9ed75`, `0854194` | lint; unit 24/24 + safety scripts; build; browser 8/8 | direct/refresh routes, Not Found, canonical navigation, JSON-LD cleanup | pass; production HTTP deferred to exit gate |
| MP-0.3 | 2026-07-11 | implement_routes_seo | review_routes_seo | `fe9ed75`, `0854194` | static metadata; build audit; browser 8/8 | 589/589 part pages `noindex,follow`; root-only sitemap; robots policy | pass |
| MP-0.4 | 2026-07-11 | implement_routes_seo | review_routes_seo | `fe9ed75`, `0854194` | safety tests; static metadata; dist audit | no `AggregateOffer`/offer-price schema; navigation cleanup | pass |
| MP-0.5 | 2026-07-12 | implement_claims + resume_claims | review_claims | `598833c`, `936b6a0` | clean-dist tests; lint; build + bundle truth; browser 8/8 | Product Truth source/docs/bundle guards; BOM no-fabrication behavior | pass |
| MP-0.6 | 2026-07-12 | implement_ci_deploy | review_ci_deploy | `6fb17e3`, `4343d30` | clean rehearsal: lint, tests, build, browser 9/9; YAML/PowerShell contracts | `.superpowers/evidence/rollback-rehearsal-4343d300fa2b-20260712-094840.log` | pass; deployment and live smoke pending exit gate |
| MP-0.7 | 2026-07-12 | implement_legacy_isolation + resume_legacy_isolation | review_legacy_isolation | `86046c5`, `ecfa44b` | exact isolated lint, tests, build, browser 9/9; runtime guard matrix | repo-wide active-path scanner; archived configs/tools/plans; exact opt-in guards | pass |
| MP-0.1 | 2026-07-12 | implement_release_truth | review_release_truth | `ee89bf0`, `ec4a003`; deploy run `29203432018` | CI success; deploy + transport/rendered smoke success; clean rehearsal lint/tests/build/browser 9/9 | live `release.json` = local HEAD = `origin/master` = `ec4a0032d140ad627c52a8e74778bbd124e8934d` | pass |
| Phase 0 exit gate | 2026-07-12 | root | review_phase0_exit | commits `adc1977` through `ec4a003` | production SHA/routes/schema/sitemap; clean rehearsal; full 13-commit review | zero P0/P1; final reviewer approved completion and Phase 1 unlock | pass |

## Open Risks and Blockers

| ID | Phase | Risk/blocker | Owner | Resolution condition | Status |
|---|---|---|---|---|---|
| P2-0-1 | 1 | `research/master-plan.md` Current Readiness still describes the pre-Phase-0 audit snapshot | Phase 1 | Reconcile into the authoritative product source without erasing historical audit context | open |
| P2-0-2 | 1 | `research/prd.md` still names obsolete Next.js/Vanilla CSS architecture | Phase 1 | Update authoritative architecture description to match the shipped Vite/React/Tailwind runtime | open |
