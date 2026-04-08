import type React from 'react'
import type {
  ProjectSidebarItem,
} from './ProjectSidebarTypes'

/** Props for the AllProjectsSection. */
export interface AllProjectsSectionProps {
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
