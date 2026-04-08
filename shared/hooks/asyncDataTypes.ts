/**
 * Type definitions for useAsyncData, usePaginatedData,
 * and useMutation hooks.
 */

export interface UseAsyncDataOptions<T> {
  /** Dependencies array - refetch when changed */
  dependencies?: React.DependencyList
  /** Callback when data successfully loads */
  onSuccess?: (data: T) => void
  /** Callback when error occurs */
  onError?: (error: Error) => void
  /** Number of retries on failure @default 0 */
  retries?: number
  /** Delay before retry in ms @default 1000 */
  retryDelay?: number
  /** Refetch when window regains focus @default true */
  refetchOnFocus?: boolean
  /** Refetch interval in ms @default null */
  refetchInterval?: number | null
  /** Initial data before first fetch */
  initialData?: T
}

export interface UseAsyncDataResult<T> {
  /** The fetched data */
  data: T | undefined
  /** Whether data is currently loading */
  isLoading: boolean
  /** Error that occurred, if any */
  error: Error | null
  /** Whether a refetch is in progress */
  isRefetching: boolean
  /** Manually retry the fetch */
  retry: () => Promise<void>
  /** Manually refetch data */
  refetch: () => Promise<void>
}

export interface UsePaginatedDataOptions<T>
  extends UseAsyncDataOptions<T[]> {
  /** Items per page @default 10 */
  pageSize?: number
  /** Initial page (0-based) @default 0 */
  initialPage?: number
}

export interface UsePaginatedDataResult<T>
  extends UseAsyncDataResult<T[]> {
  /** Current page (0-based) */
  page: number
  /** Total pages */
  pageCount: number
  /** Go to specific page */
  goToPage: (page: number) => void
  /** Go to next page */
  nextPage: () => void
  /** Go to previous page */
  previousPage: () => void
  /** Total item count */
  itemCount: number
}

export interface UseMutationOptions<T, R> {
  /** Callback on success */
  onSuccess?: (data: R) => void
  /** Callback on error */
  onError?: (error: Error) => void
}

export interface UseMutationResult<T, R> {
  /** Execute the mutation */
  mutate: (data: T) => Promise<R>
  /** Whether mutation is in progress */
  isLoading: boolean
  /** Error that occurred, if any */
  error: Error | null
  /** Reset error state */
  reset: () => void
}
