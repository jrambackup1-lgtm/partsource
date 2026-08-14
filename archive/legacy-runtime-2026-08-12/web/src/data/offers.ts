import type { Offer } from '../lib/decoder';

// Commercial offer data is intentionally disabled for the current POC.
// `research/product-contract.md` and `research/data-source-register.md` prohibit
// supplier commercial records, prices, stock, availability, or buy links
// until a sanctioned source is approved and wired through a
// reviewed publication pipeline.

export const OFFERS: Record<string, Offer[]> = {};

/** Offers for one of our catalog part numbers. Always empty in the POC. */
export function getOffersForPart(_partNumber: string): Offer[] {
  return [];
}
