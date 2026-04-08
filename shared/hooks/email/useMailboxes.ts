import { useState, useEffect } from 'react'
import type {
  MailboxState,
  UseMailboxesResult,
} from './mailboxesTypes'
import { DEFAULT_FOLDERS } from './mailboxesData'
import {
  useMailboxRefresh,
} from './mailboxesRefresh'

export type {
  Folder,
  UseMailboxesResult,
} from './mailboxesTypes'

/**
 * Hook for mailbox folder management
 * @param accountId - Email account ID
 */
export function useMailboxes(
  accountId?: string
): UseMailboxesResult {
  const [state, setState] =
    useState<MailboxState>({
      folders: DEFAULT_FOLDERS,
      loading: false,
      error: null,
    })

  const { refresh, updateUnreadCount } =
    useMailboxRefresh(accountId, setState)

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    folders: state.folders,
    loading: state.loading,
    error: state.error,
    refresh,
    updateUnreadCount,
  }
}
