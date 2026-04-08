'use client'

/**
 * Handler callbacks for usePackages hook
 */

import { useCallback } from 'react'
import type {
  PackageListState,
  PackageStatus,
} from '@/lib/types/package-admin-types'
import { usePackageSearch } from './packagesSearch'
export { usePackagesPageHandlers } from './packagesPageHandlers'

interface HandlersParams {
  state: PackageListState
  fetchInternal: (
    p?: number, l?: number,
    s?: string, st?: PackageStatus,
    r?: boolean
  ) => Promise<void>
  debounceMs: number
}

/** Create package list action handlers */
export function usePackagesHandlers(
  params: HandlersParams
) {
  const { state, fetchInternal, debounceMs } =
    params

  const fetchPackages = useCallback(
    async (
      p?: number, l?: number,
      s?: string, st?: PackageStatus
    ) => {
      await fetchInternal(p, l, s, st, false)
    },
    [fetchInternal]
  )

  const refetchPackages = useCallback(
    async () => {
      await fetchInternal(
        state.page, state.limit,
        state.search, state.statusFilter, true
      )
    },
    [state, fetchInternal]
  )

  const {
    searchPackages, filterByStatus,
    debounceRef,
  } = usePackageSearch(
    state, fetchInternal, debounceMs
  )

  return {
    fetchPackages, refetchPackages,
    searchPackages, filterByStatus,
    debounceRef,
  }
}
