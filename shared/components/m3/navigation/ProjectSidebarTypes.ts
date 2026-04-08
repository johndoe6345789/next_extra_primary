/**
 * Type definitions for ProjectSidebar components.
 */

/**
 * Project item structure
 */
export interface ProjectSidebarItem {
  id: string
  name: string
  description?: string
  color?: string
  starred?: boolean
}

/**
 * Workspace information
 */
export interface ProjectSidebarWorkspace {
  id: string
  name: string
}

/** Props for the ProjectSidebar component */
export interface ProjectSidebarProps {
  /** List of projects to display */
  projects: ProjectSidebarItem[]
  /** Current workspace information */
  workspace?: ProjectSidebarWorkspace
  /** Currently selected project ID */
  currentProjectId?: string
  /** Callback when a project is selected */
  onSelectProject: (projectId: string) => void
  /** Callback when creating a new project */
  onCreateProject?: (name: string) => Promise<void>
  /** Whether the sidebar starts collapsed */
  defaultCollapsed?: boolean
  /** Custom class name */
  className?: string
  /** Test ID for accessibility testing */
  'data-testid'?: string
}

/** Props for an individual project item */
export interface ProjectItemProps {
  project: ProjectSidebarItem
  isSelected: boolean
  onClick: (projectId: string) => void
  testIdPrefix: string
}
