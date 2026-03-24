'use client';

import { useState, useCallback } from 'react';

/** Return type for the generic useApi hook. */
interface UseApiReturn<T> {
  /** The most recent response data. */
  data: T | null;
  /** Error message if the request failed. */
  error: string | null;
  /** Whether a request is in flight. */
  isLoading: boolean;
  /** Re-execute the last fetch call. */
  refetch: () => Promise<void>;
}

/**
 * Generic data-fetching hook wrapping a fetch call
 * with loading and error state management.
 *
 * This is a lightweight alternative to RTK Query
 * for one-off or custom API calls that do not need
 * caching or invalidation.
 *
 * @template T - Expected response data type.
 * @param fetchFn - Async function that returns data.
 * @returns API call state and refetch helper.
 */
export function useApi<T>(
  fetchFn: () => Promise<T>,
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] =
    useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unknown error';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn]);

  return { data, error, isLoading, refetch };
}

export default useApi;
