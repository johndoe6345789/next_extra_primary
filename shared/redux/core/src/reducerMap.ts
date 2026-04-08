/**
 * Combined reducer map for configureStore
 */

import { authSlice } from './slices/authSlice';
import { projectSlice } from
  './slices/projectSlice';
import { workspaceSlice } from
  './slices/workspaceSlice';
import { workflowSlice } from
  './slices/workflowSlice';
import { nodesSlice } from './slices/nodesSlice';
import { asyncDataSlice } from
  './slices/asyncDataSlice';

/** Combined reducer map for configureStore */
export const coreReducers = {
  auth: authSlice.reducer,
  project: projectSlice.reducer,
  workspace: workspaceSlice.reducer,
  workflow: workflowSlice.reducer,
  nodes: nodesSlice.reducer,
  asyncData: asyncDataSlice.reducer,
};
