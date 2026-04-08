/**
 * useAsyncOperation Hook
 * Async operation with retry and caching
 */

import {
  useCallback, useRef, useState, useEffect,
} from 'react'
import type {
  AsyncStatus,
  UseAsyncOperationOptions,
  UseAsyncOperationReturn,
} from './asyncTypes'
import { useRunFn } from './asyncRunLogic'

export type {
  AsyncStatus, AsyncError,
  UseAsyncOperationOptions,
  UseAsyncOperationReturn,
} from './asyncTypes'

/** @brief Async operation with retry hook */
export function useAsyncOperation<T>(
  operation: () => Promise<T>,
  opts: UseAsyncOperationOptions = {}
): UseAsyncOperationReturn<T> {
  const {
    retryCount = 0, retryDelay = 1000,
    retryBackoff = 2, cacheKey,
    cacheTTL = 0, onSuccess, onError,
    onStatusChange, autoExecute = false,
  } = opts
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<import('./asyncTypes').AsyncError | null>(null)
  const [status, setStatus] = useState<AsyncStatus>('idle')
  const [loading, setLoading] = useState(false)
  const attRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const autoRef = useRef(false)

  const upd = useCallback((s: AsyncStatus) => {
    setStatus(s); onStatusChange?.(s); setLoading(s === 'pending')
  }, [onStatusChange])

  const run = useRunFn<T>({
    operation, retryCount, retryDelay, retryBackoff,
    cacheKey, cacheTTL, onSuccess, onError,
    upd, loading, data,
    setData: setData as (d: T) => void,
    setError, attRef, abortRef,
  })

  useEffect(() => {
    if (autoExecute && !autoRef.current) { autoRef.current = true; run() }
  }, [autoExecute, run])

  const retry = useCallback(async () => { attRef.current = 0; return run() }, [run])
  const refetch = useCallback(async () => { attRef.current = 0; return run(true) }, [run])
  const reset = useCallback(() => {
    abortRef.current?.abort(); setData(null); setError(null); setStatus('idle'); setLoading(false)
  }, [])

  return {
    data, error, status, isLoading: loading,
    isIdle: status === 'idle', isSuccess: status === 'succeeded', isError: status === 'failed',
    execute: run, retry, refetch, reset,
  }
}
