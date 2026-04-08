'use client'

/**
 * useAsyncData Hook - Manage async data fetching
 */

import { useState, useCallback, useRef } from 'react'
export type { UseAsyncDataOptions, UseAsyncDataResult, UsePaginatedDataOptions, UsePaginatedDataResult, UseMutationOptions, UseMutationResult } from './asyncDataTypes'
import type { UseAsyncDataOptions, UseAsyncDataResult } from './asyncDataTypes'
export { usePaginatedData, useMutation } from './asyncDataPaginated'
import { useAsyncDataEffects } from './asyncDataEffects'

/** useAsyncData Hook Implementation */
export function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  options: UseAsyncDataOptions<T> = {}
): UseAsyncDataResult<T> {
  const {
    dependencies = [], onSuccess, onError,
    retries = 0, retryDelay = 1000,
    refetchOnFocus = true,
    refetchInterval = null, initialData,
  } = options

  const [data, setData] =
    useState<T | undefined>(initialData)
  const [isLoading, setIsLoading] =
    useState(false)
  const [isRefetching, setIsRefetching] =
    useState(false)
  const [error, setError] =
    useState<Error | null>(null)
  const retryCountRef = useRef(0)
  const abortRef =
    useRef<AbortController | null>(null)

  const fetchData = useCallback(
    async (isRetry = false) => {
      try {
        if (abortRef.current) {
          abortRef.current.abort()
        }
        abortRef.current = new AbortController()
        if (isRetry) setIsRefetching(true)
        else setIsLoading(true)
        setError(null)
        const result = await fetchFn()
        setData(result)
        retryCountRef.current = 0
        onSuccess?.(result)
      } catch (err) {
        const e = err instanceof Error
          ? err
          : new Error(String(err))
        if (e.name === 'AbortError') return
        setError(e)
        if (retryCountRef.current < retries) {
          retryCountRef.current += 1
          await new Promise((r) =>
            setTimeout(r, retryDelay)
          )
          await fetchData(isRetry)
        } else {
          onError?.(e)
        }
      } finally {
        setIsLoading(false)
        setIsRefetching(false)
      }
    },
    [fetchFn, retries, retryDelay, onSuccess, onError]
  )

  useAsyncDataEffects(
    fetchData, dependencies,
    refetchInterval, refetchOnFocus, abortRef
  )

  return {
    data, isLoading, error, isRefetching,
    retry: () => fetchData(true),
    refetch: () => fetchData(true),
  }
}
