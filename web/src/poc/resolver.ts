import type { CatalogRecord, FamilyId, PocBundle } from './types';

export type FilterField = 'familyId' | 'nominalDiameterMm' | 'pitchMm' | 'lengthMm' | 'material' | 'finish';
export type Filter = { field: FilterField; value: string | number };
export type ResolverState = 'initial' | 'catalog_list' | 'catalog_empty' | 'catalog_unavailable' | 'query_conflict' | 'query_unsupported' | 'exact_not_found' | 'exact_non_unique' | 'invalid_selection' | 'invalid_url_state';
export type ExactIdState = 'not_attempted' | 'unique' | 'unknown' | 'non_unique';
export type TraceValue = { field: FilterField | 'exactId'; value: string | number; source: 'query' | 'filter' | 'mapping'; label: string };
export type ResolutionTrace = {
  originalQuery: string;
  normalizedQuery: string;
  recognized: TraceValue[];
  applied: TraceValue[];
  unsupportedTerms: string[];
  conflicts: Partial<Record<FilterField, Array<string | number>>>;
  exactId: { attempted: boolean; state: ExactIdState; submitted?: string; normalized?: string; namespace?: 'partsource_synthetic_v1'; mappingIds: string[]; recordIds: string[] };
  stopReason: ResolverState;
  provenanceRefs: string[];
};
export type Resolution = { state: ResolverState; query: string; normalizedQuery: string; familyId?: FamilyId; filters: Filter[]; records: CatalogRecord[]; highlightedRecordId?: string; selectedRecordId?: string; detailOpen: boolean; conflicts: Partial<Record<FilterField, Array<string | number>>>; unsupportedTerms: string[]; mappingEvidence: string[]; rejectedFields?: string[]; trace: ResolutionTrace };
export type ResolveOptions = { selectedRecordId?: string };

const aliases: Array<[FamilyId, string[]]> = [['shcs', ['socket head cap screw', 'socket head screws', 'socket head screw']], ['bhss', ['button head socket screw', 'button head screws', 'button head screw']], ['css', ['countersunk socket screw', 'countersunk screws', 'countersunk screw']]];
const familyOrder: FamilyId[] = ['shcs', 'bhss', 'css'];
const materialOrder = ['a2_stainless', 'alloy_steel'];
const filterOrder: FilterField[] = ['familyId', 'nominalDiameterMm', 'pitchMm', 'lengthMm', 'material', 'finish'];

const baseTrace = (query: string, normalizedQuery: string): ResolutionTrace => ({
  originalQuery: query,
  normalizedQuery,
  recognized: [],
  applied: [],
  unsupportedTerms: [],
  conflicts: {},
  exactId: { attempted: false, state: 'not_attempted', mappingIds: [], recordIds: [] },
  stopReason: 'initial',
  provenanceRefs: ['bundle:PS-POC-SYNTHETIC-V1'],
});
const base = (query: string): Resolution => { const normalizedQuery = query.trim().replace(/\s+/g, ' '); return { state: 'initial', query, normalizedQuery, filters: [], records: [], detailOpen: false, conflicts: {}, unsupportedTerms: [], mappingEvidence: [], trace: baseTrace(query, normalizedQuery) }; };
const add = <T,>(target: T[], value: T) => { if (!target.includes(value)) target.push(value); };
const sort = (records: CatalogRecord[]) => [...records].sort((a, b) => familyOrder.indexOf(a.familyId) - familyOrder.indexOf(b.familyId) || a.nominalDiameterMm - b.nominalDiameterMm || a.lengthMm - b.lengthMm || materialOrder.indexOf(a.material) - materialOrder.indexOf(b.material) || a.recordId.localeCompare(b.recordId));
const asciiFold = (value: string) => value.replace(/[A-Z]/g, char => char.toLowerCase());
const label = (filter: Filter) => `${filter.field}:${filter.value}`;
const traceValues = (filters: Filter[], source: TraceValue['source']): TraceValue[] => filters.map(filter => ({ ...filter, source, label: label(filter) }));
const provenanceForRecords = (records: CatalogRecord[]) => Array.from(new Set(records.flatMap(record => [`record:${record.recordId}:synthetic_fixture`, ...record.displayedFactProvenance.map(fact => `fact:${record.recordId}:${fact.field}:synthetic_fact`)])));
const finish = (resolution: Resolution, state: ResolverState): Resolution => ({ ...resolution, state, trace: { ...resolution.trace, stopReason: state } });

