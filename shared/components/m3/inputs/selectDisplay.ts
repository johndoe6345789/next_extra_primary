import React from 'react'
import { SelectProps } from './SelectTypes'

/**
 * Derive the display text from children
 */
export function getDisplayValue(
  props: SelectProps,
  value: unknown
): React.ReactNode {
  const {
    renderValue, multiple = false,
    displayEmpty = false, children,
  } = props

  if (renderValue) {
    return renderValue(value as string | string[])
  }

  if (multiple && Array.isArray(value)) {
    if (value.length === 0) return displayEmpty ? '' : null
    const labels: string[] = []
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return
      const cp = child.props as Record<string, unknown>
      if (cp.value !== undefined && (value as unknown[]).includes(cp.value)) {
        labels.push(String(cp.children))
      }
    })
    return labels.join(', ')
  }

  if (value === '' || value === undefined || value === null) {
    return displayEmpty ? '' : null
  }

  let displayLabel: React.ReactNode = value as React.ReactNode
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    const cp = child.props as Record<string, unknown>
    if (cp.value === value) {
      displayLabel = cp.children as React.ReactNode
    }
  })
  return displayLabel
}
