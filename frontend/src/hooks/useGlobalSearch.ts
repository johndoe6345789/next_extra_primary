/**
 * useGlobalSearch — owns the navbar search state.
 *
 * Composes useSuggestFetch (debounced /search/suggest
 * call with abort-on-keystroke) with locale-aware
 * navigation to the full results page.
 *
 * @module hooks/useGlobalSearch
 */
'use client';

import { useCallback, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useSuggestFetch } from './useSuggestFetch';
import type { SearchSuggestItem } from '@/types/search';

/** Result of useGlobalSearch. */
export interface UseGlobalSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  suggest: SearchSuggestItem[];
  isLoading: boolean;
  submit: (override?: string) => void;
  clear: () => void;
}

/**
 * Owns the navbar search state.
 *
 * @returns Query state + suggestions + submit action.
 */
export function useGlobalSearch(): UseGlobalSearchReturn {
  const [query, setQuery] = useState('');
  const { suggest, isLoading, reset } =
    useSuggestFetch(query);
  const locale = useLocale();
  const router = useRouter();

  const submit = useCallback((override?: string) => {
    const term = (override ?? query).trim();
    if (!term) return;
    router.push(
      `/search?q=${encodeURIComponent(term)}`,
      { locale },
    );
    reset();
  }, [query, router, locale, reset]);

  const clear = useCallback(() => {
    setQuery('');
    reset();
  }, [reset]);

  return {
    query, setQuery, suggest, isLoading, submit, clear,
  };
}

export default useGlobalSearch;
