/**
 * Base Async Data Types
 * Core types for useAsyncData and useMutation
 */

import type React from 'react'

/** @brief Options for useAsyncData hook */
export interface UseAsyncDataOptions<T> {
  /** Dependencies - refetch when changed */
  dependencies?: React.DependencyList
  /** Callback on success */
  onSuccess?: (data: T) => void
  /** Callback on error */
  onError?: (error: Error) => void
  /** Retry count @default 0 */
  retries?: number
  /** Retry delay ms @default 1000 */
  retryDelay?: number
  /** Refetch on window focus @default true */
  refetchOnFocus?: boolean
  /** Auto refetch interval ms @default null */
  refetchInterval?: number | null
  /** Initial data before first fetch */
  initialData?: T
}

/** @brief Result of useAsyncData hook */
export interface UseAsyncDataResult<T> {
  data: T | undefined
  isLoading: boolean
  error: Error | null
  isRefetching: boolean
  retry: () => Promise<void>
  refetch: () => Promise<void>
}

/** @brief Options for useMutation hook */
export interface UseMutationOptions<T, R> {
  onSuccess?: (data: R) => void
  onError?: (error: Error) => void
}

/** @brief Result of useMutation hook */
export interface UseMutationResult<T, R> {
  mutate: (data: T) => Promise<R>
  isLoading: boolean
  error: Error | null
  reset: () => void
}
