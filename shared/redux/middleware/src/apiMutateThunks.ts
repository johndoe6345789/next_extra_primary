/**
 * API Mutate Workflow Thunks
 * Factory for create/delete workflow ops
 */

import type {
  ApiMiddlewareConfig,
} from './apiMiddlewareTypes'

/**
 * Creates thunk for creating new workflows
 * @param svc - Workflow service
 * @param actions - Action creators
 */
export const createNewWorkflowThunk = (
  svc: ApiMiddlewareConfig['workflowService'],
  actions: Pick<
    ApiMiddlewareConfig['actions'],
    'loadWorkflow' | 'setSaveError' | 'setNotification'
  >
) => {
  return (name: string, description?: string) =>
    async (dispatch: any) => {
      try {
        const wf = await svc.createWorkflow({
          name, description, tenantId: 'default',
        })
        dispatch(actions.loadWorkflow(wf))
        dispatch(actions.setNotification({
          id: `created-${Date.now()}`,
          type: 'success',
          message: `Workflow "${name}" created`,
          duration: 3000,
        }))
        return wf
      } catch (error) {
        const msg = error instanceof Error
          ? error.message
          : 'Failed to create workflow'
        dispatch(actions.setSaveError(msg))
        throw error
      }
    }
}

/**
 * Creates thunk for deleting workflows
 * @param svc - Workflow service
 * @param actions - Action creators
 */
export const createDeleteWorkflowThunk = (
  svc: ApiMiddlewareConfig['workflowService'],
  actions: Pick<
    ApiMiddlewareConfig['actions'],
    'setSaveError' | 'setNotification'
  >
) => {
  return (workflowId: string) =>
    async (dispatch: any) => {
      try {
        await svc.deleteWorkflow(workflowId)
        dispatch(actions.setNotification({
          id: `deleted-${Date.now()}`,
          type: 'success',
          message: 'Workflow deleted',
          duration: 3000,
        }))
      } catch (error) {
        const msg = error instanceof Error
          ? error.message
          : 'Failed to delete workflow'
        dispatch(actions.setSaveError(msg))
        throw error
      }
    }
}
