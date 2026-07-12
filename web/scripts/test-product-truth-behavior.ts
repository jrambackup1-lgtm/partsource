import assert from 'node:assert/strict';
import * as bomModule from '../src/hooks/useBOM';

const moduleExports = bomModule as Record<string, unknown>;
const createCatalogCommercialFields = moduleExports.createCatalogCommercialFields as (() => unknown) | undefined;
const parseImportedUnitCost = moduleExports.parseImportedUnitCost as ((value: unknown) => number) | undefined;

assert.equal(typeof createCatalogCommercialFields, 'function', 'catalog commercial-field helper must exist');
assert.equal(typeof parseImportedUnitCost, 'function', 'import cost helper must exist');

assert.deepEqual(createCatalogCommercialFields!(), {
  supplier: 'Unselected',
  unitCost: 0,
});
assert.equal(parseImportedUnitCost!(undefined), 0, 'missing import price stays zero');
assert.equal(parseImportedUnitCost!(''), 0, 'blank import price stays zero');
assert.equal(parseImportedUnitCost!('12.75'), 12.75, 'user-supplied import price is preserved');
assert.equal(parseImportedUnitCost!(8.5), 8.5, 'numeric import price is preserved');

console.log('Product Truth BOM behavior checks passed.');
