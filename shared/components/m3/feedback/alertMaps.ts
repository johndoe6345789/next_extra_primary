import styles
  from '../../../scss/atoms/alert.module.scss'
import type { AlertSeverity, AlertVariant }
  from './AlertTypes'

/** Default icon for each severity. */
export const defaultIconMap: Record<
  AlertSeverity, string
> = {
  error: '\u2715',
  warning: '\u26A0',
  info: '\u2139',
  success: '\u2713',
}

/** CSS class for each severity. */
export const severityMap: Record<
  AlertSeverity, string
> = {
  error: styles.alertError,
  warning: styles.alertWarning,
  info: styles.alertInfo,
  success: styles.alertSuccess,
}

/** CSS class for each variant. */
export const variantMap: Record<
  AlertVariant, string | undefined
> = {
  standard: undefined,
  filled: styles.alertFilled,
  outlined: styles.alertOutlined,
}
