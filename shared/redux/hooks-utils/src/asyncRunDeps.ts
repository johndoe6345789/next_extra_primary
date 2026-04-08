/**
 * Async Run Dependencies
 * Type definitions for useRunFn dependency bag
 */

import type { AsyncStatus, AsyncError } from './asyncTypes'

/** @brief Options for createRunFn */
export interface RunFnDeps<T> {
  /** @brief The async operation to run */
  operation: () => Promise<T>
  /** @brief Max retry attempts */
  retryCount: number
  /** @brief Base delay between retries (ms) */
  retryDelay: number
  /** @brief Backoff multiplier */
  retryBackoff: number
  /** @brief Optional cache key */
  cacheKey?: string
  /** @brief Cache time-to-live (ms) */
  cacheTTL: number
  /** @brief Success callback */
  onSuccess?: (data: T) => void
  /** @brief Error callback */
  onError?: (err: string) => void
  /** @brief Status updater */
  upd: (s: AsyncStatus) => void
  /** @brief Whether currently loading */
  loading: boolean
  /** @brief Current data value */
  data: T | null
  /** @brief Set data callback */
  setData: (d: T) => void
  /** @brief Set error callback */
  setError: (e: AsyncError | null) => void
  /** @brief Attempt counter ref */
  attRef: React.MutableRefObject<number>
  /** @brief Abort controller ref */
  abortRef: React.MutableRefObject<
    AbortController | null
  >
}
