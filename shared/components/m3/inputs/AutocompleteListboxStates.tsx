'use client'

import React from 'react'

/** Props for listbox loading state. */
export interface ListboxStateProps {
  text: string
  listRef: React.RefObject<
    HTMLUListElement | null
  >
}

/** Loading state for autocomplete listbox. */
export function ListboxLoading({
  text, listRef,
}: ListboxStateProps) {
  return (
    <ul className="m3-autocomplete-listbox"
      ref={listRef}>
      <li className="m3-autocomplete-loading">
        {text}
      </li>
    </ul>
  )
}

/** Empty state for autocomplete listbox. */
export function ListboxEmpty({
  text, listRef,
}: ListboxStateProps) {
  return (
    <ul className="m3-autocomplete-listbox"
      ref={listRef}>
      <li className={
        'm3-autocomplete-no-options'
      }>
        {text}
      </li>
    </ul>
  )
}
