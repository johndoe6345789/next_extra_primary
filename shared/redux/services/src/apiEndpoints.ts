/**
 * API endpoint definitions
 */

import { apiRequest } from './apiClient';

/** Workflow API endpoints */
export const workflowEndpoints = {
  list: (tenantId = 'default') =>
    apiRequest(
      `/workflows?tenantId=${tenantId}`,
      { method: 'GET' }
    ),
  get: (id: string) =>
    apiRequest(`/workflows/${id}`,
      { method: 'GET' }),
  create: (data: unknown) =>
    apiRequest('/workflows', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: unknown) =>
    apiRequest(`/workflows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest(`/workflows/${id}`,
      { method: 'DELETE' }),
  validate: (id: string, data: unknown) =>
    apiRequest(
      `/workflows/${id}/validate`, {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),
};

/** Execution API endpoints */
export const executionEndpoints = {
  execute: (wfId: string, data: unknown) =>
    apiRequest(
      `/workflows/${wfId}/execute`, {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),
  getHistory: (wfId: string, limit = 50) =>
    apiRequest(
      `/workflows/${wfId}/executions` +
      `?limit=${limit}`,
      { method: 'GET' }
    ),
  getById: (execId: string) =>
    apiRequest(`/executions/${execId}`,
      { method: 'GET' }),
};

/** Node registry API endpoints */
export const nodeEndpoints = {
  list: (category?: string) => {
    const q = category
      ? `?category=${category}` : '';
    return apiRequest(`/nodes${q}`,
      { method: 'GET' });
  },
  get: (nodeId: string) =>
    apiRequest(`/nodes/${nodeId}`,
      { method: 'GET' }),
  categories: () =>
    apiRequest('/nodes/categories',
      { method: 'GET' }),
};

/** Health check */
export const healthEndpoint = () =>
  apiRequest('/health', { method: 'GET' });
