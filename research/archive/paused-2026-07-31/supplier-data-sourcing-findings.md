# Supplier Data Sourcing — Research Findings (2026-07-21)

Feeds/APIs to populate real `offers[]` (deep link + SKU + price + availability) at scale, no scraping. Supports `research/octopart-v1-acceleration.md`.

## Winner: CJ Affiliate Product Feed (Zoro)

- **Zoro** = 4% commission, 30-day cookie, 1M+ industrial products, run through **CJ Affiliate**.
- CJ gives every account a **free personal access token** for its **GraphQL Product Feed API** (`products` / `productFeeds` queries). A product feed record includes **SKU, price, product link (deep link), category, availability**.
- CJ also has **Deep Link Automation / Deep Link Generator** — wraps any advertiser product URL in the affiliate link automatically.
- **This single path solves everything blocking us:** real deep links, real SKUs, real prices, all ~1M Zoro products (covers our 585 + far beyond), affiliate attribution built in, and it's the advertiser's own sanctioned feed — so it **also defeats the Zoro 403** (we consume CJ's feed, never fetch zoro.com).
- **Gate:** join CJ (free) → apply to Zoro's program → once approved, pull their feed. Maps 1:1 onto the `feedAdapter.ts` contract already built.

## Secondary distributors (add later via feeds)

- **Grainger** — 3% affiliate via **FlexOffers**; has ERP/API connectivity. Broad MRO + fasteners. (Acklands-Grainger = Canada, also FlexOffers.)
- **MSC / Fastenal / Bolt Depot / McMaster / Misumi** — no public consumer affiliate/API feed found; Misumi is configurable-part heavy. Deprioritize.
- **RS, Farnell/element14, Würth Elektronik, oemsecrets** — real APIs but **electronic** components, not mechanical fasteners. Not useful for us.

## Dead end: Amazon

- **PA-API 5.0 is being deprecated May 15 2026 and is no longer accepting new customers** → forced onto the new **Creators API**. Fasteners exist on Amazon broadly, but a brand-new integration is now uncertain/blocked. Skip for v1.

## Octopart reference (validates our approach)

- Octopart aggregates pricing/availability from **authorized distributors + data partners via API partnerships** (now the Nexar GraphQL API). It does **not scrape**. Confirms: feed/partnership aggregation is the correct model.

## Recommended sequence

1. Jay joins CJ (free), applies to **Zoro** program.
2. On approval, wire `feedAdapter.ts` to CJ's GraphQL `products` feed → auto-populate `offers[]` for the whole catalog with real deep links + SKUs + prices (retires the manual 2-part seed).
3. Add **Grainger via FlexOffers** as second distributor → true side-by-side compare = the Octopart experience.
4. Everything else stays honest search-fallback until a sanctioned feed exists.

Sources: CJ Developer Portal (developers.cj.com/docs/data-imports/product-feeds, /graphql/reference/Product Feed), junction.cj.com deep-link articles, linkclicky/uppromote Zoro program pages, affiliatejoin Grainger, webservices.amazon.com PA-API deprecation notice, octopart.com/partner-solutions + nexar.com/api.
