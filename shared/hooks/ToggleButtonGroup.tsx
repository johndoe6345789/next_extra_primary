import React, {
  forwardRef,
  createContext,
  useContext,
} from 'react'
import type {
  ToggleButtonGroupContextValue,
  ToggleButtonGroupProps,
} from './toggleButtonGroupTypes'
import {
  computeToggleValue,
  buildGroupClasses,
} from './toggleButtonGroupChange'

export type {
  ToggleButtonGroupContextValue,
  ToggleButtonGroupProps,
} from './toggleButtonGroupTypes'

const ToggleButtonGroupContext =
  createContext<ToggleButtonGroupContextValue | null>(null)

/** Access toggle button group context */
export const useToggleButtonGroup = () =>
  useContext(ToggleButtonGroupContext)

/** Groups toggle buttons with shared state */
export const ToggleButtonGroup = forwardRef<
  HTMLDivElement, ToggleButtonGroupProps
>((
  {
    children, value, defaultValue, onChange,
    exclusive = false, disabled = false,
    size = 'medium', orientation = 'horizontal',
    fullWidth = false, color = 'standard',
    className = '', ...props
  },
  ref
) => {
  const [internalValue, setInternalValue] =
    React.useState<string | string[] | null>(
      defaultValue ?? (exclusive ? null : [])
    )
  const cur = value !== undefined ? value : internalValue

  const handleChange = (
    event: React.MouseEvent,
    buttonValue: string
  ) => {
    const nv = computeToggleValue(cur, buttonValue, exclusive)
    if (value === undefined) setInternalValue(nv)
    onChange?.(event, nv)
  }

  const ctx: ToggleButtonGroupContextValue = {
    value: cur, exclusive, disabled,
    size, onChange: handleChange,
  }

  const classes = buildGroupClasses(
    orientation, fullWidth, color, className
  )

  return (
    <ToggleButtonGroupContext.Provider value={ctx}>
      <div ref={ref} role="group" className={classes} {...props}>
        {children}
      </div>
    </ToggleButtonGroupContext.Provider>
  )
})

ToggleButtonGroup.displayName = 'ToggleButtonGroup'
