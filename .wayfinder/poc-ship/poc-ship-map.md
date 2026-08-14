---
title: Define the PartSource progressive catalog POC
status: open
label: wayfinder:map
created: 2026-08-08
updated: 2026-08-14
---

## Destination

Build and ship a credible deterministic PartSource mechanical-component discovery POC.

Choose the smallest product shape that moves an engineer from a query to the correct catalog depth and a filtered result list while preserving catalog context and user selection.

Readiness does not start `/to-spec`; Jay must give a separate explicit instruction.

## Current position

Post-POC UX decision update — 2026-08-12:

Jay selected the next engineer job: exact identifier recovery and confirmation.

The next UX focus is deterministic interpretation trace for exact identifier recovery. Unit and terminology must be fully defined for the selected POC families before more families are added. Smart filters must stay deterministic: show valid values, remove or disable impossible values, and never hide active constraints silently. Result rows should stay comparison-ready; no separate compare mode yet. Provenance must show source/origin per catalog record and relevant fact or identifier mapping; no generic verified badge. Exact identifier states are strict: unique highlights, unknown does not highlight, non-unique does not highlight and shows a clear state, and PartSource never fuzzy-selects. Before implementation changes, the gate is deterministic benchmark, browser tests, adversarial cases, and a proxy-evidence review using public standards scope, manufacturer technical data, and independent challenge. This is not qualified approval.

Decision record: [Wayfinder decision record — exact identifier recovery UX](ux-exact-identifier-recovery-decisions-2026-08-12.md).

Next decision gate result: [Decision gate — exact identifier recovery spec delta](exact-identifier-recovery-spec-delta-gate-2026-08-12.md). Verdict: **READY FOR SPEC UPDATE**. Proposed spec delta: [Proposed spec delta — exact identifier recovery and interpretation trace](proposed-spec-delta-exact-identifier-recovery-2026-08-12.md).

Spec update result — 2026-08-12: `../../docs/specs/partsource-progressive-catalog-poc.md` now includes the approved seven UX decisions. Status: **SPEC-READY**. The completed POC tickets stay closed. On 2026-08-13, Jay authorized implementation ticket planning only; no code, deployment, publication, or outreach is authorized.

The current product documents agree on progressive catalog navigation.

`research/product-contract.md` is the sole current product authority.

The existing web app is legacy implementation evidence. It still contains isolated-part, parser, fuzzy-search, BOM, and supplier-handoff behavior that does not meet the current contract.

The POC definition blockers are resolved in [Resolve progressive-catalog POC definition blockers](tickets/31-resolve-progressive-catalog-poc-definition.md). Jay approved the technical specification: [PartSource Progressive Catalog POC](../../docs/specs/partsource-progressive-catalog-poc.md).

Tickets 32–38 are complete and passed the final local release audit: the POC starts only from the validated local synthetic bundle, resolves safe broad/family queries into typed AND-only filters, fails closed on unsafe interpretation, supports evidence-only exact-ID highlight and explicit detail, restores validated workspace URL state, and passes the full acceptance/boundary gate.

Current frontier: Tickets 39–42 are complete. Ticket 39 passed as proxy evidence only; it is not qualified approval. Ticket 40 passed the deterministic resolver/synthetic contract gate in [Ticket 40 deterministic resolver/synthetic contract gate](evidence/ticket-40-deterministic-resolver-synthetic-contract-gate.md). Ticket 41 passed the traceable comparison-ready workspace gate in [Ticket 41 traceable comparison-ready workspace gate](evidence/ticket-41-traceable-comparison-ready-workspace-gate.md). Ticket 42 passed the final post-POC UX-delta release gate in [Ticket 42 post-POC UX-delta release gate](evidence/ticket-42-post-poc-ux-delta-release-gate.md). No deployment, publication, outreach, or new product scope is authorized.

Tickets 32–38 remain complete POC evidence. Deployment, publication, and outreach remain blocked. Ticket creation does not authorize implementation.

## Current product decisions

