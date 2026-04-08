/**
 * Nodes Redux Slice
 * Manages node registry and available node types
 */

import { createSlice, PayloadAction } from
  '@reduxjs/toolkit';
import type { NodeType, NodeTemplate } from
  '../types/workflow';
import {
  setTemplatesReducer, addTemplateReducer,
  removeTemplateReducer, updateTemplateReducer,
} from './nodesTemplateReducers';

export interface NodesState {
  registry: NodeType[];
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
    setRegistry: (
      state, action: PayloadAction<NodeType[]>
    ) => {
      state.registry = action.payload;
      state.categories = Array.from(new Set(
        action.payload.map((n) => n.category)
      ));
      state.error = null;
    },
    addNodeType: (
      state, action: PayloadAction<NodeType>
    ) => {
      if (!state.registry.some(
        (n) => n.id === action.payload.id
      )) {
        state.registry.push(action.payload);
        if (!state.categories.includes(
          action.payload.category
        )) {
          state.categories.push(
            action.payload.category
          );
        }
      }
    },
    removeNodeType: (
      state, action: PayloadAction<string>
    ) => {
      state.registry = state.registry.filter(
        (n) => n.id !== action.payload
      );
    },
    setTemplates: setTemplatesReducer,
    addTemplate: addTemplateReducer,
    removeTemplate: removeTemplateReducer,
    updateTemplate: updateTemplateReducer,
    setCategories: (
      state, action: PayloadAction<string[]>
    ) => { state.categories = action.payload; },
    resetNodes: () => initialState,
  },
});

export const {
  setRegistry, addNodeType, removeNodeType,
  setTemplates, addTemplate, removeTemplate,
  updateTemplate, setCategories, resetNodes,
} = nodesSlice.actions;

export default nodesSlice.reducer;
