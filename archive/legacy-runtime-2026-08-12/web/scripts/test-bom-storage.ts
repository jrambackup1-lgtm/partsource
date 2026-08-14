import * as assert from 'node:assert/strict';
import {
  BOM_STORAGE_KEY,
  BOM_STORAGE_VERSION,
  LEGACY_BOM_STORAGE_KEY,
  BOM_QUARANTINE_STORAGE_KEY,
  createBomItem,
  createEmptyBomStore,
  migrateLegacyBomPayload,
  parseStoredBOMStore,
  serializeBOMStore,
  validateBomStore,
} from '../src/lib/bomStorage';

const bomId = '11111111-1111-4111-8111-111111111111';
const itemId = '22222222-2222-4222-8222-222222222222';
const now = '2026-01-02T03:04:05.006Z';

const validItem = createBomItem({
  id: itemId,
  partNumber: '91251A542',
  description: 'Socket head cap screw',
  material: 'Alloy steel',
  supplier: 'Verified Supplier',
  qty: 10,
  unitCost: 0.25,
  notes: 'bench stock',
  origin: 'verified',
  verificationStatus: 'verified',
  selectedCrossReferenceRecordId: 'xref-001',
  verificationRevision: 'rev-7',
  inputText: '91251A542 user input',
  configurationFacts: [{ label: 'Thread', value: 'M6' }, { label: 'Material', value: 'Alloy steel' }],
  supplierSearchDestinations: [{ name: 'Supplier A', label: 'Search this configuration on Supplier A', url: 'https://example.test/search?q=91251A542', query: 'M6 screw', requiresVerification: true }],
  sourceNotes: ['Source SKU: 91251A542'],
});

const validStore = {
  version: BOM_STORAGE_VERSION,
  activeBomId: bomId,
  boms: [{ id: bomId, name: ' Shop BOM ', createdAt: now, updatedAt: now, items: [validItem] }],
} as const;

assert.equal(BOM_STORAGE_KEY, 'partsource_boms:v1');
assert.equal(LEGACY_BOM_STORAGE_KEY, 'partsource_bom');
assert.equal(BOM_QUARANTINE_STORAGE_KEY, 'partsource_bom_quarantine:v1');
assert.deepEqual(createEmptyBomStore(), { version: 1, activeBomId: null, boms: [] });
assert.deepEqual(parseStoredBOMStore(null), createEmptyBomStore());
assert.deepEqual(parseStoredBOMStore('{bad json'), createEmptyBomStore());
assert.deepEqual(validateBomStore(validStore), {
  version: 1,
  activeBomId: bomId,
  boms: [{ id: bomId, name: 'Shop BOM', createdAt: now, updatedAt: now, items: [validItem] }],
});
assert.deepEqual(JSON.parse(serializeBOMStore(validateBomStore(validStore))), validateBomStore(validStore));
assert.equal(validItem.selectionSnapshot.inputText, '91251A542 user input');
assert.deepEqual(validItem.selectionSnapshot.configurationFacts, [{ label: 'Thread', value: 'M6' }, { label: 'Material', value: 'Alloy steel' }]);
assert.equal(validItem.selectionSnapshot.supplierSearchDestinations[0].requiresVerification, true);
assert.deepEqual(validItem.selectionSnapshot.sourceNotes, ['Source SKU: 91251A542']);

const invalidStores = [
  { ...validStore, version: 2 },
  { ...validStore, activeBomId: '33333333-3333-4333-8333-333333333333' },
  { ...validStore, boms: [{ ...validStore.boms[0], id: 'not-uuid' }] },
  { ...validStore, boms: [{ ...validStore.boms[0], name: '   ' }] },
  { ...validStore, boms: [{ ...validStore.boms[0] }, { ...validStore.boms[0], id: '33333333-3333-4333-8333-333333333333', name: 'shop bom' }] },
  { ...validStore, boms: [{ ...validStore.boms[0], items: [{ ...validItem, id: 'not-uuid' }] }] },
  { ...validStore, boms: [{ ...validStore.boms[0], items: [{ ...validItem, quantity: 0, qty: 0 }] }] },
  { ...validStore, boms: [{ ...validStore.boms[0], items: [{ ...validItem, userUnitCostUsd: -1, unitCost: -1 }] }] },
  { ...validStore, boms: [{ ...validStore.boms[0], items: [{ ...validItem, partNumber: 'CHANGED' }] }] },
];
for (const candidate of invalidStores) {
  assert.throws(() => validateBomStore(candidate));
}

const legacy = JSON.stringify([
  { partNumber: '91251A542', description: 'Legacy screw', material: 'Steel', supplier: 'User CSV', qty: 3, unitCost: 1.5 },
  { partNumber: '', qty: 1 },
]);
const migrated = migrateLegacyBomPayload(legacy, now);
assert.equal(migrated.store.version, 1);
assert.equal(migrated.store.boms[0].name, 'Migrated BOM');
assert.equal(migrated.store.boms[0].items.length, 1);
assert.equal(migrated.store.boms[0].items[0].origin, 'legacy');
assert.equal(migrated.store.boms[0].items[0].verificationStatus, 'legacy-unverified');
assert.equal(migrated.quarantine.length, 1);
assert.match(migrated.quarantine[0].reason, /Rejected legacy row 1/);
assert.equal(migrateLegacyBomPayload('{bad', now).quarantine[0].reason, 'Legacy BOM JSON parse failed.');

console.log('BOM storage checks passed.');
