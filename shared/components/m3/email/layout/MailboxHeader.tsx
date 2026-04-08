import React from 'react'
import { Box, BoxProps, IconButton } from '../..'
import { MaterialIcon }
  from '../../../../icons/react/m3'
import { useAccessible }
  from '../../../../hooks/useAccessible'
import { MailboxHeaderActions }
  from './MailboxHeaderActions'
import { MailboxSearchBar }
  from './MailboxSearchBar'

export interface MailboxHeaderProps
  extends BoxProps {
  appName?: string
  searchQuery?: string
  onSearchChange?: (query: string) => void
  searchPlaceholder?: string
  avatarLabel?: string
  isDarkMode?: boolean
  onToggleTheme?: () => void
  onMenuClick?: () => void
  onSettingsClick?: () => void
  onAlertsClick?: () => void
  alertCount?: number
  locale?: string
  onCycleLocale?: () => void
  testId?: string
}

/**
 * Top header bar for the mailbox with
 * branding, search, and action buttons.
 */
export const MailboxHeader = ({
  appName = 'MetaMail',
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search mail',
  avatarLabel = 'U',
  isDarkMode = false,
  onToggleTheme, onMenuClick,
  onSettingsClick, onAlertsClick,
  alertCount = 0, locale = 'EN',
  onCycleLocale,
  testId: customTestId, ...props
}: MailboxHeaderProps) => {
  const accessible = useAccessible({
    feature: 'email',
    component: 'mailbox-header',
    identifier: customTestId || 'header',
  })
  return (
    <Box className="mailbox-header-bar"
      {...accessible} {...props}>
      <Box className="mailbox-header-left">
        {onMenuClick && (
          <IconButton aria-label="Menu"
            title="Menu" onClick={onMenuClick}
            className="mailbox-header-icon-btn">
            <MaterialIcon
              name="menu" size={22} />
          </IconButton>
        )}
        <Box className="mailbox-header-brand">
          <MaterialIcon name="mail" size={26}
            className="mailbox-header-logo" />
          <span
            className="mailbox-header-title">
            {appName}
          </span>
        </Box>
      </Box>
      <MailboxSearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder} />
      <MailboxHeaderActions
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
        onSettingsClick={onSettingsClick}
        onAlertsClick={onAlertsClick}
        alertCount={alertCount}
        locale={locale}
        onCycleLocale={onCycleLocale}
        avatarLabel={avatarLabel} />
    </Box>
  )
}
