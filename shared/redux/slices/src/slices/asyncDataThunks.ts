/**
 * Async thunks for generic data fetching
 */

import { createAsyncThunk } from '@reduxjs/toolkit';

export {
  mutateAsyncData, refetchAsyncData,
  cleanupAsyncRequests,
} from './asyncDataMutationThunks';

/**
 * Generic fetch thunk - handles any async op
 * Supports retries and request deduplication
 */
export const fetchAsyncData = createAsyncThunk(
  'asyncData/fetch',
  async (
    params: {
      id: string;
      fetchFn: () => Promise<unknown>;
      maxRetries?: number;
      retryDelay?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const result = await params.fetchFn();
      return { id: params.id, data: result };
    } catch (error) {
      return rejectWithValue({
        id: params.id,
        error: error instanceof Error
          ? error.message
          : String(error),
      });
    }
  }
);
