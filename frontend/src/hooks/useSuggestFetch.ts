/**
 * useSuggestFetch — debounced fetch for the search
 * suggest endpoint with abort-on-keystroke behaviour.
 *
 * Extracted from useGlobalSearch to keep both hook
 * files under the 100-LOC cap.
 *
 * @module hooks/useSuggestFetch
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import type {
  SearchSuggestItem, SuggestResponse,
} from '@/types/search';

const DEBOUNCE_MS = 300;
const SUGGEST_LIMIT = 5;
const SUGGEST_URL = '/api/search/suggest';

/** Result shape. */
export interface SuggestFetchState {
  suggest: SearchSuggestItem[];
  isLoading: boolean;
  abort: () => void;
  reset: () => void;
}

/**
 * Debounced suggest fetch keyed on `query`.
 *
 * @param query - Current search text.
 * @returns Latest suggestions and loading state.
 */
export function useSuggestFetch(
  query: string,
): SuggestFetchState {
  const [suggest, setSuggest] =
    useState<SearchSuggestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setSuggest([]);
      setIsLoading(false);
      return;
    }
    const handle = setTimeout(() => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setIsLoading(true);
      const url =
        `${SUGGEST_URL}?q=${encodeURIComponent(term)}`
        + `&limit=${SUGGEST_LIMIT}`;
      fetch(url, { signal: ctrl.signal })
        .then((r) => (r.ok
          ? r.json() as Promise<SuggestResponse>
          : Promise.resolve({ items: [] })))
        .then((data) => {
          setSuggest(data.items ?? []);
          setIsLoading(false);
        })
        .catch((err: unknown) => {
          if ((err as { name?: string })?.name
            === 'AbortError') return;
          setSuggest([]);
          setIsLoading(false);
        });
    }, DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [query]);

  return {
    suggest,
    isLoading,
    abort: () => abortRef.current?.abort(),
    reset: () => {
      abortRef.current?.abort();
      setSuggest([]);
      setIsLoading(false);
    },
  };
}

export default useSuggestFetch;
