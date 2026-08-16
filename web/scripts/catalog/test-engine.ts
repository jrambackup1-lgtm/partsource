import assert from 'node:assert/strict';
import {
  SYNTHETIC_CATALOG_PACKAGE,
  applyCatalogFilters,
  buildSyntheticCatalogPackageInput,
  computeFamilyFacets,
  createCatalogIndex,
  parseCatalogPackage,
  projectCatalogView,
  resolveCatalogQuery,
  resolveExactIdentifier,
  selectCatalogRecord,
  type CatalogFilter,
} from '../../src/catalog/index';
const index = createCatalogIndex(SYNTHETIC_CATALOG_PACKAGE);
const resolve = (query: string) => resolveCatalogQuery(index, query);
const ids = (query: string) => resolve(query).records.map(record => record.configurationId);

assert.equal(index.configurationsById.size, 30);
const exposedMaps: readonly ReadonlyMap<unknown, unknown>[] = [
  index.hierarchyById, index.hierarchyChildren, index.hierarchyPathById, index.familiesById,
  index.schemasById, index.currentSchemaByFamilyId, index.factDefinitionsById, index.facetsByFamilyId,
  index.configurationsById, index.configurationsByFamilyId, index.revisionsById,
  index.mappingsByQualifiedIdentifier, index.mappingsByNormalizedIdentifier, index.provenanceById,
  index.configurationsById.values().next().value!.facts,
];
for (const exposed of exposedMaps) {
  const mutable = exposed as Map<unknown, unknown>;
  assert.throws(() => mutable.clear(), /immutable/);
  assert.throws(() => mutable.set('mutation', 'mutation'), /immutable/);
  assert.throws(() => mutable.delete('mutation'), /immutable/);
}
assert.equal(index.hierarchyPathById.get('family_node_css')?.map(node => node.nodeId).join('/'), 'screws/hex_socket_screws/family_node_css');

// Broad catalog input makes the family step explicit (u2): a category-level
// query renders matching families with live counts, never a flattened
// mixed-family record table.
const broadScrews = resolve('screws');
assert.equal(broadScrews.state, 'catalog_chooser');
assert.deepEqual(broadScrews.familyChoices.map(choice => [choice.familyId, choice.count]), [
  ['shcs', 10], ['bhss', 10], ['css', 10],
]);
assert.equal(broadScrews.records.length, 0, 'chooser state must not flatten family records');
assert.equal(broadScrews.familyId, null);

const broadM4 = resolve('M4 screws');
assert.equal(broadM4.state, 'catalog_chooser');
assert.deepEqual(broadM4.familyChoices.map(choice => [choice.familyId, choice.count]), [
  ['shcs', 2], ['bhss', 2], ['css', 2],
], 'chooser counts are constraint-aware');
assert.deepEqual(broadM4.filters.map(filter => [filter.factId, filter.value]), [['nominal_diameter_mm', 4]]);

// Choosing a family is a context switch: query-derived constraints survive.
const choseBhss = applyCatalogFilters(index, broadM4, broadM4.filters, { familyId: 'bhss' });
assert.equal(choseBhss.state, 'catalog_list');
assert.equal(choseBhss.familyId, 'bhss');
assert.deepEqual(choseBhss.filters.map(filter => [filter.factId, filter.value]), [['nominal_diameter_mm', 4]]);
assert.deepEqual(choseBhss.records.map(record => record.configurationId), ['synrec-v1-bhss-01', 'synrec-v1-bhss-02']);

// Exactly one matching family opens directly (u2 shortcut): proven below on a
// purpose-built single-family package; the shipped synthetic fixture has three
// data-identical families, so no typed query can reach a single match.

// Removing a constraint at category level recomputes the chooser.
const chooserNoFinish = applyCatalogFilters(index, resolve('A2 stainless screws'), [], { familyId: null });
assert.equal(chooserNoFinish.state, 'catalog_chooser');
assert.deepEqual(chooserNoFinish.familyChoices.map(choice => choice.familyId), ['shcs', 'bhss', 'css']);

const family = resolve('socket head cap screws');
assert.equal(family.state, 'catalog_list');
assert.equal(family.familyId, 'shcs');
assert.deepEqual(family.hierarchyPath.map(node => node.nodeId), ['screws', 'hex_socket_screws', 'family_node_shcs']);
assert.equal(family.records.length, 10);
assert.equal(family.highlightedRecordId, null, 'family search must not highlight');
assert.equal(family.selectedRecordId, null, 'family search must not select');

