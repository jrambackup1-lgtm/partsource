# PartSource Capability Tiers

> **HISTORICAL — SUPERSEDED CAPABILITY ROADMAP.** Preserve as phase-planning history. Local BOM, company, enterprise, transactional, account, and supplier assumptions are not current product scope.

**Status:** Historical — inactive

**Authority:** Historical evidence only. `research/product-contract.md` controls current product scope.

These tiers separate current personal use from later company, enterprise, and transactional capabilities. A phase or trigger makes work eligible for evaluation; it does not make the capability available until its gate and verification pass.

## Tier: Personal/local

- **User:** An individual mechanical or prototype engineer or small-company hardware builder researching fasteners and preparing a local BOM.
- **Identity:** Anonymous browser use through the MVP; no registration, login, customer identity, or account.
- **Storage:** Browser-local `localStorage` plus client-side CSV/PDF import and export. The user's working BOM is not cloud-stored.
- **Collaboration:** None. The user may export or copy work independently, but PartSource provides no shared workspace, role, comment, approval, or cross-device workflow.
- **Commercial data:** User-entered or imported costs only. Supplier search handoffs are URLs for independent verification, not listings, offers, prices, inventory, or savings.
- **Operational owner:** The user controls the local BOM and browser storage; PartSource owns only the public static product and its truthful presentation.
- **Earliest phase:** Current / MVP. This remains the only current product tier through Phase 7; Phase 6 owns target local-BOM maturity.
- **Entry trigger:** None. Anonymous local use is the default current experience.
- **Unavailable before gate:** Through the MVP there is no account, cloud sync, team approval, audit history, or server submission in this tier. A separately gated Phase 7 controlled quote-validation intake may accept an explicitly consented frozen copy, but it does not cloud-store the user's working BOM or create an account, company workspace, order, or commerce capability.

## Tier: Company/team

- **User:** Multiple people in one customer organization who need governed shared BOM and quote workflows.
- **Identity:** Staff authentication first and customer accounts only when required, with organization membership, tenant identity, roles, and enforced authorization.
- **Storage:** A secure backend using managed Postgres and encrypted object storage for versioned BOMs, immutable submissions, attachments, retention, and deletion.
- **Collaboration:** Shared/versioned BOMs, comments, approvals, conflicts, supplier policies, and audit history only after their Phase 8 packets pass.
- **Commercial data:** Company-entered data and governed quote-intake records may be stored. Supplier listings or offers remain unavailable unless the separate Phase 9 sanctioned-data gate passes.
- **Operational owner:** The customer organization owns its decisions and approvals; named PartSource staff own service operation, security, support, and access administration.
- **Earliest phase:** Phase 8 only, after a backend trigger and the security foundation pass. A trigger authorizes evaluation, not release.
- **Entry trigger:** At least one Phase 7 backend trigger: Five qualified quote attempts in one month; evidence of lost submissions or mailto/URL-size failure; need for attachments or multiple staff handlers; or Three target companies request shared/cross-device workflows. Before customer use, the Phase 8 threat model, tenant and identity model, RBAC, and authorization tests must also pass.
- **Unavailable before gate:** Accounts, organizations, shared BOMs, roles, comments, approvals, attachments, staff admin, audit history, cloud sync, and anonymous-to-account migration remain unavailable until the owning Phase 8 work and exit simulations pass.

## Tier: Enterprise extensions

- **User:** Enterprise procurement, security, IT, and compliance stakeholders extending an accepted company workspace.
- **Identity:** The Phase 8 tenant and authorization model plus only the individually approved enterprise identity extension, such as SSO/SAML or SCIM.
- **Storage:** The Phase 8 backend plus only contractually approved retention, security, integration, and policy controls.
- **Collaboration:** Organization governance may extend to approved procurement integrations and supplier/compliance policies; no extension is bundled or implied.
- **Commercial data:** No special entitlement to listings, offers, prices, or availability. Any supplier data still requires the separate Phase 9 permission, identity, freshness, and traceability gates.
- **Operational owner:** Named customer enterprise owners and named PartSource security/service owners share responsibility according to the approved contract and control set.
- **Earliest phase:** After the Phase 8 foundation and exit gate; enterprise extensions are individually demand-gated, not automatically included in Phase 8.
- **Entry trigger:** Documented demand for one named extension, an accepted company workspace foundation, and approved security, legal, operational, and support requirements for that extension.
- **Unavailable before gate:** SSO/SAML, SCIM, punchout/cXML, ERP/PO fields, contractual security, customer retention, restricted-supplier rules, and compliance policies remain unavailable until each requested extension passes its own demand and readiness gate.

## Tier: Brokerage/commerce

- **User:** Qualified transactional customers, participating suppliers, and PartSource operations staff completing governed commercial transactions.
- **Identity:** Authenticated, authorized, and auditable customer, supplier, and staff identities tied to verified organizations and legal responsibilities.
- **Storage:** Server-owned, immutable quote, acceptance, PO/order, payment, tax, fulfilment, tracking, return, reconciliation, and financial snapshots with audit history.
- **Collaboration:** Governed vendor quote, acceptance, fulfilment, exception, return, and reconciliation workflows with named operational ownership.
- **Commercial data:** Only sanctioned, traceable, permitted, timestamped, and refreshable supplier listings/offers from the Phase 9 foundation, plus server-owned transaction totals.
- **Operational owner:** A formed PartSource legal entity and named finance, tax, supplier, fulfilment, quality, compliance, support, and incident owners.
- **Earliest phase:** Phase 11 only, after every commercial entry requirement passes.
- **Entry trigger:** Repeat qualified customers, proven economics, signed suppliers, legal entity, banking, tax process, insurance, terms, returns/quality process, traceability, staff capacity, and support SLA.
- **Unavailable before gate:** Vendor quotes, accepted quotes, PO/order, checkout, payments, invoicing, tax, fulfilment, tracking, cancellation, returns, reconciliation, brokerage, and certificate or restricted-party workflows remain unavailable before the Phase 11 entry gate and verification pass.

## Presentation rules

The current UI must not show fake locked nav, avatars, approvals, admin, account, order, tracking, compliance, live price, or savings theatre. It must not use disabled controls, empty destinations, badges, or staged data to imply that a later tier exists.

Future tiers may be described only as roadmap context, not available features. Roadmap language must name the owning phase and gate, avoid calls to use or buy the capability, and never visually mix a future tier into the current Personal/local workflow.

## Product Truth alignment

- A configuration is not stock.
- A search URL is not an offer.
- A candidate is not an equivalent.
- An equivalent is not approved without a named organization's approval for a defined use.
- Live price, inventory, certification, availability, or lead time requires a sanctioned source and timestamp plus the applicable phase gate.
- User-entered or imported costs are user data, not PartSource prices, offers, or savings.
- No tier silently changes thread pitch, measurement system, standard, material, strength class, evidence state, or approval state.
