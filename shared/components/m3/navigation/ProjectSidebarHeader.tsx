'use client';
/**
 * SidebarHeader - top bar of the ProjectSidebar
 * showing workspace name, count, and collapse toggle.
 */

import React from 'react'
import type { ProjectSidebarWorkspace } from './ProjectSidebarTypes'

/** Props for the sidebar header */
export interface SidebarHeaderProps {
  workspace?: ProjectSidebarWorkspace
  count: number
  isCollapsed: boolean
  onToggle: () => void
  testId: string
}

/** Workspace name, project count, and toggle button. */
export const SidebarHeader: React.FC<
  SidebarHeaderProps
> = ({ workspace, count, isCollapsed, onToggle, testId }) => (
  <div className="project-sidebar__header">
    <div className="project-sidebar__header-info">
      <h2
        className="project-sidebar__title"
        id="sidebar-workspace-title"
      >
        {workspace?.name || 'Workspace'}
      </h2>
      <p
        className="project-sidebar__count"
        aria-label={`${count} project${count !== 1 ? 's' : ''} available`}
      >
        {count} project{count !== 1 ? 's' : ''}
      </p>
    </div>
    <button
      className="project-sidebar__toggle"
      onClick={onToggle}
      title={isCollapsed ? 'Expand' : 'Collapse'}
      aria-label={
        isCollapsed
          ? 'Expand projects sidebar'
          : 'Collapse projects sidebar'
      }
      aria-expanded={!isCollapsed}
      aria-controls="projects-sidebar-content"
      data-testid={`${testId}-toggle`}
    >
      {isCollapsed ? '\u276F' : '\u276E'}
    </button>
  </div>
)

export default SidebarHeader
