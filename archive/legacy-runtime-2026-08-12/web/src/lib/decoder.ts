import Fuse from 'fuse.js';

/**
 * A real, sourced supplier offer for one of our catalog parts (contract term
 * "Offer": an observed price/availability with source and timestamp). An Offer
 * may ONLY exist when it carries a real supplier product URL and a retrieval
 * timestamp — never a fabricated SKU, price, or a search URL dressed up as an
 * offer. Parts with no verified offer fall back to honest spec-search links.
 */
export interface Offer {
  /** Distributor name, e.g. "Zoro". */
  distributor: string;
  /** The distributor's own SKU / item number for this listing (a listing field, never the page identity). */
  distributorSku: string;
  /** Deep link to the EXACT supplier product page (not a search). Required. */
  productUrl: string;
  /** Observed price for the listed pack, in `currency`. */
  price: number;
  /** ISO 4217 currency of `price`, e.g. "USD". */
  currency: string;
  /** Unit of measure the price is quoted in, e.g. "PK" (pack) or "EA". */
  uom: string;
  /** Number of pieces in the priced pack. */
  packQty: number;
  /** In-stock at retrieval time, when known. */
  inStock?: boolean;
  /** ISO date the price/URL was observed. Required — a price has no meaning without it. */
  retrievedAt: string;
  /** Provenance of the observation (how the price/URL was captured). */
  note?: string;
}

export interface Part {
  partNumber: string;
  category: string;
  type: string;
  thread: string;
  pitch: string;
  length: string;
  material: string;
  finish: string;
  drive: string;
  standard: string;
  /** Deprecated compatibility field. Always 0; never a PartSource price. */
  mcmasterPrice: number;
  appNote: string;
  /** Verified McMaster-Carr cross-reference PN (reference field only). */
  mcmaster?: string;
  /** Technical title supplied by a prototype catalog record. */
  title?: string;
  /** Source-system SKU supplied by a prototype catalog record. */
  sourceSku?: string;
  /** True for generated prototype catalog records without commercial data. */
  isPrototype?: true;
  /** True when this object was guessed from user input, not read from the catalog. */
  unindexed?: boolean;
  /** Disabled for the current POC. Empty/absent → honest search fallback. */
  offers?: Offer[];
}

// ---------------------------------------------------------------------------
// Published McMaster-Carr cross-references
// ---------------------------------------------------------------------------
// Empty until source clearance and independent review approve a public mapping.
// Unpublished candidate cross-reference fixtures live in a test-only module and
// are not imported into the browser runtime.
export interface McMasterCross {
  /** McMaster-Carr PN — reference field only, never a page identity. */
  mcmaster: string;
  /** Our catalog part number the MPN maps to. */
  partNumber: string;
  /** Provenance of the verification. */
  note: string;
}

export const MCMASTER_CROSSES: McMasterCross[] = [];

export const suppliers = [
  { name: "Zoro", urlTemplate: "https://www.zoro.com/search?q=" },
  { name: "Bolt Depot", urlTemplate: "https://www.boltdepot.com/Product-Search.aspx?txt=" },
  { name: "MSC Industrial", urlTemplate: "https://www.mscdirect.com/browse/tn?searchterm=" },
  { name: "Fastenal", urlTemplate: "https://www.fastenal.com/products/search?term=" },
  { name: "Misumi", urlTemplate: "https://us.misumi-ec.com/vona2/result/?Keyword=" }
];

// ---------------------------------------------------------------------------
// Supplier search-query generation
// ---------------------------------------------------------------------------
// The PRD (research/prd.md line 82) specifies search-query URLs derived from
// the part's SPECIFICATIONS, not fake SKUs. The previous implementation hashed
// the part number into pseudo-SKUs (e.g. "G4827193" for Zoro) that returned
// garbage on supplier search pages. This builds a real, human-readable query
// string from the decoded specs so supplier searches actually match product.

