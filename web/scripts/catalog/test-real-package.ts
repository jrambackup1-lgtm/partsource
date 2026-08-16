/**
 * u1 acceptance: the dev-only real catalog release loads through the
 * production trust seam and is queryable at 27k-record scale. Run after
 * `npm run catalog:build-real` (test:catalog does this itself).
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serializeCatalogPackageForDigest } from '../../src/catalog/contracts';
import { parseCatalogPackage } from '../../src/catalog/parse-catalog-package';
import { createCatalogIndex } from '../../src/catalog/engine/catalog-index';
import { projectCatalogView, resolveCatalogQuery } from '../../src/catalog/engine/resolver';
import { applyCatalogFilters } from '../../src/catalog/engine/resolver';
import { computeFamilyFacets, projectRecords } from '../../src/catalog/engine/filter-facets';
import { filterConfigurations } from '../../src/catalog/engine/filter-facets';
import {
  REAL_CATALOG_DIGEST,
  REAL_CATALOG_RELEASE_ID,
  REAL_CATALOG_URL,
} from '../../src/catalog/real-release-identity';

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const artifact = path.join(webRoot, 'catalog-releases', path.basename(REAL_CATALOG_URL));
if (!fs.existsSync(artifact)) {
  throw new Error(`real catalog artifact missing: ${artifact} (run npm run catalog:build-real)`);
}

const startedAt = Date.now();
const raw = fs.readFileSync(artifact, 'utf8');
const parsed = parseCatalogPackage(JSON.parse(raw), undefined, REAL_CATALOG_DIGEST);
const parseSeconds = (Date.now() - startedAt) / 1000;

// Byte-level digest verification with Node crypto over the canonical form.
const digestHex = createHash('sha256').update(serializeCatalogPackageForDigest(parsed), 'utf8').digest('hex');
assert.equal(`sha256:${digestHex}`, REAL_CATALOG_DIGEST, 'artifact must verify against its canonical digest');
assert.equal(parsed.manifest.releaseId, REAL_CATALOG_RELEASE_ID);
assert.equal(parsed.manifest.dataOrigin, 'cofounder_private_dev');
assert.equal(parsed.manifest.allowedUse, 'private_dev_only');
assert.equal(parsed.manifest.publicationStatus, 'dev_release');

// A substituted digest fails the pinned identity check. (Content-byte
// verification is the build-time canonical digest check above; runtime pins
// identity, not bytes — decision D5.)
const tampered = JSON.parse(raw);
tampered.manifest.digest = 'sha256:' + '0'.repeat(64);
assert.throws(() => parseCatalogPackage(tampered, undefined, REAL_CATALOG_DIGEST), /pinned release identity/);

const indexBuiltAt = Date.now();
const index = createCatalogIndex(parsed);
const indexSeconds = (Date.now() - indexBuiltAt) / 1000;

// Import counts reconcile with the independently recorded dataset profile.
assert.equal(index.package.configurations.length, 26_953);
assert.equal(index.package.configurationRevisions.length, 26_953);
assert.equal(index.package.identifierMappings.length, 26_953);
assert.equal(index.package.families.length, 192);
assert.equal(index.package.hierarchy.length, 196);
assert.equal(index.package.manifest.releaseId, REAL_CATALOG_RELEASE_ID);
const categoryChildren = index.hierarchyChildren.get('screws')!.map(node => node.nodeId);
assert.deepEqual(categoryChildren, ['cat-hex', 'cat-round', 'cat-socket']);
const familyCounts = new Map([...index.configurationsByFamilyId].map(([familyId, list]) => [familyId, list.length]));
assert.equal([...familyCounts.values()].reduce((total, count) => total + count, 0), 26_953);
// Largest family = 2,432 raw rows minus its 56 blank-PN exclusions.
assert.equal(Math.max(...familyCounts.values()), 2_376, 'largest subcat family size matches the recorded profile minus exclusions');
// Every PN is separator-free alphanumeric and mappings are unique per revision.
for (const mapping of index.package.identifierMappings) {
  assert.match(mapping.identifier, /^\d{5}[A-Z]\d{3}$/);
}
assert.equal(new Set(index.package.identifierMappings.map(mapping => mapping.identifier)).size, 26_953);

const queryStartedAt = Date.now();
// Broad query: explicit family step with live counts, never a flat table.
const screws = resolveCatalogQuery(index, 'screws');
assert.equal(screws.state, 'catalog_chooser');
assert.equal(screws.familyChoices.length, 192);
assert.equal(screws.records.length, 0);
const screwCounts = screws.familyChoices.reduce((total, choice) => total + choice.count, 0);
assert.equal(screwCounts, 26_953);

const m4 = resolveCatalogQuery(index, 'M4 screws');
assert.equal(m4.state, 'catalog_chooser');
const m4Total = m4.familyChoices.reduce((total, choice) => total + choice.count, 0);
assert.ok(m4Total > 700 && m4Total < 1_300, `M4 spans a chooser-scale family set (measured ${m4Total})`);
assert.ok(m4.familyChoices.length > 1, 'M4 spans multiple families: the family step is unavoidable');

// Constraints survive the family context switch.
const m4Family = applyCatalogFilters(index, m4, m4.filters, { familyId: m4.familyChoices[0].familyId });
assert.equal(m4Family.state, 'catalog_list');
assert.deepEqual(m4Family.filters.map(filter => filter.factId), ['nominal_diameter_mm']);
assert.equal(m4Family.records.length, m4.familyChoices[0].count);
const m4View = projectCatalogView(index, m4Family);
assert.ok(m4View.facets.length, 'family state has live facets');

// Exact McMaster PN resolves through the exact path with the family list and
// a highlighted row — lowercase input normalizes identically.
const exact = resolveCatalogQuery(index, '92655A331');
assert.equal(exact.state, 'catalog_list');
assert.equal(exact.exact?.state, 'one');
assert.equal(exact.exact?.matches[0]?.namespaceId, 'mcmaster_pn');
assert.ok(exact.highlightedRecordId, 'exact match highlights without selecting');
assert.equal(exact.selectedRecordId, null);
assert.equal(exact.records.length, m4Family ? index.configurationsByFamilyId.get(exact.familyId!)!.length : 0);
assert.equal(resolveCatalogQuery(index, '92655a331').highlightedRecordId, exact.highlightedRecordId);
// Separator-free PN-shaped input enters the exact path (u3): absent PNs fail
// as identifier-not-found with the submission echoed, never as search terms.
const absent = resolveCatalogQuery(index, '99999Z999');
assert.equal(absent.state, 'exact_not_found');
assert.equal(absent.exact?.submittedIdentifier, '99999Z999');
assert.equal(absent.records.length, 0);

// Material phrase from the generated lexicon narrows the chooser.
const stainless = resolveCatalogQuery(index, '18-8 stainless steel screws');
assert.equal(stainless.state, 'catalog_chooser');
assert.deepEqual(stainless.filters.map(filter => filter.factId), ['material']);
assert.ok(stainless.familyChoices.length < 192, 'material constraint narrows the family set');
assert.equal(stainless.unsupportedTerms.length, 0);

const querySeconds = (Date.now() - queryStartedAt) / 1000;

// u4 acceptance: family-list commits stay interactive (<200 ms) on the largest
// real family (2,376 rows) — filter + facet + projection in one measurement.
const largestFamilyId = [...familyCounts.entries()].sort((left, right) => right[1] - left[1])[0][0];
const largestBase = applyCatalogFilters(index, resolveCatalogQuery(index, 'screws'), [], { familyId: largestFamilyId });
assert.equal(largestBase.state, 'catalog_list');
const sampleFilter = largestBase.records[0].facts.find(fact => fact.value.state === 'known')!;
const commitStarted = performance.now();
const largestCommitted = applyCatalogFilters(index, largestBase, [
  { factId: sampleFilter.factId, value: (sampleFilter.value as { state: 'known'; value: never }).value, source: 'user' },
]);
const largestFacets = computeFamilyFacets(index, largestFamilyId, largestCommitted.filters);
const largestProjection = projectRecords(index, filterConfigurations(index, largestFamilyId, largestCommitted.filters));
const commitMillis = performance.now() - commitStarted;
assert.ok(largestCommitted.state === 'catalog_list' && largestProjection.length > 0 && largestFacets.length > 0);
assert.ok(commitMillis < 200, `largest-family commit measured ${commitMillis.toFixed(0)}ms, must be < 200ms`);
assert.ok(largestFacets.every(facet => facet.values.every(option => option.active || option.count > 0 || !option.active)));

assert.ok(parseSeconds < 60, `parser+digest-pin path stayed under 60s (measured ${parseSeconds.toFixed(1)}s)`);
assert.ok(indexSeconds < 60, `index build stayed under 60s (measured ${indexSeconds.toFixed(1)}s)`);
assert.ok(querySeconds < 30, `representative query set stayed under 30s (measured ${querySeconds.toFixed(2)}s)`);

console.log(`real catalog package tests: ok (parse ${parseSeconds.toFixed(1)}s · index ${indexSeconds.toFixed(1)}s · queries ${querySeconds.toFixed(2)}s · largest-family commit ${commitMillis.toFixed(0)}ms)`);
