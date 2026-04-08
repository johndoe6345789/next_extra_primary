import styles
  from '../../../scss/atoms/mat-radio.module.scss'
import { classNames }
  from '../utils/classNames'
import type { RadioColor, RadioSize }
  from './RadioTypes'

const s = (key: string): string =>
  styles[key] || key

/**
 * Build root CSS classes for Radio component.
 * @param checked - Whether radio is checked.
 * @param disabled - Whether radio is disabled.
 * @param disableRipple - Whether to skip ripple.
 * @param size - Size variant.
 * @param color - Color variant.
 * @param error - Error state flag.
 * @param className - Extra class name.
 * @returns Joined class string.
 */
export function buildRadioRootClasses(
  checked: boolean | undefined,
  disabled: boolean | undefined,
  disableRipple: boolean,
  size: RadioSize,
  color: RadioColor,
  error: boolean,
  className?: string,
): string {
  return classNames(
    s('mat-mdc-radio-button'),
    s('matRadio'),
    {
      [s('mat-mdc-radio-checked')]: checked,
      [s('mat-mdc-radio-disabled')]: disabled,
      [s('_mat-animation-noopable')]:
        disableRipple,
      [s('sizeSm')]: size === 'sm',
      [s('sizeLg')]: size === 'lg',
      [s('colorSecondary')]:
        color === 'secondary',
      [s('colorError')]:
        color === 'error' || error,
      [s('colorSuccess')]:
        color === 'success',
      [s('colorWarning')]:
        color === 'warning',
    },
    className
  )
}
