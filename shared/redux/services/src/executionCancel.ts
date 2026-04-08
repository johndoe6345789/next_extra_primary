/**
 * Execution cancellation
 * Stops a running execution
 */

import { db } from '../db/schema'

/**
 * Cancel a running execution
 * Updates IndexedDB and notifies backend
 * @param executionId - ID to cancel
 */
export async function cancelExecution(
  executionId: string
): Promise<void> {
  if (db?.executions) {
    await db.executions.update(executionId, {
      status: 'stopped',
      endTime: Date.now(),
    })
  }
  try {
    const base =
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5000/api'
    await fetch(
      `${base}/executions/${executionId}/cancel`,
      { method: 'POST' }
    )
  } catch (err) {
    console.warn(
      'Cancel on backend failed:',
      err
    )
  }
}
