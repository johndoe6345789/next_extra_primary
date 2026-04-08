/**
 * Documentation Redux Slice
 * State management for documentation system
 */

import { createSlice, PayloadAction } from
  '@reduxjs/toolkit';
import type { DocCategory } from
  '../types/documentation';
import {
  helpInitialState, addToHistory,
} from './documentationHelpers';

export const documentationSlice = createSlice({
  name: 'documentation',
  initialState: helpInitialState,
  reducers: {
    openHelp: (state, action: PayloadAction<{
      pageId?: string; category?: DocCategory
    }>) => {
      state.isOpen = true;
      if (action.payload.pageId) {
        state.currentPageId = action.payload.pageId;
        state.history = addToHistory(
          state.history, action.payload.pageId
        );
      }
      if (action.payload.category) {
        state.currentCategory =
          action.payload.category;
      }
    },
    closeHelp: (state) => { state.isOpen = false; },
    navigateToPage: (
      state, action: PayloadAction<string>
    ) => {
      state.currentPageId = action.payload;
      state.searchQuery = '';
      state.searchResults = [];
      state.history = addToHistory(
        state.history, action.payload
      );
    },
    setCategory: (state, action: PayloadAction<
      DocCategory | null
    >) => {
      state.currentCategory = action.payload;
      state.currentPageId = null;
    },
    setSearchQuery: (
      state, action: PayloadAction<string>
    ) => { state.searchQuery = action.payload; },
    setSearchResults: (
      state, action: PayloadAction<string[]>
    ) => { state.searchResults = action.payload; },
    goBack: (state) => {
      if (state.history.length > 1) {
        state.history.shift();
        state.currentPageId =
          state.history[0] || null;
      }
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.searchResults = [];
    },
    clearHistory: (state) => {
      state.history = [];
      state.currentPageId = null;
    },
    reset: () => helpInitialState,
  },
});

export const {
  openHelp, closeHelp, navigateToPage,
  setCategory, setSearchQuery, setSearchResults,
  goBack, clearSearch, clearHistory, reset,
} = documentationSlice.actions;

export default documentationSlice.reducer;