export function availableFilterValues(bundle: PocBundle, familyId?: FamilyId): Record<FilterField, Array<string | number>> {
  const scoped = familyId ? bundle.records.filter(record => record.familyId === familyId) : bundle.records;
  return {
    familyId: familyId ? [familyId] : familyOrder,
    nominalDiameterMm: uniqueSorted(scoped.map(record => record.nominalDiameterMm)),
    pitchMm: uniqueSorted(scoped.map(record => record.pitchMm)),
    lengthMm: uniqueSorted(scoped.map(record => record.lengthMm)),
    material: materialOrder.filter(value => scoped.some(record => record.material === value)),
    finish: ['passivated', 'black_oxide'].filter(value => scoped.some(record => record.finish === value)),
  };
}

export function resolveQuery(bundle: PocBundle, query: string, options: ResolveOptions = {}): Resolution {
  const output = base(query);
  const trimmed = query.trim();
  const exact = asciiFold(trimmed);
  if (/^psyn-scr-(?:\d{4}|collide)$/.test(exact)) {
    const mappings = bundle.mappings.filter(mapping => asciiFold(mapping.identifierValue) === exact);
    const records = mappings.map(mapping => bundle.records.find(item => item.recordId === mapping.recordId)).filter((record): record is CatalogRecord => Boolean(record));
    const exactState: ExactIdState = !mappings.length ? 'unknown' : mappings.length === 1 ? 'unique' : 'non_unique';
    output.trace = { ...output.trace, recognized: [{ field: 'exactId', value: trimmed, source: 'query', label: `exactId:${trimmed}` }], exactId: { attempted: true, state: exactState, submitted: trimmed, normalized: exact, namespace: 'partsource_synthetic_v1', mappingIds: mappings.map(mapping => mapping.mappingId), recordIds: mappings.map(mapping => mapping.recordId) }, provenanceRefs: [`mapping-namespace:partsource_synthetic_v1`, `mapping-count:${mappings.length}`, ...mappings.map(mapping => `mapping:${mapping.mappingId}:synthetic_identifier`)] };
    output.mappingEvidence = [`namespace:partsource_synthetic_v1`, `mapping_count:${mappings.length}`, ...mappings.flatMap(mapping => { const record = bundle.records.find(item => item.recordId === mapping.recordId); return record ? [`record:${record.recordId}`, `family:${record.familyId}`] : []; })];
    if (!mappings.length) return finish(output, 'exact_not_found');
    if (mappings.length !== 1) return finish(output, 'exact_non_unique');
    const record = records[0];
    if (!record) return finish(output, 'catalog_unavailable');
    const familyRecords = sort(bundle.records.filter(item => item.familyId === record.familyId));
    return finish({ ...output, familyId: record.familyId, records: familyRecords, highlightedRecordId: record.recordId, trace: { ...output.trace, applied: [{ field: 'exactId', value: trimmed, source: 'mapping', label: `exactId:${trimmed}` }], provenanceRefs: [...output.trace.provenanceRefs, ...provenanceForRecords(familyRecords)] } }, 'catalog_list');
  }
  let rest = output.normalizedQuery.toLowerCase().replace(/(?<=[a-z0-9])-(?=[a-z0-9])/g, ' ');
  const consume = (expression: RegExp, callback?: (match: RegExpExecArray) => void) => { rest = rest.replace(expression, (...args) => { const match = args.slice(0, -2) as unknown as RegExpExecArray; callback?.(match); return ' '; }); };
  for (const [family, terms] of aliases) for (const term of terms) consume(new RegExp(`\\b${term.replace(/ /g, '\\s+')}s?\\b`, 'g'), () => add((output.conflicts.familyId ??= []), family));
  consume(/\bscrews?\b/g);
  consume(/\bm(4|5|6|8)\s*[x×]\s*(0\.7|0\.8|1(?:\.0)?|1\.25)\b/g, match => { add((output.conflicts.nominalDiameterMm ??= []), Number(match[1])); add((output.conflicts.pitchMm ??= []), Number(match[2])); });
  consume(/\bm(4|5|6|8)\b/g, match => add((output.conflicts.nominalDiameterMm ??= []), Number(match[1])));
  consume(/\b(?:pitch\s+)?(0\.7|0\.8|1(?:\.0)?|1\.25)\s+mm\b/g, match => add((output.conflicts.pitchMm ??= []), Number(match[1])));
  consume(/\b(12|16|20|25|30|40)\s+mm\b/g, match => add((output.conflicts.lengthMm ??= []), Number(match[1])));
  for (const [value, expression] of [['a2_stainless', /\ba2\s+stainless\b|\bstainless\b|\ba2\b/g], ['alloy_steel', /\balloy\s+steel\b/g], ['passivated', /\bpassivated\b/g], ['black_oxide', /\bblack\s+oxide\b/g]] as const) consume(expression, () => add((output.conflicts[value === 'passivated' || value === 'black_oxide' ? 'finish' : 'material'] ??= []), value));
  output.unsupportedTerms = rest.trim().split(/\s+/).filter(Boolean);
  for (const field of filterOrder) {
    const values = output.conflicts[field];
    if (values?.length === 1) output.filters.push({ field, value: values[0] });
  }
  output.familyId = output.filters.find(filter => filter.field === 'familyId')?.value as FamilyId | undefined;
  const recognizedFilters = Object.entries(output.conflicts).flatMap(([field, values]) => values?.map(value => ({ field: field as FilterField, value })) ?? []);
  const conflicts = Object.fromEntries(Object.entries(output.conflicts).filter(([, values]) => values.length > 1)) as Resolution['conflicts'];
  output.trace = { ...output.trace, recognized: traceValues(recognizedFilters, 'query'), applied: traceValues(output.filters, 'query'), unsupportedTerms: output.unsupportedTerms, conflicts };
  if (Object.keys(conflicts).length) return finish({ ...output, conflicts }, 'query_conflict');
  output.conflicts = {};
  if (output.unsupportedTerms.length || !output.filters.length && !/\bscrews?\b/i.test(output.normalizedQuery)) return finish(output, 'query_unsupported');
  output.records = sort(bundle.records.filter(record => output.filters.every(filter => record[filter.field] === filter.value)));
  return select(finish({ ...output, trace: { ...output.trace, provenanceRefs: [...output.trace.provenanceRefs, ...provenanceForRecords(output.records)] } }, output.records.length ? 'catalog_list' : 'catalog_empty'), options.selectedRecordId);
}

