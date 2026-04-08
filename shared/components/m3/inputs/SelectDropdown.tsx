'use client'

import React from 'react'
import styles
  from '../../../scss/atoms/mat-select.module.scss'
import { SelectArrowIcon }
  from './SelectArrow'

/** Props for the SelectTrigger component */
interface SelectTriggerProps {
  id: string
  isOpen: boolean
  disabled: boolean
  required: boolean
  label?: string
  hasValue: boolean
  displayEmpty: boolean
  displayValue: React.ReactNode
  /** Icon component override */
  IconComponent?: React.ComponentType<{
    className?: string
  }>
  onClick: () => void
  onKeyDown: (
    e: React.KeyboardEvent
  ) => void
  onBlur?: (
    e: React.FocusEvent<HTMLDivElement>
  ) => void
  onFocus?: (
    e: React.FocusEvent<HTMLDivElement>
  ) => void
}

/** Trigger button for Select dropdown */
export function SelectTrigger({
  id, isOpen, disabled, required,
  label, hasValue, displayEmpty,
  displayValue, IconComponent,
  onClick, onKeyDown, onBlur, onFocus,
}: SelectTriggerProps) {
  return (
    <div
      role="combobox"
      aria-controls={`${id}-menu`}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-disabled={disabled}
      aria-required={required}
      {...(label
        ? { 'aria-label': label }
        : {})}
      tabIndex={disabled ? -1 : 0}
      className={styles.trigger}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onFocus={onFocus}
    >
      <span className={
        !hasValue && !displayEmpty
          ? styles.placeholder
          : styles.valueText
      }>
        <span className={styles.minLine}>
          {displayValue
            || (displayEmpty
              ? <em>None</em>
              : null)}
        </span>
      </span>
      <SelectArrowIcon
        IconComponent={IconComponent} />
    </div>
  )
}
