/**
 * Badge/markdown helpers for build status
 */

import { useCallback } from 'react'

/** Create badge URL/markdown callbacks */
export function useBadgeHelpers(
  owner: string,
  repo: string,
  defaultBranch: string
) {
  const getBadgeUrl = useCallback(
    (path: string, branch = defaultBranch) => {
      const file = path.split('/').pop()
      const base =
        `https://github.com/${owner}` +
        `/${repo}/actions/workflows/${file}`
      return branch
        ? `${base}/badge.svg?branch=${branch}`
        : `${base}/badge.svg`
    },
    [defaultBranch, owner, repo]
  )

  const getBadgeMarkdown = useCallback(
    (
      path: string,
      name: string,
      branch?: string
    ) => {
      const badge = getBadgeUrl(path, branch)
      const file = path.split('/').pop()
      const url =
        `https://github.com/${owner}` +
        `/${repo}/actions/workflows/${file}`
      return `[![${name}](${badge})](${url})`
    },
    [getBadgeUrl, owner, repo]
  )

  return { getBadgeUrl, getBadgeMarkdown }
}
