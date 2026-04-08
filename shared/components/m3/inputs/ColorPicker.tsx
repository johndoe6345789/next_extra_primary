'use client'

import React, { forwardRef, useState, useCallback } from 'react'
import { FormLabel } from './FormLabel'
import { FormHelperText } from './FormHelperText'
import { ColorPickerProps, DEFAULT_PRESET_COLORS } from './ColorPickerTypes'

export type { ColorPickerProps } from './ColorPickerTypes'

/** ColorPicker - color input with presets */
export const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(
  ({ testId, label, helperText, error, value = '#000000', onChange, disabled,
     required, className = '', showInput = true, presetColors = DEFAULT_PRESET_COLORS,
     alpha = false, ...props }, ref) => {
    const [localValue, setLocalValue] = useState(value)

    const handleColor = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value); onChange?.(e.target.value)
    }, [onChange])

    const handleText = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value; setLocalValue(v)
      if (/^#[0-9A-Fa-f]{6}$/.test(v) || /^#[0-9A-Fa-f]{8}$/.test(v)) onChange?.(v)
    }, [onChange])

    const handlePreset = useCallback((c: string) => { setLocalValue(c); onChange?.(c) }, [onChange])

    return (
      <div
        className={`color-picker ${error ? 'color-picker--error' : ''} ${disabled ? 'color-picker--disabled' : ''} ${className}`}
        data-testid={testId} aria-label={typeof label === 'string' ? label : undefined}>
        {label && <FormLabel required={required}>{label}</FormLabel>}
        <div className="color-picker__controls">
          <input ref={ref} type="color" value={localValue.slice(0, 7)} onChange={handleColor}
            disabled={disabled} className="color-picker__input" {...props} />
          {showInput && (
            <input type="text" value={localValue} onChange={handleText} disabled={disabled}
              className="color-picker__text" placeholder="#000000" maxLength={alpha ? 9 : 7} />
          )}
        </div>
        {presetColors.length > 0 && (
          <div className="color-picker__presets">
            {presetColors.map((c) => (
              <button key={c} type="button"
                className={`color-picker__preset ${localValue === c ? 'color-picker__preset--active' : ''}`}
                style={{ backgroundColor: c }} onClick={() => handlePreset(c)}
                disabled={disabled} aria-label={`Select color ${c}`} />
            ))}
          </div>
        )}
        {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
      </div>
    )
  }
)

ColorPicker.displayName = 'ColorPicker'
