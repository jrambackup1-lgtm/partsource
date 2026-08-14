import { applyFilters, resolveQuery, type Filter, type FilterField, type Resolution } from './resolver';
import type { PocBundle } from './types';

export type UrlHydration =
  | { state: 'empty' }
  | { state: 'ready'; resolution: Resolution; selectedRecordId: string | null; canonical: boolean }
  | { state: 'invalid_selection'; resolution: Resolution }
  | { state: 'invalid_url_state'; rejected: string[]; query: string };

const urlFields: Array<[string, FilterField]> = [['family', 'familyId'], ['diameter_mm', 'nominalDiameterMm'], ['pitch_mm', 'pitchMm'], ['length_mm', 'lengthMm'], ['material', 'material'], ['finish', 'finish']];
const numeric = new Set<FilterField>(['nominalDiameterMm', 'pitchMm', 'lengthMm']);
const hasMalformedEncoding = (rawSearch: string) => rawSearch.replace(/^\?/, '').split(/[&=]/).some(component => { try { decodeURIComponent(component.replace(/\+/g, ' ')); return false; } catch { return true; } });

export function serializePocUrl(resolution: Resolution, selectedRecordId: string | null): string {
  const parameters = new URLSearchParams();
  parameters.set('v', '1'); parameters.set('q', resolution.query);
  for (const [parameter, field] of urlFields) {
    const filter = resolution.filters.find(item => item.field === field);
    const value = filter?.value ?? (field === 'familyId' ? resolution.familyId : undefined);
    if (value !== undefined) parameters.set(parameter, String(value));
  }
  if (selectedRecordId && resolution.records.some(record => record.recordId === selectedRecordId)) parameters.set('selected', selectedRecordId);
  return `?${parameters.toString()}`;
}

export function hydratePocUrl(bundle: PocBundle, rawSearch: string): UrlHydration {
  if (hasMalformedEncoding(rawSearch)) return { state: 'invalid_url_state', rejected: ['encoding'], query: '' };
  const parameters = new URLSearchParams(rawSearch);
  if (!Array.from(parameters.keys()).length) return { state: 'empty' };
  const query = parameters.get('q') ?? '';
  const allowed = new Set(['v', 'q', 'selected', ...urlFields.map(([key]) => key)]);
  const rejected = Array.from(parameters.keys()).filter(key => !allowed.has(key));
  for (const key of Array.from(allowed)) if (parameters.getAll(key).length > 1) rejected.push(key);
  const version = parameters.get('v');
  if (version !== null && version !== '1') rejected.push('v');
  if (!query) rejected.push('q');
  if (rejected.length) return { state: 'invalid_url_state', rejected: Array.from(new Set(rejected)), query };
  const base = resolveQuery(bundle, query);
  if (version === null) {
    if (urlFields.some(([parameter]) => parameters.has(parameter))) return { state: 'invalid_url_state', rejected: urlFields.filter(([parameter]) => parameters.has(parameter)).map(([parameter]) => parameter), query };
    return select(base, parameters.get('selected'), true);
  }
  const filters: Filter[] = [];
  for (const [parameter, field] of urlFields) {
    const raw = parameters.get(parameter); if (raw === null) continue;
    const value = numeric.has(field) ? Number(raw) : raw;
    if ((numeric.has(field) && (!Number.isFinite(value) || String(value) !== raw)) || !bundle.records.some(record => record[field] === value)) rejected.push(parameter);
    else filters.push({ field, value });
  }
  if (rejected.length) return { state: 'invalid_url_state', rejected: Array.from(new Set(rejected)), query };
  if (base.familyId && filters.some(filter => filter.field === 'familyId' && filter.value !== base.familyId)) return { state: 'invalid_url_state', rejected: ['family'], query };
  if (!['catalog_list', 'catalog_empty'].includes(base.state)) return select(base, parameters.get('selected'), false);
  const resolution = filters.length || base.state === 'catalog_list' || base.state === 'catalog_empty' ? applyFilters(bundle, { ...base, state: base.state === 'catalog_list' || base.state === 'catalog_empty' ? base.state : 'catalog_list' }, filters) : base;
  if (resolution.state === 'invalid_url_state') return { state: 'invalid_url_state', rejected: resolution.rejectedFields ?? ['filter'], query };
  return select(resolution, parameters.get('selected'), false);
}
function select(resolution: Resolution, selected: string | null, canonical: boolean): UrlHydration {
  if (selected === null) return { state: 'ready', resolution, selectedRecordId: null, canonical };
  if (!/^synrec-v1-(?:shcs|bhss|css)-\d{2}$/.test(selected) || !resolution.records.some(record => record.recordId === selected)) return { state: 'invalid_selection', resolution: { ...resolution, selectedRecordId: undefined, detailOpen: false } };
  return { state: 'ready', resolution: { ...resolution, selectedRecordId: selected, detailOpen: true }, selectedRecordId: selected, canonical };
}
