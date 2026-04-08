import styles
  from '../../../scss/atoms/mat-progress.module.scss'

/** Color class map for progress bars. */
export const progressColorMap: Record<
  string, string
> = {
  primary: '',
  secondary: styles.colorSecondary,
  tertiary: styles.colorTertiary,
  success: styles.colorSuccess,
  warning: styles.colorWarning,
  error: styles.colorError,
  info: styles.colorInfo,
}

/** Size class map for progress bars. */
export const progressSizeMap: Record<
  string, string
> = {
  thin: styles.thin,
  default: '',
  thick: styles.thick,
}
