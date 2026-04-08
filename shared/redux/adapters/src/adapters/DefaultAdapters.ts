/**
 * Default Service Adapter Implementations
 *
 * Re-exports all default adapters.
 * Each adapter is implemented in its own file
 * for maintainability.
 */

export {
  DefaultProjectServiceAdapter,
} from './DefaultProjectAdapter'

export {
  DefaultProjectCanvasAdapter,
} from './DefaultProjectCanvasAdapter'

export {
  DefaultWorkspaceServiceAdapter,
} from './DefaultWorkspaceAdapter'

export {
  DefaultWorkflowServiceAdapter,
} from './DefaultWorkflowAdapter'

export {
  validateWorkflow,
  getWorkflowMetrics,
} from './DefaultWorkflowMetrics'

export {
  DefaultExecutionServiceAdapter,
} from './DefaultExecutionAdapter'

export {
  getExecutionStats,
  getExecutionHistory,
} from './DefaultExecutionHistory'

export {
  DefaultAuthServiceAdapter,
} from './DefaultAuthAdapter'

export {
  getCurrentUser,
  isAuthenticated,
  getToken,
  getUser,
  persistAuth,
  clearAuth,
} from './DefaultAuthState'
