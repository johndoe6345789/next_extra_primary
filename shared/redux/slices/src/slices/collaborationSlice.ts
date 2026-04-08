/**
 * Redux Slice for Project-Level Collaboration
 */

import { createSlice, PayloadAction } from
  '@reduxjs/toolkit';
import type {
  ActivityFeedEntry,
} from '../types/project';
import {
  addConflictReducer, resolveConflictReducer,
  updateConflictResolutionReducer,
} from './collaborationConflictReducers';

interface CollaborationState {
  activityFeed: ActivityFeedEntry[];
  conflicts: { itemId: string }[];
  isActivityLoading: boolean;
  hasUnresolvedConflicts: boolean;
}

const initialState: CollaborationState = {
  activityFeed: [], conflicts: [],
  isActivityLoading: false,
  hasUnresolvedConflicts: false,
};

export const collaborationSlice = createSlice({
  name: 'collaboration',
  initialState,
  reducers: {
    addActivityEntry: (
      state,
      action: PayloadAction<ActivityFeedEntry>
    ) => {
      state.activityFeed.unshift(action.payload);
      if (state.activityFeed.length > 100) {
        state.activityFeed =
          state.activityFeed.slice(0, 100);
      }
    },
    setActivityFeed: (state, action: PayloadAction<
      ActivityFeedEntry[]
    >) => { state.activityFeed = action.payload; },
    clearActivityFeed: (state) => {
      state.activityFeed = [];
    },
    addConflict: addConflictReducer,
    resolveConflict: resolveConflictReducer,
    resolveAllConflicts: (state) => {
      state.conflicts = [];
      state.hasUnresolvedConflicts = false;
    },
    updateConflictResolution:
      updateConflictResolutionReducer,
    clearConflicts: (state) => {
      state.conflicts = [];
      state.hasUnresolvedConflicts = false;
    },
  },
});

export const {
  addActivityEntry, setActivityFeed,
  clearActivityFeed, addConflict,
  resolveConflict, resolveAllConflicts,
  updateConflictResolution, clearConflicts
} = collaborationSlice.actions;

export {
  selectActivityFeed, selectActivityLoading,
  selectConflicts, selectHasUnresolvedConflicts,
  selectConflictCount, selectConflictByItemId
} from './collaborationSelectors';

export default collaborationSlice.reducer;
