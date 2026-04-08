import React, { forwardRef } from 'react'
import type {
  ToggleButtonGroupProps,
} from './ToggleButtonGroup'
import type {
  ToggleButtonProps,
} from './toggleButtonTypes'
import {
  useToggleState,
  buildToggleClasses,
  createToggleClick,
} from './toggleButtonLogic'

export type { ToggleButtonGroupProps }
export type { ToggleButtonProps }
export {
  ToggleButtonGroup,
  useToggleButtonGroup,
} from './ToggleButtonGroup'

/**
 * ToggleButton - can be toggled on/off
 * Used standalone or in a ToggleButtonGroup
 */
export const ToggleButton = forwardRef<
  HTMLButtonElement,
  ToggleButtonProps
>(
  (
    {
      children,
      selected,
      value,
      size = 'medium',
      fullWidth,
      disabled,
      className = '',
      onClick,
      ...props
    },
    ref
  ) => {
    const {
      groupCtx, isSelected,
      btnSize, isDisabled,
    } = useToggleState(
      value, selected, size, disabled
    )
    const handleClick = createToggleClick(
      groupCtx, value, onClick
    )
    const classes = buildToggleClasses(
      isSelected, btnSize, fullWidth, className
    )

    return (
      <button
        ref={ref}
        type="button"
        role="button"
        aria-pressed={isSelected}
        disabled={isDisabled}
        className={classes}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)

ToggleButton.displayName = 'ToggleButton'
