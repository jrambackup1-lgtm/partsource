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
  type CatalogFamilyChoice,
  type CatalogFilter,
  type CatalogIndex,
  type CatalogRecordProjection,
  type CatalogResolution,
  type FacetProjection,
} from '../engine';
import type { FactAssignment, FactDefinition, FactPrimitive } from '../contracts';
import { SYNTHETIC_CATALOG_PACKAGE } from '../synthetic-package';
import { loadDevCatalogRelease, requestedCatalogSelection } from '../../dev-catalog-source';

const SYNTHETIC_INDEX = createCatalogIndex(SYNTHETIC_CATALOG_PACKAGE);
const syntheticEmpty = resolveCatalogQuery(SYNTHETIC_INDEX, '');
const emptyFor = (catalogIndex: CatalogIndex) => resolveCatalogQuery(catalogIndex, '');

const RESULT_STATES = ['catalog_list', 'catalog_empty', 'catalog_chooser'] as const;

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

function rootNodeId(index: CatalogIndex): string {
  return index.package.hierarchy.find(node => node.parentNodeId === null)?.nodeId ?? '';
}

function rootLabel(index: CatalogIndex): string {
  return index.package.hierarchy.find(node => node.parentNodeId === null)?.label ?? 'Catalog';
}

function contextLabel(resolution: CatalogResolution, fallback: string) {
  return resolution.hierarchyPath.at(-1)?.label ?? fallback;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const changed = () => setMatches(media.matches);
    media.addEventListener('change', changed);
    return () => media.removeEventListener('change', changed);
  }, [query]);
  return matches;
}

const PAGE_SIZE = 50;

interface ColumnSpec { readonly factId: string; readonly label: string }
interface FamilyShape {
  readonly columns: readonly ColumnSpec[];
  readonly constants: readonly { factId: string; label: string; value: string }[];
}

/**
 * Schema-driven presentation shape (u4): facts that vary within the family
 * become comparison columns; facts constant across the family become family
 * identity chips instead of dead columns.
 */
function familyShape(index: CatalogIndex, familyId: string | null): FamilyShape {
  if (!familyId) return { columns: [], constants: [] };
  const configurations = index.configurationsByFamilyId.get(familyId) ?? [];
  const schema = index.currentSchemaByFamilyId.get(familyId);
  if (!schema || !configurations.length) return { columns: [], constants: [] };
  const columns: ColumnSpec[] = [];
  const constants: { factId: string; label: string; value: string }[] = [];
  for (const factId of schema.factIds) {
    const definition = index.factDefinitionsById.get(factId);
    if (!definition) continue;
    const distinct = new Set<string>();
    let allKnown = true;
    for (const configuration of configurations) {
      const value = configuration.facts.get(factId)?.value;
      if (value?.state !== 'known') { allKnown = false; continue; }
      distinct.add(`${typeof value.value}:${String(value.value)}`);
      if (distinct.size > 1 && !allKnown) break;
    }
    if (distinct.size > 1) {
      if (columns.length < 7) columns.push({ factId, label: definition.label });
    } else if (distinct.size === 1 && allKnown) {
      const first = configurations.map(configuration => configuration.facts.get(factId)?.value)
        .find((value): value is { state: 'known'; value: string | number } => value?.state === 'known');
      if (first) constants.push({
        factId,
        label: definition.label,
        value: `${typeof first.value === 'number' ? String(first.value) : human(first.value)}${definition.unit ? ` ${definition.unit}` : ''}`,
      });
    }
  }
  return { columns, constants };
}

function sortRecords(records: readonly CatalogRecordProjection[], sort: Readonly<{ factId: string | null; dir: 'asc' | 'desc' }>): readonly CatalogRecordProjection[] {
  if (!sort.factId) return records;
  const direction = sort.dir === 'asc' ? 1 : -1;
  return [...records].sort((left, right) => {
    const leftValue = left.facts.find(fact => fact.factId === sort.factId)?.value;
    const rightValue = right.facts.find(fact => fact.factId === sort.factId)?.value;
    if (leftValue?.state === 'known' && rightValue?.state === 'known') {
      if (typeof leftValue.value === 'number' && typeof rightValue.value === 'number' && leftValue.value !== rightValue.value) {
        return (leftValue.value - rightValue.value) * direction;
      }
      const compared = String(leftValue.value).localeCompare(String(rightValue.value));
      if (compared) return compared * direction;
    }
    if (leftValue?.state === 'known') return -1;
    if (rightValue?.state === 'known') return 1;
    return left.configurationId.localeCompare(right.configurationId);
  });
}

