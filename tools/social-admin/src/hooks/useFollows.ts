'use client'

/**
 * Hook for fetching follow graph data via the
 * backend /api/social/follows/* endpoints.
 */

import {
  useCallback, useEffect, useState,
} from 'react'

/** A single follow edge. */
export interface FollowEdge {
  user_id: string
  at: string
}

const BASE = '/social-admin/api/social/follows'

/** Fetch followers or following for a user id. */
export function useFollows(userId: string) {
  const [following, setFollowing] =
    useState<FollowEdge[]>([])
  const [followers, setFollowers] =
    useState<FollowEdge[]>([])
  const [error, setError] =
    useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!userId) return
    try {
      const a = await fetch(
        `${BASE}/${userId}/following`,
        { credentials: 'include' },
      )
      const b = await fetch(
        `${BASE}/${userId}/followers`,
        { credentials: 'include' },
      )
      const aj = await a.json()
      const bj = await b.json()
      setFollowing(aj.items ?? [])
      setFollowers(bj.items ?? [])
      setError(null)
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'error',
      )
    }
  }, [userId])

  useEffect(() => { refresh() }, [refresh])
  return { following, followers, error, refresh }
}
