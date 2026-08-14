import { useCallback, useEffect, useRef, useState } from 'react';
import { catalogResultToPart, getCatalogSearchConfig, searchCatalog, type CatalogSearchFilters } from '../lib/catalogApi';
import { parseCustomPart, resolvePartIdentity, SEARCH_UNAVAILABLE_COPY, type Part } from '../lib/decoder';

export type CatalogSearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

export function useCatalogSearch(debounceMs = 250) {
  const [status, setStatus] = useState<CatalogSearchStatus>('idle');
  const [results, setResults] = useState<Part[]>([]);
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sequenceRef = useRef(0);

  const clear = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    abortRef.current?.abort();
    setStatus('idle');
    setResults([]);
    setMessage('');
  }, []);

  const runSearch = useCallback((query: string, filters: CatalogSearchFilters = {}) => {
    const normalized = query.trim();
    sequenceRef.current += 1;
    const sequence = sequenceRef.current;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    abortRef.current?.abort();

    if (!normalized) {
      clear();
      return;
    }

    setStatus('loading');
    setMessage('');

    timeoutRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const apiResults = await searchCatalog(normalized, filters, { signal: controller.signal });
        if (sequence !== sequenceRef.current) return;
        const mapped = apiResults.map(catalogResultToPart).slice(0, 25);
        if (mapped.length > 0) {
          setResults(mapped);
          setStatus('success');
          return;
        }

        if (!getCatalogSearchConfig().configured) {
          setResults([]);
          setStatus('error');
          setMessage(SEARCH_UNAVAILABLE_COPY);
          return;
        }

        setResults([]);
        setStatus('empty');
      } catch (error) {
        if (controller.signal.aborted || sequence !== sequenceRef.current) return;
        if (!getCatalogSearchConfig().configured) {
          setResults([]);
          setStatus('error');
          setMessage(SEARCH_UNAVAILABLE_COPY);
          return;
        }
        setResults([]);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Catalog search unavailable');
      }
    }, debounceMs);
  }, [clear, debounceMs]);

  const resolveSearchTarget = useCallback((query: string, selected?: Part) => {
    if (selected) return selected.partNumber;
    const normalized = query.trim();
    const exactApiResult = results.find(part => part.partNumber.toUpperCase() === normalized.toUpperCase());
    if (exactApiResult) return exactApiResult.partNumber;
    const fallback = resolvePartIdentity(normalized);
    if (fallback.state === 'configuration-match') return fallback.part.partNumber;
    if (fallback.state === 'unsupported-input') return normalized;
    return parseCustomPart(normalized).partNumber;
  }, [results]);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    abortRef.current?.abort();
  }, []);

  return { status, results, message, runSearch, clear, resolveSearchTarget };
}
