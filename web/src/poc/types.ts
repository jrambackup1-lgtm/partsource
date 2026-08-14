export const SYNTHETIC_NOTICE = 'Synthetic POC data — not an engineering reference or supplier listing.';

export type FamilyId = 'shcs' | 'bhss' | 'css';
export type Material = 'a2_stainless' | 'alloy_steel';
export type Finish = 'passivated' | 'black_oxide';
export type LengthDatum = 'under_head' | 'overall';
export type FactField = 'familyId' | 'threadSystem' | 'nominalDiameterMm' | 'pitchMm' | 'lengthMm' | 'lengthDatum' | 'material' | 'finish' | 'drive' | 'headProfile';
export type ProvenanceKind = 'synthetic_fixture' | 'synthetic_identifier' | 'synthetic_fact';

export interface FactProvenance {
  field: FactField;
  provenanceBundleId: 'PS-POC-SYNTHETIC-V1';
  provenanceKind: 'synthetic_fact';
  support: 'fixture-authored synthetic value';
}

export interface Family {
  id: FamilyId;
  displayName: string;
  headProfile: 'cylindrical' | 'button' | 'countersunk_90';
  lengthDatum: LengthDatum;
  countersinkAngleDeg: number | null;
}

export interface CatalogRecord {
  recordId: string;
  familyId: FamilyId;
  threadSystem: 'metric';
  nominalDiameterMm: 4 | 5 | 6 | 8;
  pitchMm: 0.7 | 0.8 | 1 | 1.25;
  lengthMm: number;
  lengthDatum: LengthDatum;
  material: Material;
  finish: Finish;
  drive: 'internal_hex';
  headProfile: Family['headProfile'];
  provenanceBundleId: 'PS-POC-SYNTHETIC-V1';
  provenanceKind: 'synthetic_fixture';
  displayedFactProvenance: FactProvenance[];
}

export interface IdentifierMapping {
  mappingId: string;
  namespace: 'partsource_synthetic_v1';
  identifierValue: string;
  recordId: string;
  provenanceBundleId: 'PS-POC-SYNTHETIC-V1';
  provenanceKind: 'synthetic_identifier';
}

export interface PocBundle {
  manifest: {
    bundleId: 'PS-POC-SYNTHETIC-V1';
    version: 1;
    authoringDate: '2026-08-11';
    origin: 'blank_slate_synthetic';
    allowedUse: 'local_poc_and_acceptance_benchmark';
    factProvenance: 'synthetic_fixture';
    mappingProvenance: 'synthetic_identifier';
    visibleNotice: typeof SYNTHETIC_NOTICE;
  };
  families: Family[];
  records: CatalogRecord[];
  mappings: IdentifierMapping[];
}
