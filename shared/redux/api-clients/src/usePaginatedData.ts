/**
 * usePaginatedData - Paginated data fetching
 *
 * Delegates to Redux-backed @shared/hooks-async.
 */

import { useState } from 'react'
import {
  useReduxPaginatedAsyncData as useImpl,
} from '@shared/hooks-async'
import type {
  UsePaginatedDataOptions,
  UsePaginatedDataResult,
} from './paginatedTypes'
import {
  buildGoToPage, buildNextPage,
  buildPreviousPage,
} from './paginatedNavigation'
import { buildReduxPagOpts } from './paginatedReduxOpts'

/**
 * Hook for paginated API calls.
 * @template T Item type
 * @param fetchFn - Fetches items and total
 * @param options - Configuration options
 * @returns Paginated data with navigation
 */
export function usePaginatedData<T>(
  fetchFn: (
    page: number,
    pageSize: number
  ) => Promise<{ items: T[]; total: number }>,
  options: UsePaginatedDataOptions<T> = {}
): UsePaginatedDataResult<T> {
  const {
    pageSize = 10,
    initialPage = 0,
    ...asyncOpts
  } = options

  const [page, setPage] = useState(initialPage)
  const [itemCount, setItemCount] = useState(0)

  const result = useImpl<T>(
    (rPage: number, rSize: number) =>
      fetchFn(rPage - 1, rSize).then((r) => {
        setItemCount(r.total)
        return r.items
      }),
    buildReduxPagOpts(page, pageSize, asyncOpts)
  )

  const pageCount = Math.ceil(
    itemCount / pageSize
  )

  return {
    data: result.data || [],
    isLoading: result.isLoading,
    error: result.error
      ? new Error(result.error)
      : null,
    isRefetching: result.isRefetching,
    retry: result.retry,
    refetch: result.refetch,
    page,
    pageCount,
    itemCount,
    goToPage: buildGoToPage(
      setPage, result, pageCount
    ),
    nextPage: buildNextPage(
      page, setPage, result, pageCount
    ),
    previousPage: buildPreviousPage(
      page, setPage, result
    ),
  }
}
