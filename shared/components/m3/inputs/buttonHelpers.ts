import styles from '../../../scss/atoms/mat-button.module.scss'
import { ButtonProps } from './ButtonTypes'

/**
 * Resolve a class name through CSS Module styles.
 * Falls back to raw string if not found.
 */
export const s = (key: string): string =>
  styles[key] || key

/**
 * Map variant props to Angular Material button
 * class key.
 */
export const getButtonClass = (
  props: ButtonProps
): string => {
  const { variant, primary, secondary, outline, ghost } =
    props

  if (primary) return 'mat-mdc-unelevated-button'
  if (secondary) return 'mat-tonal-button'
  if (outline) return 'mat-mdc-outlined-button'
  if (ghost) return 'mat-mdc-button'

  switch (variant) {
    case 'filled':
    case 'primary':
    case 'contained':
      return 'mat-mdc-unelevated-button'
    case 'elevated':
      return 'mat-mdc-raised-button'
    case 'tonal':
    case 'secondary':
      return 'mat-tonal-button'
    case 'outlined':
    case 'outline':
      return 'mat-mdc-outlined-button'
    case 'text':
    case 'default':
    case 'ghost':
      return 'mat-mdc-button'
    case 'danger':
      return 'mat-mdc-unelevated-button'
    default:
      return 'mat-mdc-button'
  }
}

/**
 * Get color class key for Angular Material
 */
export const getColorClass = (
  props: ButtonProps
): string => {
  const { variant, color } = props

  if (variant === 'danger' || color === 'error')
    return 'mat-warn'
  if (color === 'secondary') return 'mat-accent'
  if (color === 'onPrimary') return 'mat-on-primary'
  return 'mat-primary'
}
