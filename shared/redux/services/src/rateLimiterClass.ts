/**
 * RateLimiter class - token bucket rate limiting
 */

import type {
  RateLimitConfig, RequestRecord,
  Priority, RateLimitStatus,
} from './rateLimiterTypes';
import {
  isGatewayError, cleanupRecords,
  checkRecord, getRateLimitStatus,
} from './rateLimiterStatus';

/** Rate limiter with token bucket algorithm */
export class RateLimiter {
  private requests = new Map<
    string, RequestRecord
  >();
  private config: RateLimitConfig;

  constructor(config?: RateLimitConfig) {
    this.config = config || {
      maxRequests: 5, windowMs: 60000,
      retryDelay: 2000, maxRetries: 3,
    };
  }

  /** Execute function with rate limiting */
  async throttle<T>(
    key: string, fn: () => Promise<T>,
    priority: Priority = 'medium'
  ): Promise<T | null> {
    const maxR = this.config.maxRetries ?? 3;
    let attempts = 0;
    while (true) {
      const limited = checkRecord(
        this.requests, key, this.config
      );
      cleanupRecords(
        this.requests, this.config.windowMs
      );
      if (limited) {
        if (
          priority === 'high' && attempts < maxR
        ) {
          attempts++;
          await new Promise((r) => setTimeout(
            r, this.config.retryDelay));
          continue;
        }
        return null;
      }
      try { return await fn(); }
      catch (err) {
        if (err instanceof Error &&
          isGatewayError(err.message)) {
          const upd = this.requests.get(key);
          if (upd)
            upd.count = this.config.maxRequests;
        }
        throw err;
      }
    }
  }

  /** Reset rate limit state */
  reset(key?: string) {
    if (key) this.requests.delete(key);
    else this.requests.clear();
  }

  /** Get current rate limit status */
  getStatus(key: string): RateLimitStatus {
    return getRateLimitStatus(
      this.requests, key, this.config
    );
  }

  /** Check if key is rate limited */
  isLimited(key: string): boolean {
    return this.getStatus(key).remaining === 0;
  }
}
