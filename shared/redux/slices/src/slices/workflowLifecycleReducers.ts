/**
 * Workflow lifecycle reducers: load, create, save
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import type { Workflow } from '../types/workflow';
import type { WorkflowState } from './workflowTypes';

/** Load a workflow from data */
export const loadWorkflowReducer = (
  state: WorkflowState,
  action: PayloadAction<Workflow>
) => {
  state.current = action.payload;
  state.nodes = action.payload.nodes || [];
  state.connections =
    action.payload.connections || [];
  state.isDirty = false;
  state.lastSaved = Date.now();
};

/** Create a new workflow */
export const createWorkflowReducer = (
  state: WorkflowState,
  action: PayloadAction<Partial<Workflow>>
) => {
  const p = action.payload;
  state.current = {
    id: p.id || `workflow-${Date.now()}`,
    name: p.name || 'Untitled Workflow',
    version: '1.0.0',
    tenantId: p.tenantId || 'default',
    nodes: [], connections: [],
    description: p.description || '',
    tags: p.tags || [],
    createdAt: Date.now(),
    updatedAt: Date.now(), ...p
  };
  state.nodes = [];
  state.connections = [];
  state.isDirty = true;
};

/** Save workflow data */
export const saveWorkflowReducer = (
  state: WorkflowState,
  action: PayloadAction<Workflow>
) => {
  state.current = action.payload;
  state.isDirty = false;
  state.isSaving = false;
  state.lastSaved = Date.now();
  state.saveError = null;
};
