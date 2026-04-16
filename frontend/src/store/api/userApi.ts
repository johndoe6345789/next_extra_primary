/**
 * User API endpoints injected into baseApi.
 * @module store/api/userApi
 */
import { baseApi } from './baseApi';
import type {
  UserProfile,
  UserStats,
  UpdateProfileRequest,
} from '../../types/user';
import type { Badge } from '../../types/gamification';
import type { PaginatedResponse } from '../../types/api';

/** User CRUD and stats endpoints. */
export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Get a user profile by ID. */
    getUser: build.query<UserProfile, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'User', id }],
    }),

    /** Update a user profile by ID. */
    updateUser: build.mutation<
      UserProfile,
      UpdateProfileRequest & { id: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    /** Get badges earned by a specific user. */
    getUserBadges: build.query<Badge[], string>({
      query: (id) => `/users/${id}/badges`,
      providesTags: ['User'],
    }),

    /** Get aggregated stats for a user. */
    getUserStats: build.query<UserStats, string>({
      query: (id) => `/users/${id}/stats`,
      providesTags: (_r, _e, id) => [{ type: 'User', id }],
    }),

    /** List users with pagination. */
    listUsers: build.query<
      PaginatedResponse<UserProfile>,
      { page?: number; perPage?: number }
    >({
      query: ({ page = 1, perPage = 20 }) =>
        `/users?page=${page}&per_page=${perPage}`,
      providesTags: ['User'],
    }),

    /** Search users by handle/display name. */
    searchUsers: build.query<UserProfile[], string>({
      query: (q) =>
        `/users/search?q=${encodeURIComponent(q)}`,
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useGetUserBadgesQuery,
  useGetUserStatsQuery,
  useListUsersQuery,
  useSearchUsersQuery,
} = userApi;
