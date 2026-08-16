# PartSource Legal and Operational Boundary

> **LEGACY IMPLEMENTATION AND LEGAL RESEARCH.** Preserve current-runtime observations and source notes. BOM, supplier-handoff, account, phase, and deployment assumptions do not define current product scope. Revalidate before operational use.

**Status:** Historical memo; subordinate to `research/product-contract.md`

**Effective:** 2026-07-13

**Review posture:** This is a product boundary memo, not legal advice. It records current runtime facts, minimum future controls, and questions for qualified counsel. It is not a launch-ready privacy notice, terms, or retention policy; it does not claim counsel approval.

The authoritative product contract wins if this memo conflicts with current product purpose, claims, or phase ownership. Laws, regulator guidance, supplier terms, and the operator's facts must be rechecked at each affected phase gate.

## Operator and jurisdiction status

The repository contains no evidence sufficient to name an operator entity. The `partsource.io` brand, a personal name, a contact email, a GitHub account, or another brand/domain is not proof of a legal operator. Do not publish an invented company, LLC, trading name, address, or jurisdiction.

| Required operator fact | Status | Gate |
|---|---|---|
| Legal name | Unresolved | Confirm from formation/identity evidence; Phase 7 legal launch blocker. |
| Address | Unresolved | Confirm a lawful notices/service address; Phase 7 legal launch blocker. |
| Jurisdiction | Unresolved | Confirm formation/residence and target-market scope with counsel; Phase 7 legal launch blocker. |
| Responsible owner | Unresolved | Name the person accountable for privacy, legal notices, support, corrections, and incidents; Phase 7 launch blocker. |

India, the European Union, the United Kingdom, California/United States, and any other place from which PartSource is deliberately offered are screening jurisdictions only. Listing a source below does not concede that its law applies or that other laws do not. Target markets, operator establishment, user location, data processing, and later commerce determine the final analysis.

As of the retrieval date, India's Digital Personal Data Protection Act and Rules use phased commencement. The official November 2025 commencement materials place major processing, notice, consent, and rights provisions on later dates. Phase 7 must recheck which provisions are in force at launch; this memo must not be used as a static compliance conclusion.

## Current data-flow boundary

| Step | Current behavior | Boundary and third party |
|---|---|---|
| Site delivery | Static Vite/React files are served by GitHub Pages at `https://jrambackup1-lgtm.github.io/partsource/`. | No application backend or server database exists. GitHub documents that Pages logs and stores visitor IP addresses for security. GitHub controls that hosting system; PartSource does not claim GitHub's retention period or other retention behavior. |
| Fonts | The current stylesheet requests a font stylesheet/resource from Google Fonts. | The browser contacts a third party for that resource. Google controls its systems; this memo does not claim its retention behavior. Review or remove this dependency before the Phase 7 privacy notice is finalized. |
| BOM use | The browser-local BOM is held in page memory and persisted under `partsource_bom` in browser `localStorage`. | No app server submission occurs. Scripts running under the same web origin can access origin storage; custom-domain and storage isolation must be reviewed before launch. |
| Import | CSV import reads the user-selected file in the browser and updates the browser-local BOM. | CSV import is on device; the current app does not upload the file to PartSource. File-picker, browser, and operating-system behavior remain outside PartSource's control. |
| Export | CSV export creates a browser Blob/download. PDF export generates and saves a PDF through client-side libraries. | CSV and PDF processing occurs in the browser/on the user's device; the current app does not upload either export. The user controls later storage and sharing. |
| Supplier handoff | The app creates outbound supplier search links from configuration fields; following one navigates to the selected supplier. | Outbound supplier search links are searches, not offers, listings, or equivalents. The destination receives ordinary request data and controls its own site. Third parties control their own systems, terms, cookies, and records; PartSource does not claim their retention behavior. |
| Sourcing-help handoff | When a user selects sourcing help, the app attempts to copy BOM text to the clipboard and opens a user-initiated mailto draft. | Clipboard content remains under the browser/OS boundary. A draft is not a submission. If the user sends it, the BOM and contact details enter the user's and recipient's mail systems; those systems control delivery and their own retention. |
| Current identity and measurement | Anonymous use only. | No customer authentication, account, or cloud sync exists. No analytics or tracking SDK exists. No server submission exists in the current app. Hosting/security logs described by GitHub are a host boundary, not PartSource product analytics. |

The inventory above describes inspected current source, not every browser, network intermediary, email provider, supplier, or host behavior. Re-run a data-flow audit against the deployed Phase 7 candidate before publishing a privacy notice.

