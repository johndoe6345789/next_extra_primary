import { classNames } from '../utils/classNames'
import styles
  from '../../../scss/atoms/statBadge.module.scss'
import {
  resolveStatus, statusClasses, colorClasses,
} from './statBadgeClasses'
import type {
  StatBadgeSize, StatBadgeColor,
  StatBadgeStatus,
} from './statBadgeClasses'

/**
 * Build the full CSS class string for a badge.
 * @param size - Badge size variant.
 * @param status - Resolved status.
 * @param color - Color variant.
 * @param filled - Whether filled style.
 * @param dot - Dot mode.
 * @param pulse - Pulse animation.
 * @param withIcon - Has icon prefix.
 * @param overflow - Overflow mode.
 * @param className - Extra classes.
 * @returns Combined CSS class string.
 */
export function buildBadgeClasses(
  size: StatBadgeSize,
  status: StatBadgeStatus | undefined,
  color: StatBadgeColor | undefined,
  filled: boolean,
  dot: boolean,
  pulse: boolean,
  withIcon: boolean,
  overflow: boolean,
  className?: string
): string {
  return classNames(
    styles.statBadge,
    {
      [styles.statBadgeSm]: size === 'sm',
      [styles.statBadgeLg]: size === 'lg',
    },
    status && statusClasses(status, filled),
    !status && color &&
      colorClasses(color, filled),
    {
      [styles.statBadgeDot]: dot,
      [styles.statBadgePulse]: pulse,
      [styles.statBadgeWithIcon]: withIcon,
      [styles.statBadgeOverflow]: overflow,
    },
    className
  )
}
