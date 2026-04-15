'use client'

/**
 * Shared alerts bell for every tool's header.
 *
 * Renders a bell icon anchor with a live unread
 * badge that cross-navigates to the portal-level
 * /alerts route. Using an anchor (not onClick +
 * window.location) preserves middle-click,
 * cmd-click, screen readers, and SSO state.
 */

import React from 'react'
import { Bell } from '../../../icons/react/m3/Bell'
import { Link } from '../navigation/Link'
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
 * Bell anchor that navigates to the alerts
 * centre and shows the unread count as a badge.
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
  const isExternal = /^https?:\/\//.test(href)
  const rel = isExternal
    ? 'noopener noreferrer'
    : undefined

  const anchor = (
    <Link
      href={href}
      aria-label={label}
      testId={testId}
      rel={rel}
      underline="none"
    >
      <Bell size={size} />
    </Link>
  )

  if (unreadCount === 0) return anchor

  const display =
    unreadCount > 99 ? '99+' : String(unreadCount)

  return (
    <span
      data-testid={`${testId}-wrap`}
      style={WRAP_STYLE}
    >
      {anchor}
      <span style={BADGE_STYLE} aria-hidden="true">
        {display}
      </span>
    </span>
  )
}

export default AlertsBell
