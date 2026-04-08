import styles from '../../../scss/atoms/statBadge.module.scss'

export type StatBadgeSize = 'sm' | 'md' | 'lg'
export type StatBadgeColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'neutral'
export type StatBadgeStatus =
  | 'pending'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'

/**
 * Resolve status from legacy boolean props.
 */
export function resolveStatus(
  status: StatBadgeStatus | undefined,
  pending?: boolean,
  success?: boolean,
  error?: boolean,
  info?: boolean
): StatBadgeStatus | undefined {
  if (status) return status
  if (pending) return 'pending'
  if (success) return 'success'
  if (error) return 'error'
  if (info) return 'info'
  return undefined
}

/**
 * Build status CSS class map.
 */
export function statusClasses(
  resolved: StatBadgeStatus | undefined,
  filled: boolean
): Record<string, boolean> {
  if (!resolved) return {}
  return {
    [styles.statBadgeFilledSuccess]:
      filled && resolved === 'success',
    [styles.statBadgeFilledError]:
      filled && resolved === 'error',
    [styles.statBadgeFilledWarning]:
      filled && resolved === 'warning',
    [styles.statBadgeFilledInfo]:
      filled && resolved === 'info',
    [styles.statBadgeFilledPrimary]:
      filled && resolved === 'pending',
    [styles.statBadgePending]:
      !filled && resolved === 'pending',
    [styles.statBadgeSuccess]:
      !filled && resolved === 'success',
    [styles.statBadgeError]:
      !filled && resolved === 'error',
    [styles.statBadgeWarning]:
      !filled && resolved === 'warning',
    [styles.statBadgeInfo]:
      !filled && resolved === 'info',
  }
}

/**
 * Build color CSS class map (no status).
 */
export function colorClasses(
  color: StatBadgeColor | undefined,
  filled: boolean
): Record<string, boolean> {
  if (!color) return {}
  return {
    [styles.statBadgePrimary]:
      !filled && color === 'primary',
    [styles.statBadgeSecondary]:
      !filled && color === 'secondary',
    [styles.statBadgeTertiary]:
      !filled && color === 'tertiary',
    [styles.statBadgeNeutral]:
      !filled && color === 'neutral',
    [styles.statBadgeFilledPrimary]:
      filled && color === 'primary',
  }
}
