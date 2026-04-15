'use client'

/**
 * useTemplates — CRUD wrapper around
 * /api/notifications/templates.  Returns
 * the full template list and a save()
 * helper that performs an upsert.
 */

import {
  useCallback, useEffect, useState,
} from 'react'

const API = '/api/notifications/templates'

export interface NotifTemplate {
  key: string
  channel: string
  subject: string
  body: string
  updated_at?: string
}

export function useTemplates() {
  const [items, setItems] =
    useState<NotifTemplate[]>([])

  const refresh = useCallback(async () => {
    try {
      const r = await fetch(API)
      if (!r.ok) return
      const j = (await r.json()) as {
        items: NotifTemplate[]
      }
      setItems(j.items)
    } catch {
      /* ignore */
    }
  }, [])

  const save = useCallback(
    async (t: NotifTemplate) => {
      await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(t),
      })
    },
    [],
  )

  useEffect(() => {
    refresh()
  }, [refresh])

  return { items, save, refresh }
}
