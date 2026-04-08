import React from 'react'
import {
  useToggleButtonGroup,
} from './ToggleButtonGroup'

/**
 * Resolve toggle button state from group context
 * @param value - Button value
 * @param selected - Standalone selected state
 * @param size - Standalone size
 * @param disabled - Standalone disabled state
 */
export function useToggleState(
  value: string | undefined,
  selected: boolean | undefined,
  size: 'small' | 'medium' | 'large',
  disabled: boolean | undefined
) {
  const groupCtx = useToggleButtonGroup()

  const isSelected = groupCtx
    ? Array.isArray(groupCtx.value)
      ? groupCtx.value.includes(value || '')
      : groupCtx.value === value
    : selected
  const btnSize = groupCtx?.size || size
  const isDisabled =
    groupCtx?.disabled || disabled

  return { groupCtx, isSelected, btnSize, isDisabled }
}

/**
 * Build CSS class list for toggle button
 * @param isSelected - Whether button is selected
 * @param btnSize - Resolved size
 * @param fullWidth - Whether full width
 * @param className - Additional class names
 */
export function buildToggleClasses(
  isSelected: boolean | undefined,
  btnSize: string,
  fullWidth: boolean | undefined,
  className: string
): string {
  return [
    'toggle-btn',
    isSelected ? 'toggle-btn--selected' : '',
    `toggle-btn--${btnSize}`,
    fullWidth ? 'toggle-btn--full-width' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

/**
 * Create click handler for toggle button
 * @param groupCtx - Group context if present
 * @param value - Button value
 * @param onClick - External click handler
 */
export function createToggleClick(
  groupCtx: ReturnType<
    typeof useToggleButtonGroup
  >,
  value: string | undefined,
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void
) {
  return (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (groupCtx && value !== undefined) {
      groupCtx.onChange(event, value)
    }
    onClick?.(event)
  }
}
