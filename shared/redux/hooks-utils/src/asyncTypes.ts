/**
 * Async operation types and cache
 */

/** Operation status */
export type AsyncStatus =
  'idle' | 'pending' | 'succeeded' | 'failed';

/** Typed async error */
export interface AsyncError {
  message: string;
  code?: string;
  originalError?: Error;
}

/** Hook options */
export interface UseAsyncOperationOptions {
  /** Max retries (default: 0) */
  retryCount?: number;
  /** Base retry delay in ms (default: 1000) */
  retryDelay?: number;
  /** Backoff multiplier (default: 2) */
  retryBackoff?: number;
  /** Cache key for response caching */
  cacheKey?: string;
  /** Cache TTL in ms */
  cacheTTL?: number;
  /** Called on success */
  onSuccess?: <T>(data: T) => void;
  /** Called on failure */
  onError?: (error: AsyncError) => void;
  /** Called when status changes */
  onStatusChange?: (
    status: AsyncStatus
  ) => void;
  /** Auto-execute on mount */
  autoExecute?: boolean;
}

/** Hook return value */
export interface UseAsyncOperationReturn<T> {
  data: T | null;
  error: AsyncError | null;
  status: AsyncStatus;
  isLoading: boolean;
  isIdle: boolean;
  isSuccess: boolean;
  isError: boolean;
  execute: () => Promise<T | null>;
  retry: () => Promise<T | null>;
  refetch: () => Promise<T | null>;
  reset: () => void;
}

/** Global response cache */
export const responseCache = new Map<
  string,
  { data: unknown; expiresAt: number }
>();
