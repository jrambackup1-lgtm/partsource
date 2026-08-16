import { parseCatalogPackage } from './parse-catalog-package';
import type { CatalogPackage, FactPrimitive, FactState } from './contracts';

export const SYNTHETIC_CATALOG_NOTICE = 'Synthetic POC data — not an engineering reference or supplier listing.';

const ALL_FACT_STATES: readonly FactState[] = ['known', 'not_supplied', 'unknown', 'not_applicable', 'conflicting'];
const COMMON_FACT_IDS = [
  'thread_system', 'nominal_diameter_mm', 'pitch_mm', 'length_mm', 'length_datum',
  'material', 'finish', 'drive', 'head_profile',
] as const;
const FACET_FACT_IDS = ['nominal_diameter_mm', 'pitch_mm', 'length_mm', 'material', 'finish'] as const;

const ACTIVE_LIFECYCLE = {
  status: 'active', effectiveAt: '2026-08-11T00:00:00.000Z', reason: null, correctsId: null, supersededById: null,
} as const;

const families = [
  { familyId: 'shcs', label: 'Socket-head cap screws', headProfile: 'cylindrical', lengthDatum: 'under_head', countersinkAngleDeg: null },
  { familyId: 'bhss', label: 'Button-head socket screws', headProfile: 'button', lengthDatum: 'under_head', countersinkAngleDeg: null },
  { familyId: 'css', label: 'Countersunk socket screws', headProfile: 'countersunk_90', lengthDatum: 'overall', countersinkAngleDeg: 90 },
] as const;

const tuples = [
  [4, 0.7, 12, 'a2_stainless', 'passivated'], [4, 0.7, 20, 'alloy_steel', 'black_oxide'],
  [5, 0.8, 16, 'a2_stainless', 'passivated'], [5, 0.8, 25, 'alloy_steel', 'black_oxide'],
  [6, 1, 16, 'a2_stainless', 'passivated'], [6, 1, 20, 'a2_stainless', 'passivated'],
  [6, 1, 30, 'alloy_steel', 'black_oxide'], [8, 1.25, 20, 'a2_stainless', 'passivated'],
  [8, 1.25, 30, 'alloy_steel', 'black_oxide'], [8, 1.25, 40, 'a2_stainless', 'passivated'],
] as const;

const factDefinition = (
  factId: string,
  label: string,
  valueType: 'string_enum' | 'number',
  unit: string | null,
  allowedValues: readonly FactPrimitive[],
  min: number | null,
  max: number | null,
  scope: { kind: 'all_families' } | { kind: 'families'; familyIds: readonly string[] } = { kind: 'all_families' },
) => ({ factId, label, valueType, unit, allowedValues: [...allowedValues], min, max, scope, allowedStates: [...ALL_FACT_STATES] });

const known = (factId: string, value: FactPrimitive) => ({
  factId,
  value: { state: 'known', value },
  provenanceIds: ['prov.fact.synthetic.v1'],
});

/**
 * Deterministic adapter for the existing 30-record screw POC values. The
 * generated object intentionally remains `unknown` until it crosses the
 * production parser seam. It imports no POC runtime code and changes no POC behavior.
 */