/** A normal material token stripped for use in a search query. */
function cleanMaterial(material: string): string {
  if (!material || material === 'Unknown' || material.includes('Assumed')) return '';
  return material;
}

/** Map our part `type` onto supplier-friendly phrasing (e.g. Bolt Depot). */
function describeType(type: string): string {
  if (!type) return '';
  const t = type.toLowerCase();
  if (t.includes('socket head cap')) return 'socket head cap screw';
  if (t.includes('flat head')) return 'flat head socket cap screw';
  if (t.includes('button head')) return 'button head socket cap screw';
  if (t.includes('hex head')) return 'hex head screw';
  if (t.includes('shoulder')) return 'socket shoulder screw';
  if (t.includes('nylon-insert') || t.includes('locknut')) return 'nylon insert locknut';
  if (t.includes('lock washer')) return 'split lock washer';
  if (t.includes('flat washer')) return 'flat washer';
  if (t.includes('hex nut')) return 'hex nut';
  return type.toLowerCase();
}

/**
 * Build a spec-derived search query for a supplier. Example output for
 * 91251A245 -> "M4 socket head cap screw 20mm black-oxide alloy steel".
 */
export function buildSupplierQuery(part: Part): string {
  const parts: string[] = [];
  if (part.thread && part.thread !== 'Unknown' && part.thread !== 'N/A') parts.push(part.thread);
  const t = describeType(part.type);
  if (t) parts.push(t);
  // Thread + length: render metric as "20mm", imperial as "1/2"".
  if (part.length && part.length !== 'Unknown' && part.length !== 'N/A') {
    parts.push(part.length.replace(/\s+/g, ''));
  }
  if (cleanMaterial(part.finish)) parts.push(cleanMaterial(part.finish).toLowerCase());
  if (cleanMaterial(part.material)) parts.push(cleanMaterial(part.material).toLowerCase());
  return parts.join(' ').trim() || part.partNumber;
}

/**
 * Build the full supplier search URL. `urlTemplate` already ends in the
 * supplier's query param (e.g. "...?q=").
 */
export function getSupplierSearchUrl(supplierUrlTemplate: string, part: Part): string {
  const query = buildSupplierQuery(part);
  return supplierUrlTemplate + encodeURIComponent(query);
}

// Kept for backward compatibility with any external callers. Prefer
// getSupplierSearchUrl — it returns a real query that works on supplier sites.
export function getEquivalentPartNumber(supplierName: string, partNumber: string): string {
  if (supplierName === 'McMaster-Carr') return partNumber;
  // Best-effort fallback for the rare caller that still passes a raw number:
  // treat it as the search query itself.
  return partNumber;
}

// ---------------------------------------------------------------------------
// Regex fallback decoder
// ---------------------------------------------------------------------------
// Coarse metric pitch (mm) lookup by nominal thread diameter, ISO 261 coarse.
const COARSE_PITCH_MM: Record<string, string> = {
  'M1.6': '0.35 mm', 'M2': '0.4 mm', 'M2.5': '0.45 mm',
  'M3': '0.5 mm', 'M4': '0.7 mm', 'M5': '0.8 mm',
  'M6': '1.0 mm', 'M8': '1.25 mm', 'M10': '1.5 mm', 'M12': '1.75 mm'
};

