/**
 * API Execution Handler
 * Handles workflow execution in
 * the API middleware.
 */

import type {
  ApiMiddlewareConfig,
} from './apiMiddlewareTypes'

/**
 * Handle workflow execution action
 * @param store - Redux store
 * @param next - Next middleware
 * @param action - The dispatched action
 * @param svc - Execution service
 * @param actions - Action creators
 */
export async function handleExecution(
  store: any,
  next: any,
  action: any,
  svc: ApiMiddlewareConfig['executionService'],
  actions: ApiMiddlewareConfig['actions']
): Promise<void> {
  const state = store.getState()
  const workflow = state.workflow.current
  const execution = action.payload

  if (!workflow) {
    next(
      actions.setNotification({
        id: `error-${Date.now()}`,
        type: 'error',
        message: 'No workflow to execute',
        duration: 5000,
      })
    )
    next(action)
    return
  }

  try {
    next(action)
    const result =
      await svc.executeWorkflow(workflow.id, {
        nodes: workflow.nodes,
        connections: workflow.connections,
      })
    next(actions.endExecution(result))
    next(
      actions.setNotification({
        id: `executed-${Date.now()}`,
        type:
          result.status === 'success'
            ? 'success'
            : 'warning',
        message: `Execution ${result.status}`,
        duration: 5000,
      })
    )
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : 'Execution failed'
    next(
      actions.endExecution({
        ...execution,
        status: 'error',
        error: {
          code: 'EXECUTION_ERROR',
          message: msg,
        },
      })
    )
    next(
      actions.setNotification({
        id: `error-${Date.now()}`,
        type: 'error',
        message: msg,
        duration: 5000,
      })
    )
  }
}
