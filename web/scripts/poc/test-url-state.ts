import * as assert from 'node:assert/strict';
import { POC_BUNDLE } from '../../src/poc/fixture';
import { hydratePocUrl, serializePocUrl } from '../../src/poc/url-state';
import { resolveQuery } from '../../src/poc/resolver';

const exact = resolveQuery(POC_BUNDLE, 'PSYN-SCR-0006');
assert.equal(serializePocUrl(exact, 'synrec-v1-shcs-06'), '?v=1&q=PSYN-SCR-0006&family=shcs&selected=synrec-v1-shcs-06');
const hydrated = hydratePocUrl(POC_BUNDLE, '?v=1&q=M4+screws&diameter_mm=4');
assert.equal(hydrated.state, 'ready'); if (hydrated.state === 'ready') assert.equal(hydrated.resolution.records.length, 6);
const preV1 = hydratePocUrl(POC_BUNDLE, '?q=M4+screws');
assert.equal(preV1.state, 'ready'); if (preV1.state === 'ready') { assert.equal(preV1.canonical, true); assert.equal(preV1.resolution.filters[0].value, 4); }
const v1Override = hydratePocUrl(POC_BUNDLE, '?v=1&q=M4+screws');
assert.equal(v1Override.state, 'ready'); if (v1Override.state === 'ready') assert.equal(v1Override.resolution.records.length, 30);
const unsafeQuery = hydratePocUrl(POC_BUNDLE, '?v=1&q=M6+titanium+socket+head+screws&family=shcs&diameter_mm=6');
assert.equal(unsafeQuery.state, 'ready'); if (unsafeQuery.state === 'ready') { assert.equal(unsafeQuery.resolution.state, 'query_unsupported'); assert.equal(unsafeQuery.resolution.records.length, 0); }
const exactCanonical = hydratePocUrl(POC_BUNDLE, '?v=1&q=PSYN-SCR-0006&family=shcs');
assert.equal(exactCanonical.state, 'ready'); if (exactCanonical.state === 'ready') { assert.equal(exactCanonical.resolution.familyId, 'shcs'); assert.equal(exactCanonical.resolution.records.length, 10); assert.equal(exactCanonical.resolution.highlightedRecordId, 'synrec-v1-shcs-06'); }
const exactSelected = hydratePocUrl(POC_BUNDLE, '?v=1&q=PSYN-SCR-0006&family=shcs&selected=synrec-v1-shcs-05');
assert.equal(exactSelected.state, 'ready'); if (exactSelected.state === 'ready') { assert.equal(exactSelected.selectedRecordId, 'synrec-v1-shcs-05'); assert.equal(exactSelected.resolution.detailOpen, true); assert.equal(exactSelected.resolution.highlightedRecordId, 'synrec-v1-shcs-06'); }
assert.equal(hydratePocUrl(POC_BUNDLE, '?v=1&q=PSYN-SCR-0006&family=bhss').state, 'invalid_url_state');
assert.equal(hydratePocUrl(POC_BUNDLE, '?q=screws&material=titanium').state, 'invalid_url_state');
assert.equal(hydratePocUrl(POC_BUNDLE, '?v=1&q=screws&material=titanium').state, 'invalid_url_state');
assert.equal(hydratePocUrl(POC_BUNDLE, '?v=1&q=screws&selected=synrec-v1-shcs-01').state, 'ready');
assert.equal(hydratePocUrl(POC_BUNDLE, '?v=1&q=screws&selected=PSYN-SCR-0001').state, 'invalid_selection');
assert.equal(hydratePocUrl(POC_BUNDLE, '?v=1&q=screws&q=M4').state, 'invalid_url_state');
assert.equal(hydratePocUrl(POC_BUNDLE, '?v=1&q=%E0%A4').state, 'invalid_url_state');
assert.equal(hydratePocUrl(POC_BUNDLE, '?v=1&q=socket%20head%20screws&family=bhss').state, 'invalid_url_state');
console.log('POC URL-state contract passed.');