- PartSource is a deterministic mechanical-component catalog navigator.
- Runtime path: `query → catalog level → family → filters → result list`.
- Search determines the deepest supported catalog level.
- Catalog context stays visible.
- Filters narrow the current result list.
- Exact ID opens the correct family context and result list, then highlights the supported exact match.
- Non-exact search never auto-selects a part.
- User selection is required before detail opens.
- Runtime behavior uses typed fields, category hierarchy, family schemas, filters, matching, provenance, and fail-closed states.
- No AI or agents run in PartSource.
- No McMaster API, scraping, copied supplier catalog data, equivalence, replacement, supplier offer, price, stock, availability, account, checkout, BOM, or bulk-SEO behavior is current product scope.
- `research/data-source-register.md` controls allowed data.
- [Resolve progressive-catalog POC definition blockers](tickets/31-resolve-progressive-catalog-poc-definition.md) — use three hex-socket screw families, 30 blank-slate synthetic records, strict metric filters, namespace-aware exact IDs, fail-closed collisions, a deterministic benchmark, and in-workspace detail.

## Historical evidence index

The links below preserve research and development history. They do not control the current product.

- Product frontier: `research/product-frontier-synthesis-2026-08-09.md`.
- Family audit: `research/poc-family-taxonomy-audit-2026-08-09.md`.
- Interaction experiments: `../../archive/legacy-plans-2026-08-12/sketches/002-behavioral-family-workspace/`, `../../archive/legacy-plans-2026-08-12/sketches/003-entry-compositions.md`, `../../archive/legacy-plans-2026-08-12/sketches/003-*`, and `../../archive/legacy-plans-2026-08-12/sketches/004-compare-first-spec-lab/`.
- Benchmark plan: `research/poc-discovery-benchmark.md`.
- System audit: `research/current-system-structural-audit-2026-08-09.md`.
- Product, UX, trust, and architecture research: `research/full-problem-space-product-opportunities-2026-08-09.md`, `research/modern-engineering-ux-opportunities-2026-08-09.md`, `research/mechanical-data-trust-opportunities-2026-08-09.md`, and `research/poc-architecture-risk-red-team-2026-08-09.md`.
- Ticket 25 evidence: `research/proxy-poc-ticket25-results-2026-08-10.md` and `research/ticket25-fundamental-rethink-2026-08-10.md`.
- Direction reconciliation: `research/partsource-product-directions-reconciliation-2026-08-10.md`.
- Ticket 30 evidence: `research/ticket30-bounded-intent-adaptive-resolver-results-2026-08-10.md` and `../../archive/legacy-plans-2026-08-12/sketches/008-bounded-intent-adaptive-resolver/`.
- Ticket audit: `research/wayfinder-ticket-audit-2026-08-10.md`.
- Full reviews: `research/full-problem-space-skeptical-review-2026-08-09.md`, `research/mechanical-search-discovery-frontier-2026-08-09.md`, and `research/full-problem-space-synthesis-2026-08-09.md`.
- Proxy gate: `research/proxy-validation-gate-contract-2026-08-10.md` and `research/proxy-validation-gate-synthesis-2026-08-10.md`.

## Strong hypotheses

- One progressive catalog shell can show the correct catalog depth and relevant result list within 15 seconds.
- The same catalog shell can serve rough text and exact identifiers while preserving context.
- One progressive catalog workspace is stronger than separate broad-search and exact-ID flows.

## Deferred ideas — not current product scope

- Delta-only configuration comparison.
- Accurate source-backed geometry after it measurably reduces wrong choices.
- Keyboard-first expert mode and saved searches.
- Photo, camera, barcode, CAD, or geometry-led entry after the text/identifier loop proves useful.
- A mechanical notebook/transcript after normal lookup proves value.
- Local or cloud BOM only after catalog-navigation value is proved.
- Commercial offers, availability, and quote flows only after sanctioned feeds and demand.

## Resolved POC definition

