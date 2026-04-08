/**
 * Template-related reducers for nodesSlice
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import type { NodeTemplate } from '../types/workflow';
import type { NodesState } from './nodesSlice';

/** Set all templates */
export const setTemplatesReducer = (
  state: NodesState,
  action: PayloadAction<NodeTemplate[]>
) => { state.templates = action.payload; };

/** Add a template */
export const addTemplateReducer = (
  state: NodesState,
  action: PayloadAction<NodeTemplate>
) => { state.templates.push(action.payload); };

/** Remove template by ID */
export const removeTemplateReducer = (
  state: NodesState,
  action: PayloadAction<string>
) => {
  state.templates = state.templates.filter(
    (t) => t.id !== action.payload
  );
};

/** Update template by ID */
export const updateTemplateReducer = (
  state: NodesState,
  action: PayloadAction<{
    id: string; data: Partial<NodeTemplate>
  }>
) => {
  const i = state.templates.findIndex(
    (t) => t.id === action.payload.id
  );
  if (i !== -1) {
    state.templates[i] = {
      ...state.templates[i],
      ...action.payload.data,
    };
  }
};
