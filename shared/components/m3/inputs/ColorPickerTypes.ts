import React from 'react'

/**
 * Props for the ColorPicker component
 */
export interface ColorPickerProps {
  testId?: string
  label?: React.ReactNode
  helperText?: React.ReactNode
  error?: boolean
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  className?: string
  showInput?: boolean
  presetColors?: string[]
  alpha?: boolean
}

/**
 * Default preset colors for the color picker
 */
export const DEFAULT_PRESET_COLORS = [
  '#000000', '#ffffff', '#ff0000',
  '#00ff00', '#0000ff', '#ffff00',
  '#ff00ff', '#00ffff', '#ff8000',
  '#8000ff', '#0080ff', '#ff0080',
  '#808080', '#c0c0c0', '#400000',
  '#004000', '#000040', '#404000',
  '#400040', '#004040',
]
