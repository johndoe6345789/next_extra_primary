/**
 * GitHub Fetcher Types
 * Types for the useGitHubFetcher hook
 */

/** @brief GitHub workflow run data */
export interface WorkflowRun {
  id: number
  name: string
  status: string
  conclusion?: string
  createdAt: string
}

/** @brief Options for useGitHubFetcher */
export interface UseGitHubFetcherOptions<T> {
  /**
   * Function to fetch data from GitHub
   * Handles authentication and API calls
   */
  fetchFn?: () => Promise<T>

  /**
   * Auto-refetch interval in milliseconds
   * @default 30000
   */
  refetchInterval?: number

  /**
   * Whether to refetch on mount
   * @default true
   */
  autoRefetch?: boolean
}

/** @brief Result of useGitHubFetcher */
export interface UseGitHubFetcherResult<T> {
  /** The fetched data */
  data: T[]
  /** Whether data is currently loading */
  loading: boolean
  /** Error that occurred, if any */
  error: Error | null
  /** Manually trigger a refetch */
  refetch: () => Promise<void>
}
