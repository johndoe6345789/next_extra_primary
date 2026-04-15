'use client'

/**
 * Bundled header actions for every tool.
 *
 * Renders: [burger] ...spacer... [bell]
 * [theme toggle] [user bubble]
 *
 * The burger opens the shared AppDrawer with
 * cross-tool nav links. Tools drop this in
 * their AppBar/Toolbar right side and get a
 * uniform, consistent experience.
 */

import React, { useState } from 'react'
import { IconButton } from '../inputs/IconButton'
import { Menu as MenuIcon }
  from '../../../icons/react/m3/Menu'
import { AlertsBell } from './AlertsBell'
import { ThemeToggle } from './ThemeToggle'
import { UserBubble } from './UserBubble'
import { AppDrawer } from './AppDrawer'
import { AppLink } from './appDrawerLinks'

/** Props for AppHeaderActions. */
export interface AppHeaderActionsProps {
  /** Override the cross-app link list. */
  links?: AppLink[]
  /** Path of current app for highlight. */
  activePath?: string
  /** Override logout. */
  onLogout?: () => void
  /** Hide the burger button. */
  hideBurger?: boolean
  /** Hide the alerts bell. */
  hideBell?: boolean
  /** Hide the theme toggle. */
  hideTheme?: boolean
  /** Hide the user bubble. */
  hideUser?: boolean
  testId?: string
}

/** Pre-composed bell + theme + user + drawer. */
export const AppHeaderActions: React.FC<
  AppHeaderActionsProps
> = ({
  links, activePath, onLogout,
  hideBurger, hideBell,
  hideTheme, hideUser,
  testId = 'app-header-actions',
}) => {
  const [drawerOpen, setDrawerOpen] =
    useState(false)

  return (
    <span
      data-testid={testId}
      style={ROW_STYLE}
    >
      {!hideBurger && (
        <IconButton
          aria-label="Open app menu"
          onClick={() => setDrawerOpen(true)}
          testId={`${testId}-burger`}
        >
          <MenuIcon size={24} />
        </IconButton>
      )}
      {!hideBell && <AlertsBell />}
      {!hideTheme && <ThemeToggle />}
      {!hideUser && (
        <UserBubble onLogout={onLogout} />
      )}
      <AppDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        links={links}
        activePath={activePath}
      />
    </span>
  )
}

const ROW_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
}

export default AppHeaderActions
