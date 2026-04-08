'use client'

/**
 * Error handling for package action executor
 */

import type {
  PackageActionsState,
  PackageError,
} from '@/lib/types/package-admin-types'
import { PackageErrorCode } from '@/lib/types/package-admin-types'

/**
 * Handle executor error and update state
 * @param err - Caught error
 * @param packageId - The package being operated
 * @param setState - State setter
 * @param onError - Optional error callback
 */
export function handleExecutorError(
  err: unknown,
  packageId: string,
  setState: React.Dispatch<
    React.SetStateAction<PackageActionsState>
  >,
  onError?: (
    error: PackageError,
    packageId: string
  ) => void
): never {
  if (
    err instanceof Error &&
    err.name === 'AbortError'
  ) {
    throw err
  }
  const e =
    err instanceof Error
      ? (err as PackageError)
      : new Error(String(err))
  if (!(e as PackageError).code) {
    (e as PackageError).code =
      PackageErrorCode.NETWORK_ERROR
    ;(e as PackageError).name = 'PackageError'
  }
  setState((s) => ({
    ...s,
    error: e as PackageError,
    operationInProgress: new Set(
      [...s.operationInProgress].filter(
        (id) => id !== packageId
      )
    ),
  }))
  onError?.(e as PackageError, packageId)
  throw e
}

/**
 * Remove package from in-progress set
 * @param packageId - ID to remove
 * @param setState - State setter
 */
export function clearInProgress(
  packageId: string,
  setState: React.Dispatch<
    React.SetStateAction<PackageActionsState>
  >
) {
  setState((s) => ({
    ...s,
    operationInProgress: new Set(
      [...s.operationInProgress].filter(
        (id) => id !== packageId
      )
    ),
  }))
}
