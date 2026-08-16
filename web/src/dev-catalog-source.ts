/**
 * Catalog package source seam (u1) — application layer, deliberately outside
 * src/catalog: the deterministic catalog domain stays free of network APIs
 * (runtime boundary guard) while the application layer owns browser behavior,
 * including loading a build-time-verified release artifact.
 *
 * Selection (u1 D5, amended by D6/f2): the Vite dev server defaults to the
 * real release and `?catalog=synthetic` opts out locally. Production and
 * preview builds keep the synthetic module-load default and never attempt
 * the dev release — publication gates are unchanged (register +
 * decisions/u1-real-catalog-data-decisions.md D5/D6).
 */
import { REAL_CATALOG_DIGEST, REAL_CATALOG_URL } from './catalog/real-release-identity';
import { parseCatalogPackage } from './catalog/parse-catalog-package';
import { createCatalogIndex } from './catalog/engine/catalog-index';
import type { CatalogIndex } from './catalog/engine/types';

export type CatalogSelection = 'synthetic' | 'real-dev';

export function requestedCatalogSelection(search: string): CatalogSelection {
  // Production and preview never load the dev-only release, regardless of
  // the URL parameter: the artifact is not served there and attempting it
  // would only produce a guaranteed error.
  if (!import.meta.env.DEV) return 'synthetic';
  return new URLSearchParams(search).get('catalog') === 'synthetic' ? 'synthetic' : 'real-dev';
}

export async function loadDevCatalogRelease(): Promise<CatalogIndex> {
  const response = await fetch(new URL(REAL_CATALOG_URL, document.baseURI));
  if (!response.ok) throw new Error(`catalog release fetch failed: ${response.status}`);
  const input: unknown = await response.json();
  const parsed = parseCatalogPackage(input, undefined, REAL_CATALOG_DIGEST);
  return createCatalogIndex(parsed);
}
