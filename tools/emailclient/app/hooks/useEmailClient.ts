'use client'

import { useState, useCallback, useEffect } from 'react'
import { useEmailApi, fetchAccounts } from './useEmailApi'
import { useEmailClientActions }
  from './useEmailClientActions'
import type { FolderNavigationItem } from '@shared/m3/email'
import foldersJson from '../data/folders.json'

const FOLDERS: FolderNavigationItem[] = foldersJson

/** Top-level state + actions for the email client. */
export function useEmailClient() {
  const [accountId, setAccountId] =
    useState<number | null>(null)
  const [activeFolder, setActiveFolder] = useState('inbox')
  const [showCompose, setShowCompose] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAccounts().then((accs) => {
      if (accs.length > 0) setAccountId(accs[0].id)
    })
  }, [])

  const { messages, refresh, patchMessage } =
    useEmailApi(accountId)

  const emails = messages.map(m => ({
    id: String(m.id),
    testId: String(m.id),
    from: m.from,
    to: [m.to],
    subject: m.subject,
    preview: m.preview,
    receivedAt: new Date(m.receivedAt).getTime(),
    isRead: m.isRead,
    isStarred: m.isStarred,
    body: m.preview,
  }))

  const inboxUnread = emails.filter(e => !e.isRead).length
  const folders = FOLDERS.map(f => ({
    ...f,
    isActive: f.id === activeFolder,
    unreadCount: f.id === 'inbox' ? inboxUnread : undefined,
  }))

  const filteredEmails = emails.filter(e => {
    if (activeFolder === 'starred') return e.isStarred
    if (['sent', 'drafts', 'spam', 'trash']
      .includes(activeFolder)) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        e.from.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q)
      )
    }
    return true
  })

  const unreadCount =
    filteredEmails.filter(e => !e.isRead).length

  const {
    handleToggleRead, handleToggleStar, handleSend,
  } = useEmailClientActions({
    accountId, patchMessage, refresh,
    setError, setShowCompose,
  })

  const handleNavigateFolder = useCallback(
    (folderId: string) => setActiveFolder(folderId), [])

  return {
    accountId,
    state: {
      activeFolder, emails, showCompose,
      searchQuery, isDarkMode, sidebarOpen,
      folders, filteredEmails, unreadCount, error,
    },
    actions: {
      setSearchQuery, setShowCompose,
      setIsDarkMode, setSidebarOpen,
      handleToggleRead, handleToggleStar,
      handleSend, handleNavigateFolder,
      refresh, clearError: () => setError(null),
    },
  }
}
