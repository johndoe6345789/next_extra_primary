'use client'

/**
 * useWikiTree — fetches the nested wiki tree from
 * /api/wiki/tree and exposes a refresh helper.
 */

import {
  useState, useEffect, useCallback,
} from 'react'

const API = '/api/wiki'

export interface WikiNode {
  id: number
  parentId: number | null
  slug: string
  title: string
  path: string
  depth: number
  children: WikiNode[]
}

interface TreeResp {
  tree: WikiNode[]
}

/** Fetch + cache the wiki tree. */
export function useWikiTree(): {
  tree: WikiNode[]
  refresh: () => Promise<void>
} {
  const [tree, setTree] = useState<WikiNode[]>([])

  const refresh = useCallback(async () => {
    try {
      const r = await fetch(`${API}/tree`)
      if (!r.ok) return
      const d = (await r.json()) as TreeResp
      setTree(d.tree ?? [])
    } catch {
      /* network error — keep prior tree */
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { tree, refresh }
}
