import * as assert from 'node:assert/strict';
import { POC_BUNDLE } from '../../src/poc/fixture';
import { loadPocBundle } from '../../src/poc/runtime';
import { validateBundle } from '../../src/poc/validator';

const validated = validateBundle(POC_BUNDLE);
assert.equal(validated.manifest.bundleId, 'PS-POC-SYNTHETIC-V1');
assert.equal(validated.records.length, 30);
assert.equal(validated.mappings.length, 32);
assert.equal(validated.families.length, 3);
assert.equal(validated.manifest.visibleNotice, 'Synthetic POC data — not an engineering reference or supplier listing.');
assert.equal(new Set(validated.records.map(record => record.recordId)).size, 30);
assert.equal(new Set(validated.mappings.map(mapping => mapping.mappingId)).size, 32);

const blockedField = structuredClone(POC_BUNDLE) as typeof POC_BUNDLE & { records: Array<Record<string, unknown>> };
blockedField.records[0].supplier = 'forbidden';
assert.throws(() => validateBundle(blockedField), /unknown record field/i);

const blockedBundleField = structuredClone(POC_BUNDLE) as typeof POC_BUNDLE & Record<string, unknown>;
blockedBundleField.supplier = 'forbidden';
assert.throws(() => validateBundle(blockedBundleField), /unknown bundle field/i);

const badMapping = structuredClone(POC_BUNDLE);
badMapping.mappings[0].recordId = 'absent-record';
assert.throws(() => validateBundle(badMapping), /absent record/i);

const badCollision = structuredClone(POC_BUNDLE);
badCollision.mappings[0] = { ...badCollision.mappings[0], identifierValue: 'PSYN-SCR-COLLIDE' };
assert.throws(() => validateBundle(badCollision), /collision/i);

const badTypedRecord = structuredClone(POC_BUNDLE);
badTypedRecord.records[0].nominalDiameterMm = 7 as 4;
assert.throws(() => validateBundle(badTypedRecord), /invalid record/i);

const missingFactProvenance = structuredClone(POC_BUNDLE);
missingFactProvenance.records[0].displayedFactProvenance = [];
assert.throws(() => validateBundle(missingFactProvenance), /displayed fact provenance/i);

const extraFactProvenanceField = structuredClone(POC_BUNDLE) as typeof POC_BUNDLE & { records: Array<{ displayedFactProvenance: Array<Record<string, unknown>> }> };
extraFactProvenanceField.records[0].displayedFactProvenance[0].sourceUrl = 'forbidden';
assert.throws(() => validateBundle(extraFactProvenanceField), /unknown displayed fact provenance field/i);

const remappedExactId = structuredClone(POC_BUNDLE);
remappedExactId.mappings[0].recordId = 'synrec-v1-shcs-02';
assert.throws(() => validateBundle(remappedExactId), /unique mapping/i);

assert.equal(loadPocBundle(POC_BUNDLE).state, 'ready');
assert.equal(loadPocBundle(badMapping).state, 'catalog_unavailable');

console.log('POC bundle contract passed.');
