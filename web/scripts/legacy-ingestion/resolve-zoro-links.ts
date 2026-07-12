/**
 * Zoro product-link resolver — build-time snapshot.
 *
 * For every part in the standards catalog, searches Zoro and picks the product
 * whose title provably matches the part's spec (thread + pitch + length +
 * family are hard requirements; finish/material are scored). Writes the result
 * to src/data/zoro-links.json so the deployed site links straight to real
 * product pages with real prices — no runtime scraper dependency.
 *
 * Reads only the server-rendered search cards Zoro publishes for SEO (same
 * posture as research/data-sourcing-decision.md §4.1). Throttled ~1.3s/request,
 * resumable: re-running skips parts already resolved in the output file.
 *
 * Usage:  PARTSOURCE_ENABLE_LEGACY_INGESTION=1 npx tsx scripts/legacy-ingestion/resolve-zoro-links.ts [--limit N] [--force]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, Part } from '../../src/lib/decoder';

const safetyWarning = '[legacy ingestion] NON-PRODUCTION experiment; sanctioned-source use only.';
if (process.env.PARTSOURCE_ENABLE_LEGACY_INGESTION !== '1') {
  console.error(`${safetyWarning} Set PARTSOURCE_ENABLE_LEGACY_INGESTION=1 to opt in.`);
  process.exit(1);
}
console.warn(safetyWarning);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.resolve(__dirname, '../../src/data/zoro-links.json');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const DELAY_MS = 1300;

// ---------------------------------------------------------------------------
// Output shape
// ---------------------------------------------------------------------------
export interface ZoroLink {
  url: string;
  name: string;
  brand: string;
  /** Pack price in USD as listed. */
  price: number;
  packSize: number;
  /** Per-piece price (listed /ea when present, else price/packSize). */
  unitPrice: number;
  capturedAt: string; // YYYY-MM-DD
}

interface Snapshot {
  generatedAt: string;
  links: Record<string, ZoroLink>;
  misses: Record<string, string>; // partNumber -> reason (audit only)
}

// ---------------------------------------------------------------------------
// Search-card parsing
// ---------------------------------------------------------------------------
interface Card {
  url: string;
  title: string;
  brand: string;
  price: number;
  packSize: number;
  unitPrice: number;
  index: number;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function parseCards(html: string): Card[] {
  const chunks = html.split('data-za="search-product-card"').slice(1);
  const cards: Card[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const hrefM = chunk.match(/href="([^"]*\/i\/(G\d+)\/)"/);
    const titleM = chunk.match(/title="([^"]*)"/);
    if (!hrefM || !titleM) continue;

    const priceBlock = chunk.split('data-za="product-price"')[1] ?? '';
    const priceM = priceBlock.match(/\$([\d,]+(?:\.\d+)?)/);
    const price = priceM ? parseFloat(priceM[1].replace(/,/g, '')) : 0;

    const title = decodeEntities(titleM[1]);
    const pkFromPrice = priceBlock.match(/\/pk\s*(\d+)/i);
    const pkFromTitle = title.match(/(\d+)\s*PK\b/i);
    const packSize = pkFromPrice
      ? parseInt(pkFromPrice[1])
      : pkFromTitle
        ? parseInt(pkFromTitle[1])
        : 1;

    const eaM = priceBlock.match(/\$([\d.]+)\/ea/i);
    const unitPrice = eaM ? parseFloat(eaM[1]) : packSize > 0 ? price / packSize : price;

    const brandM = chunk.match(/data-za="product-brand"[^>]*>(?:<!--\[-->)?\s*([^<]+?)\s*</);

    cards.push({
      url: new URL(hrefM[1], 'https://www.zoro.com').toString(),
      title,
      brand: brandM ? decodeEntities(brandM[1]) : '',
      price,
      packSize,
      unitPrice: Math.round(unitPrice * 10000) / 10000,
      index: i,
    });
  }
  return cards;
}

// ---------------------------------------------------------------------------
// Spec matching — hard requirements first, then score
// ---------------------------------------------------------------------------
const COARSE_PITCH: Record<string, number> = {
  M2: 0.4, 'M2.5': 0.45, M3: 0.5, M4: 0.7, M5: 0.8,
  M6: 1.0, M8: 1.25, M10: 1.5, M12: 1.75,
};

function familyOf(part: Part): string {
  return part.partNumber.split('-')[0]; // DIN912, DIN7991, ISO7380, DIN933, DIN934, DIN985, DIN125, DIN127
}