export function buildSyntheticCatalogPackageInput(): unknown {
  const familySchemas = families.map(family => {
    const familySchemaRevisionId = `family-schema:${family.familyId}:r1`;
    const factIds = family.familyId === 'css' ? [...COMMON_FACT_IDS, 'countersink_angle_deg'] : [...COMMON_FACT_IDS];
    return {
      familySchemaRevisionId,
      familyId: family.familyId,
      revision: 1,
      factIds,
      facetIds: FACET_FACT_IDS.map(factId => `facet:${family.familyId}:${factId}`),
    };
  });

  const configurations = families.flatMap(family => tuples.map((_, index) => {
    const configurationId = `synrec-v1-${family.familyId}-${String(index + 1).padStart(2, '0')}`;
    return { configurationId, familyId: family.familyId, currentRevisionId: `${configurationId}:r1` };
  }));

  const configurationRevisions = families.flatMap(family => tuples.map(([diameter, pitch, length, material, finish], index) => {
    const configurationId = `synrec-v1-${family.familyId}-${String(index + 1).padStart(2, '0')}`;
    const facts = [
      known('thread_system', 'metric'),
      known('nominal_diameter_mm', diameter),
      known('pitch_mm', pitch),
      known('length_mm', length),
      known('length_datum', family.lengthDatum),
      known('material', material),
      known('finish', finish),
      known('drive', 'internal_hex'),
      known('head_profile', family.headProfile),
    ];
    if (family.countersinkAngleDeg !== null) facts.push(known('countersink_angle_deg', family.countersinkAngleDeg));
    return {
      configurationRevisionId: `${configurationId}:r1`,
      configurationId,
      familyId: family.familyId,
      familySchemaRevisionId: `family-schema:${family.familyId}:r1`,
      revision: 1,
      lifecycle: { ...ACTIVE_LIFECYCLE },
      facts,
    };
  }));

  const identifierMappings = configurations.map((configuration, index) => ({
    mappingId: `synmap-v1-${String(index + 1).padStart(2, '0')}`,
    namespaceId: 'partsource_synthetic_v1',
    identifier: `PSYN-SCR-${String(index + 1).padStart(4, '0')}`,
    configurationRevisionId: configuration.currentRevisionId,
    provenanceId: 'prov.mapping.synthetic.v1',
    lifecycle: { ...ACTIVE_LIFECYCLE },
  }));
  identifierMappings.push(
    {
      mappingId: 'synmap-v1-collision-01',
      namespaceId: 'partsource_synthetic_v1',
      identifier: 'PSYN-SCR-COLLIDE',
      configurationRevisionId: 'synrec-v1-shcs-06:r1',
      provenanceId: 'prov.mapping.synthetic.v1',
      lifecycle: { ...ACTIVE_LIFECYCLE },
    },
    {
      mappingId: 'synmap-v1-collision-02',
      namespaceId: 'partsource_synthetic_v1',
      identifier: 'PSYN-SCR-COLLIDE',
      configurationRevisionId: 'synrec-v1-bhss-06:r1',
      provenanceId: 'prov.mapping.synthetic.v1',
      lifecycle: { ...ACTIVE_LIFECYCLE },
    },
  );

  return {
    schemaVersion: 1,
    manifest: {
      releaseId: 'partsource.synthetic.screws.v1',
      digest: 'sha256:pending:synthetic-screws-v1',
      publishedAt: '2026-08-11T00:00:00.000Z',
      allowedUse: 'synthetic_demo_only',
      dataOrigin: 'synthetic',
      publicationStatus: 'authored_demo',
      approvalId: null,
      reviewedBy: null,
      reviewedAt: null,
      permissionGrantId: null,
      correctsReleaseId: null,
      supersedesReleaseId: null,
      withdrawnAt: null,
      withdrawalReason: null,
      notice: SYNTHETIC_CATALOG_NOTICE,
    },
    hierarchy: [
      { nodeId: 'screws', parentNodeId: null, kind: 'category', label: 'Screws', order: 0, familyId: null },
      { nodeId: 'hex_socket_screws', parentNodeId: 'screws', kind: 'category', label: 'Hex-socket screws', order: 0, familyId: null },
      ...families.map((family, order) => ({
        nodeId: `family_node_${family.familyId}`,
        parentNodeId: 'hex_socket_screws',
        kind: 'family',
        label: family.label,
        order,
        familyId: family.familyId,
      })),
    ],
    families: families.map(family => ({
      familyId: family.familyId,
      label: family.label,
      hierarchyNodeId: `family_node_${family.familyId}`,
      currentSchemaRevisionId: `family-schema:${family.familyId}:r1`,
    })),
    familySchemaRevisions: familySchemas,
    factDefinitions: [
      factDefinition('thread_system', 'Thread system', 'string_enum', null, ['metric'], null, null),
      factDefinition('nominal_diameter_mm', 'Nominal diameter', 'number', 'mm', [4, 5, 6, 8], 4, 8),
      factDefinition('pitch_mm', 'Pitch', 'number', 'mm', [0.7, 0.8, 1, 1.25], 0.7, 1.25),
      factDefinition('length_mm', 'Nominal length', 'number', 'mm', [12, 16, 20, 25, 30, 40], 12, 40),
      factDefinition('length_datum', 'Length datum', 'string_enum', null, ['under_head', 'overall'], null, null),
      factDefinition('material', 'Material', 'string_enum', null, ['a2_stainless', 'alloy_steel'], null, null),
      factDefinition('finish', 'Finish', 'string_enum', null, ['passivated', 'black_oxide'], null, null),
      factDefinition('drive', 'Drive', 'string_enum', null, ['internal_hex'], null, null),
      factDefinition('head_profile', 'Head profile', 'string_enum', null, ['cylindrical', 'button', 'countersunk_90'], null, null),
      factDefinition('countersink_angle_deg', 'Countersink angle', 'number', 'deg', [90], 90, 90, { kind: 'families', familyIds: ['css'] }),
    ],
    facets: families.flatMap(family => FACET_FACT_IDS.map((factId, order) => ({
      facetId: `facet:${family.familyId}:${factId}`,
      familySchemaRevisionId: `family-schema:${family.familyId}:r1`,
      factId,
      label: ({
        nominal_diameter_mm: 'Nominal diameter', pitch_mm: 'Pitch', length_mm: 'Nominal length',
        material: 'Material', finish: 'Finish',
      } as const)[factId],
      order,
    }))),
    configurations,
    configurationRevisions,
    identifierNamespaces: [{
      namespaceId: 'partsource_synthetic_v1',
      label: 'PartSource synthetic identifiers v1',
      trimPolicy: 'trim',
      casePolicy: 'upper',
      unicodePolicy: 'NFKC',
      identifierPattern: '^PSYN(?:-[A-Z0-9]+)+$',
    }],
    identifierMappings,
    provenance: [
      {
        provenanceId: 'prov.fact.synthetic.v1',
        claimType: 'fact',
        sourceKind: 'synthetic_fixture',
        sourceId: 'PS-POC-SYNTHETIC-V1',
        publicationClass: 'synthetic_demo',
        permissionGrantId: null,
        evidenceRefs: [{ visibility: 'public', ref: 'evidence:public:synthetic-fixture-authored-value' }],
      },
      {
        provenanceId: 'prov.mapping.synthetic.v1',
        claimType: 'mapping',
        sourceKind: 'synthetic_fixture',
        sourceId: 'PS-POC-SYNTHETIC-V1',
        publicationClass: 'synthetic_demo',
        permissionGrantId: null,
        evidenceRefs: [{ visibility: 'public', ref: 'evidence:public:synthetic-identifier-mapping' }],
      },
    ],
    lexicon: [
      { ruleId: 'lex.screw', match: 'exact_phrase', term: 'screw', normalizedTerm: 'screw', targetType: 'hierarchy_node', targetId: 'screws', familySchemaRevisionId: null, factId: null, factValue: null },
      { ruleId: 'lex.screws', match: 'exact_phrase', term: 'screws', normalizedTerm: 'screws', targetType: 'hierarchy_node', targetId: 'screws', familySchemaRevisionId: null, factId: null, factValue: null },
      { ruleId: 'lex.hex_socket_screws', match: 'exact_phrase', term: 'hex socket screws', normalizedTerm: 'hex socket screws', targetType: 'hierarchy_node', targetId: 'hex_socket_screws', familySchemaRevisionId: null, factId: null, factValue: null },
      { ruleId: 'lex.family.shcs.short', match: 'exact_phrase', term: 'socket head screw', normalizedTerm: 'socket head screw', targetType: 'family', targetId: 'shcs', familySchemaRevisionId: 'family-schema:shcs:r1', factId: null, factValue: null },
      { ruleId: 'lex.family.shcs.short_plural', match: 'exact_phrase', term: 'socket head screws', normalizedTerm: 'socket head screws', targetType: 'family', targetId: 'shcs', familySchemaRevisionId: 'family-schema:shcs:r1', factId: null, factValue: null },
      { ruleId: 'lex.family.shcs', match: 'exact_phrase', term: 'socket head cap screw', normalizedTerm: 'socket head cap screw', targetType: 'family', targetId: 'shcs', familySchemaRevisionId: 'family-schema:shcs:r1', factId: null, factValue: null },
      { ruleId: 'lex.family.shcs.plural', match: 'exact_phrase', term: 'socket head cap screws', normalizedTerm: 'socket head cap screws', targetType: 'family', targetId: 'shcs', familySchemaRevisionId: 'family-schema:shcs:r1', factId: null, factValue: null },
      { ruleId: 'lex.family.bhss', match: 'exact_phrase', term: 'button head socket screw', normalizedTerm: 'button head socket screw', targetType: 'family', targetId: 'bhss', familySchemaRevisionId: 'family-schema:bhss:r1', factId: null, factValue: null },
      { ruleId: 'lex.family.bhss.plural', match: 'exact_phrase', term: 'button head socket screws', normalizedTerm: 'button head socket screws', targetType: 'family', targetId: 'bhss', familySchemaRevisionId: 'family-schema:bhss:r1', factId: null, factValue: null },
      { ruleId: 'lex.family.css', match: 'exact_phrase', term: 'countersunk socket screw', normalizedTerm: 'countersunk socket screw', targetType: 'family', targetId: 'css', familySchemaRevisionId: 'family-schema:css:r1', factId: null, factValue: null },
      { ruleId: 'lex.family.css.plural', match: 'exact_phrase', term: 'countersunk socket screws', normalizedTerm: 'countersunk socket screws', targetType: 'family', targetId: 'css', familySchemaRevisionId: 'family-schema:css:r1', factId: null, factValue: null },
      { ruleId: 'lex.diameter.m4', match: 'exact_phrase', term: 'm4', normalizedTerm: 'm4', targetType: 'fact_value', targetId: 'nominal_diameter_mm', familySchemaRevisionId: null, factId: 'nominal_diameter_mm', factValue: 4 },
      { ruleId: 'lex.material.a2', match: 'exact_phrase', term: 'a2 stainless', normalizedTerm: 'a2 stainless', targetType: 'fact_value', targetId: 'material', familySchemaRevisionId: null, factId: 'material', factValue: 'a2_stainless' },
      { ruleId: 'lex.material.alloy_steel', match: 'exact_phrase', term: 'alloy steel', normalizedTerm: 'alloy steel', targetType: 'fact_value', targetId: 'material', familySchemaRevisionId: null, factId: 'material', factValue: 'alloy_steel' },
      { ruleId: 'lex.finish.passivated', match: 'exact_phrase', term: 'passivated', normalizedTerm: 'passivated', targetType: 'fact_value', targetId: 'finish', familySchemaRevisionId: null, factId: 'finish', factValue: 'passivated' },
      { ruleId: 'lex.finish.black_oxide', match: 'exact_phrase', term: 'black oxide', normalizedTerm: 'black oxide', targetType: 'fact_value', targetId: 'finish', familySchemaRevisionId: null, factId: 'finish', factValue: 'black_oxide' },
    ],
  };
}

export function loadSyntheticCatalogPackage(): CatalogPackage {
  return parseCatalogPackage(buildSyntheticCatalogPackageInput());
}

export const SYNTHETIC_CATALOG_PACKAGE = loadSyntheticCatalogPackage();
