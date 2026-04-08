'use client';
import React, { forwardRef } from 'react'
import { ToggleButtonProps }
  from './ToggleButtonTypes'
import { useToggleButtonGroup }
  from './ToggleButtonContext'
import { buildToggleClasses }
  from './toggleButtonClasses'

export type {
  ToggleButtonProps,
  ToggleButtonGroupProps,
  ToggleButtonGroupContextValue,
} from './ToggleButtonTypes'
export { useToggleButtonGroup }
  from './ToggleButtonContext'
export { ToggleButtonGroup }
  from './ToggleButtonGroup'

/** Toggleable button for group or standalone. */
export const ToggleButton = forwardRef<
  HTMLButtonElement, ToggleButtonProps
>((
  {
    children, selected, value,
    size = 'medium', fullWidth, disabled,
    testId, className = '', onClick, ...props
  },
  ref
) => {
  const groupCtx = useToggleButtonGroup()
  const isSelected = groupCtx
    ? Array.isArray(groupCtx.value)
      ? groupCtx.value.includes(value || '')
      : groupCtx.value === value
    : selected
  const buttonSize = groupCtx?.size || size
  const isDisabled =
    groupCtx?.disabled || disabled
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (groupCtx && value !== undefined) {
      groupCtx.onChange(event, value)
    }
    onClick?.(event)
  }
  const classes = buildToggleClasses(
    isSelected, buttonSize,
    fullWidth, className)
  return (
    <button ref={ref} type="button"
      role="button"
      aria-pressed={isSelected}
      disabled={isDisabled}
      className={classes}
      data-testid={testId}
      onClick={handleClick} {...props}>
      {children}
    </button>
  )
})

ToggleButton.displayName = 'ToggleButton'

export default ToggleButton
