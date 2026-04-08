import React from 'react'
import { SelectProps } from './SelectTypes'

export { getDisplayValue } from './selectDisplay'

/** Shared state shape for select helpers */
export interface SelectState {
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  value: unknown
  internalValue: unknown
  setInternalValue: (v: unknown) => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

/** Handle item selection */
export function handleSelect(selectedValue: unknown, state: SelectState, props: SelectProps) {
  const { disabled = false, multiple = false, name } = props
  if (disabled) return
  let newValue: unknown
  if (multiple && Array.isArray(state.value)) {
    const arr = state.value as unknown[]
    newValue = arr.includes(selectedValue)
      ? arr.filter((v) => v !== selectedValue) : [...arr, selectedValue]
  } else {
    newValue = selectedValue
    state.setIsOpen(false)
  }
  state.setInternalValue(newValue)
  props.onChange?.({ target: { value: newValue as string | string[], name } })
}

/** Handle keyboard navigation */
export function handleKeyDown(
  event: React.KeyboardEvent, state: SelectState,
  disabled: boolean, containerRef: React.RefObject<HTMLDivElement | null>
) {
  if (disabled) return
  const { isOpen, setIsOpen } = state
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault(); setIsOpen(!isOpen)
  } else if (event.key === 'Escape') {
    setIsOpen(false)
  } else if (isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
    event.preventDefault()
    const panel = containerRef.current?.querySelector('[role="listbox"]')
    if (!panel) return
    const items = Array.from(panel.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [role="option"]:not([aria-disabled="true"])'
    ))
    const focused = document.activeElement as HTMLElement
    const cur = items.indexOf(focused)
    const next = event.key === 'ArrowDown'
      ? (cur + 1) % items.length : (cur - 1 + items.length) % items.length
    items[next]?.focus()
  } else if (!isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
    event.preventDefault(); setIsOpen(true)
  }
}
