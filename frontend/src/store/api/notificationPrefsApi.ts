/**
 * Notification preferences API endpoints.
 * @module store/api/notificationPrefsApi
 */
import { baseApi } from './baseApi';

/** A single preference channel setting. */
export interface ChannelPref {
  /** Whether this channel is enabled. */
  enabled: boolean;
}

/** Preferences per category, per channel. */
export type NotifPrefs = Record<
  string,
  Record<string, ChannelPref>
>;

/** Notification preferences endpoints. */
export const notificationPrefsApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /** Fetch user notification preferences. */
      getNotifPrefs: build.query<NotifPrefs, void>({
        query: () => '/notifications/preferences',
        providesTags: ['Notification'],
      }),

      /** Update notification preferences. */
      updateNotifPrefs: build.mutation<
        NotifPrefs,
        NotifPrefs
      >({
        query: (body) => ({
          url: '/notifications/preferences',
          method: 'PATCH',
          body,
        }),
        invalidatesTags: ['Notification'],
      }),
    }),
  });

export const {
  useGetNotifPrefsQuery,
  useUpdateNotifPrefsMutation,
} = notificationPrefsApi;