export default function CatalogApp() {
  // Synthetic stays the module-load default; ?catalog=real swaps in the
  // dev-only release through the app-layer source seam (u1 decision D5).
  const [catalog, setCatalog] = useState<{ index: CatalogIndex; pill: string }>({
    index: SYNTHETIC_INDEX,
    pill: 'Synthetic catalog',
  });
  const index = catalog.index;
  const initial = useMemo(() => {
    const hydrated = hydrateCatalogUrl(SYNTHETIC_INDEX, window.location.search);
    return hydrated.state === 'ready' || hydrated.state === 'invalid_selection' ? hydrated.resolution : syntheticEmpty;
  }, []);
  const [resolution, setResolution] = useState(initial);
  const [query, setQuery] = useState(initial.query);
  const [urlWarning, setUrlWarning] = useState(() => hydrateCatalogUrl(SYNTHETIC_INDEX, window.location.search).state === 'invalid_url_state');
  const [realCatalogStatus, setRealCatalogStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    () => (requestedCatalogSelection(window.location.search) === 'real-dev' ? 'loading' : 'idle'),
  );
  const indexRef = useRef(index);
  indexRef.current = index;
  const [page, setPage] = useState(() => Number(new URLSearchParams(window.location.search).get('page')) || 1);
  const [sort, setSort] = useState<Readonly<{ factId: string | null; dir: 'asc' | 'desc' }>>(() => {
    const parameters = new URLSearchParams(window.location.search);
    const factId = parameters.get('sort');
    const dir = parameters.get('dir') === 'desc' ? 'desc' : 'asc';
    return factId ? { factId, dir } : { factId: null, dir: 'asc' };
  });
  const narrow = useMediaQuery('(max-width: 560px)');
  const resultSummary = useRef<HTMLHeadingElement>(null);
  const errorSummary = useRef<HTMLHeadingElement>(null);
  const priorResolution = useRef(resolution);
  const returnFocus = useRef<HTMLElement | null>(null);
  const view = projectCatalogView(index, resolution);
  const hasResults = (RESULT_STATES as readonly string[]).includes(resolution.state);

  useEffect(() => {
    if (requestedCatalogSelection(window.location.search) !== 'real-dev') return;
    let cancelled = false;
    loadDevCatalogRelease().then(nextIndex => {
      if (cancelled) return;
      setCatalog({ index: nextIndex, pill: 'Dev catalog — cofounder data' });
      const hydrated = hydrateCatalogUrl(nextIndex, window.location.search);
      const next = hydrated.state === 'ready' || hydrated.state === 'invalid_selection'
        ? hydrated.resolution
        : resolveCatalogQuery(nextIndex, '');
      setResolution(next);
      setQuery(next.query);
      setRealCatalogStatus('ready');
    }).catch(() => { if (!cancelled) setRealCatalogStatus('error'); });
    return () => { cancelled = true; };
  }, []);

  const catalogParamSuffix = () => {
    const parameters = new URLSearchParams(window.location.search);
    return parameters.get('catalog') === 'real' ? '&catalog=real' : '';
  };

  // Pagination and sort are view state over the resolution: they stay in the
  // URL (u4) without creating an engine state, and are restored by popstate.
  useEffect(() => {
    if (resolution.state === 'initial') return;
    const parameters = new URLSearchParams(window.location.search);
    const suffixes: string[] = [];
    if (parameters.get('catalog') === 'real') suffixes.push('catalog=real');
    if (page > 1) suffixes.push(`page=${page}`);
    if (sort.factId) {
      suffixes.push(`sort=${encodeURIComponent(sort.factId)}`);
      if (sort.dir === 'desc') suffixes.push('dir=desc');
    }
    const suffix = suffixes.length ? `&${suffixes.join('&')}` : '';
    const url = `${window.location.pathname}${serializeCatalogUrl(index, resolution)}${suffix}`;
    window.history.replaceState({ catalog: true }, '', url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort, resolution]);

  const commit = (next: CatalogResolution, mode: 'push' | 'replace' = 'push') => {
    setResolution(next);
    setUrlWarning(false);
    const url = `${window.location.pathname}${serializeCatalogUrl(index, next)}${catalogParamSuffix()}`;
    window.history[mode === 'push' ? 'pushState' : 'replaceState']({ catalog: true }, '', url);
  };

  const focusOutcome = (next: CatalogResolution) => {
    requestAnimationFrame(() => {
      if ((RESULT_STATES as readonly string[]).includes(next.state)) resultSummary.current?.focus();
      else errorSummary.current?.focus();
    });
  };

  const goHome = () => {
    setQuery('');
    setPage(1);
    setSort({ factId: null, dir: 'asc' });
    setResolution(emptyFor(index));
    setUrlWarning(false);
    const suffix = new URLSearchParams(window.location.search).get('catalog') === 'real' ? '?catalog=real' : '';
    window.history.pushState({ catalog: true }, '', `${window.location.pathname}${suffix}`);
  };

  useEffect(() => {
    const pop = () => {
      const activeIndex = indexRef.current;
      const parameters = new URLSearchParams(window.location.search);
      setPage(Number(parameters.get('page')) || 1);
      const sortFactId = parameters.get('sort');
      setSort(sortFactId ? { factId: sortFactId, dir: parameters.get('dir') === 'desc' ? 'desc' : 'asc' } : { factId: null, dir: 'asc' });
      const hydrated = hydrateCatalogUrl(activeIndex, window.location.search);
      if (hydrated.state === 'ready' || hydrated.state === 'invalid_selection') {
        setResolution(hydrated.resolution);
        setQuery(hydrated.resolution.query);
        setUrlWarning(hydrated.state === 'invalid_selection');
      } else if (hydrated.state === 'empty') {
        setResolution(emptyFor(activeIndex));
        setQuery('');
      } else {
        // Invalid history is never allowed to leave a previously valid result set on screen.
        setResolution(emptyFor(activeIndex));
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
    setPage(1);
    const next = resolveCatalogQuery(index, query);
    commit(next);
    focusOutcome(next);
  };

  // Family selection is a context switch: query-derived constraints survive,
  // shown as removable active constraints inside the family.
  const browseFamily = (familyId: string) => {
    const family = index.familiesById.get(familyId)!;
    const keepsConstraints = resolution.filters.length > 0 && hasResults;
    setPage(1);
    if (keepsConstraints) {
      commit(applyCatalogFilters(index, resolution, resolution.filters, { familyId }));
    } else {
      setQuery(family.label);
      commit(resolveCatalogQuery(index, family.label));
    }
  };

  const browseAll = () => {
    setQuery('screws');
    setPage(1);
    const next = resolveCatalogQuery(index, 'screws');
    commit(next);
    focusOutcome(next);
  };

  // Multi-select facets (u4): OR within a fact, AND across facts. Toggling
  // one value never discards the other active values of the same fact.
  const toggleFacet = (factId: string, value: FactPrimitive) => {
    const active = resolution.filters.some(filter => filter.factId === factId && filter.value === value);
    const filters = active
      ? resolution.filters.filter(filter => !(filter.factId === factId && filter.value === value))
      : [...resolution.filters, { factId, value, source: 'user' as const }];
    setPage(1);
    commit(applyCatalogFilters(index, resolution, filters), 'replace');
    requestAnimationFrame(() => resultSummary.current?.focus());
  };

  const removeConstraintValues = (factId: string, values: readonly FactPrimitive[]) => {
    const filters = resolution.filters.filter(filter => !(filter.factId === factId && values.some(value => value === filter.value)));
    setPage(1);
    commit(applyCatalogFilters(index, resolution, filters), 'replace');
    requestAnimationFrame(() => resultSummary.current?.focus());
  };

  const chooseFamily = (familyId: string) => {
    setPage(1);
    const next = applyCatalogFilters(index, resolution, resolution.filters, { familyId });
    commit(next);
    focusOutcome(next);
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
  const totalChoiceRecords = resolution.familyChoices.reduce((total, choice) => total + choice.count, 0);
  const shape = useMemo(() => familyShape(index, resolution.familyId), [index, resolution.familyId]);
  const sortedRecords = useMemo(() => sortRecords(view.records, sort), [view.records, sort]);
  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRecords = sortedRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const sortableFacts = shape.columns.filter(column => index.factDefinitionsById.get(column.factId)?.valueType === 'number');
  const setSortFrom = (factId: string, dir: 'asc' | 'desc') => {
    setSort({ factId: factId || null, dir });
    setPage(1);
  };

  return <div className="app-shell">
    <a className="skip-link" href="#main" data-inspector-background>Skip to catalog</a>
    <header className="topbar" data-inspector-background>
      <button className="brand" type="button" onClick={goHome} aria-label="PartSource home">
        <span className="brand-mark" aria-hidden="true">P</span><span>PartSource</span>
      </button>
      <form className="global-search" role="search" onSubmit={search}>
        <label className="sr-only" htmlFor="catalog-query">Search the catalog</label>
        <span aria-hidden="true" className="search-icon">⌕</span>
        <input id="catalog-query" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by part number, family, or attributes" />
        <button type="submit">Search</button>
      </form>
      <span className="catalog-pill">{catalog.pill}</span>
    </header>

    <div className="notice" role="note" data-inspector-background><strong>Synthetic data</strong><span>{view.notice}</span><span className="release" title={view.digest}>Catalog: {view.releaseId} · {view.digest.slice(0, 19)}…<span className="sr-only"> Full catalog digest: {view.digest}</span></span></div>

    <main id="main" data-inspector-background>
      {urlWarning && <section className="status-card warning" role="alert"><h2>Catalog link could not be restored</h2><p>The link contained invalid or stale catalog state. No records were inferred. Start a new search or browse below.</p></section>}
      {realCatalogStatus === 'loading' && <section className="status-card" role="status"><span className="status-icon" aria-hidden="true">…</span><div><h2>Loading real catalog release</h2><p>The cofounder dataset release is large (~110 MB); loading may take a moment. The synthetic catalog stays visible until it is ready.</p></div></section>}
      {realCatalogStatus === 'error' && <section className="status-card warning" role="alert"><h2>Real catalog could not be loaded</h2><p>The development catalog release failed to load or verify, so nothing from it is shown. The synthetic catalog below remains active and labelled. Check that <code>npm run catalog:build-real</code> has run and the dev server is serving <code>catalog/real-screws-v1.json</code>.</p></section>}

      {resolution.state === 'initial' && <Home index={index} onAll={browseAll} onFamily={browseFamily} onExample={value => { setQuery(value); const next = resolveCatalogQuery(index, value); commit(next); focusOutcome(next); }} />}

      {resolution.state !== 'initial' && <div className="catalog-layout">
        <aside className="browse-panel" aria-label="Browse catalog">
          <p className="eyebrow">Browse</p>
          <nav aria-label="Catalog hierarchy">
            <button className={!view.family ? 'tree-current' : ''} aria-current={!view.family ? 'page' : undefined} onClick={browseAll}><span aria-hidden="true">⌄</span> {rootLabel(index)} <small>{index.package.configurations.length}</small></button>
            {(index.hierarchyChildren.get(rootNodeId(index)) ?? []).map(category => <div className="tree-branch" key={category.nodeId}>
              <div className="tree-category">{category.label}</div>
              {(index.hierarchyChildren.get(category.nodeId) ?? []).map(node => node.familyId && <button key={node.nodeId} className={view.family?.familyId === node.familyId ? 'tree-current' : ''} aria-current={view.family?.familyId === node.familyId ? 'page' : undefined} onClick={() => browseFamily(node.familyId!)}>{index.familiesById.get(node.familyId)!.label}<small>{index.configurationsByFamilyId.get(node.familyId)?.length ?? 0}</small></button>)}
            </div>)}
          </nav>
        </aside>

        <section className="catalog-content" aria-labelledby="catalog-title">
          <nav className="breadcrumbs" aria-label="Breadcrumb">{resolution.hierarchyPath.map((node, i) => <span key={node.nodeId}>{i > 0 && <i aria-hidden="true">/</i>}{node.label}</span>)}</nav>
          <div className="catalog-heading">
            <div><p className="eyebrow">Catalog family</p><h1 id="catalog-title">{view.family?.label ?? contextLabel(resolution, 'Screws')}</h1><p>{view.family ? 'Compare defined parts and inspect where every shown fact comes from.' : 'Choose a screw family to compare its parts.'}</p></div>
            {hasResults && <div className="count-block"><strong>{resolution.state === 'catalog_chooser' ? totalChoiceRecords : view.resultCount}</strong><span>{resolution.state === 'catalog_chooser' ? `parts · ${view.familyChoices.length} families` : 'parts'}</span></div>}
          </div>

          {error && <section className="status-card" role="alert"><span className="status-icon" aria-hidden="true">!</span><div><h2 ref={errorSummary} tabIndex={-1}>{error.title}</h2><p>{error.body}</p>{resolution.familyId && <p className="safe-context">Recognized context: {pathFor(resolution)}</p>}</div></section>}

          {hasResults && <>
            {resolution.unsupportedTerms.length > 0 && <div className="uninterpreted" role="note"><strong>Not interpreted:</strong><ul>{resolution.unsupportedTerms.map(term => <li key={term}>{term}</li>)}</ul><span>Kept as search text — no fact was inferred.</span></div>}
            {resolution.filters.length > 0 && <ActiveConstraints index={index} filters={resolution.filters} onRemove={removeConstraintValues} />}
            {view.family && shape.constants.length > 0 && <dl className="family-constants" aria-label="Constant family attributes">{shape.constants.slice(0, 8).map(constant => <div key={constant.factId}><dt>{constant.label}</dt><dd>{constant.value}</dd></div>)}</dl>}
            {resolution.state === 'catalog_chooser' && <FamilyChooser index={index} resolution={resolution} onChoose={chooseFamily} />}
            {view.family && <Facets facets={view.facets} onToggle={toggleFacet} />}
            {resolution.exact?.state === 'one' && <div className="exact-banner" role="status"><strong>Part {exactIdentifier(resolution)} matches — {bannerState(resolution)}</strong><span>{bannerBody(resolution)}</span></div>}
            <h2 ref={resultSummary} id="catalog-results-summary" className="result-heading" tabIndex={-1}>{
              resolution.state === 'catalog_chooser'
                ? `${view.familyChoices.length} matching ${view.familyChoices.length === 1 ? 'family' : 'families'}`
                : `${view.resultCount} matching ${view.resultCount === 1 ? 'part' : 'parts'}`
            }</h2>
            {resolution.state !== 'catalog_chooser' && (view.resultCount
              ? <>
                {sortableFacts.length > 0 && <div className="list-toolbar">
                  <label className="sort-control"><span>Sort by</span>
                    <select aria-label="Sort by" value={sort.factId ?? ''} onChange={event => setSortFrom(event.target.value, sort.dir)}>
                      <option value="">Catalog order</option>
                      {sortableFacts.map(column => <option key={column.factId} value={column.factId}>{column.label}</option>)}
                    </select>
                  </label>
                  <button type="button" className="sort-direction" onClick={() => setSortFrom(sort.factId ?? sortableFacts[0].factId, sort.dir === 'asc' ? 'desc' : 'asc')} disabled={!sort.factId} aria-label={`Sort direction ${sort.dir === 'asc' ? 'descending' : 'ascending'}`}>{sort.dir === 'asc' ? '↑ Asc' : '↓ Desc'}</button>
                  {sortedRecords.length > PAGE_SIZE && <span className="range-note">Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, sortedRecords.length)} of {sortedRecords.length}</span>}
                </div>}
                <Results index={index} records={pagedRecords} columns={shape.columns} narrow={narrow} onOpen={openInspector} />
                {sortedRecords.length > PAGE_SIZE && <nav className="pager" aria-label="Result pages">
                  <button type="button" onClick={() => { setPage(currentPage - 1); resultSummary.current?.focus(); }} disabled={currentPage <= 1}>Previous</button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button type="button" onClick={() => { setPage(currentPage + 1); resultSummary.current?.focus(); }} disabled={currentPage >= totalPages}>Next</button>
                </nav>}
              </>
              : <div className="empty-results"><h3>No matching parts</h3><p>No part matches this exact filter combination. Remove a constraint or try another value.</p></div>)}
          </>}
        </section>
      </div>}
    </main>

    {view.detail && <Inspector detail={view.detail} onClose={closeInspector} />}
  </div>;
}

function Home({ index, onAll, onFamily, onExample }: { index: CatalogIndex; onAll: () => void; onFamily: (id: string) => void; onExample: (query: string) => void }) {
  const isReal = index.package.manifest.dataOrigin === 'cofounder_private_dev';
  const examples = isReal ? ['M4 screws', 'socket head cap screws', '92655A331'] : ['M4 screws', 'A2 stainless socket head cap screws', 'PSYN-SCR-0001'];
  return <>
    <section className="hero">
      <div><p className="eyebrow">Structured component catalog</p><h1>Find the exact part,<br /><em>see every spec.</em></h1><p className="hero-copy">Start from a part number, a family, or a few attributes. Every result keeps its catalog context, and every shown fact carries its source.</p><div className="hero-actions"><button className="primary" onClick={onAll}>Browse all screws <span aria-hidden="true">→</span></button><a href="#families">Explore families</a></div><div className="examples" aria-labelledby="examples-title"><strong id="examples-title">Try a supported search</strong><div>{examples.map(example => <button key={example} onClick={() => onExample(example)}>{example}</button>)}</div></div></div>
      <div className="hero-visual" aria-hidden="true"><div className="part-illustration">⌾<i>╱</i></div></div>
    </section>
    <section id="families" className="family-section" aria-labelledby="family-title"><div className="section-heading"><div><p className="eyebrow">Browse the hierarchy</p><h2 id="family-title">Choose a screw family</h2></div><button className="text-button" onClick={onAll}>View all {index.package.configurations.length} parts →</button></div>
      <div className="family-grid">{index.package.families.slice(0, 6).map((family, i) => {
        const category = (index.hierarchyPathById.get(family.hierarchyNodeId) ?? []).at(-2)?.label ?? rootLabel(index);
        return <button key={family.familyId} className="family-card" onClick={() => onFamily(family.familyId)}><span className={`family-art art-${i % 3}`} aria-hidden="true">⌾<i>╱</i></span><span className="family-card-copy"><small>{category}</small><strong>{family.label}</strong><span>{index.configurationsByFamilyId.get(family.familyId)?.length ?? 0} parts <b aria-hidden="true">→</b></span></span></button>;
      })}</div>
    </section>
  </>;
}

function ActiveConstraints({ index, filters, onRemove }: { index: CatalogIndex; filters: readonly CatalogFilter[]; onRemove: (factId: string, values: readonly FactPrimitive[]) => void }) {
  const grouped = new Map<string, FactPrimitive[]>();
  for (const filter of filters) {
    const values = grouped.get(filter.factId) ?? [];
    values.push(filter.value);
    grouped.set(filter.factId, values);
  }
  return <section className="active-constraints" aria-labelledby="active-constraints-title">
    <strong id="active-constraints-title">Active constraints</strong>
    <ul>{[...grouped.entries()].map(([factId, values]) => {
      const definition = index.factDefinitionsById.get(factId);
      const label = definition?.label ?? human(factId);
      const text = values.map(value => factValue({ factId, value: { state: 'known', value }, provenanceIds: [] }, definition)).join(' or ');
      return <li key={factId}>{label}: <b>{text}</b><button type="button" className="constraint-remove" onClick={() => onRemove(factId, values)} aria-label={`Remove constraint ${label}: ${text}`}>×</button></li>;
    })}</ul>
  </section>;
}

function FamilyChooser({ index, resolution, onChoose }: { index: CatalogIndex; resolution: CatalogResolution; onChoose: (familyId: string) => void }) {
  const groups = new Map<string, CatalogFamilyChoice[]>();
  for (const choice of resolution.familyChoices) {
    const path = index.hierarchyPathById.get(choice.hierarchyNodeId) ?? [];
    const category = path.length > 1 ? path[path.length - 2].label : path[0]?.label ?? 'Catalog';
    groups.set(category, [...(groups.get(category) ?? []), choice]);
  }
  return <section className="family-chooser" aria-label="Matching families">
    {[...groups.entries()].map(([category, choices]) => <div className="chooser-group" key={category}>
      <p className="chooser-category">{category}</p>
      <ul>{choices.map(choice => <li key={choice.familyId}>
        <button type="button" className="chooser-family" onClick={() => onChoose(choice.familyId)}>
          <span>{choice.label}</span>
          <small>{choice.count} {choice.count === 1 ? 'part' : 'parts'}</small>
          <b aria-hidden="true">→</b>
        </button>
      </li>)}</ul>
    </div>)}
  </section>;
}

function Facets({ facets, onToggle }: { facets: readonly FacetProjection[]; onToggle: (factId: string, value: FactPrimitive) => void }) {
  return <section className="facets" aria-label="Filter configurations"><div className="facet-title"><strong>Refine results</strong><span>OR within a filter · AND across filters</span></div><div className="facet-grid">
    {facets.map(facet => <fieldset key={facet.facetId} className="facet-group"><legend>{facet.label}</legend>
      {facet.values.filter(option => option.active || option.count > 0).map(option => {
        const described = `${human(option.value)} (${option.count})`;
        return <label key={String(option.value)} className="facet-option"><input type="checkbox" checked={option.active} onChange={() => onToggle(facet.factId, option.value)} aria-label={`${facet.label}: ${described}`} /> {described}</label>;
      })}
    </fieldset>)}
  </div></section>;
}

function Results({ index, records, columns, narrow, onOpen }: { index: CatalogIndex; records: readonly CatalogRecordProjection[]; columns: readonly ColumnSpec[]; narrow: boolean; onOpen: (record: CatalogRecordProjection) => void }) {
  // One DOM representation per breakpoint (u4): the previous layout mounted
  // every record as both a table row and an always-attached mobile card.
  if (narrow) {
    return <div className="record-cards" aria-label="Matching parts">
      {records.map(record => <article key={record.configurationRevisionId} data-exact-row={record.exactMatch || undefined} className={`${record.exactMatch ? 'exact-card' : ''} ${record.selected ? 'selected-card' : ''}`} aria-labelledby={`card-${record.configurationId}`}><header><button id={`card-${record.configurationId}`} className="row-id" data-record={record.configurationId} onClick={() => onOpen(record)} aria-pressed={record.selected}>Inspect {identity(record)}</button>{record.exactMatch && <span className="match-label">Exact match · {record.selected ? 'selected' : 'not selected'}</span>}{record.selected && !record.exactMatch && <span className="selected-label">Selected</span>}</header><p>{record.familyLabel}</p><dl>{columns.slice(0, 6).map(column => <div key={column.factId}><dt>{column.label}</dt><dd>{displayFact(index, record, column.factId)}</dd></div>)}</dl><button className="inspect-button" onClick={() => onOpen(record)} aria-label={`Open details for ${identity(record)}`} aria-pressed={record.selected}>Inspect details <span aria-hidden="true">›</span></button></article>)}
    </div>;
  }
  return <div className="table-wrap"><table><caption className="sr-only">Matching parts</caption><thead><tr><th scope="col">Identifier</th>{columns.map(column => <th key={column.factId} scope="col">{column.label}</th>)}<th scope="col"><span className="sr-only">Action</span></th></tr></thead><tbody>
    {records.map(record => <tr key={record.configurationRevisionId} data-exact-row={record.exactMatch || undefined} className={`${record.exactMatch ? 'exact-row' : ''} ${record.selected ? 'selected-row' : ''}`}><td><button className="row-id" data-record={record.configurationId} onClick={() => onOpen(record)} aria-label={`Inspect ${identity(record)}`} aria-pressed={record.selected}>{identity(record)}</button>{record.exactMatch && <span className="match-label">Exact match · {record.selected ? 'selected' : 'not selected'}</span>}{record.selected && !record.exactMatch && <span className="selected-label">Selected</span>}</td>{columns.map(column => <td key={column.factId}>{displayFact(index, record, column.factId)}</td>)}<td><button className="inspect-button" onClick={() => onOpen(record)} aria-label={`Open details for ${identity(record)}`} aria-pressed={record.selected}>Inspect <span aria-hidden="true">›</span></button></td></tr>)}
  </tbody></table></div>;
}

function displayFact(index: CatalogIndex, record: CatalogRecordProjection, factId: string) {
  return factValue(recordFact(record, factId), index.factDefinitionsById.get(factId));
}


const STANDARD_FACT_IDS = new Set(['specifications_met', 'fastener_strength_grade_class', 'tensile_strength', 'hardness', 'rohs_compliance']);

function sourceLabel(source: { sourceKind: string } | undefined): string {
  if (source?.sourceKind === 'synthetic_fixture') return 'Synthetic fixture';
  if (source?.sourceKind === 'cofounder_private_dev') return 'Cofounder dataset (local dev)';
  return 'Catalog source';
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
    if (!mobile) return;
    // Lock background scroll behind the modal inspector; inert alone does not.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
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
  return <div className={`inspector-backdrop ${mobile ? 'is-modal' : 'is-complementary'}`} onMouseDown={event => { if (mobile && event.target === event.currentTarget) onClose(); }}><aside ref={panel} className="inspector" role={mobile ? 'dialog' : 'complementary'} aria-modal={mobile ? true : undefined} aria-labelledby="inspector-title"><header><div><p className="eyebrow">Part inspector</p><h2 id="inspector-title">{id}</h2><p>{detail.familyLabel}</p></div><button ref={close} className="close-button" onClick={onClose} aria-label="Close inspector">×</button></header>
    <div className="inspector-notice"><span aria-hidden="true">◇</span><p><strong>{detail.familyLabel}</strong>Part {id} — {detail.provenance[0]?.sourceKind === 'synthetic_fixture' ? 'synthetic demonstration data, not an engineering reference' : 'cofounder dev dataset, not reviewed for public release'} — field-level source evidence on every fact below.</p></div>
    <section aria-labelledby="facts-title"><h3 id="facts-title">Specifications</h3><dl className="fact-list">{detail.facts.filter(fact => !STANDARD_FACT_IDS.has(fact.factId)).map(fact => { const definition = detail.factDefinitions.find(item => item.factId === fact.factId); return <div key={fact.factId}><dt>{definition?.label ?? human(fact.factId)}</dt><dd><span>{factValue(fact, definition)}</span><details><summary>Evidence</summary>{fact.provenanceIds.map(provenanceId => { const source = detail.provenance.find(item => item.provenanceId === provenanceId); return <p key={provenanceId}>{sourceLabel(source)} · {source?.sourceId ?? 'Source unavailable'}{source?.evidenceRefs.map(ref => <small key={ref.ref}>{ref.ref}</small>)}</p>})}</details></dd></div>})}</dl></section>
    <section aria-labelledby="standards-title"><h3 id="standards-title">Standards and specifications met</h3><dl className="fact-list">{detail.facts.filter(fact => STANDARD_FACT_IDS.has(fact.factId)).map(fact => { const definition = detail.factDefinitions.find(item => item.factId === fact.factId); return <div key={fact.factId}><dt>{definition?.label ?? human(fact.factId)}</dt><dd><span>{factValue(fact, definition)}</span></dd></div>})}</dl></section>
    <section aria-labelledby="identifier-title"><h3 id="identifier-title">Diagnostics: identity and mapping evidence</h3><dl className="identity-list">{mappingProvenance.map(({ identifier, source }) => <div key={identifier.mappingId}><dt>Part number ({identifier.namespaceLabel})</dt><dd>{identifier.identifier}<small>mapping {identifier.mappingId} · {identifier.provenanceId}</small><small>{sourceLabel(source)} · {source?.sourceId ?? 'Source unavailable'}</small>{source?.evidenceRefs.map(ref => <small key={ref.ref}>{ref.ref}</small>)}</dd></div>)}<div><dt>Internal revision</dt><dd>{detail.configurationRevisionId}</dd></div></dl></section>
  </aside></div>;
}

function exactIdentifier(resolution: CatalogResolution): string {
  return resolution.exact?.submittedIdentifier ?? '';
}

/** The banner states only what is true: highlighted, selected-by-you, or filtered out (u5). */
function bannerState(resolution: CatalogResolution): string {
  if (resolution.highlightedRecordId === null) return 'filtered out';
  return resolution.selectedRecordId != null && resolution.selectedRecordId === resolution.highlightedRecordId ? 'selected' : 'highlighted below';
}

function bannerBody(resolution: CatalogResolution): string {
  if (resolution.highlightedRecordId === null) {
    return 'Your active filters exclude this exact match, so no row is highlighted. The mapping itself is unchanged — clear a constraint to see it again.';
  }
  if (resolution.selectedRecordId != null && resolution.selectedRecordId === resolution.highlightedRecordId) {
    return 'You selected the exact-matching part; its details and evidence are open.';
  }
  return 'The matching row is highlighted, not selected. Activate it to inspect its details. Identifier and mapping evidence live in the inspector.';
}

function stateMessage(resolution: CatalogResolution): { title: string; body: string } | null {
  switch (resolution.state) {
    case 'exact_not_found': {
      const submitted = resolution.exact?.submittedIdentifier ?? 'the submitted identifier';
      return { title: 'Exact identifier not found', body: `No catalog mapping exists for "${submitted}". Nothing is inferred or shown — check the number or browse the family instead.` };
    }
    case 'exact_non_unique': return { title: 'Exact identifier is not unique', body: 'Multiple mappings exist, so the catalog has failed closed without choosing a record.' };
    case 'query_unsupported': return { title: 'Search terms not recognized', body: 'This catalog only returns records for terms it can interpret safely. Try a family name, “M4 screws,” “A2 stainless,” or an exact synthetic ID.' };
    case 'query_conflict': return { title: 'Search terms conflict', body: 'The query contains conflicting catalog facts. No results are shown.' };
    case 'invalid_filter': return { title: 'Filter could not be applied', body: 'The requested field is not valid in this family context. No results are shown.' };
    case 'invalid_selection': return { title: 'Configuration unavailable', body: 'That selection is not present in the current result set.' };
    default: return null;
  }
}
