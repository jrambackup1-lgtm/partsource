import type { CatalogRecord, FactField, Family, IdentifierMapping, PocBundle } from './types';
import { SYNTHETIC_NOTICE } from './types';

const displayedFactFields: FactField[] = ['familyId', 'threadSystem', 'nominalDiameterMm', 'pitchMm', 'lengthMm', 'lengthDatum', 'material', 'finish', 'drive', 'headProfile'];
const displayedFactProvenance = () => displayedFactFields.map(field => ({
  field,
  provenanceBundleId: 'PS-POC-SYNTHETIC-V1' as const,
  provenanceKind: 'synthetic_fact' as const,
  support: 'fixture-authored synthetic value' as const,
}));

const tuples = [
  [4, 0.7, 12, 'a2_stainless', 'passivated'], [4, 0.7, 20, 'alloy_steel', 'black_oxide'],
  [5, 0.8, 16, 'a2_stainless', 'passivated'], [5, 0.8, 25, 'alloy_steel', 'black_oxide'],
  [6, 1, 16, 'a2_stainless', 'passivated'], [6, 1, 20, 'a2_stainless', 'passivated'],
  [6, 1, 30, 'alloy_steel', 'black_oxide'], [8, 1.25, 20, 'a2_stainless', 'passivated'],
  [8, 1.25, 30, 'alloy_steel', 'black_oxide'], [8, 1.25, 40, 'a2_stainless', 'passivated'],
] as const;

export const FAMILIES: Family[] = [
  { id: 'shcs', displayName: 'Socket-head cap screws', headProfile: 'cylindrical', lengthDatum: 'under_head', countersinkAngleDeg: null },
  { id: 'bhss', displayName: 'Button-head socket screws', headProfile: 'button', lengthDatum: 'under_head', countersinkAngleDeg: null },
  { id: 'css', displayName: 'Countersunk socket screws', headProfile: 'countersunk_90', lengthDatum: 'overall', countersinkAngleDeg: 90 },
];

const records: CatalogRecord[] = FAMILIES.flatMap((family) => tuples.map(([diameter, pitch, length, material, finish], index) => ({
  recordId: `synrec-v1-${family.id}-${String(index + 1).padStart(2, '0')}`,
  familyId: family.id,
  threadSystem: 'metric', nominalDiameterMm: diameter, pitchMm: pitch, lengthMm: length,
  lengthDatum: family.lengthDatum, material, finish, drive: 'internal_hex', headProfile: family.headProfile,
  provenanceBundleId: 'PS-POC-SYNTHETIC-V1', provenanceKind: 'synthetic_fixture',
  displayedFactProvenance: displayedFactProvenance(),
})));

const mappings: IdentifierMapping[] = records.map((record, index) => ({
  mappingId: `synmap-v1-${String(index + 1).padStart(2, '0')}`,
  namespace: 'partsource_synthetic_v1', identifierValue: `PSYN-SCR-${String(index + 1).padStart(4, '0')}`,
  recordId: record.recordId, provenanceBundleId: 'PS-POC-SYNTHETIC-V1', provenanceKind: 'synthetic_identifier',
}));
mappings.push(
  { mappingId: 'synmap-v1-collision-01', namespace: 'partsource_synthetic_v1', identifierValue: 'PSYN-SCR-COLLIDE', recordId: 'synrec-v1-shcs-06', provenanceBundleId: 'PS-POC-SYNTHETIC-V1', provenanceKind: 'synthetic_identifier' },
  { mappingId: 'synmap-v1-collision-02', namespace: 'partsource_synthetic_v1', identifierValue: 'PSYN-SCR-COLLIDE', recordId: 'synrec-v1-bhss-06', provenanceBundleId: 'PS-POC-SYNTHETIC-V1', provenanceKind: 'synthetic_identifier' },
);

export const POC_BUNDLE: PocBundle = {
  manifest: { bundleId: 'PS-POC-SYNTHETIC-V1', version: 1, authoringDate: '2026-08-11', origin: 'blank_slate_synthetic', allowedUse: 'local_poc_and_acceptance_benchmark', factProvenance: 'synthetic_fixture', mappingProvenance: 'synthetic_identifier', visibleNotice: SYNTHETIC_NOTICE },
  families: FAMILIES, records, mappings,
};
