'use client'

/**
 * Hook for listing groups via the backend
 * /api/social/groups endpoint.
 */

import {
  useCallback, useEffect, useState,
} from 'react'

/** A group row. */
export interface GroupRow {
  id: number
  slug: string
  name: string
  description: string
  created_at: string
}

const BASE = '/social-admin/api/social/groups'

/** Fetch all groups and expose a refresh handle. */
export function useGroups() {
  const [groups, setGroups] =
    useState<GroupRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] =
    useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const r = await fetch(BASE, {
        credentials: 'include',
      })
      if (!r.ok) {
        throw new Error(`HTTP ${r.status}`)
      }
      const j = await r.json()
      setGroups(j.groups ?? [])
      setError(null)
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'error',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])
  return { groups, loading, error, refresh }
}
