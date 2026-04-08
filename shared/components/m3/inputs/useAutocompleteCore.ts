'use client'

import type React from 'react'
import { useAutocompleteHandlers }
  from './useAutocompleteHandlers'

/**
 * Core Autocomplete logic: filtering,
 * option selection, keyboard navigation.
 * @param opts - Autocomplete configuration.
 * @returns Handlers and computed state.
 */
export function useAutocompleteCore<T>(opts: {
  options: T[]
  value: T | T[] | null | undefined
  onChange?: (
    e: null, v: T | T[]
  ) => void
  inputValue?: string
  onInputChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    v: string
  ) => void
  getOptionLabel: (o: T) => string
  multiple: boolean
}) {
  const h = useAutocompleteHandlers<T>(
    opts.options, opts.inputValue,
    opts.onInputChange)
  const filtered = opts.options.filter((o) =>
    opts.getOptionLabel(o).toLowerCase()
      .includes(h.controlled.toLowerCase()))

  const handleOption = (option: T) => {
    if (opts.multiple) {
      opts.onChange?.(null, [
        ...((opts.value as T[]) || []),
        option])
    } else {
      opts.onChange?.(null, option)
      h.setInternalInput(
        opts.getOptionLabel(option))
    }
    h.setOpen(false)
  }

  const handleKey = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      h.setHighlighted((p) =>
        Math.min(p + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      h.setHighlighted((p) =>
        Math.max(p - 1, 0))
    } else if (e.key === 'Enter'
      && h.highlighted >= 0) {
      e.preventDefault()
      const s = filtered[h.highlighted]
      if (s !== undefined) handleOption(s)
    } else if (e.key === 'Escape') {
      h.setOpen(false)
    }
  }

  return {
    ...h, filtered, handleOption, handleKey,
  }
}
