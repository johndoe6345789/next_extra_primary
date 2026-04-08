'use client'

/**
 * Open logic for usePackageDetails hook
 */

import { useCallback } from 'react'
import type {
  PackageInfo,
  PackageDetailsState,
  PackageError,
} from '@/lib/types/package-admin-types'
import { PackageErrorCode } from '@/lib/types/package-admin-types'
import { parseApiError } from './packagesHelpers'

export { usePackageDetailsRefresh } from './packageDetailsRefresh'

/** Create openDetails callback */
export function usePackageDetailsOpen(
  baseUrl: string,
  setState: React.Dispatch<
    React.SetStateAction<PackageDetailsState>
  >,
  abortRef: React.MutableRefObject<AbortController | null>,
  onSuccess?: (pkg: PackageInfo) => void,
  onError?: (error: PackageError) => void
) {
  return useCallback(
    async (packageId: string) => {
      try {
        if (abortRef.current) abortRef.current.abort()
        abortRef.current = new AbortController()
        setState((p) => ({
          ...p, isOpen: true, isLoading: true, error: null,
        }))
        const res = await fetch(
          `${baseUrl}/api/admin/packages/${packageId}`,
          { signal: abortRef.current.signal }
        )
        if (!res.ok) {
          const err = await parseApiError(res)
          setState((p) => ({ ...p, error: err, isLoading: false }))
          onError?.(err)
          return
        }
        const pkg = (await res.json()) as PackageInfo
        setState((p) => ({
          ...p, selectedPackage: pkg, isLoading: false, error: null,
        }))
        onSuccess?.(pkg)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        const e = err instanceof Error ? err : new Error(String(err))
        const pe = e as PackageError
        pe.code = PackageErrorCode.NETWORK_ERROR
        pe.name = 'PackageError'
        setState((p) => ({ ...p, error: pe, isLoading: false }))
        onError?.(pe)
      }
    },
    [baseUrl, onSuccess, onError]
  )
}
