import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { generateStaticPartPages, renderPartPage } from './generate-static-part-pages';
import type { Part } from '../src/lib/decoder';

const template = `<!doctype html><html><head><title>PartSource.io | Hardware Sourcing</title><link rel="canonical" href="https://jrambackup1-lgtm.github.io/partsource/" /></head><body></body></html>`;
const part: Part = {
  partNumber: 'DIN912-M3X10',
  category: 'Fasteners',
  type: 'Socket Head Cap Screw',
  thread: 'M3',
  pitch: '0.5 mm',
  length: '10 mm',
  material: 'Alloy Steel',
  finish: 'Black Oxide',
  drive: 'Hex',
  standard: 'DIN 912 / ISO 4762',
  mcmasterPrice: 0.2,
  appNote: 'General machine assembly.',
};

const html = renderPartPage(template, part);
const canonical = 'https://jrambackup1-lgtm.github.io/partsource/parts/DIN912-M3X10';

assert.match(html, /<title>DIN912-M3X10 Socket Head Cap Screw \| PartSource<\/title>/);
assert.match(html, /<meta name="description" content="DIN912-M3X10: M3 Socket Head Cap Screw, 10 mm, Alloy Steel, DIN 912 \/ ISO 4762\. General machine assembly\." \/>/);
assert.match(html, new RegExp(`<link rel="canonical" href="${canonical}" />`));
assert.match(html, /<script id="json-ld-product" type="application\/ld\+json">/);
assert.match(html, /<meta name="robots" content="noindex,follow" \/>/);
assert.match(html, /"sku":"DIN912-M3X10"/);
assert.doesNotMatch(html, /AggregateOffer|"offers"|lowPrice|highPrice|offerCount/);
assert.doesNotMatch(html, /price|equivalent|candidate/i);

const distDir = fs.mkdtempSync(path.join(os.tmpdir(), 'partsource-static-'));
try {
  fs.writeFileSync(path.join(distDir, 'index.html'), template);
  generateStaticPartPages(distDir);
  const fallbackPath = path.join(distDir, '404.html');
  assert.equal(fs.existsSync(fallbackPath), true);
  const fallback = fs.readFileSync(fallbackPath, 'utf8');
  assert.match(fallback, /<meta name="robots" content="noindex,follow" \/>/);
  assert.doesNotMatch(fallback, /rel="canonical"/);
} finally {
  fs.rmSync(distDir, { recursive: true, force: true });
}

console.log('Static part metadata checks passed.');
