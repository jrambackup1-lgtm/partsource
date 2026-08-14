import * as assert from 'node:assert/strict';
import {
  addItemToBom,
  calculateBOMTotals,
  calculateLineTotal,
  calculateSupplierTotal,
  buildBOMExportRows,
  createBomBackupPayload,
  createBom,
  deleteBom,
  deleteBOMItem,
  duplicateBom,
  getActiveBom,
  nextBomName,
  parseBomBackupPayload,
  renameBom,
  updateBOMQuantity,
  updateBomItemQuantity,
  validateBomCsvRows,
} from '../src/lib/bom';
import { createBomItem, createEmptyBomStore, validateBomStore } from '../src/lib/bomStorage';

const firstItem = createBomItem({
  id: '22222222-2222-4222-8222-222222222222',
  partNumber: '91251A542',
  description: 'Socket head cap screw',
  material: 'Alloy steel',
  supplier: 'Verified Supplier',
  qty: 3,
  unitCost: 1.25,
  notes: 'do not rewrite snapshot',
  origin: 'verified',
  verificationStatus: 'verified',
  selectedCrossReferenceRecordId: 'xref-001',
  verificationRevision: 'rev-7',
  inputText: 'user pasted 91251A542',
  configurationFacts: [{ label: 'Thread', value: 'M6' }],
  supplierSearchDestinations: [{ name: 'Supplier A', label: 'Search this configuration on Supplier A', url: 'https://example.test/s?q=M6', query: 'M6 socket head cap screw', requiresVerification: true }],
  sourceNotes: ['Source SKU: 91251A542'],
});
const secondItem = createBomItem({
  id: '33333333-3333-4333-8333-333333333333',
  partNumber: '91251A543',
  description: 'Another screw',
  material: 'Steel',
  supplier: 'Imported Supplier',
  qty: 2,
  unitCost: 4,
  origin: 'imported',
  verificationStatus: 'unverified-imported',
});

const items = [firstItem, secondItem];
assert.equal(calculateLineTotal(items[0]), 3.75);
assert.deepEqual(calculateBOMTotals(items), { lineCount: 2, totalQuantity: 5, totalCost: 11.75 });
assert.equal(calculateSupplierTotal(items, () => 2, 0.85), 8.5);
assert.deepEqual(buildBOMExportRows(items)[0], {
  mcmasterNumber: '91251A542',
  alternativePartNumber: '91251A542',
  crossReferenceRecordId: 'xref-001',
  verificationRevision: 'rev-7',
  partNumber: '91251A542',
  description: 'Socket head cap screw',
  material: 'Alloy steel',
  supplier: 'Verified Supplier',
  quantity: 3,
  unitCost: 1.25,
  notes: 'do not rewrite snapshot',
});
assert.deepEqual(updateBOMQuantity(items, '33333333-3333-4333-8333-333333333333', 7).map(item => [item.id, item.quantity, item.qty]), [
  ['22222222-2222-4222-8222-222222222222', 3, 3],
  ['33333333-3333-4333-8333-333333333333', 7, 7],
]);
assert.deepEqual(updateBOMQuantity(items, 'missing', 7), items);
assert.equal(updateBOMQuantity(items, '33333333-3333-4333-8333-333333333333', 0), items);
assert.deepEqual(deleteBOMItem(items, '22222222-2222-4222-8222-222222222222').map(item => item.id), ['33333333-3333-4333-8333-333333333333']);


let store = createEmptyBomStore();
store = createBom(store);
const firstBom = getActiveBom(store)!;
assert.equal(firstBom.name, 'BOM 1');
store = createBom(store);
assert.equal(getActiveBom(store)!.name, 'BOM 2');
assert.equal(nextBomName(store.boms), 'BOM 3');

store = renameBom(store, firstBom.id, ' Shop BOM ');
assert.equal(store.boms.find(bom => bom.id === firstBom.id)!.name, 'Shop BOM');
assert.throws(() => renameBom(store, firstBom.id, 'bom 2'));
assert.throws(() => renameBom(store, firstBom.id, '   '));

