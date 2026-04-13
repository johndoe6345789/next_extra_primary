'use client'

import { useState, useCallback, useEffect } from 'react'
import { useEmailApi, fetchAccounts } from './useEmailApi'
import type { FolderNavigationItem } from '@shared/m3/email'
import foldersJson from '../data/folders.json'

const FOLDERS: FolderNavigationItem[] =
  foldersJson

export function useEmailClient() {
  const [accountId, setAccountId] =
    useState<string | null>(null)
  const [activeFolder, setActiveFolder] =
    useState('inbox')
  const [selectedEmailId, setSelectedEmailId] =
    useState<string | null>(null)
  const [showCompose, setShowCompose] =
    useState(false)
  const [searchQuery, setSearchQuery] =
    useState('')
  const [isDarkMode, setIsDarkMode] =
    useState(true)
  const [sidebarOpen, setSidebarOpen] =
    useState(true)

  // Auto-detect account on mount
  useEffect(() => {
    fetchAccounts().then((accs) => {
      if (accs.length > 0) {
        setAccountId(accs[0].id)
      }
    })
  }, [])

  const { messages, loading, refresh } =
    useEmailApi(accountId ?? '')

  // Map API messages to component format
  const emails = messages.map(m => ({
    id: m.id,
    testId: m.id,
    from: m.from,
    to: [m.to],
    subject: m.subject,
    preview: m.preview,
    receivedAt: new Date(m.receivedAt).getTime(),
    isRead: m.isRead,
    isStarred: m.isStarred,
    body: m.preview,
  }))

  const folders = FOLDERS.map(f => ({
    ...f,
    isActive: f.id === activeFolder,
  }))

  const selectedEmail =
    emails.find(e => e.id === selectedEmailId)
    || null

  const filteredEmails = emails.filter(e => {
    if (activeFolder === 'starred')
      return e.isStarred
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

  const handleSelectEmail = useCallback(
    (emailId: string) => {
      setSelectedEmailId(emailId)
    }, [])

  const handleToggleRead = useCallback(
    (_: string, __: boolean) => {}, [])

  const handleToggleStar = useCallback(
    (_: string, __: boolean) => {}, [])

  const handleSend = useCallback(
    (_: { to: string[]; subject: string;
           body: string }) => {
      setShowCompose(false)
    }, [])

  const handleNavigateFolder = useCallback(
    (folderId: string) => {
      setActiveFolder(folderId)
      setSelectedEmailId(null)
    }, [])

  return {
    state: {
      activeFolder, selectedEmailId,
      emails, showCompose, searchQuery,
      isDarkMode, sidebarOpen, folders,
      selectedEmail, filteredEmails,
      unreadCount,
    },
    actions: {
      setSelectedEmailId, setSearchQuery,
      setShowCompose, setIsDarkMode,
      setSidebarOpen, handleSelectEmail,
      handleToggleRead, handleToggleStar,
      handleSend, handleNavigateFolder,
    },
  }
}
