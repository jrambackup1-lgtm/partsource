# PartSource Data Source Register

**Status:** Active production gate

No source adapter may run or publish records unless its status is `approved` and its permission evidence covers PartSource's commercial automated collection and public display use.

| Source | Potential value | Current status | Production decision |
|---|---|---|---|
| Confidential cofounder-provided catalog dataset | Socket-head, hex-head, and rounded-head technical configuration records supplied directly for PartSource. | approved | Jay confirmed cofounder authorization on 2026-08-06 for PartSource storage, normalization, search, and public display. Permit only supplied technical configuration fields; never infer offers, listings, stock, price, equivalence, or approval. Confidential origin is not published. |
| SKDIN | Structured McMaster-number mappings and fastener specifications appear on indexed product pages. | blocked | Legal notice permits personal/non-commercial use only. PartSource may not collect, capture, store, normalize, test against, or publish SKDIN content pending written reuse/feed permission. |
| LILY Bearing | Detailed McMaster mappings, specifications, and supplier alternatives. | blocked | Legal notice explicitly prohibits scraping and commercial exploitation without written consent. |
| Source-Search | Broad paid industrial cross-reference database. | blocked | No public bulk-reuse license or API confirmed; request licensed export/API terms. |
| Filtersource | Narrow supplier-authored filter cross-references. | blocked | Public-display and bulk-reuse permission not established. |
| McMaster Product Information API | Authoritative McMaster product information for approved customers. | blocked | Standard API terms do not authorize an external comparison product; explicit written permission required. |
| Public/open BOMs | Can provide isolated McMaster identifiers and descriptions. | discovery | Accept only records with a compatible license, provenance, and independent specification verification. |
| Public standards facts | Canonical dimensions and terminology for normalization. | conditional | Use independently recorded facts; do not copy copyrighted standards text or tables. |

## SKDIN personal-research boundary

SKDIN's personal/non-commercial allowance is not a PartSource research or ingestion exception. Until SKDIN grants written permission covering PartSource's intended use, do not collect its mappings, specifications, page captures, screenshots, copied fields, derivatives, or a manual sample for this project. This applies to one-off and bulk collection, and to manual browsing and automation alike.

Permitted pre-clearance work is limited to reviewing and recording the legal notice, identifying the rights holder/contact route, and requesting written permission that states the allowed acquisition method, fields, storage/transformation, public display, attribution, refresh, and termination terms. Personal viewing for education must remain outside PartSource artifacts and cannot inform a product record or mapping.

## Approval record required per source

- Source owner and canonical URL.
- Permission/license document, effective date, and reviewer.
- Allowed acquisition method and rate limits.
- Fields permitted for storage, transformation, and public display.
- Required attribution and outbound links.
- Refresh, expiry, correction, deletion, and termination rules.
- Sample validation result and known coverage limits.
- Adapter owner, current status, and last compliance review date.

## Confidential cofounder dataset approval record

- Source owner: PartSource cofounder; upstream origin confidential under NDA.
- Permission evidence: Jay's authorization recorded 2026-08-06.
- Allowed acquisition: provided local CSV files only; no scraping or enrichment.
- Permitted fields: supplied technical configuration fields only.
- Public display: this approval permits only a separately reviewed future dataset use; it does not authorize the current synthetic POC to use, deploy, or publish this dataset. Never publish the confidential origin or raw dataset download.
- Attribution: none publicly; confidential source must not be exposed.
- Refresh and correction: cofounder-provided replacement dataset; Jay owns acceptance.
- Takedown: remove access when Jay or cofounder directs.
- Future validation: independently reviewed import counts and samples are required before any approved future use.
- Adapter owner: Jay; status approved; last compliance review 2026-08-06.
