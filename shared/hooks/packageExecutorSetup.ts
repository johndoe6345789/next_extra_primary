'use client'

/**
 * Package executor abort and state setup
 */

import type {
  PackageActionsState,
} from '@/lib/types/package-admin-types'

type SetState = React.Dispatch<
  React.SetStateAction<PackageActionsState>
>

/**
 * Prepare abort controller and set loading state
 * @param packageId - Target package ID
 * @param abortCtrls - Abort controller map
 * @param setState - State setter
 * @returns New abort controller
 */
export function prepareExecution(
  packageId: string,
  abortCtrls: Map<string, AbortController>,
  setState: SetState
): AbortController {
  const prev = abortCtrls.get(packageId)
  if (prev) prev.abort()
  const ctrl = new AbortController()
  abortCtrls.set(packageId, ctrl)
  setState((s) => ({
    ...s,
    isLoading: true,
    operationInProgress: new Set([
      ...s.operationInProgress,
      packageId,
    ]),
    error: null,
  }))
  return ctrl
}
