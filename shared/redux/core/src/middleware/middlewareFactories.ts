/**
 * Core Redux middleware factory functions
 * Logging, performance monitoring, error handling
 */

import type { Middleware } from '@reduxjs/toolkit';

/**
 * Logging middleware for development
 */
export const createLoggingMiddleware = (
  options?: { verbose?: boolean }
): Middleware => {
  return (store) => (next) => (action: unknown) => {
    const a = action as { type: string };
    const verbose = options?.verbose ?? false;
    if (verbose) {
      console.group(`[Redux] ${a.type}`);
      console.info('action:', a);
      console.log('prev:', store.getState());
    }
    const result = next(action);
    if (verbose) {
      console.log('next:', store.getState());
      console.groupEnd();
    }
    return result;
  };
};

/**
 * Performance monitoring middleware
 */
export const createPerformanceMiddleware = (
): Middleware => {
  return (store) => (next) => (action: unknown) => {
    const a = action as { type: string };
    const t0 = performance.now();
    const m0 =
      process.memoryUsage?.()?.heapUsed ?? 0;
    const result = next(action);
    const dt = (performance.now() - t0).toFixed(2);
    const dm = (
      ((process.memoryUsage?.()?.heapUsed ?? 0) -
        m0) / 1024
    ).toFixed(2);
    const sz = (
      JSON.stringify(store.getState()).length /
      1024
    ).toFixed(2);
    if (process.env.NODE_ENV === 'development') {
      if (parseFloat(dt) > 10) {
        console.warn(
          `Slow: ${a.type} ${dt}ms, ` +
          `mem: ${dm}KB, state: ${sz}KB`
        );
      }
      if (parseFloat(sz) > 1024) {
        console.warn(`Large state: ${sz}KB`);
      }
    }
    return result;
  };
};

/**
 * Error catching middleware
 */
export const createErrorMiddleware = (
): Middleware => {
  return () => (next) => (action: unknown) => {
    try {
      return next(action);
    } catch (error) {
      const a = action as { type: string };
      console.error(
        `Error in ${a.type}:`, error
      );
      throw error;
    }
  };
};
