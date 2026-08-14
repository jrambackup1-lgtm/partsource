import assert from 'node:assert/strict';
import { SOCKET_HEAD_PROTOTYPE_CATALOG } from '../src/data/socketHeadPrototypeCatalog';

assert.equal(SOCKET_HEAD_PROTOTYPE_CATALOG.length, 7864);

const row = SOCKET_HEAD_PROTOTYPE_CATALOG.find(item => item.mcmaster === '93615A110');
assert.ok(row);
assert.equal(row.partNumber, 'PROTO-SHCS-93615A110');
assert.equal(row.type, 'Socket Head Cap Screw');
assert.equal(row.isPrototype, true);
assert.equal(row.offers, undefined);

const missingMcMaster = SOCKET_HEAD_PROTOTYPE_CATALOG.find(item => item.sourceSku === '0009FA01257');
assert.ok(missingMcMaster);
assert.equal(missingMcMaster.partNumber, 'PROTO-SHCS-0009FA01257');
assert.equal(missingMcMaster.mcmaster, undefined);
