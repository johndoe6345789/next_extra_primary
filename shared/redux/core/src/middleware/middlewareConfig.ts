/**
 * Redux middleware stack configuration
 */

import {
  createLoggingMiddleware,
  createPerformanceMiddleware,
  createErrorMiddleware,
} from './middlewareFactories';
import { createAnalyticsMiddleware } from
  './analyticsMiddleware';

/**
 * Configure middleware stack for store
 */
export function getMiddlewareConfig(options?: {
  enableLogging?: boolean;
  enablePerformance?: boolean;
  enableAnalytics?: boolean;
}): any {
  const isDev =
    process.env.NODE_ENV === 'development';
  const logging =
    options?.enableLogging ?? isDev;
  const perf =
    options?.enablePerformance ?? isDev;
  const analytics =
    options?.enableAnalytics ?? true;

  return (getDefaultMiddleware: (opts: {
    serializableCheck: {
      ignoredActions: string[];
      ignoredPaths: string[];
    };
  }) => unknown[]) => {
    let mw = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'asyncData/fetchAsyncData/pending',
        ],
        ignoredPaths: [
          'asyncData.requests.*.promise',
        ],
      },
    }) as unknown[];
    if (logging) {
      mw = mw.concat(
        createLoggingMiddleware({ verbose: false })
      );
    }
    if (perf) {
      mw = mw.concat(
        createPerformanceMiddleware()
      );
    }
    if (analytics) {
      mw = mw.concat(
        createAnalyticsMiddleware()
      );
    }
    mw = mw.concat(createErrorMiddleware());
    return mw;
  };
}
