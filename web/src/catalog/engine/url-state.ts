import type { FactDefinition, FactPrimitive } from '../contracts';
import type { CatalogFilter, CatalogIndex, CatalogResolution } from './types';
import { applyCatalogFilters, resolveCatalogQuery, selectCatalogRecord } from './resolver';

export type CatalogUrlHydration =
  | Readonly<{ state: 'empty' }>
  | Readonly<{ state: 'ready'; resolution: CatalogResolution; selectedRecordId: string | null; canonicalUrl: string }>
  | Readonly<{ state: 'invalid_selection'; resolution: CatalogResolution; canonicalUrl: string }>
  | Readonly<{ state: 'invalid_url_state'; query: string; rejected: readonly string[] }>;

/**
 * v2 (legacy, still accepted): five fixed filter parameters, single-select.
 * v3 (canonical): repeatable `f_<factId>` parameters (OR within a fact),
 * plus app-owned view parameters (page, sort, dir) and the app-level catalog
 * selection parameter. u4.
 */
const URL_VERSION = '3';
const LEGACY_URL_FACTS = [
  ['diameter_mm', 'nominal_diameter_mm'],
  ['pitch_mm', 'pitch_mm'],
  ['length_mm', 'length_mm'],
  ['material', 'material'],
  ['finish', 'finish'],
] as const;
const LEGACY_PARAMETERS = new Set<string>(LEGACY_URL_FACTS.map(([parameter]) => parameter));
const SINGLE_VALUE_PARAMETERS = new Set([
  'v', 'release', 'digest', 'q', 'family', 'selected', 'selected_revision', 'page', 'sort', 'dir', 'catalog',
]);
/**
 * App-owned view parameters (catalog selection, paging, sorting) tolerate the
 * URL without constituting catalog state: a URL carrying only these hydrates
 * as empty rather than failing the `q` requirement (f2 — `?catalog=real`
 * alone must not raise "link could not be restored").
 */
const APP_OWNED_PARAMETERS = new Set(['catalog', 'page', 'sort', 'dir']);
/** Known-inert tracking parameters are dropped without invalidating state. */
const INERT_PARAMETER_PATTERN = /^(?:utm_[a-z0-9_]+|gclid|fbclid|msclkid)$/i;
const FILTER_PARAMETER_PATTERN = /^f_([a-z][a-z0-9_.:-]*)$/;
const PAGE_PATTERN = /^\d+$/;

function isAllowedParameter(key: string): boolean {
  return SINGLE_VALUE_PARAMETERS.has(key) || LEGACY_PARAMETERS.has(key) || FILTER_PARAMETER_PATTERN.test(key);
}

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

function filterParameter(factId: string): string {
  return `f_${factId}`;
}

function filterOrder(index: CatalogIndex): (left: CatalogFilter, right: CatalogFilter) => number {
  const order = new Map(index.package.factDefinitions.map((definition, position) => [definition.factId, position]));
  return (left, right) =>
    (order.get(left.factId) ?? Number.MAX_SAFE_INTEGER) - (order.get(right.factId) ?? Number.MAX_SAFE_INTEGER)
    || String(left.value).localeCompare(String(right.value));
}

