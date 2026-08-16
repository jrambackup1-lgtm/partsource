import type { CatalogFilter, CatalogIndex, CatalogResolution, CatalogViewModel } from './types';
import { resolveExactIdentifier, resolveExactIdentifierAcrossNamespaces } from './exact-identifier';
import { interpretCatalogQuery } from './query-interpreter';
import {
  computeFamilyFacets,
  filterConfigurations,
  projectDetail,
  projectRecords,
  validateCatalogFilters,
} from './filter-facets';

const EMPTY_EXACT_FIELDS = {
  exactMatchRevisionId: null,
  highlightedRecordId: null,
  highlightedRevisionId: null,
  selectedRecordId: null,
  selectedRevisionId: null,
  detail: null,
} as const;

function rootContext(index: CatalogIndex) {
  const root = index.package.hierarchy.find(node => node.parentNodeId === null)!;
  return { hierarchyNodeId: root.nodeId, hierarchyPath: index.hierarchyPathById.get(root.nodeId) ?? [root] };
}

function looksLikeUnqualifiedIdentifier(value: string): boolean {
  return !/\s/u.test(value) && /^[\p{L}\p{N}]+(?:[-_.:/][\p{L}\p{N}]+){2,}$/u.test(value);
}

function exactSubmission(index: CatalogIndex, trimmed: string) {
  const qualifier = /^([a-z][a-z0-9._:-]*)::(.+)$/u.exec(trimmed);
  if (qualifier && index.package.identifierNamespaces.some(namespace => namespace.namespaceId === qualifier[1])) {
    const exact = resolveExactIdentifier(index, qualifier[1], qualifier[2]);
    return {
      state: exact.state,
      submittedIdentifier: trimmed,
      matches: exact.state === 'zero' ? [] : [exact],
      mappings: exact.mappings,
      configurationRevisionIds: exact.configurationRevisionIds,
      configurationIds: exact.configurationIds,
    } as const;
  }
  const exact = resolveExactIdentifierAcrossNamespaces(index, trimmed);
  return exact.state !== 'zero' || looksLikeUnqualifiedIdentifier(trimmed) ? exact : null;
}

