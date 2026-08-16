# Supplier-Handoff Validation

**Date:** 2026-08-09  
**Verdict:** Supplier handoff should be a **secondary completion action**, not part of the core proof of concept. Offer a transparent, editable handoff packet only after the user has uniquely selected and reviewed a configuration.

## Method and limits

This validation used the completed supplier-handoff prototype at `sketches/006-supplier-handoff-lab`, browser-exercised fixtures, packet/compiler comparisons, destination-search behavior, direct exact-identifier opening, and observed fallback and automation-failure cases.

The validation does **not** establish price, stock, supplier listing, or equivalence. It does not constitute direct user validation. Several supplier destinations denied automation or required bot verification; those outcomes are treated as normal limitations and must be disclosed rather than interpreted as product absence.

## Classifications

### Evidence

- The current generic compiler preserves about **5 of 8** fixture fields and omits **pitch, drive, and standard**.
- The transparent packet preserves **8 of 8 public fixture fields** while excluding confidential lineage and commercial claims.
- Zoro preserved the query, but returned broad results; adding syntax or standard did not reliably improve the outcome.
- Bolt Depot presented bot verification.
- MSC, Fastenal, and MISUMI denied automation.
- Direct McMaster opening preserved exact identifier `91290A115` with zero translation.
- Live fallback can change **M4×1.5** to **M4×0.7**, compile partial input, emit a custom fastener for bearing input, and expose unsafe links.
- The prototype exists at `sketches/006-supplier-handoff-lab` and was browser exercised.

### Fundamental requirement

- Handoff is available only after a **unique, reviewed configuration** has been selected.
- The packet is transparent and editable.
- Block handoff for partial, conflicting, unsupported, service-unavailable, confidential-lineage, and unreviewed exact-ID cases.
- Never export confidential source origin, raw row IDs, source SKUs, private lineage, or unapproved mappings.
- Disclose destination failures and automation limitations.
- Keep exact source-direct opening separate from alternate-supplier translation.

### Strong hypothesis

A reviewed, field-complete packet is safer and more useful than destination-specific query syntax because it preserves the public specification without implying listing, stock, price, or equivalence.

### Opportunity / gold idea

Use a two-path completion model:

1. **Source-direct exact-ID path:** open a user-supplied exact identifier directly, preserving it without translation.
2. **Alternate-supplier handoff path:** provide an editable public-specification packet for manual supplier search after review.

### Nice-to-have

- Copy or edit the complete public specification packet before leaving the product.
- Make omitted fields and destination limitations visible at handoff time.

### Open question

Whether reviewed users find the packet useful as a secondary completion action remains unvalidated; no direct user validation was performed.

### Risk

- A fallback can silently alter pitch, accept partial input, misclassify a bearing as a custom fastener, or expose unsafe links.
- Destination-specific links can imply unsupported equivalence or availability.
- Automation denial can be mistaken for no result unless explicitly disclosed.
- Exported lineage, source identifiers, or unapproved mappings can disclose confidential information.

### Rejected

- Supplier handoff as a core POC capability.
- Automatic handoff from partial, conflicting, unsupported, unavailable, confidential-lineage, or unreviewed exact-ID states.
- Treating destination-specific syntax as superior to manual search.
- Translating a user-supplied exact source identifier into an alternate-supplier claim.
- Claims of price, stock, listing, or equivalence.

## Case matrix

| Case | Classification | Expected outcome |
|---|---|---|
| Unique configuration, reviewed, public fields complete | Allowed secondary action | Show editable packet; preserve all 8 public fixture fields |
| User-supplied exact identifier, reviewed | Source-direct only | Open the source directly and preserve the exact ID with zero translation |
| Partial configuration | Blocked | Do not compile or export |
| Conflicting configuration | Blocked | Do not compile or export |
| Unsupported input | Blocked | Do not emit a substitute or custom fastener |
| Supplier/service unavailable or automation denied | Blocked/disclosed | Report the limitation; do not infer product absence |
| Confidential-lineage case | Blocked | Export no confidential source origin, IDs, SKUs, lineage, or mappings |
| Exact identifier not reviewed | Blocked | Require review before source-direct opening |
| Alternate-supplier destination search | Manual-support only | Provide the public packet without listing, availability, or equivalence claims |
| Unsafe or malformed destination link | Blocked | Do not expose or open the link |

## Handoff gates

All gates must pass before showing alternate-supplier handoff:

1. **Unique selection:** exactly one configuration is selected.
2. **Review:** the configuration has been explicitly reviewed.
3. **Completeness:** required public fields are present, including pitch, drive, and standard where applicable.
4. **Consistency:** no conflicting values are present.
5. **Support:** the input is a supported part/configuration type.
6. **Service state:** required handoff services are available; failures are disclosed.
7. **Confidentiality:** the output contains no confidential lineage, raw row IDs, source SKUs, private source origin, or unapproved mappings.
8. **Claim safety:** the output makes no price, stock, listing, or equivalence claim.
9. **Link safety:** the destination link is safe and does not rely on an unsafe fallback.
10. **Path separation:** source-direct exact-ID opening is not represented as alternate-supplier translation.

Any failed gate blocks export.

## Prototype verdict

The browser-exercised prototype validates the shape of a **secondary, gated handoff**, but not a core POC feature. Its packet path is the strongest element because it preserves all 8 public fixture fields and excludes confidential lineage and commercial claims. The generic compiler is not ready for handoff because it preserves only about 5 of 8 fields and omits pitch, drive, and standard. Destination-specific syntax did not demonstrate a dependable advantage over manual search, while direct opening is appropriate for a user-supplied exact source identifier such as `91290A115`.

Proceed only with the reviewed, editable packet and strict blocking gates. Keep direct exact-ID opening separate. Do not ship live fallback behavior that mutates, partially compiles, misclassifies, or exposes unsafe links.
