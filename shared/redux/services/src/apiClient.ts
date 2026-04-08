/**
 * Core API request handler with retry logic
 */

export type {
  ApiError, ApiResponse,
} from './apiClientErrors';
export {
  isApiError, getErrorMessage,
} from './apiClientErrors';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api';

/** Generic API request with retries */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit & {
    retries?: number;
  } = {}
): Promise<T> {
  const { retries = 3, ...init } = options;
  const url = `${API_BASE_URL}${endpoint}`;
  let lastError: Error | null = null;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...init.headers,
        },
        ...init,
      });
      if (!res.ok) {
        const errData = await res.json()
          .catch(() => ({
            error: res.statusText,
          }));
        const err = new Error(
          errData.error?.message ||
          errData.error || 'API Error'
        );
        (err as Record<string, unknown>).status =
          res.status;
        throw err;
      }
      return res.json();
    } catch (err) {
      lastError = err instanceof Error
        ? err : new Error('Unknown error');
      const hasStatus = (
        err as Record<string, unknown>
      ).status;
      if (i < retries - 1 && !hasStatus) {
        await new Promise((r) =>
          setTimeout(r, Math.pow(2, i) * 1000)
        );
        continue;
      }
      throw lastError;
    }
  }
  throw lastError || new Error('Max retries');
}
