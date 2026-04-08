import React from 'react'

/**
 * Params passed to the renderInput callback
 */
export interface AutocompleteRenderInputParams {
  value: string
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
  onFocus: () => void
  onKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => void
  disabled: boolean
}

/**
 * State passed to the renderOption callback
 */
export interface AutocompleteRenderOptionState {
  index: number
}

/**
 * Props for the Autocomplete component
 */
export interface AutocompleteProps<T = unknown>
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange'
  > {
  testId?: string
  options?: T[]
  value?: T | T[] | null
  onChange?: (
    event: React.SyntheticEvent | null,
    value: T | T[] | null
  ) => void
  inputValue?: string
  onInputChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => void
  getOptionLabel?: (option: T) => string
  renderOption?: (
    option: T,
    state: AutocompleteRenderOptionState
  ) => React.ReactNode
  renderInput?: (
    params: AutocompleteRenderInputParams
  ) => React.ReactNode
  multiple?: boolean
  freeSolo?: boolean
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  noOptionsText?: string
  placeholder?: string
}
