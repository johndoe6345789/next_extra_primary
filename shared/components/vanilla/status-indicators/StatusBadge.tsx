import React from 'react'
import type { StatusBadgeProps } from './types'
import { variantStyles } from './statusStyles'

/**
 * Generic status badge component.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant,
  label,
  icon,
  showDot,
  className,
  tooltip,
}) => {
  const styles = variantStyles[variant]

  const badge = (
    <div
      role="status"
      aria-label={`Status: ${label}`}
      data-testid="status-badge"
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '9999px',
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        color: styles.text,
        fontSize: '12px',
        fontWeight: 500,
      }}
    >
      {icon && (
        <span style={{
          display: 'flex', alignItems: 'center',
        }}>
          {icon}
        </span>
      )}
      <span>{label}</span>
      {showDot && (
        <span
          aria-hidden="true"
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: styles.dot,
            animation:
              'status-pulse 2s ease-in-out infinite',
          }}
        />
      )}
    </div>
  )

  if (tooltip) {
    return <span title={tooltip}>{badge}</span>
  }

  return badge
}
