(() => {
  'use strict';

  const RELEASE = 'PS-POC-SYNTHETIC-V1';
  const FAMILY_ORDER = ['shcs', 'bhss', 'css'];
  const MATERIAL_ORDER = ['a2_stainless', 'alloy_steel'];
  const families = {
    shcs: {
      id: 'shcs', name: 'Socket-head cap screws', short: 'Socket head', profile: 'Cylindrical head',
      description: 'Cylindrical-head machine screws with an internal hex drive.', datum: 'Under head', head: 'Cylindrical', angle: null
    },
    bhss: {
      id: 'bhss', name: 'Button-head socket screws', short: 'Button head', profile: 'Low rounded head',
      description: 'Low rounded-head machine screws with an internal hex drive.', datum: 'Under head', head: 'Button', angle: null
    },
    css: {
      id: 'css', name: 'Countersunk socket screws', short: 'Countersunk', profile: '90° countersunk head',
      description: 'Flush-mount machine screws with a 90° countersunk head and internal hex drive.', datum: 'Overall', head: 'Countersunk 90°', angle: '90°'
    }
  };

  const tuples = [
    [4, 0.7, 12, 'a2_stainless', 'passivated'], [4, 0.7, 20, 'alloy_steel', 'black_oxide'],
    [5, 0.8, 16, 'a2_stainless', 'passivated'], [5, 0.8, 25, 'alloy_steel', 'black_oxide'],
    [6, 1, 16, 'a2_stainless', 'passivated'], [6, 1, 20, 'a2_stainless', 'passivated'],
    [6, 1, 30, 'alloy_steel', 'black_oxide'], [8, 1.25, 20, 'a2_stainless', 'passivated'],
    [8, 1.25, 30, 'alloy_steel', 'black_oxide'], [8, 1.25, 40, 'a2_stainless', 'passivated']
  ];

  const records = FAMILY_ORDER.flatMap((familyId, familyIndex) => tuples.map((tuple, index) => {
    const [diameter, pitch, length, material, finish] = tuple;
    const number = familyIndex * 10 + index + 1;
    return {
      id: `synrec-v1-${familyId}-${String(index + 1).padStart(2, '0')}`,
      identifier: `PSYN-SCR-${String(number).padStart(4, '0')}`,
      familyId, diameter, pitch, length, material, finish,
      drive: 'Internal hex', head: families[familyId].head, datum: families[familyId].datum
    };
  }));

  const exactMappings = new Map(records.map(record => [record.identifier.toLowerCase(), [record.id]]));
  exactMappings.set('psyn-scr-collide', ['synrec-v1-shcs-06', 'synrec-v1-bhss-06']);

  const state = {
    view: 'home', query: '', familyId: null, queryFilters: {}, filters: {}, exact: null,
    selectedId: null, filtersOpen: false, modalReturn: null
  };

  const main = document.getElementById('main');
  const queryInput = document.getElementById('query');
  const live = document.getElementById('live-region');
  const modalRoot = document.getElementById('modal-root');

  const labels = {
    diameter: value => `M${value}`,
    pitch: value => `${formatNumber(value)} mm`,
    length: value => `${formatNumber(value)} mm`,
    material: value => value === 'a2_stainless' ? 'A2 stainless' : 'Alloy steel',
    finish: value => value === 'black_oxide' ? 'Black oxide' : 'Passivated'
  };

  function formatNumber(value) {
    return Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
  }

  function glyph(familyId, className = '') {
    const family = families[familyId] || families.shcs;
    const head = familyId === 'css'
      ? '<path d="M38 24 L65 45 L65 55 L38 76 Z"/><path d="M38 24 L18 24 L18 76 L38 76"/>'
      : familyId === 'bhss'
        ? '<path d="M65 34 Q49 15 18 27 L18 73 Q49 85 65 66 Z"/>'
        : '<rect x="18" y="22" width="48" height="56" rx="3"/>';
    return `<div class="${className}" aria-hidden="true"><svg viewBox="0 0 250 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round">${head}<path d="M65 40 H222 V60 H65"/><path d="M94 40 l10 20 m7-20 10 20 m7-20 10 20 m7-20 10 20 m7-20 10 20 m7-20 10 20 m7-20 10 20"/><path d="M222 40 l15 10 -15 10"/><path d="M28 42 h23 v16 H28 Z"/><path d="M18 88 H222" stroke-dasharray="5 5" stroke-width="1"/><text x="92" y="96" fill="currentColor" stroke="none" font-size="9">orientation only · not to scale</text></svg></div>`;
  }

  function announce(message) {
    live.textContent = '';
    window.setTimeout(() => { live.textContent = message; }, 20);
  }

  function showHome({ focus = false } = {}) {
    Object.assign(state, { view: 'home', query: '', familyId: null, queryFilters: {}, filters: {}, exact: null, selectedId: null, filtersOpen: false });
    queryInput.value = '';
    render();
    if (focus) main.focus();
  }

  function parseQuery(original) {
    const query = original.trim().replace(/\s+/g, ' ');
    const exactKey = query.toLowerCase();
    if (/^psyn-scr-(?:\d{4}|collide)$/i.test(query)) {
      const ids = exactMappings.get(exactKey) || [];
      return { kind: ids.length === 1 ? 'exact-unique' : ids.length > 1 ? 'exact-collision' : 'exact-unknown', query, ids };
    }

    let rest = query.toLowerCase().replace(/(?<=[a-z0-9])-(?=[a-z0-9])/g, ' ');
    const found = { familyId: [], diameter: [], pitch: [], length: [], material: [], finish: [] };
    const add = (field, value) => { if (!found[field].includes(value)) found[field].push(value); };
    const consume = (regex, callback) => { rest = rest.replace(regex, (...args) => { callback?.(args); return ' '; }); };

    const familyAliases = [
      ['shcs', /\bsocket\s+head(?:\s+cap)?\s+screws?\b/g],
      ['bhss', /\bbutton\s+head(?:\s+socket)?\s+screws?\b/g],
      ['css', /\bcountersunk(?:\s+socket)?\s+screws?\b/g]
    ];
    familyAliases.forEach(([id, regex]) => consume(regex, () => add('familyId', id)));
    consume(/\bscrews?\b/g);
    consume(/\bm(4|5|6|8)\s*[x×]\s*(0\.7|0\.8|1(?:\.0)?|1\.25)\b/g, args => {
      add('diameter', Number(args[1])); add('pitch', Number(args[2]));
    });
    consume(/\bm(4|5|6|8)\b/g, args => add('diameter', Number(args[1])));
    consume(/\b(?:pitch\s+)?(0\.7|0\.8|1(?:\.0)?|1\.25)\s*mm\b/g, args => add('pitch', Number(args[1])));
    consume(/\b(12|16|20|25|30|40)\s*mm\b/g, args => add('length', Number(args[1])));
    consume(/\ba2\s+stainless\b/g, () => add('material', 'a2_stainless'));
    consume(/\balloy\s+steel\b/g, () => add('material', 'alloy_steel'));
    consume(/\bpassivated\b/g, () => add('finish', 'passivated'));
    consume(/\bblack\s+oxide\b/g, () => add('finish', 'black_oxide'));

    const conflicts = Object.entries(found).filter(([, values]) => values.length > 1);
    if (conflicts.length) return { kind: 'conflict', query, conflicts };
    const unsupported = rest.trim().split(/\s+/).filter(Boolean);
    const filters = Object.fromEntries(Object.entries(found).filter(([field, values]) => field !== 'familyId' && values.length).map(([field, values]) => [field, values[0]]));
    const familyId = found.familyId[0] || null;
    const hasBroadTerm = /\bscrews?\b/i.test(query);
    if (unsupported.length || (!familyId && !Object.keys(filters).length && !hasBroadTerm)) return { kind: 'unsupported', query, unsupported };
    return { kind: familyId ? 'family' : 'broad', query, familyId, filters };
  }

  function submitQuery(value) {
    const result = parseQuery(value);
    state.query = result.query;
    queryInput.value = result.query;
    state.selectedId = null;
    state.filters = {};
    state.filtersOpen = false;
    state.exact = null;

    if (result.kind === 'exact-unique') {
      const record = records.find(item => item.id === result.ids[0]);
      Object.assign(state, { view: 'catalog', familyId: record.familyId, queryFilters: {}, exact: { kind: 'unique', submitted: result.query, recordId: record.id } });
      render();
      announce(`Exact identifier match. ${record.identifier} is highlighted, not selected. ${familyRecords(record.familyId).length} family records shown.`);
      window.setTimeout(() => document.querySelector(`[data-record-id="${record.id}"]`)?.scrollIntoView({ block: 'center' }), 50);
      return;
    }
    if (result.kind === 'exact-unknown' || result.kind === 'exact-collision') {
      Object.assign(state, { view: result.kind, familyId: null, queryFilters: {}, exact: { kind: result.kind === 'exact-unknown' ? 'unknown' : 'collision', submitted: result.query, ids: result.ids } });
      render();
      announce(result.kind === 'exact-unknown' ? 'Unknown identifier. Nothing highlighted or selected.' : 'Identifier mapping is non-unique. Nothing highlighted or selected.');
      return;
    }
    if (result.kind === 'conflict' || result.kind === 'unsupported') {
      Object.assign(state, { view: result.kind, familyId: null, queryFilters: {}, issue: result });
      render();
      announce(result.kind === 'conflict' ? 'Conflicting query values. No results or selection shown.' : 'Unsupported query terms. No results or selection shown.');
      return;
    }
    Object.assign(state, { view: 'catalog', familyId: result.familyId, queryFilters: result.filters });
    render();
    const count = filteredRecords().length;
    announce(result.familyId ? `${families[result.familyId].name}. ${count} configurations match.` : `Screws catalog. ${count} configurations across three families.`);
  }

  function familyRecords(familyId) {
    return records.filter(record => record.familyId === familyId);
  }

  function matches(record, filterObject, ignoredField = null) {
    return Object.entries(filterObject).every(([field, value]) => field === ignoredField || record[field] === value);
  }

  function effectiveFilters() {
    return { ...state.queryFilters, ...state.filters };
  }

  function filteredRecords(familyId = state.familyId) {
    const base = familyId ? familyRecords(familyId) : records;
    return base.filter(record => matches(record, effectiveFilters()));
  }

  function chooseFamily(familyId) {
    state.familyId = familyId;
    state.selectedId = null;
    state.filters = {};
    state.exact = null;
    if (!state.query) state.query = families[familyId].name;
    queryInput.value = state.query;
    render();
    announce(`${families[familyId].name}. ${filteredRecords().length} configurations match.`);
    main.focus();
  }

  function renderHome() {
    return `<div class="page">
      <section class="home-hero" aria-labelledby="home-title">
        <div>
          <p class="eyebrow">Deterministic component navigation</p>
          <h1 id="home-title">Move from a clue to a comparable family.</h1>
          <p class="lede">Browse a visible mechanical hierarchy, narrow family-specific configurations, and inspect evidence without losing catalog context. Exact identifiers highlight; you select.</p>
          <form class="hero-search" id="hero-search" role="search">
            <label class="sr-only" for="hero-query">Start a catalog search</label>
            <input id="hero-query" type="search" placeholder="Try “M6 socket head cap screws”" autocomplete="off">
            <button type="submit">Explore catalog</button>
          </form>
          <div class="example-list"><span>Try an example:</span>
            ${exampleButton('screws', 'Broad')}${exampleButton('socket head cap screws', 'Family')}${exampleButton('M6 20 mm socket head cap screws', 'Dimensions')}${exampleButton('PSYN-SCR-0006', 'Exact ID')}
          </div>
        </div>
        <div class="hero-diagram" aria-label="Orientation illustration of a socket-head screw">
          <div class="diagram-grid"></div>${glyph('shcs', 'screw-glyph')}<span class="orientation-label">FAMILY ORIENTATION / NOT DIMENSIONAL</span>
        </div>
      </section>
      <section aria-labelledby="browse-title">
        <div class="section-heading"><div><p class="eyebrow">Fasteners / Screws</p><h2 id="browse-title">Browse supported families</h2><p>Choose geometry first; compare configurations second.</p></div></div>
        <div class="family-grid">${FAMILY_ORDER.map(familyCard).join('')}</div>
        <div class="scope-card"><span aria-hidden="true">◆</span><div><strong>Synthetic scope, intentionally bounded</strong><p>These 30 illustrative records reproduce the current fixture’s three families and typed facts. They are not real products or a production catalog.</p></div><button class="text-button" type="button" data-action="about-data">View data boundary</button></div>
      </section>
    </div>`;
  }

  function exampleButton(query, kind) {
    return `<button class="text-button code" type="button" data-query="${escapeHtml(query)}"><span class="sr-only">${kind} example: </span>${escapeHtml(query)}</button>`;
  }

  function familyCard(familyId) {
    const family = families[familyId];
    const count = state.view === 'catalog' ? filteredRecords(familyId).length : familyRecords(familyId).length;
    return `<button class="family-card${state.familyId === familyId ? ' active-family' : ''}" type="button" data-family="${familyId}">
      ${glyph(familyId, 'mini-glyph')}<h3>${family.name}</h3><p>${family.description}</p>
      <footer><span>${family.profile}</span><strong>${count} <span class="sr-only">matching </span>configurations</strong></footer>
    </button>`;
  }

  function renderCatalog() {
    if (!state.familyId) return renderBroadCatalog();
    return renderFamilyWorkspace();
  }

  function renderBroadCatalog() {
    const count = filteredRecords().length;
    return `<div class="page">
      ${breadcrumbs(null)}
      <section class="catalog-head" aria-labelledby="catalog-title">
        ${glyph('shcs', 'head-glyph')}<div><p class="eyebrow">Catalog level</p><h1 id="catalog-title">Screws</h1><p>Choose a coherent head-geometry family before comparing configurations.</p></div>
        <div class="catalog-meta"><strong>${count}</strong><span>matching synthetic configurations</span></div>
      </section>
      ${interpretationStrip()}
      <section class="broad-content" aria-labelledby="family-choice-title">
        <div class="section-heading"><div><h2 id="family-choice-title">Choose a screw family</h2><p>Family changes head geometry, length datum, and the comparison context.</p></div></div>
        <div class="family-grid">${FAMILY_ORDER.map(familyCard).join('')}</div>
        <div class="broad-table-note"><strong>${count} configurations match the active requirements.</strong> Select a family to expose its facets and aligned technical table. No configuration has been selected.</div>
      </section>
    </div>`;
  }

  function breadcrumbs(familyId) {
    return `<nav class="breadcrumbs" aria-label="Breadcrumb"><button type="button" data-action="home">Home</button><span>Screws</span>${familyId ? `<span aria-current="page">${families[familyId].name}</span>` : ''}</nav>`;
  }

  function interpretationStrip() {
    const chips = Object.entries(state.queryFilters).map(([field, value]) => `<span class="chip">${filterName(field)}: ${labels[field](value)}</span>`).join('');
    if (state.exact?.kind === 'unique') {
      const record = records.find(item => item.id === state.exact.recordId);
      return `<div class="status-panel exact" id="exact-status"><span aria-hidden="true">◆</span><span class="status-title">Exact identifier match</span><span class="chip code">${escapeHtml(state.exact.submitted)}</span><p>PartSource synthetic namespace · ${families[record.familyId].name} · <strong>Highlighted, not selected</strong></p><button class="text-button status-action" type="button" data-action="jump-exact">Jump to exact match</button></div>`;
    }
    return `<div class="status-panel"><span class="status-title">Active path</span><span class="chip">${state.familyId ? families[state.familyId].name : 'Screws'}</span>${chips || '<p>No typed constraints yet.</p>'}<p class="status-action">Original query: “${escapeHtml(state.query || 'Browse catalog')}”</p></div>`;
  }

  function filterName(field) {
    return ({ diameter: 'Thread', pitch: 'Pitch', length: 'Length', material: 'Material', finish: 'Finish' })[field];
  }

  function renderFamilyWorkspace() {
    const family = families[state.familyId];
    const resultRecords = filteredRecords();
    const selected = records.find(record => record.id === state.selectedId);
    return `<div class="page">
      ${breadcrumbs(state.familyId)}
      <section class="catalog-head" aria-labelledby="family-title">
        ${glyph(state.familyId, 'head-glyph')}<div><p class="eyebrow">Fasteners / Screws / Family</p><h1 id="family-title">${family.name}</h1><p>${family.description} Length datum: ${family.datum.toLowerCase()}.</p></div>
        <div class="catalog-meta"><strong>${resultRecords.length}</strong><span>of 10 synthetic configurations</span></div>
      </section>
      ${interpretationStrip()}
      <button class="mobile-filter-button" type="button" data-action="toggle-filters" aria-expanded="${state.filtersOpen}">Filters & requirements (${Object.keys(state.filters).length})</button>
      <div class="workspace${selected ? ' has-inspector' : ''}">
        ${renderFacets()}
        ${renderResults(resultRecords)}
        ${selected ? renderInspector(selected) : ''}
      </div>
    </div>`;
  }

  function renderFacets() {
    const fields = [
      ['diameter', 'Nominal thread', [4, 5, 6, 8]],
      ['pitch', 'Pitch', [0.7, 0.8, 1, 1.25]],
      ['length', `Length (${families[state.familyId].datum.toLowerCase()})`, [12, 16, 20, 25, 30, 40]],
      ['material', 'Material designation', ['a2_stainless', 'alloy_steel']],
      ['finish', 'Finish / treatment', ['passivated', 'black_oxide']]
    ];
    return `<aside class="panel facets${state.filtersOpen ? ' mobile-open' : ''}" aria-label="Family filters">
      <div class="panel-title"><h2>Refine configurations</h2><button class="clear-button" type="button" data-action="${state.filtersOpen ? 'close-filters' : 'clear-filters'}">${state.filtersOpen ? 'Done' : 'Clear'}</button></div>
      ${fields.map(([field, title, values]) => facet(field, title, values)).join('')}
    </aside>`;
  }

  function facet(field, title, values) {
    const locked = Object.prototype.hasOwnProperty.call(state.queryFilters, field);
    const selected = locked ? state.queryFilters[field] : state.filters[field];
    const option = (value, label) => {
      const otherFilters = { ...effectiveFilters() };
      delete otherFilters[field];
      const count = familyRecords(state.familyId).filter(record => matches(record, otherFilters) && (value === '' || record[field] === value)).length;
      const checked = value === '' ? selected === undefined : selected === value;
      const serialized = typeof value === 'number' ? String(value) : value;
      return `<label class="facet-option"><input type="radio" name="facet-${field}" value="${escapeHtml(serialized)}" data-field="${field}" data-type="${typeof value}" ${checked ? 'checked' : ''} ${locked ? 'disabled' : ''}><span>${label}</span><span class="count">${count}</span></label>`;
    };
    return `<div class="facet"><fieldset><legend>${title}${locked ? ' · from query' : ''}</legend>${locked ? '' : option('', 'Any')}${values.map(value => option(value, labels[field](value))).join('')}</fieldset></div>`;
  }

  function renderResults(resultRecords) {
    if (!resultRecords.length) {
      return `<section class="panel results-panel" aria-labelledby="results-title"><div class="results-header"><div><h2 id="results-title">0 matching configurations</h2><p>Strict AND filters · deterministic order</p></div></div><div class="empty-results"><div class="empty-icon" aria-hidden="true">∅</div><h2>No configuration has every active value</h2><p>The selected family remains visible. Remove or change a filter; no nearest configuration is substituted and nothing is selected.</p><div class="action-row" style="justify-content:center"><button class="secondary-button" type="button" data-action="clear-filters">Clear added filters</button></div></div></section>`;
    }
    return `<section class="panel results-panel" aria-labelledby="results-title">
      <div class="results-header"><div><h2 id="results-title">${resultRecords.length} matching configuration${resultRecords.length === 1 ? '' : 's'}</h2><p>Stable order: thread, length, material · activate a row to inspect</p></div><div class="legend" aria-label="Row state legend"><span><i class="amber"></i>Exact highlight</span><span><i class="blue"></i>Explicit selection</span></div></div>
      <div class="table-scroll"><table><thead><tr><th>Illustrative identifier</th><th>Thread</th><th>Pitch</th><th>Length</th><th>Datum</th><th>Material</th><th>Finish</th><th>Drive</th></tr></thead><tbody>
        ${resultRecords.map(resultRow).join('')}
      </tbody></table></div>
    </section>`;
  }

  function resultRow(record) {
    const exact = state.exact?.kind === 'unique' && state.exact.recordId === record.id;
    const selected = state.selectedId === record.id;
    const stateText = [exact ? 'Exact identifier match, highlighted not selected' : '', selected ? 'Explicitly selected' : ''].filter(Boolean).join('. ');
    return `<tr tabindex="0" data-record-id="${record.id}" class="${exact ? 'exact-row ' : ''}${selected ? 'selected-row' : ''}" aria-label="${record.identifier}, M${record.diameter} by ${record.length} millimeters. ${stateText}">
      <td><span class="identifier code">${record.identifier}</span>${exact ? '<br><span class="row-label exact-label">◆ Exact highlight</span>' : ''}${selected ? '<br><span class="row-label selected-label">● Selected</span>' : ''}</td>
      <td class="code">M${record.diameter}</td><td class="code">${formatNumber(record.pitch)} <span class="unit">mm</span></td><td class="code">${record.length} <span class="unit">mm</span></td><td>${record.datum}</td><td>${labels.material(record.material)}</td><td>${labels.finish(record.finish)}</td><td>${record.drive}</td>
    </tr>`;
  }

  function renderInspector(record) {
    const family = families[record.familyId];
    return `<aside class="panel inspector" aria-labelledby="selected-part-title">
      <div class="panel-title"><h2>Selected-part detail</h2><button class="close-button" type="button" data-action="close-inspector" aria-label="Close selected-part detail">×</button></div>
      <div class="inspector-notice"><span aria-hidden="true">◆</span><strong>Synthetic detail</strong><span>Illustrative facts only</span></div>
      <div class="inspector-head"><span class="selected-kicker">● Explicitly selected</span><h2 id="selected-part-title">M${record.diameter} × ${record.length} mm ${family.short}</h2><div class="identifier-large code">${record.identifier}</div>${glyph(record.familyId, 'detail-graphic')}</div>
      <div class="fact-group"><h3>Identity & family</h3>${factRow(record, 'Family', family.name, 'family')}${factRow(record, 'Identifier', record.identifier, 'identifier')}</div>
      <div class="fact-group"><h3>Thread & dimensions</h3>${factRow(record, 'Nominal thread', `M${record.diameter}`, 'diameter')}${factRow(record, 'Pitch', `${formatNumber(record.pitch)} mm`, 'pitch')}${factRow(record, 'Nominal length', `${record.length} mm`, 'length')}${factRow(record, 'Length datum', record.datum, 'datum')}</div>
      <div class="fact-group"><h3>Form & material</h3>${factRow(record, 'Head profile', record.head, 'head')}${factRow(record, 'Drive', record.drive, 'drive')}${factRow(record, 'Material', labels.material(record.material), 'material')}${factRow(record, 'Finish', labels.finish(record.finish), 'finish')}${factRow(record, 'Grade / class', 'Not supplied', 'grade')}</div>
      <div class="source-summary"><strong>Source summary · Synthetic fixture</strong><p>${RELEASE} · fixture-authored illustrative facts. Open ⓘ beside a fact for claim-level evidence and limits.</p></div>
    </aside>`;
  }

  function factRow(record, name, value, field) {
    return `<div class="fact-row"><span>${name}</span><strong class="${field === 'identifier' ? 'code' : ''}">${escapeHtml(value)}</strong><button class="evidence-button" type="button" data-evidence-field="${field}" data-evidence-record="${record.id}" aria-label="View evidence for ${name}">ⓘ</button></div>`;
  }

  function renderIssuePage() {
    const query = escapeHtml(state.query);
    const commonActions = `<div class="action-row"><button class="primary-button" type="button" data-query="screws">Browse screws</button><button class="secondary-button" type="button" data-action="focus-search">Edit search</button></div>`;
    if (state.view === 'exact-unknown') {
      return `<div class="page state-page"><div class="state-card"><div class="state-symbol" aria-hidden="true">?</div><p class="eyebrow">Exact identifier · zero mappings</p><h1>Identifier not found in this release</h1><span class="query-echo code">${query}</span><p>The submitted value matches the synthetic identifier format, but this release has no mapping. Nothing is highlighted or selected. Check the identifier or browse the catalog.</p>${commonActions}</div></div>`;
    }
    if (state.view === 'exact-collision') {
      return `<div class="page state-page"><div class="state-card"><div class="state-symbol" aria-hidden="true">≠</div><p class="eyebrow">Exact identifier · multiple mappings</p><h1>Identifier mapping is not unique</h1><span class="query-echo code">${query}</span><p>Two synthetic mappings point to different families. PartSource will not choose between them, highlight a row, or open detail. Review the identifier namespace or continue by family.</p>${commonActions}</div></div>`;
    }
    if (state.view === 'conflict') {
      const conflicts = state.issue.conflicts.map(([field, values]) => `${filterName(field) || field}: ${values.map(value => labels[field]?.(value) || value).join(' and ')}`).join('; ');
      return `<div class="page state-page"><div class="state-card"><div class="state-symbol" aria-hidden="true">!</div><p class="eyebrow">Query stopped · conflicting values</p><h1>Requirements conflict</h1><span class="query-echo code">${query}</span><p>The query contains incompatible values for one field: <strong>${escapeHtml(conflicts)}</strong>. No result list is shown and no value is silently preferred.</p>${commonActions}</div></div>`;
    }
    const unsupported = state.issue.unsupported.join(' ');
    return `<div class="page state-page"><div class="state-card"><div class="state-symbol" aria-hidden="true">!</div><p class="eyebrow">Query stopped · unsupported terms</p><h1>Some terms are outside this synthetic scope</h1><span class="query-echo code">${query}</span><p>Not understood: <strong>${escapeHtml(unsupported || state.query)}</strong>. Supported inputs include the three screw families, M4/M5/M6/M8, fixture lengths, A2 stainless, alloy steel, passivated, and black oxide. Broad “stainless” is deliberately not converted to A2.</p>${commonActions}</div></div>`;
  }

  function openEvidence(recordId, field, returnElement) {
    const record = records.find(item => item.id === recordId);
    const valueMap = {
      family: families[record.familyId].name, identifier: record.identifier, diameter: `M${record.diameter}`,
      pitch: `${formatNumber(record.pitch)} mm`, length: `${record.length} mm`, datum: record.datum,
      head: record.head, drive: record.drive, material: labels.material(record.material), finish: labels.finish(record.finish), grade: 'Not supplied'
    };
    const fieldName = ({ family: 'Family', identifier: 'Identifier', diameter: 'Nominal thread', pitch: 'Pitch', length: 'Nominal length', datum: 'Length datum', head: 'Head profile', drive: 'Drive', material: 'Material', finish: 'Finish', grade: 'Grade / class' })[field];
    state.modalReturn = returnElement;
    modalRoot.innerHTML = `<div class="modal-backdrop" data-action="modal-backdrop"><section class="evidence-sheet" role="dialog" aria-modal="true" aria-labelledby="evidence-title">
      <header><div><p class="eyebrow">Field-level evidence</p><h2 id="evidence-title">${fieldName}</h2><p class="code">${record.identifier}</p></div><button class="close-button" type="button" data-action="close-modal" aria-label="Close evidence">×</button></header>
      <div class="evidence-body"><dl class="evidence-grid"><dt>Normalized value</dt><dd>${escapeHtml(valueMap[field])}</dd><dt>Original notation</dt><dd>${escapeHtml(valueMap[field])}</dd><dt>Source type</dt><dd>Synthetic fixture</dd><dt>Canonical reference</dt><dd class="code">${RELEASE} / ${escapeHtml(record.id)}</dd><dt>Transformation</dt><dd>Fixture value projected for display; no external conversion.</dd><dt>Fixture publication</dt><dd>2026-08-11</dd><dt>Configuration revision</dt><dd>Illustrative revision 1</dd><dt>Evidence supports</dt><dd>Prototype interaction and layout evaluation only.</dd></dl><p class="evidence-caution"><strong>Does not prove:</strong> real-world product existence, standard conformance, suitability, interchangeability, source availability, or engineering correctness. Identifier mapping evidence is separate from fact evidence.</p></div>
    </section></div>`;
    const dialog = modalRoot.querySelector('.evidence-sheet');
    dialog.querySelector('[data-action="close-modal"]').focus();
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeModal();
      if (event.key === 'Tab') trapFocus(dialog, event);
    });
  }

  function openAboutData(returnElement) {
    state.modalReturn = returnElement;
    modalRoot.innerHTML = `<div class="modal-backdrop" data-action="modal-backdrop"><section class="evidence-sheet" role="dialog" aria-modal="true" aria-labelledby="data-title"><header><div><p class="eyebrow">Prototype data boundary</p><h2 id="data-title">Illustrative synthetic catalog</h2><p class="code">${RELEASE}</p></div><button class="close-button" type="button" data-action="close-modal" aria-label="Close data information">×</button></header><div class="evidence-body"><p>This disposable interface generates 30 local records from 10 dimension/material tuples across three screw families. It mirrors current fixture concepts so UX states are reproducible.</p><dl class="evidence-grid"><dt>Origin</dt><dd>Blank-slate synthetic fixture</dd><dt>Allowed use</dt><dd>Local prototype and acceptance evaluation</dd><dt>Records</dt><dd>30 illustrative configurations</dd><dt>Families</dt><dd>3 synthetic screw families</dd><dt>Runtime</dt><dd>Static local HTML, CSS, and JavaScript; no network lookup or AI</dd></dl><p class="evidence-caution">The persistent amber notice is intentional. Polish does not turn synthetic records into mechanical authority.</p></div></section></div>`;
    const dialog = modalRoot.querySelector('.evidence-sheet');
    dialog.querySelector('[data-action="close-modal"]').focus();
    dialog.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); if (event.key === 'Tab') trapFocus(dialog, event); });
  }

  function trapFocus(container, event) {
    const focusable = [...container.querySelectorAll('button, [href], input, select, [tabindex]:not([tabindex="-1"])')].filter(element => !element.disabled);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function closeModal() {
    modalRoot.innerHTML = '';
    state.modalReturn?.focus();
    state.modalReturn = null;
  }

  function render() {
    if (state.view === 'home') main.innerHTML = renderHome();
    else if (state.view === 'catalog') main.innerHTML = renderCatalog();
    else main.innerHTML = renderIssuePage();
    document.body.classList.toggle('detail-open', Boolean(state.selectedId));
  }

  document.getElementById('search-form').addEventListener('submit', event => {
    event.preventDefault(); submitQuery(queryInput.value);
  });
  document.getElementById('home-button').addEventListener('click', () => showHome({ focus: true }));
  document.getElementById('catalog-button').addEventListener('click', () => submitQuery('screws'));
  document.getElementById('about-data-button').addEventListener('click', event => openAboutData(event.currentTarget));

  main.addEventListener('submit', event => {
    if (event.target.id === 'hero-search') {
      event.preventDefault(); submitQuery(document.getElementById('hero-query').value);
    }
  });

  main.addEventListener('change', event => {
    const input = event.target.closest('[data-field]');
    if (!input) return;
    const field = input.dataset.field;
    if (input.value === '') delete state.filters[field];
    else state.filters[field] = input.dataset.type === 'number' ? Number(input.value) : input.value;
    state.selectedId = null;
    render();
    announce(`${filteredRecords().length} configurations match. Selection cleared.`);
  });

  main.addEventListener('click', event => {
    const queryButton = event.target.closest('[data-query]');
    if (queryButton) { submitQuery(queryButton.dataset.query); return; }
    const familyButton = event.target.closest('[data-family]');
    if (familyButton) { chooseFamily(familyButton.dataset.family); return; }
    const evidenceButton = event.target.closest('[data-evidence-field]');
    if (evidenceButton) { openEvidence(evidenceButton.dataset.evidenceRecord, evidenceButton.dataset.evidenceField, evidenceButton); return; }
    const row = event.target.closest('[data-record-id]');
    if (row) { selectRecord(row.dataset.recordId); return; }
    const actionButton = event.target.closest('[data-action]');
    if (!actionButton) return;
    const action = actionButton.dataset.action;
    if (action === 'home') showHome({ focus: true });
    if (action === 'about-data') openAboutData(actionButton);
    if (action === 'focus-search') { queryInput.focus(); queryInput.select(); }
    if (action === 'clear-filters') { state.filters = {}; state.selectedId = null; render(); announce(`${filteredRecords().length} configurations match. Added filters cleared.`); }
    if (action === 'toggle-filters') { state.filtersOpen = true; render(); document.querySelector('.facets.mobile-open .clear-button')?.focus(); }
    if (action === 'close-filters') { state.filtersOpen = false; render(); document.querySelector('[data-action="toggle-filters"]')?.focus(); }
    if (action === 'close-inspector') { closeInspector(); }
    if (action === 'jump-exact') document.querySelector(`[data-record-id="${state.exact.recordId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  main.addEventListener('keydown', event => {
    const row = event.target.closest('[data-record-id]');
    if (row && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); selectRecord(row.dataset.recordId); }
    if (event.key === 'Escape' && state.selectedId) closeInspector();
  });

  modalRoot.addEventListener('click', event => {
    const action = event.target.dataset.action;
    if (action === 'close-modal' || action === 'modal-backdrop') closeModal();
  });

  function selectRecord(recordId) {
    state.selectedId = recordId;
    render();
    const record = records.find(item => item.id === recordId);
    announce(`${record.identifier} explicitly selected. Selected-part detail opened.`);
    window.setTimeout(() => document.querySelector('.inspector .close-button')?.focus(), 20);
  }

  function closeInspector() {
    const returnId = state.selectedId;
    state.selectedId = null;
    render();
    document.querySelector(`[data-record-id="${returnId}"]`)?.focus();
    announce('Selected-part detail closed. Selection cleared.');
  }

  render();
})();
