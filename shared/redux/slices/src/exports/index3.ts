/**
 * Barrel exports part 3
 * Async data, documentation, collaboration
 */

export {
  documentationSlice, openHelp, closeHelp,
  navigateToPage, setCategory, setSearchQuery,
  setSearchResults, goBack, clearSearch,
  clearHistory,
} from '../slices/documentationSlice';

export {
  asyncDataSlice, type AsyncRequest,
  setRequestLoading, setRequestError,
  setRequestData, clearRequest,
  clearAllRequests, resetRequest,
  setGlobalLoading, setGlobalError,
  setRefetchInterval,
  selectAsyncRequest, selectAsyncData,
  selectAsyncError, selectAsyncLoading,
  selectAsyncRefetching,
  selectAllAsyncRequests,
  selectGlobalLoading, selectGlobalError,
} from '../slices/asyncDataSlice';

export {
  fetchAsyncData, mutateAsyncData,
  refetchAsyncData, cleanupAsyncRequests,
} from '../slices/asyncDataThunks';