for (const shortQuery of ['socket head screw', 'socket head screws']) {
  const shortFamily = resolve(shortQuery);
  assert.equal(shortFamily.state, 'catalog_list');
  assert.equal(shortFamily.familyId, 'shcs');
  assert.equal(shortFamily.records.length, 10);
  assert.equal(shortFamily.highlightedRecordId, null);
  assert.equal(shortFamily.selectedRecordId, null);
}
assert.equal(resolve('socket head').state, 'query_unsupported', 'generic head text remains unsupported');

const typed = resolve('M6x1 20 mm A2 stainless socket head cap screws');
assert.equal(typed.state, 'catalog_list');
assert.deepEqual(typed.filters.map(filter => [filter.factId, filter.value]), [
  ['nominal_diameter_mm', 6], ['pitch_mm', 1], ['length_mm', 20], ['material', 'a2_stainless'],
]);
assert.deepEqual(typed.records.map(record => record.configurationId), ['synrec-v1-shcs-06']);
assert.equal(typed.highlightedRecordId, null, 'one non-exact result still has no highlight');
assert.equal(typed.detail, null);

const empty = resolve('M4 40 mm socket head cap screws');
assert.equal(empty.state, 'catalog_empty');
assert.equal(empty.records.length, 0);

const exact = resolve('  psyn-scr-0006  ');
assert.equal(exact.state, 'catalog_list');
assert.equal(exact.exact?.state, 'one');
assert.equal(exact.familyId, 'shcs');
assert.equal(exact.records.length, 10);
assert.equal(exact.highlightedRecordId, 'synrec-v1-shcs-06');
assert.equal(exact.selectedRecordId, null);
assert.equal(exact.detail, null, 'exact lookup must not open detail');
assert.equal(projectCatalogView(index, exact).exactMatchRecordId, 'synrec-v1-shcs-06');

const namespaced = resolveExactIdentifier(index, 'partsource_synthetic_v1', '  psyn-scr-0006  ');
assert.equal(namespaced.state, 'one');
assert.deepEqual(namespaced.configurationIds, ['synrec-v1-shcs-06']);
assert.equal(resolveExactIdentifier(index, 'missing_namespace', 'PSYN-SCR-0006').state, 'zero');

const unknown = resolve('PSYN-SCR-9999');
assert.equal(unknown.state, 'exact_not_found');
assert.equal(unknown.records.length, 0);
assert.equal(unknown.familyId, null);
assert.equal(unknown.highlightedRecordId, null);
// Namespace-pattern recognition (u3): identifier-shaped input with fewer
// separators than the legacy heuristic still enters the exact path.
const shapedUnknown = resolve('psyn-x1');
assert.equal(shapedUnknown.state, 'exact_not_found');
assert.equal(shapedUnknown.exact?.submittedIdentifier, 'psyn-x1');

const collision = resolve('PSYN-SCR-COLLIDE');
assert.equal(collision.state, 'exact_non_unique');
assert.equal(collision.exact?.state, 'many');
assert.deepEqual(collision.exact?.configurationIds, ['synrec-v1-shcs-06', 'synrec-v1-bhss-06']);
assert.equal(collision.records.length, 0);
assert.equal(collision.highlightedRecordId, null);

const conflict = resolve('M4 M6 socket head cap screws');
assert.equal(conflict.state, 'query_conflict');
assert.deepEqual(conflict.conflicts.find(item => item.field === 'nominal_diameter_mm')?.values, [4, 6]);
assert.equal(conflict.records.length, 0);
const familyConflict = resolve('socket head cap screws button head socket screws');
assert.equal(familyConflict.state, 'query_conflict');
assert.deepEqual(familyConflict.hierarchyPath.map(node => node.nodeId), ['screws', 'hex_socket_screws'], 'family conflict stops at deepest common safe category');
assert.equal(familyConflict.familyId, null);
assert.equal(familyConflict.records.length, 0);

