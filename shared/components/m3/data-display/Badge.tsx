import React from 'react'
import styles from '../../../scss/atoms/mat-badge.module.scss'
import { BadgeProps } from './BadgeTypes'

export type { BadgeColor, BadgeSize, BadgePosition, BadgeVariant, OverlapShape, BadgeProps } from './BadgeTypes'

const sizeMap: Record<string, string> = {
  sm: 'mat-badge-small', md: 'mat-badge-medium', lg: 'mat-badge-large',
}
const posMap: Record<string, string> = {
  topRight: 'mat-badge-above mat-badge-after', topLeft: 'mat-badge-above mat-badge-before',
  bottomRight: 'mat-badge-below mat-badge-after', bottomLeft: 'mat-badge-below mat-badge-before',
  inline: '',
}

/** Badge - notification indicator */
export const Badge: React.FC<BadgeProps> = ({
  children, content, testId, dot = false, invisible = false, max,
  color = 'error', size = 'md', position = 'topRight', variant = 'standard',
  overlap, pulse = false, className = '', ...props
}) => {
  const cls = [
    styles.matBadge, 'mat-badge', sizeMap[size], posMap[position],
    overlap === 'circular' && 'mat-badge-overlap', invisible && 'mat-badge-hidden',
    color === 'primary' && styles.badgePrimary, color === 'secondary' && styles.badgeSecondary,
    color === 'tertiary' && styles.badgeTertiary, color === 'success' && styles.badgeSuccess,
    color === 'warning' && styles.badgeWarning, color === 'info' && styles.badgeInfo,
    color === 'surface' && styles.badgeSurface, variant === 'outlined' && styles.badgeOutlined,
    pulse && styles.badgePulse, position === 'inline' && styles.badgeInline, className,
  ].filter(Boolean).join(' ')

  const contentCls = ['mat-badge-content', 'mat-badge-active', dot && 'mat-badge-small'].filter(Boolean).join(' ')
  const displayContent = dot ? null : (max !== undefined && typeof content === 'number' && content > max) ? `${max}+` : content

  return (
    <span className={cls} data-testid={testId} {...props}>
      {children}
      <span className={contentCls}>{displayContent}</span>
    </span>
  )
}

export default Badge
