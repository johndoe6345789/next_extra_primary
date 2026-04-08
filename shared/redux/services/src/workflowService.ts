/**
 * Workflow Service - barrel re-export
 */

import {
  createWorkflow, getWorkflow,
  fetchFromBackend, saveWorkflow,
  deleteWorkflow, listWorkflows,
} from './workflowCrud';
import {
  syncToBackend, validateWorkflow,
  exportWorkflow, importWorkflow,
  duplicateWorkflow, getWorkflowMetrics,
} from './workflowUtils';

/** Workflow service with offline-first support */
export const workflowService = {
  createWorkflow,
  getWorkflow,
  fetchFromBackend,
  saveWorkflow,
  syncToBackend,
  listWorkflows,
  deleteWorkflow,
  validateWorkflow,
  exportWorkflow,
  importWorkflow,
  duplicateWorkflow,
  getWorkflowMetrics,
};
