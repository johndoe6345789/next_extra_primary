'use client'

/**
 * Hook for reading presence state via the
 * /api/social/presence bulk endpoint.
 */

import {
  useCallback, useEffect, useState,
} from 'react'

const BASE = '/social-admin/api/social/presence'

/** Bulk-fetch status for a list of user ids. */
export function usePresence(users: string[]) {
  const [statuses, setStatuses] =
    useState<Record<string, string>>({})
  const [error, setError] =
    useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (users.length === 0) {
      setStatuses({})
      return
    }
    try {
      const r = await fetch(BASE, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ users }),
      })
      const j = await r.json()
      setStatuses(j.statuses ?? {})
      setError(null)
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'error',
      )
    }
  }, [users])

  useEffect(() => {
    refresh()
    const t = setInterval(refresh, 15_000)
    return () => clearInterval(t)
  }, [refresh])

  return { statuses, error, refresh }
}
