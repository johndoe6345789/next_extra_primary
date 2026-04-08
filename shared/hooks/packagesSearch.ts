'use client'

/**
 * Package search and filter handlers
 */

import { useCallback, useRef } from 'react'
import type {
  PackageListState,
  PackageStatus,
} from '@/lib/types/package-admin-types'

type FetchFn = (
  p?: number,
  l?: number,
  s?: string,
  st?: PackageStatus,
  r?: boolean
) => Promise<void>

/**
 * Create debounced search handler
 * @param state - Current package list state
 * @param fetchInternal - Internal fetch function
 * @param debounceMs - Debounce delay in ms
 */
export function usePackageSearch(
  state: PackageListState,
  fetchInternal: FetchFn,
  debounceMs: number
) {
  const debounceRef =
    useRef<NodeJS.Timeout | null>(null)
  const searchQueueRef = useRef('')

  const searchPackages = useCallback(
    (term: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      searchQueueRef.current = term
      debounceRef.current = setTimeout(
        async () => {
          if (
            searchQueueRef.current === term
          ) {
            await fetchInternal(
              0,
              state.limit,
              term,
              state.statusFilter,
              false
            )
          }
        },
        debounceMs
      )
    },
    [state, fetchInternal, debounceMs]
  )

  const filterByStatus = useCallback(
    async (status: PackageStatus) => {
      await fetchInternal(
        0,
        state.limit,
        state.search,
        status,
        false
      )
    },
    [state, fetchInternal]
  )

  return {
    searchPackages,
    filterByStatus,
    debounceRef,
  }
}
