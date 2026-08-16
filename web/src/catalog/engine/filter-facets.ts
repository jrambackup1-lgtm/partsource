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
    // Repeated factIds are allowed (OR within a fact, AND across facts, u4);
    // an exactly repeated value is redundant and rejected as malformed.
    const filterKey = `${filter.factId}\u0000${typeof filter.value}:${String(filter.value)}`;
    if (seen.has(filterKey)) rejected.push(filter.factId);
    seen.add(filterKey);
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
  if (!filters.length) return true;
  // OR within a fact, AND across facts (u4): the active values of each fact
  // form one disjunction.
  const acceptedByFact = new Map<string, Set<FactPrimitive>>();
  for (const filter of filters) {
    if (filter.factId === excludedFactId) continue;
    const accepted = acceptedByFact.get(filter.factId) ?? new Set<FactPrimitive>();
    accepted.add(filter.value);
    acceptedByFact.set(filter.factId, accepted);
  }
  for (const [factId, accepted] of acceptedByFact) {
    const value = configuration.facts.get(factId)?.value;
    if (value?.state !== 'known' || !accepted.has(value.value)) return false;
  }
  return true;
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
  // Indexed lookup: a per-record identifier scan is O(records x mappings)
  // (~18.7 s measured for one broad query at 27k mappings).
  const identifiers = (index.mappingsByConfigurationRevisionId.get(indexed.revision.configurationRevisionId) ?? [])
    .map(mapping => Object.freeze({
      namespaceId: mapping.namespaceId,
      namespaceLabel: index.namespacesById.get(mapping.namespaceId)?.label ?? mapping.namespaceId,
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

/**
 * Family-only facets with self-excluding disjunctive counts and
 * package-declared value order. Counts use a single histogram pass per facet
 * (u4): a value-by-value full family scan measured 222–244 ms on the largest
 * real family; one pass per facet is an order of magnitude cheaper.
 */
export function computeFamilyFacets(
  index: CatalogIndex,
  familyId: string,
  filters: readonly CatalogFilter[],
): readonly FacetProjection[] {
  if (!index.familiesById.has(familyId) || validateCatalogFilters(index, familyId, filters).length) return [];
  const familyConfigurations = index.configurationsByFamilyId.get(familyId) ?? [];
  const active = new Map<string, Set<FactPrimitive>>();
  for (const filter of filters) {
    const values = active.get(filter.factId) ?? new Set<FactPrimitive>();
    values.add(filter.value);
    active.set(filter.factId, values);
  }
  return Object.freeze((index.facetsByFamilyId.get(familyId) ?? []).map(facet => {
    const definition = index.factDefinitionsById.get(facet.factId)!;
    // One filtered pass over the family builds the count histogram for this
    // facet's own values while honoring the other facts' constraints.
    const histogram = new Map<string, number>();
    for (const configuration of familyConfigurations) {
      if (!configurationMatchesFilters(configuration, filters, facet.factId)) continue;
      const value = configuration.facts.get(facet.factId)?.value;
      if (value?.state !== 'known') continue;
      const key = `${typeof value.value}:${String(value.value)}`;
      histogram.set(key, (histogram.get(key) ?? 0) + 1);
    }
    const activeValues = active.get(facet.factId);
    const values = definition.allowedValues.map((value: FactPrimitive) => Object.freeze({
      value,
      count: histogram.get(`${typeof value}:${String(value)}`) ?? 0,
      active: activeValues?.has(value) ?? false,
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
