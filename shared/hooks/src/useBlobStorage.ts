'use client'

/**
 * useBlobStorage Hook
 * Blob storage via C++ DBAL REST API
 */

import { useState, useCallback } from 'react'
import type { DBALClientConfig } from './types'
import type {
  UseBlobStorageReturn,
} from './blobStorageTypes'
import { createBlobCoreOps } from './blobStorageCore'
import {
  createBlobQueryOps,
} from './blobStorageQuery'

export type {
  UseBlobStorageReturn,
} from './blobStorageTypes'

/**
 * Hook for blob storage operations
 * @param config - DBAL client config
 */
export function useBlobStorage(
  config: DBALClientConfig = {}
): UseBlobStorageReturn {
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

  const core = createBlobCoreOps(
    config,
    withState
  )
  const query = createBlobQueryOps(
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
    ...core,
    ...query,
    clearError,
  }
}