## Minimum privacy and rights boundary

Before Phase 7 launch, publish an accessible notice at or before collection that is consistent with the deployed data flow. At minimum it must state:

- verified operator identity and contact, applicable jurisdiction and representative/DPO details if required;
- data categories and sources, specific purposes, applicable legal basis, recipients/processors, international transfers, security approach, and whether data is required;
- retention period per category or a concrete determination rule, rights available in each applicable jurisdiction, how to exercise them, complaint/escalation routes, and the notice's effective/update date;
- the GitHub Pages and external-resource boundaries, plus the distinction between device-local data and data a user chooses to email or send to a third party;
- whether children are in scope and any resulting consent/design controls; PartSource must not infer an age policy silently.

Current user controls and future requirements:

- **Local-device deletion and export:** provide plain instructions and an in-product control to clear the BOM/localStorage. CSV export provides a copy of the BOM; PDF is a readable summary, not a complete machine-readable rights export. PartSource cannot retrieve or delete device-only data it never receives, so the notice must explain browser/device deletion without implying a server-side rights workflow.
- **Email handoff:** a generated draft is local until the user sends it. Once sent, message contents and contact details are received data and need a documented purpose, access boundary, retention rule, deletion/escalation path, and responsible owner.
- **Future quote workflow:** before any dependable quote intake, define the frozen quote/BOM record, consent or other legal basis, fields, recipients, acknowledgement, access, retention period, legal-hold exception, deletion/anonymisation trigger, rights path, backup treatment, and operational owner. Future quote retention and deletion cannot be left indefinite or decided after collection.
- **Future accounts/workspaces:** before Phase 8 processing, document controller/processor roles, vendors, contracts, tenant isolation, permissions, audit logs, transfers, incident response, backups, deletion propagation, anonymous migration, and verification of rights requests.
- **Future analytics:** analytics may collect approved event metadata only and never BOM contents. It must also exclude raw BOM lines, part identifiers from a BOM, imported filenames/file contents, clipboard/email bodies, user-entered costs, free text, and full URLs containing user data. Define an allowlist, retention, access, IP treatment, consent/storage rules, opt-out behavior, and processor terms before enabling it.
- **Storage/access consent:** assess whether BOM `localStorage`, analytics identifiers, cookies, pixels, or similar technologies are strictly necessary in every target jurisdiction. Do not assume that calling a technology “privacy friendly” removes notice or consent duties.

Rights handling must be scoped honestly. Access, correction, deletion, objection/opt-out, restriction, portability/export, consent withdrawal, and complaint rights vary by jurisdiction and business thresholds. Phase 7 counsel must decide which apply; the public notice must not promise a right PartSource cannot operationally honor or omit a right that law requires.

## Engineering and liability boundary

PartSource provides research and sourcing assistance, not professional engineering approval, procurement authorization, or a safety determination.

- Configurations, decoded inputs, candidate matches, cross-references, related items, search handoffs, diagrams, and technical references require independent verification against the current standard, manufacturer documentation, supplier listing, certificates, and intended application.
- No suitability, fitness for purpose, certification, equivalence, organizational approval, price, stock, inventory, availability, lead time, or error-free coverage warranty is made.
- A configuration is not proof that a part is manufactured or stocked. A supplier search is not an offer or listing. A candidate is not an exact equivalent. An exact equivalent is not an approved alternate without a named organization's decision for a defined use.
- Do not rely on PartSource alone for safety-critical, regulated, load-bearing, pressure, lifting, structural, aerospace, medical, automotive, or other consequential use. Require qualified review, application-specific calculations, current controlled documents, test evidence, and organizational approval as appropriate.
- User-entered/imported costs and supplier names remain user data. They are not verified PartSource commercial facts.
- Disclaimers do not excuse incorrect or misleading product claims, replace reasonable security/content controls, or exclude rights and liabilities that applicable law does not permit an operator to exclude. Counsel must tailor enforceable terms after the operator and offered jurisdictions are known.

## Affiliate and supplier-data boundary

Current supplier links are treated as uncompensated search handoffs because the repository contains no evidence of an active affiliate arrangement. Before any compensated link is published:

1. obtain written program acceptance/terms for the confirmed operator and verify that the intended page, traffic source, geography, link format, trademarks, and claims are allowed;
2. place a plain, clear and conspicuous disclosure next to or immediately before the affected link so a user understands that PartSource may earn compensation; “affiliate link” alone is not the default disclosure;
3. add a general affiliation/affiliate explanation without relying on it instead of the link-level disclosure;
4. preserve independent ranking and product-truth rules; compensation never proves suitability, listing identity, price, availability, equivalence, approval, or endorsement;
5. review any tracking parameter, cookie, pixel, SDK, cross-border transfer, consent, opt-out, and retention effect before activation; and
6. keep evidence of the applicable agreement, disclosure version, destination, placement review, and termination date.

