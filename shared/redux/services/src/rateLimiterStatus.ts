/**
 * Rate limiter status and query helpers
 */

import type {
  RateLimitConfig, RequestRecord,
  RateLimitStatus,
} from './rateLimiterTypes';

/** Check if message indicates gateway error */
export function isGatewayError(
  msg: string
): boolean {
  return msg.includes('502') ||
    msg.includes('Bad Gateway') ||
    msg.includes('429') ||
    msg.includes('rate limit');
}

/** Remove expired request records */
export function cleanupRecords(
  requests: Map<string, RequestRecord>,
  windowMs: number
) {
  const now = Date.now();
  const maxAge = windowMs * 2;
  requests.forEach((rec, key) => {
    if (now - rec.timestamp > maxAge) {
      requests.delete(key);
    }
  });
}

/** Check/update request record; return limited */
export function checkRecord(
  requests: Map<string, RequestRecord>,
  key: string, config: RateLimitConfig
): boolean {
  const now = Date.now();
  const rec = requests.get(key);
  if (!rec) {
    requests.set(key, {
      timestamp: now, count: 1,
    });
    return false;
  }
  const elapsed = now - rec.timestamp;
  if (elapsed >= config.windowMs) {
    requests.set(key, {
      timestamp: now, count: 1,
    });
    return false;
  }
  if (rec.count >= config.maxRequests) {
    return true;
  }
  rec.count++;
  return false;
}

/** Get rate limit status for a key */
export function getRateLimitStatus(
  requests: Map<string, RequestRecord>,
  key: string,
  config: RateLimitConfig
): RateLimitStatus {
  const rec = requests.get(key);
  if (!rec) {
    return {
      remaining: config.maxRequests,
      resetIn: 0,
    };
  }
  const elapsed = Date.now() - rec.timestamp;
  if (elapsed >= config.windowMs) {
    return {
      remaining: config.maxRequests,
      resetIn: 0,
    };
  }
  return {
    remaining: Math.max(
      0, config.maxRequests - rec.count
    ),
    resetIn: Math.ceil(
      (config.windowMs - elapsed) / 1000
    ),
  };
}
