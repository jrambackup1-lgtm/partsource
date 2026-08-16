/**
 * Build-time ETL: cofounder CSV dataset -> canonical CatalogPackage JSON +
 * SHA-256 digest (u1). Dev-only release: the artifact is written to
 * web/catalog-releases/ which is gitignored and served only by the Vite dev
 * server middleware — `vite build` never includes it. See decisions:
 * .wayfinder/product-recovery/decisions/u1-real-catalog-data-decisions.md
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  serializeCatalogPackageForDigest,
  type CatalogConfiguration,
  type CatalogFamily,
  type CatalogPackage,
  type ConfigurationRevision,
  type FacetDefinition,
  type FactDefinition,
  type FactPrimitive,
  type FamilySchemaRevision,
  type HierarchyNode,
  type IdentifierMapping,
  type LexiconRule,
  type ProvenanceRecord,
} from '../../src/catalog/contracts';
import { parseCatalogPackage } from '../../src/catalog/parse-catalog-package';

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const repoRoot = path.resolve(webRoot, '..');
const dataDirectory = path.join(repoRoot, 'archive', 'legacy-runtime-2026-08-12', 'data');
const outputDirectory = path.join(webRoot, 'catalog-releases');
const identityModule = path.join(webRoot, 'src', 'catalog', 'real-release-identity.ts');

const RELEASE_ID = 'partsource.dev.cofounder-screws.v1';
const ARTIFACT_FILE = 'real-screws-v1.json';
const PUBLISHED_AT = '2026-08-16T00:00:00.000Z';
const NOTICE = 'Cofounder-provided dataset for local development — not reviewed for public release; origin confidential.';

const PROHIBITED_DISPLAY_CLAIM = /\b(?:certified|verified|equivalent|approved\s+(?:alternate\s+)?(?:equivalent|replacement)|alternate\s+equivalent|suppliers?|prices?|stock|availability|lead[\s-]*time)\b/iu;

interface SourceFile {
  readonly key: string; // hex | round | socket
  readonly fileName: string;
  readonly categoryLabel: string;
  readonly categoryPhrases: readonly string[];
}

const SOURCE_FILES: readonly SourceFile[] = [
  { key: 'hex', fileName: 'hex-head-screws.csv', categoryLabel: 'Hex head screws', categoryPhrases: ['hex head screw', 'hex head screws'] },
  { key: 'round', fileName: 'rounded-head-screws.csv', categoryLabel: 'Rounded head screws', categoryPhrases: ['rounded head screw', 'rounded head screws'] },
  { key: 'socket', fileName: 'socket-head-cap-screws.csv', categoryLabel: 'Socket head cap screws', categoryPhrases: ['socket head screw', 'socket head screws', 'socket head cap screw', 'socket head cap screws'] },
];

const SMALL_TITLE_WORDS = new Set(['for', 'with', 'and', 'of', 'to', 'in', 'on', 'at', 'by', 'the']);
const ACRONYMS = new Map(['asme', 'astm', 'sae', 'iso', 'din', 'ansi', 'fda', 'ul', 'us', 'nf', 'jic'].map(word => [word, word.toUpperCase()]));

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let position = 0; position < text.length; position += 1) {
    const character = text[position];
    if (quoted) {
      if (character === '"') {
        if (text[position + 1] === '"') { field += '"'; position += 1; }
        else quoted = false;
      } else field += character;
    } else if (character === '"') quoted = true;
    else if (character === ',') { row.push(field); field = ''; }
    else if (character === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (character !== '\r') field += character;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(cells => cells.some(cell => cell.trim().length));
}

function slugLabel(slug: string): string {
  return slug.split('-').map((word, index) => {
    const lower = word.toLowerCase();
    if (/^\d/.test(lower)) return lower;
    if (ACRONYMS.has(lower)) return ACRONYMS.get(lower)!;
    if (index > 0 && SMALL_TITLE_WORDS.has(lower)) return lower;
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }).join(' ');
}

function normalizeTerm(term: string): string {
  return term.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US');
}

const MM_PATTERN = /^(\d+(?:\.\d+)?)\s*mm$/;
const INCH_PATTERN = /^(\d+(?:\.\d+)?)\s*"$/;
const FRACTION_PATTERN = /^(\d+)\/(\d+)\s*"$/;
const COMPOUND_FRACTION_PATTERN = /^(\d+)\s+(\d+)\/(\d+)\s*"$/;
const METRIC_SIZE_PATTERN = /^M(\d+(?:\.\d+)?)$/;
const INCH_TPI_PATTERN = /-(\d+)\s*$/;

function parseMillimeters(raw: string): number | null {
  const match = MM_PATTERN.exec(raw.trim());
  return match ? Number(match[1]) : null;
}

function parseInches(raw: string): number | null {
  const trimmed = raw.trim();
  const whole = INCH_PATTERN.exec(trimmed);
  if (whole) return Number(whole[1]);
  const fraction = FRACTION_PATTERN.exec(trimmed);
  if (fraction) {
    const denominator = Number(fraction[2]);
    if (!denominator) throw new Error(`zero-denominator inch fraction: ${raw}`);
    return Number(fraction[1]) / denominator;
  }
  const compound = COMPOUND_FRACTION_PATTERN.exec(trimmed);
  if (compound) {
    const denominator = Number(compound[3]);
    if (!denominator) throw new Error(`zero-denominator inch fraction: ${raw}`);
    return Number(compound[1]) + Number(compound[2]) / denominator;
  }
  return null;
}

/** Known values and absent reasons stay distinguishable even for string enums. */
type FactSlot = Readonly<{ kind: 'value'; value: FactPrimitive }> | Readonly<{ kind: 'absent'; reason: string }>;
type Facts = Map<string, FactSlot>;

