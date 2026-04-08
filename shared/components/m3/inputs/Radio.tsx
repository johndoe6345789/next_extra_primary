'use client';
import React, { forwardRef, useId } from 'react'
import { classNames } from '../utils/classNames'
import styles
  from '../../../scss/atoms/mat-radio.module.scss'
import { RadioProps } from './RadioTypes'
import { buildRadioRootClasses }
  from './radioClassBuilder'

export type {
  RadioColor, RadioSize, RadioProps,
} from './RadioTypes'

const s = (key: string): string =>
  styles[key] || key

/** Radio component using M3 styling. */
export const Radio = forwardRef<
  HTMLInputElement, RadioProps
>((
  {
    label, className, color = 'primary',
    size = 'md', error = false, disabled,
    checked, disableRipple = false,
    testId, id: providedId, ...props
  },
  ref
) => {
  const autoId = useId()
  const id = providedId ?? autoId
  const rootClasses = buildRadioRootClasses(
    checked, disabled, disableRipple,
    size, color, error, className)
  const mdcClasses = classNames(
    s('mdc-radio'),
    { [s('mdc-radio--disabled')]: disabled })
  return (
    <div className={rootClasses}
      data-testid={testId}>
      <div className={mdcClasses}>
        <input ref={ref} type="radio"
          id={id}
          className={
            s('mdc-radio__native-control')
          }
          disabled={disabled}
          checked={checked} {...props} />
        <div className={
          s('mdc-radio__background')
        }>
          <div className={
            s('mdc-radio__outer-circle')
          } />
          <div className={
            s('mdc-radio__inner-circle')
          } />
        </div>
        {!disableRipple && (
          <div className={classNames(
            s('mat-radio-ripple'),
            s('mat-focus-indicator'))}>
            <span className={
              s('mat-ripple-element')
            } />
          </div>
        )}
      </div>
      <div className={
        s('mat-mdc-radio-touch-target')
      } />
      {label && (
        <label className={
          s('mat-internal-form-field')
        } htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  )
})

Radio.displayName = 'Radio'