function isStainless(part: Part): boolean {
  return part.material.toLowerCase().includes('stainless');
}

/** Returns a score (higher = better) or null when the card is not this part. */
function matchScore(part: Part, card: Card): number | null {
  const t = card.title;
  const tl = t.toLowerCase();
  const family = familyOf(part);

  // --- thread (required) ---------------------------------------------------
  // Titles use "M4-0.70", "M4-0.7", "M4 x 0.7", or bare "M4".
  const threadEsc = part.thread.replace('.', '\\.');
  const threadRe = new RegExp(`\\b${threadEsc}(?:[\\s]*[-x][\\s]*([\\d.]+))?\\b`, 'i');
  const thM = t.match(threadRe);
  if (!thM) return null;
  // Pitch, when stated, must be the coarse pitch (catalog is coarse-only).
  if (thM[1]) {
    const pitch = parseFloat(thM[1]);
    const coarse = COARSE_PITCH[part.thread];
    if (coarse && Math.abs(pitch - coarse) > 0.011) return null;
  }

  // --- length (required for screws) ----------------------------------------
  if (part.length !== 'N/A') {
    const lenMm = parseInt(part.length);
    const lenRe = new RegExp(`\\b${lenMm}\\s*mm\\b`, 'i');
    if (!lenRe.test(t)) return null;
  }

  // --- family/type (required) ----------------------------------------------
  const reject = (re: RegExp) => re.test(tl);
  switch (family) {
    case 'DIN912':
      if (!/socket head cap screw/.test(tl)) return null;
      if (reject(/low profile|12.point|flange|drilled|left.hand|shoulder|set screw|self.tap/)) return null;
      break;
    case 'DIN7991':
      if (!(/flat/.test(tl) && /(socket|hex drive|allen)/.test(tl) && /screw/.test(tl))) return null;
      if (reject(/self.tap|drilling|undercut/)) return null;
      break;
    case 'ISO7380':
      if (!(/button/.test(tl) && /screw/.test(tl))) return null;
      if (reject(/flange|self.tap|drilling/)) return null;
      break;
    case 'DIN933':
      if (!/hex\s*(head)?\s*(cap)?\s*(screw|bolt)/.test(tl)) return null;
      if (reject(/socket|flange|serrated|lag|tap(ping)?|shoulder|struct/)) return null;
      break;
    case 'DIN934':
      if (!/hex nut/.test(tl)) return null;
      if (reject(/lock|jam|flange|coupling|cap nut|castle|slotted|wing|acorn|weld|machine screw/)) return null;
      break;
    case 'DIN985':
      if (!(/lock\s*nut/.test(tl) && /nylon/.test(tl))) return null;
      break;
    case 'DIN125':
      if (!/flat washer/.test(tl)) return null;
      if (reject(/fender|lock|sealing|square|structural|extra thick/)) return null;
      break;
    case 'DIN127':
      if (!/lock washer/.test(tl)) return null;
      if (reject(/tooth|internal|external/)) return null;
      break;
    default:
      return null;
  }

  // --- material / finish ----------------------------------------------------
  const stainlessTerms = /stainless|18-8|\ba2\b|\ba4\b|\b304\b|\b316\b/;
  const wrongMaterial = /brass|aluminum|copper|titanium|plastic|polymer/;
  if (wrongMaterial.test(tl)) return null;
  if (family === 'DIN125' || family === 'DIN127') {
    if (/nylon/.test(tl)) return null; // full-nylon washers
  }
  if (isStainless(part)) {
    if (!stainlessTerms.test(tl)) return null;
    if (/\b316\b|\ba4\b/.test(tl)) return null; // A4/316 is a different grade than A2
  } else {
    if (stainlessTerms.test(tl)) return null;
  }

  // --- score ----------------------------------------------------------------
  let score = 10 - card.index * 0.1; // earlier results are more relevant
  const finish = part.finish.toLowerCase();
  if (finish.includes('black') && /black/.test(tl)) score += 3;
  if (finish.includes('zinc') && /zinc/.test(tl)) score += 3;
  if (/class 12\.9|12\.9/.test(tl) && part.appNote.includes('12.9')) score += 1;
  if (/class 10\.9|10\.9/.test(tl) && part.appNote.includes('10.9')) score += 1;
  if (/class 8\.8|8\.8|grade 8\.8/.test(tl) && part.appNote.includes('8.8')) score += 1;
  if (/\bdin 912|iso 4762/.test(tl) && family === 'DIN912') score += 2;
  if (/fully threaded/.test(tl) && family === 'DIN933') score += 1;
  // Prefer sane pack sizes a prototyping buyer would actually order.
  if (card.packSize >= 5 && card.packSize <= 100) score += 1;
  if (card.packSize > 500) score -= 1;
  if (card.price <= 0) score -= 5; // no listed price — last resort
  return score;
}

