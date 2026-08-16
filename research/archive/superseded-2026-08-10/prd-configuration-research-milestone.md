> **HISTORICAL — superseded 2026-08-10. Do not use as current product direction.**

# Product Requirements Document — PartSource POC

> **Status note (2026-08-09):** This describes the narrower completed configuration-research milestone. It is an input to the active family-first product exploration, not the final brief for the next POC. See `.wayfinder/poc-ship/poc-ship-map.md`.

## 1. What this is

PartSource is a hardware sourcing research assistant.

It helps a user find a hardware configuration and open supplier searches.

It does not tell the user that one supplier part is equal to another supplier part.

## 2. Problem

Engineers need fast help when they search for screws and other hardware.

They may start with:

- A McMaster part number.
- A plain search like `M4 screws`.
- A selected screw type, size, material, or finish.

They do not only need a McMaster alternative lookup.

That path is legally risky if we imply equivalence, replacement, or approval.

## 3. POC goal

Ship a small demo where the user can:

1. Search by McMaster number, generic text, or guided selection.
2. See matching hardware configurations.
3. Open supplier search destinations such as McMaster, Zoro, and Grainger.
4. Add a configuration to a named local BOM.
5. Save the BOM in the browser.
6. Export the BOM.

## 4. Main user flows

### Flow A — McMaster number

- User enters a McMaster number.
- App uses it as a search clue.
- App shows a configuration if known.
- App shows supplier search links.
- User verifies on supplier sites.

### Flow B — plain search

- User types `M4 screws` or similar.
- App shows matching configurations.
- User filters by size, material, finish, head, drive, or standard.
- App shows supplier search links.

### Flow C — guided selection

- User selects screw family/type.
- User selects size and attributes.
- App builds a configuration.
- App shows supplier search links.

## 5. What the app can say

Public result states:

- `configuration-match`: known local configuration found.
- `configuration-search`: generic text or guided selection can search configurations.
- `supplier-search-destination`: supplier-site search URL built from configuration facts.
- `unsupported-input`: PartSource does not support this input yet.
- `invalid-input`: input is malformed or too vague.
- `search-unavailable`: safe search data or URL template is unavailable.

McMaster numbers are search clues only.
They are not a McMaster API path.
They are not an equivalent lookup.

Safe words:

- Configuration.
- Candidate.
- Search result.
- Supplier search.
- Search this configuration on supplier site.
- Verify on supplier site before buying.

Banned words unless legal/source approval exists:

- Equivalent.
- Verified equivalent.
- Approved alternate.
- Replacement.
- Interchangeable.
- Same item.
- In stock.
- Best price.
- Available.
- Buy now.
- Quote now.

## 6. Data rules

Allowed:

- Standards-first configuration data.
- User-entered data.
- Internal demo seed data.
- Approved supplier names.
- Approved supplier search URL templates.

Not allowed:

- McMaster API.
- McMaster scraping.
- Zoro/Grainger/supplier scraping.
- Copied supplier catalog data without approval.
- Price, stock, lead time, or order claims without sanctioned source data.

## 7. Configuration fields

A configuration can store:

- Hardware family.
- Type.
- Thread size.
- Thread pitch.
- Length.
- Head type.
- Drive type.
- Material.
- Finish.
- Strength grade.
- Standard.
- Source/provenance note.

## 8. Supplier handoff

Supplier links are search handoffs only.

Example safe copy:

`Search this configuration on Grainger.`

Unsafe copy:

`Grainger equivalent for this McMaster part.`

## 9. BOM

The BOM is browser-local for the POC.

The user can:

- Create a named BOM.
- Add a configuration snapshot.
- Edit quantity.
- Add notes.
- Add user-entered cost.
- Delete items.
- Save locally.
- Export.
- Import/restore if supported.

User cost is user data. It is not a PartSource price.

## 10. Demo pass criteria

The POC passes when:

- McMaster-number input works.
- `M4 screws` search works.
- Guided screw selection works.
- Configuration detail page is clear.
- Supplier search handoffs work.
- Named local BOM works.
- BOM export works.
- No banned claim appears.
- No price, stock, buy, quote, or availability appears.
- Tests prove the above.

## 11. Out of scope

- McMaster API.
- Supplier scraping.
- Part equivalence.
- Approved alternates.
- Live supplier listings.
- Prices.
- Stock.
- Availability.
- Buy flow.
- Quote flow.
- Accounts.
- Checkout.
- Bulk SEO.

