/**
 * Rate Limiter - barrel re-export + instances
 */

export type {
  RateLimitConfig, Priority, RateLimitStatus,
} from './rateLimiterTypes';

export { RateLimiter } from './rateLimiterClass';
import { RateLimiter } from './rateLimiterClass';

/** AI/LLM rate limiter: 3/min, 3s retry */
export const aiRateLimiter = new RateLimiter({
  maxRequests: 3,
  windowMs: 60000,
  retryDelay: 3000,
});

/** Scan rate limiter: 1/30s, 5s retry */
export const scanRateLimiter = new RateLimiter({
  maxRequests: 1,
  windowMs: 30000,
  retryDelay: 5000,
});

/** API rate limiter: 100/min, 1s retry */
export const apiRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60000,
  retryDelay: 1000,
  maxRetries: 5,
});
