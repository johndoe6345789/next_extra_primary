/**
 * Analytics event ingestion API.
 * Calls POST /api/analytics/events
 * @module store/api/analyticsApi
 */
import { baseApi } from './baseApi';

/** Payload for a single analytics event. */
export interface AnalyticsEvent {
  /** Event name (e.g. page_view, login). */
  name: string;
  /** Arbitrary event properties. */
  props?: Record<string, unknown>;
}

/** Analytics API endpoints. */
export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Send an analytics event to the backend.
     * @param body - Event payload.
     */
    trackEvent: build.mutation<void, AnalyticsEvent>({
      query: (body) => ({
        url: '/analytics/events',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useTrackEventMutation } = analyticsApi;
