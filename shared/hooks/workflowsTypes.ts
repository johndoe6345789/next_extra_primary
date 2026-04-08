/**
 * Type definitions for useWorkflows hook
 */

export interface CreateWorkflowRequest {
  name: string
  description?: string
  version?: string
  category?: string
  status?: 'draft' | 'active'
  nodes?: unknown[]
  connections?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

export interface UpdateWorkflowRequest {
  name?: string
  description?: string
  version?: string
  category?: string
  status?: string
  nodes?: unknown[]
  connections?: Record<string, unknown>
  metadata?: Record<string, unknown>
  isPublished?: boolean
}

export interface ListWorkflowsOptions {
  status?: string
  category?: string
  isPublished?: boolean
  limit?: number
  page?: number
}
