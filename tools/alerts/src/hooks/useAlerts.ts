'use client'

/**
 * Unified alerts hook — polls services
 * for new events and maintains a list.
 */

import {
  useState, useEffect, useCallback,
} from 'react'

/** Single alert entry. */
export interface AlertEntry {
  id: string
  type: 'email' | 'system'
  title: string
  detail: string
  source: string
  timestamp: number
  isRead: boolean
  link?: string
}

const POLL_MS = 15_000
const EMAIL_API =
  '/alerts/api/email'

const HEADERS = {
  'X-Tenant-Id': 'default',
}

/**
 * Fetch unread email count and newest
 * messages from the email service.
 */
async function pollEmail(): Promise<
  AlertEntry[]
> {
  try {
    // Get accounts
    const ar = await fetch(
      `${EMAIL_API}/accounts`,
      { headers: HEADERS },
    )
    if (!ar.ok) return []
    const accs = await ar.json()
    if (!accs.length) return []

    const accId = accs[0].id

    // Sync + fetch
    await fetch(
      `${EMAIL_API}/sync/${accId}`,
      { method: 'POST', headers: HEADERS },
    )
    const mr = await fetch(
      `${EMAIL_API}/messages` +
      `?accountId=${accId}&folder=INBOX`,
      { headers: HEADERS },
    )
    if (!mr.ok) return []
    const data = await mr.json()
    const msgs = data.messages ?? []

    return msgs
      .filter(
        (m: Record<string, unknown>) =>
          !m.isRead,
      )
      .map(
        (m: Record<string, unknown>) => ({
          id: `email-${m.id}`,
          type: 'email' as const,
          title: String(m.subject ?? ''),
          detail: String(m.from ?? ''),
          source: 'Email',
          timestamp: new Date(
            String(m.dateReceived),
          ).getTime(),
          isRead: false,
          link: `/emailclient/mail/${m.id}`,
        }),
      )
  } catch {
    return []
  }
}

/** Hook for the unified alerts list. */
export function useAlerts() {
  const [alerts, setAlerts] =
    useState<AlertEntry[]>([])
  const [loading, setLoading] =
    useState(true)

  const refresh = useCallback(async () => {
    const emailAlerts = await pollEmail()
    setAlerts(emailAlerts)
    setLoading(false)
  }, [])

  // Initial load
  useEffect(() => {
    refresh()
  }, [refresh])

  // Poll
  useEffect(() => {
    const id = setInterval(refresh, POLL_MS)
    return () => clearInterval(id)
  }, [refresh])

  const markRead = useCallback(
    (id: string) => {
      setAlerts(prev =>
        prev.map(a =>
          a.id === id
            ? { ...a, isRead: true }
            : a,
        ),
      )
    }, [],
  )

  const unreadCount =
    alerts.filter(a => !a.isRead).length

  return {
    alerts, loading,
    unreadCount, markRead, refresh,
  }
}
