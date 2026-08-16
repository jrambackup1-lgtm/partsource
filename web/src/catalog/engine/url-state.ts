import type { FactDefinition, FactPrimitive } from '../contracts';
import type { CatalogFilter, CatalogIndex, CatalogResolution } from './types';
import { applyCatalogFilters, resolveCatalogQuery, selectCatalogRecord } from './resolver';

export type CatalogUrlHydration =
  | Readonly<{ state: 'empty' }>
  | Readonly<{ state: 'ready'; resolution: CatalogResolution; selectedRecordId: string | null; canonicalUrl: string }>
  | Readonly<{ state: 'invalid_selection'; resolution: CatalogResolution; canonicalUrl: string }>
  | Readonly<{ state: 'invalid_url_state'; query: string; rejected: readonly string[] }>;

const URL_FACTS = [
  ['diameter_mm', 'nominal_diameter_mm'],
  ['pitch_mm', 'pitch_mm'],
  ['length_mm', 'length_mm'],
  ['material', 'material'],
  ['finish', 'finish'],
] as const;
const ALLOWED_PARAMETERS = new Set([
  'v', 'release', 'digest', 'q', 'family', 'selected', 'selected_revision',
  ...URL_FACTS.map(([parameter]) => parameter),
]);

function malformedEncoding(rawSearch: string): boolean {
  return rawSearch.replace(/^\?/, '').split(/[&=]/).some(component => {
    try {
      decodeURIComponent(component.replace(/\+/g, ' '));
      return false;
    } catch {
      return true;
    }
  });
}

function serializedValue(value: FactPrimitive): string {
  return String(value);
}

export function serializeCatalogUrl(index: CatalogIndex, resolution: CatalogResolution): string {
  const parameters = new URLSearchParams();
  parameters.set('v', '2');
  parameters.set('release', index.package.manifest.releaseId);
  parameters.set('digest', index.package.manifest.digest);
  parameters.set('q', resolution.query);
  if (resolution.familyId) parameters.set('family', resolution.familyId);
  for (const [parameter, factId] of URL_FACTS) {
    const filter = resolution.filters.find(candidate => candidate.factId === factId);
    if (filter) parameters.set(parameter, serializedValue(filter.value));
  }
  if (resolution.selectedRecordId && resolution.selectedRevisionId && resolution.records.some(record =>
    record.configurationId === resolution.selectedRecordId
    && record.configurationRevisionId === resolution.selectedRevisionId)) {
    parameters.set('selected', resolution.selectedRecordId);
    parameters.set('selected_revision', resolution.selectedRevisionId);
  }
  return `?${parameters.toString()}`;
}

function parseValue(definition: FactDefinition, raw: string): FactPrimitive | null {
  if (definition.valueType === 'number') {
    const value = Number(raw);
    if (!Number.isFinite(value) || String(value) !== raw) return null;
    return definition.allowedValues.some(candidate => typeof candidate === 'number' && candidate === value) ? value : null;
  }
  return definition.allowedValues.some(candidate => candidate === raw) ? raw : null;
}

export function hydrateCatalogUrl(index: CatalogIndex, rawSearch: string): CatalogUrlHydration {
  if (malformedEncoding(rawSearch)) return { state: 'invalid_url_state', query: '', rejected: ['encoding'] };
  const parameters = new URLSearchParams(rawSearch);
  const keys = Array.from(parameters.keys());
  if (!keys.length) return { state: 'empty' };
  const query = parameters.get('q') ?? '';
  const rejected = keys.filter(key => !ALLOWED_PARAMETERS.has(key));
  for (const key of ALLOWED_PARAMETERS) if (parameters.getAll(key).length > 1) rejected.push(key);
  if (parameters.get('v') !== '2') rejected.push('v');
  if (parameters.get('release') !== index.package.manifest.releaseId) rejected.push('release');
  if (parameters.get('digest') !== index.package.manifest.digest) rejected.push('digest');
  if (!query.trim()) rejected.push('q');

  const familyId = parameters.get('family');
  if (familyId !== null && !index.familiesById.has(familyId)) rejected.push('family');
  const filters: CatalogFilter[] = [];
  for (const [parameter, factId] of URL_FACTS) {
    const raw = parameters.get(parameter);
    if (raw === null) continue;
    const definition = index.factDefinitionsById.get(factId);
    const value = definition ? parseValue(definition, raw) : null;
    if (value === null) rejected.push(parameter);
    else filters.push({ factId, value, source: 'url' });
  }
  if (familyId) {
    const schema = index.currentSchemaByFamilyId.get(familyId)!;
    for (const filter of filters) if (!schema.factIds.includes(filter.factId)) {
      rejected.push(URL_FACTS.find(([, factId]) => factId === filter.factId)?.[0] ?? filter.factId);
    }
  }
  if (rejected.length) return { state: 'invalid_url_state', query, rejected: Array.from(new Set(rejected)) };

  const base = resolveCatalogQuery(index, query);
  if (base.familyId && familyId && base.familyId !== familyId) {
    return { state: 'invalid_url_state', query, rejected: ['family'] };
  }
  let resolution = base;
  if (['catalog_list', 'catalog_empty'].includes(base.state)) {
    resolution = applyCatalogFilters(index, base, filters, { familyId: familyId ?? null });
    if (resolution.state === 'invalid_filter') {
      return { state: 'invalid_url_state', query, rejected: resolution.rejectedFields };
    }
  } else if (familyId !== null || filters.length) {
    // Structured state may not turn a failed query into a list. It must still be
    // context-consistent and otherwise remains the original fail-closed state.
    if (base.familyId && familyId !== base.familyId) return { state: 'invalid_url_state', query, rejected: ['family'] };
  }

  const selected = parameters.get('selected');
  const selectedRevision = parameters.get('selected_revision');
  if ((selected === null) !== (selectedRevision === null)) {
    return { state: 'invalid_url_state', query, rejected: [selected === null ? 'selected' : 'selected_revision'] };
  }
  if (selected !== null && selectedRevision !== null) {
    const selectedResolution = selectCatalogRecord(index, resolution, selected, selectedRevision);
    if (selectedResolution.state === 'invalid_selection') {
      const safeResolution = selectCatalogRecord(index, resolution, null);
      return { state: 'invalid_selection', resolution: safeResolution, canonicalUrl: serializeCatalogUrl(index, safeResolution) };
    }
    resolution = selectedResolution;
  }
  return {
    state: 'ready',
    resolution,
    selectedRecordId: resolution.selectedRecordId,
    canonicalUrl: serializeCatalogUrl(index, resolution),
  };
}
