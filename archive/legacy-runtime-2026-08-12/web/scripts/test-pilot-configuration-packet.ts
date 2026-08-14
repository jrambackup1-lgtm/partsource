import assert from 'node:assert/strict';
import { PILOT_CONFIGURATION_PACKET } from '../src/data/pilotConfigurationPacket';

const bannedFieldPattern = /price|stock|inventory|availability|available|lead.?time|supplier|offer|listing|buy|cart|checkout|quote|equivalent|equivalence|alternate|replacement|same.?item|approved/i;
const bannedCopyPattern = /\bprice\b|\bstock\b|\binventory\b|\bavailability\b|\bavailable\b|\bbuy\b|\bquote\b|\bequivalent\b|\breplacement\b|\bapproved alternate\b|\bsame item\b/i;

assert.ok(PILOT_CONFIGURATION_PACKET.length >= 3, 'pilot packet needs common screw examples');
assert.ok(PILOT_CONFIGURATION_PACKET.some(record => record.family === 'socket' && record.type === 'Socket Head Cap Screw'));
assert.ok(PILOT_CONFIGURATION_PACKET.some(record => record.thread === 'M4'));

for (const record of PILOT_CONFIGURATION_PACKET) {
  assert.equal(record.demo, true);
  assert.equal(record.synthetic, true);
  assert.equal(record.provenanceKind, 'internal-demo-seed');
  assert.equal(record.verification, 'demo-only');

  for (const field of ['family', 'type', 'thread', 'pitch', 'length', 'head', 'drive', 'material', 'finish', 'strength', 'standard', 'sourceSku', 'provenanceNote'] as const) {
    assert.ok(record[field], `${record.id} missing ${field}`);
  }

  for (const key of Object.keys(record)) {
    assert.doesNotMatch(key, bannedFieldPattern, `${record.id} has banned field ${key}`);
  }
  assert.doesNotMatch(JSON.stringify(record), bannedCopyPattern, `${record.id} has banned claim copy`);
}

console.log('Pilot configuration packet checks passed.');
