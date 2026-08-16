import type { FactPrimitive } from '../contracts';
import type {
  CatalogDetailProjection,
  CatalogFilter,
  CatalogIndex,
  CatalogRecordProjection,
  FacetProjection,
  IndexedConfiguration,
} from './types';
import { samePrimitive } from './catalog-index';

export function isFilterInFamilyScope(index: CatalogIndex, familyId: string, filter: CatalogFilter): boolean {
  const schema = index.currentSchemaByFamilyId.get(familyId);
  const definition = index.factDefinitionsById.get(filter.factId);
  return Boolean(
    schema?.factIds.includes(filter.factId)
    && definition?.allowedValues.some(value => samePrimitive(value, filter.value)),
  );
}

export function validateCatalogFilters(
  index: CatalogIndex,
  familyId: string | null,
  filters: readonly CatalogFilter[],
): readonly string[] {
  const rejected: string[] = [];
  const seen = new Set<string>();
  for (const filter of filters) {
    if (seen.has(filter.factId)) rejected.push(filter.factId);
    seen.add(filter.factId);
    const definition = index.factDefinitionsById.get(filter.factId);
    if (!definition || !definition.allowedValues.some(value => samePrimitive(value, filter.value))) {
      rejected.push(filter.factId);
      continue;
    }
    if (familyId && !isFilterInFamilyScope(index, familyId, filter)) rejected.push(filter.factId);
  }
  return Array.from(new Set(rejected));
}

function familyRank(index: CatalogIndex, familyId: string): readonly number[] {
  const family = index.familiesById.get(familyId)!;
  return (index.hierarchyPathById.get(family.hierarchyNodeId) ?? []).map(node => node.order);
}

function compareRank(left: readonly number[], right: readonly number[]): number {
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const difference = (left[index] ?? -1) - (right[index] ?? -1);
    if (difference) return difference;
  }
  return 0;
}

export function orderedConfigurations(index: CatalogIndex, familyId: string | null): readonly IndexedConfiguration[] {
  if (familyId) return index.configurationsByFamilyId.get(familyId) ?? [];
  return [...index.package.families]
    .sort((left, right) => compareRank(familyRank(index, left.familyId), familyRank(index, right.familyId)) || left.familyId.localeCompare(right.familyId))
    .flatMap(family => index.configurationsByFamilyId.get(family.familyId) ?? []);
}

export function configurationMatchesFilters(
  configuration: IndexedConfiguration,
  filters: readonly CatalogFilter[],
  excludedFactId?: string,
): boolean {
  return filters.every(filter => {
    if (filter.factId === excludedFactId) return true;
    const value = configuration.facts.get(filter.factId)?.value;
    return value?.state === 'known' && samePrimitive(value.value, filter.value);
  });
}

export function filterConfigurations(
  index: CatalogIndex,
  familyId: string | null,
  filters: readonly CatalogFilter[],
  revisionOverride: Readonly<{ configurationId: string; configurationRevisionId: string }> | null = null,
): readonly IndexedConfiguration[] {
  const configurations = orderedConfigurations(index, familyId).map(configuration => {
    if (configuration.configuration.configurationId !== revisionOverride?.configurationId) return configuration;
    return indexedConfigurationForRevision(index, revisionOverride.configurationRevisionId) ?? configuration;
  });
  return configurations.filter(configuration => configurationMatchesFilters(configuration, filters));
}

/** Resolve an immutable revision without consulting currentRevisionId. */
export function indexedConfigurationForRevision(
  index: CatalogIndex,
  configurationRevisionId: string,
): IndexedConfiguration | null {
  const revision = index.revisionsById.get(configurationRevisionId);
  const configuration = revision ? index.package.configurations.find(candidate =>
    candidate.configurationId === revision.configurationId && candidate.familyId === revision.familyId) : undefined;
  if (!revision || !configuration) return null;
  return Object.freeze({
    configuration,
    revision,
    facts: new Map(revision.facts.map(fact => [fact.factId, fact])),
  });
}

