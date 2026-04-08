/**
 * Auto-Refetch Effect Hook
 * Handles initial fetch and interval-based
 * refetching for data fetcher hooks.
 */

import { useEffect } from 'react'

/**
 * Setup auto-refetch on mount and interval
 * @param refetch - Refetch callback
 * @param autoRefetch - Whether to auto-fetch
 * @param fetchFn - Original fetch function
 * @param interval - Refetch interval in ms
 */
export function useAutoRefetch(
  refetch: () => Promise<void>,
  autoRefetch: boolean,
  fetchFn: (() => Promise<unknown>) | undefined,
  interval: number
): void {
  // Initial fetch on mount
  useEffect(() => {
    if (autoRefetch) void refetch()
  }, [refetch, autoRefetch])

  // Interval-based refetch
  useEffect(() => {
    if (
      !interval ||
      interval <= 0 ||
      !fetchFn
    ) {
      return
    }
    const timer = setInterval(() => {
      void refetch()
    }, interval)
    return () => clearInterval(timer)
  }, [interval, fetchFn, refetch])
}
