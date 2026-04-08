'use client'

/**
 * useMutation hook for write operations
 */

import { useCallback, useState } from 'react'
import type {
  UseMutationOptions,
  UseMutationResult,
} from './asyncDataTypes'

/**
 * useMutation Hook for write operations
 */
export function useMutation<T, R>(
  mutationFn: (data: T) => Promise<R>,
  options: UseMutationOptions<T, R> = {}
): UseMutationResult<T, R> {
  const { onSuccess, onError } = options
  const [isLoading, setIsLoading] =
    useState(false)
  const [error, setError] =
    useState<Error | null>(null)

  const mutate = useCallback(
    async (data: T) => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await mutationFn(data)
        onSuccess?.(result)
        return result
      } catch (err) {
        const e =
          err instanceof Error
            ? err
            : new Error(String(err))
        setError(e)
        onError?.(e)
        throw e
      } finally {
        setIsLoading(false)
      }
    },
    [mutationFn, onSuccess, onError]
  )

  return {
    mutate,
    isLoading,
    error,
    reset: () => setError(null),
  }
}
