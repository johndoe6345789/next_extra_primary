'use client'

/**
 * Unified alerts hook — polls services
 * for new events and maintains a list.
 * Surfaces polling errors via `error`.
 */

import {
  useState, useEffect, useCallback,
} from 'react'
import { pollEmail } from './pollEmailAlerts'
import type { AlertEntry } from './alertTypes'

export type { AlertEntry } from './alertTypes'

const POLL_MS = 15_000

/** Hook for the unified alerts list. */
export function useAlerts() {
  const [alerts, setAlerts] =
    useState<AlertEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] =
    useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const emailAlerts = await pollEmail()
      setAlerts(emailAlerts)
      setError(null)
    } catch (e) {
      // Existing behaviour preserved: loading
      // completes even on failure and alerts
      // stays empty (tests may depend on that).
      // Error is now surfaced via the return.
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => { refresh() }, [refresh])

  // Poll
  useEffect(() => {
    const id = setInterval(refresh, POLL_MS)
    return () => clearInterval(id)
  }, [refresh])

  const markRead = useCallback(
    (id: string) => {
      setAlerts(prev =>
        prev.map(a =>
          a.id === id ? { ...a, isRead: true } : a,
        ),
      )
    }, [],
  )

  const unreadCount =
    alerts.filter(a => !a.isRead).length

  return {
    alerts, loading, error,
    unreadCount, markRead, refresh,
  }
}
