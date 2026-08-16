/**
 * Catalog package source seam (u1) — application layer, deliberately outside
 * src/catalog: the deterministic catalog domain stays free of network APIs
 * (runtime boundary guard) while the application layer owns browser behavior,
 * including loading a build-time-verified release artifact.
 *
 * The synthetic package remains the
 * module-load default; the dev-only real release is fetched through this seam
 * when explicitly requested with `?catalog=real` and fails closed on any
 * load or identity error. See decisions/u1-real-catalog-data-decisions.md D5.
 */
import { REAL_CATALOG_DIGEST, REAL_CATALOG_URL } from './catalog/real-release-identity';
import { parseCatalogPackage } from './catalog/parse-catalog-package';
import { createCatalogIndex } from './catalog/engine/catalog-index';
import type { CatalogIndex } from './catalog/engine/types';

export type CatalogSelection = 'synthetic' | 'real-dev';

export function requestedCatalogSelection(search: string): CatalogSelection {
  return new URLSearchParams(search).get('catalog') === 'real' ? 'real-dev' : 'synthetic';
}

export async function loadDevCatalogRelease(): Promise<CatalogIndex> {
  const response = await fetch(new URL(REAL_CATALOG_URL, document.baseURI));
  if (!response.ok) throw new Error(`catalog release fetch failed: ${response.status}`);
  const input: unknown = await response.json();
  const parsed = parseCatalogPackage(input, undefined, REAL_CATALOG_DIGEST);
  return createCatalogIndex(parsed);
}
