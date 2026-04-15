'use client'

/**
 * useStreams — polls /api/streams for the
 * live list used by the streams operator
 * tool.  Mirrors the jobs/cron polling
 * shape so the three T3 tools stay in
 * lockstep.
 */

import {
  useState, useEffect, useCallback,
} from 'react'

const API = '/api/streams'
const POLL_MS = 5_000

export interface StreamRow {
  id: number
  slug: string
  title: string
  ingest_key: string
  status: string
  started_at: string
  ended_at: string
  recording: string
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

export function useStreams() {
  const [items, setItems] =
    useState<StreamRow[]>([])

  const refresh = useCallback(async () => {
    const r = await getJson<
      { items: StreamRow[] }
    >('')
    if (r) setItems(r.items)
  }, [])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, POLL_MS)
    return () => clearInterval(id)
  }, [refresh])

  return { items, refresh }
}
