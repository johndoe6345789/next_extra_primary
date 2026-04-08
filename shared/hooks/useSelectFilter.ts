'use client'

/**
 * Select option filtering logic
 */

import { useCallback } from 'react'
import type { SelectOption } from './selectTypes'

/**
 * Build filtered options callback
 * @param options - Available options
 * @param searchable - Whether search enabled
 * @param searchTerm - Current search term
 */
export function useFilteredOptions<T>(
  options: SelectOption<T>[],
  searchable: boolean | undefined,
  searchTerm: string
) {
  return useCallback(
    (): SelectOption<T>[] => {
      if (!searchable || !searchTerm) {
        return options
      }
      const lower = searchTerm.toLowerCase()
      return options.filter(
        (opt) =>
          opt.label
            .toLowerCase()
            .includes(lower) ||
          String(opt.value)
            .toLowerCase()
            .includes(lower)
      )
    },
    [options, searchable, searchTerm]
  )
}