export function serializeCatalogUrl(index: CatalogIndex, resolution: CatalogResolution): string {
  const parameters = new URLSearchParams();
  parameters.set('v', URL_VERSION);
  parameters.set('release', index.package.manifest.releaseId);
  parameters.set('digest', index.package.manifest.digest);
  parameters.set('q', resolution.query);
  if (resolution.familyId) parameters.set('family', resolution.familyId);
  for (const filter of [...resolution.filters].sort(filterOrder(index))) {
    parameters.append(filterParameter(filter.factId), serializedValue(filter.value));
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
  const recognized = Array.from(parameters.keys()).filter(key => !INERT_PARAMETER_PATTERN.test(key));
  const rejected = recognized.filter(key => !isAllowedParameter(key));
  for (const key of new Set(recognized)) {
    if ((SINGLE_VALUE_PARAMETERS.has(key) || LEGACY_PARAMETERS.has(key)) && parameters.getAll(key).length > 1) rejected.push(key);
  }
  // App-owned parameters alone are not catalog state — but duplicated or
  // unknown parameters are still malformed, so the shape checks above run
  // before this shortcut (f2).
  if (!recognized.some(key => !APP_OWNED_PARAMETERS.has(key))) {
    return rejected.length ? { state: 'invalid_url_state', query: '', rejected } : { state: 'empty' };
  }
  const query = parameters.get('q') ?? '';
  const page = parameters.get('page');
  if (page !== null && !PAGE_PATTERN.test(page)) rejected.push('page');
  const sort = parameters.get('sort');
  if (sort !== null && !/^[a-z][a-z0-9_.:-]*$/.test(sort)) rejected.push('sort');
  const direction = parameters.get('dir');
  if (direction !== null && !['asc', 'desc'].includes(direction)) rejected.push('dir');
  const version = parameters.get('v');
  if (version !== null && version !== URL_VERSION && version !== '2') rejected.push('v');
  if (parameters.get('release') !== index.package.manifest.releaseId) rejected.push('release');
  if (parameters.get('digest') !== index.package.manifest.digest) rejected.push('digest');
  if (!query.trim()) rejected.push('q');

  const familyId = parameters.get('family');
  if (familyId !== null && !index.familiesById.has(familyId)) rejected.push('family');

  // Filters: v3 f_<factId> parameters (repeatable, OR within a fact) with the
  // legacy v2 single-value keys still accepted for old links.
  const urlFilters: CatalogFilter[] = [];
  for (const key of new Set(recognized)) {
    const match = FILTER_PARAMETER_PATTERN.exec(key);
    if (!match) continue;
    if (version === '2') { rejected.push(key); continue; }
    const factId = match[1];
    const definition = index.factDefinitionsById.get(factId);
    if (!definition) { rejected.push(key); continue; }
    for (const raw of parameters.getAll(key)) {
      const value = parseValue(definition, raw);
      if (value === null) rejected.push(key);
      else urlFilters.push({ factId, value, source: 'url' });
    }
  }
  for (const [parameter, factId] of LEGACY_URL_FACTS) {
    if (version === '2' && !parameters.has(parameter)) continue;
    if (parameters.has(parameter) && version !== '2') { rejected.push(parameter); continue; }
    const raw = parameters.get(parameter);
    if (raw === null) continue;
    const definition = index.factDefinitionsById.get(factId);
    const value = definition ? parseValue(definition, raw) : null;
    if (value === null) rejected.push(parameter);
    else urlFilters.push({ factId, value, source: 'url' });
  }
  if (rejected.length) return { state: 'invalid_url_state', query, rejected: Array.from(new Set(rejected)) };

  const base = resolveCatalogQuery(index, query);
  if (base.familyId && familyId && base.familyId !== familyId) {
    return { state: 'invalid_url_state', query, rejected: ['family'] };
  }
  // URL facts EXTEND the query interpretation instead of replacing it: a URL
  // like ?q=M4+screws&family=x keeps the query-derived M4 constraint so the
  // results can never silently contradict the visible query (u4 / audit N6).
  const derived = base.filters.filter(filter => filter.source === 'query');
  const merged: CatalogFilter[] = [...derived];
  for (const filter of urlFilters) {
    const sameFactDerived = derived.filter(candidate => candidate.factId === filter.factId);
    if (sameFactDerived.length && !sameFactDerived.some(candidate => candidate.value === filter.value)) {
      return { state: 'invalid_url_state', query, rejected: [filterParameter(filter.factId)] };
    }
    if (!merged.some(candidate => candidate.factId === filter.factId && candidate.value === filter.value)) {
      merged.push(filter);
    }
  }

  let resolution = base;
  if (['catalog_list', 'catalog_empty', 'catalog_chooser'].includes(base.state)) {
    resolution = applyCatalogFilters(index, base, merged, { familyId: familyId ?? null });
    if (resolution.state === 'invalid_filter') {
      return { state: 'invalid_url_state', query, rejected: resolution.rejectedFields };
    }
  } else if (familyId !== null || merged.length) {
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