export function projectRecord(
  index: CatalogIndex,
  indexed: IndexedConfiguration,
  state: Readonly<{ exactMatchRevisionId?: string | null; selectedRevisionId?: string | null }> = {},
): CatalogRecordProjection {
  const family = index.familiesById.get(indexed.configuration.familyId)!;
  const identifiers = index.package.identifierMappings
    .filter(mapping => mapping.configurationRevisionId === indexed.revision.configurationRevisionId)
    .map(mapping => Object.freeze({
      namespaceId: mapping.namespaceId,
      identifier: mapping.identifier,
      mappingId: mapping.mappingId,
      provenanceId: mapping.provenanceId,
    }));
  return Object.freeze({
    configurationId: indexed.configuration.configurationId,
    configurationRevisionId: indexed.revision.configurationRevisionId,
    exactMatch: indexed.revision.configurationRevisionId === state.exactMatchRevisionId,
    selected: indexed.revision.configurationRevisionId === state.selectedRevisionId,
    familyId: indexed.configuration.familyId,
    familyLabel: family.label,
    facts: indexed.revision.facts,
    identifiers: Object.freeze(identifiers),
  });
}

export function projectRecords(
  index: CatalogIndex,
  configurations: readonly IndexedConfiguration[],
  state: Readonly<{ exactMatchRevisionId?: string | null; selectedRevisionId?: string | null }> = {},
): readonly CatalogRecordProjection[] {
  return Object.freeze(configurations.map(configuration => projectRecord(index, configuration, state)));
}

/** Detail projection is revision-addressed so callers cannot substitute current facts. */
export function projectDetail(
  index: CatalogIndex,
  configurationRevisionId: string,
  exactMatchRevisionId: string | null = null,
): CatalogDetailProjection | null {
  const indexed = indexedConfigurationForRevision(index, configurationRevisionId);
  if (!indexed) return null;
  const record = projectRecord(index, indexed, {
    exactMatchRevisionId,
    selectedRevisionId: configurationRevisionId,
  });
  const schema = index.schemasById.get(indexed.revision.familySchemaRevisionId)!;
  const factDefinitions = schema.factIds.map(factId => index.factDefinitionsById.get(factId)!);
  const provenanceIds = new Set([
    ...indexed.revision.facts.flatMap(fact => fact.provenanceIds),
    ...record.identifiers.map(identifier => identifier.provenanceId),
  ]);
  const provenance = index.package.provenance.filter(item => provenanceIds.has(item.provenanceId));
  return Object.freeze({ ...record, schema, factDefinitions, provenance });
}

/** Family-only facets with self-excluding counts and package-declared value order. */
export function computeFamilyFacets(
  index: CatalogIndex,
  familyId: string,
  filters: readonly CatalogFilter[],
): readonly FacetProjection[] {
  if (!index.familiesById.has(familyId) || validateCatalogFilters(index, familyId, filters).length) return [];
  const familyConfigurations = index.configurationsByFamilyId.get(familyId) ?? [];
  const active = new Map(filters.map(filter => [filter.factId, filter.value]));
  return Object.freeze((index.facetsByFamilyId.get(familyId) ?? []).map(facet => {
    const definition = index.factDefinitionsById.get(facet.factId)!;
    const values = definition.allowedValues.map((value: FactPrimitive) => Object.freeze({
      value,
      count: familyConfigurations.filter(configuration =>
        configurationMatchesFilters(configuration, filters, facet.factId)
        && configuration.facts.get(facet.factId)?.value.state === 'known'
        && samePrimitive((configuration.facts.get(facet.factId)!.value as { state: 'known'; value: FactPrimitive }).value, value)
      ).length,
      active: active.has(facet.factId) && samePrimitive(active.get(facet.factId)!, value),
    }));
    return Object.freeze({
      facetId: facet.facetId,
      factId: facet.factId,
      label: facet.label,
      order: facet.order,
      values: Object.freeze(values),
    });
  }));
}
