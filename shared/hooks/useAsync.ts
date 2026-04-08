/**
 * useAsync Hook
 * Async function wrapper with state management
 */

import {
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import type {
  UseAsyncOptions,
  UseAsyncReturn,
} from './asyncTypes'
import { useAsyncExecutor } from './asyncExecutor'

export type {
  UseAsyncOptions,
  UseAsyncReturn,
} from './asyncTypes'

/**
 * Hook for managing async execution
 * @param asyncFunction - Async fn to execute
 * @param deps - Deps for re-execution
 * @param options - Configuration options
 */
export function useAsync<T>(
  asyncFunction: (
    ...args: unknown[]
  ) => Promise<T>,
  deps: unknown[] = [],
  options: UseAsyncOptions = {}
): UseAsyncReturn<T> {
  const {
    immediate = false,
    resetErrorOnRetry = true,
    resetDataOnRetry = false,
  } = options

  const [data, setData] =
    useState<T | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] =
    useState<Error | undefined>(undefined)

  const setters = useMemo(
    () => ({ setData, setLoading, setError }),
    []
  )

  const { execute } = useAsyncExecutor(
    asyncFunction,
    { resetErrorOnRetry, resetDataOnRetry },
    setters
  )

  const reset = useCallback(() => {
    setData(undefined)
    setError(undefined)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (immediate) execute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return {
    data,
    loading,
    error,
    execute,
    reset,
  }
}
