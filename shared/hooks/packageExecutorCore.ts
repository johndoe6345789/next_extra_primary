'use client'

/**
 * Core execution logic for package operations
 */

import type {
  PackageInfo,
  PackageActionsState,
  PackageError,
} from '@/lib/types/package-admin-types'
import { parseApiError } from './packagesHelpers'
import {
  handleExecutorError,
  clearInProgress,
} from './packageActionsError'

export type OpType =
  | 'install'
  | 'uninstall'
  | 'enable'
  | 'disable'

export type SetState = React.Dispatch<
  React.SetStateAction<PackageActionsState>
>

/**
 * Run a package operation fetch and handle
 * success/error states.
 * @param opName - Operation name
 * @param packageId - Target package ID
 * @param fetchFn - Fetch function with signal
 * @param ctrl - Abort controller
 * @param setState - State setter
 * @param onSuccess - Success callback
 * @param onError - Error callback
 * @param onSuccessFn - Per-call success handler
 */
export async function runPackageOp<
  T extends Record<string, unknown>,
>(
  opName: string,
  packageId: string,
  fetchFn: (signal: AbortSignal) => Promise<Response>,
  ctrl: AbortController,
  setState: SetState,
  onSuccess?: (
    pkg: PackageInfo,
    op: OpType
  ) => void,
  onError?: (
    error: PackageError,
    packageId: string
  ) => void,
  onSuccessFn?: (data: T) => void
): Promise<T> {
  const res = await fetchFn(ctrl.signal)
  if (!res.ok) {
    const err = await parseApiError(res)
    clearInProgress(packageId, setState)
    setState((s) => ({ ...s, error: err }))
    onError?.(err, packageId)
    throw err
  }

  const data = (await res.json()) as T
  clearInProgress(packageId, setState)
  setState((s) => ({ ...s, error: null }))
  onSuccessFn?.(data)
  onSuccess?.(
    data as unknown as PackageInfo,
    opName as OpType
  )
  return data
}
