import React from 'react'
import { resolveStatus } from './statBadgeClasses'
import { buildBadgeClasses }
  from './statBadgeBuilder'
import type {
  StatBadgeSize, StatBadgeColor,
  StatBadgeStatus,
} from './statBadgeClasses'

export type {
  StatBadgeSize, StatBadgeColor,
  StatBadgeStatus,
}

export interface StatBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
  size?: StatBadgeSize
  color?: StatBadgeColor
  status?: StatBadgeStatus
  filled?: boolean
  dot?: boolean
  pulse?: boolean
  withIcon?: boolean
  overflow?: boolean
  /** @deprecated Use status="pending" */
  pending?: boolean
  /** @deprecated Use status="success" */
  success?: boolean
  /** @deprecated Use status="error" */
  error?: boolean
  /** @deprecated Use status="info" */
  info?: boolean
  testId?: string
}

/** Status badge with M3 color/size variants. */
export const StatBadge: React.FC<
  StatBadgeProps
> = ({
  children, size = 'md', color, status,
  filled = false, dot = false,
  pulse = false, withIcon = false,
  overflow = false,
  pending, success, error, info,
  testId, className, ...props
}) => {
  const resolved = resolveStatus(
    status, pending, success, error, info
  )
  const badgeClasses = buildBadgeClasses(
    size, resolved, color, filled,
    dot, pulse, withIcon, overflow, className
  )
  return (
    <span className={badgeClasses}
      data-testid={testId} {...props}>
      {children}
    </span>
  )
}