// ---------------------------------------------------------------------------
// Search query per part (tighter than the UI's buildSupplierQuery)
// ---------------------------------------------------------------------------
function queryFor(part: Part): string {
  const bits: string[] = [part.thread];
  if (part.length !== 'N/A') bits.push(`x ${parseInt(part.length)}mm`);
  const typeWords: Record<string, string> = {
    DIN912: 'socket head cap screw',
    DIN7991: 'flat head socket cap screw',
    ISO7380: 'button head socket cap screw',
    DIN933: 'hex head cap screw fully threaded',
    DIN934: 'hex nut',
    DIN985: 'nylon insert lock nut',
    DIN125: 'flat washer',
    DIN127: 'split lock washer',
  };
  bits.push(typeWords[familyOf(part)] ?? part.type.toLowerCase());
  bits.push(isStainless(part) ? 'stainless steel' : part.finish.toLowerCase().replace('-', ' '));
  return bits.join(' ');
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function fetchSearch(query: string): Promise<string> {
  const url = `https://www.zoro.com/search?q=${encodeURIComponent(query)}`;
  for (let attempt = 1; attempt <= 2; attempt++) {
    const res = await fetch(url, {
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (res.status === 200) return res.text();
    if (res.status === 403 || res.status === 429) {
      throw new Error(`Zoro blocked us (${res.status}) — stopping so we stay polite.`);
    }
    if (attempt === 1) await sleep(5000);
    else throw new Error(`Zoro returned ${res.status} for ${url}`);
  }
  return '';
}

async function main() {
  const args = process.argv.slice(2);
  const limitArg = args.indexOf('--limit');
  const limit = limitArg >= 0 ? parseInt(args[limitArg + 1]) : Infinity;
  const force = args.includes('--force');

  let snap: Snapshot = { generatedAt: '', links: {}, misses: {} };
  if (fs.existsSync(OUT_PATH) && !force) {
    snap = JSON.parse(fs.readFileSync(OUT_PATH, 'utf-8'));
  }

  const todo = db.filter(p => !(p.partNumber in snap.links) && !(p.partNumber in snap.misses));
  console.log(`Catalog: ${db.length} parts. Resolved: ${Object.keys(snap.links).length}. ` +
    `Known misses: ${Object.keys(snap.misses).length}. To do: ${Math.min(todo.length, limit)}.`);

  let done = 0;
  const save = () => {
    snap.generatedAt = new Date().toISOString();
    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, JSON.stringify(snap, null, 1));
  };

  for (const part of todo) {
    if (done >= limit) break;
    const q = queryFor(part);
    try {
      const html = await fetchSearch(q);
      const cards = parseCards(html);
      const scored = cards
        .map(c => ({ c, s: matchScore(part, c) }))
        .filter((x): x is { c: Card; s: number } => x.s !== null)
        .sort((a, b) => b.s - a.s);

      if (scored.length > 0) {
        const best = scored[0].c;
        snap.links[part.partNumber] = {
          url: best.url,
          name: best.title,
          brand: best.brand,
          price: best.price,
          packSize: best.packSize,
          unitPrice: best.unitPrice,
          capturedAt: new Date().toISOString().slice(0, 10),
        };
        console.log(`✓ ${part.partNumber}  →  ${best.title.slice(0, 80)}  $${best.price} (pk ${best.packSize})`);
      } else {
        snap.misses[part.partNumber] = cards.length === 0 ? 'no results' : 'no confident match';
        console.log(`✗ ${part.partNumber}  (${snap.misses[part.partNumber]}; ${cards.length} cards) q="${q}"`);
      }
    } catch (err: any) {
      console.error(`! ${part.partNumber}: ${err.message}`);
      if (/blocked/.test(err.message)) { save(); process.exit(2); }
      snap.misses[part.partNumber] = `error: ${err.message}`;
    }
    done++;
    if (done % 10 === 0) save();
    await sleep(DELAY_MS + Math.random() * 400);
  }
  save();
  console.log(`Done. Resolved ${Object.keys(snap.links).length}/${db.length}; misses ${Object.keys(snap.misses).length}.`);
}

main();
