/**
 * Admin API endpoints for env vars and user
 * management.
 * @module store/api/adminApi
 */
import { baseApi } from './baseApi';
import type { PaginatedResponse } from
  '../../types/api';
import type {
  EnvVar, AdminUser,
} from './adminTypes';

export type {
  EnvVar, AdminUser,
} from './adminTypes';

/** Admin endpoints. */
export const adminApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /** Get backend env vars. */
      getEnvVars: build.query<
        { vars: EnvVar[]; source: string },
        void
      >({
        query: () => '/admin/env',
        providesTags: ['Admin'],
      }),

      /** Get backend version. */
      getVersion: build.query<
        { backend: string; service: string },
        void
      >({
        query: () => '/version',
      }),

      /** List all users (admin, paginated). */
      listAdminUsers: build.query<
        PaginatedResponse<AdminUser>,
        { page?: number; perPage?: number }
      >({
        query: ({
          page = 1, perPage = 20,
        }) => `/users?page=${page}`
          + `&per_page=${perPage}`,
        providesTags: ['Admin'],
      }),

      /** Change a user's role. */
      setUserRole: build.mutation<
        unknown,
        { id: string; role: string }
      >({
        query: ({ id, role }) => ({
          url: `/admin/users/${id}/role`,
          method: 'PATCH',
          body: { role },
        }),
        invalidatesTags: ['Admin'],
      }),

      /** Toggle user active status. */
      setUserActive: build.mutation<
        unknown,
        { id: string; active: boolean }
      >({
        query: ({ id, active }) => ({
          url: `/admin/users/${id}/active`,
          method: 'PATCH',
          body: { active },
        }),
        invalidatesTags: ['Admin'],
      }),
    }),
  });

export const {
  useGetEnvVarsQuery,
  useGetVersionQuery,
  useListAdminUsersQuery,
  useSetUserRoleMutation,
  useSetUserActiveMutation,
} = adminApi;
