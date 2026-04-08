/**
 * Redux Slice for Workspace Management
 */

import { createSlice, PayloadAction } from
  '@reduxjs/toolkit';
import type { Workspace } from '../types/project';
import { workspaceInitialState } from
  './workspaceTypes';

export type { WorkspaceState } from
  './workspaceTypes';

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState: workspaceInitialState,
  reducers: {
    setLoading: (
      state, action: PayloadAction<boolean>
    ) => { state.isLoading = action.payload; },
    setError: (
      state,
      action: PayloadAction<string | null>
    ) => { state.error = action.payload; },
    setWorkspaces: (
      state, action: PayloadAction<Workspace[]>
    ) => {
      state.workspaces = action.payload;
      state.error = null;
    },
    addWorkspace: (
      state, action: PayloadAction<Workspace>
    ) => {
      state.workspaces.push(action.payload);
      state.error = null;
    },
    updateWorkspace: (
      state, action: PayloadAction<Workspace>
    ) => {
      const i = state.workspaces.findIndex(
        (w) => w.id === action.payload.id
      );
      if (i !== -1) {
        state.workspaces[i] = action.payload;
      }
      state.error = null;
    },
    removeWorkspace: (
      state, action: PayloadAction<string>
    ) => {
      state.workspaces = state.workspaces.filter(
        (w) => w.id !== action.payload
      );
      if (
        state.currentWorkspaceId === action.payload
      ) {
        state.currentWorkspaceId =
          state.workspaces[0]?.id || null;
      }
      state.error = null;
    },
    setCurrentWorkspace: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.currentWorkspaceId = action.payload;
    },
    clearWorkspaces: (state) => {
      state.workspaces = [];
      state.currentWorkspaceId = null;
      state.error = null;
    },
  },
});

export const {
  setLoading, setError, setWorkspaces,
  addWorkspace, updateWorkspace, removeWorkspace,
  setCurrentWorkspace, clearWorkspaces,
} = workspaceSlice.actions;

export {
  selectWorkspaces, selectCurrentWorkspace,
  selectCurrentWorkspaceId,
  selectWorkspaceIsLoading, selectWorkspaceError,
} from './workspaceSelectors';

export default workspaceSlice.reducer;
