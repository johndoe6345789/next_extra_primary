/**
 * GitHub Actions fetch logic
 */

import { useCallback } from 'react'
import type {
  WorkflowRun,
  Workflow,
} from './githubBuildStatusTypes'

type SetState<T> = React.Dispatch<
  React.SetStateAction<T>
>

/**
 * Build fetchData callback for GitHub API
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param setWorkflows - Runs state setter
 * @param setAllWorkflows - Workflows setter
 * @param setLoading - Loading flag setter
 * @param setError - Error state setter
 */
export function useGithubFetchData(
  owner: string,
  repo: string,
  setWorkflows: SetState<WorkflowRun[]>,
  setAllWorkflows: SetState<Workflow[]>,
  setLoading: SetState<boolean>,
  setError: SetState<string | null>
) {
  return useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const base =
        'https://api.github.com/repos/' +
        `${owner}/${repo}/actions`
      const headers = {
        Accept:
          'application/vnd.github.v3+json',
      }
      const [runsRes, wfRes] =
        await Promise.all([
          fetch(
            `${base}/runs?per_page=5`,
            { headers }
          ),
          fetch(
            `${base}/workflows`,
            { headers }
          ),
        ])
      if (!runsRes.ok || !wfRes.ok) {
        throw new Error(
          `GitHub API error: ${runsRes.status}`
        )
      }
      const runsData = await runsRes.json()
      const wfData = await wfRes.json()
      setWorkflows(
        runsData.workflow_runs || []
      )
      setAllWorkflows(
        wfData.workflows || []
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch workflows'
      )
    } finally {
      setLoading(false)
    }
  }, [owner, repo])
}
