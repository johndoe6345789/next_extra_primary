/**
 * Service Provider Container
 * Aggregates all service adapter interfaces
 */

import type {
  IProjectServiceAdapter,
  IWorkspaceServiceAdapter,
} from './serviceInterfaces'
import type {
  IWorkflowServiceAdapter,
} from './workflowInterface'
import type {
  IExecutionServiceAdapter,
} from './executionInterface'
import type {
  IAuthServiceAdapter,
} from './authInterface'

/** @brief All service adapters container */
export interface IServiceProviders {
  projectService: IProjectServiceAdapter;
  workspaceService: IWorkspaceServiceAdapter;
  workflowService: IWorkflowServiceAdapter;
  executionService: IExecutionServiceAdapter;
  authService: IAuthServiceAdapter;
}
