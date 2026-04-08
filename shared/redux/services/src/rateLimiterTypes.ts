/**
 * Rate limiter type definitions
 */

/** Rate limit configuration */
export interface RateLimitConfig {
  /** Maximum requests in the time window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Delay between retries in milliseconds */
  retryDelay: number;
  /** Max retries for high-priority requests */
  maxRetries?: number;
}

/** Internal request tracking record */
export interface RequestRecord {
  timestamp: number;
  count: number;
}

/** Request priority level */
export type Priority = 'low' | 'medium' | 'high';

/** Current rate limit status for a key */
export interface RateLimitStatus {
  /** Remaining requests in current window */
  remaining: number;
  /** Seconds until rate limit resets */
  resetIn: number;
}
