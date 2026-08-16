import * as assert from 'node:assert/strict';
import { POC_BUNDLE } from '../../src/poc/fixture';
import { applyFilters, availableFilterValues, resolveQuery } from '../../src/poc/resolver';

const resolve = (query: string) => resolveQuery(POC_BUNDLE, query);
const ids = (query: string) => resolve(query).records.map(record => record.recordId);

assert.deepEqual(ids('screws'), [...Array(30)].map((_, index) => `synrec-v1-${index < 10 ? 'shcs' : index < 20 ? 'bhss' : 'css'}-${String((index % 10) + 1).padStart(2, '0')}`));
assert.equal(resolve('socket head screws').state, 'catalog_list');
assert.equal(resolve('socket head screws').familyId, 'shcs');
assert.equal(resolve('socket-head screws').state, 'catalog_list');
assert.equal(resolve('socket-head screws').familyId, 'shcs');
assert.deepEqual(resolve('black-oxide socket head screws').filters, [{ field: 'familyId', value: 'shcs' }, { field: 'finish', value: 'black_oxide' }]);
assert.deepEqual(ids('M6 A2 stainless socket head screws'), ['synrec-v1-shcs-05', 'synrec-v1-shcs-06']);
assert.equal(resolve('M6 stainless socket head screws').state, 'query_unsupported');
assert.deepEqual(resolve('M6 stainless socket head screws').trace.unsupportedTerms, ['stainless']);
assert.equal(resolve('M6 A2 socket head screws').state, 'query_unsupported');
assert.equal(resolve('M8 30 mm black oxide button head screws').state, 'query_unsupported');
assert.deepEqual(ids('M8 30 mm black oxide button head socket screws'), ['synrec-v1-bhss-09']);
assert.equal(resolve('countersunk screws').state, 'query_unsupported');
assert.equal(resolve('button head screws').state, 'query_unsupported');
assert.equal(resolve('M4 40 mm socket head screws').state, 'catalog_empty');

const exact = resolve('PSYN-SCR-0006');
assert.equal(exact.state, 'catalog_list');
assert.equal(exact.familyId, 'shcs');
assert.equal(exact.records.length, 10);
assert.equal(exact.highlightedRecordId, 'synrec-v1-shcs-06');
assert.equal(exact.selectedRecordId, undefined);
assert.equal(exact.detailOpen, false);
assert.equal(exact.trace.exactId.state, 'unique');
assert.equal(exact.trace.exactId.namespace, 'partsource_synthetic_v1');
assert.deepEqual(exact.trace.exactId.mappingIds, ['synmap-v1-06']);
assert.ok(exact.trace.provenanceRefs.includes('mapping:synmap-v1-06:synthetic_identifier'));
assert.ok(exact.trace.provenanceRefs.includes('record:synrec-v1-shcs-06:synthetic_fixture'));
assert.equal(resolveQuery(POC_BUNDLE, ' psyn-scr-0006 ').highlightedRecordId, 'synrec-v1-shcs-06');
for (const unsafeExact of ['PSYN-SCR-0006 extra', 'PSYN SCR 0006', 'prefix PSYN-SCR-0006', 'PSYN-SCR-0006-1', 'PSYN-SCR-000']) {
  const result = resolve(unsafeExact);
  assert.notEqual(result.trace.exactId.state, 'unique');
  assert.equal(result.highlightedRecordId, undefined);
  assert.equal(result.selectedRecordId, undefined);
}
const exactSelected = resolveQuery(POC_BUNDLE, 'PSYN-SCR-0006', { selectedRecordId: 'synrec-v1-shcs-05' });
assert.equal(exactSelected.selectedRecordId, undefined);
assert.equal(exactSelected.detailOpen, false);
const exactNarrowed = applyFilters(POC_BUNDLE, exact, [{ field: 'nominalDiameterMm', value: 4 }]);
assert.deepEqual(exactNarrowed.records.map(record => record.recordId), ['synrec-v1-shcs-01', 'synrec-v1-shcs-02']);
assert.equal(exactNarrowed.highlightedRecordId, undefined);
const exactInvalidFilter = applyFilters(POC_BUNDLE, exact, [{ field: 'familyId', value: 'bhss' }]);
assert.equal(exactInvalidFilter.state, 'invalid_url_state');
assert.equal(exactInvalidFilter.familyId, undefined);
assert.equal(exactInvalidFilter.highlightedRecordId, undefined);
assert.equal(exactInvalidFilter.selectedRecordId, undefined);
assert.equal(exactInvalidFilter.detailOpen, false);

