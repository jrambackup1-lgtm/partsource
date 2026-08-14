import type { Offer } from './decoder';

// ---------------------------------------------------------------------------
// Sanctioned supplier feed adapter contract (S6 / MP-9.2 shape) — DESIGN STUB
// ---------------------------------------------------------------------------
// Defines the shape a Zoro/CJ (or later Misumi/RS) product feed must be mapped
// into so it can bulk-populate `offers` the same way the manual seed does.
// Real feed wiring is OUT OF SCOPE for v1 — this only fixes the contract so the
// manual seed and a future feed are interchangeable. No network code here.
//
// Guardrails carried into the feed path:
//   - A feed row becomes an Offer ONLY if it resolves to one of OUR catalog
//     part numbers AND carries a real product URL + price. Unresolved or
//     price-less rows are dropped, never guessed.
//   - Every emitted Offer stamps `retrievedAt` from the feed's freshness field.

/** One raw row from a supplier product feed, before mapping to our catalog. */
export interface FeedProduct {
  /** Distributor name, e.g. "Zoro". */
  distributor: string;
  /** Distributor SKU / item number. */
  sku: string;
  /** Manufacturer part number, used to resolve to our catalog part. */
  mpn?: string;
  /** Exact product page URL. */
  productUrl: string;
  price: number;
  currency: string;
  uom: string;
  packQty: number;
  inStock?: boolean;
  /** ISO date the feed asserts this row is fresh as of. */
  retrievedAt: string;
}

/**
 * Resolve a feed row to one of our catalog part numbers, or null if it cannot
 * be matched with evidence. Implemented by the caller (e.g. via MPN cross
 * table); a stub here keeps the contract honest — no fuzzy guessing.
 */
export type PartNumberResolver = (row: FeedProduct) => string | null;

/** Result of ingesting a feed: offers keyed by our part number, plus dropped rows. */
export interface FeedIngestResult {
  offersByPart: Record<string, Offer[]>;
  /** Rows that could not be resolved or were missing required fields. */
  dropped: { row: FeedProduct; reason: string }[];
}

/**
 * Map raw feed rows into validated Offers keyed by our part number. Drops any
 * row that fails resolution or is missing a real URL/price/timestamp. Pure and
 * deterministic — the same guarantee the manual seed gives.
 */
export function ingestFeed(rows: FeedProduct[], resolve: PartNumberResolver): FeedIngestResult {
  const offersByPart: Record<string, Offer[]> = {};
  const dropped: FeedIngestResult['dropped'] = [];

  for (const row of rows) {
    const partNumber = resolve(row);
    if (!partNumber) {
      dropped.push({ row, reason: 'unresolved to catalog part number' });
      continue;
    }
    if (!row.productUrl || !row.retrievedAt || !(row.price > 0) || !(row.packQty > 0)) {
      dropped.push({ row, reason: 'missing real productUrl/price/packQty/retrievedAt' });
      continue;
    }
    const offer: Offer = {
      distributor: row.distributor,
      distributorSku: row.sku,
      productUrl: row.productUrl,
      price: row.price,
      currency: row.currency,
      uom: row.uom,
      packQty: row.packQty,
      inStock: row.inStock,
      retrievedAt: row.retrievedAt,
      note: `Ingested from ${row.distributor} product feed`,
    };
    (offersByPart[partNumber] ??= []).push(offer);
  }

  return { offersByPart, dropped };
}
