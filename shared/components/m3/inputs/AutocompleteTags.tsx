'use client'

import React from 'react'

/**
 * Props for AutocompleteTags
 */
interface AutocompleteTagsProps<T> {
  value: T[]
  getOptionLabel: (option: T) => string
  onChange?: (
    event: React.SyntheticEvent | null,
    value: T[] | null
  ) => void
}

/**
 * Tag chips for multi-select Autocomplete
 */
export function AutocompleteTags<T>({
  value,
  getOptionLabel,
  onChange,
}: AutocompleteTagsProps<T>) {
  if (!value.length) return null

  return (
    <div className="m3-autocomplete-tags">
      {value.map((item, i) => (
        <span
          key={i}
          className="m3-autocomplete-tag"
        >
          {getOptionLabel(item)}
          <button
            type="button"
            className="m3-autocomplete-tag-remove"
            onClick={() => {
              const nv = value.filter(
                (_, j) => j !== i
              )
              onChange?.(null, nv)
            }}
          >
            &times;
          </button>
        </span>
      ))}
    </div>
  )
}
