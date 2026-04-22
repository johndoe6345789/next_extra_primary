'use client'

/**
 * Inner mail layout — header, sidebar, polling.
 * Consumes EmailContext via useEmailCtx.
 * @module MailLayout
 */

import React, {
  useEffect, useCallback, useMemo,
} from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { MailboxSidebar } from '@shared/m3/email'
import { Box, Toaster } from '@shared/m3'
import { useEmailCtx } from '../hooks/EmailContext'
import { useMailPolling } from '../hooks/useMailPolling'
import { MailAppBar } from './MailAppBar'

/** @param children - Page content. */
export function MailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { accountId, state, actions } = useEmailCtx()

  const activeId = useMemo(() => {
    const match = pathname.match(/\/folder\/([^/]+)/)
    return match?.[1] ?? 'inbox'
  }, [pathname])

  const folders = useMemo(() =>
    state.folders.map(f => ({
      ...f, isActive: f.id === activeId,
    })),
  [state.folders, activeId])

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      state.isDarkMode ? 'dark' : 'light',
    )
  }, [state.isDarkMode])

  const onNewMail = useCallback(
    () => { actions.refresh() }, [actions])
  useMailPolling(accountId, onNewMail)

  const navigateFolder = useCallback(
    (folderId: string) => {
      router.push(`/folder/${folderId}`)
    }, [router],
  )

  return (
    <Box className="mailbox-layout">
      <MailAppBar
        searchQuery={state.searchQuery}
        onSearchChange={actions.setSearchQuery}
        isDarkMode={state.isDarkMode}
        onToggleTheme={() =>
          actions.setIsDarkMode(p => !p)
        }
        onMenuClick={() =>
          actions.setSidebarOpen(p => !p)
        }
        unreadCount={state.unreadCount}
      />
      <Box className="mailbox-content">
        <aside className={
          'mailbox-sidebar' +
          (state.sidebarOpen
            ? '' : ' mailbox-sidebar--hidden')
        }>
          <MailboxSidebar
            folders={folders}
            onNavigate={navigateFolder}
            onCompose={() =>
              actions.setShowCompose(true)
            }
            isDarkMode={state.isDarkMode}
            onToggleTheme={() =>
              actions.setIsDarkMode(
                (p: boolean) => !p)}
          />
        </aside>
        <main className="mailbox-main">{children}</main>
      </Box>
      <Toaster position="bottom-right" />
    </Box>
  )
}
