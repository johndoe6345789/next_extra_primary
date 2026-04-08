/**
 * Email Filter Types
 * Types for saved filters and search queries
 */

/** @brief Saved email filter */
export interface EmailFilter {
  id: string
  name: string
  description?: string
  criteria: {
    from?: string
    to?: string
    subject?: string
    hasAttachments?: boolean
    isRead?: boolean
    isStarred?: boolean
    dateFrom?: number
    dateTo?: number
    sizeMin?: number
    sizeMax?: number
  }
  color?: string
  createdAt: number
  updatedAt: number
}

/** @brief Recent search query */
export interface SearchQuery {
  id: string
  text: string
  timestamp: number
  frequency: number
}

/** @brief Email filter Redux state */
export interface EmailFilterState {
  savedFilters: EmailFilter[]
  recentSearches: SearchQuery[]
  activeFilterId: string | null
  isLoading: boolean
  error: string | null
}

/** @brief Initial filter state */
export const filterInitialState: EmailFilterState = {
  savedFilters: [],
  recentSearches: [],
  activeFilterId: null,
  isLoading: false,
  error: null,
}