- Data: exclude the SKDIN-derived CSV path and use `PS-POC-SYNTHETIC-V1`, authored from a blank slate.
- Families: Socket-head cap screws, Button-head socket screws, and Countersunk socket screws.
- Corpus: 30 synthetic records plus one deliberate two-record collision mapping.
- Runtime contract: metric exact filters, conservative normalization, stable record IDs, namespace-aware identifier mappings, and fail-closed zero/many states.
- Benchmark: 18 deterministic behavior cases covering catalog depth, filters, zero results, exact ID, conflict, unsupported input, selection, context restoration, and narrow screens.
- Detail: explicit selection opens in-workspace detail; exact lookup only highlights.

Full decision: [Resolve progressive-catalog POC definition blockers](tickets/31-resolve-progressive-catalog-poc-definition.md).

## Unresolved but not blocking this POC

- Legacy CSV rights and file lineage remain unresolved for future reuse. The POC excludes them and all derivatives.
- Synthetic fixtures do not prove mechanical truth, standards compliance, supplier identity, or user value.
- Direct-user validation and qualified mechanical review remain later evidence gates.
- The approved technical specification does not authorize deployment, publication, outreach, or claims beyond this synthetic POC.

## Historical decision record

The sections below preserve superseded routes and rejected product pivots. They are historical evidence only. They do not control the current product model.

### Validation + targeted ideation synthesis — 2026-08-09

Full synthesis: `research/validation-targeted-ideation-synthesis-2026-08-09.md`.

### Directional recommendation — not approved for `/to-spec`

- **A now:** fastener specification recovery with a frozen, release-aware configuration or issue packet.
- **B challenger:** fastener BOM specification preflight. Potentially stronger repeat/P&L value; unvalidated and dependent on A's line resolver.
- **C research only:** category-scoped specification integrity. Rolling bearings falsify a universal fastener-style configuration model.
- **D kill path:** stop or rethink if direct work shows low frequency, no advantage, unsafe matches, no useful artifact, or no lawful reviewable data.
- Supplier handoff is secondary. The frozen packet is the completion event.
- Remain in Wayfinder until direct engineer and mechanical-domain gates pass.

### Evidence

- Exact identifiers are the strongest current path. The corrected `91290A115` case proves the need to separate clue, mapping, and configuration.
- A has the best current data fit, demo credibility, and technical tractability.
- B has the strongest hypothesized repeat and cross-role value, but no direct-user proof.
- No current source row is publishable as-is. Current projection drops selection-critical fields and loses imperial TPI semantics.
- 1,591 imported-signature groups repeat; 1,311 groups differ on omitted supplied fields. Automatic merge is unsafe.
- Competitors own other completion events: order, commercial intelligence, CAD retrieval, or material selection. PartSource's plausible opening is the transition between artifacts and roles.
- Rolling bearings preserve truth operations but require manufacturer execution and application conditions. They reject the broad platform claim.
- PostgreSQL + Edge is enough for the bounded POC; current release, DTO, search, timeout, abuse, and deployment contracts are not.
- There are still 0/12 direct-user sessions.

### Fundamental requirements

- Preserve raw input and supplied notation.
- Keep identifier mapping, configuration, family, release, evidence, BOM snapshot, and supplier destination distinct.
- Use approved family identity/required-field profiles.
- Publish a small metric-only immutable release from a full-field reviewed packet; do not publish all candidates.
- Use namespace-aware exact routing, typed quantities, hard-constraint filtering, stable order, explicit abstention, correction, withdrawal, and rollback.
- Expose only a versioned allowlisted public DTO through Edge; private lineage stays private.
- Block selection, BOM freeze, and alternate-supplier handoff on unresolved critical facts, conflict, ambiguity, withdrawal, unsupported scope, unavailable service, or unreviewed state.
- Run a 100–150-case truth corpus and a recent-work A/B concierge duel before `/to-spec`.

### Opportunities / gold ideas

- Constraint ledger shared by search, UI, regression cases, frozen snapshots, and supplier-query compilation.
- Decision queue grouped by the next safe engineering action.
- Exact identifier as a mapping, not the product.
- Useful abstention and exportable issue records.
- Two-path completion: source-direct exact ID and editable alternate-specification packet.
- Differences-only comparison that never hides unknowns.
- BOM preflight as the first challenger after the line resolver is safe.

### Open questions

