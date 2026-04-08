/**
 * Project delete operation
 */

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  removeProject,
  setProjectLoading,
  setProjectError,
} from '@shared/redux-slices';

/**
 * Creates a deleteProject callback
 * @param dispatch - Redux dispatch
 */
export function useDeleteProject(
  dispatch: ReturnType<typeof useDispatch>
) {
  return useCallback(
    async (id: string) => {
      dispatch(setProjectLoading(true));
      try {
        dispatch(removeProject(id));
      } catch (err) {
        const msg = err instanceof Error
          ? err.message
          : 'Failed to delete project';
        dispatch(setProjectError(msg));
        throw err;
      } finally {
        dispatch(setProjectLoading(false));
      }
    },
    [dispatch]
  );
}
