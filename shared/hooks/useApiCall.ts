/**
 * useApiCall Hook
 * Generic API call with state management
 */

import { useState, useCallback } from 'react';
import type {
  ApiCallState,
  ApiCallOptions,
  UseApiCallReturn,
} from './apiCallTypes';
import { executeApiCall } from './apiCallExecute';

export type {
  ApiCallState,
  ApiCallOptions,
  UseApiCallReturn,
} from './apiCallTypes';

/**
 * Hook for making API calls
 * @template T - Response data type
 */
export function useApiCall<
  T = unknown
>(): UseApiCallReturn<T> {
  const [state, setState] = useState<
    ApiCallState<T>
  >({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (
      url: string,
      options: ApiCallOptions = {}
    ): Promise<T> =>
      executeApiCall(url, options, setState),
    []
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return { ...state, execute, reset };
}
