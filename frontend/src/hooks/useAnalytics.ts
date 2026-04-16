'use client';

/**
 * Analytics tracking hook — fires POST
 * /api/analytics/events with keepalive.
 * @module hooks/useAnalytics
 */
import { useCallback } from 'react';
import { useTrackEventMutation }
  from '@/store/api/analyticsApi';

/** Return type for useAnalytics. */
interface UseAnalyticsReturn {
  /**
   * Fire an analytics event.
   * @param name - Event name constant.
   * @param props - Optional event properties.
   */
  track: (
    name: string,
    props?: Record<string, unknown>,
  ) => void;
}

/**
 * Provides a `track` helper that sends events to
 * the analytics backend using fetch keepalive so
 * events survive page navigation.
 *
 * @returns Object with `track` method.
 */
export function useAnalytics(): UseAnalyticsReturn {
  const [trackEvent] = useTrackEventMutation();

  const track = useCallback(
    (
      name: string,
      props?: Record<string, unknown>,
    ) => {
      trackEvent({ name, props }).catch(() => {
        /* Analytics failures are non-fatal. */
      });
    },
    [trackEvent],
  );

  return { track };
}

export default useAnalytics;
