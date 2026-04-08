'use client'

import React from 'react'
import { classNames } from '../utils/classNames'
import type {
  AutocompleteRenderInputParams,
  AutocompleteProps,
} from './AutocompleteTypes'
import { AutocompleteListbox }
  from './AutocompleteListbox'
import { AutocompleteTags }
  from './AutocompleteTags'
import { useAutocompleteCore }
  from './useAutocompleteCore'

export type {
  AutocompleteRenderInputParams,
  AutocompleteRenderOptionState,
  AutocompleteProps,
} from './AutocompleteTypes'

/** Autocomplete - combobox with filtering */
export function Autocomplete<T = unknown>({
  options = [], value, onChange,
  inputValue, onInputChange,
  getOptionLabel = (o: T) =>
    (o as Record<string, string>)?.label
    ?? String(o ?? ''),
  renderOption, renderInput,
  multiple = false, freeSolo: _freeSolo,
  disabled = false,
  loading = false,
  loadingText = 'Loading\u2026',
  noOptionsText = 'No options',
  placeholder, testId, className, ...props
}: AutocompleteProps<T>) {
  const h = useAutocompleteCore<T>({
    options, value, onChange, inputValue,
    onInputChange, getOptionLabel, multiple,
  })
  const defInput = (
    p: AutocompleteRenderInputParams
  ) => (<input {...p} type="text"
    className="m3-autocomplete-input"
    placeholder={placeholder} />)
  const params = {
    value: h.controlled,
    onChange: h.handleInput,
    onFocus: () => h.setOpen(true),
    onKeyDown: h.handleKey, disabled,
  }
  return (
    <div className={classNames(
      'm3-autocomplete', className,
      { 'm3-autocomplete-disabled': disabled },
    )} ref={h.inputRef} role="combobox"
      aria-expanded={h.open}
      aria-haspopup="listbox"
      aria-label={placeholder}
      data-testid={testId} {...props}>
      <div className={
        'm3-autocomplete-input-wrapper'}>
        {multiple && Array.isArray(value) && (
          <AutocompleteTags value={value}
            getOptionLabel={getOptionLabel}
            onChange={onChange as never} />
        )}
        {(renderInput ?? defInput)(params)}
      </div>
      {h.open && (
        <AutocompleteListbox
          filteredOptions={h.filtered}
          loading={loading}
          loadingText={loadingText}
          noOptionsText={noOptionsText}
          highlightedIndex={h.highlighted}
          getOptionLabel={getOptionLabel}
          renderOption={renderOption}
          onOptionClick={h.handleOption}
          onMouseEnter={h.setHighlighted}
          listRef={h.listRef} />
      )}
    </div>
  )
}

export default Autocomplete
