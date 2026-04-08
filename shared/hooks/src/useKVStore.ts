'use client'

/**
 * useKVStore Hook
 * Key-value store via C++ DBAL REST API
 */

import { useState, useCallback } from 'react'
import type { DBALClientConfig } from './types'
import type { UseKVStoreReturn } from './kvStoreTypes'
import { createKVBasicOps } from './kvStoreBasic'
import { createKVListOps } from './kvStoreList'
import { createKVBatchOps } from './kvStoreBatch'

export type { UseKVStoreReturn } from './kvStoreTypes'

/**
 * Hook for key-value store operations
 * @param config - DBAL client config
 */
export function useKVStore(
  config: DBALClientConfig = {}
): UseKVStoreReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] =
    useState<Error | null>(null)

  const withState = useCallback(
    async <R,>(
      fn: () => Promise<R>
    ): Promise<R> => {
      setError(null)
      setLoading(true)
      try {
        return await fn()
      } catch (err) {
        const e =
          err instanceof Error
            ? err
            : new Error(String(err))
        if (e.name !== 'AbortError') {
          setError(e)
        }
        throw e
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const basic = createKVBasicOps(
    config,
    withState
  )
  const listOps = createKVListOps(
    config,
    withState
  )
  const batch = createKVBatchOps(
    config,
    withState
  )

  const clearError = useCallback(
    () => setError(null),
    []
  )

  return {
    loading,
    error,
    ...basic,
    ...listOps,
    ...batch,
    clearError,
  }
}
