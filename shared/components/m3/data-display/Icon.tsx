import React from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/atoms/mat-icon.module.scss'
import { IconProps, IconSize, IconColor, IconVariant } from './IconTypes'

export type {
  IconSize,
  IconColor,
  IconVariant,
  IconProps,
} from './IconTypes'

const sizeMap: Record<IconSize, string> = {
  xs: styles.iconXs,
  sm: styles.iconSm,
  md: styles.iconMd,
  lg: styles.iconLg,
  xl: styles.iconXl,
  xxl: styles.iconXxl,
}

const colorMap: Record<IconColor, string> = {
  primary: styles.iconPrimary,
  secondary: styles.iconSecondary,
  tertiary: styles.iconTertiary,
  error: styles.iconError,
  success: styles.iconSuccess,
  warning: styles.iconWarning,
  info: styles.iconInfo,
  onSurface: styles.iconOnSurface,
  onSurfaceVariant: styles.iconOnSurfaceVariant,
  inverse: styles.iconInverse,
}

const variantMap: Record<IconVariant, string> = {
  filled: styles.iconFilled,
  filledTonal: styles.iconFilledTonal,
  outlined: styles.iconOutlined,
}

/**
 * Icon - M3 styled icon wrapper
 */
export const Icon: React.FC<IconProps> = ({
  children,
  size,
  color,
  variant,
  disabled = false,
  button = false,
  sm,
  lg,
  testId,
  className,
  ...props
}) => {
  const resolved =
    size ?? (sm ? 'sm' : lg ? 'lg' : undefined)

  const cls = classNames(
    styles.icon,
    resolved && sizeMap[resolved],
    color && colorMap[color],
    variant && variantMap[variant],
    {
      [styles.iconDisabled]: disabled,
      [styles.iconButton]: button,
    },
    className
  )

  return (
    <span
      className={cls}
      data-testid={testId}
      aria-hidden="true"
      {...props}
    >
      {children}
    </span>
  )
}
