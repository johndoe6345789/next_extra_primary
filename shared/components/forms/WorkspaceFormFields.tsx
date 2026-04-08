/**
 * WorkspaceFormFields Component
 * Input fields for workspace creation form
 */

import React from 'react';
import { Button, TextField } from '../m3';
import { AddIcon } from '../../icons/react';
import styles from '../../scss/components/forms/create-workspace-form.module.scss';

interface WorkspaceFormFieldsProps {
  name: string;
  onNameChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  onSubmit: (
    e: React.FormEvent
  ) => void;
  onCancel: () => void;
}

/**
 * Name, description, and action buttons for
 * workspace creation.
 */
export const WorkspaceFormFields = ({
  name, onNameChange,
  description, onDescriptionChange,
  onSubmit, onCancel,
}: WorkspaceFormFieldsProps) => (
  <form className={styles.fields}
    onSubmit={onSubmit}>
    <h2 className={styles.title}>
      <span className={styles.titleIcon}>
        <AddIcon size={20} />
      </span>
      Create New Workspace
    </h2>
    <TextField label="Workspace Name"
      placeholder="e.g., Marketing Automation"
      value={name}
      onChange={(e) =>
        onNameChange(e.target.value)}
      autoFocus />
    <div className={styles.group}>
      <label className={styles.label}>
        Description (Optional)
      </label>
      <textarea className={styles.textarea}
        placeholder="What will this workspace be used for?"
        value={description}
        onChange={(e) =>
          onDescriptionChange(e.target.value)}
        rows={3} />
    </div>
    <div className={styles.actions}>
      <Button type="submit"
        variant="contained" color="primary"
        disabled={!name.trim()}>
        Create Workspace
      </Button>
      <Button type="button"
        variant="outlined" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  </form>
);
