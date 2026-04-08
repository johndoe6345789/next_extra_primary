'use client';
/**
 * AllProjectsSection - lists non-starred
 * projects and the optional new-project form.
 */

import React from 'react'
import type {
  AllProjectsSectionProps,
} from './allProjectsTypes'
import NewProjectForm
  from './ProjectSidebarForm'
import { AllProjectsList }
  from './AllProjectsList'

export type { AllProjectsSectionProps }
  from './allProjectsTypes'

/** Heading, add-button, form, and list. */
export const AllProjectsSection: React.FC<
  AllProjectsSectionProps
> = (p) => (
  <section
    className="project-sidebar__section"
    role="region"
    aria-label="All projects"
  >
    <div className={
      'project-sidebar__section-header'
    }>
      <h3 className={
        'project-sidebar__section-title'
      } id="all-projects-title">
        Projects
      </h3>
      {p.onCreateProject && (
        <button
          className={
            'project-sidebar__add-button'
          }
          onClick={() => p.setShowForm(true)}
          title="Create new project"
          aria-label="Create new project"
          data-testid={
            `${p.testId}-new-project`
          }
        >
          +
        </button>
      )}
    </div>

    {p.showForm && (
      <NewProjectForm
        name={p.newName}
        onNameChange={p.setNewName}
        onSubmit={p.handleCreate}
        onCancel={p.resetForm}
        isCreating={p.isCreating}
        testIdPrefix={p.testId}
      />
    )}

    <AllProjectsList
      regular={p.regular}
      currentProjectId={p.currentProjectId}
      onSelectProject={p.onSelectProject}
      testId={p.testId}
    />
  </section>
)

export default AllProjectsSection
