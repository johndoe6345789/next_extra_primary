'use client'

/**
 * Fetch logic for usePackages hook
 */

import { useCallback } from 'react'
import type {
  PackageInfo,
  PackageListState,
  PackageError,
  PackageStatus,
} from '@/lib/types/package-admin-types'
import { fetchPackageData } from './packagesFetchRequest'
import {
  handleFetchResult,
  handleFetchError,
} from './packagesFetchResponse'

/** Create the core fetchPackages function */
export function usePackagesFetch(
  baseUrl: string,
  state: PackageListState,
  setState: React.Dispatch<
    React.SetStateAction<PackageListState>
  >,
  abortRef: React.MutableRefObject<
    AbortController | null
  >,
  onSuccess?: (data: PackageInfo[]) => void,
  onError?: (error: PackageError) => void
) {
  return useCallback(
    async (
      page = state.page,
      limit = state.limit,
      search = state.search,
      status: PackageStatus = state.statusFilter,
      isRefetch = false
    ) => {
      try {
        if (abortRef.current) {
          abortRef.current.abort()
        }
        abortRef.current = new AbortController()
        setState((p) => ({
          ...p,
          isLoading: !isRefetch,
          isRefetching: isRefetch,
          error: null,
        }))
        const result = await fetchPackageData(
          baseUrl, page, limit,
          search, status,
          abortRef.current.signal
        )
        handleFetchResult(
          result, setState, onSuccess, onError
        )
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === 'AbortError'
        ) {
          return
        }
        handleFetchError(err, setState, onError)
      } finally {
        setState((p) => ({
          ...p,
          isLoading: false,
          isRefetching: false,
        }))
      }
    },
    [
      state.page, state.limit,
      state.search, state.statusFilter,
      onSuccess, onError,
      baseUrl, abortRef, setState,
    ]
  )
}
