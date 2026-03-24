/**
 * Auth API endpoints injected into baseApi.
 * @module store/api/authApi
 */
import { baseApi } from './baseApi';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  TokenPair,
} from '../../types/auth';

/** Auth endpoints: login, register, logout, etc. */
export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Log in with email and password. */
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    /** Register a new account. */
    register: build.mutation<
      LoginResponse,
      RegisterRequest
    >({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),

    /** Log out and invalidate the refresh token. */
    logout: build.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    /** Refresh the token pair. */
    refresh: build.mutation<
      { user: User; tokens: TokenPair },
      { refreshToken: string }
    >({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),

    /** Fetch the currently authenticated user. */
    getMe: build.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshMutation,
  useGetMeQuery,
} = authApi;
