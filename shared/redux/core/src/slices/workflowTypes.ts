/**
 * Workflow slice type definitions and initial state
 */

import type {
  Workflow, WorkflowNode, WorkflowConnection,
  ExecutionResult,
} from '../types/workflow';

/** Workflow state for the Redux store */
export interface WorkflowState {
  current: Workflow | null;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  isDirty: boolean;
  isSaving: boolean;
  saveError: string | null;
  executionHistory: ExecutionResult[];
  currentExecution: ExecutionResult | null;
  lastSaved: number | null;
}

/** Initial workflow state */
export const workflowInitialState: WorkflowState =
  {
    current: null,
    nodes: [],
    connections: [],
    isDirty: false,
    isSaving: false,
    saveError: null,
    executionHistory: [],
    currentExecution: null,
    lastSaved: null,
  };
