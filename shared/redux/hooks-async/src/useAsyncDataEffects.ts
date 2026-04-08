/**
 * Side-effect hooks for async data
 */

import { useEffect, useRef } from 'react';
import type { UseAsyncDataOptions } from
  './asyncDataTypes';

/** Run onSuccess callback when data arrives */
export function useSuccessEffect<T>(
  status: string,
  data: T | undefined,
  options?: UseAsyncDataOptions
) {
  useEffect(() => {
    if (
      status === 'succeeded' &&
      data !== undefined &&
      options?.onSuccess
    ) {
      options.onSuccess(data);
    }
  }, [status, data, options]);
}

/** Run onError callback on failure */
export function useErrorEffect(
  status: string,
  error: string | null,
  options?: UseAsyncDataOptions
) {
  useEffect(() => {
    if (
      status === 'failed' && error &&
      options?.onError
    ) {
      options.onError(error);
    }
  }, [status, error, options]);
}

/** Refetch on tab focus visibility */
export function useFocusRefetch(
  refetch: () => Promise<unknown>,
  refetchOnFocus?: boolean
) {
  const visRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    if (refetchOnFocus) {
      visRef.current = () => {
        if (
          document.visibilityState === 'visible'
        ) {
          void refetch();
        }
      };
      document.addEventListener(
        'visibilitychange', visRef.current
      );
      return () => {
        if (visRef.current) {
          document.removeEventListener(
            'visibilitychange', visRef.current
          );
        }
      };
    }
  }, []);
}
