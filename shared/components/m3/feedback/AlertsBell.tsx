'use client'

/**
 * Shared alerts bell for every tool's header.
 *
 * Renders a bell icon with a live unread-count
 * badge and navigates to /alerts on click. Works
 * inside any Next.js basePath via absolute URLs.
 */

import React from 'react'
import { Bell } from '../../../icons/react/m3/Bell'
import { IconButton } from '../inputs/IconButton'
import {
  useAlertsBell, UseAlertsBellOptions,
} from './useAlertsBell'
import {
  WRAP_STYLE, BADGE_STYLE,
} from './AlertsBellStyles'

/** Props for AlertsBell. */
export interface AlertsBellProps
  extends UseAlertsBellOptions {
  /** Override the click target. */
  href?: string
  /** data-testid for automation. */
  testId?: string
  /** Icon size in px. */
  size?: number
}

/**
 * Bell button that navigates to the alerts centre
 * and shows the unread count as a badge.
 */
export const AlertsBell: React.FC<AlertsBellProps> = ({
  href = '/alerts',
  testId = 'alerts-bell',
  size = 24,
  computeUnread,
  paused,
}) => {
  const { unreadCount } = useAlertsBell({
    computeUnread, paused,
  })
  const label =
    unreadCount > 0
      ? `${unreadCount} unread alerts`
      : 'No unread alerts'

  const go = () => {
    // Absolute href — bypasses Next.js basePath so
    // it reaches the portal-level /alerts route.
    window.location.href = href
  }

  if (unreadCount === 0) {
    return (
      <IconButton
        aria-label={label}
        onClick={go}
        testId={testId}
      >
        <Bell size={size} />
      </IconButton>
    )
  }

  const display =
    unreadCount > 99 ? '99+' : String(unreadCount)

  return (
    <span
      data-testid={`${testId}-wrap`}
      style={WRAP_STYLE}
    >
      <IconButton
        aria-label={label}
        onClick={go}
        testId={testId}
      >
        <Bell size={size} />
      </IconButton>
      <span style={BADGE_STYLE} aria-hidden="true">
        {display}
      </span>
    </span>
  )
}

export default AlertsBell
