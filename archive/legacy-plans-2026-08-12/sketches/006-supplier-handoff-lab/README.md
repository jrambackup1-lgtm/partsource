# Supplier handoff lab

**Status:** Validation fixture only. Not production UI, catalog evidence, a released configuration, or a sourcing product.

## Question

Can PartSource preserve a reviewed configuration through a supplier/search handoff without implying a listing, offer, equivalent, stock state, price, availability, or compatibility?

## What this prototype exercises

- User-supplied exact McMaster identifier: direct source opening stays separate from configuration translation.
- Fully specified configuration fixture: transparent generic query, three destination-specific query variants, and a copyable fact packet.
- Partial requirement, conflicting pitch, unsupported family, unavailable service, and confidential-source boundary: supplier opening is blocked.
- Every destination exposes the outgoing query before navigation and says that results require independent verification.

## Fixture boundary

The M3 fixture reflects the repository's corrected test facts but is labeled as a compiler fixture. It is not evidence that the current catalog has an approved public release or that any supplier carries a matching item. The source-origin field is deliberately absent.

## Run

Open `index.html` directly in a browser. Switch through all seven cases. In the fully specified case, switch handoff formats and destination rows. In the exact-ID case, inspect the source-direct action. Confirm all other cases have no supplier links.

## Intended decision

If retained, supplier handoff is a secondary completion action after a uniquely selected, active, reviewed configuration. The default format is a visible/copyable fact packet plus an editable query preview. Destination-specific translation remains experimental. Exact user-supplied identifiers should offer the originating supplier separately. Partial, conflict, unsupported, unavailable, and confidentiality-unsafe states fail closed.
