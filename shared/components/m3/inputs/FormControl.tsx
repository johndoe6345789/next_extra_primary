'use client'

import React, {
  forwardRef,
  createContext,
  useContext,
  useMemo,
  useId,
} from 'react'
import {
  FormControlContextValue,
  FormControlProps,
} from './FormControlTypes'
import { buildFormControlClass }
  from './formControlClasses'

export type {
  FormControlContextValue,
  FormControlProps,
} from './FormControlTypes'

const FormControlContext =
  createContext<FormControlContextValue>({})

/** Hook to access FormControl context */
export const useFormControl = () =>
  useContext(FormControlContext)

/** FormControl - context provider for inputs */
export const FormControl = forwardRef<
  HTMLDivElement, FormControlProps
>((
  {
    children, required = false,
    disabled = false, error = false,
    fullWidth = false, margin = 'none',
    size = 'medium', variant = 'outlined',
    filled = false, focused = false,
    testId, className = '', sx, ...props
  },
  ref
) => {
  const id = useId()
  const contextValue = useMemo(
    () => ({
      id, required, disabled,
      error, filled, focused,
    }),
    [id, required, disabled,
      error, filled, focused]
  )
  const cls = buildFormControlClass(
    variant, size, margin, fullWidth,
    required, disabled, error,
    focused, className)
  return (
    <FormControlContext.Provider
      value={contextValue}>
      <div ref={ref} className={cls}
        data-testid={testId} {...props}>
        {children}
      </div>
    </FormControlContext.Provider>
  )
})

FormControl.displayName = 'FormControl'
