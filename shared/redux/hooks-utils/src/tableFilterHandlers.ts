/**
 * Table filter and search action handlers
 */

import { useCallback } from 'react';
import type { Filter } from './tableTypes';

/** Create filter action handlers */
export function useFilterActions<
  T extends Record<string, unknown>
>(
  setFilters: (
    fn: (prev: Filter<T>[]) => Filter<T>[]
  ) => void,
  setSearch: (q: string) => void,
  setPage: (p: number) => void
) {
  const addFilter = useCallback((
    f: Filter<T>
  ) => {
    setFilters((prev) => [...prev, f]);
    setPage(1);
  }, [setFilters, setPage]);

  const removeFilter = useCallback(
    (i: number) => {
      setFilters((prev) =>
        prev.filter((_, idx) => idx !== i));
      setPage(1);
    }, [setFilters, setPage]);

  const updateFilter = useCallback((
    i: number, f: Filter<T>
  ) => {
    setFilters((prev) => {
      const u = [...prev]; u[i] = f; return u;
    });
    setPage(1);
  }, [setFilters, setPage]);

  const clearFilters = useCallback(() => {
    setFilters(() => []); setPage(1);
  }, [setFilters, setPage]);

  const handleSearch = useCallback(
    (q: string) => {
      setSearch(q); setPage(1);
    }, [setSearch, setPage]);

  const clearSearch = useCallback(() => {
    setSearch(''); setPage(1);
  }, [setSearch, setPage]);

  return {
    addFilter, removeFilter,
    updateFilter, clearFilters,
    handleSearch, clearSearch,
  };
}
