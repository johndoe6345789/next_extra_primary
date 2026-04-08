/**
 * MockWorkflowMetrics
 *
 * In-memory workflow metrics calculation.
 */

import type { Workflow } from '../types'

/** @brief Compute mock workflow metrics */
export async function getWorkflowMetrics(
  workflow: Workflow
): Promise<{
  nodeCount: number
  connectionCount: number
  complexity: 'simple' | 'moderate' | 'complex'
  depth: number
}> {
  const nodeCount = workflow.nodes.length
  const complexity: 'simple' | 'moderate' | 'complex' =
    nodeCount > 20
      ? 'complex'
      : nodeCount > 5
        ? 'moderate'
        : 'simple'
  return {
    nodeCount,
    connectionCount: workflow.connections.length,
    complexity,
    depth: 1,
  }
}
