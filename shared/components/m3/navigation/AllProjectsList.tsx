'use client';
/**
 * AllProjectsList - renders the list of
 * non-starred projects or an empty state.
 */

import React from 'react'
import type {
  ProjectSidebarItem,
} from './ProjectSidebarTypes'
import ProjectItem from './ProjectSidebarItem'

/** Props for the AllProjectsList component. */
export interface AllProjectsListProps {
  regular: ProjectSidebarItem[]
  currentProjectId?: string
  onSelectProject: (id: string) => void
  testId: string
}

/** Project list or empty state message. */
export const AllProjectsList: React.FC<
  AllProjectsListProps
> = ({ regular, currentProjectId,
  onSelectProject, testId }) => (
  <div
    className="project-sidebar__list"
    role="list"
    aria-labelledby="all-projects-title"
  >
    {regular.length > 0 ? (
      regular.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          isSelected={
            project.id === currentProjectId
          }
          onClick={onSelectProject}
          testIdPrefix={testId}
        />
      ))
    ) : (
      <p
        className="project-sidebar__empty"
        role="status"
      >
        No projects. Create one to get started!
      </p>
    )}
  </div>
)

export default AllProjectsList
