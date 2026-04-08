import {
  cloneElement, isValidElement,
} from 'react'
import type { ReactElement } from 'react'

/**
 * Clone control element and merge disabled.
 * @param control - The control element.
 * @param disabled - Disabled flag.
 * @returns Cloned element with merged props.
 */
export function cloneControlWithDisabled(
  control: ReactElement,
  disabled: boolean,
): ReactElement {
  if (!isValidElement(control)) return control
  return cloneElement(control, {
    ...(control.props as Record<
      string, unknown
    >),
    disabled:
      disabled
      || (control.props as Record<
        string, unknown
      >).disabled,
  } as Partial<typeof control.props>)
}

/**
 * Build form-control-label class string.
 * @param placement - Label placement.
 * @param disabled - Disabled flag.
 * @param className - Extra class name.
 * @returns Joined class string.
 */
export function buildFCLClass(
  placement: string,
  disabled: boolean,
  className: string,
): string {
  return [
    'form-control-label',
    `form-control-label--${placement}`,
    disabled
      ? 'form-control-label--disabled' : '',
    className,
  ].filter(Boolean).join(' ')
}
