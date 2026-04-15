'use client'

/**
 * Hook for listing DM threads and their messages
 * via the backend /api/social/dm/* endpoints.
 */

import {
  useCallback, useEffect, useState,
} from 'react'

/** Minimal thread shape. */
export interface DmThread {
  id: number
  a: string
  b: string
  at: string
}

/** Minimal message shape. */
export interface DmMessage {
  id: number
  sender: string
  body: string
  sent_at: string
  read_at: string
}

const BASE = '/social-admin/api/social/dm'

/** Fetch threads for the authenticated caller. */
export function useDms(threadId: number | null) {
  const [threads, setThreads] =
    useState<DmThread[]>([])
  const [messages, setMessages] =
    useState<DmMessage[]>([])
  const [error, setError] =
    useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const r = await fetch(
        `${BASE}/threads`,
        { credentials: 'include' },
      )
      const j = await r.json()
      setThreads(j.threads ?? [])
      if (threadId) {
        const m = await fetch(
          `${BASE}/threads/${threadId}/messages`,
          { credentials: 'include' },
        )
        const mj = await m.json()
        setMessages(mj.messages ?? [])
      }
      setError(null)
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'error',
      )
    }
  }, [threadId])

  useEffect(() => { refresh() }, [refresh])
  return { threads, messages, error, refresh }
}
