'use client'

/**
 * useWikiPage — loads a single wiki page and
 * exposes a save helper that PUTs the update.
 */

import {
  useState, useEffect, useCallback,
} from 'react'

const API = '/api/wiki'

export interface WikiPage {
  id: number
  parentId: number | null
  slug: string
  title: string
  bodyMd: string
  path: string
  depth: number
  updatedAt: string
}

/** Fetch + edit a single wiki page. */
export function useWikiPage(
  id: number | null,
): {
  page: WikiPage | null
  save: (
    title: string, bodyMd: string,
  ) => Promise<void>
  reload: () => Promise<void>
} {
  const [page, setPage] =
    useState<WikiPage | null>(null)

  const reload = useCallback(async () => {
    if (id === null) {
      setPage(null)
      return
    }
    const r = await fetch(`${API}/pages/${id}`)
    if (!r.ok) return
    setPage((await r.json()) as WikiPage)
  }, [id])

  useEffect(() => { void reload() }, [reload])

  const save = useCallback(
    async (title: string, bodyMd: string) => {
      if (id === null) return
      await fetch(`${API}/pages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, bodyMd }),
      })
      await reload()
    },
    [id, reload],
  )

  return { page, save, reload }
}
