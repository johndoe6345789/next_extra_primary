/**
 * Type definitions for useApiCall hook
 */

/** API call state */
export type ApiCallState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

/** Options for API call execution */
export type ApiCallOptions = {
  method?:
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH';
  headers?: HeadersInit;
  body?: unknown;
};

/** Return type of useApiCall */
export type UseApiCallReturn<T> =
  ApiCallState<T> & {
    execute: (
      url: string,
      options?: ApiCallOptions
    ) => Promise<T>;
    reset: () => void;
  };
