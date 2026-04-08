'use client'

/**
 * Package list pagination handlers
 */

import { useCallback } from 'react'
import type {
  PackageListState,
  PackageStatus,
} from '@/lib/types/package-admin-types'

type FetchFn = (
  p?: number, l?: number,
  s?: string, st?: PackageStatus,
  r?: boolean
) => Promise<void>

/** Create pagination action handlers */
export function usePackagesPageHandlers(
  state: PackageListState,
  fetchInternal: FetchFn
) {
  const changePage = useCallback(
    async (page: number) => {
      const max = Math.ceil(
        state.total / state.limit
      )
      if (page >= 0 && page < max) {
        await fetchInternal(
          page, state.limit, state.search,
          state.statusFilter, false
        )
      }
    },
    [state, fetchInternal]
  )

  const changeLimit = useCallback(
    async (limit: number) => {
      await fetchInternal(
        0, limit, state.search,
        state.statusFilter, false
      )
    },
    [state, fetchInternal]
  )

  return { changePage, changeLimit }
}