function select(resolution: Resolution, selectedRecordId?: string): Resolution {
  if (!selectedRecordId) return resolution;
  if (!resolution.records.some(record => record.recordId === selectedRecordId)) return finish({ ...resolution, selectedRecordId: undefined, detailOpen: false }, 'invalid_selection');
  return { ...resolution, selectedRecordId, detailOpen: true };
}

export function applyFilters(bundle: PocBundle, resolution: Resolution, filters: Filter[]): Resolution {
  if (!['catalog_list', 'catalog_empty'].includes(resolution.state)) return resolution;
  const fixedFamilyId = resolution.highlightedRecordId ? resolution.familyId : undefined;
  if (fixedFamilyId && filters.some(filter => filter.field === 'familyId' && filter.value !== fixedFamilyId)) return invalidUrl(resolution, ['family']);
  const requestedFamilyId = filters.find(filter => filter.field === 'familyId')?.value as FamilyId | undefined;
  const familyId = fixedFamilyId ?? requestedFamilyId;
  const accepted = availableFilterValues(bundle, familyId);
  if (filters.some(filter => !accepted[filter.field].includes(filter.value))) return invalidUrl(resolution, ['filter']);
  const effectiveFilters = familyId && !filters.some(filter => filter.field === 'familyId') ? [{ field: 'familyId' as const, value: familyId }, ...filters] : filters;
  const records = sort(bundle.records.filter(record => effectiveFilters.every(filter => record[filter.field] === filter.value)));
  const highlightedRecordId = resolution.highlightedRecordId && records.some(record => record.recordId === resolution.highlightedRecordId) ? resolution.highlightedRecordId : undefined;
  const trace = { ...resolution.trace, applied: traceValues(effectiveFilters, 'filter'), provenanceRefs: Array.from(new Set([...resolution.trace.provenanceRefs, ...provenanceForRecords(records)])) };
  return finish({ ...resolution, filters, familyId, records, highlightedRecordId, trace, selectedRecordId: undefined, detailOpen: false }, records.length ? 'catalog_list' : 'catalog_empty');
}

function invalidUrl(resolution: Resolution, rejectedFields: string[]): Resolution {
  return finish({ ...resolution, familyId: undefined, filters: [], records: [], highlightedRecordId: undefined, selectedRecordId: undefined, detailOpen: false, rejectedFields, trace: { ...resolution.trace, applied: [], provenanceRefs: ['bundle:PS-POC-SYNTHETIC-V1'] } }, 'invalid_url_state');
}

function uniqueSorted(values: number[]): number[];
function uniqueSorted(values: string[]): string[];
function uniqueSorted(values: Array<string | number>): Array<string | number> {
  return Array.from(new Set(values)).sort((a, b) => typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b)));
}
