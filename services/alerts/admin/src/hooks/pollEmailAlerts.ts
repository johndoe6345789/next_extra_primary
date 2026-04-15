'use client'

/**
 * Fetch unread email messages from the
 * email-service and map them to AlertEntry.
 * Throws on network/HTTP failure so the
 * caller can surface errors to the UI.
 */

import type { AlertEntry } from './alertTypes'

const EMAIL_API = '/alerts/api/email'
const HEADERS = { 'X-Tenant-Id': 'default' }

/** Poll the email service for unread mail. */
export async function pollEmail(): Promise<
  AlertEntry[]
> {
  const ar = await fetch(
    `${EMAIL_API}/accounts`,
    { headers: HEADERS },
  )
  if (!ar.ok) {
    throw new Error(`accounts HTTP ${ar.status}`)
  }
  const accs = await ar.json()
  if (!accs.length) return []

  const accId = accs[0].id
  await fetch(
    `${EMAIL_API}/sync/${accId}`,
    { method: 'POST', headers: HEADERS },
  )
  const mr = await fetch(
    `${EMAIL_API}/messages` +
    `?accountId=${accId}&folder=INBOX`,
    { headers: HEADERS },
  )
  if (!mr.ok) {
    throw new Error(`messages HTTP ${mr.status}`)
  }
  const data = await mr.json()
  const msgs = data.messages ?? []
  return msgs
    .filter(
      (m: Record<string, unknown>) => !m.isRead,
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
}
