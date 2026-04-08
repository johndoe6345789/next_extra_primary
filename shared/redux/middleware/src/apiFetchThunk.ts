/**
 * API Fetch Workflow Thunk
 * Factory for loading workflow operations
 */

import type {
  ApiMiddlewareConfig,
} from './apiMiddlewareTypes'

/**
 * Creates thunk for loading workflows
 * @param svc - Workflow service
 * @param actions - Action creators
 */
export const createFetchWorkflow = (
  svc: ApiMiddlewareConfig['workflowService'],
  actions: Pick<
    ApiMiddlewareConfig['actions'],
    'loadWorkflow' | 'setSaveError'
  >
) => {
  return (workflowId: string) =>
    async (dispatch: any, getState: any) => {
      try {
        const state = getState()
        const tenantId =
          state.workflow.current?.tenantId ||
          'default'
        let wf = await svc.getWorkflow(
          workflowId,
          tenantId
        )
        if (!wf) {
          wf = await svc.fetchFromBackend(
            workflowId,
            tenantId
          )
        }
        dispatch(actions.loadWorkflow(wf))
        return wf
      } catch (error) {
        const msg =
          error instanceof Error
            ? error.message
            : 'Failed to load workflow'
        dispatch(actions.setSaveError(msg))
        throw error
      }
    }
}