// Real McMaster-Carr series facts, family level only. A series prefix pins
// down type/material/finish; the suffix→size encoding is NOT public and is
// never guessed. Only series verifiable from public listings belong here.
interface McMasterSeries {
  type: string;
  drive: string;
  category: string;
  material: string;
  finish: string;
}
const MCMASTER_SERIES: Record<string, McMasterSeries> = {
  '91251': { type: 'Socket Head Cap Screw', drive: 'Hex', category: 'Screws & Bolts', material: 'Alloy Steel', finish: 'Black-Oxide' },        // imperial
  '92196': { type: 'Socket Head Cap Screw', drive: 'Hex', category: 'Screws & Bolts', material: '18-8 Stainless Steel', finish: 'Plain' },     // imperial
  '91290': { type: 'Socket Head Cap Screw', drive: 'Hex', category: 'Screws & Bolts', material: 'Alloy Steel', finish: 'Black-Oxide' },        // metric
  '91292': { type: 'Socket Head Cap Screw', drive: 'Hex', category: 'Screws & Bolts', material: '18-8 Stainless Steel', finish: 'Plain' },     // metric
  '92095': { type: 'Button Head Socket Cap Screw', drive: 'Hex', category: 'Screws & Bolts', material: '18-8 Stainless Steel', finish: 'Plain' }, // metric
  '92125': { type: 'Socket Shoulder Screw', drive: 'Hex', category: 'Screws & Bolts', material: 'Alloy Steel', finish: 'Black-Oxide' },
  '90592': { type: 'Hex Nut', drive: 'Hex Outer', category: 'Nuts', material: 'Steel', finish: 'Zinc-Plated' },                                 // metric
  '91831': { type: 'Nylon-Insert Locknut', drive: 'Hex Outer', category: 'Nuts', material: '18-8 Stainless Steel', finish: 'Plain' },           // metric
  '93475': { type: 'Flat Washer', drive: 'N/A', category: 'Washers', material: '18-8 Stainless Steel', finish: 'Plain' },                       // metric
};

// Governing standard by decoded type, split by thread system. Applied only
// after type+thread are known — never guessed from the part number alone.
const STANDARD_BY_TYPE_METRIC: Record<string, string> = {
  'Socket Head Cap Screw': 'DIN 912 / ISO 4762',
  'Flat Head Socket Cap Screw': 'DIN 7991 / ISO 10642',
  'Button Head Socket Cap Screw': 'ISO 7380',
  'Hex Head Screw': 'DIN 933 / ISO 4017',
  'Socket Shoulder Screw': 'ISO 7379',
  'Hex Nut': 'DIN 934 / ISO 4032',
  'Nylon-Insert Locknut': 'DIN 985 / ISO 10511',
  'Flat Washer': 'DIN 125A / ISO 7089',
  'Split Lock Washer': 'DIN 127B',
};
const STANDARD_BY_TYPE_IMPERIAL: Record<string, string> = {
  'Socket Head Cap Screw': 'ASME B18.3',
  'Flat Head Socket Cap Screw': 'ASME B18.3',
  'Button Head Socket Cap Screw': 'ASME B18.3',
  'Socket Shoulder Screw': 'ASME B18.3',
  'Hex Head Screw': 'ASME B18.2.1',
  'Hex Nut': 'ASME B18.2.2',
  'Nylon-Insert Locknut': 'ASME B18.16.6',
  'Flat Washer': 'ASME B18.22.1',
};

function prefixFor(query: string): string {
  return (query.match(/^\d{5}/)?.[0] || '').toUpperCase();
}

/** Infer material from the McMaster series prefix (known series only). */
function inferMaterial(query: string): { material: string; finish: string } {
  const s = MCMASTER_SERIES[prefixFor(query)];
  return s ? { material: s.material, finish: s.finish } : { material: '', finish: '' };
}

