/**
 * Workspace switch operation
 */

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {
  setCurrentWorkspace,
} from '@shared/redux-slices'

/**
 * Creates a switchWorkspace callback
 * @param dispatch - Redux dispatch
 */
export function useSwitchWorkspace(
  dispatch: ReturnType<typeof useDispatch>
) {
  return useCallback(
    (id: string | null) => {
      dispatch(setCurrentWorkspace(id))
      if (typeof window !== 'undefined') {
        if (id) {
          localStorage.setItem(
            'currentWorkspaceId',
            id
          )
        } else {
          localStorage.removeItem(
            'currentWorkspaceId'
          )
        }
      }
    },
    [dispatch]
  )
}
