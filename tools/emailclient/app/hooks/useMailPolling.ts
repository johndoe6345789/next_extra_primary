'use client'

/**
 * Polls IMAP for new messages and fires
 * browser + in-app notifications.
 */

import {
  useEffect, useRef, useCallback,
} from 'react'
import { toast } from '@shared/m3'
import { triggerSync, fetchMessages } from './useEmailApi'

const POLL_MS = 15_000

/** Request browser notification permission. */
function requestPermission() {
  if (
    typeof Notification !== 'undefined' &&
    Notification.permission === 'default'
  ) {
    Notification.requestPermission()
  }
}

/** Show a browser notification. */
function browserNotify(
  subject: string,
  from: string,
) {
  if (
    typeof Notification === 'undefined' ||
    Notification.permission !== 'granted'
  ) return
  new Notification('New email', {
    body: `${from}\n${subject}`,
    icon: '/emailclient/favicon.ico',
    tag: 'new-mail',
  })
}

/**
 * Hook that polls IMAP every 15s and
 * notifies on new messages.
 * @param accountId Active email account ID.
 * @param onNewMail Callback with new count.
 */
export function useMailPolling(
  accountId: number | null,
  onNewMail: (count: number) => void,
) {
  const prevCount = useRef<number | null>(null)

  const poll = useCallback(async () => {
    if (!accountId) return
    const sync = await triggerSync(accountId)
    const newN = sync.newMessages ?? 0

    if (newN > 0) {
      const msgs =
        await fetchMessages(accountId)

      // Find the newest message for the toast
      const newest = msgs[0]
      if (newest) {
        const label = newN === 1
          ? newest.subject
          : `${newN} new emails`
        toast.info(
          `📬 ${label}`,
        )
        browserNotify(
          newest.subject,
          newest.from,
        )
      }

      onNewMail(newN)
    }
  }, [accountId, onNewMail])

  useEffect(() => {
    requestPermission()
  }, [])

  useEffect(() => {
    if (!accountId) return
    const id = setInterval(poll, POLL_MS)
    return () => clearInterval(id)
  }, [accountId, poll])
}