- Real task frequency, urgency, normal workaround, reuse, willingness to pay, and A-versus-B preference.
- Whether a confidential-source evidence sentence creates enough trust.
- Which three candidate family profiles and which ~150 metric configurations can pass domain review.
- Whether supplier packets save work compared with opening the original source.
- Controlled Edge latency, caller identity, rate/cost controls, and deployment-level JWT/public behavior.

### Risks

- A polished UI can turn one confidential source and one row into false authority.
- `BOM readiness` can imply PLM, ERP, procurement, quality, or organizational approval.
- Family-first can become a thinner catalog if decision continuity is missing.
- A no-JWT endpoint can create unbounded cost even when data is public.
- Three screw families can be mistaken for platform proof.

### Deferred, not deleted

- accurate geometry after measured comprehension benefit;
- keyboard expert mode, print packet, saved search, and public correction history;
- release-keyed caching and external search only after measured triggers;
- CAD/geometry, accounts, cloud BOMs, commerce, offers, and category expansion only after their own evidence gates.

### Rejected with reason

- Broad mechanical platform now — bearing semantics falsify the shared configuration center.
- Publish all 27,009 rows — current projection loses identity and creates false duplicate candidates.
- BOM readiness score — hides severity, coverage, and system failure.
- Supplier click as core value — no listing, offer, equivalence, stock, or availability evidence.
- AI/embedding authority — cannot own identifiers, hard constraints, mechanical facts, or publication.
- Universal EAV/ontology — premature and obscures category meaning.
- Cosmetic SaaS redesign — does not preserve truth or improve the engineering decision.

### Empirical / domain gate result — 2026-08-09

Full synthesis: `research/empirical-domain-gate-synthesis-2026-08-09.md`.

### Gate recommendation

- **NO-GO to `/to-spec`.**
- A remains the least-unsupported **manual research hypothesis**, not an approved product direction.
- B does not replace A; it adds packet structure but no line truth or user evidence.
- Supplier translation is outside the core completion claim.
- C/platform framing remains rejected; bearing evidence falsifies unchanged fastener-model transfer.

### Evidence

- Direct practicing-engineer sessions: **0/12**.
- Participant-owned recent-work packets: **0**.
- Frozen state-contract regression: **120/120**, 95 abstentions, 0 false unique matches, and 0 reviewed unique selections.
- Current-artifact baseline: **8/120**, with 58 false unique matches.
- The 120/120 score is contract self-consistency, not mechanical truth.
- **255** metric DIN 7984 low-profile rows leak into the proposed socket-head predicate.
- All 16 metric benchmark cases duplicate `mm` between pitch value and unit; 5/16 mix finish into material text.
- Candidate family approval: **0/3**. Candidate release: rejected.
- Supplier query preserves 5/8 declared facts; current runtime passed only 1/4 exercised blocking decisions.

### Disagreements resolved

- Ticket 24's **150-case** requirement controls over the earlier 100–150 range. Frozen v1 remains forensic evidence; do not edit it or merely append 30 cases.
- Ticket 24's **6–8 engineer** requirement controls over any five-participant minimum proposed in later protocols.
- The benchmark/domain reports are compatible only when 120/120 is restricted to fail-closed state composition.
- Formal mechanical approval was not supplied by a specialist agent report. A named qualified reviewer and digest-bound approval remain required.

### Open gate

Before reconsidering `/to-spec`:

1. run 6–8 qualifying recent-work sessions on participant-owned redacted packets;
2. obtain qualified family, normalization, answer-key, and release review;
3. build a corrected separately versioned 150-case benchmark;
4. preserve zero critical false unique matches or silent selection-critical mutation;
5. stop/rethink if the packet does not improve a real next action or lawful review cannot define a truthful bounded release.

### Proxy Validation Gate and Ticket 25 result — 2026-08-10

Full synthesis: `research/proxy-validation-gate-synthesis-2026-08-10.md`.

### Decision sequence

