# PartSource MVP Boundary

**Status:** Target MVP supporting contract

**Authority:** This is a supporting contract subordinate to `research/product-contract.md`. If they conflict, the product contract wins. The current shipped state is evidence, not the target launch promise.

## Target MVP capabilities

The target MVP covers standard fasteners, safe discovery, technical reference, an anonymous browser-local BOM, truthful CSV/PDF exports, supplier search handoffs, and controlled quote validation. A capability is not a shipped promise until its owning phase and gate are complete.

| Target capability | Current shipped state | Owning master-plan phase | Entry/gate | Acceptance boundary |
|---|---|---|---|---|
| Standard fasteners | Partial: a bundled standards-derived fastener catalog ships, but coverage and provenance are incomplete. | Phase 2 | MP-2.1 taxonomy and MP-2.5 provenance gates pass. | Supported families use reviewed standards, editions, units, materials, and provenance; configurations never imply manufacture, stock, or availability. |
| Safe discovery | Partial: exact catalog identifiers resolve and unknown input can produce a bounded candidate configuration. | Phase 4 | Phase 2 domain foundation is accepted; the MP-4.10 golden corpus passes. | Exact and broad search preserve hard constraints, expose interpretation, and label uncertain results as candidates requiring verification. |
| Technical reference | Current core: the runtime includes a reference library and read-only part views; evidence depth remains incomplete. | Phase 5 | Phase 2 provenance and Phase 4 discovery semantics pass. | Facts, diagrams, references, and result states are evidence-backed and never imply a listing, offer, equivalence, or approval. |
| Anonymous browser-local BOM | Current core: users can add, edit, delete, import, and retain BOM lines in browser storage without an account. | Phase 6 | Phase 5 part semantics are stable; MP-6 storage, import, and integrity checks pass. | BOMs remain anonymous and local, preserve requirements separately from selections, surface storage limits, and fabricate no commercial facts. |
| Truthful CSV/PDF exports | Current core: client-side CSV and PDF summaries ship. | Phase 6 | MP-6.6 and MP-6.7 export acceptance passes. | Exports preserve BOM truth, identify USD as the supported cost basis, and label user-entered/imported costs as user data rather than PartSource prices or offers. |
| Supplier search handoffs | Current core: specification-led supplier-site searches open for independent inspection. | Phase 5 | MP-5 handoff review proves truthful query construction and result-state labels. | A handoff remains a search URL, not a confirmed listing, candidate match, offer, equivalent, approval, price, or inventory claim. |
| Controlled quote validation | Not shipped: only a sourcing-help lead exists today. | Phase 7 | MP-7.6 opens only after the frozen-snapshot, consent, ownership, acknowledgement, service-status, and deletion controls pass. | A controlled cohort can submit a frozen BOM for acknowledged human validation with clear ownership, SLA/status, consent, and deletion; no order or brokerage claim is created. |

## Supported hardware

The target catalog boundary is deliberately narrower than all mechanical hardware. “Target supported” applies only after the Phase 2 taxonomy and provenance gates pass; current runtime leftovers do not expand the boundary.

| Category | MVP state | Boundary |
|---|---|---|
| Screws and bolts | Target supported | Included only after the reviewed Phase 2 taxonomy and provenance gates pass. |
| Nuts | Target supported | Included only after the reviewed Phase 2 taxonomy and provenance gates pass. |
| Washers | Target supported | Included only after the reviewed Phase 2 taxonomy and provenance gates pass. |
| Pins | Unsupported | Pending a later reviewed taxonomy/evidence decision; no current or target MVP support is claimed. |
| Bearings | Outside MVP | Not part of the target hardware boundary. |
| Rivets | Outside MVP | Not part of the target hardware boundary. |
| Pneumatics | Outside MVP | Not part of the target hardware boundary. |
| Raw stock | Outside MVP | Not part of the target hardware boundary. |
| Electrical | Outside MVP | Not part of the target hardware boundary. |
| Other categories | Outside MVP | Any category not explicitly included above remains outside the MVP. |

## Quote boundary

The current mailto/clipboard sourcing-help lead opens a prefilled email or copies BOM text. It is not dependable quote submission, acknowledgement, order creation, or quote status.

Future Phase 7 controlled quote validation is not currently shipped. Before it can enter a controlled cohort, it requires:

- a frozen BOM snapshot;
- explicit consent to submit that snapshot;
- named operational ownership;
- dependable acknowledgement;
- a visible SLA/status path; and
- a deletion path for the submitted snapshot and related personal data.

Passing this gate validates a human-operated quote workflow only. It does not create checkout, supplier routing, an accepted quote, an order, payment, fulfilment, or brokerage.

## End-to-end MVP acceptance journey

The target MVP is accepted when a user can:

1. Discover a standard screw/bolt, nut, or washer through safe exact or broad search without unsupported claims.
2. Inspect the candidate configuration and its technical reference, provenance, limitations, and verification state.
3. Add the selection to an anonymous browser-local BOM, edit it safely, and retain it locally without authentication.
4. Export the BOM as CSV or PDF with truthful labels, USD cost basis, and no fabricated commercial data.
5. Open a specification-led supplier-site search handoff and understand that its results require independent verification.
6. After the Phase 7 gate passes, explicitly submit a frozen BOM snapshot into controlled quote validation and receive acknowledgement, ownership, SLA/status, and a deletion path.

Until step 6 is implemented and verified, the shipped journey ends at the supplier handoff or the non-dependable sourcing-help lead; it must not be described as end-to-end quote submission.

## Explicit non-goals

The MVP does not provide or promise:

- live or synthetic prices, inventory, availability, lead time, or other unsourced commercial data;
- confirmed supplier listings or offers;
- equivalence or approval without evidence and, for approval, named organizational authorization;
- authentication or cloud collaboration, including accounts, shared BOMs, roles, comments, or cross-device sync;
- commerce, checkout, payments, ordering, fulfilment, returns, or brokerage;
- bulk scraping, login-wall circumvention, or unsanctioned supplier ingestion; or
- scaled pSEO indexing or bulk page-per-SKU publication.
