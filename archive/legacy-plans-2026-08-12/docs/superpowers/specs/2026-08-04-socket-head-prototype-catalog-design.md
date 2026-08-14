# Socket-Head Prototype Catalog Design

## Goal

Make the validated `data/socket-head-cap-screws.csv` dataset searchable in the PartSource prototype, beginning with exact McMaster part-number lookup and specification search.

## Scope

- Import only the 7,864 socket-head-cap-screw rows.
- Preserve the existing standards-derived catalog and decoder.
- Treat each imported row as a searchable prototype configuration.
- Keep imported entries out of static part-page and embed-page generation.
- Do not add prices, stock, supplier listings, offers, equivalence claims, or ordering behavior.

## Data shape

The source CSV is converted at build time into a typed, browser-loadable catalog artifact. Each row keeps its McMaster part number when present, source SKU, title, dimensions, material, drive, threading, and standards fields. Rows missing a source SKU, thread size, length, or material are rejected; rows without a McMaster number remain searchable by their source SKU and specifications.

The converted rows use a stable `PROTO-SHCS-<mcmaster_pn-or-source-sku>` application identity, while a present McMaster number is an exact searchable reference. This avoids presenting an external identifier as a PartSource-owned catalog SKU.

## Runtime behavior

The existing decoder combines the standards catalog and the prototype socket catalog into one search index. An exact imported McMaster number resolves to its prototype configuration. Specification/title queries can suggest imported rows. Unknown input still uses the existing bounded decoder.

Imported entries show a clear prototype-configuration notice and retain existing supplier-search handoffs. They never show an offer, listing, price, or verified-equivalent state.

## Route behavior

Imported entries work through the existing client route but do not receive generated static HTML pages or sitemap entries. This avoids creating 15,728 extra output pages for the two part/embed routes.

## Tests

Tests are written before production code. They cover CSV conversion/validation, exact McMaster lookup, specification search, prototype metadata, no offers, and exclusion from static-page generation. Existing decoder, truth, typecheck, build, and browser checks remain required.

## Future sequence

After Phase 1 is verified, use the same conversion and catalog boundary for hex-head screws, then rounded-head screws. A broader McMaster/Octopart-style discovery product requires separately approved source rights and a reviewed product-contract change before it can claim supplier listings, offers, inventory, prices, or equivalents.
