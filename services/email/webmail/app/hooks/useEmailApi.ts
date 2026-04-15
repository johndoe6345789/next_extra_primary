'use client'

/**
 * React hook that loads and syncs emails
 * from the Flask email-service backend.
 */

import {
  useState, useEffect, useCallback,
} from 'react'
import {
  ApiEmail, triggerSync, fetchMessages,
} from './emailApiFetchers'

export type { ApiEmail } from './emailApiFetchers'
export {
  fetchAccounts, triggerSync, fetchMessages,
} from './emailApiFetchers'

/**
 * Hook to load and sync emails.
 * @param accountId Email account numeric ID.
 * @returns Messages array, loading state,
 *   a refresh action, and patchMessage for
 *   optimistic updates.
 */
export function useEmailApi(
  accountId: number | null,
) {
  const [msgs, setMsgs] =
    useState<ApiEmail[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!accountId) return
    setLoading(true)
    await triggerSync(accountId)
    const data = await fetchMessages(accountId)
    setMsgs(data)
    setLoading(false)
  }, [accountId])

  useEffect(() => { refresh() }, [refresh])

  /** Locally patch one message (optimistic). */
  const patchMessage = useCallback(
    (id: number, patch: Partial<ApiEmail>) => {
      setMsgs(prev => prev.map(m =>
        m.id === id ? { ...m, ...patch } : m,
      ))
    }, [],
  )

  return {
    messages: msgs, loading, refresh, patchMessage,
  }
}
