'use client'

/**
 * Webhook endpoints hook — polls the
 * webhook-dispatcher REST API for the
 * list of registered endpoints.
 */

import {
  useState, useEffect, useCallback,
} from 'react'

const API = '/api/webhooks'
const POLL_MS = 5_000

export interface Endpoint {
  id: number
  url: string
  events: string
  active: boolean
  failure_streak: number
  created_at: string
}

export interface EventType {
  event_type: string
  description: string
}

async function getJson<T>(
  path: string,
): Promise<T | null> {
  try {
    const r = await fetch(`${API}${path}`)
    if (!r.ok) return null
    return (await r.json()) as T
  } catch {
    return null
  }
}

export function useEndpoints() {
  const [items, setItems] =
    useState<Endpoint[]>([])
  const [events, setEvents] =
    useState<EventType[]>([])

  const refresh = useCallback(
    async () => {
      const e = await getJson<
        { items: Endpoint[] }
      >('/endpoints')
      const ev = await getJson<
        { items: EventType[] }
      >('/events')
      if (e) setItems(e.items)
      if (ev) setEvents(ev.items)
    },
    [],
  )

  useEffect(() => {
    refresh()
    const id =
      setInterval(refresh, POLL_MS)
    return () => clearInterval(id)
  }, [refresh])

  return { items, events, refresh }
}