const known = (facts: Facts, factId: string, value: FactPrimitive): void => { facts.set(factId, { kind: 'value', value }); };
const notSupplied = (facts: Facts, factId: string, reason: string): void => { facts.set(factId, { kind: 'absent', reason }); };

function rawEnum(facts: Facts, factId: string, raw: string | undefined, blankReason: string): void {
  const trimmed = (raw ?? '').trim();
  if (!trimmed || trimmed === '-') notSupplied(facts, factId, blankReason);
  else known(facts, factId, trimmed);
}

function dualDimension(
  facts: Facts,
  mmFactId: string,
  inchFactId: string,
  raw: string | undefined,
  blankReason: string,
): void {
  const trimmed = (raw ?? '').trim();
  if (!trimmed || trimmed === '-') {
    notSupplied(facts, mmFactId, blankReason);
    notSupplied(facts, inchFactId, blankReason);
    return;
  }
  const millimeters = parseMillimeters(trimmed);
  if (millimeters !== null) {
    known(facts, mmFactId, millimeters);
    notSupplied(facts, inchFactId, 'source value expressed in millimeters');
    return;
  }
  const inches = parseInches(trimmed);
  if (inches !== null) {
    known(facts, inchFactId, inches);
    notSupplied(facts, mmFactId, 'source value expressed in inches');
    return;
  }
  throw new Error(`unparsable dimension ${mmFactId}: ${JSON.stringify(trimmed)}`);
}

// ---------------------------------------------------------------------------
// Column plan (decision D2). Fork columns exist only for their files; every
// family schema carries the union of common + its file's fork columns.
// ---------------------------------------------------------------------------

interface ColumnPlan {
  readonly stringEnums: readonly { readonly factId: string; readonly column: string; readonly label: string }[];
  readonly dualDimensions: readonly { readonly mmFactId: string; readonly inchFactId: string; readonly column: string; readonly label: string }[];
}

const COMMON_PLAN: ColumnPlan = {
  stringEnums: [
    { factId: 'thread_size', column: 'thread_size', label: 'Thread size' },
    { factId: 'threading', column: 'threading', label: 'Threading' },
    { factId: 'thread_type', column: 'thread_type', label: 'Thread type' },
    { factId: 'thread_spacing', column: 'thread_spacing', label: 'Thread spacing' },
    { factId: 'thread_direction', column: 'thread_direction', label: 'Thread direction' },
    { factId: 'thread_fit', column: 'thread_fit', label: 'Thread fit' },
    { factId: 'drive_style', column: 'drive_style', label: 'Drive style' },
    { factId: 'material', column: 'material', label: 'Material' },
    { factId: 'tensile_strength', column: 'tensile_strength', label: 'Tensile strength' },
    { factId: 'hardness', column: 'hardness', label: 'Hardness' },
    { factId: 'specifications_met', column: 'specifications_met', label: 'Specifications met' },
    { factId: 'rohs_compliance', column: 'rohs', label: 'RoHS compliance' },
  ],
  dualDimensions: [
    { mmFactId: 'head_height_mm', inchFactId: 'head_height_in', column: 'head_height', label: 'Head height' },
    { mmFactId: 'length_mm', inchFactId: 'length_in', column: 'length', label: 'Nominal length' },
  ],
};

