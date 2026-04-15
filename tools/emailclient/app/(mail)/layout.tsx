'use client'

/**
 * Shared mail layout with header + sidebar.
 * Polls IMAP for new mail and shows alerts.
 */

import React, {
  useEffect, useCallback, useMemo,
} from 'react'
import {
  useRouter, usePathname,
} from 'next/navigation'
import {
  MailboxHeader,
  MailboxSidebar,
} from '@shared/m3/email'
import {
  Box, AppBar, Toolbar, Toaster,
} from '@shared/m3'
import {
  EmailProvider, useEmailCtx,
} from '../hooks/EmailContext'
import {
  useMailPolling,
} from '../hooks/useMailPolling'

function MailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const {
    accountId, state, actions,
  } = useEmailCtx()

  // Derive active folder from URL
  const activeId = useMemo(() => {
    const match = pathname.match(
      /\/folder\/([^/]+)/,
    )
    return match?.[1] ?? 'inbox'
  }, [pathname])

  const folders = useMemo(() =>
    state.folders.map(f => ({
      ...f,
      isActive: f.id === activeId,
    })),
  [state.folders, activeId])

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      state.isDarkMode ? 'dark' : 'light',
    )
  }, [state.isDarkMode])

  // Poll for new emails every 15s
  const onNewMail = useCallback(() => {
    actions.refresh()
  }, [actions])

  useMailPolling(accountId, onNewMail)

  const navigateFolder = useCallback(
    (folderId: string) => {
      router.push(`/folder/${folderId}`)
    }, [router],
  )

  return (
    <Box className="mailbox-layout">
      <AppBar
        position="static"
        className="mailbox-header"
      >
        <Toolbar>
          <MailboxHeader
            searchQuery={state.searchQuery}
            onSearchChange={
              actions.setSearchQuery
            }
            isDarkMode={state.isDarkMode}
            onToggleTheme={() =>
              actions.setIsDarkMode(p => !p)
            }
            onMenuClick={() =>
              actions.setSidebarOpen(p => !p)
            }
            onSettingsClick={() => {}}
            onAlertsClick={() => {
              window.location.href = '/alerts'
            }}
            alertCount={state.unreadCount}
            locale="EN"
            onCycleLocale={() => {}}
          />
        </Toolbar>
      </AppBar>
      <Box className="mailbox-content">
        <aside
          className={
            `mailbox-sidebar` +
            (state.sidebarOpen
              ? ''
              : ' mailbox-sidebar--hidden')
          }
        >
          <MailboxSidebar
            folders={folders}
            onNavigate={navigateFolder}
            onCompose={() =>
              actions.setShowCompose(true)
            }
          />
        </aside>
        <main className="mailbox-main">
          {children}
        </main>
      </Box>
      <Toaster position="bottom-right" />
    </Box>
  )
}

export default function MailGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <EmailProvider>
      <MailLayout>{children}</MailLayout>
    </EmailProvider>
  )
}
