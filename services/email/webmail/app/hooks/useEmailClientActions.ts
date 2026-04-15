'use client'

/**
 * Optimistic-update action builders for the
 * email client: star, read, send. Each does
 * the local patch first, calls the API, then
 * rolls back and surfaces an error on failure.
 */

import { useCallback } from 'react'
import type { ApiEmail } from './useEmailApi'
import {
  apiMarkRead, apiToggleStar, apiSendEmail,
  SendPayload,
} from './useEmailMutations'

interface ActionDeps {
  accountId: number | null
  patchMessage: (
    id: number, patch: Partial<ApiEmail>,
  ) => void
  refresh: () => Promise<void> | void
  setError: (msg: string | null) => void
  setShowCompose: (v: boolean) => void
}

/** Build the action callbacks. */
export function useEmailClientActions(
  deps: ActionDeps,
) {
  const {
    accountId, patchMessage, refresh,
    setError, setShowCompose,
  } = deps

  const handleToggleRead = useCallback(
    async (id: string, isRead: boolean) => {
      const numId = Number(id)
      patchMessage(numId, { isRead })
      try {
        await apiMarkRead(numId, isRead)
      } catch (e) {
        patchMessage(numId, { isRead: !isRead })
        setError((e as Error).message)
      }
    }, [patchMessage, setError])

  const handleToggleStar = useCallback(
    async (id: string, isStarred: boolean) => {
      const numId = Number(id)
      patchMessage(numId, { isStarred })
      try {
        await apiToggleStar(numId, isStarred)
      } catch (e) {
        patchMessage(
          numId, { isStarred: !isStarred },
        )
        setError((e as Error).message)
      }
    }, [patchMessage, setError])

  const handleSend = useCallback(
    async (payload: {
      to: string[]; subject: string; body: string
    }) => {
      if (!accountId) {
        setError('No email account selected')
        return
      }
      const body: SendPayload = {
        accountId,
        to: payload.to.join(', '),
        subject: payload.subject,
        body: payload.body,
      }
      try {
        await apiSendEmail(body)
        setShowCompose(false)
        await refresh()
      } catch (e) {
        setError((e as Error).message)
      }
    }, [
      accountId, refresh,
      setError, setShowCompose,
    ])

  return { handleToggleRead, handleToggleStar, handleSend }
}
