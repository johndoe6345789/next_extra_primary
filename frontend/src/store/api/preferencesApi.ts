/**
 * Preferences API endpoints injected into baseApi.
 * @module store/api/preferencesApi
 */
import { baseApi } from './baseApi';

/** User display preferences. */
export interface UserPreferences {
  themeMode: 'light' | 'dark' | 'system';
  locale: string;
  aiProvider: 'claude' | 'openai';
}

/** Preferences endpoints. */
export const preferencesApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /** Fetch current user preferences. */
      getPreferences: build.query<
        UserPreferences, void
      >({
        query: () => '/users/me/preferences',
        providesTags: ['Preferences'],
      }),

      /** Update user preferences. */
      updatePreferences: build.mutation<
        UserPreferences,
        Partial<UserPreferences>
      >({
        query: (body) => ({
          url: '/users/me/preferences',
          method: 'PUT',
          body,
        }),
        invalidatesTags: ['Preferences'],
      }),
    }),
  });

export const {
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
} = preferencesApi;
