'use client';
/** ProjectSidebar - collapsible sidebar. */

import React from 'react'
import type { ProjectSidebarProps }
  from './ProjectSidebarTypes'
import { useProjectSidebar }
  from './useProjectSidebar'
import { SidebarHeader }
  from './ProjectSidebarHeader'
import { SidebarContent }
  from './ProjectSidebarContent'

export type {
  ProjectSidebarProps,
  ProjectSidebarItem,
  ProjectSidebarWorkspace,
} from './ProjectSidebarTypes'

/** Collapsible project navigation sidebar. */
export const ProjectSidebar: React.FC<
  ProjectSidebarProps
> = ({
  projects, workspace, currentProjectId,
  onSelectProject, onCreateProject,
  defaultCollapsed = false, className = '',
  'data-testid': testId = 'project-sidebar',
}) => {
  const sb = useProjectSidebar({
    defaultCollapsed, onCreateProject,
  })
  const starred = projects.filter(
    (p) => p.starred)
  const regular = projects.filter(
    (p) => !p.starred)
  const cls = [
    'project-sidebar',
    sb.collapsed
      ? 'project-sidebar--collapsed' : '',
    className,
  ].filter(Boolean).join(' ')
  return (
    <aside className={cls}
      data-testid={testId}
      role="complementary"
      aria-label="Projects sidebar">
      <SidebarHeader
        workspace={workspace}
        count={projects.length}
        isCollapsed={sb.collapsed}
        onToggle={sb.toggle}
        testId={testId} />
      <div id="projects-sidebar-content"
        className="project-sidebar__content">
        {!sb.collapsed && (
          <SidebarContent
            starred={starred}
            regular={regular}
            currentProjectId={currentProjectId}
            onSelectProject={onSelectProject}
            onCreateProject={onCreateProject}
            showForm={sb.showForm}
            setShowForm={sb.setShowForm}
            newName={sb.newName}
            setNewName={sb.setNewName}
            isCreating={sb.creating}
            handleCreate={sb.handleCreate}
            resetForm={sb.resetForm}
            testId={testId} />
        )}
      </div>
    </aside>
  )
}

export default ProjectSidebar