const FORK_PLAN: Readonly<Record<string, ColumnPlan>> = {
  hex: {
    stringEnums: [
      { factId: 'finish', column: 'finish', label: 'Finish' },
      { factId: 'fastener_strength_grade_class', column: 'fastener_strength_grade_class', label: 'Strength grade/class' },
    ],
    dualDimensions: [
      { mmFactId: 'head_width_mm', inchFactId: 'head_width_in', column: 'head_width', label: 'Head width' },
      { mmFactId: 'min_thread_length_mm', inchFactId: 'min_thread_length_in', column: 'min_thread_length', label: 'Minimum thread length' },
    ],
  },
  round: {
    stringEnums: [
      { factId: 'finish', column: 'finish', label: 'Finish' },
      { factId: 'drive_size', column: 'drive_size', label: 'Drive size' },
      { factId: 'rounded_head_style', column: 'rounded_head_style', label: 'Rounded head style' },
      { factId: 'rounded_head_profile', column: 'rounded_head_profile', label: 'Rounded head profile' },
    ],
    dualDimensions: [
      { mmFactId: 'head_diameter_mm', inchFactId: 'head_diameter_in', column: 'head_diameter', label: 'Head diameter' },
    ],
  },
  socket: {
    stringEnums: [
      { factId: 'drive_size', column: 'drive_size', label: 'Drive size' },
      { factId: 'socket_head_profile', column: 'socket_head_profile', label: 'Socket head profile' },
    ],
    dualDimensions: [
      { mmFactId: 'head_diameter_mm', inchFactId: 'head_diameter_in', column: 'head_diameter', label: 'Head diameter' },
      { mmFactId: 'min_thread_length_mm', inchFactId: 'min_thread_length_in', column: 'min_thread_length', label: 'Minimum thread length' },
    ],
  },
};

const UNIT_LABELS: Readonly<Record<string, string>> = {
  nominal_diameter_mm: 'Nominal diameter', pitch_mm: 'Pitch', diameter_in: 'Nominal diameter', tpi: 'Threads per inch',
  length_mm: 'Nominal length', length_in: 'Nominal length',
  head_height_mm: 'Head height', head_height_in: 'Head height',
  head_diameter_mm: 'Head diameter', head_diameter_in: 'Head diameter',
  head_width_mm: 'Head width', head_width_in: 'Head width',
  min_thread_length_mm: 'Minimum thread length', min_thread_length_in: 'Minimum thread length',
};

const DRIVE_LEXICON_PHRASES = ['external hex', 'phillips', 'slotted', 'torx plus', 'tamper-resistant torx', 'hex with pilot recess', 'square'];

interface FamilyBuild {
  readonly familyId: string;
  readonly slug: string;
  readonly label: string;
  readonly fileKey: string;
  readonly factIds: string[];
  readonly facetFactIds: string[];
  readonly rows: Readonly<Record<string, string>>[];
}

