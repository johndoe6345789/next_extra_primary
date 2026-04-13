/**
 * Impersonation API endpoints.
 * @module store/api/impersonateApi
 */
import { baseApi } from './baseApi';

/** Impersonation endpoints. */
export const impersonateApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /** Impersonate a user (admin only). */
      impersonateUser: build.mutation<
        unknown, { userId: string }
      >({
        query: ({ userId }) => ({
          url: '/admin/auth/impersonate',
          method: 'POST',
          body: { userId },
        }),
      }),

      /** Stop impersonating (restore admin). */
      stopImpersonate: build.mutation<
        unknown, void
      >({
        query: () => ({
          url: '/admin/auth/stop-impersonate',
          method: 'POST',
        }),
      }),

      /** Check impersonation status. */
      getImpersonationStatus: build.query<
        { impersonating: boolean }, void
      >({
        query: () =>
          '/auth/impersonation-status',
      }),
    }),
  });

export const {
  useImpersonateUserMutation,
  useStopImpersonateMutation,
  useGetImpersonationStatusQuery,
} = impersonateApi;
