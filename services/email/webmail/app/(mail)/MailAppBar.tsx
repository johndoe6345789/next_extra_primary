'use client'

/**
 * Mail app bar with search, theme, and alerts.
 * @module MailAppBar
 */

import { MailboxHeader } from '@shared/m3/email'
import { AppBar, Toolbar } from '@shared/m3'

interface MailAppBarProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onMenuClick: () => void;
  unreadCount: number;
}

/**
 * Top app bar for the mailbox shell.
 * @param props - Header control callbacks.
 */
export function MailAppBar({
  searchQuery,
  onSearchChange,
  isDarkMode,
  onToggleTheme,
  onMenuClick,
  unreadCount,
}: MailAppBarProps) {
  return (
    <AppBar
      position="static"
      className="mailbox-header"
    >
      <Toolbar>
        <MailboxHeader
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          isDarkMode={isDarkMode}
          onToggleTheme={onToggleTheme}
          onMenuClick={onMenuClick}
          onSettingsClick={() => {}}
          onAlertsClick={() => {
            window.location.href = '/alerts'
          }}
          alertCount={unreadCount}
          locale="EN"
          onCycleLocale={() => {}}
        />
      </Toolbar>
    </AppBar>
  )
}
