'use client';
/**
 * StarredSection - displays starred projects in the
 * ProjectSidebar.
 */

import React from 'react'
import type { ProjectSidebarItem } from './ProjectSidebarTypes'
import ProjectItem from './ProjectSidebarItem'

/** Props for the starred projects section */
export interface StarredSectionProps {
  items: ProjectSidebarItem[]
  currentId?: string
  onSelect: (id: string) => void
  testId: string
}

/** Renders the "Starred" heading and project list. */
export const StarredSection: React.FC<
  StarredSectionProps
> = ({ items, currentId, onSelect, testId }) => (
  <section
    className="project-sidebar__section project-sidebar__section--starred"
    role="region"
    aria-label="Starred projects"
  >
    <h3
      className="project-sidebar__section-title"
      id="starred-projects-title"
    >
      Starred
    </h3>
    <div
      className="project-sidebar__list"
      role="list"
      aria-labelledby="starred-projects-title"
    >
      {items.map((project) => (
        <ProjectItem
          key={project.id}
          project={project}
          isSelected={project.id === currentId}
          onClick={onSelect}
          testIdPrefix={testId}
        />
      ))}
    </div>
  </section>
)

export default StarredSection
