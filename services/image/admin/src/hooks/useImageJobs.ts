'use client'

/**
 * useImageJobs — polls the image-processor REST
 * surface for the job ledger and exposes a
 * retry helper for failed jobs.
 */

import {
  useCallback, useEffect, useState,
} from 'react'

const API = '/api/images/jobs'
const POLL_MS = 5_000

export interface JobRow {
  id: number
  source_url: string
  status: string
  attempts: number
  error: string | null
}

interface ListResp {
  items: JobRow[]
}

export function useImageJobs() {
  const [items, setItems] = useState<JobRow[]>([])

  const refresh = useCallback(async () => {
    try {
      const r = await fetch(API)
      if (!r.ok) return
      const j = (await r.json()) as ListResp
      setItems(j.items ?? [])
    } catch {
      /* poll will retry */
    }
  }, [])

  const retry = useCallback(
    async (id: number) => {
      await fetch(`${API}/${id}/retry`, {
        method: 'POST',
      })
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
