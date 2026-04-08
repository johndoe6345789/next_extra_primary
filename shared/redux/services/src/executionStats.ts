/**
 * Execution statistics and cleanup
 */

import { db } from '../db/schema';
import { getExecutionHistory } from
  './executionHistory';

/** Get execution statistics */
export async function getExecutionStats(
  workflowId: string,
  tenantId = 'default'
) {
  const execs = await getExecutionHistory(
    workflowId, tenantId, 100
  );
  if (execs.length === 0) {
    return {
      totalExecutions: 0, successCount: 0,
      errorCount: 0, averageDuration: 0,
    };
  }
  const ok = execs.filter(
    (e) => e.status === 'success'
  );
  const errs = execs.filter(
    (e) => e.status === 'error'
  );
  const durations = ok
    .filter((e) => e.endTime)
    .map(
      (e) => (e.endTime! - e.startTime) / 1000
    );
  const avg = durations.length > 0
    ? durations.reduce((a, b) => a + b, 0) /
      durations.length
    : 0;
  return {
    totalExecutions: execs.length,
    successCount: ok.length,
    errorCount: errs.length,
    averageDuration: avg,
    lastExecution: execs[0],
  };
}

/** Clear execution history for a workflow */
export async function clearExecutionHistory(
  workflowId: string,
  tenantId = 'default'
): Promise<void> {
  if (db?.executions) {
    const execs = await db.executions
      .where({ workflowId, tenantId })
      .toArray();
    for (const e of execs) {
      await db.executions.delete(e.id);
    }
  }
  try {
    const base =
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5000/api';
    await fetch(
      `${base}/workflows/${workflowId}` +
      `/executions`,
      { method: 'DELETE' }
    );
  } catch (err) {
    console.warn(
      'Clear history failed:', err
    );
  }
}
