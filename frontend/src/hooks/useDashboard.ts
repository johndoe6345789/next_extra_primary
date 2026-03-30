/**
 * Hook for dashboard stats data.
 * @module hooks/useDashboard
 */
import { useGetDashboardStatsQuery } from '@/store/api';

/** @brief Dashboard stats hook with loading state. */
export function useDashboard() {
  const { data, isLoading, error } =
    useGetDashboardStatsQuery();

  return {
    stats: data ?? null,
    isLoading,
    error: error ? 'Failed to load stats' : null,
  };
}
