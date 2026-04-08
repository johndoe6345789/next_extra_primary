/**
 * Async Run Logic
 * Core execution logic for useAsyncOperation
 */

import { useCallback } from 'react'
import { checkCache } from './asyncCache'
import { executeWithRetry } from './asyncRetry'
import type { RunFnDeps } from './asyncRunDeps'

export type { RunFnDeps } from './asyncRunDeps'

/**
 * Create the run function for async op
 * @param deps - Dependencies for execution
 * @returns Memoized run callback
 */
export function useRunFn<T>(
  deps: RunFnDeps<T>
) {
  return useCallback(
    async (
      bypass = false
    ): Promise<T | null> => {
      const cached = checkCache<T>(
        deps.cacheKey,
        bypass
      )
      if (cached !== undefined) {
        deps.setData(cached)
        deps.setError(null)
        deps.upd('succeeded')
        return cached
      }
      if (deps.loading) return deps.data
      deps.upd('pending')
      deps.attRef.current = 0
      deps.abortRef.current =
        new AbortController()
      try {
        const r = await executeWithRetry(
          deps.operation,
          0,
          deps.retryCount,
          deps.retryDelay,
          deps.retryBackoff,
          deps.cacheKey,
          deps.cacheTTL,
          deps.setData,
          deps.setError,
          deps.onSuccess,
          deps.onError
        )
        deps.upd('succeeded')
        return r
      } catch {
        deps.upd('failed')
        return null
      }
    },
    [
      deps.operation,
      deps.retryCount,
      deps.retryDelay,
      deps.retryBackoff,
      deps.cacheKey,
      deps.cacheTTL,
      deps.onSuccess,
      deps.onError,
      deps.upd,
      deps.loading,
      deps.data,
    ]
  )
}
