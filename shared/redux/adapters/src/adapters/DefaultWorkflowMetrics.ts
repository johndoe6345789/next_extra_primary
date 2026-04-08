/**
 * Workflow validation and metrics helpers
 * Validate and metrics for workflow adapter.
 */

import type { Workflow, WorkflowConnection } from '../types'

const JSON_HEADERS = { 'Content-Type': 'application/json' }

/** @brief Validate a workflow via the API */
export async function validateWorkflow(
  apiBaseUrl: string, workflowId: string, workflow: Workflow
): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
  const r = await fetch(`${apiBaseUrl}/workflows/${workflowId}/validate`, {
    method: 'POST', headers: JSON_HEADERS, body: JSON.stringify(workflow),
  })
  if (!r.ok) throw new Error('Failed to validate workflow')
  return r.json()
}

/** @brief Get depth of a node via traversal */
function getNodeDepth(nodeId: string, workflow: Workflow): number {
  const visited = new Set<string>()
  const traverse = (id: string): number => {
    if (visited.has(id)) return 0
    visited.add(id)
    const sources = workflow.connections
      .filter((c: WorkflowConnection) => c.target === id)
      .map((c: WorkflowConnection) => c.source)
    if (sources.length === 0) return 1
    return 1 + Math.max(...sources.map(traverse))
  }
  return traverse(nodeId)
}

/** @brief Calculate max depth of workflow */
function calculateDepth(workflow: Workflow): number {
  let maxDepth = 0
  for (const conn of workflow.connections) {
    maxDepth = Math.max(maxDepth, getNodeDepth(conn.target, workflow))
  }
  return maxDepth || 1
}

/** @brief Compute workflow complexity metrics */
export async function getWorkflowMetrics(workflow: Workflow): Promise<{
  nodeCount: number; connectionCount: number;
  complexity: 'simple' | 'moderate' | 'complex'; depth: number
}> {
  const n = workflow.nodes.length
  return {
    nodeCount: n,
    connectionCount: workflow.connections.length,
    complexity: n > 20 ? 'complex' : n > 5 ? 'moderate' : 'simple',
    depth: calculateDepth(workflow),
  }
}
