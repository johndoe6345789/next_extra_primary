import React from 'react'
import { Box, IconButton } from '../..'
import { MaterialIcon }
  from '../../../../icons/react/m3'
import { MailboxAlertButton }
  from './MailboxAlertButton'

export interface MailboxHeaderActionsProps {
  isDarkMode: boolean
  onToggleTheme?: () => void
  onSettingsClick?: () => void
  onAlertsClick?: () => void
  alertCount: number
  locale: string
  onCycleLocale?: () => void
  avatarLabel: string
}

/**
 * Right-side action buttons for the mailbox
 * header (alerts, theme, lang, settings).
 */
export const MailboxHeaderActions = ({
  isDarkMode, onToggleTheme,
  onSettingsClick, onAlertsClick,
  alertCount, locale,
  onCycleLocale, avatarLabel,
}: MailboxHeaderActionsProps) => (
  <Box className="mailbox-header-actions">
    <MailboxAlertButton
      onAlertsClick={onAlertsClick}
      alertCount={alertCount} />
    {onToggleTheme && (
      <IconButton
        aria-label={isDarkMode
          ? 'Switch to light mode'
          : 'Switch to dark mode'}
        title={isDarkMode
          ? 'Light mode' : 'Dark mode'}
        onClick={onToggleTheme}
        className="mailbox-header-icon-btn">
        <MaterialIcon
          name={isDarkMode
            ? 'light_mode' : 'dark_mode'}
          size={20} />
      </IconButton>
    )}
    {onCycleLocale && (
      <button
        className="mailbox-header-lang-btn"
        onClick={onCycleLocale}
        aria-label="Change language"
        title="Change language">
        <MaterialIcon
          name="language" size={16} />
        <span>{locale}</span>
      </button>
    )}
    {onSettingsClick && (
      <IconButton aria-label="Settings"
        title="Settings"
        onClick={onSettingsClick}
        className="mailbox-header-icon-btn">
        <MaterialIcon
          name="settings" size={20} />
      </IconButton>
    )}
    <Box className="mailbox-header-avatar"
      aria-label="Account">
      {avatarLabel}
    </Box>
  </Box>
)
