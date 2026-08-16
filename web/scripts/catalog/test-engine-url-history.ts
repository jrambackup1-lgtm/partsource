import assert from 'node:assert/strict';
import {
  applyCatalogFilters,
  SYNTHETIC_CATALOG_PACKAGE,
  buildSyntheticCatalogPackageInput,
  catalogPackageDigest,
  activateCatalogRecord,
  closeCatalogDetail,
  createCatalogIndex,
  editCatalogFilters,
  hydrateCatalogUrl,
  parseCatalogPackage,
  resolveCatalogQuery,
  selectCatalogRecord,
  serializeCatalogUrl,
  submitCatalogQuery,
} from '../../src/catalog/index';

const index = createCatalogIndex(SYNTHETIC_CATALOG_PACKAGE);
const required = `v=2&release=${encodeURIComponent(index.package.manifest.releaseId)}&digest=${encodeURIComponent(index.package.manifest.digest)}`;
const url = (rest: string) => `?${required}&${rest}`;

const exact = selectCatalogRecord(index, resolveCatalogQuery(index, 'PSYN-SCR-0006'), 'synrec-v1-shcs-05');
const serializedExact = serializeCatalogUrl(index, exact);
assert.ok(serializedExact.includes('release=partsource.synthetic.screws.v1'));
assert.ok(serializedExact.includes('selected=synrec-v1-shcs-05'));
assert.ok(serializedExact.includes('selected_revision=synrec-v1-shcs-05%3Ar1'));
const exactRoundTrip = hydrateCatalogUrl(index, serializedExact);
assert.equal(exactRoundTrip.state, 'ready');
if (exactRoundTrip.state === 'ready') {
  assert.equal(exactRoundTrip.resolution.highlightedRecordId, 'synrec-v1-shcs-06');
  assert.equal(exactRoundTrip.resolution.selectedRecordId, 'synrec-v1-shcs-05');
  assert.equal(exactRoundTrip.resolution.detail?.configurationId, 'synrec-v1-shcs-05');
}

const explicit = hydrateCatalogUrl(index, url('q=M4+screws&diameter_mm=4'));
assert.equal(explicit.state, 'ready');
if (explicit.state === 'ready') {
  // Category-level URL state hydrates to the family chooser, not a flat list.
  assert.equal(explicit.resolution.state, 'catalog_chooser');
  assert.deepEqual(explicit.resolution.familyChoices.map(choice => [choice.familyId, choice.count]), [
    ['shcs', 2], ['bhss', 2], ['css', 2],
  ]);
  assert.equal(explicit.resolution.records.length, 0);
  assert.deepEqual(explicit.resolution.filters.map(filter => [filter.factId, filter.value]), [['nominal_diameter_mm', 4]]);
  assert.equal(explicit.canonicalUrl.includes('family='), false);
}
const removedQueryFilter = hydrateCatalogUrl(index, url('q=M4+screws'));
assert.equal(removedQueryFilter.state, 'ready');
if (removedQueryFilter.state === 'ready') {
  // URL facts EXTEND the query (u4): without explicit URL facts the
  // query-derived M4 constraint survives — results never contradict the
  // visible query.
  assert.equal(removedQueryFilter.resolution.state, 'catalog_chooser');
  assert.deepEqual(removedQueryFilter.resolution.familyChoices.map(choice => choice.count), [2, 2, 2]);
  assert.ok(removedQueryFilter.canonicalUrl.includes('f_nominal_diameter_mm=4'), 'v3 canonical URL carries the constraint');
}
// A family chosen from the chooser round-trips with its constraints intact.
const chosenFamily = hydrateCatalogUrl(index, url('q=M4+screws&family=bhss&diameter_mm=4'));
assert.equal(chosenFamily.state, 'ready');
if (chosenFamily.state === 'ready') {
  assert.equal(chosenFamily.resolution.state, 'catalog_list');
  assert.equal(chosenFamily.resolution.familyId, 'bhss');
  assert.deepEqual(chosenFamily.resolution.records.map(record => record.configurationId), ['synrec-v1-bhss-01', 'synrec-v1-bhss-02']);
}

for (const [candidate, field] of [
  ['?v=1&q=screws', 'v'],
  [url('q=screws&q=M4'), 'q'],
  [url('q=screws&unknown=x'), 'unknown'],
  [url('q=screws&diameter_mm=4.0'), 'diameter_mm'],
  [url('q=screws&material=titanium'), 'material'],
  [url('q=socket+head+cap+screws&family=bhss'), 'family'],
] as const) {
  const hydration = hydrateCatalogUrl(index, candidate);
  assert.equal(hydration.state, 'invalid_url_state', candidate);
  if (hydration.state === 'invalid_url_state') assert.ok(hydration.rejected.includes(field));
}
assert.deepEqual(hydrateCatalogUrl(index, ''), { state: 'empty' });
assert.equal(hydrateCatalogUrl(index, url('q=%E0%A4')).state, 'invalid_url_state');

