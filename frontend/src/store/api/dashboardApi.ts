/**
 * Dashboard API endpoints injected into baseApi.
 * @module store/api/dashboardApi
 */
import { baseApi } from './baseApi';

/** Shape of the dashboard stats response. */
export interface DashboardStats {
  totalPoints: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  badgeCount: number;
  unreadNotifications: number;
  rank: number;
}

/** Dashboard stats endpoint. */
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Get aggregated dashboard stats. */
    getDashboardStats: build.query<
      DashboardStats, void
    >({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } =
  dashboardApi;
