'use client'

/**
 * Shared alerts-bell polling hook.
 *
 * Used by every tool (main app, emailclient, repo,
 * pgadmin, s3, componentviewer, etc.) to surface a
 * unified unread count in their header bell.
 */

import {
  useState, useEffect, useCallback, useRef,
} from 'react'
import {
  RawMessage, listAccounts, listInbox,
} from './alertsBellApi'

const POLL_MS = 15_000

/** Rule for deriving the badge count. */
export type UnreadCounter = (
  messages: RawMessage[],
) => number

/** Options for the shared alerts bell hook. */
export interface UseAlertsBellOptions {
  /** Override the unread-counting rule. */
  computeUnread?: UnreadCounter
  /** Disable polling (e.g. on the alerts page). */
  paused?: boolean
}

/** Return shape of the hook. */
export interface UseAlertsBellResult {
  unreadCount: number
  loading: boolean
  refresh: () => Promise<void>
}

/**
 * Poll the email service for unread alerts.
 *
 * @param opts - Optional behavior overrides.
 */
export function useAlertsBell(
  opts: UseAlertsBellOptions = {},
): UseAlertsBellResult {
  const { computeUnread, paused = false } = opts
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const counterRef = useRef(computeUnread)
  counterRef.current = computeUnread

  const refresh = useCallback(async () => {
    const accs = await listAccounts()
    if (accs.length === 0) {
      setUnreadCount(0)
      setLoading(false)
      return
    }
    const msgs = await listInbox(accs[0].id)
    const counter =
      counterRef.current ?? defaultUnread
    setUnreadCount(counter(msgs))
    setLoading(false)
  }, [])

  useEffect(() => {
    if (paused) return
    refresh()
    const id = setInterval(refresh, POLL_MS)
    return () => clearInterval(id)
  }, [refresh, paused])

  return { unreadCount, loading, refresh }
}

/**
 * Default unread counting rule: unread messages
 * received in the last 24 hours. Keeps the badge
 * focused on "what's new today" rather than
 * accumulating a lifetime backlog.
 */
const DAY_MS = 24 * 60 * 60 * 1000

function defaultUnread(
  messages: RawMessage[],
): number {
  const cutoff = Date.now() - DAY_MS
  return messages.filter(m => {
    if (m.isRead) return false
    const ts = new Date(
      m.dateReceived ?? 0,
    ).getTime()
    return ts > cutoff
  }).length
}
