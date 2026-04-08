/**
 * Execution Service - barrel re-export
 */

export type { ExecutionRequest } from
  './executionRunner';

import {
  executeWorkflow, cancelExecution,
} from './executionRunner';
import {
  getExecutionHistory, getExecutionDetails,
  getExecutionStats, clearExecutionHistory,
} from './executionHistory';

class ExecutionService {
  executeWorkflow = executeWorkflow;
  getExecutionHistory = getExecutionHistory;
  getExecutionDetails = getExecutionDetails;
  getExecutionStats = getExecutionStats;
  cancelExecution = cancelExecution;
  clearExecutionHistory = clearExecutionHistory;
}

export const executionService =
  new ExecutionService();
export default executionService;
