'use client'

/**
 * Shared user-bubble with popover.
 *
 * Reads the current user from localStorage,
 * shows a circle with initials, and opens an
 * M3 menu with username + logout.
 */

import React, {
  useState, useEffect, useCallback,
} from 'react'
import { IconButton } from '../inputs/IconButton'
import { Menu } from '../navigation/Menu'
import { MenuItem } from '../navigation/MenuItem'
import { Logout }
  from '../../../icons/react/m3/Logout'
import {
  BUBBLE_STYLE, NAME_STYLE,
} from './UserBubbleStyles'
import {
  UserShape, readUser, defaultLogout,
  initials, userLabel,
} from './userBubbleHelpers'

/** Props for UserBubble. */
export interface UserBubbleProps {
  onLogout?: () => void
  user?: UserShape | null
  testId?: string
}

/** Avatar circle that opens a user menu. */
export const UserBubble: React.FC<
  UserBubbleProps
> = ({
  onLogout, user, testId = 'user-bubble',
}) => {
  const [el, setEl] =
    useState<HTMLElement | null>(null)
  const [resolved, setResolved] =
    useState<UserShape | null>(user ?? null)

  useEffect(() => {
    if (user === undefined) {
      setResolved(readUser())
    }
  }, [user])

  const close = useCallback(
    () => setEl(null), [],
  )
  const handleLogout = useCallback(() => {
    close()
    ;(onLogout ?? defaultLogout)()
  }, [onLogout, close])

  const label = userLabel(resolved)

  return (
    <>
      <IconButton
        aria-label={`User menu — ${label}`}
        onClick={(e) => setEl(e.currentTarget)}
        testId={testId}
      >
        <span style={BUBBLE_STYLE}>
          {initials(resolved)}
        </span>
      </IconButton>
      <Menu
        anchorEl={el}
        open={!!el}
        onClose={close}
        anchorRight
      >
        <MenuItem disabled>
          <span style={NAME_STYLE}>{label}</span>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Logout size={18} />
          &nbsp;Sign out
        </MenuItem>
      </Menu>
    </>
  )
}

export default UserBubble
