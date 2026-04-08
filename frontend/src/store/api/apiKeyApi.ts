/**
 * API key management endpoints.
 * @module store/api/apiKeyApi
 */
import { baseApi } from './baseApi';
import type {
  ApiKeyEntry, SaveKeyRequest,
  SystemKeyEntry, SaveSystemKeyRequest,
} from './apiKeyTypes';

export type {
  ApiKeyEntry, SystemKeyEntry,
} from './apiKeyTypes';

/** User and admin API key endpoints. */
export const apiKeyApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Get all user API keys (masked). */
    getUserKeys: build.query<
      { keys: ApiKeyEntry[] }, void
    >({
      query: () => '/users/me/api-keys',
      providesTags: ['ApiKeys'],
    }),

    /** Save or update a user API key. */
    saveUserKey: build.mutation<
      unknown, SaveKeyRequest
    >({
      query: (body) => ({
        url: '/users/me/api-keys',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ApiKeys'],
    }),

    /** Delete a user API key. */
    deleteUserKey: build.mutation<
      unknown, string
    >({
      query: (provider) => ({
        url: `/users/me/api-keys/${provider}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ApiKeys'],
    }),

    /** Get system-wide keys (admin). */
    getSystemKeys: build.query<
      { keys: SystemKeyEntry[] }, void
    >({
      query: () => '/admin/system-keys',
      providesTags: ['SystemKeys'],
    }),

    /** Set a system-wide key (admin). */
    saveSystemKey: build.mutation<
      unknown, SaveSystemKeyRequest
    >({
      query: (body) => ({
        url: '/admin/system-keys',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['SystemKeys'],
    }),
  }),
});

export const {
  useGetUserKeysQuery,
  useSaveUserKeyMutation,
  useDeleteUserKeyMutation,
  useGetSystemKeysQuery,
  useSaveSystemKeyMutation,
} = apiKeyApi;
