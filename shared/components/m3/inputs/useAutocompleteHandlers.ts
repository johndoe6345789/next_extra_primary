'use client'

import { useState, useRef, useEffect }
  from 'react'
import type React from 'react'

/**
 * Autocomplete input/keyboard/outside-click
 * event handlers.
 * @param options - Filtered option list.
 * @param inputValue - Controlled input value.
 * @param onInputChange - Controlled callback.
 * @returns State and handler functions.
 */
export function useAutocompleteHandlers<T>(
  options: T[],
  inputValue: string | undefined,
  onInputChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    v: string
  ) => void,
) {
  const [open, setOpen] = useState(false)
  const [internalInput, setInternalInput] =
    useState('')
  const [highlighted, setHighlighted] =
    useState(-1)
  const inputRef =
    useRef<HTMLDivElement>(null)
  const listRef =
    useRef<HTMLUListElement>(null)

  const controlled =
    inputValue ?? internalInput

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onInputChange
      ? onInputChange(e, e.target.value)
      : setInternalInput(e.target.value)
    setOpen(true)
  }

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (inputRef.current
        && !inputRef.current.contains(
          e.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () =>
      document.removeEventListener(
        'mousedown', h)
  }, [])

  return {
    open, setOpen,
    internalInput, setInternalInput,
    highlighted, setHighlighted,
    inputRef, listRef,
    controlled, handleInput,
  }
}
