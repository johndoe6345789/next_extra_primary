/**
 * Complete workflow and template definitions
 */

import type {
  WorkflowNode, WorkflowConnection,
} from './workflowBase';

/**
 * Complete workflow definition
 */
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  version: string;
  tenantId: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  createdBy?: string;
  lastModifiedBy?: string;
  isPublished?: boolean;
  metadata?: Record<string, unknown>;
}

/** Node template */
export interface NodeTemplate {
  id: string;
  name: string;
  nodeType: string;
  description?: string;
  tags?: string[];
  parameters: Record<string, unknown>;
  category?: string;
}