/** Resolve a submitted query into catalog context. Exact mapping never implies selection. */
export function resolveCatalogQuery(index: CatalogIndex, query: string): CatalogResolution {
  const trimmed = query.normalize('NFKC').trim();
  if (!trimmed) {
    const root = rootContext(index);
    return Object.freeze({
      state: 'initial', query, normalizedQuery: '', familyId: null, ...root,
      filters: [], records: [], exact: null, ...EMPTY_EXACT_FIELDS,
      conflicts: [], unsupportedTerms: [], rejectedFields: [],
    });
  }

  const exact = exactSubmission(index, trimmed);
  if (exact) {
    const root = rootContext(index);
    if (exact.state === 'zero') {
      return Object.freeze({
        state: 'exact_not_found', query, normalizedQuery: trimmed, familyId: null, ...root,
        filters: [], records: [], exact, ...EMPTY_EXACT_FIELDS,
        conflicts: [], unsupportedTerms: [], rejectedFields: [],
      });
    }
    if (exact.state === 'many') {
      return Object.freeze({
        state: 'exact_non_unique', query, normalizedQuery: trimmed, familyId: null, ...root,
        filters: [], records: [], exact, ...EMPTY_EXACT_FIELDS,
        conflicts: [], unsupportedTerms: [], rejectedFields: [],
      });
    }
    const revision = index.revisionsById.get(exact.configurationRevisionIds[0]);
    const family = revision ? index.familiesById.get(revision.familyId) : undefined;
    const configurationId = revision?.configurationId ?? null;
    if (!revision || !family || !configurationId) {
      return Object.freeze({
        state: 'exact_not_found', query, normalizedQuery: trimmed, familyId: null, ...root,
        filters: [], records: [], exact: { ...exact, state: 'zero' as const }, ...EMPTY_EXACT_FIELDS,
        conflicts: [], unsupportedTerms: [], rejectedFields: [],
      });
    }
    const exactMatchRevisionId = revision.configurationRevisionId;
    const configurations = filterConfigurations(index, family.familyId, [], {
      configurationId,
      configurationRevisionId: exactMatchRevisionId,
    });
    const hierarchyPath = index.hierarchyPathById.get(family.hierarchyNodeId) ?? [];
    return Object.freeze({
      state: configurations.length ? 'catalog_list' : 'catalog_empty',
      query,
      normalizedQuery: trimmed,
      familyId: family.familyId,
      hierarchyNodeId: family.hierarchyNodeId,
      hierarchyPath,
      filters: [],
      records: projectRecords(index, configurations, { exactMatchRevisionId }),
      exact,
      exactMatchRevisionId,
      highlightedRecordId: configurationId,
      highlightedRevisionId: exactMatchRevisionId,
      selectedRecordId: null,
      selectedRevisionId: null,
      detail: null,
      conflicts: [],
      unsupportedTerms: [],
      rejectedFields: [],
    });
  }

  const interpretation = interpretCatalogQuery(index, query);
  if (interpretation.conflicts.length) {
    return Object.freeze({
      state: 'query_conflict', query, normalizedQuery: interpretation.normalizedQuery,
      familyId: interpretation.familyId, hierarchyNodeId: interpretation.hierarchyNodeId,
      hierarchyPath: interpretation.hierarchyPath, filters: interpretation.filters,
      records: [], exact: null, ...EMPTY_EXACT_FIELDS, conflicts: interpretation.conflicts,
      unsupportedTerms: interpretation.unsupportedTerms, rejectedFields: [],
    });
  }
  if (interpretation.unsupportedTerms.length || (!interpretation.recognizedRuleIds.length && !interpretation.filters.length)) {
    return Object.freeze({
      state: 'query_unsupported', query, normalizedQuery: interpretation.normalizedQuery,
      familyId: interpretation.familyId, hierarchyNodeId: interpretation.hierarchyNodeId,
      hierarchyPath: interpretation.hierarchyPath, filters: interpretation.filters,
      records: [], exact: null, ...EMPTY_EXACT_FIELDS, conflicts: [],
      unsupportedTerms: interpretation.unsupportedTerms, rejectedFields: [],
    });
  }
  const rejected = validateCatalogFilters(index, interpretation.familyId, interpretation.filters);
  if (rejected.length) return invalidFilter(index, query, interpretation.normalizedQuery, rejected);
  const configurations = filterConfigurations(index, interpretation.familyId, interpretation.filters);
  return Object.freeze({
    state: configurations.length ? 'catalog_list' : 'catalog_empty', query,
    normalizedQuery: interpretation.normalizedQuery, familyId: interpretation.familyId,
    hierarchyNodeId: interpretation.hierarchyNodeId, hierarchyPath: interpretation.hierarchyPath,
    filters: interpretation.filters, records: projectRecords(index, configurations), exact: null,
    ...EMPTY_EXACT_FIELDS, conflicts: [], unsupportedTerms: [], rejectedFields: [],
  });
}

function invalidFilter(index: CatalogIndex, query: string, normalizedQuery: string, rejectedFields: readonly string[]): CatalogResolution {
  const root = rootContext(index);
  return Object.freeze({
    state: 'invalid_filter', query, normalizedQuery, familyId: null, ...root,
    filters: [], records: [], exact: null, ...EMPTY_EXACT_FIELDS,
    conflicts: [], unsupportedTerms: [], rejectedFields,
  });
}

