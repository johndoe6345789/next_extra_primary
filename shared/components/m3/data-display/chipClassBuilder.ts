import styles
  from '../../../scss/atoms/mat-chip.module.scss'

/**
 * Build Chip CSS class array.
 * @param opts - Chip configuration flags.
 * @returns Array of CSS class strings.
 */
export function buildChipClasses(opts: {
  clickable?: boolean
  variant?: string
  outline?: boolean
  color?: string
  success?: boolean
  error?: boolean
  warning?: boolean
  info?: boolean
  size?: string
  sm?: boolean
  onDelete?: boolean
  disabled?: boolean
  className?: string
}): string[] {
  const cls: string[] = [styles.chip]
  if (opts.clickable)
    cls.push(styles.chipClickable)
  if (opts.variant === 'outlined'
    || opts.outline)
    cls.push(styles.chipOutlined)
  if (opts.color === 'primary')
    cls.push(styles.chipPrimary)
  else if (opts.color === 'secondary')
    cls.push(styles.chipSecondary)
  else if (opts.color === 'success'
    || opts.success)
    cls.push(styles.chipSuccess)
  else if (opts.color === 'error'
    || opts.error)
    cls.push(styles.chipError)
  else if (opts.color === 'warning'
    || opts.warning)
    cls.push(styles.chipWarning)
  else if (opts.color === 'info' || opts.info)
    cls.push(styles.chipInfo)
  if (opts.size === 'small' || opts.sm)
    cls.push(styles.chipSmall)
  if (opts.onDelete)
    cls.push(styles.chipDeletable)
  if (opts.disabled)
    cls.push(styles.chipDisabled)
  if (opts.className)
    cls.push(opts.className)
  return cls
}
