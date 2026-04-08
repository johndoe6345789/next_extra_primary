import type React from 'react'

/** Props for the AccessDenied component. */
export interface AccessDeniedProps {
  /** Required permission level for the resource */
  requiredLevel: number
  /** User's current permission level */
  userLevel: number
  /** Custom title text */
  title?: string
  /** Custom message text */
  message?: string
  /** URL to navigate when clicking "Return Home" */
  homeUrl?: string
  /** Custom level names map */
  levelNames?: Record<number, string>
  /** CSS class name for custom styling */
  className?: string
  /** Custom style overrides */
  style?: React.CSSProperties
}

/** Default permission level names. */
export const DEFAULT_LEVEL_NAMES: Record<
  number, string
> = {
  0: 'Public',
  1: 'User',
  2: 'Moderator',
  3: 'Admin',
  4: 'God',
  5: 'Supergod',
}
