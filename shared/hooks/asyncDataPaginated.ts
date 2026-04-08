'use client'

/**
 * usePaginatedData hook
 */

import { useState } from 'react'
import { useAsyncData } from './useAsyncData'
import type {
  UsePaginatedDataOptions,
  UsePaginatedDataResult,
} from './asyncDataTypes'

export { useMutation } from './asyncMutation'

/**
 * usePaginatedData Hook for paginated API calls
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
    ...asyncOptions
  } = options

  const [page, setPage] = useState(initialPage)
  const [itemCount, setItemCount] = useState(0)

  const asyncResult = useAsyncData(
    async () => {
      const result = await fetchFn(
        page,
        pageSize
      )
      setItemCount(result.total)
      return result.items
    },
    {
      ...asyncOptions,
      dependencies: [
        page,
        pageSize,
        ...(asyncOptions.dependencies ?? []),
      ],
    }
  )

  const pageCount = Math.ceil(
    itemCount / pageSize
  )

  return {
    ...asyncResult,
    page,
    pageCount,
    itemCount,
    goToPage: (p: number) => {
      if (p >= 0 && p < pageCount) setPage(p)
    },
    nextPage: () => {
      if (page < pageCount - 1) {
        setPage(page + 1)
      }
    },
    previousPage: () => {
      if (page > 0) setPage(page - 1)
    },
  }
}
