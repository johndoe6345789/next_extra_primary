/**
 * Email compose and filter barrel exports
 */

// Email Compose Slice
export {
  emailComposeSlice,
  saveDraftAsync,
  sendEmailAsync,
  fetchDrafts,
  createDraft,
  updateDraft,
  updateDraftMultiple,
  addRecipient,
  removeRecipient,
  addAttachment,
  removeAttachment,
  setCurrentDraft,
  clearDraft,
  deleteDraft,
  selectCurrentDraft,
  selectDrafts,
  selectDraftCount,
  selectSuccessMessage,
} from './emailComposeSlice';
export type {
  ComposeDraftState, EmailDraft,
} from './emailComposeSlice';

// Email Filters Slice
export {
  emailFiltersSlice,
  addFilter,
  updateFilter,
  removeFilter,
  clearAllFilters,
  setActiveFilter,
  addSearchQuery,
  removeSearchQuery,
  clearSearchHistory,
  resetFilters,
  selectSavedFilters,
  selectFilterById,
  selectActiveFilterId,
  selectActiveFilter,
  selectRecentSearches,
  selectTopSearches,
  selectFilterCount,
  selectSearchHistoryCount,
} from './emailFiltersSlice';
export type {
  EmailFilterState, EmailFilter, SearchQuery,
} from './emailFiltersSlice';
