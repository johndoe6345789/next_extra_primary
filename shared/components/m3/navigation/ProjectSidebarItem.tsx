'use client';
/**
 * ProjectItem - individual project row in the sidebar.
 */

import React from 'react'
import type {
  ProjectSidebarItem as ItemType,
  ProjectItemProps,
} from './ProjectSidebarTypes'

/**
 * Renders a single selectable project row with
 * color accent, name, description, and star badge.
 */
const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  isSelected,
  onClick,
  testIdPrefix,
}) => {
  const btnClass = [
    'project-sidebar__item-button',
    isSelected
      ? 'project-sidebar__item-button--selected'
      : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div role="listitem" className="project-sidebar__item">
      <button
        className={btnClass}
        style={{ borderLeftColor: project.color }}
        onClick={() => onClick(project.id)}
        aria-selected={isSelected}
        aria-current={isSelected ? 'page' : undefined}
        data-testid={`${testIdPrefix}-item-${project.id}`}
      >
        <div className="project-sidebar__item-content">
          <h4 className="project-sidebar__item-name">
            {project.name}
          </h4>
          {project.description && (
            <p className="project-sidebar__item-description">
              {project.description}
            </p>
          )}
        </div>
        {project.starred && (
          <span
            className="project-sidebar__item-star"
            aria-hidden="true"
          >
            &#9733;
          </span>
        )}
      </button>
    </div>
  )
}

export default ProjectItem