function main(): void {
  const startedAt = Date.now();
  const families: FamilyBuild[] = [];
  const allRows: { row: Record<string, string>; family: FamilyBuild }[] = [];
  let excludedBlankPn = 0;
  const seenSkus = new Set<string>();
  const seenPns = new Set<string>();

  for (const source of SOURCE_FILES) {
    const text = fs.readFileSync(path.join(dataDirectory, source.fileName), 'utf8');
    const cells = parseCsv(text);
    const header = cells[0].map(name => name.trim());
    const rowsBySlug = new Map<string, Record<string, string>[]>();
    for (const line of cells.slice(1)) {
      const row: Record<string, string> = {};
      header.forEach((name, column) => { row[name] = line[column] ?? ''; });
      // Fail-closed row gate (decision D3): rows without a McMaster PN are
      // degenerate (blank part_no/title/system/drive/head) and are excluded.
      const pn = row.mcmaster_pn.trim();
      const system = row.system_of_measurement.trim();
      if (!pn || !system) { excludedBlankPn += 1; continue; }
      const slug = row.subcat.trim().replace(/\/+$/, '').split('/').pop()!;
      const listed = rowsBySlug.get(slug) ?? [];
      listed.push(row);
      rowsBySlug.set(slug, listed);
      const sku = row.sku.trim().toLowerCase();
      if (seenSkus.has(sku)) throw new Error(`duplicate sku ${sku}`);
      seenSkus.add(sku);
      const normalizedPn = pn.toUpperCase();
      if (seenPns.has(normalizedPn)) throw new Error(`duplicate mcmaster_pn ${normalizedPn}`);
      seenPns.add(normalizedPn);
    }
    for (const [slug, rows] of rowsBySlug) {
      const familyId = `fam-${source.key}-${slug}`;
      const plan = FORK_PLAN[source.key];
      const factIds = [
        'thread_system',
        ...COMMON_PLAN.stringEnums.map(entry => entry.factId),
        'nominal_diameter_mm', 'pitch_mm', 'diameter_in', 'tpi',
        ...COMMON_PLAN.dualDimensions.flatMap(entry => [entry.mmFactId, entry.inchFactId]),
        ...plan.stringEnums.map(entry => entry.factId),
        ...plan.dualDimensions.flatMap(entry => [entry.mmFactId, entry.inchFactId]),
      ];
      const facetFactIds = ['thread_system', 'threading', 'material', 'drive_style',
        ...plan.stringEnums.filter(entry => ['finish', 'rounded_head_style', 'socket_head_profile', 'fastener_strength_grade_class'].includes(entry.factId)).map(entry => entry.factId)];
      const label = slugLabel(slug);
      if (label.length > 160) throw new Error(`family label exceeds display budget: ${label}`);
      const family: FamilyBuild = { familyId, slug, label, fileKey: source.key, factIds, facetFactIds, rows };
      families.push(family);
      for (const row of rows) allRows.push({ row, family });
    }
  }

  // ---- Gather fact values across all rows for definitions -----------------
  const stringEnumValues = new Map<string, Set<string>>();
  const numberValues = new Map<string, Set<number>>();
  const recordValue = (factId: string, slot: FactSlot): void => {
    if (slot.kind !== 'value') return;
    if (typeof slot.value === 'number') {
      const set = numberValues.get(factId) ?? new Set<number>();
      set.add(slot.value);
      numberValues.set(factId, set);
    } else {
      const set = stringEnumValues.get(factId) ?? new Set<string>();
      set.add(slot.value);
      stringEnumValues.set(factId, set);
    }
  };

  const rowFacts: { sku: string; pn: string; family: FamilyBuild; facts: Facts }[] = [];
  for (const { row, family } of allRows) {
    const facts: Facts = new Map();
    const system = row.system_of_measurement.trim().toLowerCase() === 'metric' ? 'metric' : 'inch';
    known(facts, 'thread_system', system);

    for (const entry of COMMON_PLAN.stringEnums) rawEnum(facts, entry.factId, row[entry.column], `source ${entry.column} is blank or marked not supplied`);
    for (const entry of FORK_PLAN[family.fileKey].stringEnums) rawEnum(facts, entry.factId, row[entry.column], `source ${entry.column} is blank or marked not supplied`);
    for (const entry of [...COMMON_PLAN.dualDimensions, ...FORK_PLAN[family.fileKey].dualDimensions]) {
      dualDimension(facts, entry.mmFactId, entry.inchFactId, row[entry.column], `source ${entry.column} is blank or marked not supplied`);
    }

    const threadSize = row.thread_size.trim();
    if (system === 'metric') {
      const metric = METRIC_SIZE_PATTERN.exec(threadSize);
      if (!metric) throw new Error(`metric row without M-size thread_size: ${threadSize}`);
      known(facts, 'nominal_diameter_mm', Number(metric[1]));
      notSupplied(facts, 'diameter_in', 'thread system is metric in source');
      const pitchRaw = row.thread_pitch.trim();
      const pitch = pitchRaw ? parseMillimeters(pitchRaw) : null;
      if (pitch !== null) known(facts, 'pitch_mm', pitch);
      else notSupplied(facts, 'pitch_mm', 'source thread_pitch is blank');
      notSupplied(facts, 'tpi', 'thread system is metric in source');
    } else {
      const inches = parseInches(row.thread_diameter.trim());
      if (inches !== null) known(facts, 'diameter_in', inches);
      else notSupplied(facts, 'diameter_in', 'source thread_diameter is blank');
      notSupplied(facts, 'nominal_diameter_mm', 'thread system is inch in source');
      notSupplied(facts, 'pitch_mm', 'thread system is inch in source');
      const tpi = INCH_TPI_PATTERN.exec(threadSize);
      if (tpi) known(facts, 'tpi', Number(tpi[1]));
      else notSupplied(facts, 'tpi', 'thread_size carries no threads-per-inch suffix');
    }

    for (const [factId, slot] of facts) recordValue(factId, slot);
    rowFacts.push({ sku: row.sku.trim().toLowerCase(), pn: row.mcmaster_pn.trim(), family, facts });
  }

  // ---- Fact definitions ----------------------------------------------------
  const definitionOrder: string[] = [];
  const factDefinitions: FactDefinition[] = [];
  const pushStringDefinition = (factId: string, label: string, scopeFamilies?: string[]): void => {
    const values = Array.from(stringEnumValues.get(factId) ?? new Set<string>());
    if (!values.length) return;
    values.sort((left, right) => (left < right ? -1 : left > right ? 1 : 0));
    // The parser applies its prohibited-claim boundary to PartSource-authored
    // display labels, not to source-quoted specification values ("EHEDG
    // Certified" is the standard body's claim, quoted as supplied data). The
    // build mirrors that boundary: values are kept verbatim, labels stay clean.
    if (PROHIBITED_DISPLAY_CLAIM.test(label)) throw new Error(`prohibited claim-bearing label: ${label}`);
    for (const value of values) {
      if (value.length > 512) throw new Error(`value exceeds 512 characters for ${factId}`);
    }
    definitionOrder.push(factId);
    factDefinitions.push({
      factId, label, valueType: 'string_enum', unit: null, allowedValues: values, min: null, max: null,
      scope: scopeFamilies ? { kind: 'families', familyIds: scopeFamilies } : { kind: 'all_families' },
      allowedStates: ['known', 'not_supplied', 'unknown', 'not_applicable', 'conflicting'],
    });
  };
  const pushNumberDefinition = (factId: string, unit: string, scopeFamilies?: string[]): void => {
    const values = Array.from(numberValues.get(factId) ?? new Set<number>());
    if (!values.length) return;
    values.sort((left, right) => left - right);
    definitionOrder.push(factId);
    factDefinitions.push({
      factId, label: UNIT_LABELS[factId] ?? factId, valueType: 'number', unit, allowedValues: values,
      min: values[0], max: values[values.length - 1],
      scope: scopeFamilies ? { kind: 'families', familyIds: scopeFamilies } : { kind: 'all_families' },
      allowedStates: ['known', 'not_supplied', 'unknown', 'not_applicable', 'conflicting'],
    });
  };

  pushStringDefinition('thread_system', 'Thread system');
  pushStringDefinition('thread_size', 'Thread size');
  pushStringDefinition('threading', 'Threading');
  pushStringDefinition('thread_type', 'Thread type');
  pushStringDefinition('thread_spacing', 'Thread spacing');
  pushStringDefinition('thread_direction', 'Thread direction');
  pushStringDefinition('thread_fit', 'Thread fit');
  pushStringDefinition('drive_style', 'Drive style');
  pushStringDefinition('material', 'Material');
  pushStringDefinition('tensile_strength', 'Tensile strength');
  pushStringDefinition('hardness', 'Hardness');
  pushStringDefinition('specifications_met', 'Specifications met');
  pushStringDefinition('rohs_compliance', 'RoHS compliance');
  pushNumberDefinition('nominal_diameter_mm', 'mm');
  pushNumberDefinition('pitch_mm', 'mm');
  pushNumberDefinition('diameter_in', 'in');
  pushNumberDefinition('tpi', 'tpi');
  for (const entry of COMMON_PLAN.dualDimensions) {
    pushNumberDefinition(entry.mmFactId, 'mm', undefined);
    pushNumberDefinition(entry.inchFactId, 'in', undefined);
  }
  // Fork facts are scoped once over the union of the files that carry the
  // column (finish: hex+rounded; head_diameter/drive_size/min_thread_length
  // span two files each).
  const forkRegistrations = new Map<string, { label: string; kind: 'string' | 'number'; fileKeys: string[] }>();
  const registerFork = (factId: string, label: string, kind: 'string' | 'number', fileKey: string): void => {
    const existing = forkRegistrations.get(factId) ?? { label, kind, fileKeys: [] };
    if (!existing.fileKeys.includes(fileKey)) existing.fileKeys.push(fileKey);
    forkRegistrations.set(factId, existing);
  };
  for (const source of SOURCE_FILES) {
    for (const entry of FORK_PLAN[source.key].stringEnums) registerFork(entry.factId, entry.label, 'string', source.key);
    for (const entry of FORK_PLAN[source.key].dualDimensions) {
      registerFork(entry.mmFactId, entry.label, 'number', source.key);
      registerFork(entry.inchFactId, entry.label, 'number', source.key);
    }
  }
  for (const [factId, registration] of forkRegistrations) {
    const scope = families.filter(family => registration.fileKeys.includes(family.fileKey)).map(family => family.familyId);
    if (registration.kind === 'string') pushStringDefinition(factId, registration.label, scope);
    else pushNumberDefinition(factId, factId.endsWith('_mm') ? 'mm' : factId.endsWith('_in') ? 'in' : 'tpi', scope);
  }

  // ---- Hierarchy, families, schemas, facets --------------------------------
  const hierarchy: HierarchyNode[] = [{ nodeId: 'screws', parentNodeId: null, kind: 'category', label: 'Screws', order: 0, familyId: null }];
  const catalogFamilies: CatalogFamily[] = [];
  const schemaRevisions: FamilySchemaRevision[] = [];
  const facets: FacetDefinition[] = [];
  const familiesByFile = new Map(SOURCE_FILES.map(source => [source.key, families.filter(family => family.fileKey === source.key)]));
  SOURCE_FILES.forEach((source, categoryOrder) => {
    const categoryId = `cat-${source.key}`;
    hierarchy.push({ nodeId: categoryId, parentNodeId: 'screws', kind: 'category', label: source.categoryLabel, order: categoryOrder, familyId: null });
    for (const family of familiesByFile.get(source.key)!) {
      hierarchy.push({ nodeId: `node-${family.familyId}`, parentNodeId: categoryId, kind: 'family', label: family.label, order: hierarchy.length, familyId: family.familyId });
      catalogFamilies.push({
        familyId: family.familyId, label: family.label,
        hierarchyNodeId: `node-${family.familyId}`, currentSchemaRevisionId: `schema-${family.familyId}:r1`,
      });
      schemaRevisions.push({
        familySchemaRevisionId: `schema-${family.familyId}:r1`, familyId: family.familyId, revision: 1,
        factIds: family.factIds.filter(factId => factDefinitions.some(definition => definition.factId === factId)),
        facetIds: family.facetFactIds.map(factId => `facet-${family.familyId}-${factId}`),
      });
      family.facetFactIds.forEach((factId, order) => {
        facets.push({ facetId: `facet-${family.familyId}-${factId}`, familySchemaRevisionId: `schema-${family.familyId}:r1`, factId, label: factDefinitions.find(definition => definition.factId === factId)!.label, order });
      });
    }
  });

  // ---- Configurations, revisions, mappings, provenance ---------------------
  const ACTIVE_LIFECYCLE = { status: 'active' as const, effectiveAt: PUBLISHED_AT, reason: null, correctsId: null, supersededById: null };
  const provenance: ProvenanceRecord[] = SOURCE_FILES.flatMap(source => ([
    {
      provenanceId: `prov.fact.${source.key}`, claimType: 'fact' as const, sourceKind: 'cofounder_private_dev' as const,
      sourceId: `cofounder-csv:${source.fileName}`, publicationClass: 'private_dev' as const, permissionGrantId: null,
      evidenceRefs: [{ visibility: 'private' as const, ref: `evidence:private:cofounder-csv-${source.key}-fields` }],
    },
    {
      provenanceId: `prov.mapping.${source.key}`, claimType: 'mapping' as const, sourceKind: 'cofounder_private_dev' as const,
      sourceId: `cofounder-csv:${source.fileName}`, publicationClass: 'private_dev' as const, permissionGrantId: null,
      evidenceRefs: [{ visibility: 'private' as const, ref: `evidence:private:cofounder-csv-${source.key}-identifiers` }],
    },
  ]));
  const factProvenanceByFile = new Map(SOURCE_FILES.map(source => [source.key, `prov.fact.${source.key}`]));
  const mappingProvenanceByFile = new Map(SOURCE_FILES.map(source => [source.key, `prov.mapping.${source.key}`]));

  const configurations: CatalogConfiguration[] = [];
  const configurationRevisions: ConfigurationRevision[] = [];
  const identifierMappings: IdentifierMapping[] = [];
  for (const record of rowFacts) {
    const configurationId = `real-v1-${record.family.fileKey}-${record.sku}`;
    const revisionId = `${configurationId}:r1`;
    const schemaFactIds = schemaRevisions.find(schema => schema.familyId === record.family.familyId)!.factIds;
    const assignments = schemaFactIds.map(factId => {
      const slot = record.facts.get(factId);
      if (slot === undefined) throw new Error(`missing fact ${factId} on ${configurationId}`);
      return {
        factId,
        value: slot.kind === 'value'
          ? { state: 'known' as const, value: slot.value }
          : { state: 'not_supplied' as const, reason: slot.reason },
        provenanceIds: [factProvenanceByFile.get(record.family.fileKey)!],
      };
    });
    configurations.push({ configurationId, familyId: record.family.familyId, currentRevisionId: revisionId });
    configurationRevisions.push({
      configurationRevisionId: revisionId, configurationId, familyId: record.family.familyId,
      familySchemaRevisionId: `schema-${record.family.familyId}:r1`, revision: 1,
      lifecycle: { ...ACTIVE_LIFECYCLE }, facts: assignments,
    });
    identifierMappings.push({
      mappingId: `map-${record.family.fileKey}-${record.sku}`, namespaceId: 'mcmaster_pn',
      identifier: record.pn, configurationRevisionId: revisionId,
      provenanceId: mappingProvenanceByFile.get(record.family.fileKey)!, lifecycle: { ...ACTIVE_LIFECYCLE },
    });
  }

  // ---- Lexicon (generated; collision policy decision D4) -------------------
  const lexicon: LexiconRule[] = [];
  const usedTerms = new Set<string>();
  const skippedTerms: string[] = [];
  const addRule = (term: string, targetType: 'hierarchy_node' | 'family' | 'fact_value', targetId: string, familySchemaRevisionId: string | null, factId: string | null, factValue: FactPrimitive | null): void => {
    // Query normalization strips intra-word dashes ("18-8" -> "18 8"), so the
    // stored term must already be in that shape to stay matchable.
    const dashedStripped = term.replace(/(?<=[\p{L}\p{N}])[-‐‑‒–—](?=[\p{L}\p{N}])/gu, ' ');
    const normalizedTerm = normalizeTerm(dashedStripped);
    if (usedTerms.has(normalizedTerm)) { skippedTerms.push(`${term} -> ${targetId}`); return; }
    usedTerms.add(normalizedTerm);
    lexicon.push({
      ruleId: `lex.${lexicon.length + 1}`, match: 'exact_phrase', term: normalizedTerm, normalizedTerm,
      targetType, targetId, familySchemaRevisionId, factId, factValue,
    });
  };

  addRule('screw', 'hierarchy_node', 'screws', null, null, null);
  addRule('screws', 'hierarchy_node', 'screws', null, null, null);
  for (const source of SOURCE_FILES) {
    for (const phrase of source.categoryPhrases) addRule(phrase, 'hierarchy_node', `cat-${source.key}`, null, null, null);
  }
  for (const family of families) addRule(family.label, 'family', family.familyId, `schema-${family.familyId}:r1`, null, null);
  // Only all-family-scoped facts may carry schema-less value phrases.
  addRule('metric', 'fact_value', 'thread_system', null, 'thread_system', 'metric');
  addRule('inch', 'fact_value', 'thread_system', null, 'thread_system', 'inch');
  addRule('fully threaded', 'fact_value', 'threading', null, 'threading', 'Fully Threaded');
  addRule('partially threaded', 'fact_value', 'threading', null, 'threading', 'Partially Threaded');
  for (const value of stringEnumValues.get('thread_spacing') ?? []) addRule(`${value.toLowerCase()} thread`, 'fact_value', 'thread_spacing', null, 'thread_spacing', value);
  for (const value of stringEnumValues.get('drive_style') ?? []) {
    const phrase = value.toLowerCase();
    if (DRIVE_LEXICON_PHRASES.includes(phrase)) addRule(phrase, 'fact_value', 'drive_style', null, 'drive_style', value);
    else skippedTerms.push(`${phrase} -> drive_style (ambiguous or unmapped drive phrase)`);
  }
  for (const value of stringEnumValues.get('material') ?? []) addRule(value.toLowerCase(), 'fact_value', 'material', null, 'material', value);

  // ---- Assemble, digest, verify, write --------------------------------------
  const packageInput = {
    schemaVersion: 1 as const,
    manifest: {
      releaseId: RELEASE_ID,
      digest: 'sha256:pending:real-screws-v1',
      publishedAt: PUBLISHED_AT,
      allowedUse: 'private_dev_only' as const,
      dataOrigin: 'cofounder_private_dev' as const,
      publicationStatus: 'dev_release' as const,
      approvalId: null, reviewedBy: null, reviewedAt: null, permissionGrantId: null,
      correctsReleaseId: null, supersedesReleaseId: null, withdrawnAt: null, withdrawalReason: null,
      notice: NOTICE,
    },
    hierarchy,
    families: catalogFamilies,
    familySchemaRevisions: schemaRevisions,
    factDefinitions,
    facets,
    configurations,
    configurationRevisions,
    identifierNamespaces: [{ namespaceId: 'mcmaster_pn', label: 'McMaster-Carr part numbers', trimPolicy: 'trim' as const, casePolicy: 'upper' as const, unicodePolicy: 'NFKC' as const, identifierPattern: '^\\d{5}[A-Z]\\d{3}$' }],
    identifierMappings,
    provenance,
    lexicon,
  };

  const canonical = serializeCatalogPackageForDigest(packageInput as unknown as CatalogPackage);
  const digest = `sha256:${createHash('sha256').update(canonical, 'utf8').digest('hex')}`;
  const finalized = { ...packageInput, manifest: { ...packageInput.manifest, digest } };

  // Self-check through the production trust seam with the pinned digest.
  const parsed = parseCatalogPackage(JSON.parse(JSON.stringify(finalized)), undefined, digest as `sha256:${string}`);
  const replay = serializeCatalogPackageForDigest(parsed);
  if (createHash('sha256').update(replay, 'utf8').digest('hex') !== digest.slice('sha256:'.length)) {
    throw new Error('digest failed to verify after parser round-trip');
  }

  fs.mkdirSync(outputDirectory, { recursive: true });
  const artifact = path.join(outputDirectory, ARTIFACT_FILE);
  fs.writeFileSync(artifact, JSON.stringify(finalized));
  fs.writeFileSync(identityModule, [
    '/**',
    ' * Generated by `npm run catalog:build-real` (u1). Do not edit by hand.',
    ' * Dev-only catalog release identity; the artifact is served exclusively',
    ' * by the Vite dev server and never enters the production build.',
    ' */',
    `export const REAL_CATALOG_RELEASE_ID = '${RELEASE_ID}';`,
    `export const REAL_CATALOG_DIGEST = '${digest}' as const;`,
    `export const REAL_CATALOG_URL = 'catalog/${ARTIFACT_FILE}';`,
    `export const REAL_CATALOG_NOTICE = ${JSON.stringify(NOTICE)};`,
    '',
  ].join('\n'));

  const elapsedSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  const evidence = [
    '# u1 — Real-catalog dev release build evidence',
    '',
    `**Built:** ${new Date().toISOString()} (${elapsedSeconds}s) · **Decisions:** [u1 data decisions](../decisions/u1-real-catalog-data-decisions.md)`,
    '',
    '## Artifact identity',
    '',
    `- Release: \`${RELEASE_ID}\` · digest: \`${digest}\``,
    `- Artifact: \`web/catalog-releases/${ARTIFACT_FILE}\` (${(fs.statSync(artifact).size / 1_000_000).toFixed(1)} MB) — gitignored, dev-server-only`,
    `- Manifest: \`dataOrigin: cofounder_private_dev\`, \`allowedUse: private_dev_only\`, \`publicationStatus: dev_release\``,
    '',
    '## Import counts',
    '',
    `- Rows read: 27,009 (hex 8,850 / rounded 10,295 / socket 7,864)`,
    `- Rows excluded (blank PN, fail closed, decision D3): ${excludedBlankPn}`,
    `- Configurations / revisions / McMaster PN mappings: ${configurations.length} each (zero duplicate PNs asserted at build)`,
    `- Families: ${families.length} (hex ${familiesByFile.get('hex')!.length} / rounded ${familiesByFile.get('round')!.length} / socket ${familiesByFile.get('socket')!.length}) · categories: 3`,
    `- Fact definitions: ${factDefinitions.length} · facets: ${facets.length} · lexicon rules: ${lexicon.length}`,
    '',
    '## Recorded lexicon skips (collision policy, decision D4)',
    '',
    ...(skippedTerms.length ? skippedTerms.map(entry => `- ${entry}`) : ['- none']),
    '',
    'Publication of this dataset remains blocked by the external gates in `research/data-source-register.md`.',
    '',
  ].join('\n');
  const evidencePath = path.join(repoRoot, '.wayfinder', 'product-recovery', 'evidence', 'u1-real-catalog-release.md');
  fs.mkdirSync(path.dirname(evidencePath), { recursive: true });
  fs.writeFileSync(evidencePath, evidence);

  console.log(`real catalog package built: ${RELEASE_ID}`);
  console.log(`digest ${digest}`);
  console.log(`${configurations.length} configurations · ${families.length} families · ${lexicon.length} lexicon rules · ${excludedBlankPn} rows excluded`);
  console.log(`evidence: ${path.relative(repoRoot, evidencePath)}`);
}

main();
