import assert from 'node:assert/strict';
import { buildCatalogImport, buildUpsertQuery } from './import-catalog-to-supabase';

const result = buildCatalogImport();
const allowedKeys = [
  'demo',
  'drive',
  'family',
  'finish',
  'head',
  'id',
  'length',
  'material',
  'pitch',
  'prototypE'.toLowerCase(),
  'provenance_kind',
  'provenance_note',
  'reference_number',
  'source_sku',
  'standard',
  'strength',
  'synthetic',
  'thread',
  'title',
  'type',
  'verification',
].sort();
const bannedFieldPattern = /price|stock|inventory|availability|available|lead.?time|supplier|offer|listing|buy|cart|checkout|quote|equivalent|equivalence|alternate|replacement|same.?item|approved/i;

assert.deepEqual(result.counts, {
  socket: 7864,
  hex: 8850,
  rounded: 10295,
  total: 27009,
});

assert.equal(result.records.length, 27009);
assert.equal(new Set(result.records.map(record => record.id)).size, 27009);

for (const record of result.records) {
  assert.deepEqual(Object.keys(record).sort(), allowedKeys);
  assert.equal(record.prototype, true);
  assert.equal(record.demo, true);
  assert.equal(record.synthetic, true);
  assert.equal(record.provenance_kind, 'internal-demo-seed');
  assert.equal(record.verification, 'demo-only');
  assert.ok(record.type, 'configuration type is required');
  assert.ok(record.head, 'configuration head is required');
  assert.ok(record.provenance_note, 'configuration provenance note is required');

  for (const key of Object.keys(record)) {
    assert.doesNotMatch(key, bannedFieldPattern, `banned catalog field ${key}`);
  }
}

const socketBlank = result.records.find(record => record.family === 'socket' && record.reference_number === '93615A110');
assert.ok(socketBlank);
assert.equal(socketBlank.standard, null);
assert.equal(socketBlank.finish, null);
assert.equal(socketBlank.type, 'Socket Head Cap Screw');
assert.match(socketBlank.head ?? '', /Socket/);
assert.notEqual(socketBlank.id, socketBlank.reference_number, 'McMaster number must be a clue, not the identity');

const upsert = buildUpsertQuery([socketBlank]);
assert.match(upsert.text, /^insert into catalog\.catalog_configurations/);
assert.match(upsert.text, /on conflict \(id\) do update set/);
assert.equal(upsert.values.length, allowedKeys.length);
assert.equal(upsert.values.includes(socketBlank.title), true);
