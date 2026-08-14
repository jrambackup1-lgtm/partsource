import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { POC_BUNDLE } from './fixture';
import { applyFilters, availableFilterValues, resolveQuery, type Filter, type Resolution, type TraceValue } from './resolver';
import { loadPocBundle } from './runtime';
import type { CatalogRecord, FactField, FamilyId } from './types';
import { hydratePocUrl, serializePocUrl } from './url-state';
import './poc.css';

const runtime = loadPocBundle(POC_BUNDLE);
type HistoryState = { kind: 'partsource-selected'; returnUrl: string; focusRecordId: string; scrollY: number };

type Bundle = typeof POC_BUNDLE;

export default function PocApp() {
  const initial = hydratePocUrl(POC_BUNDLE, window.location.search);
  const [query, setQuery] = useState(initial.state === 'ready' ? initial.resolution.query : initial.state === 'invalid_selection' ? initial.resolution.query : initial.state === 'invalid_url_state' ? initial.query : '');
  const [resolution, setResolution] = useState<Resolution | null>(initial.state === 'ready' || initial.state === 'invalid_selection' ? initial.resolution : null);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(initial.state === 'ready' ? initial.selectedRecordId : null);
  const [notice, setNotice] = useState(initial.state === 'invalid_url_state' ? `Invalid URL state: ${initial.rejected.join(', ')}` : initial.state === 'invalid_selection' ? 'Invalid selection' : '');
  const [isNarrow, setIsNarrow] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<{ recordId: string; scrollY: number } | null>(null);
  const selectedOriginRef = useRef<string | null>(null);
  const selectedSnapshotRef = useRef<HistoryState | null>(null);
  const suppressHighlightScrollRef = useRef(false);
  if (runtime.state === 'catalog_unavailable') return <main className="poc-shell"><div className="poc-card"><h1>Catalog unavailable</h1></div></main>;
  const { bundle } = runtime;
  const replace = (next: Resolution, selected: string | null, state: HistoryState | null = null) => window.history.replaceState(state, '', serializePocUrl(next, selected));
  const focusRecord = (recordId: string) => requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-record-id="${recordId}"]`)?.focus({ preventScroll: true }));
  const restore = (recordId: string, scrollY: number) => { window.scrollTo({ top: scrollY, behavior: 'instant' as ScrollBehavior }); focusRecord(recordId); };
  const submit = () => { const next = resolveQuery(bundle, query); setResolution(next); setSelectedRecordId(null); setNotice(''); window.history.pushState(null, '', serializePocUrl(next, null)); };
  const apply = (filters: Filter[], focusResults = false) => {
    if (!resolution) return;
    const next = applyFilters(bundle, resolution, filters);
    const keep = selectedRecordId && next.records.some(record => record.recordId === selectedRecordId) ? selectedRecordId : null;
    setResolution(keep ? { ...next, selectedRecordId: keep, detailOpen: true } : next); setSelectedRecordId(keep); setNotice('');
    const snapshot = keep ? { kind: 'partsource-selected' as const, returnUrl: serializePocUrl(next, null), focusRecordId: keep, scrollY: window.scrollY } : null; selectedSnapshotRef.current = snapshot; replace(next, keep, snapshot);
    if (focusResults) requestAnimationFrame(() => document.getElementById('catalog-results-summary')?.focus({ preventScroll: true }));
  };
  const activate = (recordId: string) => {
    if (!resolution) return;
    const prior = window.history.state as HistoryState | null;
    const snapshot: HistoryState = { kind: 'partsource-selected', returnUrl: prior?.kind === 'partsource-selected' ? prior.returnUrl : serializePocUrl(resolution, null), focusRecordId: recordId, scrollY: prior?.kind === 'partsource-selected' ? prior.scrollY : window.scrollY };
    selectedSnapshotRef.current = snapshot; selectedOriginRef.current = recordId; setSelectedRecordId(recordId);
    if (prior?.kind === 'partsource-selected') window.history.replaceState(snapshot, '', serializePocUrl(resolution, recordId)); else window.history.pushState(snapshot, '', serializePocUrl(resolution, recordId));
  };
  const close = () => {
    const state = window.history.state as HistoryState | null;
    if (state?.kind === 'partsource-selected') { suppressHighlightScrollRef.current = true; restoreRef.current = { recordId: state.focusRecordId, scrollY: state.scrollY }; window.history.back(); return; }
    const recordId = selectedRecordId; if (resolution) replace(resolution, null); setSelectedRecordId(null); if (recordId) restore(recordId, window.scrollY);
  };
  const selected = resolution?.records.find(record => record.recordId === selectedRecordId) ?? null;
  useEffect(() => { const media = window.matchMedia('(max-width: 767px)'); const update = () => setIsNarrow(media.matches); update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, []);
  useEffect(() => { if (selected && isNarrow) workspaceRef.current?.setAttribute('inert', ''); else workspaceRef.current?.removeAttribute('inert'); }, [selected, isNarrow]);
  useEffect(() => { if (selected && isNarrow) document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, [selected, isNarrow]);
  useEffect(() => {
    const onPop = () => {
      let search = window.location.search;
      const snapshot = selectedSnapshotRef.current;
      if (snapshot && !new URLSearchParams(search).has('selected')) {
        window.history.replaceState(null, '', snapshot.returnUrl);
        search = snapshot.returnUrl;
        restoreRef.current ??= { recordId: snapshot.focusRecordId, scrollY: snapshot.scrollY };
        selectedSnapshotRef.current = null;
      }
      const next = hydratePocUrl(bundle, search);
      if (next.state === 'ready') { setQuery(next.resolution.query); setResolution(next.resolution); setSelectedRecordId(next.selectedRecordId); setNotice(''); }
      else if (next.state === 'invalid_selection') { setQuery(next.resolution.query); setResolution(next.resolution); setSelectedRecordId(null); setNotice('Invalid selection'); }
      else if (next.state === 'invalid_url_state') { setQuery(next.query); setResolution(null); setSelectedRecordId(null); setNotice(`Invalid URL state: ${next.rejected.join(', ')}`); }
      else { setResolution(null); setSelectedRecordId(null); setNotice(''); }
      const restoreTarget = restoreRef.current ?? (selectedOriginRef.current ? { recordId: selectedOriginRef.current, scrollY: window.scrollY } : null);
      if (restoreTarget) { restoreRef.current = null; selectedOriginRef.current = null; restore(restoreTarget.recordId, restoreTarget.scrollY); }
    };
    window.addEventListener('popstate', onPop); return () => window.removeEventListener('popstate', onPop);
  }, [bundle]);
  useEffect(() => { if (initial.state === 'ready' && initial.canonical) replace(initial.resolution, initial.selectedRecordId); }, []);
  useEffect(() => { if (suppressHighlightScrollRef.current) { suppressHighlightScrollRef.current = false; return; } if (resolution?.highlightedRecordId && !selectedRecordId) document.querySelector(`[data-record-id="${resolution.highlightedRecordId}"]`)?.scrollIntoView({ block: 'nearest' }); }, [resolution?.highlightedRecordId, selectedRecordId]);
  return <main className={selected ? 'poc-shell poc-shell-with-detail' : 'poc-shell'}>
    <div ref={workspaceRef} className="poc-workspace" inert={selected && isNarrow ? '' : undefined}>
      <header className="poc-header"><div><span className="poc-kicker">PartSource / local POC</span><h1>Progressive catalog</h1></div><span className="poc-badge">{bundle.manifest.bundleId}</span></header>
      <p className="poc-notice" role="note">{bundle.manifest.visibleNotice}</p>
      <form className="poc-search" onSubmit={event => { event.preventDefault(); submit(); }}><label htmlFor="catalog-query">Query</label><div><input id="catalog-query" value={query} onChange={event => setQuery(event.target.value)} /><button type="submit">Search</button></div></form>
      <section className="poc-card" aria-live="polite" aria-labelledby="catalog-context"><p className="poc-kicker">Catalog level</p><h2 id="catalog-context">Screws</h2>{notice && <State title={notice === 'Invalid selection' ? notice : 'Invalid URL state'} detail={notice} />}{!resolution && !notice && <p>Submit a supported query to choose a safe catalog context.</p>}{resolution && <CatalogResult bundle={bundle} resolution={resolution} selectedRecordId={selectedRecordId} onAdd={filter => apply([...resolution.filters.filter(current => current.field !== filter.field), filter])} onRemove={filter => apply(resolution.filters.filter(current => current.field !== filter.field || current.value !== filter.value), true)} onSelect={activate} />}</section>
    </div>
    {selected && <Detail bundle={bundle} record={selected} isNarrow={isNarrow} onClose={close} />}
  </main>;
}

type ResultProps = { bundle: Bundle; resolution: Resolution; selectedRecordId: string | null; onAdd: (filter: Filter) => void; onRemove: (filter: Filter) => void; onSelect: (recordId: string) => void };
const fieldLabels: Record<string, string> = { familyId: 'Family', nominalDiameterMm: 'Diameter', pitchMm: 'Pitch', lengthMm: 'Length', material: 'Material', finish: 'Finish', exactId: 'Identifier' };
const formatValue = (bundle: Bundle, field: string, value: string | number) => {
  if (field === 'familyId') return bundle.families.find(family => family.id === value)?.displayName ?? String(value);
  if (field === 'nominalDiameterMm') return `M${value}`;
  if (field === 'pitchMm') return `${Number(value).toFixed(Number(value) === 1 ? 1 : String(value).split('.')[1]?.length ?? 0)} mm`;
  if (field === 'lengthMm') return `${value} mm`;
  if (field === 'material') return value === 'a2_stainless' ? 'A2 stainless' : value === 'alloy_steel' ? 'Alloy steel' : String(value);
  if (field === 'finish') return value === 'passivated' ? 'passivated' : value === 'black_oxide' ? 'black oxide' : String(value);
  return String(value);
};
const formatFilter = (bundle: Bundle, filter: Filter) => [fieldLabels[filter.field], formatValue(bundle, filter.field, filter.value)];
const formatTraceValue = (bundle: Bundle, value: TraceValue) => `${fieldLabels[value.field] ?? value.field}: ${formatValue(bundle, value.field, value.value)}`;
const recordIdentifier = (bundle: Bundle, record: CatalogRecord) => bundle.mappings.find(mapping => mapping.recordId === record.recordId && mapping.identifierValue !== 'PSYN-SCR-COLLIDE')!.identifierValue;
const formatDatum = (datum: string) => datum.replace('_', ' ');
const factProvenance = (record: CatalogRecord, field: FactField) => record.displayedFactProvenance.find(fact => fact.field === field)!;

function CatalogPath({ bundle, familyId }: { bundle: Bundle; familyId?: string }) { return <p className="poc-path">Screws{familyId ? ` / Hex-socket screws / ${bundle.families.find(family => family.id === familyId)?.displayName}` : ''}</p>; }

function CatalogResult({ bundle, resolution, selectedRecordId, onAdd, onRemove, onSelect }: ResultProps) {
  const recognized = resolution.filters.map(filter => formatFilter(bundle, filter).join(': ')).join('; ');
  if (resolution.state === 'query_conflict') return <><p className="poc-query">Submitted query: <code>{resolution.query}</code></p><CatalogPath bundle={bundle} familyId={resolution.familyId} />{recognized && <p className="poc-recognized">Recognized filters: {recognized}</p>}<TracePanel bundle={bundle} resolution={resolution} /><State title="Conflicting supported values" detail={Object.entries(resolution.conflicts).map(([field, values]) => `${field}: ${values?.join(', ')}`).join('; ')} /></>;
  if (resolution.state === 'query_unsupported') return <><p className="poc-query">Submitted query: <code>{resolution.query}</code></p><CatalogPath bundle={bundle} familyId={resolution.familyId} />{recognized && <p className="poc-recognized">Recognized filters: {recognized}</p>}<TracePanel bundle={bundle} resolution={resolution} /><State title="Unsupported query constraint" detail={resolution.unsupportedTerms.length ? `Unsupported: ${resolution.unsupportedTerms.join(' ')}` : 'Enter a supported catalog query, for example: screws, socket head screws, or M6 screws.'} /></>;
  if (resolution.state === 'exact_not_found' || resolution.state === 'exact_non_unique') return <><p className="poc-query">Submitted query: <code>{resolution.query}</code></p><CatalogPath bundle={bundle} /><TracePanel bundle={bundle} resolution={resolution} /><State title={resolution.state === 'exact_not_found' ? 'Exact identifier not found' : 'Exact identifier is not unique'} detail={resolution.mappingEvidence.join(' ')} /></>;
  return <><p className="poc-query">Submitted query: <code>{resolution.query}</code></p><CatalogPath bundle={bundle} familyId={resolution.familyId} /><TracePanel bundle={bundle} resolution={resolution} /><div className="poc-filters" aria-label="Active filters">{resolution.filters.length ? resolution.filters.map(filter => { const [label, value] = formatFilter(bundle, filter); return <button key={`${filter.field}-${filter.value}`} type="button" aria-label={`Remove ${label} ${value}`} onClick={() => onRemove(filter)}>{label}: {value} ×</button>; }) : <span>No active filters</span>}</div><FilterControls bundle={bundle} familyId={resolution.familyId} onAdd={onAdd} /><p id="catalog-results-summary" className="poc-count" tabIndex={-1}>{resolution.records.length} matching configurations</p>{resolution.state === 'catalog_empty' ? <p className="poc-empty">No synthetic configuration matches this exact AND filter combination.</p> : <ol className="poc-results">{resolution.records.map(record => <ResultRow key={record.recordId} bundle={bundle} record={record} highlighted={record.recordId === resolution.highlightedRecordId} selected={record.recordId === selectedRecordId} onSelect={onSelect} />)}</ol>}</>;
}

function TracePanel({ bundle, resolution }: { bundle: Bundle; resolution: Resolution }) {
  const exact = resolution.trace.exactId;
  const conflictText = Object.entries(resolution.trace.conflicts).map(([field, values]) => `${fieldLabels[field] ?? field}: ${values?.join(', ')}`).join('; ') || 'None';
  return <section className="poc-trace" tabIndex={0} aria-label="Deterministic interpretation trace">
    <h3>Deterministic interpretation trace</h3>
    <dl>
      <div><dt>Original input</dt><dd>{resolution.trace.originalQuery || 'Empty'}</dd></div>
      <div><dt>Identifier state</dt><dd>{exact.state}{exact.mappingIds.length ? ` · mappings: ${exact.mappingIds.join(', ')}` : ''}{exact.recordIds.length ? ` · records: ${exact.recordIds.join(', ')}` : ''}</dd></div>
      <div><dt>Recognized</dt><dd>{resolution.trace.recognized.length ? resolution.trace.recognized.map(value => formatTraceValue(bundle, value)).join('; ') : 'None'}</dd></div>
      <div><dt>Applied</dt><dd>{resolution.trace.applied.length ? resolution.trace.applied.map(value => formatTraceValue(bundle, value)).join('; ') : 'None'}</dd></div>
      <div><dt>Unsupported</dt><dd>{resolution.trace.unsupportedTerms.length ? resolution.trace.unsupportedTerms.join(', ') : 'None'}</dd></div>
      <div><dt>Conflicts</dt><dd>{conflictText}</dd></div>
      <div><dt>Stop reason</dt><dd>{resolution.trace.stopReason}</dd></div>
      <div><dt>Provenance references</dt><dd>{resolution.trace.provenanceRefs.join('; ')}</dd></div>
    </dl>
  </section>;
}

function State({ title, detail }: { title: string; detail: string }) { return <div className="poc-state"><h3>{title}</h3><p>{detail}</p></div>; }

function FilterControls({ bundle, familyId, onAdd }: { bundle: Bundle; familyId?: FamilyId; onAdd: (filter: Filter) => void }) {
  const values = availableFilterValues(bundle, familyId);
  const controls: Array<[Filter['field'], string, Array<[string, string | number]>]> = [
    ['familyId', 'Family', values.familyId.map(value => [formatValue(bundle, 'familyId', value), value])],
    ['nominalDiameterMm', 'Diameter', values.nominalDiameterMm.map(value => [String(value), value])],
    ['pitchMm', 'Pitch', values.pitchMm.map(value => [String(value), value])],
    ['lengthMm', 'Length', values.lengthMm.map(value => [String(value), value])],
    ['material', 'Material', values.material.map(value => [formatValue(bundle, 'material', value), value])],
    ['finish', 'Finish', values.finish.map(value => [formatValue(bundle, 'finish', value), value])],
  ];
  return <div className="poc-controls" aria-label="Valid filter values"><p>Valid values shown for active synthetic scope.</p>{controls.filter(([field]) => field !== 'familyId' || !familyId).map(([field, label, options]) => <label key={field}>{label}<select defaultValue="" onChange={event => { const option = options.find(([, value]) => String(value) === event.target.value); if (option) onAdd({ field, value: option[1] }); event.currentTarget.value = ''; }}><option value="">Add</option>{options.map(([label, value]) => <option key={String(value)} value={String(value)}>{label}</option>)}</select></label>)}</div>;
}

function ResultRow({ bundle, record, highlighted, selected, onSelect }: { key?: string; bundle: Bundle; record: CatalogRecord; highlighted: boolean; selected: boolean; onSelect: (recordId: string) => void }) {
  const identifier = recordIdentifier(bundle, record);
  const family = bundle.families.find(item => item.id === record.familyId)!;
  const factsId = `${record.recordId}-facts`;
  const provenanceId = `${record.recordId}-provenance`;
  const statusId = `${record.recordId}-status`;
  return <li className={`poc-row${highlighted ? ' poc-highlighted' : ''}${selected ? ' poc-selected' : ''}`}><button data-record-id={record.recordId} type="button" aria-label={`Open ${identifier} detail`} aria-describedby={`${factsId} ${provenanceId} ${statusId}`} aria-pressed={selected} onClick={() => onSelect(record.recordId)}><strong>{identifier}</strong><span className="poc-open-action">Open detail</span><span id={factsId} className="poc-row-facts"><span>Family: {family.displayName}</span><span>Thread: M{record.nominalDiameterMm} × {record.pitchMm}</span><span>Length: {record.lengthMm} mm ({formatDatum(record.lengthDatum)})</span><span>Material: {record.material.replace('_', ' ')}</span><span>Finish: {record.finish.replace('_', ' ')}</span><span>Drive: {record.drive.replace('_', ' ')}</span><span>Head profile: {record.headProfile.replace('_', ' ')}</span></span><span id={provenanceId} className="poc-row-provenance"><span>Record provenance: Synthetic POC fixture</span><span>Fact provenance: synthetic fact</span><span>Mapping provenance: synthetic identifier mapping</span></span><span id={statusId}>{highlighted && <em>Exact identifier match — highlighted</em>}{highlighted && selected && <span>; </span>}{selected && <em className="poc-selection">Explicitly selected</em>}{highlighted && !selected && <span>, not selected</span>}{!highlighted && !selected && <span className="poc-muted-status">Not selected</span>}</span></button></li>;
}

function Detail({ bundle, record, isNarrow, onClose }: { bundle: Bundle; record: CatalogRecord; isNarrow: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus({ preventScroll: true }); }, []);
  const identifier = recordIdentifier(bundle, record);
  const trap = (event: KeyboardEvent<HTMLElement>) => { if (event.key === 'Escape') { event.preventDefault(); onClose(); } else if (isNarrow && event.key === 'Tab') { event.preventDefault(); closeRef.current?.focus(); } };
  return <aside className="poc-detail" role={isNarrow ? 'dialog' : 'complementary'} aria-modal={isNarrow || undefined} aria-labelledby="detail-title" onKeyDown={trap}><div className="poc-detail-header"><p>Explicit selection</p><button ref={closeRef} type="button" onClick={onClose}>Close detail</button></div><h2 id="detail-title">{identifier}</h2><dl><Fact label="Family" value={bundle.families.find(family => family.id === record.familyId)?.displayName ?? record.familyId} provenance={factProvenance(record, 'familyId').provenanceKind} /><Fact label="Thread" value={`M${record.nominalDiameterMm} × ${record.pitchMm}`} provenance={`${factProvenance(record, 'nominalDiameterMm').provenanceKind}; ${factProvenance(record, 'pitchMm').provenanceKind}`} /><Fact label="Length" value={`${record.lengthMm} mm (${formatDatum(record.lengthDatum)})`} provenance={`${factProvenance(record, 'lengthMm').provenanceKind}; ${factProvenance(record, 'lengthDatum').provenanceKind}`} /><Fact label="Material" value={record.material.replace('_', ' ')} provenance={factProvenance(record, 'material').provenanceKind} /><Fact label="Finish" value={record.finish.replace('_', ' ')} provenance={factProvenance(record, 'finish').provenanceKind} /><Fact label="Drive" value="Internal hex" provenance={factProvenance(record, 'drive').provenanceKind} /><Fact label="Head profile" value={record.headProfile.replace('_', ' ')} provenance={factProvenance(record, 'headProfile').provenanceKind} /><div><dt>Bundle</dt><dd>{bundle.manifest.bundleId} / {bundle.manifest.version}</dd></div></dl><div className="poc-provenance"><span>Record provenance: {record.provenanceKind} / {record.provenanceBundleId}</span><span>Displayed fact provenance: {record.displayedFactProvenance.map(fact => `${fact.field}:${fact.provenanceKind}`).join('; ')}</span><span>Identifier mapping provenance: synthetic_identifier / {bundle.manifest.bundleId}</span></div><p className="poc-notice">{bundle.manifest.visibleNotice}</p></aside>;
}

function Fact({ label, value, provenance }: { label: string; value: string; provenance: string }) { return <div><dt>{label}</dt><dd>{value}<span className="poc-fact-provenance">Fact provenance: {provenance}</span></dd></div>; }