// Partial application (u2): recognized typed facts apply while unrecognized
// terms remain visible query text; negation words still fail the whole query.
const partial = resolve('M6 socket head cap screw 20mm A2');
assert.equal(partial.state, 'catalog_list');
assert.equal(partial.familyId, 'shcs');
assert.deepEqual(partial.filters.map(filter => [filter.factId, filter.value]), [
  ['nominal_diameter_mm', 6], ['length_mm', 20],
]);
assert.deepEqual(partial.unsupportedTerms, ['a2']);
assert.deepEqual(partial.records.map(record => record.configurationId), ['synrec-v1-shcs-06']);
for (const nothingRecognized of ['M3', 'titanium bolts', 'gr5 fasteners']) {
  const unsupported = resolve(nothingRecognized);
  assert.equal(unsupported.state, 'query_unsupported', `${nothingRecognized} must fail closed`);
  assert.equal(unsupported.records.length, 0);
}
// Uninterpreted negation never applies the adjacent constraint.
assert.equal(resolve('M4 screws not black oxide').state, 'query_unsupported');
assert.equal(resolve('M4 screws not black oxide').records.length, 0);
// A partially recognized broad query lands on the chooser with kept text.
const keptText = resolve('stainless screws');
assert.equal(keptText.state, 'catalog_chooser');
assert.deepEqual(keptText.unsupportedTerms, ['stainless']);
assert.equal(keptText.records.length, 0);
for (const unsafe of ['PSYN-SCR-0006 extra', 'prefix PSYN-SCR-0006', 'M4 or M6 screws', 'M4 screws not black oxide']) {
  const resolution = resolve(unsafe);
  assert.notEqual(resolution.exact?.state, 'one');
  assert.equal(resolution.records.length, 0);
  assert.equal(resolution.selectedRecordId, null);
}

const filters: readonly CatalogFilter[] = [
  { factId: 'nominal_diameter_mm', value: 6 },
  { factId: 'material', value: 'a2_stainless' },
  { factId: 'length_mm', value: 20 },
];
const narrowed = applyCatalogFilters(index, family, filters);
assert.deepEqual(narrowed.records.map(record => record.configurationId), ['synrec-v1-shcs-06'], 'filters are strict AND');
assert.equal(applyCatalogFilters(index, family, [{ factId: 'material', value: 'titanium' }]).state, 'invalid_filter');
assert.equal(applyCatalogFilters(index, family, [{ factId: 'countersink_angle_deg', value: 90 }]).state, 'invalid_filter', 'family-field leakage fails closed');

const facetResolution = resolve('M6 A2 stainless socket head cap screws');
const facets = computeFamilyFacets(index, 'shcs', facetResolution.filters);
assert.deepEqual(facets.map(facet => facet.factId), ['nominal_diameter_mm', 'pitch_mm', 'length_mm', 'material', 'finish']);
const diameterFacet = facets.find(facet => facet.factId === 'nominal_diameter_mm')!;
assert.deepEqual(diameterFacet.values.map(item => [item.value, item.count]), [[4, 1], [5, 1], [6, 2], [8, 2]], 'facet counts exclude their own active filter');
const materialFacet = facets.find(facet => facet.factId === 'material')!;
assert.deepEqual(materialFacet.values.map(item => [item.value, item.count]), [['a2_stainless', 2], ['alloy_steel', 1]]);
assert.equal(computeFamilyFacets(index, 'missing', []).length, 0);

const selectedOther = selectCatalogRecord(index, exact, 'synrec-v1-shcs-05');
assert.equal(selectedOther.highlightedRecordId, 'synrec-v1-shcs-06', 'exact highlight survives a different explicit selection');
assert.equal(selectedOther.selectedRecordId, 'synrec-v1-shcs-05');
assert.equal(selectedOther.detail?.configurationId, 'synrec-v1-shcs-05');
assert.equal(selectedOther.detail?.facts.find(fact => fact.factId === 'length_datum')?.value.state, 'known');
assert.ok(selectedOther.detail?.provenance.length);
const invalidSelection = selectCatalogRecord(index, exact, 'synrec-v1-bhss-01');
assert.equal(invalidSelection.state, 'invalid_selection');
assert.equal(invalidSelection.selectedRecordId, null);
assert.equal(invalidSelection.detail, null);
const removesHighlight = applyCatalogFilters(index, selectedOther, [{ factId: 'nominal_diameter_mm', value: 4 }]);
assert.equal(removesHighlight.highlightedRecordId, null);
assert.equal(removesHighlight.selectedRecordId, null);

const prohibited = new Set(['supplier', 'suppliers', 'price', 'stock', 'availability', 'equivalent', 'equivalence', 'suitability']);
const rejectProhibitedKeys = (value: unknown): void => {
  if (Array.isArray(value)) return value.forEach(rejectProhibitedKeys);
  if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) {
    assert.ok(!prohibited.has(key.toLowerCase()), `prohibited engine field: ${key}`);
    rejectProhibitedKeys(child);
  }
};
rejectProhibitedKeys(projectCatalogView(index, selectedOther));

