/**
 * Cleanup thunk extra reducers
 */

import type { ActionReducerMapBuilder } from
  '@reduxjs/toolkit';
import type { AsyncDataState } from
  './asyncDataTypes';
import { cleanupAsyncRequests } from
  './asyncDataThunks';

/** Build cleanup thunk extra reducers */
export function buildCleanupReducers(
  builder: ActionReducerMapBuilder<AsyncDataState>
) {
  builder.addCase(
    cleanupAsyncRequests.fulfilled,
    (state, action) => {
      const now = Date.now();
      const maxAge = action.payload.maxAge;
      const toDelete: string[] = [];

      for (const [id, req] of
        Object.entries(state.requests)) {
        const age = now - req.createdAt;
        if (
          age > maxAge &&
          req.status !== 'pending'
        ) {
          toDelete.push(id);
        }
      }

      toDelete.forEach((id) => {
        delete state.requests[id];
      });
    }
  );
}
