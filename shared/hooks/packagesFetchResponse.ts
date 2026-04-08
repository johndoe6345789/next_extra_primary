'use client'

/**
 * Package fetch response handling
 */

import type {
  PackageInfo,
  PackageListState,
  PackageError,
} from '@/lib/types/package-admin-types'
import { wrapNetworkError } from './packagesFetchRequest'

type SetState = React.Dispatch<
  React.SetStateAction<PackageListState>
>

interface FetchResult {
  data?: {
    items: PackageInfo[]
    total: number
    page: number
    limit: number
  }
  error?: PackageError
}

/**
 * Handle successful fetch response
 * @param result - Parsed fetch result
 * @param setState - State setter
 * @param onSuccess - Success callback
 * @param onError - Error callback
 */
export function handleFetchResult(
  result: FetchResult,
  setState: SetState,
  onSuccess?: (data: PackageInfo[]) => void,
  onError?: (error: PackageError) => void
) {
  if (result.error) {
    setState((p) => ({
      ...p,
      error: result.error!,
    }))
    onError?.(result.error)
    return
  }

  if (result.data) {
    setState((p) => ({
      ...p,
      packages: result.data!.items,
      total: result.data!.total,
      page: result.data!.page,
      limit: result.data!.limit,
      error: null,
    }))
    onSuccess?.(result.data.items)
  }
}

/**
 * Handle fetch error (non-abort)
 * @param err - Caught error
 * @param setState - State setter
 * @param onError - Error callback
 */
export function handleFetchError(
  err: unknown,
  setState: SetState,
  onError?: (error: PackageError) => void
) {
  const pkgError = wrapNetworkError(err)
  setState((p) => ({
    ...p,
    error: pkgError,
  }))
  onError?.(pkgError)
}
