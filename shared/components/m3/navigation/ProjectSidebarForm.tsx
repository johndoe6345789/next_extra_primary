'use client';
/**
 * NewProjectForm - inline form for creating a new project.
 */

import React from 'react'

/** Props for the new-project inline form */
export interface NewProjectFormProps {
  /** Current name value */
  name: string
  /** Name change handler */
  onNameChange: (value: string) => void
  /** Form submit handler */
  onSubmit: (e: React.FormEvent) => void
  /** Cancel handler */
  onCancel: () => void
  /** Whether a create request is in flight */
  isCreating: boolean
  /** Test ID prefix */
  testIdPrefix: string
}

/**
 * Renders an inline form with text input, Create,
 * and Cancel buttons.
 */
const NewProjectForm: React.FC<NewProjectFormProps> = ({
  name,
  onNameChange,
  onSubmit,
  onCancel,
  isCreating,
  testIdPrefix,
}) => (
  <form
    className="project-sidebar__form"
    onSubmit={onSubmit}
    role="region"
    aria-label="Create new project form"
  >
    <label
      htmlFor="new-project-name-input"
      className="sr-only"
    >
      Project name
    </label>
    <input
      id="new-project-name-input"
      type="text"
      className="project-sidebar__input"
      placeholder="Project name..."
      value={name}
      onChange={(e) => onNameChange(e.target.value)}
      autoFocus
      aria-required="true"
      disabled={isCreating}
      data-testid={`${testIdPrefix}-new-project-input`}
    />
    <div className="project-sidebar__form-actions">
      <button
        type="submit"
        className="project-sidebar__button project-sidebar__button--primary"
        disabled={isCreating || !name.trim()}
        data-testid={`${testIdPrefix}-create-project`}
      >
        {isCreating ? 'Creating...' : 'Create'}
      </button>
      <button
        type="button"
        className="project-sidebar__button project-sidebar__button--secondary"
        onClick={onCancel}
        disabled={isCreating}
        data-testid={`${testIdPrefix}-cancel-new-project`}
      >
        Cancel
      </button>
    </div>
  </form>
)

export default NewProjectForm
