'use client';
/**
 * ProjectSidebarContent - collapsible
 * content area with starred/all projects.
 */

import React from 'react'
import type {
  ProjectSidebarItem,
} from './ProjectSidebarTypes'
import { StarredSection }
  from './ProjectSidebarStarred'
import { AllProjectsSection }
  from './ProjectSidebarAllProjects'

/** Props for sidebar content area. */
export interface SidebarContentProps {
  starred: ProjectSidebarItem[]
  regular: ProjectSidebarItem[]
  currentProjectId?: string
  onSelectProject: (id: string) => void
  onCreateProject?: (
    n: string
  ) => Promise<void>
  showForm: boolean
  setShowForm: (v: boolean) => void
  newName: string
  setNewName: (v: string) => void
  isCreating: boolean
  handleCreate: (
    e: React.FormEvent
  ) => void
  resetForm: () => void
  testId: string
}

/** Starred + all projects sections. */
export const SidebarContent: React.FC<
  SidebarContentProps
> = (p) => (
  <>
    {p.starred.length > 0 && (
      <StarredSection
        items={p.starred}
        currentId={p.currentProjectId}
        onSelect={p.onSelectProject}
        testId={p.testId} />
    )}
    <AllProjectsSection
      regular={p.regular}
      currentProjectId={p.currentProjectId}
      onSelectProject={p.onSelectProject}
      onCreateProject={p.onCreateProject}
      showForm={p.showForm}
      setShowForm={p.setShowForm}
      newName={p.newName}
      setNewName={p.setNewName}
      isCreating={p.isCreating}
      handleCreate={p.handleCreate}
      resetForm={p.resetForm}
      testId={p.testId} />
  </>
)
