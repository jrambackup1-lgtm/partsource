import assert from 'node:assert/strict';
import {
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
  assert.equal(explicit.resolution.records.length, 6);
  assert.deepEqual(explicit.resolution.filters.map(filter => [filter.factId, filter.value]), [['nominal_diameter_mm', 4]]);
}
const removedQueryFilter = hydrateCatalogUrl(index, url('q=M4+screws'));
assert.equal(removedQueryFilter.state, 'ready');
if (removedQueryFilter.state === 'ready') assert.equal(removedQueryFilter.resolution.records.length, 30);

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

const validSelection = hydrateCatalogUrl(index, url('q=screws&selected=synrec-v1-shcs-01&selected_revision=synrec-v1-shcs-01%3Ar1'));
assert.equal(validSelection.state, 'ready');
if (validSelection.state === 'ready') assert.equal(validSelection.resolution.detail?.configurationId, 'synrec-v1-shcs-01');
const invalidSelection = hydrateCatalogUrl(index, url('q=screws&selected=synrec-v1-shcs-01&selected_revision=synrec-v1-shcs-02%3Ar1'));
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

console.log('catalog engine URL/history tests: ok');
