/**
 * Table Pagination Helpers
 * Pagination computation for useTableState
 */

import { useMemo, useCallback } from 'react'

/**
 * Compute paginated items and navigation
 * @param sorted - Sorted/filtered items
 * @param page - Current page (1-based)
 * @param pageSize - Items per page
 * @param setPage - Page setter
 * @returns Paginated items and nav helpers
 */
export function useTablePagination<T>(
  sorted: T[],
  page: number,
  pageSize: number,
  setPage: React.Dispatch<
    React.SetStateAction<number>
  >
) {
  const totalPages = Math.ceil(
    sorted.length / pageSize
  )

  /** @brief Current page items */
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return sorted.slice(
      start,
      start + pageSize
    )
  }, [sorted, page, pageSize])

  /** @brief Go to next page */
  const nextPage = useCallback(
    () =>
      setPage((p) =>
        Math.min(p + 1, totalPages)
      ),
    [totalPages]
  )

  /** @brief Go to previous page */
  const prevPage = useCallback(
    () => setPage((p) => Math.max(p - 1, 1)),
    []
  )

  return {
    paginated,
    totalPages,
    nextPage,
    prevPage,
  }
}