export function applyCatalogFilters(
  index: CatalogIndex,
  resolution: CatalogResolution,
  filters: readonly CatalogFilter[],
  options: Readonly<{ familyId?: string | null }> = {},
): CatalogResolution {
  if (!['catalog_list', 'catalog_empty'].includes(resolution.state)) return resolution;
  const exactFamily = resolution.exact?.state === 'one' ? resolution.familyId : null;
  const familyId = exactFamily ?? (options.familyId === undefined ? resolution.familyId : options.familyId);
  if (exactFamily && options.familyId !== undefined && options.familyId !== exactFamily) {
    return invalidFilter(index, resolution.query, resolution.normalizedQuery, ['family']);
  }
  if (familyId !== null && !index.familiesById.has(familyId)) return invalidFilter(index, resolution.query, resolution.normalizedQuery, ['family']);
  const rejected = validateCatalogFilters(index, familyId, filters);
  if (rejected.length) return invalidFilter(index, resolution.query, resolution.normalizedQuery, rejected);
  const exactRevision = resolution.exactMatchRevisionId
    ? index.revisionsById.get(resolution.exactMatchRevisionId) ?? null
    : null;
  const configurations = filterConfigurations(index, familyId, filters, exactRevision ? {
    configurationId: exactRevision.configurationId,
    configurationRevisionId: exactRevision.configurationRevisionId,
  } : null);
  const selectedConfiguration = resolution.selectedRecordId && resolution.selectedRevisionId
    ? configurations.find(candidate =>
      candidate.configuration.configurationId === resolution.selectedRecordId
      && candidate.revision.configurationRevisionId === resolution.selectedRevisionId)
    : undefined;
  const selectedRecordId = selectedConfiguration?.configuration.configurationId ?? null;
  const selectedRevisionId = selectedConfiguration?.revision.configurationRevisionId ?? null;
  const records = projectRecords(index, configurations, {
    exactMatchRevisionId: resolution.exactMatchRevisionId,
    selectedRevisionId,
  });
  const highlighted = resolution.highlightedRevisionId
    ? records.find(record => record.configurationRevisionId === resolution.highlightedRevisionId)
    : undefined;
  const highlightedRecordId = highlighted?.configurationId ?? null;
  const highlightedRevisionId = highlighted?.configurationRevisionId ?? null;
  const family = familyId ? index.familiesById.get(familyId)! : null;
  const root = rootContext(index);
  return Object.freeze({
    ...resolution,
    state: records.length ? 'catalog_list' : 'catalog_empty',
    familyId,
    hierarchyNodeId: family?.hierarchyNodeId ?? root.hierarchyNodeId,
    hierarchyPath: family ? index.hierarchyPathById.get(family.hierarchyNodeId) ?? [] : root.hierarchyPath,
    filters: Object.freeze(filters.map(filter => Object.freeze({ ...filter }))),
    records,
    highlightedRecordId,
    highlightedRevisionId,
    selectedRecordId,
    selectedRevisionId,
    detail: selectedRevisionId ? projectDetail(index, selectedRevisionId, resolution.exactMatchRevisionId) : null,
    rejectedFields: [],
  });
}

export function selectCatalogRecord(
  index: CatalogIndex,
  resolution: CatalogResolution,
  configurationId: string | null,
  expectedRevisionId?: string,
): CatalogResolution {
  if (configurationId === null) {
    return Object.freeze({
      ...resolution,
      records: projectRecordsFromResolution(resolution, null),
      selectedRecordId: null,
      selectedRevisionId: null,
      detail: null,
    });
  }
  const selected = resolution.records.find(record =>
    record.configurationId === configurationId
    && (expectedRevisionId === undefined || record.configurationRevisionId === expectedRevisionId));
  if (!selected) {
    return Object.freeze({
      ...resolution,
      state: 'invalid_selection',
      records: projectRecordsFromResolution(resolution, null),
      selectedRecordId: null,
      selectedRevisionId: null,
      detail: null,
    });
  }
  const records = Object.freeze(resolution.records.map(record => Object.freeze({
    ...record,
    selected: record.configurationRevisionId === selected.configurationRevisionId,
  })));
  return Object.freeze({
    ...resolution,
    records,
    selectedRecordId: configurationId,
    selectedRevisionId: selected.configurationRevisionId,
    detail: projectDetail(index, selected.configurationRevisionId, resolution.exactMatchRevisionId),
  });
}

function projectRecordsFromResolution(
  resolution: CatalogResolution,
  selectedRevisionId: string | null,
): readonly CatalogResolution['records'][number][] {
  return Object.freeze(resolution.records.map(record => Object.freeze({
    ...record,
    selected: record.configurationRevisionId === selectedRevisionId,
  })));
}

export function projectCatalogView(index: CatalogIndex, resolution: CatalogResolution): CatalogViewModel {
  return Object.freeze({
    releaseId: index.package.manifest.releaseId,
    digest: index.package.manifest.digest,
    notice: index.package.manifest.notice,
    state: resolution.state,
    query: resolution.query,
    hierarchyPath: resolution.hierarchyPath,
    family: resolution.familyId ? index.familiesById.get(resolution.familyId) ?? null : null,
    filters: resolution.filters,
    facets: resolution.familyId ? computeFamilyFacets(index, resolution.familyId, resolution.filters) : [],
    resultCount: resolution.records.length,
    records: resolution.records,
    exactMatchRecordId: resolution.exact?.state === 'one' ? resolution.exact.configurationIds[0] ?? null : null,
    exactMatchRevisionId: resolution.exactMatchRevisionId,
    highlightedRecordId: resolution.highlightedRecordId,
    highlightedRevisionId: resolution.highlightedRevisionId,
    selectedRecordId: resolution.selectedRecordId,
    selectedRevisionId: resolution.selectedRevisionId,
    detail: resolution.detail,
    conflicts: resolution.conflicts,
    unsupportedTerms: resolution.unsupportedTerms,
    rejectedFields: resolution.rejectedFields,
  });
}
