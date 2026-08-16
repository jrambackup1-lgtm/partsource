import type { CatalogFilter, CatalogIndex, CatalogResolution } from './types';
import { applyCatalogFilters, resolveCatalogQuery, selectCatalogRecord } from './resolver';
import { serializeCatalogUrl } from './url-state';

export type HistoryMode = 'push' | 'replace' | 'back';

export interface CatalogHistorySnapshot {
  readonly resolution: CatalogResolution;
  readonly url: string;
  readonly scrollTop: number;
  readonly rowFocusTarget: string | null;
}

export interface CatalogHistoryTransition {
  readonly mode: HistoryMode;
  readonly snapshot: CatalogHistorySnapshot;
}

function snapshot(
  index: CatalogIndex,
  resolution: CatalogResolution,
  scrollTop: number,
  rowFocusTarget: string | null,
): CatalogHistorySnapshot {
  return Object.freeze({ resolution, url: serializeCatalogUrl(index, resolution), scrollTop, rowFocusTarget });
}

export function submitCatalogQuery(index: CatalogIndex, query: string): CatalogHistoryTransition {
  return Object.freeze({ mode: 'push', snapshot: snapshot(index, resolveCatalogQuery(index, query), 0, null) });
}

export function editCatalogFilters(
  index: CatalogIndex,
  current: CatalogHistorySnapshot,
  filters: readonly CatalogFilter[],
  familyId: string | null = current.resolution.familyId,
): CatalogHistoryTransition {
  const resolution = applyCatalogFilters(index, current.resolution, filters, {
    familyId,
  });
  const selectedStillVisible = resolution.selectedRecordId !== null;
  return Object.freeze({
    mode: 'replace',
    snapshot: snapshot(
      index,
      resolution,
      current.scrollTop,
      selectedStillVisible ? resolution.selectedRecordId : current.rowFocusTarget,
    ),
  });
}

export function activateCatalogRecord(
  index: CatalogIndex,
  current: CatalogHistorySnapshot,
  configurationId: string,
): CatalogHistoryTransition {
  const resolution = selectCatalogRecord(index, current.resolution, configurationId);
  return Object.freeze({
    mode: 'push',
    snapshot: snapshot(index, resolution, current.scrollTop, configurationId),
  });
}

export function closeCatalogDetail(
  index: CatalogIndex,
  current: CatalogHistorySnapshot,
  hasPriorInAppCatalogEntry: boolean,
): CatalogHistoryTransition {
  const resolution = selectCatalogRecord(index, current.resolution, null);
  return Object.freeze({
    mode: hasPriorInAppCatalogEntry ? 'back' : 'replace',
    snapshot: snapshot(index, resolution, current.scrollTop, current.resolution.selectedRecordId),
  });
}
