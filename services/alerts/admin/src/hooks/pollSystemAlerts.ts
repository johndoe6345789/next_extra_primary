'use client'

/**
 * Fetch system alerts from the backend
 * /api/alerts endpoint and map them to
 * the unified AlertEntry shape.
 */

import type { AlertEntry } from './alertTypes'

interface ApiAlert {
  id: string
  source: string
  severity: string
  message: string
  last_seen: string
  count: number
  status: string
}

const API = '/api/alerts'

/** Poll the alerts API for system alerts. */
export async function pollSystem(): Promise<
  AlertEntry[]
> {
  const r = await fetch(`${API}?limit=50`)
  if (!r.ok) {
    throw new Error(`alerts HTTP ${r.status}`)
  }
  const rows = (await r.json()) as ApiAlert[]
  return rows.map((a) => ({
    id: `sys-${a.id}`,
    type: 'system' as const,
    title: a.message,
    detail: `${a.severity} · seen ${a.count}x`,
    source: a.source,
    timestamp: new Date(a.last_seen).getTime(),
    isRead: a.status !== 'open',
  }))
}
