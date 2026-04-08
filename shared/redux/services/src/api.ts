/**
 * API Client - barrel re-export
 */

export type { ApiError, ApiResponse } from
  './apiClient';
export {
  apiRequest, isApiError, getErrorMessage,
} from './apiClient';

import {
  workflowEndpoints, executionEndpoints,
  nodeEndpoints, healthEndpoint,
} from './apiEndpoints';

/** Centralized API client */
export const api = {
  workflows: workflowEndpoints,
  executions: executionEndpoints,
  nodes: nodeEndpoints,
  health: healthEndpoint,
};

export default api;
