/**
 * Async data hook types
 */

/** Options for useReduxAsyncData */
export interface UseAsyncDataOptions {
  /** Max retries (default: 3) */
  maxRetries?: number;
  /** Delay between retries in ms */
  retryDelay?: number;
  /** Called on successful fetch */
  onSuccess?: (data: unknown) => void;
  /** Called on error */
  onError?: (error: string) => void;
  /** Auto-refetch interval (ms) */
  refetchInterval?: number | null;
  /** Refetch when window gains focus */
  refetchOnFocus?: boolean;
  /** Dependencies to trigger refetch */
  dependencies?: unknown[];
}

/** Result from useReduxAsyncData */
export interface UseAsyncDataResult<
  T = unknown
> {
  /** The fetched data */
  data: T | undefined;
  /** True if currently fetching */
  isLoading: boolean;
  /** True if refetching without clear */
  isRefetching: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Manually retry the fetch */
  retry: () => Promise<void>;
  /** Manually refetch data */
  refetch: () => Promise<void>;
}
