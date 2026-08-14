import { buildSupplierQuery, getSupplierSearchUrl, suppliers, type Part } from './decoder';

export type CatalogSearchResult = {
  id: string;
  family: 'socket' | 'hex' | 'rounded' | string;
  type: string | null;
  reference_number: string | null;
  source_sku: string | null;
  title: string | null;
  thread: string | null;
  pitch: string | null;
  length: string | null;
  head: string | null;
  material: string | null;
  finish: string | null;
  drive: string | null;
  strength: string | null;
  standard: string | null;
  prototype: boolean;
  demo: boolean;
  synthetic: boolean;
  provenance_kind: 'internal-demo-seed' | 'standards-derived' | 'permitted-reference' | 'user-entered' | string;
  provenance_note: string;
  verification: 'demo-only' | 'reviewed-configuration' | 'unreviewed' | string;
};

export type CatalogSearchFilters = Partial<Record<'family' | 'type' | 'thread' | 'pitch' | 'length' | 'head' | 'material' | 'finish' | 'drive' | 'strength' | 'standard', string>>;
export const CONFIGURATION_NOTICE = 'Configuration — verify before sourcing';
const maxResults = 25;
const commercialFields = new Set([
  'price', 'prices', 'stock', 'inStock', 'inventory', 'availability', 'available', 'leadTime',
  'supplier', 'suppliers', 'supplierSku', 'listing', 'offer', 'offers', 'buy', 'buyUrl',
  'cart', 'checkout', 'quote', 'quoteUrl', 'equivalent', 'equivalents', 'equivalence',
  'replacement', 'approvedAlternate', 'approved_alternate', 'alternate', 'sameItem',
]);

type RuntimeProcess = { env?: Record<string, string | undefined> };

function envValue(key: string): string {
  const viteValue = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.[key];
  if (viteValue) return viteValue;
  const processValue = (globalThis as typeof globalThis & { process?: RuntimeProcess }).process?.env?.[key];
  return processValue ?? '';
}

function endpoint(): string | null {
  const directUrl = envValue('VITE_CATALOG_SEARCH_URL');
  if (directUrl) return directUrl;
  const supabaseUrl = envValue('VITE_SUPABASE_URL').replace(/\/$/, '');
  return supabaseUrl ? `${supabaseUrl}/functions/v1/catalog-search` : null;
}

export function getCatalogSearchConfig() {
  const url = endpoint();
  const publishableKey = envValue('VITE_SUPABASE_PUBLISHABLE_KEY');
  return { url, publishableKey, configured: Boolean(url && publishableKey) };
}

export class CatalogApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'CatalogApiError';
  }
}

function assertConfigurationBoundary(result: Record<string, unknown>, path = '$') {
  for (const field of Object.keys(result)) {
    if (commercialFields.has(field)) {
      throw new CatalogApiError(`Catalog response crossed commercial-data boundary at ${path}.${field}`);
    }
    const value = result[field];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      assertConfigurationBoundary(value as Record<string, unknown>, `${path}.${field}`);
    }
  }
}

export async function searchCatalog(
  query: string,
  filters: CatalogSearchFilters = {},
  options: { signal?: AbortSignal } = {},
): Promise<CatalogSearchResult[]> {
  const normalized = query.trim();
  if (!normalized) return [];

  const config = getCatalogSearchConfig();
  if (!config.url || !config.publishableKey) return [];

  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${config.publishableKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ query: normalized, filters }),
    signal: options.signal,
  });

  let body: { results?: CatalogSearchResult[]; error?: string } = {};
  try {
    body = await response.json();
  } catch {
    throw new CatalogApiError('Catalog search returned invalid JSON', response.status);
  }

  if (!response.ok) {
    throw new CatalogApiError(body.error || 'Catalog search failed', response.status);
  }

  const results = Array.isArray(body.results) ? body.results : [];
  for (const result of results) assertConfigurationBoundary(result as Record<string, unknown>);
  return results.slice(0, maxResults);
}

function fallback(value: string | null | undefined, empty = 'Unknown'): string {
  const trimmed = value?.trim();
  return trimmed && trimmed !== '-' ? trimmed : empty;
}

function familyType(family: string, title: string | null): string {
  const lowerTitle = title?.toLowerCase() ?? '';
  if (family === 'socket') return 'Socket Head Cap Screw';
  if (family === 'hex') return 'Hex Head Screw';
  if (family === 'rounded' || lowerTitle.includes('button')) return 'Rounded Head Screw';
  return 'Catalog Configuration';
}

export function catalogResultToPart(result: CatalogSearchResult): Part {
  const partNumber = fallback(result.reference_number ?? result.source_sku ?? result.id, result.id).toUpperCase();

  return {
    partNumber,
    category: 'Screws & Bolts',
    type: fallback(result.type, familyType(result.family, result.title)),
    thread: fallback(result.thread),
    pitch: fallback(result.pitch, 'N/A'),
    length: fallback(result.length, 'N/A'),
    material: fallback(result.material),
    finish: fallback(result.finish),
    drive: fallback(result.drive),
    standard: fallback(result.standard),
    mcmasterPrice: 0,
    appNote: CONFIGURATION_NOTICE,
    mcmaster: result.reference_number ?? undefined,
    title: result.title ?? undefined,
    sourceSku: result.source_sku ?? undefined,
    isPrototype: result.prototype ? true : undefined,
    offers: undefined,
  };
}

export type SupplierSearchDestination = {
  state: 'supplier-search-destination';
  name: string;
  label: string;
  url: string;
  query: string;
  requiresVerification: true;
};

export function buildSupplierSearchDestinations(part: Part): SupplierSearchDestination[] {
  const query = buildSupplierQuery(part);
  return suppliers.map(supplier => ({
    state: 'supplier-search-destination',
    name: supplier.name,
    label: `Search this configuration on ${supplier.name}`,
    url: getSupplierSearchUrl(supplier.urlTemplate, part),
    query,
    requiresVerification: true,
  }));
}
