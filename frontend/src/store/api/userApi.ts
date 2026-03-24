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
      providesTags: (_r, _e, id) => [
        { type: 'User', id },
      ],
    }),

    /** Update the current user's profile. */
    updateUser: build.mutation<
      UserProfile,
      UpdateProfileRequest
    >({
      query: (body) => ({
        url: '/users/me',
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
      providesTags: (_r, _e, id) => [
        { type: 'User', id },
      ],
    }),

    /** List users with pagination. */
    listUsers: build.query<
      PaginatedResponse<UserProfile>,
      { page?: number; perPage?: number }
    >({
      query: ({ page = 1, perPage = 20 }) =>
        `/users?page=${page}&perPage=${perPage}`,
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
} = userApi;
