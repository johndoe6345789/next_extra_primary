/**
 * Paginated variant of useReduxAsyncData
 */

import { useCallback, useRef } from 'react';
import { useReduxAsyncData } from
  './useReduxAsyncData';
import type {
  UsePaginatedOptions, UsePaginatedResult,
} from './paginatedDataTypes';

export type {
  UsePaginatedOptions, UsePaginatedResult,
} from './paginatedDataTypes';

/** Paginated async data hook */
export function useReduxPaginatedAsyncData<
  T = unknown
>(
  fetchFn: (
    page: number, pageSize: number
  ) => Promise<T[]>,
  options?: UsePaginatedOptions
): UsePaginatedResult<T> {
  const pageSize = options?.pageSize ?? 20;
  const initial = options?.initialPage ?? 1;
  const pageRef = useRef(initial);
  const allRef = useRef<T[]>([]);

  const {
    data, isLoading, error,
    isRefetching, refetch,
  } = useReduxAsyncData(
    () => fetchFn(pageRef.current, pageSize), {
      ...options,
      onSuccess: (pageData) => {
        if (Array.isArray(pageData)) {
          const start =
            (pageRef.current - 1) * pageSize;
          allRef.current = [
            ...allRef.current.slice(0, start),
            ...pageData,
          ];
        }
        options?.onSuccess?.(pageData);
      },
    }
  );

  const nextPage = useCallback(() => {
    pageRef.current += 1;
    void refetch();
  }, [refetch]);

  const prevPage = useCallback(() => {
    if (pageRef.current > 1) {
      pageRef.current -= 1;
      void refetch();
    }
  }, [refetch]);

  const goToPage = useCallback((p: number) => {
    pageRef.current = Math.max(1, p);
    void refetch();
  }, [refetch]);

  return {
    data: data || [],
    isLoading, error, isRefetching,
    retry: () => refetch(),
    refetch,
    currentPage: pageRef.current,
    nextPage, prevPage, goToPage,
  };
}
