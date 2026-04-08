/**
 * useGithubBuildStatus Hook
 * Fetches GitHub Actions workflow status
 */

import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import type {
  WorkflowRun,
  Workflow,
  UseGithubBuildStatusArgs,
} from './githubBuildStatusTypes'
import {
  useBadgeHelpers,
} from './githubBuildStatusBadge'
import {
  useTimeFormatter,
} from './githubBuildStatusTime'
import {
  useGithubFetchData,
} from './githubBuildStatusFetch'
import {
  useCopyBadge,
} from './githubBuildStatusCopy'

export type {
  WorkflowRun, Workflow,
} from './githubBuildStatusTypes'

export const useGithubBuildStatus = ({
  owner, repo,
  defaultBranch = 'main',
}: UseGithubBuildStatusArgs) => {
  const [workflows, setWorkflows] =
    useState<WorkflowRun[]>([])
  const [allWorkflows, setAllWorkflows] =
    useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] =
    useState<string | null>(null)
  const [copiedBadge, setCopiedBadge] =
    useState<string | null>(null)

  const fetchData = useGithubFetchData(
    owner, repo, setWorkflows,
    setAllWorkflows, setLoading, setError
  )

  useEffect(
    () => { fetchData() }, [fetchData]
  )

  const { getBadgeUrl, getBadgeMarkdown } =
    useBadgeHelpers(
      owner, repo, defaultBranch
    )
  const formatTime = useTimeFormatter()

  const copyBadgeMarkdown = useCopyBadge(
    defaultBranch,
    getBadgeMarkdown,
    setCopiedBadge
  )

  const actions = useMemo(
    () => ({
      refresh: fetchData,
      copyBadgeMarkdown,
      getBadgeUrl,
      getBadgeMarkdown,
      formatTime,
    }),
    [
      copyBadgeMarkdown, fetchData,
      formatTime, getBadgeMarkdown,
      getBadgeUrl,
    ]
  )

  return {
    loading, error, workflows,
    allWorkflows, copiedBadge, actions,
  }
}
