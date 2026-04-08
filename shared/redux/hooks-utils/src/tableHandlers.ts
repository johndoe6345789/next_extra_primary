/**
 * Table state action handlers
 */

import { useCallback } from 'react';
import type {
  SortConfig, UseTableStateOptions,
  Filter,
} from './tableTypes';
import { useFilterActions } from
  './tableFilterHandlers';

/** Create table action handlers */
export function useTableHandlers<
  T extends Record<string, unknown>
>(
  setPage: (p: number) => void,
  setPageSizeFn: (s: number) => void,
  setSortConfig: (
    fn: (
      prev: SortConfig<T> | null
    ) => SortConfig<T> | null
  ) => void,
  setFilters: (
    fn: (prev: Filter<T>[]) => Filter<T>[]
  ) => void,
  setSearch: (q: string) => void,
  totalPages: number,
  options: UseTableStateOptions<T>
) {
  const sort = useCallback((
    field: keyof T, dir?: 'asc' | 'desc'
  ) => {
    setSortConfig((prev) => {
      if (prev?.field === field && !dir)
        return { field, direction:
          prev.direction === 'asc'
            ? 'desc' : 'asc' };
      return { field, direction: dir || 'asc' };
    });
    setPage(1);
  }, [setSortConfig, setPage]);

  const {
    addFilter, removeFilter, updateFilter,
    clearFilters, handleSearch, clearSearch,
  } = useFilterActions<T>(
    setFilters, setSearch, setPage
  );

  const handleSetPage = useCallback(
    (p: number) => setPage(
      Math.max(1, Math.min(p, totalPages))
    ), [setPage, totalPages]);

  const handlePageSize = useCallback(
    (s: number) => {
      setPageSizeFn(Math.max(1, s)); setPage(1);
    }, [setPageSizeFn, setPage]);

  const reset = useCallback(() => {
    setPage(1);
    setPageSizeFn(options.pageSize ?? 10);
    setSortConfig(
      () => options.defaultSort || null
    );
    setFilters(
      () => options.defaultFilters || []
    );
    setSearch(options.defaultSearch || '');
  }, [options, setPage, setPageSizeFn,
    setSortConfig, setFilters, setSearch]);

  return {
    sort, addFilter, removeFilter,
    updateFilter, clearFilters,
    handleSearch, clearSearch,
    handleSetPage, handlePageSize, reset,
  };
}
