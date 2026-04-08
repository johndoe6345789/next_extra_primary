/**
 * Alert - severity-based notification banner
 * with title, actions, and close button.
 */

import React from 'react'
import styles
  from '../../../scss/atoms/alert.module.scss'
import type {
  AlertProps, AlertTitleProps,
  AlertDescriptionProps,
} from './AlertTypes'
import {
  defaultIconMap, severityMap, variantMap,
} from './alertMaps'

export type {
  AlertProps, AlertSeverity,
  AlertVariant, AlertTitleProps,
  AlertDescriptionProps,
} from './AlertTypes'

/** Alert banner with severity and actions. */
export const Alert: React.FC<AlertProps> = ({
  children, title, severity = 'info',
  icon, action, variant = 'standard',
  onClose, testId, className = '', ...props
}) => {
  const cls = [
    styles.alert, severityMap[severity],
    variantMap[variant], className,
  ].filter(Boolean).join(' ')
  const label = props['aria-label']
    || `${severity.charAt(0).toUpperCase()
      + severity.slice(1)} alert`
  return (
    <div className={cls} role="alert"
      aria-live="assertive"
      aria-label={label}
      data-testid={testId} {...props}>
      {icon !== false && (
        <span className={styles.alertIcon}>
          {icon || defaultIconMap[severity]}
        </span>
      )}
      <div className={styles.alertContent}>
        {title && (
          <AlertTitle>{title}</AlertTitle>
        )}
        {children}
      </div>
      {action && (
        <div className={styles.alertActions}>
          {action}
        </div>
      )}
      {onClose && (
        <button className={styles.alertClose}
          onClick={onClose}
          aria-label="Close">
          &times;
        </button>
      )}
    </div>
  )
}

/** Title row inside an Alert. */
export const AlertTitle: React.FC<
  AlertTitleProps
> = ({ children, className = '',
  ...props }) => (
  <div className={
    `${styles.alertTitle} ${className}`.trim()
  } {...props}>{children}</div>
)

/** Description paragraph inside an Alert. */
export const AlertDescription: React.FC<
  AlertDescriptionProps
> = ({ children, className = '',
  ...props }) => (
  <p className={
    `${styles.alertMessage} ${className}`.trim()
  } {...props}>{children}</p>
)

export default Alert
