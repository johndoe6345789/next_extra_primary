/**
 * Type definitions for useWorkflow hook
 */

import type {
  ExecutionState,
  ExecutionRecord,
  ExecutionMetrics,
} from '@shared/types'

export interface ExecuteWorkflowParams {
  tenant: string
  workflowId: string
  triggerData?: Record<string, unknown>
  variables?: Record<string, unknown>
  request?: {
    method?: string
    headers?: Record<string, string>
    query?: Record<string, unknown>
    body?: Record<string, unknown>
  }
}

export interface WorkflowState {
  executionId?: string
  status?: 'idle' | 'running' | 'success' | 'error'
  state?: ExecutionState
  metrics?: ExecutionMetrics
  result?: unknown
  error?: string
  startTime?: Date
  endTime?: Date
  duration?: number
}

export interface UseWorkflowOptions {
  onSuccess?: (record: ExecutionRecord) => void
  onError?: (error: Error) => void
  autoRetry?: boolean
  maxRetries?: number
  retryDelay?: number
  liveUpdates?: boolean
}

/**
 * Check if error is retryable
 */
export function isRetryableError(
  error: Error
): boolean {
  const patterns = [
    'timeout', 'network', 'econnrefused',
    'econnreset', 'temporary',
  ]
  const msg = error.message.toLowerCase()
  return patterns.some((p) => msg.includes(p))
}