- Initial proxy decision: **B — bounded POC despite missing human validation.**
- Ticket 25 implementation result: **FAIL — C — rethink.**
- The intended compiler matrix passed 19/19 and the intended browser matrix passed, but a separate main-session adversarial suite reproduced 11/11 trust-boundary failures.
- Current runtime: fail. It enables unsafe actions under broad, partial, conflict, unsupported, withdrawn, and stale-transition states.
- Human/domain gate: still open/NO-GO. Proxy evidence does not close it.
- `/to-spec`: still blocked.

### Decisive proxy evidence

- Six lanes ran: mechanical engineering, fastener domain, manufacturing/sourcing, UX/trust, data quality, and architecture/security.
- Public ISO/ASME scope pages, manufacturer technical catalogs, and official platform/security documentation supported real boundary and lifecycle distinctions without copying protected standards tables.
- The three CSV files remain ingestion buckets, not approved families. One narrow metric coarse standard-profile socket-head-cap-screw profile is coherent enough for a synthetic candidate instrument; positive membership remains unapproved.
- Main-agent rerun reproduced 27,009 rows, 466 typed-low socket rows admitted by the loose predicate, 145 duplicate technical-signature groups covering 311 rows, and 25,404 rows with multiple strength concepts collapsed by the current projection.
- Frozen v1 reproduced 120/120 with 95 abstentions and zero false unique, but stayed 120/120 under wrong pitch units, wrong families, and wrong releases. It remains forensic composition evidence only.
- Current-artifact emulation reproduced 8/120 with 58 false-unique cases. Exact resolution stayed unique in 34/34 cases after all projected technical facts were removed; an injected two-row exact collision still returned one.
- The manual synthetic safe packet preserved 27/27 declared facts, blocked alternate-supplier action in 10/10 lines, and named a defensible next review action in 10/10. This is a design hypothesis, not user usefulness evidence.
- The bounded PostgreSQL + Edge topology is coherent, but mutable rows, row-spread DTOs, broad service-role authority, missing release identity, and absent correction/withdrawal controls make the current serving path unsafe.

### B execution result

- Ticket 25 stayed inside one local/internal research instrument with no deployment or public data mutation.
- The artifact kept BOM, copy, export, and supplier controls out of the intended browser states.
- The adversarial gate found mutable self-asserted digests, last-wins compound conflicts, first-row identity selection, schema/accessor bypasses, incomplete lifecycle history, an incomplete shared ledger, and imprecise next actions.
- Ticket 25 is blocked. Its artifact is forensic-only and must not be integrated or deployed.
- Controlling result: `research/proxy-poc-ticket25-results-2026-08-10.md`.

## Rejected

- Ingestion buckets as user-facing families.
- One page-level `verified` state.
- Automatic equivalence or alternate claims from matching dimensions.
- Automatic collapse of duplicate-looking source rows.
- Catalog-number regex inference as a trusted product foundation.
- “Equivalent part” pSEO pages.
- Brokerage, quote routing, or price optimization before demand and sanctioned commercial data exist.
- LLM-generated mechanical facts.
- Embeddings, fuzzy ranking, or LLM output as authority for identifiers, hard constraints, validity, or automatic selection.
- Configuration recovery as the entire product wedge.
- A prettier supplier catalog as differentiation.
- A global confidence score, `Indexed`, or `Verified` as trust.
- Generic or falsely scaled geometry as evidence.
- Three screw families as proof of a general mechanical-parts platform.
- The dashboard-style passport with evidence-count cards and unreleased review badges.
- Mutable released rows, raw RPC-row forwarding, or silent identifier remapping.
- Universal EAV/ontology machinery before family value is proved.
## Out of scope

- McMaster API.
- McMaster scraping, Zoro scraping, Grainger scraping, or gray-area supplier ingestion.
- Equivalent, verified equivalent, approved alternate, replacement, or interchangeable-part claims.
- Supplier prices, inventory, availability, offers, buy buttons, affiliate links, and quote submission.
- Accounts, cloud sync, teams, checkout, payments, ERP, punchout, or managed RFQ workflow.
- Implementation planning before the decision frontier closes.
- Repairing Ticket 25 before a paid job is proved.
- `/to-spec`, a production backlog, deployment, or public catalog work during C.
- Outreach without Jay's explicit real-time approval of the exact target and copy.
