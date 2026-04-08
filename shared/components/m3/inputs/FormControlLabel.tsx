'use client'

import React, { forwardRef } from 'react'
import {
  FormControlLabelProps,
} from './FormControlLabelTypes'
import {
  cloneControlWithDisabled,
  buildFCLClass,
} from './formControlLabelUtils'

export type { FormControlLabelProps }
  from './FormControlLabelTypes'

/** FormControlLabel - control with label */
export const FormControlLabel = forwardRef<
  HTMLLabelElement, FormControlLabelProps
>((
  {
    control, label, disabled = false,
    labelPlacement = 'end',
    testId, className = '', sx, ...props
  },
  ref
) => {
  const controlEl =
    cloneControlWithDisabled(control, disabled)
  const labelEl = (
    <span className={
      `form-control-label__label${
        disabled
          ? ' form-control-label__label--disabled'
          : ''
      }`
    }>
      {label}
    </span>
  )
  const before =
    labelPlacement === 'start'
    || labelPlacement === 'top'
  return (
    <label ref={ref}
      className={buildFCLClass(
        labelPlacement, disabled, className)}
      data-testid={testId} {...props}>
      {before ? (
        <>{labelEl}{controlEl}</>
      ) : (
        <>{controlEl}{labelEl}</>
      )}
    </label>
  )
})

FormControlLabel.displayName =
  'FormControlLabel'
