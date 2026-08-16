# PartSource — Octopart-for-Hardware v1 Acceleration Plan

**Status:** Approved by Jay 2026-07-21 (verbal: "ship ready, reference Octopart, no demo").
**Relationship to master plan:** Subordinate to `research/master-plan.md`. Pulls forward **MP-5.4 (real listings), MP-5.5 (offer display), and a single-supplier slice of MP-9 (sanctioned adapter)** from later phases, for **Zoro only**, without violating the no-scraping / honesty guardrails.
**Contract:** Must stay compliant with `research/product-contract.md`. A verified supplier product URL + price captured with a retrieval timestamp is a real Offer under MP-5.5 — not a fabricated one.

## The gap being closed

Today a part page ends in 5 spec-derived **keyword-search links** to supplier sites. They return wrong/broken results (Bolt Depot 404s, Zoro returns 8,000 unrelated items). That is not a buyable product. Octopart's job — for us, for mechanical hardware — is: **enter a part → see real supplier listings (their SKU, real price, deep link to the exact product page, buy) side by side.**

## Decision (Jay, 2026-07-21)

**Manual-seed the finite ~585-part catalog to real Zoro product pages now → widen with sanctioned affiliate feeds (Zoro via CJ/FlexOffers, later Misumi/RS APIs). No scraping.** Rationale: catalog is finite (bounded one-time job), Octopart itself aggregates feeds not scrapes, and manual verification is contract-clean.

## What "ship ready v1" means (acceptance)

1. **Real data model.** Each `Part` carries `offers: Offer[]`, where an Offer = `{ distributor, distributorSku, productUrl, price, currency, uom, packQty, inStock?, retrievedAt }`. No offer without `productUrl` + `retrievedAt`.
2. **Exact deep links.** Clicking an offer opens the **exact supplier product page** (not a search), wrapped in the affiliate link where one exists (Zoro/CJ).
3. **Octopart-style compare UI on `/parts/:id`:** each distributor as an **expandable row** showing their SKU, price/ea + price/pack, quantity selector, and a primary **"Buy on {distributor}"** CTA. Multiple distributors stack for comparison.
4. **Honest fallback.** Parts not yet seeded show the existing spec-search links, explicitly labeled "search, not an offer" (MP-5.4). No fabricated SKUs, prices, or stock — ever.
5. **Related configurations** move **below a divider**, de-emphasized, after the buy section.
6. **Timestamps + provenance.** Every displayed price shows "as of {date}" and its source. Contract MP-5.5 fields present.
7. Tests + typecheck + build pass. Runs on localhost and shows a real buyable part end to end.

## Build slices (for the executing Opus agent)

- **S1 — Offer data model + provenance.** Add the `Offer` type and `offers` field to `Part` in `web/src/lib/decoder.ts`; a seed file `web/src/data/offers.*` (JSON/TS) keyed by our part number. Keep the 2 existing McMaster crosses.
- **S2 — Zoro affiliate deep-link helper.** Real Zoro product URL + affiliate wrapper. Config the affiliate/publisher ID as an env/const placeholder Jay fills in.
- **S3 — Verified seed.** Populate offers ONLY for parts genuinely verified (start with the 2 crossed + any the agent can verify via web lookup). Do NOT invent. Everything else uses honest fallback. Record `retrievedAt`.
- **S4 — Compare UI.** Rebuild the supplier section of `/parts/:id`: expandable distributor rows, SKU, price/ea + /pack, qty selector, Buy CTA, "as of" timestamp. Related configs below a divider.
- **S5 — Honest fallback + labels.** Unseeded parts: spec-search links clearly labeled searches. No commercial claim without a sourced offer.
- **S6 — Feed ingestion path (design, stub ok).** Define the adapter contract so a Zoro/CJ product feed can bulk-populate `offers` later (MP-9.2 shape). Real feed wiring can follow once Jay has CJ access.
- **S7 — Tests.** Offer-model integrity (reject offer missing url/timestamp), UI render, no-fabrication guard. Wire into `npm test`.

## Guardrails the agent must not cross

- No scraping, no fabricated SKUs/prices/stock, no describing a search URL as an offer.
- Own part number stays the page identity; distributor SKU is a listing field.
- Every price carries source + timestamp.
- Keep changes surgical; match existing style; don't rewrite the decoder catalog generation.

## Out of scope for v1

Multi-supplier breadth beyond Zoro (add via feeds later), live real-time pricing, cart/checkout ownership, BOM aggregate-cart, SEO expansion. These stay in their master-plan phases.
