/**
 * Async data management type definitions
 */

/**
 * Represents a single async request
 * Tracks loading state, errors, retries, caching
 */
export interface AsyncRequest {
  id: string;
  status:
    | 'idle' | 'pending'
    | 'succeeded' | 'failed';
  data: unknown;
  error: string | null;
  retryCount: number;
  maxRetries: number;
  retryDelay: number;
  lastRefetch: number;
  refetchInterval: number | null;
  createdAt: number;
  isRefetching: boolean;
}

/**
 * Global state for all async operations
 */
export interface AsyncDataState {
  requests: Record<string, AsyncRequest>;
  globalLoading: boolean;
  globalError: string | null;
}

/** Initial state for async data */
export const asyncDataInitialState: AsyncDataState =
  {
    requests: {},
    globalLoading: false,
    globalError: null,
  };

/** Create a default async request */
export const createInitialRequest = (
  id: string
): AsyncRequest => ({
  id,
  status: 'idle',
  data: undefined,
  error: null,
  retryCount: 0,
  maxRetries: 3,
  retryDelay: 1000,
  lastRefetch: 0,
  refetchInterval: null,
  createdAt: Date.now(),
  isRefetching: false,
});