function inferType(query: string, queryLower: string): { type: string; drive: string; category: string } {
  const s = MCMASTER_SERIES[prefixFor(query)];
  if (s) return { type: s.type, drive: s.drive, category: s.category };
  if (queryLower.includes('cap screw') || queryLower.includes('shcs')) {
    return { type: 'Socket Head Cap Screw', drive: 'Hex', category: 'Screws & Bolts' };
  }
  if (queryLower.includes('flat head')) {
    return { type: 'Flat Head Socket Cap Screw', drive: 'Hex', category: 'Screws & Bolts' };
  }
  if (queryLower.includes('button head')) {
    return { type: 'Button Head Socket Cap Screw', drive: 'Hex', category: 'Screws & Bolts' };
  }
  if (queryLower.includes('hex bolt') || queryLower.includes('hex head')) {
    return { type: 'Hex Head Screw', drive: 'Hex Outer', category: 'Screws & Bolts' };
  }
  if (queryLower.includes('shoulder')) {
    return { type: 'Socket Shoulder Screw', drive: 'Hex', category: 'Screws & Bolts' };
  }
  if (queryLower.includes('locknut') || queryLower.includes('nylock')) {
    return { type: 'Nylon-Insert Locknut', drive: 'Hex Outer', category: 'Nuts' };
  }
  if (queryLower.includes('nut')) {
    return { type: 'Hex Nut', drive: 'Hex Outer', category: 'Nuts' };
  }
  if (queryLower.includes('lock washer')) {
    return { type: 'Split Lock Washer', drive: 'N/A', category: 'Washers' };
  }
  if (queryLower.includes('washer')) {
    return { type: 'Flat Washer', drive: 'N/A', category: 'Washers' };
  }
  return { type: 'Custom Fastener', drive: 'Unknown', category: 'Fasteners' };
}