// Stale release identity/digest must never hydrate against a different package.
assert.deepEqual(hydrateCatalogUrl(index, `?v=2&release=stale.release&digest=${encodeURIComponent(index.package.manifest.digest)}&q=screws`), {
  state: 'invalid_url_state', query: 'screws', rejected: ['release'],
});
const staleDigest = hydrateCatalogUrl(index, `?v=2&release=${index.package.manifest.releaseId}&digest=sha256%3Apending%3Astale&q=screws`);
assert.equal(staleDigest.state, 'invalid_url_state');
if (staleDigest.state === 'invalid_url_state') assert.deepEqual(staleDigest.rejected, ['digest']);
const mutatedInput = structuredClone(buildSyntheticCatalogPackageInput()) as Record<string, any>;
mutatedInput.hierarchy[0].label = 'Mutated screws';
mutatedInput.manifest.digest = catalogPackageDigest(mutatedInput as any);
const mutatedIndex = createCatalogIndex(parseCatalogPackage(mutatedInput));
assert.notEqual(mutatedIndex.package.manifest.digest, index.package.manifest.digest);
const oldIdentityUrl = `?v=2&release=${index.package.manifest.releaseId}&digest=${encodeURIComponent(index.package.manifest.digest)}&q=screws`;
const mutatedHydration = hydrateCatalogUrl(mutatedIndex, oldIdentityUrl);
assert.equal(mutatedHydration.state, 'invalid_url_state');
if (mutatedHydration.state === 'invalid_url_state') assert.deepEqual(mutatedHydration.rejected, ['digest']);

const validSelection = hydrateCatalogUrl(index, url('q=socket+head+cap+screws&selected=synrec-v1-shcs-01&selected_revision=synrec-v1-shcs-01%3Ar1'));
assert.equal(validSelection.state, 'ready');
if (validSelection.state === 'ready') assert.equal(validSelection.resolution.detail?.configurationId, 'synrec-v1-shcs-01');
// A selection cannot survive at category level: the chooser has no records.
const selectionAtChooser = hydrateCatalogUrl(index, url('q=screws&selected=synrec-v1-shcs-01&selected_revision=synrec-v1-shcs-01%3Ar1'));
assert.equal(selectionAtChooser.state, 'invalid_selection');
if (selectionAtChooser.state === 'invalid_selection') {
  assert.equal(selectionAtChooser.resolution.state, 'catalog_chooser');
  assert.ok(!selectionAtChooser.canonicalUrl.includes('selected='));
}
const invalidSelection = hydrateCatalogUrl(index, url('q=socket+head+cap+screws&selected=synrec-v1-shcs-01&selected_revision=synrec-v1-shcs-02%3Ar1'));
assert.equal(invalidSelection.state, 'invalid_selection');
if (invalidSelection.state === 'invalid_selection') assert.ok(!invalidSelection.canonicalUrl.includes('selected='));

const submitted = submitCatalogQuery(index, 'PSYN-SCR-0006');
assert.equal(submitted.mode, 'push');
assert.equal(submitted.snapshot.resolution.highlightedRecordId, 'synrec-v1-shcs-06');
assert.equal(submitted.snapshot.resolution.selectedRecordId, null);
const activated = activateCatalogRecord(index, { ...submitted.snapshot, scrollTop: 240 }, 'synrec-v1-shcs-06');
assert.equal(activated.mode, 'push');
assert.equal(activated.snapshot.resolution.highlightedRecordId, 'synrec-v1-shcs-06');
assert.equal(activated.snapshot.resolution.selectedRecordId, 'synrec-v1-shcs-06');

const preserved = editCatalogFilters(index, activated.snapshot, [{ factId: 'nominal_diameter_mm', value: 6 }]);
assert.equal(preserved.snapshot.resolution.selectedRecordId, 'synrec-v1-shcs-06');
const invalidated = editCatalogFilters(index, preserved.snapshot, [{ factId: 'nominal_diameter_mm', value: 4 }]);
assert.equal(invalidated.snapshot.resolution.selectedRecordId, null);
assert.equal(invalidated.snapshot.resolution.highlightedRecordId, null);
assert.ok(!invalidated.snapshot.url.includes('selected='));

