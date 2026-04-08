/**
 * Type definitions for use-github-build-status
 */

/** A single workflow run */
export interface WorkflowRun {
  id: number
  name: string
  status: string
  conclusion: string | null
  created_at: string
  updated_at: string
  html_url: string
  head_branch: string
  head_sha: string
  event: string
  workflow_id: number
  path: string
}

/** A workflow definition */
export interface Workflow {
  id: number
  name: string
  path: string
  state: string
  badge_url: string
}

/** Arguments for the hook */
export interface UseGithubBuildStatusArgs {
  owner: string
  repo: string
  defaultBranch?: string
}
