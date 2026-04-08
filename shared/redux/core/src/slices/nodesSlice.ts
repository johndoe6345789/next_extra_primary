/**
 * Nodes Redux Slice
 * Manages node registry and available types
 */

import { createSlice, PayloadAction } from
  '@reduxjs/toolkit';
import {
  setTemplatesReducer, addTemplateReducer,
  removeTemplateReducer, updateTemplateReducer,
} from './nodesTemplateReducers';
import {
  setRegistryReducer, addNodeTypeReducer,
  removeNodeTypeReducer,
} from './nodesRegistryReducers';
import type { NodeTemplate }
  from '../types/workflow';

export interface NodesState {
  registry: { id: string; category: string }[];
  templates: NodeTemplate[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: NodesState = {
  registry: [], templates: [],
  categories: [], isLoading: false, error: null,
};

export const nodesSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    setRegistry: setRegistryReducer,
    addNodeType: addNodeTypeReducer,
    removeNodeType: removeNodeTypeReducer,
    setTemplates: setTemplatesReducer,
    addTemplate: addTemplateReducer,
    removeTemplate: removeTemplateReducer,
    updateTemplate: updateTemplateReducer,
    setCategories: (
      state, action: PayloadAction<string[]>
    ) => { state.categories = action.payload; },
    setLoading: (
      state, action: PayloadAction<boolean>
    ) => { state.isLoading = action.payload; },
    setError: (
      state,
      action: PayloadAction<string | null>
    ) => { state.error = action.payload; },
    resetNodes: () => initialState,
  },
});

export const {
  setRegistry, addNodeType, removeNodeType,
  setTemplates, addTemplate, removeTemplate,
  updateTemplate, setCategories,
  setLoading, setError, resetNodes,
} = nodesSlice.actions;

export default nodesSlice.reducer;
