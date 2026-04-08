/**
 * useGitHubFetcher - GitHub API fetcher hook
 *
 * Simple interface for fetching GitHub data
 * with auto-refetch support.
 */

import { useState, useCallback } from 'react'
import type {
  WorkflowRun,
  UseGitHubFetcherOptions,
  UseGitHubFetcherResult,
} from './gitHubFetcherTypes'
import { useAutoRefetch } from './useAutoRefetch'

export type {
  WorkflowRun,
  UseGitHubFetcherOptions,
  UseGitHubFetcherResult,
} from './gitHubFetcherTypes'

/** @brief Generic GitHub data fetcher hook */
export function useGitHubFetcher<T = unknown>(
  options: UseGitHubFetcherOptions<T[]> = {}
): UseGitHubFetcherResult<T> {
  const {
    fetchFn,
    refetchInterval = 30000,
    autoRefetch = true,
  } = options

  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] =
    useState<Error | null>(null)

  const refetch = useCallback(async () => {
    if (!fetchFn) return
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn()
      setData(
        Array.isArray(result) ? result : []
      )
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [fetchFn])

  useAutoRefetch(
    refetch,
    autoRefetch,
    fetchFn,
    refetchInterval
  )

  return { data, loading, error, refetch }
}

/**
 * Workflow-specific GitHub fetcher
 * @param fetchFn - Fetch workflow runs
 * @param refetchInterval - Interval in ms
 */
export function useWorkflowFetcher(
  fetchFn: () => Promise<WorkflowRun[]>,
  refetchInterval?: number
): UseGitHubFetcherResult<WorkflowRun> {
  return useGitHubFetcher<WorkflowRun>({
    fetchFn,
    refetchInterval,
  })
}
