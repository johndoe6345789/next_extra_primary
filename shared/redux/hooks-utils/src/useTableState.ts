/**
 * useTableState Hook
 * Table state with filter, sort, pagination
 */

import { useMemo, useState } from 'react'
import type {
  Filter, SortConfig,
  UseTableStateOptions,
  UseTableStateReturn,
} from './tableTypes'
import { applyFiltersAndSearch } from './tableFilters'
import { applySorting } from './tableSort'
import { useTableHandlers } from './tableHandlers'
import { useTablePagination } from './tablePagination'

/** @brief Table state hook */
export function useTableState<
  T extends Record<string, unknown>
>(
  items: T[],
  options: UseTableStateOptions<T> = {}
): UseTableStateReturn<T> {
  const {
    searchFields = Object.keys(
      items[0] || {}
    ) as (keyof T)[],
    pageSize: initSize = 10,
  } = options

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initSize)
  const [sortCfg, setSortCfg] = useState<SortConfig<T> | null>(options.defaultSort || null)
  const [filters, setFilters] = useState<Filter<T>[]>(options.defaultFilters || [])
  const [search, setSearch] = useState(options.defaultSearch || '')

  const filtered = useMemo(() =>
    applyFiltersAndSearch(items, filters, search, searchFields),
    [items, filters, search, searchFields])

  const sorted = useMemo(() =>
    applySorting(filtered, sortCfg),
    [filtered, sortCfg])

  const h = useTableHandlers(
    setPage, setPageSize, setSortCfg,
    setFilters, setSearch,
    Math.ceil(sorted.length / pageSize),
    options
  )

  const pg = useTablePagination(sorted, page, pageSize, setPage)

  return {
    items, filteredItems: filtered,
    paginatedItems: pg.paginated,
    totalItems: sorted.length,
    totalPages: pg.totalPages,
    currentPage: page, pageSize,
    setPage: h.handleSetPage,
    setPageSize: h.handlePageSize,
    nextPage: pg.nextPage,
    prevPage: pg.prevPage,
    goToFirstPage: () => setPage(1),
    goToLastPage: () => setPage(pg.totalPages),
    sortConfig: sortCfg,
    sort: h.sort,
    clearSort: () => setSortCfg(null),
    filters,
    addFilter: h.addFilter,
    removeFilter: h.removeFilter,
    updateFilter: h.updateFilter,
    clearFilters: h.clearFilters,
    search,
    setSearch: h.handleSearch,
    clearSearch: h.clearSearch,
    reset: h.reset,
    hasActiveFilters: filters.length > 0,
    hasSearch: search.length > 0,
  }
}
