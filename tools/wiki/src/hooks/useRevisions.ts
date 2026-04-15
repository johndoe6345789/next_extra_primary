'use client'

/**
 * useRevisions — loads the revision list for a
 * page and can fetch a diff between two revs.
 */

import {
  useState, useEffect, useCallback,
} from 'react'

const API = '/api/wiki'

export interface Revision {
  pageId: number
  rev: number
  title: string
  at: string
  authorId: string
}

export interface DiffOp {
  op: '=' | '+' | '-'
  line: string
}

/** Hook for revision history + diff loading. */
export function useRevisions(
  pageId: number | null,
): {
  revisions: Revision[]
  diff: DiffOp[]
  loadDiff: (from: number, to: number)
    => Promise<void>
} {
  const [revisions, setRevisions] =
    useState<Revision[]>([])
  const [diff, setDiff] = useState<DiffOp[]>([])

  const refresh = useCallback(async () => {
    if (pageId === null) {
      setRevisions([])
      return
    }
    const r = await fetch(
      `${API}/pages/${pageId}/revisions`,
    )
    if (!r.ok) return
    const d = (await r.json()) as {
      revisions: Revision[]
    }
    setRevisions(d.revisions ?? [])
  }, [pageId])

  useEffect(() => { void refresh() }, [refresh])

  const loadDiff = useCallback(
    async (from: number, to: number) => {
      if (pageId === null) return
      const r = await fetch(
        `${API}/pages/${pageId}/diff` +
          `?from=${from}&to=${to}`,
      )
      if (!r.ok) return
      const d = (await r.json()) as {
        diff: DiffOp[]
      }
      setDiff(d.diff ?? [])
    },
    [pageId],
  )

  return { revisions, diff, loadDiff }
}
