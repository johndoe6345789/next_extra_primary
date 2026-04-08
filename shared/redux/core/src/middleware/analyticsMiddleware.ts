/**
 * Analytics middleware for Redux
 * Tracks important actions for analytics reporting
 */

import type { Middleware } from '@reduxjs/toolkit';

/** Actions that should be tracked */
const TRACKING_ACTIONS = [
  'auth/setAuthenticated',
  'project/setCurrentProject',
  'workflow/startExecution',
  'asyncData/fetchAsyncData/fulfilled',
];

/** Analytics tracker interface */
interface AnalyticsTracker {
  track: (type: string, payload: unknown) => void;
}

/**
 * Analytics middleware factory
 * Sends tracked actions to window.analytics
 */
export const createAnalyticsMiddleware = (
): Middleware => {
  return () => (next) => (action: unknown) => {
    const a = action as {
      type: string;
      payload: unknown;
    };
    if (TRACKING_ACTIONS.includes(a.type)) {
      if (typeof window !== 'undefined') {
        const w = window as unknown as
          Record<string, unknown>;
        if (w.analytics) {
          const tracker =
            w.analytics as AnalyticsTracker;
          tracker.track(a.type, a.payload);
        }
      }
    }
    return next(action);
  };
};
