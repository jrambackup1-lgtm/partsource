import type { CatalogRecord, FactField, Family, IdentifierMapping, PocBundle } from './types';
import { SYNTHETIC_NOTICE } from './types';

const recordKeys = ['recordId', 'familyId', 'threadSystem', 'nominalDiameterMm', 'pitchMm', 'lengthMm', 'lengthDatum', 'material', 'finish', 'drive', 'headProfile', 'provenanceBundleId', 'provenanceKind', 'displayedFactProvenance'];
const mappingKeys = ['mappingId', 'namespace', 'identifierValue', 'recordId', 'provenanceBundleId', 'provenanceKind'];
const familyKeys = ['id', 'displayName', 'headProfile', 'lengthDatum', 'countersinkAngleDeg'];
const bundleKeys = ['manifest', 'families', 'records', 'mappings'];
const manifestKeys = ['bundleId', 'version', 'authoringDate', 'origin', 'allowedUse', 'factProvenance', 'mappingProvenance', 'visibleNotice'];
const factProvenanceKeys = ['field', 'provenanceBundleId', 'provenanceKind', 'support'];
const factFields: FactField[] = ['familyId', 'threadSystem', 'nominalDiameterMm', 'pitchMm', 'lengthMm', 'lengthDatum', 'material', 'finish', 'drive', 'headProfile'];
const tupleKey = (record: CatalogRecord) => [record.nominalDiameterMm, record.pitchMm, record.lengthMm, record.material, record.finish].join('|');
const expectedTuples = ['4|0.7|12|a2_stainless|passivated', '4|0.7|20|alloy_steel|black_oxide', '5|0.8|16|a2_stainless|passivated', '5|0.8|25|alloy_steel|black_oxide', '6|1|16|a2_stainless|passivated', '6|1|20|a2_stainless|passivated', '6|1|30|alloy_steel|black_oxide', '8|1.25|20|a2_stainless|passivated', '8|1.25|30|alloy_steel|black_oxide', '8|1.25|40|a2_stainless|passivated'];
const expectedFamilies: Record<'shcs' | 'bhss' | 'css', Family> = {
  shcs: { id: 'shcs', displayName: 'Socket-head cap screws', headProfile: 'cylindrical', lengthDatum: 'under_head', countersinkAngleDeg: null },
  bhss: { id: 'bhss', displayName: 'Button-head socket screws', headProfile: 'button', lengthDatum: 'under_head', countersinkAngleDeg: null },
  css: { id: 'css', displayName: 'Countersunk socket screws', headProfile: 'countersunk_90', lengthDatum: 'overall', countersinkAngleDeg: 90 },
};

function requireExactKeys(value: Record<string, unknown>, keys: string[], label: string) {
  const unknown = Object.keys(value).filter(key => !keys.includes(key));
  if (unknown.length) throw new Error(`unknown ${label} field: ${unknown.join(', ')}`);
  const absent = keys.filter(key => !(key in value));
  if (absent.length) throw new Error(`missing ${label} field: ${absent.join(', ')}`);
}
function unique(values: string[], label: string) { if (new Set(values).size !== values.length) throw new Error(`duplicate ${label}`); }
function normalizedId(value: string) { return value.trim().replace(/[a-z]/g, char => char.toUpperCase()); }