store = addItemToBom(store, firstBom.id, firstItem);
const afterAdd = store.boms.find(bom => bom.id === firstBom.id)!;
assert.equal(afterAdd.items.length, 1);
assert.equal(store.boms.find(bom => bom.id !== firstBom.id)!.items.length, 0, 'adding to one BOM must not mutate another');
assert.equal(afterAdd.items[0].id, firstItem.id, 'item UUID remains immutable');
assert.equal(afterAdd.items[0].selectionSnapshot.description, 'Socket head cap screw');
assert.equal(afterAdd.items[0].selectionSnapshot.inputText, 'user pasted 91251A542');
assert.deepEqual(afterAdd.items[0].selectionSnapshot.configurationFacts, [{ label: 'Thread', value: 'M6' }]);
assert.deepEqual(afterAdd.items[0].selectionSnapshot.sourceNotes, ['Source SKU: 91251A542']);
assert.equal(afterAdd.items[0].selectionSnapshot.supplierSearchDestinations[0].url, 'https://example.test/s?q=M6');
store = addItemToBom(store, firstBom.id, createBomItem({ ...firstItem, id: '44444444-4444-4444-8444-444444444444', quantity: 5, qty: 5, notes: 'duplicate append' }));
assert.equal(store.boms.find(bom => bom.id === firstBom.id)!.items.length, 2, 'duplicate add appends a separate frozen snapshot');

const afterQty = updateBomItemQuantity(store, firstBom.id, firstItem.id, 9);
assert.equal(afterQty.boms.find(bom => bom.id === firstBom.id)!.items[0].id, firstItem.id);
assert.equal(afterQty.boms.find(bom => bom.id === firstBom.id)!.items[0].quantity, 9);
assert.equal(afterQty.boms.find(bom => bom.id !== firstBom.id)!.items.length, 0);

const duplicated = duplicateBom(afterQty, firstBom.id);
const copy = getActiveBom(duplicated)!;
assert.equal(copy.name, 'Shop BOM copy');
assert.notEqual(copy.id, firstBom.id);
assert.notEqual(copy.items[0].id, firstItem.id);
assert.deepEqual(copy.items[0].selectionSnapshot, firstItem.selectionSnapshot, 'duplicate deep-copies immutable snapshots');
validateBomStore(duplicated);

const afterLineDelete = deleteBOMItem(copy.items, copy.items[0].id);
assert.equal(afterLineDelete.length, 1);
const afterBomDelete = deleteBom(duplicated, copy.id);
assert.notEqual(afterBomDelete.activeBomId, copy.id);
assert.equal(deleteBom(deleteBom(afterBomDelete, afterBomDelete.boms[0].id), afterBomDelete.boms[1].id).activeBomId, null);

const csvImport = validateBomCsvRows([
  { mcmasterNumber: '91251A542', alternativePartNumber: 'ALT-1', crossReferenceRecordId: 'xref-001', verificationRevision: 'rev-7', supplier: 'Verified Supplier', quantity: '4', unitCost: '1.50', description: 'Imported row', material: 'Steel', notes: 'accepted' },
  { partNumber: 'NO-CURRENT-MATCH', crossReferenceRecordId: 'xref-001', verificationRevision: 'old-rev', supplier: 'Verified Supplier', quantity: '2', unitCost: '0' },
  { partNumber: '', quantity: '1', unitCost: '0' },
  { partNumber: 'BAD-QTY', quantity: '0', unitCost: '0' },
], [{ recordId: 'xref-001', recordRevision: 'rev-7', mcmasterIdentifier: '91251A542', alternativeIdentifier: 'ALT-1', alternativeSupplier: 'Verified Supplier' }]);
assert.equal(csvImport.acceptedItems.length, 2);
assert.equal(csvImport.rejectedRows.length, 2);
assert.equal(csvImport.acceptedItems[0].verificationStatus, 'verified', 'exact current record+revision match can be restored as verified');
assert.equal(csvImport.acceptedItems[1].verificationStatus, 'unverified-imported', 'stale or non-exact imports remain unverified');
assert.equal(csvImport.acceptedItems[1].origin, 'imported');

const backup = createBomBackupPayload(duplicated, '2026-01-02T03:04:05.006Z');
assert.equal(backup.format, 'partsource-bom-backup');
assert.deepEqual(parseBomBackupPayload(JSON.stringify(backup)), validateBomStore({ version: 1, activeBomId: backup.activeBomId, boms: backup.boms }));
assert.throws(() => parseBomBackupPayload('{bad'));
assert.throws(() => parseBomBackupPayload(JSON.stringify({ ...backup, version: 2 })));
assert.throws(() => parseBomBackupPayload(JSON.stringify({ ...backup, boms: [{ ...backup.boms[0], items: [{ ...backup.boms[0].items[0], quantity: 0, qty: 0 }] }] })));

console.log('BOM domain checks passed.');
