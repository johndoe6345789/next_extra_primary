'use client'

/**
 * usePrefs — wraps the per-user preference
 * endpoints.  `load(user)` fetches the row
 * set; `toggle(user, channel, enabled)`
 * upserts a single row.
 */

import { useCallback, useState } from 'react'

const API = '/api/notifications/prefs'

export interface PrefRow {
  channel: string
  enabled: boolean
}

export function usePrefs() {
  const [items, setItems] =
    useState<PrefRow[]>([])

  const load = useCallback(
    async (user: string) => {
      if (!user) {
        setItems([])
        return
      }
      try {
        const r = await fetch(`${API}/${user}`)
        if (!r.ok) return
        const j = (await r.json()) as {
          items: PrefRow[]
        }
        setItems(j.items)
      } catch {
        /* ignore */
      }
    },
    [],
  )

  const toggle = useCallback(
    async (
      user: string,
      channel: string,
      enabled: boolean,
    ) => {
      if (!user) return
      await fetch(`${API}/${user}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel, enabled,
        }),
      })
      load(user)
    },
    [load],
  )

  return { items, load, toggle }
}
