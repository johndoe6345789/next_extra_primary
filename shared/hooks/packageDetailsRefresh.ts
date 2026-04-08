'use client'

/**
 * Refresh logic for usePackageDetails hook
 */

import { useCallback } from 'react'
import type {
  PackageInfo,
  PackageDetailsState,
  PackageError,
} from '@/lib/types/package-admin-types'
import { PackageErrorCode } from '@/lib/types/package-admin-types'
import { parseApiError } from './packagesHelpers'

/** Create refreshDetails callback */
export function usePackageDetailsRefresh(
  setState: React.Dispatch<
    React.SetStateAction<PackageDetailsState>
  >,
  abortRef: React.MutableRefObject<AbortController | null>,
  selectedPackage: PackageInfo | null,
  onSuccess?: (pkg: PackageInfo) => void,
  onError?: (error: PackageError) => void
) {
  return useCallback(async () => {
    if (!selectedPackage) return
    try {
      if (abortRef.current) abortRef.current.abort()
      abortRef.current = new AbortController()
      setState((p) => ({ ...p, isLoading: true, error: null }))
      const res = await fetch(
        `/api/admin/packages/${selectedPackage.id}`,
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
  }, [selectedPackage, onSuccess, onError])
}
