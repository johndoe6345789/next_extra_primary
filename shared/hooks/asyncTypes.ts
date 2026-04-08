/**
 * Type definitions for useAsync hook
 */

/** Options for useAsync hook */
export interface UseAsyncOptions {
  /** Execute on mount (default: false) */
  immediate?: boolean
  /** Reset error on retry (default: true) */
  resetErrorOnRetry?: boolean
  /** Reset data on retry (default: false) */
  resetDataOnRetry?: boolean
}

/** Return type of useAsync hook */
export interface UseAsyncReturn<T> {
  /** Result data from async function */
  data: T | undefined
  /** Loading state */
  loading: boolean
  /** Error object if function threw */
  error: Error | undefined
  /** Execute the async function */
  execute: (
    ...args: unknown[]
  ) => Promise<T | undefined>
  /** Reset data, error, and loading */
  reset: () => void
}
