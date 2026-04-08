'use client'

import React, {
  forwardRef,
  createContext,
  useContext,
  useMemo,
  useId,
} from 'react'
import type {
  FormControlContextValue,
  FormControlProps,
} from './formControlTypes'
import { buildFormControlClasses } from './formControlClasses'

export type {
  FormControlContextValue,
  FormControlProps,
} from './formControlTypes'

const FormControlContext =
  createContext<FormControlContextValue>({})

/** Access FormControl context */
export const useFormControl = () =>
  useContext(FormControlContext)

/**
 * FormControl - Provides context to form
 * input components for consistent state
 */
export const FormControl = forwardRef<
  HTMLDivElement,
  FormControlProps
>(
  (
    {
      children,
      required = false,
      disabled = false,
      error = false,
      fullWidth = false,
      margin = 'none',
      size = 'medium',
      variant = 'outlined',
      filled = false,
      focused = false,
      className = '',
      sx,
      ...props
    },
    ref
  ) => {
    const id = useId()

    const ctx = useMemo(
      () => ({
        id, required, disabled,
        error, filled, focused,
      }),
      [id, required, disabled, error, filled, focused]
    )

    const classes = buildFormControlClasses({
      variant, size, margin, fullWidth,
      required, disabled, error, focused,
      className,
    })

    return (
      <FormControlContext.Provider value={ctx}>
        <div
          ref={ref}
          className={classes}
          {...props}
        >
          {children}
        </div>
      </FormControlContext.Provider>
    )
  }
)

FormControl.displayName = 'FormControl'
