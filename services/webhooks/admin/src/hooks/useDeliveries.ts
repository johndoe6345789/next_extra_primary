'use client'

/**
 * Webhook deliveries hook — polls the
 * webhook-dispatcher REST API for
 * delivery rows with an optional
 * status filter (pending, retrying,
 * delivered, dead).
 */

import {
  useState, useEffect, useCallback,
} from 'react'

const API = '/api/webhooks'
const POLL_MS = 5_000

export interface Delivery {
  id: number
  endpoint_id: number
  event_type: string
  status: string
  attempts: number
  next_retry_at: string
  last_status_code: number
  last_error: string
  delivered_at: string
  created_at: string
}

export function useDeliveries(
  status: string,
) {
  const [items, setItems] =
    useState<Delivery[]>([])

  const refresh = useCallback(
    async () => {
      const q = status
        ? `?status=${status}`
        : ''
      try {
        const r = await fetch(
          `${API}/deliveries${q}`,
        )
        if (!r.ok) return
        const j = (await r.json()) as {
          items: Delivery[]
        }
        setItems(j.items)
      } catch {
        // ignore transient errors
      }
    },
    [status],
  )

  useEffect(() => {
    refresh()
    const id =
      setInterval(refresh, POLL_MS)
    return () => clearInterval(id)
  }, [refresh])

  return { items, refresh }
}
