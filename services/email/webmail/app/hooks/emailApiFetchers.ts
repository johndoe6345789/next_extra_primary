'use client'

/**
 * Plain fetch helpers for the Flask email
 * service (accounts, sync, messages list).
 */

/** Email message shape from the API. */
export interface ApiEmail {
  id: number
  uid: number
  folder: string
  subject: string
  from: string
  to: string
  preview: string
  isRead: boolean
  isStarred: boolean
  receivedAt: string
}

const HEADERS = { 'X-Tenant-Id': 'default' }

/** Fetch accounts for the current tenant. */
export async function fetchAccounts() {
  const res = await fetch(
    '/emailclient/api/accounts',
    { headers: HEADERS },
  )
  if (!res.ok) return []
  const data = await res.json()
  return data ?? []
}

/** Trigger IMAP sync for an account. */
export async function triggerSync(
  accountId: number,
) {
  const res = await fetch(
    `/emailclient/api/sync/${accountId}`,
    { method: 'POST', headers: HEADERS },
  )
  if (!res.ok) return { newMessages: 0 }
  return res.json()
}

/** Fetch messages for an account. */
export async function fetchMessages(
  accountId: number,
  folder = 'INBOX',
): Promise<ApiEmail[]> {
  const url =
    `/emailclient/api/messages` +
    `?accountId=${accountId}&folder=${folder}`
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) return []
  const data = await res.json()
  return (data.messages ?? []).map(
    (m: Record<string, unknown>) => ({
      id: m.id,
      uid: m.uid,
      folder: m.folder,
      subject: m.subject,
      from: m.from,
      to: m.to,
      preview: m.bodyText ?? '',
      isRead: m.isRead,
      isStarred: m.isStarred,
      receivedAt: m.dateReceived,
    }),
  ) as ApiEmail[]
}
