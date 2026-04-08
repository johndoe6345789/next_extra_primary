/**
 * API call execution logic
 */

import type {
  ApiCallState,
  ApiCallOptions,
} from './apiCallTypes';

type SetState<T> = React.Dispatch<
  React.SetStateAction<ApiCallState<T>>
>

/**
 * Execute an API call with state management
 * @param url - Request URL
 * @param options - Request options
 * @param setState - State setter
 */
export async function executeApiCall<T>(
  url: string,
  options: ApiCallOptions,
  setState: SetState<T>
): Promise<T> {
  setState({
    data: null,
    loading: true,
    error: null,
  });
  try {
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body
        ? JSON.stringify(options.body)
        : undefined,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        data.error ||
          `Request failed: ${res.status}`
      );
    }
    setState({
      data,
      loading: false,
      error: null,
    });
    return data;
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.message
        : 'An unknown error occurred';
    setState({
      data: null,
      loading: false,
      error: msg,
    });
    throw err;
  }
}
