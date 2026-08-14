import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { OFFERS, getOffersForPart } from '../src/data/offers';
import { db } from '../src/lib/decoder';

const webRoot = path.resolve(import.meta.dirname, '..');
const readWeb = (file: string) => fs.readFileSync(path.join(webRoot, file), 'utf8');

const partDetail = readWeb('src/pages/PartDetail.tsx');
const home = readWeb('src/pages/Home.tsx');
const header = readWeb('src/components/Header.tsx');
const decoder = readWeb('src/lib/decoder.ts');
const offersSource = readWeb('src/data/offers.ts');

assert.deepEqual(OFFERS, {}, 'POC must ship no seeded supplier offers');
assert.equal(getOffersForPart('DIN912-M3X10').length, 0, 'offer lookup must fail closed');
assert.equal(db.some(part => (part.offers?.length ?? 0) > 0), false, 'catalog parts must not carry offers');
assert.equal(db.every(part => part.mcmasterPrice === 0), true, 'fallback catalog must not expose heuristic prices');

for (const [name, source] of Object.entries({ partDetail, home, decoder })) {
  assert.doesNotMatch(source, /Buy on|Supplier Offers|Price \/|In stock|Check stock|affiliate|ZORO_AFFILIATE|offerBuyUrl/i, `${name} contains disabled commercial UI/source`);
}
for (const [name, source] of Object.entries({ partDetail, home, header })) {
  assert.doesNotMatch(source, /(?<!No )verified equivalent|approved alternate|replacement|same item|in stock|buy now|quote now/i, `${name} contains banned public result-state copy`);
}
assert.doesNotMatch(offersSource, /ZORO_AFFILIATE|offerBuyUrl|https:\/\/www\.zoro\.com|\d+\.\d{2}/i, 'offer module must not ship seeded commercial data');

assert.doesNotMatch(home, /Request BOM Quote|Request sourcing help|mailto:|Please quote the following BOM/i, 'BOM quote flow must not ship');
assert.match(home, /User Unit Cost/);
assert.match(home, /User Extended Cost/);
assert.match(home, /Costs are only entered or imported by you/);
assert.match(partDetail, /These links run supplier-site <strong>searches<\/strong>, not offers or listings/);

console.log('Commercial offer/price surface checks passed.');
