'use client'

/**
 * Package action executor
 */

import { useCallback, useRef } from 'react'
import type {
  PackageInfo,
  PackageActionsState,
  PackageError,
} from '@/lib/types/package-admin-types'
import {
  handleExecutorError,
} from './packageActionsError'
import {
  runPackageOp,
  type OpType,
  type SetState,
} from './packageExecutorCore'
import { prepareExecution } from './packageExecutorSetup'

/** Create the executeOperation function */
export function usePackageExecutor(
  state: PackageActionsState,
  setState: SetState,
  onSuccess?: (
    pkg: PackageInfo, op: OpType
  ) => void,
  onError?: (
    error: PackageError, packageId: string
  ) => void
) {
  const abortCtrls = useRef<
    Map<string, AbortController>
  >(new Map())

  return useCallback(
    async <T extends Record<string, unknown>>(
      opName: string,
      packageId: string,
      fetchFn: (
        signal: AbortSignal
      ) => Promise<Response>,
      onSuccessFn?: (data: T) => void
    ): Promise<T> => {
      if (
        state.operationInProgress.has(packageId)
      ) {
        throw new Error(
          'Operation already in progress'
        )
      }
      try {
        const ctrl = prepareExecution(
          packageId,
          abortCtrls.current,
          setState
        )
        return await runPackageOp<T>(
          opName, packageId, fetchFn, ctrl,
          setState, onSuccess, onError,
          onSuccessFn
        )
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === 'AbortError'
        ) {
          return {} as T
        }
        return handleExecutorError(
          err, packageId, setState, onError
        )
      } finally {
        setState((s) => ({
          ...s, isLoading: false,
        }))
      }
    },
    [
      state.operationInProgress,
      onSuccess, onError, setState,
    ]
  )
}
