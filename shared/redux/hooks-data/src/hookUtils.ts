/**
 * Shared hook utility helpers
 */

import type { AppDispatch } from
  '@shared/redux-slices';

/** Extract error message from unknown */
export function errMsg(
  e: unknown, fb: string
): string {
  return e instanceof Error ? e.message : fb;
}

/** Get tenant ID from localStorage */
export function getTenantId(): string {
  return localStorage.getItem('tenantId') ||
    'default';
}

/** Run an async op with loading/error state */
export async function withLoading<T>(
  dispatch: AppDispatch,
  setLoading: (v: boolean) => { type: string },
  setError: (
    v: string | null
  ) => { type: string },
  errorFallback: string,
  fn: () => Promise<T>
): Promise<T> {
  dispatch(setLoading(true));
  try {
    const result = await fn();
    return result;
  } catch (e) {
    dispatch(setError(errMsg(e, errorFallback)));
    throw e;
  } finally {
    dispatch(setLoading(false));
  }
}
