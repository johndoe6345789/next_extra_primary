'use client'

import React from 'react'
import { classNames } from '../utils/classNames'
import type {
  AutocompleteRenderOptionState,
} from './AutocompleteTypes'
import {
  ListboxLoading, ListboxEmpty,
} from './AutocompleteListboxStates'

/** Props for AutocompleteListbox */
interface AutocompleteListboxProps<T> {
  filteredOptions: T[]
  loading: boolean
  loadingText: string
  noOptionsText: string
  highlightedIndex: number
  getOptionLabel: (option: T) => string
  renderOption?: (
    option: T,
    state: AutocompleteRenderOptionState
  ) => React.ReactNode
  onOptionClick: (option: T) => void
  onMouseEnter: (index: number) => void
  listRef: React.RefObject<
    HTMLUListElement | null
  >
}

/** Dropdown listbox for Autocomplete */
export function AutocompleteListbox<T>({
  filteredOptions, loading, loadingText,
  noOptionsText, highlightedIndex,
  getOptionLabel, renderOption,
  onOptionClick, onMouseEnter, listRef,
}: AutocompleteListboxProps<T>) {
  if (loading) {
    return (
      <ListboxLoading text={loadingText}
        listRef={listRef} />
    )
  }
  if (filteredOptions.length === 0) {
    return (
      <ListboxEmpty text={noOptionsText}
        listRef={listRef} />
    )
  }
  return (
    <ul className="m3-autocomplete-listbox"
      ref={listRef}>
      {filteredOptions.map((opt, idx) => (
        <li key={idx}
          className={classNames(
            'm3-autocomplete-option',
            { 'm3-autocomplete-option-highlighted':
              idx === highlightedIndex }
          )}
          onClick={() => onOptionClick(opt)}
          onMouseEnter={() =>
            onMouseEnter(idx)}>
          {renderOption
            ? renderOption(opt, { index: idx })
            : getOptionLabel(opt)}
        </li>
      ))}
    </ul>
  )
}