const unknown = resolve('PSYN-SCR-9999');
assert.equal(unknown.state, 'exact_not_found');
assert.equal(unknown.familyId, undefined);
assert.equal(unknown.records.length, 0);
assert.equal(unknown.highlightedRecordId, undefined);
assert.equal(unknown.selectedRecordId, undefined);
assert.equal(unknown.trace.exactId.state, 'unknown');
const collision = resolve('PSYN-SCR-COLLIDE');
assert.equal(collision.state, 'exact_non_unique');
assert.equal(collision.familyId, undefined);
assert.equal(collision.records.length, 0);
assert.equal(collision.highlightedRecordId, undefined);
assert.match(collision.mappingEvidence.join(' '), /synrec-v1-shcs-06/);
assert.equal(collision.trace.exactId.state, 'non_unique');
assert.deepEqual(collision.trace.exactId.recordIds, ['synrec-v1-shcs-06', 'synrec-v1-bhss-06']);

const conflict = resolve('M4 M6 socket head screws');
assert.equal(conflict.state, 'query_conflict');
assert.equal(conflict.familyId, 'shcs');
assert.deepEqual(conflict.conflicts.nominalDiameterMm, [4, 6]);
assert.deepEqual(conflict.trace.conflicts.nominalDiameterMm, [4, 6]);
assert.equal(conflict.trace.stopReason, 'query_conflict');
const unsupported = resolve('M6 titanium socket head screws');
assert.equal(unsupported.state, 'query_unsupported');
assert.equal(unsupported.familyId, 'shcs');
assert.deepEqual(unsupported.filters, [{ field: 'familyId', value: 'shcs' }, { field: 'nominalDiameterMm', value: 6 }]);
assert.deepEqual(unsupported.trace.unsupportedTerms, ['titanium']);
assert.deepEqual(resolve('M6 20 socket head screws').unsupportedTerms, ['20']);
assert.equal(resolve('1/4 inch socket head screws').state, 'query_unsupported');
for (const unsafeLogic of ['M4 or M6 screws', 'M4 screws not black oxide', 'M4 screws - black oxide']) {
  const result = resolve(unsafeLogic);
  assert.ok(['query_unsupported', 'query_conflict'].includes(result.state));
  assert.equal(result.records.length, 0);
  assert.equal(result.highlightedRecordId, undefined);
  assert.equal(result.selectedRecordId, undefined);
}

const domains = availableFilterValues(POC_BUNDLE, 'css');
assert.deepEqual(domains.familyId, ['css']);
assert.deepEqual(domains.nominalDiameterMm, [4, 5, 6, 8]);
assert.equal(POC_BUNDLE.families.find(family => family.id === 'shcs')?.lengthDatum, 'under_head');
assert.equal(POC_BUNDLE.families.find(family => family.id === 'bhss')?.lengthDatum, 'under_head');
assert.equal(POC_BUNDLE.families.find(family => family.id === 'css')?.lengthDatum, 'overall');
assert.ok(POC_BUNDLE.records.every(record => record.threadSystem === 'metric'));
assert.ok(POC_BUNDLE.records.every(record => record.displayedFactProvenance.some(fact => fact.field === 'lengthDatum' && fact.provenanceKind === 'synthetic_fact')));

const narrowed = applyFilters(POC_BUNDLE, resolve('M6 socket head screws'), [{ field: 'familyId', value: 'shcs' }, { field: 'nominalDiameterMm', value: 6 }, { field: 'material', value: 'a2_stainless' }, { field: 'lengthMm', value: 20 }]);
assert.deepEqual(narrowed.records.map(record => record.recordId), ['synrec-v1-shcs-06']);
assert.equal(resolveQuery(POC_BUNDLE, 'M6 socket head screws', { selectedRecordId: 'synrec-v1-shcs-05' }).selectedRecordId, 'synrec-v1-shcs-05');
assert.equal(resolveQuery(POC_BUNDLE, 'M6 socket head screws', { selectedRecordId: 'missing' }).state, 'invalid_selection');
console.log('POC resolver Ticket 40 contract passed.');