Acceptable supplier data use requires written permission or another documented sanctioned access basis covering the actual operator, fields, purposes, users, territories, and display. The contract/permission and technical adapter must define attribution, branding, authentication, rate limits, caching, security, redistribution and derivative-use rules, freshness/refresh requirements, timestamps/expiry, corrections, audit rights, deletion/return at termination, and incident/support contacts.

- No login-wall circumvention, access-control bypass, credential sharing, CAPTCHA/proxy evasion, gray-area scraping, unapproved public scraping, or unsanctioned distributor bulk ingestion.
- A public webpage, embedded structured data, technical possibility, or a third-party scraper does not itself grant reuse or redistribution rights.
- API access is not blanket permission: approved-customer status, credentials, subscriptions, endpoint limits, display/redistribution terms, and current agreement scope still control.
- Standards text, tables, diagrams, supplier descriptions, images, CAD, certificates, trademarks, and logos need separate provenance and licence analysis. Facts/configurations must remain distinguishable from protected presentation and from real products/listings.
- Every future listing or offer must be traceable to a permitted source and identity, timestamped, refreshable, and demoted/removed when stale or permission ends.

## Phase gates and go/no-go blockers

| Phase | Required legal deliverable / entry gate | Evidence required | Go/no-go rule |
|---|---|---|---|
| Phase 7 | MP-7.2 legal launch pack: verified operator/contact, privacy notice, terms, liability/affiliation language, affiliate disclosure rule, retention schedule; MP-7.3 analytics review; MP-7.6 quote rules. | Counsel review for selected jurisdictions; deployed data-flow inventory; processor/host list; rights/support owners; notice and consent checks; quote retention/deletion runbook. | No-go while operator fields are unresolved, the legal launch pack is missing, analytics can capture BOM/user content, a compensated link lacks disclosure approval, or quote receipt/deletion can be mistaken or unowned. |
| Phase 8 | Backend/privacy/security design for identity, tenants, authorization, versioned BOMs, approvals, audit, attachments, migration, rights, retention, deletion, incidents, vendors, transfers, backups, and restore. | Approved ADR/threat model; controller/processor and data map; contracts; tenant and authorization tests; rights/deletion/restore simulations; named security/privacy owners. | No-go without a confirmed operator, lawful processing analysis, vendor terms, tenant isolation, authorization controls, breach process, retention/deletion behavior, and cross-tenant test evidence. |
| Phase 9 | Written permission or signed supplier agreement, legal approval, adapter contract, attribution, rate/redistribution/freshness rules, listing identity, and stale-data handling. | Executed/current permission; field/use matrix; credential and rate controls; provenance; timestamps/expiry; correction/termination tests. | No-go for any supplier lacking written permission for the intended use, or if access, attribution, redistribution, freshness, identity, expiry, or termination handling is unresolved. No public scraper fallback. |
| Phase 11 | Commercial entry requirements: repeat demand/economics, signed suppliers, legal entity, banking, tax, insurance, terms, returns/quality, traceability, staff capacity, support SLA, and applicable consumer/e-commerce review. | Counsel/accounting/insurance decisions; supplier and customer terms; tax/payment/refund flow; product/quality responsibility map; restricted-party/sanctions assessment; immutable transaction and incident records; end-to-end simulation. | No-go without the legal entity, banking, tax, insurance, signed supplier authority, enforceable terms, payment/refund/returns ownership, quality/traceability controls, restricted-party decision, support capacity, and immutable reconciliation evidence. |

Passing this memo's checks does not pass a later phase gate. Phase 7 must produce the public legal launch pack; Phases 8, 9, and 11 must produce their own reviewed contracts, policies, controls, and operating evidence.

## Unresolved counsel questions

