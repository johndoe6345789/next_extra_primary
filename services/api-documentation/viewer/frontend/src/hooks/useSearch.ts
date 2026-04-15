/**
 * @file useSearch.ts
 * @brief Hook for filtering endpoint groups.
 */

import { useState, useMemo } from 'react';
import type { EndpointGroup } from './types';

/** @brief Return type for useSearch hook. */
interface UseSearchResult {
  query: string;
  setQuery: (q: string) => void;
  filtered: EndpointGroup[];
}

/**
 * @brief Filter groups by search query.
 * @param groups - All endpoint groups.
 * @returns Search state and filtered groups.
 */
export function useSearch(
  groups: EndpointGroup[],
): UseSearchResult {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return groups;
    const q = query.toLowerCase();

    return groups
      .map((g) => ({
        tag: g.tag,
        endpoints: g.endpoints.filter((ep) => {
          const path = ep.path.toLowerCase();
          const summary =
            ep.operation.summary?.toLowerCase()
            ?? '';
          return path.includes(q)
            || summary.includes(q)
            || ep.method.includes(q);
        }),
      }))
      .filter((g) => g.endpoints.length > 0);
  }, [groups, query]);

  return { query, setQuery, filtered };
}
