/**
 * Badge copy-to-clipboard callback
 */

import { useCallback } from 'react'
import { toast } from '@shared/components/m3'
import copy from '@/data/github-build-status.json'

type SetBadge = React.Dispatch<
  React.SetStateAction<string | null>
>

/**
 * Build copyBadgeMarkdown callback
 * @param defaultBranch - Default git branch
 * @param getBadgeMarkdown - Markdown builder
 * @param setCopiedBadge - State setter
 */
export function useCopyBadge(
  defaultBranch: string,
  getBadgeMarkdown: (
    path: string,
    name: string,
    branch?: string
  ) => string,
  setCopiedBadge: SetBadge
) {
  return useCallback(
    (
      path: string,
      name: string,
      branch?: string
    ) => {
      const md = getBadgeMarkdown(
        path, name, branch
      )
      navigator.clipboard.writeText(md)
      setCopiedBadge(
        `${path}-${branch || defaultBranch}`
      )
      toast.success(copy.toast.badgeCopied)
      setTimeout(
        () => setCopiedBadge(null), 2000
      )
    },
    [defaultBranch, getBadgeMarkdown]
  )
}