1. Who is the operator, what legal name/address/contact must appear, and is a separate entity required before Phase 7 or Phase 11?
2. Which applicable jurisdictions follow from operator establishment, targeted users, hosting, email/quote recipients, supplier relationships, and future commerce? Is a representative or DPO required anywhere?
3. At the intended launch date, which provisions of India's DPDP Act/Rules are in force, and what notice, consent, rights, grievance, security, breach, child-data, transfer, and record duties apply?
4. Is the current BOM `localStorage` strictly necessary under each target jurisdiction's storage/access rules? Does the shared `github.io` origin or external font request require a design or notice change?
5. What legal basis, retention period, deletion process, access group, acknowledgement wording, and service standard apply when a user sends a sourcing-help email or enters the future quote workflow?
6. Which privacy rights and business-threshold rules apply, how will identity be verified for requests, and how do deletion/retention exceptions propagate through email, logs, vendors, backups, and later workspaces?
7. What affiliate programs and disclosure regimes apply to target users? Is the proposed adjacent disclosure adequate on every surface, and what tracking/consent changes follow?
8. For each supplier and standards source, what written licence/permission covers access, storage, normalization, attribution, caching, redistribution, images/CAD, trademarks, derived fields, and termination?
9. What engineering disclaimer and limitation language is enforceable without conflicting with non-excludable consumer, product, negligence, or professional duties?
10. Before commerce, which entity, e-commerce, tax, payment, insurance, product-liability, sanctions/restricted-party, export, returns, warranty, certificate, recordkeeping, and dispute rules apply to the proposed operating model?

## Official sources

**Retrieved: 2026-07-13. Live retrieval checked: 2026-07-13.** Direct official government/regulator or first-party URLs only. These sources support screening and gate design, not a conclusion that every listed rule applies. The focused repository test validates the recorded URL strings, HTTPS, and approved hosts; it does not make live HTTP requests.

| Jurisdiction / boundary | Official source | Current fact used | Retrieval status |
|---|---|---|---|
| India | [Digital Personal Data Protection Rules, 2025 — current MeitY source page](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa) | Preferred current index for the final Rules, enforcement timeline, Board notification, and corrigendum. | Live content retrieved on 2026-07-13. |
| India | [Digital Personal Data Protection Act, 2023 — official MeitY PDF](https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf) | The Act defines India's digital personal-data framework and provides for commencement by Gazette notification. | Live content retrieved on 2026-07-13. |
| India | [Digital Personal Data Protection Rules, 2025 — Gazette copy hosted by MeitY](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf) | The final Rules use phased commencement, including one-year and eighteen-month groups. | Live content retrieved on 2026-07-13. |
| India | [DPDP Act enforcement timeline — Gazette notification hosted by MeitY](https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf) | The November 2025 notification appoints different commencement dates for different Act provisions. | Live content retrieved on 2026-07-13. |
| European Union | [Regulation (EU) 2016/679 (GDPR) — EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng) | Articles 13–14 address transparency; Articles 15–22 cover access, rectification, erasure, restriction, portability, objection, and automated-decision rights. Territorial scope and lawful basis require fact-specific review. | Live content retrieved on 2026-07-13. |
| United Kingdom | [Cookies and similar technologies — Information Commissioner's Office](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/) | Storage/access technologies require clear information and a lawful consent/exception analysis; a buried privacy-policy reference is not enough. | Live content retrieved on 2026-07-13. |
| California / United States | [What General Notices Are Required by the CCPA — California Privacy Protection Agency](https://cppa.ca.gov/pdf/general_notices.pdf) | The official overview identifies notice-at-collection/privacy-policy content, rights instructions, retention disclosure, and contact expectations for covered businesses. Coverage thresholds remain a counsel question. | Live content retrieved on 2026-07-13. |
| United States | [FTC's Endorsement Guides: What People Are Asking — Federal Trade Commission](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking) | Material affiliate relationships should be disclosed clearly and conspicuously near the link/recommendation; an obscure general disclosure is insufficient. | Live content retrieved on 2026-07-13. |
| Hosting | [What is GitHub Pages? — GitHub Docs](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) | GitHub describes Pages as static hosting and states that visitor IP addresses are logged and stored for security. | Live content retrieved on 2026-07-13. |
| Supplier access | [McMaster-Carr Product Information API — McMaster-Carr](https://www.mcmaster.com/help/api/) | The first-party API is for approved customers, uses certificate/authentication controls, product subscriptions, and rate/usage limits; technical availability is not general redistribution permission. | Live content retrieved on 2026-07-13. |
| India commerce | [Consumer Protection rules index — Department of Consumer Affairs](https://consumeraffairs.nic.in/acts-and-rules/consumer-protection/consumer-protection) | The official index lists the Consumer Protection (E-Commerce) Rules, 2020 and later related materials; Phase 11 needs model-specific review of the current instruments. | Official search content retrieved; direct open timed out on 2026-07-13. |

Source URLs and rule status must be refreshed at Phase 7/8/9/11 entry. Supplier program agreements and operator-specific legal advice are additional evidence, not replaced by public webpages.
