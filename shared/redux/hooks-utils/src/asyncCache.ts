/**
 * Async operation cache check
 */

import { responseCache } from './asyncTypes';

/** Check cache and return hit or null */
export function checkCache<T>(
  cacheKey: string | undefined,
  bypassCache: boolean
): T | null | undefined {
  if (!cacheKey || bypassCache) return undefined;
  const c = responseCache.get(cacheKey);
  if (c && c.expiresAt > Date.now())
    return c.data as T;
  return undefined;
}
