/**
 * Async retry with exponential backoff
 */

import type { AsyncError } from './asyncTypes';
import { responseCache } from './asyncTypes';

/** Execute with retry logic */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  attempt: number,
  retryCount: number,
  retryDelay: number,
  retryBackoff: number,
  cacheKey: string | undefined,
  cacheTTL: number,
  setData: (d: T) => void,
  setError: (e: AsyncError | null) => void,
  onSuccess?: <U>(data: U) => void,
  onError?: (error: AsyncError) => void
): Promise<T> {
  try {
    const result = await operation();
    if (cacheKey && cacheTTL > 0) {
      responseCache.set(cacheKey, {
        data: result,
        expiresAt: Date.now() + cacheTTL,
      });
    }
    setData(result);
    setError(null);
    onSuccess?.(result);
    return result;
  } catch (err) {
    if (attempt < retryCount) {
      const delay = retryDelay *
        Math.pow(retryBackoff, attempt);
      await new Promise((r) =>
        setTimeout(r, delay));
      return executeWithRetry(
        operation, attempt + 1,
        retryCount, retryDelay, retryBackoff,
        cacheKey, cacheTTL,
        setData, setError, onSuccess, onError
      );
    }
    const asyncErr: AsyncError = {
      message: err instanceof Error
        ? err.message : 'Operation failed',
      originalError: err instanceof Error
        ? err : undefined,
      code: err instanceof Error &&
        'code' in err
        ? (err as Record<string, string>).code
        : undefined,
    };
    setError(asyncErr);
    setData(null as T);
    onError?.(asyncErr);
    throw asyncErr;
  }
}
