/**
 * Redux Slice for Email Filters
 * Saved filters and search query management
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { EmailFilter } from './filterTypes'
import { filterInitialState } from './filterTypes'

export type { EmailFilter, SearchQuery, EmailFilterState } from './filterTypes'
export {
  selectSavedFilters, selectFilterById,
  selectActiveFilterId, selectActiveFilter,
  selectRecentSearches, selectTopSearches,
  selectFilterCount, selectSearchHistoryCount,
  selectError,
} from './filterSelectors'

export const emailFiltersSlice = createSlice({
  name: 'emailFilters',
  initialState: filterInitialState,
  reducers: {
    addFilter: (s, a: PayloadAction<EmailFilter>) => {
      s.savedFilters.push({
        ...a.payload,
        id: a.payload.id || `filter_${Date.now()}`,
        createdAt: a.payload.createdAt || Date.now(),
        updatedAt: a.payload.updatedAt || Date.now(),
      })
    },
    updateFilter: (s, a: PayloadAction<EmailFilter>) => {
      const idx = s.savedFilters.findIndex((f) => f.id === a.payload.id)
      if (idx !== -1) s.savedFilters[idx] = { ...a.payload, updatedAt: Date.now() }
    },
    removeFilter: (s, a: PayloadAction<string>) => {
      s.savedFilters = s.savedFilters.filter((f) => f.id !== a.payload)
      if (s.activeFilterId === a.payload) s.activeFilterId = null
    },
    clearAllFilters: (s) => { s.savedFilters = []; s.activeFilterId = null },
    setActiveFilter: (s, a: PayloadAction<string | null>) => { s.activeFilterId = a.payload },
    addSearchQuery: (s, a: PayloadAction<string>) => {
      const existing = s.recentSearches.find((q) => q.text === a.payload)
      if (existing) {
        existing.frequency += 1
        existing.timestamp = Date.now()
      } else {
        s.recentSearches.unshift({
          id: `search_${Date.now()}`, text: a.payload,
          timestamp: Date.now(), frequency: 1,
        })
        if (s.recentSearches.length > 20) s.recentSearches.pop()
      }
    },
    removeSearchQuery: (s, a: PayloadAction<string>) => {
      s.recentSearches = s.recentSearches.filter((q) => q.id !== a.payload)
    },
    clearSearchHistory: (s) => { s.recentSearches = [] },
    resetFilters: (s) => { s.savedFilters = []; s.activeFilterId = null; s.recentSearches = [] },
    setError: (s, a: PayloadAction<string | null>) => { s.error = a.payload },
    clearError: (s) => { s.error = null },
  },
})

export const {
  addFilter, updateFilter, removeFilter,
  clearAllFilters, setActiveFilter,
  addSearchQuery, removeSearchQuery,
  clearSearchHistory, resetFilters,
  setError, clearError,
} = emailFiltersSlice.actions

export default emailFiltersSlice.reducer