// Single-family-match shortcut on a purpose-built package whose broad query
// matches exactly one family: the chooser is skipped, no forced extra click.
const singleFamilyInput = buildSyntheticCatalogPackageInput() as {
  hierarchy: unknown[]; families: { familyId: string }[]; familySchemaRevisions: { familyId: string }[];
  facets: { familySchemaRevisionId: string }[]; configurations: { familyId: string; currentRevisionId: string }[];
  configurationRevisions: { familyId: string; configurationRevisionId: string }[];
  identifierMappings: { configurationRevisionId: string }[]; lexicon: { targetId: string }[];
};
const cssOnly = {
  ...singleFamilyInput,
  hierarchy: singleFamilyInput.hierarchy.filter(node => (node as { nodeId: string }).nodeId !== 'family_node_shcs' && (node as { nodeId: string }).nodeId !== 'family_node_bhss'),
  families: singleFamilyInput.families.filter(family => family.familyId === 'css'),
  familySchemaRevisions: singleFamilyInput.familySchemaRevisions.filter(schema => schema.familyId === 'css'),
  facets: singleFamilyInput.facets.filter(facet => facet.familySchemaRevisionId === 'family-schema:css:r1'),
  configurations: singleFamilyInput.configurations.filter(configuration => configuration.familyId === 'css'),
  configurationRevisions: singleFamilyInput.configurationRevisions.filter(revision => revision.familyId === 'css'),
  identifierMappings: singleFamilyInput.identifierMappings.filter(mapping => mapping.configurationRevisionId.startsWith('synrec-v1-css')),
  lexicon: singleFamilyInput.lexicon.filter(rule => !['shcs', 'bhss'].includes(rule.targetId)),
};
const cssIndex = createCatalogIndex(parseCatalogPackage(cssOnly));
const shortcut = resolveCatalogQuery(cssIndex, 'screws');
assert.equal(shortcut.state, 'catalog_list', 'exactly one matching family opens its list directly');
assert.equal(shortcut.familyId, 'css');
assert.equal(shortcut.records.length, 10);
assert.deepEqual(shortcut.familyChoices, []);
const shortcutConstrained = resolveCatalogQuery(cssIndex, 'M4 screws');
assert.equal(shortcutConstrained.state, 'catalog_list');
assert.equal(shortcutConstrained.familyId, 'css');
assert.deepEqual(shortcutConstrained.records.map(record => record.configurationId), ['synrec-v1-css-01', 'synrec-v1-css-02']);

// --- u4: multi-select facets (OR within a fact, AND across facts) ----------
const orFilters: readonly CatalogFilter[] = [
  { factId: 'material', value: 'a2_stainless', source: 'user' },
  { factId: 'material', value: 'alloy_steel', source: 'user' },
];
const orResolution = applyCatalogFilters(index, family, orFilters);
assert.equal(orResolution.state, 'catalog_list');
assert.equal(orResolution.records.length, 10, 'material OR returns the full family');
const orFacets = computeFamilyFacets(index, 'shcs', orFilters);
const orMaterial = orFacets.find(facet => facet.factId === 'material')!;
assert.deepEqual(orMaterial.values.map(item => [item.value, item.count, item.active]), [
  ['a2_stainless', 6, true], ['alloy_steel', 4, true],
], 'disjunctive counts keep both active values live');
const andAcross = applyCatalogFilters(index, family, [
  ...orFilters,
  { factId: 'nominal_diameter_mm', value: 6, source: 'user' },
]);
assert.equal(andAcross.records.length, 3, 'OR within material AND diameter 6');
assert.equal(applyCatalogFilters(index, family, [
  { factId: 'material', value: 'a2_stainless', source: 'user' },
  { factId: 'material', value: 'a2_stainless', source: 'user' },
]).state, 'invalid_filter', 'exactly repeated filter values are malformed');
const diameters = computeFamilyFacets(index, 'shcs', [{ factId: 'material', value: 'a2_stainless', source: 'user' }])
  .find(facet => facet.factId === 'nominal_diameter_mm')!;
assert.deepEqual(diameters.values.map(item => [item.value, item.count]), [[4, 1], [5, 1], [6, 2], [8, 2]], 'facet counts exclude their own fact only');

console.log('catalog production engine tests: ok');
