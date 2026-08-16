import type {
  CatalogConfiguration,
  CatalogFamily,
  CatalogPackage,
  ConfigurationRevision,
  FactAssignment,
  FactDefinition,
  FactPrimitive,
  FacetDefinition,
  FamilySchemaRevision,
  HierarchyNode,
  IdentifierMapping,
  LexiconRule,
  ProvenanceRecord,
} from '../contracts';

export type FilterSource = 'query' | 'url' | 'user';

export interface CatalogFilter {
  readonly factId: string;
  readonly value: FactPrimitive;
  readonly source?: FilterSource;
}

export interface IndexedConfiguration {
  readonly configuration: CatalogConfiguration;
  readonly revision: ConfigurationRevision;
  readonly facts: ReadonlyMap<string, FactAssignment>;
}

/** Read-only indexes over an already validated CatalogPackage. */
export interface CatalogIndex {
  readonly package: CatalogPackage;
  readonly hierarchyById: ReadonlyMap<string, HierarchyNode>;
  readonly hierarchyChildren: ReadonlyMap<string | null, readonly HierarchyNode[]>;
  readonly hierarchyPathById: ReadonlyMap<string, readonly HierarchyNode[]>;
  readonly familiesById: ReadonlyMap<string, CatalogFamily>;
  readonly schemasById: ReadonlyMap<string, FamilySchemaRevision>;
  readonly currentSchemaByFamilyId: ReadonlyMap<string, FamilySchemaRevision>;
  readonly factDefinitionsById: ReadonlyMap<string, FactDefinition>;
  readonly facetsByFamilyId: ReadonlyMap<string, readonly FacetDefinition[]>;
  readonly configurationsById: ReadonlyMap<string, IndexedConfiguration>;
  readonly configurationsByFamilyId: ReadonlyMap<string, readonly IndexedConfiguration[]>;
  readonly revisionsById: ReadonlyMap<string, ConfigurationRevision>;
  readonly mappingsByQualifiedIdentifier: ReadonlyMap<string, readonly IdentifierMapping[]>;
  readonly mappingsByNormalizedIdentifier: ReadonlyMap<string, readonly IdentifierMapping[]>;
  readonly provenanceById: ReadonlyMap<string, ProvenanceRecord>;
  readonly lexiconRules: readonly LexiconRule[];
}

export type ExactIdentifierState = 'zero' | 'one' | 'many';

export interface ExactIdentifierResolution {
  readonly state: ExactIdentifierState;
  readonly namespaceId: string;
  readonly submittedIdentifier: string;
  readonly normalizedIdentifier: string;
  readonly mappings: readonly IdentifierMapping[];
  readonly configurationRevisionIds: readonly string[];
  readonly configurationIds: readonly string[];
}

export interface AcrossNamespaceIdentifierResolution {
  readonly state: ExactIdentifierState;
  readonly submittedIdentifier: string;
  readonly matches: readonly ExactIdentifierResolution[];
  readonly mappings: readonly IdentifierMapping[];
  readonly configurationRevisionIds: readonly string[];
  readonly configurationIds: readonly string[];
}

export interface QueryConflict {
  readonly field: 'familyId' | 'hierarchyNodeId' | string;
  readonly values: readonly FactPrimitive[];
}

export interface QueryInterpretation {
  readonly originalQuery: string;
  readonly normalizedQuery: string;
  readonly familyId: string | null;
  readonly hierarchyNodeId: string | null;
  readonly hierarchyPath: readonly HierarchyNode[];
  readonly filters: readonly CatalogFilter[];
  readonly recognizedRuleIds: readonly string[];
  readonly unsupportedTerms: readonly string[];
  readonly conflicts: readonly QueryConflict[];
}

export type CatalogResolutionState =
  | 'initial'
  | 'catalog_list'
  | 'catalog_empty'
  | 'query_conflict'
  | 'query_unsupported'
  | 'exact_not_found'
  | 'exact_non_unique'
  | 'invalid_filter'
  | 'invalid_selection';

export interface CatalogRecordProjection {
  readonly configurationId: string;
  readonly configurationRevisionId: string;
  /** Independent row semantics: an exact hit is not selected until activation. */
  readonly exactMatch: boolean;
  readonly selected: boolean;
  readonly familyId: string;
  readonly familyLabel: string;
  readonly facts: readonly FactAssignment[];
  readonly identifiers: readonly Readonly<{
    namespaceId: string;
    identifier: string;
    mappingId: string;
    provenanceId: string;
  }>[];
}

export interface CatalogDetailProjection extends CatalogRecordProjection {
  readonly schema: FamilySchemaRevision;
  readonly factDefinitions: readonly FactDefinition[];
  readonly provenance: readonly ProvenanceRecord[];
}

export interface CatalogResolution {
  readonly state: CatalogResolutionState;
  readonly query: string;
  readonly normalizedQuery: string;
  readonly familyId: string | null;
  readonly hierarchyNodeId: string | null;
  readonly hierarchyPath: readonly HierarchyNode[];
  readonly filters: readonly CatalogFilter[];
  readonly records: readonly CatalogRecordProjection[];
  readonly exact: AcrossNamespaceIdentifierResolution | null;
  readonly exactMatchRevisionId: string | null;
  readonly highlightedRecordId: string | null;
  readonly highlightedRevisionId: string | null;
  readonly selectedRecordId: string | null;
  readonly selectedRevisionId: string | null;
  readonly detail: CatalogDetailProjection | null;
  readonly conflicts: readonly QueryConflict[];
  readonly unsupportedTerms: readonly string[];
  readonly rejectedFields: readonly string[];
}

export interface FacetValueCount {
  readonly value: FactPrimitive;
  readonly count: number;
  readonly active: boolean;
}

export interface FacetProjection {
  readonly facetId: string;
  readonly factId: string;
  readonly label: string;
  readonly order: number;
  readonly values: readonly FacetValueCount[];
}

export interface CatalogViewModel {
  readonly releaseId: string;
  readonly digest: string;
  readonly notice: string;
  readonly state: CatalogResolutionState;
  readonly query: string;
  readonly hierarchyPath: readonly HierarchyNode[];
  readonly family: CatalogFamily | null;
  readonly filters: readonly CatalogFilter[];
  readonly facets: readonly FacetProjection[];
  readonly resultCount: number;
  readonly records: readonly CatalogRecordProjection[];
  readonly exactMatchRecordId: string | null;
  readonly exactMatchRevisionId: string | null;
  readonly highlightedRecordId: string | null;
  readonly highlightedRevisionId: string | null;
  readonly selectedRecordId: string | null;
  readonly selectedRevisionId: string | null;
  readonly detail: CatalogDetailProjection | null;
  readonly conflicts: readonly QueryConflict[];
  readonly unsupportedTerms: readonly string[];
  readonly rejectedFields: readonly string[];
}
