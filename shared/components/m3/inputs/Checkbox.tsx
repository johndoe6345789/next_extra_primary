'use client';
import React, { forwardRef, useId } from 'react'
import { classNames } from '../utils/classNames'
import { useAccessible } from '../../../hooks/useAccessible'
import styles from '../../../scss/atoms/mat-checkbox.module.scss'
import { CheckboxProps } from './CheckboxTypes'

export type { CheckboxColor, CheckboxSize, CheckboxProps } from './CheckboxTypes'

const s = (key: string): string => styles[key] || key

/** Checkbox using Angular Material M3 structure */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, color = 'primary', size = 'md', error = false,
     disabled, indeterminate = false, id: providedId, testId, ...props }, ref) => {
    const autoId = useId()
    const id = providedId ?? autoId
    const accessible = useAccessible({ feature: 'form', component: 'checkbox', identifier: testId || String(label) })

    const rootClasses = classNames(s('mat-mdc-checkbox'), s('matCheckbox'), {
      [s('mat-mdc-checkbox-disabled')]: disabled, [s('sizeSm')]: size === 'sm',
      [s('sizeLg')]: size === 'lg', [s('colorSecondary')]: color === 'secondary',
      [s('colorError')]: color === 'error' || error, [s('colorSuccess')]: color === 'success',
      [s('colorWarning')]: color === 'warning',
    }, className)

    const mdcClasses = classNames(s('mdc-checkbox'), { [s('mdc-checkbox--disabled')]: disabled })

    return (
      <div className={rootClasses} data-testid={accessible['data-testid']}>
        <div className={s('mat-internal-form-field')}>
          <div className={mdcClasses}>
            <input ref={ref} type="checkbox" id={id} className={s('mdc-checkbox__native-control')}
              disabled={disabled} aria-checked={indeterminate ? 'mixed' : undefined} {...props} />
            <div className={s('mdc-checkbox__ripple')} />
            <div className={s('mdc-checkbox__background')}>
              <svg className={s('mdc-checkbox__checkmark')} viewBox="0 0 24 24" aria-hidden="true">
                <path className={s('mdc-checkbox__checkmark-path')} fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
              </svg>
              <div className={s('mdc-checkbox__mixedmark')} />
            </div>
            <div className={s('mat-mdc-checkbox-touch-target')} />
            <div className={s('mat-mdc-checkbox-ripple')} />
          </div>
          {label && <label htmlFor={id}>{label}</label>}
        </div>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
