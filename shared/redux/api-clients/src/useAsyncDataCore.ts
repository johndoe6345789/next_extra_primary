/**
 * useAsyncData - Core async data fetching hook
 *
 * Delegates to Redux-backed @shared/hooks-async.
 * Maintains backward compatibility.
 */

import { useState } from 'react'
import {
  useReduxAsyncData as useReduxImpl,
} from '@shared/hooks-async'
import type {
  UseAsyncDataOptions,
  UseAsyncDataResult,
} from './asyncDataTypes'

/**
 * Manage async data fetching with
 * loading states, retries, and refetching.
 *
 * @template T The type of data being fetched
 * @param fetchFn - Async function to fetch data
 * @param options - Configuration options
 * @returns Data, loading, error, and retry state
 */
export function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  options: UseAsyncDataOptions<T> = {}
): UseAsyncDataResult<T> {
  const {
    dependencies = [],
    onSuccess,
    onError,
    retries = 0,
    retryDelay = 1000,
    refetchOnFocus = true,
    refetchInterval = null,
    initialData,
  } = options

  const [localData, setLocalData] =
    useState<T | undefined>(initialData)

  const reduxResult = useReduxImpl<T>(fetchFn, {
    maxRetries: retries,
    retryDelay,
    refetchOnFocus,
    refetchInterval:
      refetchInterval ?? undefined,
    dependencies: Array.isArray(dependencies)
      ? [...dependencies]
      : [],
    onSuccess: (data) => {
      setLocalData(data as T)
      onSuccess?.(data as T)
    },
    onError: (error: string) => {
      onError?.(new Error(error))
    },
  })

  const data = reduxResult.data ?? localData

  return {
    data,
    isLoading: reduxResult.isLoading,
    error: reduxResult.error
      ? new Error(reduxResult.error)
      : null,
    isRefetching: reduxResult.isRefetching,
    retry: reduxResult.retry,
    refetch: reduxResult.refetch,
  }
}
