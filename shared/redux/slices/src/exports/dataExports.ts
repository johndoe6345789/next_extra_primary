/**
 * Data slice exports: nodes, collaboration,
 * realtime, documentation, asyncData
 */

export {
  nodesSlice, type NodesState
} from '../slices/nodesSlice';
export {
  setRegistry, addNodeType, removeNodeType,
  setTemplates, addTemplate, removeTemplate,
  updateTemplate, setCategories, resetNodes
} from '../slices/nodesSlice';

export {
  collaborationSlice
} from '../slices/collaborationSlice';
export {
  addActivityEntry, setActivityFeed,
  clearActivityFeed, addConflict, resolveConflict,
  resolveAllConflicts, updateConflictResolution,
  clearConflicts
} from '../slices/collaborationSlice';

export {
  realtimeSlice
} from '../slices/realtimeSlice';
export {
  setConnected, addConnectedUser,
  removeConnectedUser, updateRemoteCursor,
  lockItem, releaseItem,
  clearRemoteCursor, clearAllRemote
} from '../slices/realtimeSlice';

export {
  documentationSlice
} from '../slices/documentationSlice';
export {
  openHelp, closeHelp, navigateToPage,
  setCategory, setSearchQuery, setSearchResults,
  goBack, clearSearch, clearHistory
} from '../slices/documentationSlice';

export {
  asyncDataSlice, type AsyncRequest
} from '../slices/asyncDataSlice';
export {
  fetchAsyncData, mutateAsyncData,
  refetchAsyncData, cleanupAsyncRequests,
  setRequestLoading, setRequestError,
  setRequestData, clearRequest, clearAllRequests,
  resetRequest, setGlobalLoading, setGlobalError,
  setRefetchInterval,
  selectAsyncRequest, selectAsyncData,
  selectAsyncError, selectAsyncLoading,
  selectAsyncRefetching, selectAllAsyncRequests,
  selectGlobalLoading, selectGlobalError
} from '../slices/asyncDataSlice';
