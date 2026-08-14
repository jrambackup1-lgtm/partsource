import * as assert from 'node:assert/strict';
import { config } from 'dotenv';

config({ path: '.env.local' });

const baseUrl = process.env.CATALOG_SEARCH_URL;
const anonKey = process.env.CATALOG_SEARCH_ANON_KEY;

if (!baseUrl) {
  throw new Error('CATALOG_SEARCH_URL is required to run catalog-search integration tests');
}

const bannedCopy = /\bequivalent\b|\breplacement\b|\bapproved alternate\b|\bsame item\b|\bin stock\b|\bbuy\b|\bquote\b/i;
const bannedFields = /price|stock|inventory|availability|available|lead.?time|offer|listing|buy|cart|checkout|quote|equivalent|equivalence|alternate|replacement|same.?item|approved/i;
const requiredPublicFields = ['id', 'family', 'reference_number', 'thread', 'length', 'material', 'finish', 'drive', 'standard', 'prototype'] as const;

async function search(body: unknown) {
  return fetch(baseUrl, {
    method: 'POST',
    headers: {
      ...(anonKey ? { authorization: `Bearer ${anonKey}` } : {}),
      'content-type': 'application/json',
      origin: 'http://localhost:3000',
    },
    body: JSON.stringify(body),
  });
}

async function main() {
  const blank = await search({ query: '   ' });
  assert.equal(blank.status, 400);

  const exact = await search({ query: '90002A101' });
  assert.equal(exact.status, 200);
  const exactBody = await exact.json() as { results: Array<Record<string, unknown>> };
  assert.equal(exactBody.results.length, 1);
  assert.equal(exactBody.results[0].reference_number, '90002A101');

  const text = await search({ query: 'screws' });
  assert.equal(text.status, 200);
  const textBody = await text.json() as { results: Array<Record<string, unknown>> };
  assert.ok(textBody.results.length > 0);
  assert.ok(textBody.results.length <= 25);
  assert.ok(textBody.results.some(result => String(result.title ?? '').toLowerCase().includes('screw')));

  const guided = await search({ query: 'screws', family: 'socket' });
  assert.equal(guided.status, 200);
  const guidedBody = await guided.json() as { results: Array<Record<string, unknown>> };
  assert.ok(guidedBody.results.length > 0);
  assert.ok(guidedBody.results.every(result => result.family === 'socket'));

  for (const result of [...exactBody.results, ...textBody.results, ...guidedBody.results]) {
    for (const field of requiredPublicFields) {
      assert.ok(field in result, `catalog-search result missing ${field}`);
    }
    assert.equal('price' in result, false, 'catalog-search result must not expose price');
    assert.equal('offers' in result, false, 'catalog-search result must not expose supplier offers');
    for (const field of Object.keys(result)) {
      assert.doesNotMatch(field, bannedFields, `catalog-search result field crosses commercial/equivalence boundary: ${field}`);
    }
    assert.doesNotMatch(JSON.stringify(result), bannedCopy);
  }
}

void main();
