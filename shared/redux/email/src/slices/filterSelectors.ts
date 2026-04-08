/**
 * Email Filter Selectors
 * State selectors for email filters
 */

import type {
  EmailFilterState,
} from './filterTypes'

type Root = { emailFilters: EmailFilterState }

/** @brief Select all saved filters */
export const selectSavedFilters = (s: Root) =>
  s.emailFilters.savedFilters

/** @brief Select filter by ID */
export const selectFilterById = (
  s: Root,
  id: string
) => s.emailFilters.savedFilters.find(
  (f) => f.id === id
)

/** @brief Select active filter ID */
export const selectActiveFilterId = (s: Root) =>
  s.emailFilters.activeFilterId

/** @brief Select active filter object */
export const selectActiveFilter = (s: Root) => {
  if (!s.emailFilters.activeFilterId) return null
  return (
    s.emailFilters.savedFilters.find(
      (f) =>
        f.id === s.emailFilters.activeFilterId
    ) || null
  )
}

/** @brief Select recent searches */
export const selectRecentSearches = (s: Root) =>
  s.emailFilters.recentSearches

/** @brief Select top searches by frequency */
export const selectTopSearches = (
  s: Root,
  limit: number = 5
) =>
  s.emailFilters.recentSearches
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, limit)

/** @brief Select filter count */
export const selectFilterCount = (s: Root) =>
  s.emailFilters.savedFilters.length

/** @brief Select search history count */
export const selectSearchHistoryCount = (
  s: Root
) => s.emailFilters.recentSearches.length

/** @brief Select error state */
export const selectError = (s: Root) =>
  s.emailFilters.error