export function validateBundle(bundle: PocBundle): PocBundle {
  requireExactKeys(bundle as unknown as Record<string, unknown>, bundleKeys, 'bundle');
  const { manifest } = bundle;
  requireExactKeys(manifest as unknown as Record<string, unknown>, manifestKeys, 'manifest');
  if (manifest.bundleId !== 'PS-POC-SYNTHETIC-V1' || manifest.version !== 1 || manifest.authoringDate !== '2026-08-11' || manifest.origin !== 'blank_slate_synthetic' || manifest.allowedUse !== 'local_poc_and_acceptance_benchmark' || manifest.factProvenance !== 'synthetic_fixture' || manifest.mappingProvenance !== 'synthetic_identifier' || manifest.visibleNotice !== SYNTHETIC_NOTICE) throw new Error('invalid POC manifest');
  if (bundle.families.length !== 3 || bundle.records.length !== 30 || bundle.mappings.length !== 32) throw new Error('invalid POC bundle count');
  bundle.families.forEach(family => requireExactKeys(family as unknown as Record<string, unknown>, familyKeys, 'family'));
  bundle.records.forEach(record => requireExactKeys(record as unknown as Record<string, unknown>, recordKeys, 'record'));
  bundle.mappings.forEach(mapping => requireExactKeys(mapping as unknown as Record<string, unknown>, mappingKeys, 'mapping'));
  unique(bundle.records.map(record => record.recordId), 'record ID'); unique(bundle.mappings.map(mapping => mapping.mappingId), 'mapping ID');
  const familyById = new Map(bundle.families.map(family => [family.id, family]));
  if (familyById.size !== 3) throw new Error('invalid family IDs');
  for (const record of bundle.records) {
    const family = familyById.get(record.familyId);
    if (!family || record.threadSystem !== 'metric' || ![4, 5, 6, 8].includes(record.nominalDiameterMm) || ![0.7, 0.8, 1, 1.25].includes(record.pitchMm) || !Number.isFinite(record.lengthMm) || record.lengthMm <= 0 || !['a2_stainless', 'alloy_steel'].includes(record.material) || !['passivated', 'black_oxide'].includes(record.finish) || record.drive !== 'internal_hex' || record.lengthDatum !== family.lengthDatum || record.headProfile !== family.headProfile || record.provenanceBundleId !== 'PS-POC-SYNTHETIC-V1' || record.provenanceKind !== 'synthetic_fixture') throw new Error('invalid record');
    if (!Array.isArray(record.displayedFactProvenance) || record.displayedFactProvenance.length !== factFields.length) throw new Error('missing displayed fact provenance');
    const factProvenanceFields = new Set(record.displayedFactProvenance.map(fact => fact.field));
    if (!factFields.every(field => factProvenanceFields.has(field))) throw new Error('missing displayed fact provenance');
    for (const fact of record.displayedFactProvenance) {
      requireExactKeys(fact as unknown as Record<string, unknown>, factProvenanceKeys, 'displayed fact provenance');
      if (!factFields.includes(fact.field) || fact.provenanceBundleId !== 'PS-POC-SYNTHETIC-V1' || fact.provenanceKind !== 'synthetic_fact' || fact.support !== 'fixture-authored synthetic value') throw new Error('invalid displayed fact provenance');
    }
  }
  for (const family of bundle.families) {
    const expected = expectedFamilies[family.id];
    if (!expected || family.displayName !== expected.displayName || family.headProfile !== expected.headProfile || family.lengthDatum !== expected.lengthDatum || family.countersinkAngleDeg !== expected.countersinkAngleDeg) throw new Error('invalid family');
    const familyRecords = bundle.records.filter(record => record.familyId === family.id);
    if (familyRecords.length !== 10 || new Set(familyRecords.map(tupleKey)).size !== 10 || !expectedTuples.every(tuple => familyRecords.some(record => tupleKey(record) === tuple))) throw new Error('invalid family tuples');
  }
  const expectedRecordIds = (Object.keys(expectedFamilies) as Array<keyof typeof expectedFamilies>).flatMap(family => expectedTuples.map((_, index) => `synrec-v1-${family}-${String(index + 1).padStart(2, '0')}`));
  if (bundle.records.some(record => !expectedRecordIds.includes(record.recordId))) throw new Error('invalid record ID');
  const recordIds = new Set(bundle.records.map(record => record.recordId));
  for (const mapping of bundle.mappings) {
    if (!recordIds.has(mapping.recordId)) throw new Error('mapping references absent record');
    if (typeof mapping.identifierValue !== 'string' || !mapping.identifierValue.trim() || mapping.namespace !== 'partsource_synthetic_v1' || mapping.provenanceBundleId !== 'PS-POC-SYNTHETIC-V1' || mapping.provenanceKind !== 'synthetic_identifier') throw new Error('invalid mapping');
  }
  const byIdentifier = new Map<string, IdentifierMapping[]>();
  for (const mapping of bundle.mappings) { const key = normalizedId(mapping.identifierValue); byIdentifier.set(key, [...(byIdentifier.get(key) ?? []), mapping]); }
  if (byIdentifier.size !== 31 || byIdentifier.get('PSYN-SCR-COLLIDE')?.length !== 2) throw new Error('invalid collision');
  for (const [identifier, mappings] of byIdentifier) if (identifier !== 'PSYN-SCR-COLLIDE' && mappings.length !== 1) throw new Error('unexpected identifier collision');
  if ([...byIdentifier.keys()].filter(identifier => /^PSYN-SCR-\d{4}$/.test(identifier)).length !== 30) throw new Error('invalid unique exact identifiers');
  const expectedUniqueMappings = expectedRecordIds.map((recordId, index) => [`PSYN-SCR-${String(index + 1).padStart(4, '0')}`, recordId] as const);
  if (expectedUniqueMappings.some(([identifier, recordId]) => byIdentifier.get(identifier)?.[0]?.recordId !== recordId)) throw new Error('invalid unique mapping');
  if (byIdentifier.get('PSYN-SCR-COLLIDE')?.map(mapping => mapping.recordId).sort().join(',') !== 'synrec-v1-bhss-06,synrec-v1-shcs-06') throw new Error('invalid collision mapping');
  const expectedMappingIds = [...Array(30)].map((_, index) => `synmap-v1-${String(index + 1).padStart(2, '0')}`).concat(['synmap-v1-collision-01', 'synmap-v1-collision-02']);
  if (bundle.mappings.some(mapping => !expectedMappingIds.includes(mapping.mappingId))) throw new Error('invalid mapping ID');
  return bundle;
}
