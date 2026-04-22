import React from 'react'
import { Box, BoxProps } from '../..'
import { MaterialIcon } from '../../../../icons/react/m3'
import { useAccessible } from '../../../../hooks/useAccessible'
import {
  FolderNavigation,
  type FolderNavigationItem,
} from '../navigation'
import { DrawerToolLinks } from
  '../../../../components/ui/DrawerToolLinks'

export interface MailboxSidebarProps extends BoxProps {
  folders: FolderNavigationItem[]
  onNavigate?: (folderId: string) => void
  onCompose?: () => void
  composeLabel?: string
  /** Current dark-mode state. */
  isDarkMode?: boolean
  /** Toggle light/dark theme. */
  onToggleTheme?: () => void
  testId?: string
}

export const MailboxSidebar = ({
  folders,
  onNavigate,
  onCompose,
  composeLabel = 'Compose',
  isDarkMode = false,
  onToggleTheme,
  testId: customTestId,
  ...props
}: MailboxSidebarProps) => {
  const accessible = useAccessible({
    feature: 'email',
    component: 'mailbox-sidebar',
    identifier: customTestId || 'sidebar',
  })

  return (
    <Box className="mailbox-sidebar-content"
      {...accessible} {...props}>

      {/* Compose */}
      {onCompose && (
        <Box className="mailbox-sidebar-compose">
          <button className="compose-btn"
            onClick={onCompose}>
            <MaterialIcon name="edit" size={20} />
            <span>{composeLabel}</span>
          </button>
        </Box>
      )}

      {/* Mail folders */}
      <FolderNavigation
        items={folders}
        onNavigate={onNavigate} />

      {/* Shared tools — same list as main app */}
      <DrawerToolLinks
        variant="mail"
        excludeUrls={['/emailclient']} />

      {/* Footer — theme toggle */}
      {onToggleTheme && (
        <Box className="mailbox-sidebar-footer">
          <button
            className="mailbox-theme-toggle"
            onClick={onToggleTheme}
            aria-label="Toggle theme">
            <MaterialIcon
              name={isDarkMode
                ? 'light_mode' : 'dark_mode'}
              size={20} />
            <span>
              {isDarkMode
                ? 'Light mode' : 'Dark mode'}
            </span>
          </button>
        </Box>
      )}
    </Box>
  )
}
