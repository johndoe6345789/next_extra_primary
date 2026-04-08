/**
 * Type definitions for useProjectWorkflows hook
 */

/** Workflow within a project */
export interface ProjectWorkflow {
  id: string;
  name: string;
  description?: string;
  nodeCount: number;
  status:
    | 'draft'
    | 'published'
    | 'deprecated'
    | 'active'
    | 'paused';
  lastModified: number;
  category?: string;
  version?: string;
  isPublished?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

/** Options for useProjectWorkflows hook */
export interface UseProjectWorkflowsOptions {
  projectId: string;
  autoLoad?: boolean;
  /** Tenant ID (defaults to localStorage) */
  tenant?: string;
  /** Package ID (defaults to 'core') */
  packageId?: string;
}

/**
 * Transform a raw workflow record to typed obj
 */
export function transformWorkflow(
  w: Record<string, unknown>
): ProjectWorkflow {
  return {
    id: w.id as string,
    name: w.name as string,
    description:
      w.description as string | undefined,
    nodeCount: Array.isArray(w.nodes)
      ? w.nodes.length
      : 0,
    status:
      w.status as ProjectWorkflow['status'],
    lastModified: w.updatedAt
      ? new Date(
          w.updatedAt as string
        ).getTime()
      : Date.now(),
    category:
      w.category as string | undefined,
    version: w.version as string | undefined,
    isPublished:
      w.isPublished as boolean | undefined,
    createdAt: w.createdAt
      ? new Date(
          w.createdAt as string
        ).getTime()
      : undefined,
    updatedAt: w.updatedAt
      ? new Date(
          w.updatedAt as string
        ).getTime()
      : undefined,
  };
}
