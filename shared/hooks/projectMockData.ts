/**
 * Mock project data for development
 */

import type { Project } from '@shared/types';

/**
 * Generate mock projects for a workspace
 * @param workspaceId - Workspace to generate for
 * @param tenantId - Tenant identifier
 * @returns Array of mock Project objects
 */
export function getMockProjects(
  workspaceId: string,
  tenantId: string
): Project[] {
  return [
    {
      id: 'proj-1',
      name: 'Data Pipeline',
      description:
        'ETL workflow for data processing',
      workspaceId,
      tenantId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      starred: true,
      color: '#4caf50',
    },
    {
      id: 'proj-2',
      name: 'API Integration',
      description: 'Connect to external APIs',
      workspaceId,
      tenantId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      starred: false,
      color: '#ff9800',
    },
  ];
}
