'use client'

import React, { forwardRef, useState } from 'react'
import s from '../../../scss/components/ToggleButton.module.scss'
import { ToggleButtonGroupProps, ToggleButtonGroupContextValue } from './ToggleButtonTypes'
import { ToggleButtonGroupContext } from './ToggleButtonContext'

export { useToggleButtonGroup } from './ToggleButtonContext'
export type { ToggleButtonGroupProps } from './ToggleButtonTypes'

/** ToggleButtonGroup - container for ToggleButton children */
export const ToggleButtonGroup = forwardRef<HTMLDivElement, ToggleButtonGroupProps>(
  ({ children, value, onChange, exclusive = false, disabled = false, size = 'medium',
     orientation = 'horizontal', fullWidth = false, className = '',
     defaultValue: _dv, color: _c, ...props }, ref) => {
    const [internal, setInternal] = useState<string | string[] | null>(exclusive ? null : [])
    const current = value !== undefined ? value : internal

    const handleChange = (e: React.MouseEvent, val: string) => {
      let next: string | string[] | null
      if (exclusive) {
        next = current === val ? null : val
      } else {
        const arr = Array.isArray(current) ? current : []
        next = arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
      }
      if (value === undefined) setInternal(next)
      onChange?.(e, next)
    }

    const ctx: ToggleButtonGroupContextValue = { value: current, exclusive, disabled, size, onChange: handleChange }
    const classes = [
      s['toggle-btn-group'],
      orientation === 'vertical' ? s['toggle-btn-group--vertical'] : '',
      fullWidth ? s['toggle-btn-group--full-width'] : '',
      className,
    ].filter(Boolean).join(' ')

    return (
      <ToggleButtonGroupContext.Provider value={ctx}>
        <div ref={ref} role="group" className={classes} data-testid="toggle-button-group"
          aria-label="Toggle button group" {...props}>
          {children}
        </div>
      </ToggleButtonGroupContext.Provider>
    )
  }
)

ToggleButtonGroup.displayName = 'ToggleButtonGroup'
export default ToggleButtonGroup
