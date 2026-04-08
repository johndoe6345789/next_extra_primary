/**
 * useWorkspace Hook
 * Manages workspace state with Redux integration.
 */

import { useCallback, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setWorkspaces, setCurrentWorkspace,
  setWorkspaceLoading, setWorkspaceError,
} from '@shared/redux-slices'
import type { Workspace } from '@shared/types'
import { useUINotifications } from './ui/useUINotifications'
import { dbalFetch } from './workspaceDbal'
import { useWorkspaceOps } from './workspaceOperations'

export type { Workspace } from '@shared/types'
export type { CreateWorkspaceRequest, UpdateWorkspaceRequest } from './workspaceOperations'

interface WorkspaceReduxState { workspace: { workspaces: Workspace[]; currentWorkspace: Workspace | null; currentWorkspaceId: string | null; isLoading: boolean; error: string | null } }

/** Self-contained workspace hook with Redux */
export function useWorkspace() {
  const dispatch = useDispatch()
  const notifs = useUINotifications()

  const workspaces = useSelector((s: WorkspaceReduxState) => s.workspace?.workspaces ?? [])
  const currentWorkspace = useSelector((s: WorkspaceReduxState) => s.workspace?.currentWorkspace ?? null)
  const currentWorkspaceId = useSelector((s: WorkspaceReduxState) => s.workspace?.currentWorkspaceId ?? null)
  const isLoading = useSelector((s: WorkspaceReduxState) => s.workspace?.isLoading ?? false)
  const error = useSelector((s: WorkspaceReduxState) => s.workspace?.error ?? null)

  const [isInitialized, setIsInitialized] = useState(false)
  const retryCount = useRef(0)
  const retryTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const loadWorkspaces = useCallback(async () => {
    dispatch(setWorkspaceLoading(true))
    try {
      const res = await dbalFetch<{ data: Workspace[]; total: number }>('GET', 'default/core/workspace')
      if (res?.data) {
        dispatch(setWorkspaces(res.data))
        const storedId = typeof window !== 'undefined' ? localStorage.getItem('currentWorkspaceId') : null
        if (!storedId && res.data.length > 0) {
          dispatch(setCurrentWorkspace(res.data[0].id))
          if (typeof window !== 'undefined') localStorage.setItem('currentWorkspaceId', res.data[0].id)
        }
      } else { dispatch(setWorkspaces([])) }
      dispatch(setWorkspaceError(null))
      retryCount.current = 0
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load workspaces'
      dispatch(setWorkspaceError(msg))
      if (retryCount.current < 3) {
        const delay = Math.min(1000 * 2 ** retryCount.current, 16000)
        retryCount.current += 1
        retryTimer.current = setTimeout(loadWorkspaces, delay)
      }
    } finally { dispatch(setWorkspaceLoading(false)) }
  }, [dispatch])

  useEffect(() => {
    if (!isInitialized) { setIsInitialized(true); loadWorkspaces() }
    return () => { clearTimeout(retryTimer.current) }
  }, [])

  const ops = useWorkspaceOps(dispatch, notifs)

  return {
    workspaces, currentWorkspace, currentWorkspaceId, isLoading, error, isInitialized,
    loadWorkspaces, createWorkspace: ops.createWorkspace,
    updateWorkspace: ops.updateWorkspaceData, deleteWorkspace: ops.deleteWorkspace,
    switchWorkspace: ops.switchWorkspace,
  }
}

export default useWorkspace
