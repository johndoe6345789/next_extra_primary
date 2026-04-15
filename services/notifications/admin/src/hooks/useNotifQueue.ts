'use client'

/**
 * useNotifQueue — polls the notification
 * router REST surface for the delivery
 * ledger and exposes a retry helper.
 */

import {
  useCallback, useEffect, useState,
} from 'react'

const API = '/api/notifications'
const POLL_MS = 5_000

export interface QueueRow {
  id: number
  user_id: string
  channel: string
  template: string
  status: string
  attempts: number
  sent_at: string
  error: string
  created_at: string
}

export function useNotifQueue() {
  const [items, setItems] =
    useState<QueueRow[]>([])

  const refresh = useCallback(async () => {
    try {
      const r = await fetch(`${API}/queue`)
      if (!r.ok) return
      const j = (await r.json()) as {
        items: QueueRow[]
      }
      setItems(j.items)
    } catch {
      /* network noise — let poll retry */
    }
  }, [])

  const retry = useCallback(
    async (id: number) => {
      await fetch(
        `${API}/queue/${id}/retry`,
        { method: 'POST' },
      )
      refresh()
    },
    [refresh],
  )

  useEffect(() => {
    refresh()
    const h = setInterval(refresh, POLL_MS)
    return () => clearInterval(h)
  }, [refresh])

  return { items, retry, refresh }
}
