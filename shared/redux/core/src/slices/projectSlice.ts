/**
 * Redux Slice for Project CRUD Operations
 */

import { createSlice, PayloadAction } from
  '@reduxjs/toolkit';
import type { Project } from '../types/project';
import { projectInitialState } from
  './projectTypes';

export type { ProjectState } from
  './projectTypes';

export const projectSlice = createSlice({
  name: 'project',
  initialState: projectInitialState,
  reducers: {
    setLoading: (
      state, action: PayloadAction<boolean>
    ) => { state.isLoading = action.payload; },
    setError: (
      state,
      action: PayloadAction<string | null>
    ) => { state.error = action.payload; },
    setProjects: (
      state, action: PayloadAction<Project[]>
    ) => {
      state.projects = action.payload;
      state.error = null;
    },
    addProject: (
      state, action: PayloadAction<Project>
    ) => {
      state.projects.push(action.payload);
      state.error = null;
    },
    updateProject: (
      state, action: PayloadAction<Project>
    ) => {
      const i = state.projects.findIndex(
        (p) => p.id === action.payload.id
      );
      if (i !== -1) {
        state.projects[i] = action.payload;
      }
      state.error = null;
    },
    removeProject: (
      state, action: PayloadAction<string>
    ) => {
      state.projects = state.projects.filter(
        (p) => p.id !== action.payload
      );
      if (
        state.currentProjectId === action.payload
      ) {
        state.currentProjectId = null;
      }
      state.error = null;
    },
    setCurrentProject: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.currentProjectId = action.payload;
    },
    clearProject: (state) => {
      state.currentProjectId = null;
    },
  },
});

export const {
  setLoading, setError, setProjects,
  addProject, updateProject, removeProject,
  setCurrentProject, clearProject,
} = projectSlice.actions;

export {
  selectProjects, selectCurrentProject,
  selectCurrentProjectId,
  selectProjectIsLoading, selectProjectError,
} from './projectSelectors';

export default projectSlice.reducer;
