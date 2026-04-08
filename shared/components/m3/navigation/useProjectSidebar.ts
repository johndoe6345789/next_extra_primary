'use client';
/**
 * Hook encapsulating ProjectSidebar state:
 * collapsed toggle, form visibility, and creation.
 */

import { useCallback, useState } from 'react'
import React from 'react'

/** Options for the useProjectSidebar hook */
export interface UseProjectSidebarOptions {
  defaultCollapsed: boolean
  onCreateProject?: (name: string) => Promise<void>
}

/** Return type for the useProjectSidebar hook */
export interface UseProjectSidebarReturn {
  collapsed: boolean
  toggle: () => void
  showForm: boolean
  setShowForm: (v: boolean) => void
  newName: string
  setNewName: (v: string) => void
  creating: boolean
  handleCreate: (e: React.FormEvent) => void
  resetForm: () => void
}

/**
 * Manages sidebar collapse state, new-project form
 * visibility, and the async creation workflow.
 */
export function useProjectSidebar({
  defaultCollapsed,
  onCreateProject,
}: UseProjectSidebarOptions): UseProjectSidebarReturn {
  const [collapsed, setCollapsed] = useState(
    defaultCollapsed,
  )
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  const toggle = useCallback(
    () => setCollapsed((v) => !v),
    [],
  )

  const handleCreate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!newName.trim() || !onCreateProject) return
      if (creating) return
      try {
        setCreating(true)
        await onCreateProject(newName.trim())
        setNewName('')
        setShowForm(false)
      } catch (err) {
        console.error('Create project failed:', err)
      } finally {
        setCreating(false)
      }
    },
    [newName, onCreateProject, creating],
  )

  const resetForm = useCallback(() => {
    setNewName('')
    setShowForm(false)
  }, [])

  return {
    collapsed,
    toggle,
    showForm,
    setShowForm,
    newName,
    setNewName,
    creating,
    handleCreate,
    resetForm,
  }
}
