/**
 * useSearchPageState — read/write q, type, page from
 * the URL searchParams of the /search page.
 *
 * @module hooks/useSearchPageState
 */
'use client';

import { useCallback } from 'react';
import {
  useRouter, usePathname,
} from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';

const PAGE_SIZE = 20;

/** Search-page URL state. */
export interface SearchPageState {
  q: string;
  tab: string;
  page: number;
  pageSize: number;
  setTab: (tab: string) => void;
  setPage: (page: number) => void;
}

/** Manage URL state for the search page. */
export function useSearchPageState(): SearchPageState {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const q = params.get('q') ?? '';
  const tab = params.get('type') ?? 'all';
  const page = Math.max(
    1, Number(params.get('page') ?? '1') || 1,
  );

  const replace = useCallback(
    (next: URLSearchParams) => {
      router.replace(`${pathname}?${next.toString()}`);
    },
    [router, pathname],
  );

  const setTab = useCallback((nextTab: string) => {
    const next = new URLSearchParams(params.toString());
    if (nextTab === 'all') next.delete('type');
    else next.set('type', nextTab);
    next.delete('page');
    replace(next);
  }, [params, replace]);

  const setPage = useCallback((nextPage: number) => {
    const next = new URLSearchParams(params.toString());
    if (nextPage <= 1) next.delete('page');
    else next.set('page', String(nextPage));
    replace(next);
  }, [params, replace]);

  return {
    q, tab, page, pageSize: PAGE_SIZE, setTab, setPage,
  };
}

export default useSearchPageState;
