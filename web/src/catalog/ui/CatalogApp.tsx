import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  activateCatalogRecord,
  applyCatalogFilters,
  createCatalogIndex,
  hydrateCatalogUrl,
  projectCatalogView,
  resolveCatalogQuery,
  selectCatalogRecord,
  serializeCatalogUrl,
  type CatalogFilter,
  type CatalogRecordProjection,
  type CatalogResolution,
} from '../engine';
import type { FactAssignment, FactDefinition } from '../contracts';
import { SYNTHETIC_CATALOG_PACKAGE } from '../synthetic-package';

const index = createCatalogIndex(SYNTHETIC_CATALOG_PACKAGE);
const EMPTY = resolveCatalogQuery(index, '');

function human(value: string | number) {
  return typeof value === 'number' ? String(value) : value.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function factValue(fact: FactAssignment | undefined, definition?: FactDefinition) {
  if (!fact) return 'Not available';
  if (fact.value.state === 'known') return `${human(fact.value.value)}${definition?.unit ? ` ${definition.unit}` : ''}`;
  if (fact.value.state === 'conflicting') return `Conflicting: ${fact.value.values.map(human).join(', ')}`;
  return human(fact.value.state);
}

function recordFact(record: CatalogRecordProjection, factId: string) {
  return record.facts.find(fact => fact.factId === factId);
}

function identity(record: CatalogRecordProjection) {
  return record.identifiers[0]?.identifier ?? record.configurationId;
}

function pathFor(resolution: CatalogResolution) {
  return resolution.hierarchyPath.map(node => node.label).join(' / ');
}

export default function CatalogApp() {
  const initial = useMemo(() => {
    const hydrated = hydrateCatalogUrl(index, window.location.search);
    return hydrated.state === 'ready' || hydrated.state === 'invalid_selection' ? hydrated.resolution : EMPTY;
  }, []);
  const [resolution, setResolution] = useState(initial);
  const [query, setQuery] = useState(initial.query);
  const [urlWarning, setUrlWarning] = useState(() => hydrateCatalogUrl(index, window.location.search).state === 'invalid_url_state');
  const resultSummary = useRef<HTMLHeadingElement>(null);
  const priorResolution = useRef(resolution);
  const returnFocus = useRef<HTMLElement | null>(null);
  const view = projectCatalogView(index, resolution);

  const commit = (next: CatalogResolution, mode: 'push' | 'replace' = 'push') => {
    setResolution(next);
    setUrlWarning(false);
    const url = `${window.location.pathname}${serializeCatalogUrl(index, next)}`;
    window.history[mode === 'push' ? 'pushState' : 'replaceState']({ catalog: true }, '', url);
  };

  const goHome = () => {
    setQuery('');
    setResolution(EMPTY);
    setUrlWarning(false);
    window.history.pushState({ catalog: true }, '', window.location.pathname);
  };

  useEffect(() => {
    const pop = () => {
      const hydrated = hydrateCatalogUrl(index, window.location.search);
      if (hydrated.state === 'ready' || hydrated.state === 'invalid_selection') {
        setResolution(hydrated.resolution);
        setQuery(hydrated.resolution.query);
        setUrlWarning(hydrated.state === 'invalid_selection');
      } else if (hydrated.state === 'empty') {
        setResolution(EMPTY);
        setQuery('');
      } else {
        // Invalid history is never allowed to leave a previously valid result set on screen.
        setResolution(EMPTY);
        setQuery(hydrated.query);
        setUrlWarning(true);
      }
    };
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);

  useEffect(() => {
    if (priorResolution.current.detail && !resolution.detail) {
      requestAnimationFrame(() => returnFocus.current?.focus());
    }
    priorResolution.current = resolution;
  }, [resolution]);

  useEffect(() => {
    if (resolution.exact?.state !== 'one') return;
    requestAnimationFrame(() => document.querySelector(window.matchMedia('(max-width: 560px)').matches ? '.record-cards [data-exact-row]' : '.table-wrap [data-exact-row]')?.scrollIntoView({ block: 'center' }));
  }, [resolution.exact, resolution.exactMatchRevisionId]);

  const search = (event: FormEvent) => {
    event.preventDefault();
    commit(resolveCatalogQuery(index, query));
  };

  const browseFamily = (familyId: string) => {
    const family = index.familiesById.get(familyId)!;
    setQuery(family.label);
    commit(resolveCatalogQuery(index, family.label));
  };

  const browseAll = () => {
    setQuery('screws');
    commit(resolveCatalogQuery(index, 'screws'));
  };

  const setFacet = (factId: string, raw: string) => {
    const definition = index.factDefinitionsById.get(factId)!;
    const filters: CatalogFilter[] = resolution.filters.filter(filter => filter.factId !== factId);
    if (raw) {
      const value = definition.valueType === 'number' ? Number(raw) : raw;
      filters.push({ factId, value, source: 'user' });
    }
    commit(applyCatalogFilters(index, resolution, filters), 'replace');
    requestAnimationFrame(() => resultSummary.current?.focus());
  };

  const openInspector = (record: CatalogRecordProjection) => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const snapshot = { resolution, url: '', scrollTop: window.scrollY, rowFocusTarget: record.configurationId };
    commit(activateCatalogRecord(index, snapshot, record.configurationId).snapshot.resolution);
  };

  const closeInspector = () => {
    commit(selectCatalogRecord(index, resolution, null), 'replace');
  };

  const error = stateMessage(resolution);
  const hasResultsState = resolution.state === 'catalog_list' || resolution.state === 'catalog_empty';

  return <div className="app-shell">
    <a className="skip-link" href="#main" data-inspector-background>Skip to catalog</a>
    <header className="topbar" data-inspector-background>
      <button className="brand" type="button" onClick={goHome} aria-label="PartSource home">
        <span className="brand-mark" aria-hidden="true">P</span><span>PartSource</span>
      </button>
      <form className="global-search" role="search" onSubmit={search}>
        <label className="sr-only" htmlFor="catalog-query">Search the catalog</label>
        <span aria-hidden="true" className="search-icon">⌕</span>
        <input id="catalog-query" aria-label="Query" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by family, attributes, or exact synthetic ID" />
        <button type="submit">Search</button>
      </form>
      <span className="catalog-pill">Synthetic catalog</span>
    </header>

    <div className="notice" role="note" data-inspector-background><strong>Synthetic data</strong><span>{view.notice}</span><span className="release" title={view.digest}>Catalog: {view.releaseId} · {view.digest.slice(0, 19)}…<span className="sr-only"> Full catalog digest: {view.digest}</span></span></div>

    <main id="main" data-inspector-background>
      {urlWarning && <section className="status-card warning" role="alert"><h2>Catalog link could not be restored</h2><p>The link contained invalid or stale catalog state. No records were inferred. Start a new search or browse below.</p></section>}

      {resolution.state === 'initial' && <Home onAll={browseAll} onFamily={browseFamily} onExample={value => { setQuery(value); commit(resolveCatalogQuery(index, value)); }} />}

      {resolution.state !== 'initial' && <div className="catalog-layout">
        <aside className="browse-panel" aria-label="Browse catalog">
          <p className="eyebrow">Browse</p>
          <nav aria-label="Catalog hierarchy">
            <button className={!view.family ? 'tree-current' : ''} aria-current={!view.family ? 'page' : undefined} onClick={browseAll}><span>⌄</span> Screws <small>30</small></button>
            <div className="tree-branch">
              <div className="tree-category">Hex-socket screws</div>
              {SYNTHETIC_CATALOG_PACKAGE.families.map(family => <button key={family.familyId} className={view.family?.familyId === family.familyId ? 'tree-current' : ''} aria-current={view.family?.familyId === family.familyId ? 'page' : undefined} onClick={() => browseFamily(family.familyId)}>{family.label}<small>10</small></button>)}
            </div>
          </nav>
        </aside>

        <section className="catalog-content" aria-labelledby="catalog-title">
          <nav className="breadcrumbs" aria-label="Breadcrumb">{resolution.hierarchyPath.map((node, i) => <span key={node.nodeId}>{i > 0 && <i aria-hidden="true">/</i>}{node.label}</span>)}</nav>
          <div className="catalog-heading">
            <div><p className="eyebrow">Catalog family</p><h1 id="catalog-title">{view.family?.label ?? 'Screws'}</h1><p>{view.family ? 'Compare defined configurations and inspect their field-level synthetic evidence.' : 'Browse all represented synthetic screw families.'}</p></div>
            {hasResultsState && <div className="count-block"><strong>{view.resultCount}</strong><span>configurations</span></div>}
          </div>

          {error && <section className="status-card" role="status"><span className="status-icon" aria-hidden="true">!</span><div><h2>{error.title}</h2><p>{error.body}</p>{resolution.familyId && <p className="safe-context">Recognized context: {pathFor(resolution)}</p>}</div></section>}

          {hasResultsState && <>
            {view.family && <Facets resolution={resolution} onChange={setFacet} />}
            {resolution.filters.length > 0 && <ActiveConstraints filters={resolution.filters} />}
            {resolution.exact?.state === 'one' && <div className="exact-banner" role="status"><strong>Exact identifier match {resolution.selectedRecordId ? 'selected' : 'highlighted'}</strong><span>{resolution.selectedRecordId ? 'The mapped configuration is selected and its evidence is open.' : 'The matching row is highlighted, not selected. Activate it to inspect details.'} Mapping evidence: {resolution.exact.mappings[0]?.mappingId} · {resolution.exact.mappings[0]?.provenanceId}.</span></div>}
            <h2 ref={resultSummary} id="catalog-results-summary" className="result-heading" tabIndex={-1}>{view.resultCount} matching {view.resultCount === 1 ? 'configuration' : 'configurations'}</h2>
            {view.resultCount ? <Results records={view.records} onOpen={openInspector} /> : <div className="empty-results"><h3>No matching configurations</h3><p>No synthetic configuration matches this exact AND filter combination.</p></div>}
          </>}
        </section>
      </div>}
    </main>

    {view.detail && <Inspector detail={view.detail} onClose={closeInspector} />}
  </div>;
}

function Home({ onAll, onFamily, onExample }: { onAll: () => void; onFamily: (id: string) => void; onExample: (query: string) => void }) {
  return <>
    <section className="hero">
      <div><p className="eyebrow">Structured component catalog</p><h1>Find the configuration,<br /><em>see the evidence.</em></h1><p className="hero-copy">Browse a small, deterministic catalog designed to show transparent product facts and traceable synthetic evidence.</p><div className="hero-actions"><button className="primary" onClick={onAll}>Browse all screws <span aria-hidden="true">→</span></button><a href="#families">Explore families</a></div><div className="examples" aria-labelledby="examples-title"><strong id="examples-title">Try a supported search</strong><div>{['M4 screws', 'A2 stainless socket head cap screws', 'PSYN-SCR-0001'].map(example => <button key={example} onClick={() => onExample(example)}>{example}</button>)}</div></div></div>
      <div className="hero-visual" aria-hidden="true"><div className="part-illustration">⌾<i>╱</i></div></div>
    </section>
    <section id="families" className="family-section" aria-labelledby="family-title"><div className="section-heading"><div><p className="eyebrow">Browse the hierarchy</p><h2 id="family-title">Choose a screw family</h2></div><button className="text-button" onClick={onAll}>View all 30 configurations →</button></div>
      <div className="family-grid">{SYNTHETIC_CATALOG_PACKAGE.families.map((family, i) => <button key={family.familyId} className="family-card" onClick={() => onFamily(family.familyId)}><span className={`family-art art-${i}`} aria-hidden="true">⌾<i>╱</i></span><span className="family-card-copy"><small>Hex-socket screws</small><strong>{family.label}</strong><span>10 synthetic configurations <b aria-hidden="true">→</b></span></span></button>)}</div>
    </section>
  </>;
}

function ActiveConstraints({ filters }: { filters: readonly CatalogFilter[] }) {
  return <section className="active-constraints" aria-labelledby="active-constraints-title">
    <strong id="active-constraints-title">Active constraints</strong>
    <ul>{filters.map(filter => { const definition = index.factDefinitionsById.get(filter.factId); return <li key={filter.factId}>{definition?.label ?? human(filter.factId)}: <b>{factValue({ factId: filter.factId, value: { state: 'known', value: filter.value }, provenanceIds: [] }, definition)}</b></li>; })}</ul>
  </section>;
}

function Facets({ resolution, onChange }: { resolution: CatalogResolution; onChange: (factId: string, value: string) => void }) {
  const view = projectCatalogView(index, resolution);
  return <section className="facets" aria-label="Filter configurations"><div className="facet-title"><strong>Refine results</strong><span>Filters combine with AND</span></div><div className="facet-grid">
    {view.facets.map(facet => <label key={facet.facetId}><span>{facet.label}</span><select aria-label={facet.label} value={String(resolution.filters.find(filter => filter.factId === facet.factId)?.value ?? '')} onChange={event => onChange(facet.factId, event.target.value)}><option value="">All</option>{facet.values.map(option => <option key={String(option.value)} value={String(option.value)}>{human(option.value)} ({option.count})</option>)}</select></label>)}
  </div></section>;
}

function Results({ records, onOpen }: { records: readonly CatalogRecordProjection[]; onOpen: (record: CatalogRecordProjection) => void }) {
  return <>
    <div className="table-wrap"><table><caption className="sr-only">Catalog configurations</caption><thead><tr><th>Identifier</th><th>Family</th><th>Diameter</th><th>Pitch</th><th>Length</th><th>Length datum</th><th>Drive / head form</th><th>Material / finish</th><th><span className="sr-only">Action</span></th></tr></thead><tbody>
      {records.map(record => <tr key={record.configurationRevisionId} data-exact-row={record.exactMatch || undefined} aria-selected={record.selected} className={`${record.exactMatch ? 'exact-row' : ''} ${record.selected ? 'selected-row' : ''}`}><td><button className="row-id" data-record={record.configurationId} onClick={() => onOpen(record)} aria-label={`Inspect ${identity(record)}`} aria-pressed={record.selected}>{identity(record)}</button>{record.exactMatch && <span className="match-label">Exact match · {record.selected ? 'selected' : 'not selected'}</span>}{record.selected && !record.exactMatch && <span className="selected-label">Selected</span>}</td><td>{record.familyLabel}</td><td>{displayFact(record, 'nominal_diameter_mm')}</td><td>{displayFact(record, 'pitch_mm')}</td><td>{displayFact(record, 'length_mm')}</td><td>{displayFact(record, 'length_datum')}</td><td>{displayFact(record, 'drive')} / {displayFact(record, 'head_profile')}</td><td>{displayFact(record, 'material')} / {displayFact(record, 'finish')}</td><td><button className="inspect-button" onClick={() => onOpen(record)} aria-label={`Open details for ${identity(record)}`}>Inspect <span aria-hidden="true">›</span></button></td></tr>)}
    </tbody></table></div>
    <div className="record-cards" aria-label="Catalog configurations">
      {records.map(record => <article key={record.configurationRevisionId} data-exact-row={record.exactMatch || undefined} className={`${record.exactMatch ? 'exact-card' : ''} ${record.selected ? 'selected-card' : ''}`} aria-labelledby={`card-${record.configurationId}`}><header><button id={`card-${record.configurationId}`} className="row-id" data-record={record.configurationId} onClick={() => onOpen(record)} aria-pressed={record.selected}>Inspect {identity(record)}</button>{record.exactMatch && <span className="match-label">Exact match · {record.selected ? 'selected' : 'not selected'}</span>}{record.selected && !record.exactMatch && <span className="selected-label">Selected</span>}</header><p>{record.familyLabel}</p><dl><CardFact label="Diameter" value={displayFact(record, 'nominal_diameter_mm')} /><CardFact label="Pitch" value={displayFact(record, 'pitch_mm')} /><CardFact label="Length" value={displayFact(record, 'length_mm')} /><CardFact label="Length datum" value={displayFact(record, 'length_datum')} /><CardFact label="Drive" value={displayFact(record, 'drive')} /><CardFact label="Head form" value={displayFact(record, 'head_profile')} /><CardFact label="Material" value={displayFact(record, 'material')} /><CardFact label="Finish" value={displayFact(record, 'finish')} /></dl><button className="inspect-button" onClick={() => onOpen(record)} aria-label={`Open details for ${identity(record)}`}>Inspect details <span aria-hidden="true">›</span></button></article>)}
    </div>
  </>;
}

function displayFact(record: CatalogRecordProjection, factId: string) {
  return factValue(recordFact(record, factId), index.factDefinitionsById.get(factId));
}

function CardFact({ label, value }: { label: string; value: string }) {
  return <div><dt>{label}</dt><dd>{value}</dd></div>;
}

function Inspector({ detail, onClose }: { detail: NonNullable<ReturnType<typeof projectCatalogView>['detail']>; onClose: () => void }) {
  const id = identity(detail);
  const panel = useRef<HTMLElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 700px)').matches);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 700px)');
    const changed = () => setMobile(media.matches);
    media.addEventListener('change', changed);
    return () => media.removeEventListener('change', changed);
  }, []);

  useEffect(() => {
    const background = Array.from(document.querySelectorAll<HTMLElement>('[data-inspector-background]'));
    background.forEach(element => { element.inert = mobile; });
    close.current?.focus();
    return () => background.forEach(element => { element.inert = false; });
  }, [mobile]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (!mobile || event.key !== 'Tab' || !panel.current) return;
      const focusable = (Array.from(panel.current.querySelectorAll('button, a[href], summary, [tabindex]:not([tabindex="-1"])')) as HTMLElement[]).filter(element => !element.hasAttribute('disabled'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [mobile, onClose]);

  const mappingProvenance = detail.identifiers.map(identifier => ({ identifier, source: detail.provenance.find(item => item.provenanceId === identifier.provenanceId) }));
  return <div className={`inspector-backdrop ${mobile ? 'is-modal' : 'is-complementary'}`} onMouseDown={event => { if (mobile && event.target === event.currentTarget) onClose(); }}><aside ref={panel} className="inspector" role={mobile ? 'dialog' : 'complementary'} aria-modal={mobile ? true : undefined} aria-labelledby="inspector-title"><header><div><p className="eyebrow">Configuration inspector</p><h2 id="inspector-title">{id}</h2><p>{detail.familyLabel}</p></div><button ref={close} className="close-button" onClick={onClose} aria-label="Close inspector">×</button></header>
    <div className="inspector-notice"><span aria-hidden="true">◇</span><p><strong>Synthetic demonstration record</strong>This information is not an engineering reference.</p></div>
    <section aria-labelledby="facts-title"><h3 id="facts-title">Defined facts</h3><dl className="fact-list">{detail.facts.map(fact => { const definition = detail.factDefinitions.find(item => item.factId === fact.factId); return <div key={fact.factId}><dt>{definition?.label ?? human(fact.factId)}</dt><dd><span>{factValue(fact, definition)}</span><details><summary>Evidence</summary>{fact.provenanceIds.map(provenanceId => { const source = detail.provenance.find(item => item.provenanceId === provenanceId); return <p key={provenanceId}>Synthetic fixture · {source?.sourceId ?? 'Source unavailable'}{source?.evidenceRefs.map(ref => <small key={ref.ref}>{ref.ref}</small>)}</p>})}</details></dd></div>})}</dl></section>
    <section aria-labelledby="identifier-title"><h3 id="identifier-title">Catalog identity and mapping evidence</h3><dl className="identity-list"><div><dt>Identifier</dt><dd>{id}</dd></div><div><dt>Revision</dt><dd>{detail.configurationRevisionId}</dd></div>{mappingProvenance.map(({ identifier, source }) => <div key={identifier.mappingId}><dt>Identifier mapping</dt><dd>{identifier.mappingId}<small>{identifier.namespaceId} · {identifier.provenanceId}</small><small>Synthetic fixture · {source?.sourceId ?? 'Source unavailable'}</small>{source?.evidenceRefs.map(ref => <small key={ref.ref}>{ref.ref}</small>)}</dd></div>)}</dl></section>
  </aside></div>;
}

function stateMessage(resolution: CatalogResolution): { title: string; body: string } | null {
  switch (resolution.state) {
    case 'exact_not_found': return { title: 'Exact identifier not found', body: 'No unique synthetic mapping exists for this identifier. No results are shown.' };
    case 'exact_non_unique': return { title: 'Exact identifier is not unique', body: 'Multiple mappings exist, so the catalog has failed closed without choosing a record.' };
    case 'query_unsupported': return { title: 'Search terms not recognized', body: 'This catalog only returns records for terms it can interpret safely. Try a family name, “M4 screws,” “A2 stainless,” or an exact synthetic ID.' };
    case 'query_conflict': return { title: 'Search terms conflict', body: 'The query contains conflicting catalog facts. No results are shown.' };
    case 'invalid_filter': return { title: 'Filter could not be applied', body: 'The requested field is not valid in this family context. No results are shown.' };
    case 'invalid_selection': return { title: 'Configuration unavailable', body: 'That selection is not present in the current result set.' };
    default: return null;
  }
}
