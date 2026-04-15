'use client'

/**
 * Polls operator hook — polls the polls
 * REST API (/api/polls) for the active
 * poll list, and refreshes on demand.
 */

import {
  useState, useEffect, useCallback,
} from 'react'

const API = '/api/polls'
const POLL_MS = 10_000

export type PollKind =
  'single' | 'multi' | 'rank' | 'approval'

export interface PollOption {
  id: number
  position: number
  label: string
}

export interface PollRow {
  id: number
  tenant_id: string
  creator_id: string
  question: string
  kind: PollKind
  opens_at: string
  closes_at: string
  public: boolean
  options: PollOption[]
}

export interface TallyItem {
  option_id: number
  label: string
  score: number
  vote_count: number
}

export interface TallyResult {
  poll_id: number
  kind: PollKind
  items: TallyItem[]
  total_votes: number
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

export function usePolls() {
  const [items, setItems] =
    useState<PollRow[]>([])
  const [selected, setSelected] =
    useState<number | null>(null)
  const [tally, setTally] =
    useState<TallyResult | null>(null)

  const refresh = useCallback(async () => {
    const r = await getJson<
      { items: PollRow[] }
    >('')
    if (r) setItems(r.items)
  }, [])

  const loadTally = useCallback(
    async (id: number) => {
      setSelected(id)
      const r = await getJson<TallyResult>(
        `/${id}/results`,
      )
      setTally(r)
    },
    [],
  )

  useEffect(() => {
    refresh()
    const h = setInterval(refresh, POLL_MS)
    return () => clearInterval(h)
  }, [refresh])

  return {
    items, selected, tally, refresh, loadTally,
  }
}
