'use client'

/**
 * Hooks for fetching email data from the
 * Drogon backend via /api/email/* endpoints.
 */

import {
  useState, useEffect, useCallback,
} from 'react'

/** Email message shape from the API. */
export interface ApiEmail {
  id: string
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

/** Fetch accounts for the current user. */
export async function fetchAccounts() {
  const res = await fetch(
    '/api/email/accounts',
    { credentials: 'include' },
  )
  if (!res.ok) return []
  const data = await res.json()
  return data.accounts ?? []
}

/** Trigger IMAP sync for an account. */
export async function triggerSync(
  accountId: string,
) {
  const res = await fetch(
    `/api/email/sync/${accountId}`,
    {
      method: 'POST',
      credentials: 'include',
    },
  )
  if (!res.ok) return { newMessages: 0 }
  return res.json()
}

/** Fetch messages for an account. */
export async function fetchMessages(
  accountId: string,
  folder = 'INBOX',
) {
  const url =
    `/api/email/messages?accountId=` +
    `${accountId}&folder=${folder}`
  const res = await fetch(url, {
    credentials: 'include',
  })
  if (!res.ok) return []
  const data = await res.json()
  return (data.messages ?? []) as ApiEmail[]
}

/**
 * Hook to load and sync emails.
 * @param accountId Email account UUID.
 * @returns Messages array and loading state.
 */
export function useEmailApi(accountId: string) {
  const [msgs, setMsgs] =
    useState<ApiEmail[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    await triggerSync(accountId)
    const data = await fetchMessages(accountId)
    setMsgs(data)
    setLoading(false)
  }, [accountId])

  useEffect(() => { refresh() }, [refresh])

  return { messages: msgs, loading, refresh }
}