const closeWithHistory = closeCatalogDetail(index, activated.snapshot, true);
assert.equal(closeWithHistory.mode, 'back');
assert.equal(closeWithHistory.snapshot.rowFocusTarget, 'synrec-v1-shcs-06');
const closeDirect = closeCatalogDetail(index, activated.snapshot, false);
assert.equal(closeDirect.mode, 'replace');
assert.ok(!closeDirect.snapshot.url.includes('selected='));

const replayOne = hydrateCatalogUrl(index, url('q=M6+socket+head+cap+screws&family=shcs&diameter_mm=6&length_mm=20'));
const replayTwo = hydrateCatalogUrl(index, `?length_mm=20&${required}&diameter_mm=6&family=shcs&q=M6+socket+head+cap+screws`);
assert.equal(replayOne.state, 'ready');
assert.equal(replayTwo.state, 'ready');
if (replayOne.state === 'ready' && replayTwo.state === 'ready') assert.equal(replayOne.canonicalUrl, replayTwo.canonicalUrl);

// --- u4: v3 filter vocabulary, OR filters, inert params, view params ------
const v3 = `?v=3&${required.slice(required.indexOf('&') + 1)}`;
const multiFilter = resolveCatalogQuery(index, 'socket head cap screws');
const multi = applyCatalogFilters(index, multiFilter, [
  { factId: 'nominal_diameter_mm', value: 4, source: 'user' },
  { factId: 'nominal_diameter_mm', value: 6, source: 'user' },
]);
assert.equal(multi.state, 'catalog_list', 'OR within a fact');
assert.equal(multi.records.length, 5, 'M4 or M6 across shcs');
const multiUrl = serializeCatalogUrl(index, multi);
assert.ok(multiUrl.includes('f_nominal_diameter_mm=4'));
assert.ok(multiUrl.includes('f_nominal_diameter_mm=6'));
const multiRoundTrip = hydrateCatalogUrl(index, multiUrl);
assert.equal(multiRoundTrip.state, 'ready');
if (multiRoundTrip.state === 'ready') {
  assert.equal(multiRoundTrip.resolution.records.length, 5);
  assert.equal(multiRoundTrip.canonicalUrl, multiUrl);
}

// The headline N6 fix: q + family no longer silently drops the query filter.
const n6Preserved = hydrateCatalogUrl(index, `${v3}&q=M4+screws&family=css`);
assert.equal(n6Preserved.state, 'ready');
if (n6Preserved.state === 'ready') {
  assert.equal(n6Preserved.resolution.state, 'catalog_list');
  assert.equal(n6Preserved.resolution.familyId, 'css');
  assert.ok(n6Preserved.resolution.filters.some(filter => filter.factId === 'nominal_diameter_mm' && filter.value === 4));
  assert.equal(n6Preserved.resolution.records.length, 2);
}
// A URL fact that contradicts the query-derived fact is invalid, not silent.
const contradicted = hydrateCatalogUrl(index, `${v3}&q=M4+screws&f_nominal_diameter_mm=6`);
assert.equal(contradicted.state, 'invalid_url_state');

// Inert tracking parameters never invalidate otherwise-valid state.
const tracked = hydrateCatalogUrl(index, `${v3}&q=screws&utm_source=mail&gclid=x`);
assert.equal(tracked.state, 'ready');
if (tracked.state === 'ready') assert.equal(tracked.resolution.state, 'catalog_chooser');
// View parameters are validated for shape and tolerated by the engine.
const paged = hydrateCatalogUrl(index, `${v3}&q=screws&page=3&sort=length_mm&dir=asc`);
assert.equal(paged.state, 'ready');
assert.equal(hydrateCatalogUrl(index, `${v3}&q=screws&page=abc`).state, 'invalid_url_state');
assert.equal(hydrateCatalogUrl(index, `${v3}&q=screws&dir=sideways`).state, 'invalid_url_state');
// App-owned parameters alone are not catalog state: a bare selection or
// paging link hydrates as empty instead of failing the q requirement (f2).
assert.equal(hydrateCatalogUrl(index, '?catalog=real').state, 'empty');
assert.equal(hydrateCatalogUrl(index, '?catalog=synthetic&page=2').state, 'empty');
// …while a duplicated selection parameter is still malformed state.
assert.equal(hydrateCatalogUrl(index, '?catalog=real&catalog=synthetic').state, 'invalid_url_state');
// v2 links still hydrate (legacy fixed vocabulary).
const legacy = hydrateCatalogUrl(index, url('q=M4+screws&diameter_mm=4'));
assert.equal(legacy.state, 'ready');
// f_ parameters do not exist in v2 links.
assert.equal(hydrateCatalogUrl(index, url('q=screws&f_material=a2_stainless')).state, 'invalid_url_state');

console.log('catalog engine URL/history tests: ok');
