/**
 * Workflow complexity metrics
 */

import type { Workflow } from '../types/workflow';

/** Complexity level */
type Complexity =
  'simple' | 'moderate' | 'complex';

/** Get workflow complexity metrics */
export async function getWorkflowMetrics(
  workflow: Workflow
) {
  const nc = workflow.nodes.length;
  const cc = workflow.connections.length;
  let depth = 0;
  const visited = new Set<string>();
  const stack: [string, number][] = [];
  const hasIn = new Set(
    workflow.connections.map((c) => c.target)
  );
  const sources = workflow.nodes.filter(
    (n) => !hasIn.has(n.id)
  );
  for (const n of sources) {
    stack.push([n.id, 1]);
  }
  while (stack.length > 0) {
    const [nid, d] = stack.pop()!;
    if (visited.has(nid)) continue;
    visited.add(nid);
    depth = Math.max(depth, d);
    const kids = workflow.connections
      .filter((c) => c.source === nid)
      .map((c) => c.target);
    for (const k of kids) {
      stack.push([k, d + 1]);
    }
  }
  let complexity: Complexity = 'simple';
  if (nc > 5 || cc > 8) complexity = 'complex';
  else if (nc > 3 || cc > 4) {
    complexity = 'moderate';
  }
  return {
    nodeCount: nc, connectionCount: cc,
    complexity, depth,
  };
}
