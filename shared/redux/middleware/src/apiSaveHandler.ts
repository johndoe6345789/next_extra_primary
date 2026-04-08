/**
 * API Save Handler
 * Handles workflow save operations in
 * the API middleware.
 */

import type {
  ApiMiddlewareConfig,
} from './apiMiddlewareTypes'

/**
 * Handle workflow save action
 * @param store - Redux store
 * @param next - Next middleware
 * @param action - The dispatched action
 * @param svc - Workflow service
 * @param actions - Action creators
 */
export async function handleSave(
  store: any,
  next: any,
  action: any,
  svc: ApiMiddlewareConfig['workflowService'],
  actions: ApiMiddlewareConfig['actions']
): Promise<void> {
  const state = store.getState()
  const workflow = state.workflow.current

  if (!workflow) {
    next(
      actions.setSaveError('No workflow loaded')
    )
    next(action)
    return
  }

  try {
    next(action)
    await svc.saveWorkflow(workflow)
    const saved =
      await svc.syncToBackend(workflow)
    next(actions.saveWorkflow(saved))
    next(
      actions.setNotification({
        id: `saved-${Date.now()}`,
        type: 'success',
        message: 'Workflow saved successfully',
        duration: 3000,
      })
    )
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : 'Failed to save workflow'
    next(actions.setSaveError(msg))
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
