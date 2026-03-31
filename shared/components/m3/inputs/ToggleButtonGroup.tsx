'use client'

import React, { forwardRef, useState, createContext, useContext } from 'react'

interface ToggleGroupCtx {
  value: string | string[] | null
  exclusive: boolean
  disabled: boolean
  size: 'small' | 'medium' | 'large'
  onChange: (e: React.MouseEvent, v: string) => void
}

const Ctx = createContext<ToggleGroupCtx | null>(null)
/** Hook to read toggle group context */
export const useToggleButtonGroup = () => useContext(Ctx)

/** Props for the ToggleButtonGroup component */
export interface ToggleButtonGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'
> {
  children?: React.ReactNode
  /** Selected value(s) */
  value?: string | string[] | null
  /** Called when selection changes */
  onChange?: (e: React.MouseEvent, v: string | string[] | null) => void
  /** Allow only one selection at a time */
  exclusive?: boolean
  /** Disable all buttons */
  disabled?: boolean
  /** Button size for all children */
  size?: 'small' | 'medium' | 'large'
  /** Layout direction */
  orientation?: 'horizontal' | 'vertical'
  /** Full width group */
  fullWidth?: boolean
}

/**
 * ToggleButtonGroup - container for ToggleButton children.
 * Manages shared selection state via context.
 */
export const ToggleButtonGroup = forwardRef<HTMLDivElement, ToggleButtonGroupProps>(({
  children, value, onChange, exclusive = false, disabled = false,
  size = 'medium', orientation = 'horizontal', fullWidth = false,
  className = '', ...props
}, ref) => {
  const [internal, setInternal] = useState<string | string[] | null>(exclusive ? null : [])
  const current = value !== undefined ? value : internal

  const handleChange = (e: React.MouseEvent, val: string) => {
    let next: string | string[] | null
    if (exclusive) {
      next = current === val ? null : val
    } else {
      const arr = Array.isArray(current) ? current : []
      next = arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
    }
    if (value === undefined) setInternal(next)
    onChange?.(e, next)
  }

  const classes = [
    'toggle-btn-group',
    orientation === 'vertical' ? 'toggle-btn-group--vertical' : '',
    fullWidth ? 'toggle-btn-group--full-width' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <Ctx.Provider value={{ value: current, exclusive, disabled, size, onChange: handleChange }}>
      <div
        ref={ref}
        role="group"
        className={classes}
        data-testid="toggle-button-group"
        aria-label="Toggle button group"
        {...props}
      >
        {children}
      </div>
    </Ctx.Provider>
  )
})

ToggleButtonGroup.displayName = 'ToggleButtonGroup'
export default ToggleButtonGroup