export function parseCustomPart(query: string): Part {
  const q = query.trim();
  const qLower = q.toLowerCase();

  const { type, drive, category } = inferType(q, qLower);
  const { material: mInf, finish: fInf } = inferMaterial(q);

  // Thread — accepts metric (M4, M2.5), unified (#10-24), and fractional
  // imperial with an optional " between the fraction and TPI (1/4"-20, 1/4-20).
  const threadMatch = q.match(/(M\d+(?:\.\d+)?|#\d+-\d+|\d+\/\d+"?-\d+)/i);
  const thread = threadMatch ? threadMatch[1].toUpperCase() : 'Unknown';

  // Pitch: from coarse-pitch table for metric; TPI already encoded for imperial.
  let pitch = 'N/A';
  if (thread.startsWith('M') && COARSE_PITCH_MM[thread]) {
    pitch = COARSE_PITCH_MM[thread];
  } else if (thread.match(/-\d+$/)) {
    const tpi = thread.split('-').pop();
    pitch = `${tpi} TPI`;
  }

  // Length: "x 20mm" / "-20mm" / " 1/2\"" / trailing "20mm". The thread token
  // is stripped first so its digits (e.g. the -20 TPI in 1/4"-20) can never be
  // misread as a length.
  let length = 'Unknown';
  const isNutOrWasher = category === 'Nuts' || category === 'Washers';
  if (isNutOrWasher) {
    length = 'N/A';
  } else {
    const qNoThread = threadMatch ? q.replace(threadMatch[0], ' ') : q;
    const lenMatch = qNoThread.match(/(?:x|\s|-)\s*(\d+(?:\.\d+)?\s*(?:mm|cm)|\d+\/\d+"\s*|\d+"\s*|\d+(?:\.\d+)?\s*$)/i);
    if (lenMatch) {
      length = lenMatch[1].trim().toLowerCase().replace(/\s+/g, ' ');
    }
  }

  // Material / finish: keyword overrides beat inferred defaults.
  let material = mInf;
  let finish = fInf;
  if (qLower.includes('stainless') || qLower.includes('18-8')) material = '18-8 Stainless Steel';
  if (qLower.includes('black')) finish = 'Black-Oxide';
  if (qLower.includes('zinc')) finish = 'Zinc-Plated';

  // Standard from decoded type + thread system; never from the number alone.
  let standard = 'Unknown';
  if (type !== 'Custom Fastener' && thread !== 'Unknown') {
    standard = (thread.startsWith('M')
      ? STANDARD_BY_TYPE_METRIC[type]
      : STANDARD_BY_TYPE_IMPERIAL[type]) || 'Unknown';
  }

  // Honesty rules: never fabricate specifics. Material/finish stay Unknown
  // unless inferred from a known McMaster series or explicit keywords, and a
  // price estimate exists only when the spec decoded well enough to price.
  const decodedEnough = thread !== 'Unknown' && type !== 'Custom Fastener';

  return {
    partNumber: q.toUpperCase(),
    category,
    type,
    thread,
    pitch,
    length,
    material: material || 'Unknown',
    finish: finish || 'Unknown',
    drive,
    standard,
    mcmasterPrice: 0,
    appNote: decodedEnough
      ? 'Specs decoded from your input; this exact part is not in the indexed catalog.'
      : 'This part number is not in the indexed catalog and could not be decoded.',
    unindexed: true
  };
}

// ---------------------------------------------------------------------------
// Standards-derived catalog generator
// ---------------------------------------------------------------------------
// Generates the bulk of the catalog from public DIN/ISO dimensional standards
// (facts, freely redistributable — see research/data-sourcing-decision.md and
// the V1 plan guardrails: own part numbers are the primary identity, the
// McMaster PN is only a verified reference field on the hand-checked entries).

const THREAD_DIA_MM: Record<string, number> = {
  'M2': 2, 'M2.5': 2.5, 'M3': 3, 'M4': 4, 'M5': 5,
  'M6': 6, 'M8': 8, 'M10': 10, 'M12': 12
};

// Standard length series (mm) and the stocked range per nominal diameter.
const LENGTH_SERIES = [4, 5, 6, 8, 10, 12, 16, 20, 25, 30, 35, 40, 50, 60, 80];
const LENGTH_RANGE: Record<string, [number, number]> = {
  'M2': [4, 16], 'M2.5': [5, 20], 'M3': [5, 30], 'M4': [6, 40], 'M5': [8, 50],
  'M6': [10, 60], 'M8': [12, 80], 'M10': [16, 80], 'M12': [20, 80]
};

interface ScrewFamily {
  code: string;          // own-PN prefix, e.g. "DIN912"
  type: string;
  standard: string;
  drive: string;
  alloyNote: string;     // property class note for the plain-steel variant
  alloyMaterial: string;
  alloyFinish: string;
  threads: string[];
  maxLen: number;
}

const SCREW_THREADS = Object.keys(THREAD_DIA_MM);
const SCREW_FAMILIES: ScrewFamily[] = [
  { code: 'DIN912', type: 'Socket Head Cap Screw', standard: 'DIN 912 / ISO 4762', drive: 'Hex',
    alloyNote: 'class 12.9 alloy steel', alloyMaterial: 'Alloy Steel', alloyFinish: 'Black-Oxide',
    threads: SCREW_THREADS, maxLen: 80 },
  { code: 'DIN7991', type: 'Flat Head Socket Cap Screw', standard: 'DIN 7991 / ISO 10642', drive: 'Hex',
    alloyNote: 'class 10.9 alloy steel', alloyMaterial: 'Alloy Steel', alloyFinish: 'Black-Oxide',
    threads: SCREW_THREADS.filter(t => t !== 'M12'), maxLen: 40 },
  { code: 'ISO7380', type: 'Button Head Socket Cap Screw', standard: 'ISO 7380', drive: 'Hex',
    alloyNote: 'class 10.9 alloy steel', alloyMaterial: 'Alloy Steel', alloyFinish: 'Black-Oxide',
    threads: SCREW_THREADS.filter(t => t !== 'M12'), maxLen: 40 },
  { code: 'DIN933', type: 'Hex Head Screw', standard: 'DIN 933 / ISO 4017', drive: 'Hex Outer',
    alloyNote: 'class 8.8 steel', alloyMaterial: 'Steel', alloyFinish: 'Zinc-Plated',
    threads: SCREW_THREADS.filter(t => !['M2', 'M2.5', 'M3'].includes(t)), maxLen: 80 },
];


function generateStandardsCatalog(): Part[] {
  const parts: Part[] = [];
  const variants = (alloyMaterial: string, alloyFinish: string, alloyNote: string) => [
    { suffix: '', material: alloyMaterial, finish: alloyFinish, note: alloyNote, stainless: false },
    { suffix: '-A2', material: '18-8 Stainless Steel', finish: 'Plain', note: 'A2 stainless steel', stainless: true },
  ];

  for (const fam of SCREW_FAMILIES) {
    for (const thread of fam.threads) {
      const [minL, maxL] = LENGTH_RANGE[thread];
      const lengths = LENGTH_SERIES.filter(l => l >= minL && l <= Math.min(maxL, fam.maxLen));
      for (const len of lengths) {
        for (const v of variants(fam.alloyMaterial, fam.alloyFinish, fam.alloyNote)) {
          parts.push({
            partNumber: `${fam.code}-${thread}X${len}${v.suffix}`,
            category: 'Screws & Bolts',
            type: fam.type,
            thread,
            pitch: COARSE_PITCH_MM[thread],
            length: `${len} mm`,
            material: v.material,
            finish: v.finish,
            drive: fam.drive,
            standard: fam.standard,
            mcmasterPrice: 0,
            appNote: `${fam.standard.split(' / ')[0]} ${fam.type.toLowerCase()}, ${thread}×${len} mm, ${v.note}. Dimensions per the published standard.`,
          });
        }
      }
    }
  }

  const nutWasherFamilies = [
    { code: 'DIN934', type: 'Hex Nut', standard: 'DIN 934 / ISO 4032', drive: 'Hex Outer',
      category: 'Nuts', steelMaterial: 'Steel', steelFinish: 'Zinc-Plated', steelNote: 'class 8 steel' },
    { code: 'DIN985', type: 'Nylon-Insert Locknut', standard: 'DIN 985 / ISO 10511', drive: 'Hex Outer',
      category: 'Nuts', steelMaterial: 'Steel', steelFinish: 'Zinc-Plated', steelNote: 'class 8 steel, prevailing-torque' },
    { code: 'DIN125', type: 'Flat Washer', standard: 'DIN 125A / ISO 7089', drive: 'N/A',
      category: 'Washers', steelMaterial: 'Steel', steelFinish: 'Zinc-Plated', steelNote: 'form A steel' },
    { code: 'DIN127', type: 'Split Lock Washer', standard: 'DIN 127B', drive: 'N/A',
      category: 'Washers', steelMaterial: 'Spring Steel', steelFinish: 'Zinc-Plated', steelNote: 'form B spring steel' },
  ];

  for (const fam of nutWasherFamilies) {
    // DIN 127 spring washers are not commonly stocked in stainless; steel only.
    const mats = fam.code === 'DIN127'
      ? [{ suffix: '', material: fam.steelMaterial, finish: fam.steelFinish, note: fam.steelNote, stainless: false }]
      : variants(fam.steelMaterial, fam.steelFinish, fam.steelNote);
    for (const thread of SCREW_THREADS) {
      const isWasher = fam.category === 'Washers';
      for (const v of mats) {
        parts.push({
          partNumber: `${fam.code}-${thread}${v.suffix}`,
          category: fam.category,
          type: fam.type,
          thread,
          pitch: isWasher ? 'N/A' : COARSE_PITCH_MM[thread],
          length: 'N/A',
          material: v.material,
          finish: v.finish,
          drive: fam.drive,
          standard: fam.standard,
          mcmasterPrice: 0,
          appNote: `${fam.standard.split(' / ')[0]} ${fam.type.toLowerCase()}, ${thread}, ${v.note}. Dimensions per the published standard.`,
        });
      }
    }
  }

  return parts;
}

// Build the catalog and attach hand-verified McMaster crosses to their
// corresponding entries. Own PN stays the identity; MPN is a reference field.
export const standardsDb: Part[] = (() => {
  const parts = generateStandardsCatalog();
  const byPn = new Map(parts.map(p => [p.partNumber, p]));
  for (const cross of MCMASTER_CROSSES) {
    const part = byPn.get(cross.partNumber);
    if (part) part.mcmaster = cross.mcmaster;
  }
  return parts;
})();

// Browser fallback catalog only. Private/generated prototype records live in
// Supabase and are fetched through the catalog-search Edge Function, never
// bundled into client assets.
export const db = standardsDb;

const fuseKeys = ['partNumber', 'mcmaster', 'type', 'thread', 'length', 'standard'];

export const fuse = new Fuse(db, {
  keys: fuseKeys,
  threshold: 0.3,
  ignoreLocation: true,
  includeScore: true,
  useExtendedSearch: true,
  getFn: (part, path) => {
    const key = Array.isArray(path) ? path.join('.') : path;
    return Fuse.config.getFn(part, path);
  }
});

export const UNSUPPORTED_INPUT_COPY = 'PartSource does not support this input yet';
export const SEARCH_UNAVAILABLE_COPY = 'Configuration search temporarily unavailable';
const mcMasterIdentifierPattern = /^\d{5,6}[A-Z]\d{3,4}$/;

export type LookupResultState =
  | 'configuration-match'
  | 'configuration-search'
  | 'supplier-search-destination'
  | 'unsupported-input'
  | 'invalid-input'
  | 'search-unavailable';

export function normalizeMcMasterIdentifier(query: string): string {
  return query.trim().toUpperCase();
}

export function isMcMasterIdentifier(query: string): boolean {
  return mcMasterIdentifierPattern.test(normalizeMcMasterIdentifier(query));
}

export type PartResolution = {
  state: LookupResultState;
  query: string;
  part: Part;
};

export function resolvePartIdentity(query: string): PartResolution {
  const normalized = query.trim();
  if (!normalized) {
    return { state: 'invalid-input', query: normalized, part: parseCustomPart(normalized) };
  }

  const upper = normalizeMcMasterIdentifier(normalized);
  const exactMcMaster = db.find(p => p.mcmaster?.toUpperCase() === upper);
  if (exactMcMaster) return { state: 'configuration-match', query: normalized, part: exactMcMaster };

  const exactPartSourceConfiguration = db.find(p => p.partNumber.toUpperCase() === upper);
  if (exactPartSourceConfiguration) {
    return { state: 'configuration-match', query: normalized, part: exactPartSourceConfiguration };
  }

  if (isMcMasterIdentifier(normalized)) {
    const part = parseCustomPart(normalized);
    return {
      state: 'unsupported-input',
      query: normalized,
      part: {
        ...part,
        appNote: UNSUPPORTED_INPUT_COPY,
        unindexed: true,
        mcmasterPrice: 0,
        offers: undefined,
      },
    };
  }

  const suggestions = fuse.search(normalized, { limit: 2 });
  const suggestion = suggestions[0];
  const runnerUp = suggestions[1];
  const hasClearLead = runnerUp?.score === undefined
    || (runnerUp.score - suggestion.score!) >= 0.03;
  if (suggestion?.score !== undefined && suggestion.score < 0.15 && hasClearLead) {
    return { state: 'configuration-search', query: normalized, part: suggestion.item };
  }

  const part = parseCustomPart(normalized);
  const decoded = part.thread !== 'Unknown' || part.standard !== 'Unknown' || part.type !== 'Custom Fastener';
  return { state: decoded ? 'configuration-search' : 'invalid-input', query: normalized, part };
}

/**
 * Resolve a user-supplied part query to a catalog entry, or null.
 * Only exact local configuration matches resolve to a catalog entry. Fuzzy
 * and decoded outputs remain configuration searches, never supplier claims.
 */
export function findCatalogPart(query: string): Part | null {
  const normalized = query.trim().toUpperCase();
  const exactPartSourceConfiguration = db.find(p => p.partNumber.toUpperCase() === normalized);
  if (exactPartSourceConfiguration && !isMcMasterIdentifier(query)) return exactPartSourceConfiguration;

  const resolution = resolvePartIdentity(query);
  return resolution.state === 'configuration-match' ? resolution.part : null;
}

// --- Small hash helper retained (legacy callers may still import it) -------
export function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return Math.abs(hash);
}
