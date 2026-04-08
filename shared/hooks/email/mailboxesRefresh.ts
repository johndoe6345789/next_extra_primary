/**
 * Mailbox refresh and unread count logic
 */

import { useCallback } from 'react'
import type { MailboxState } from './mailboxesTypes'
import { DEFAULT_FOLDERS } from './mailboxesData'

type SetState = React.Dispatch<
  React.SetStateAction<MailboxState>
>

/**
 * Build refresh and updateUnreadCount
 * @param accountId - Email account ID
 * @param setState - State setter
 */
export function useMailboxRefresh(
  accountId: string | undefined,
  setState: SetState
) {
  const refresh = useCallback(async () => {
    if (!accountId) {
      setState((p) => ({
        ...p,
        folders: DEFAULT_FOLDERS,
      }))
      return
    }
    setState((p) => ({
      ...p,
      loading: true,
      error: null,
    }))
    try {
      await new Promise((r) =>
        setTimeout(r, 500)
      )
      setState((p) => ({
        ...p,
        loading: false,
        folders: DEFAULT_FOLDERS,
      }))
    } catch (err) {
      const e =
        err instanceof Error
          ? err
          : new Error('Failed to load')
      setState((p) => ({
        ...p,
        loading: false,
        error: e,
      }))
    }
  }, [accountId])

  const updateUnreadCount = useCallback(
    (folderId: string, count: number) => {
      setState((p) => ({
        ...p,
        folders: p.folders.map((f) =>
          f.id === folderId
            ? { ...f, unreadCount: count }
            : f
        ),
      }))
    },
    []
  )

  return { refresh, updateUnreadCount }
}
