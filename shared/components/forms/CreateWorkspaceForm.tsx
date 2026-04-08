/**
 * CreateWorkspaceForm Component
 * Form for creating new workspace with preview
 */

import React, { useState } from 'react';
import type { CreateWorkspaceFormProps }
  from './workspaceFormTypes';
import { WORKSPACE_COLORS }
  from './workspaceFormTypes';
import { WorkspacePreview }
  from './WorkspacePreview';
import { WorkspaceFormFields }
  from './WorkspaceFormFields';
import styles from '../../scss/components/forms/create-workspace-form.module.scss';

/**
 * CreateWorkspaceForm - Workspace creation
 * with live preview.
 */
export const CreateWorkspaceForm = ({
  name, onNameChange,
  onSubmit, onCancel, ...rest
}: CreateWorkspaceFormProps) => {
  const [color, setColor] =
    useState(WORKSPACE_COLORS[0]);
  const [description, setDescription] =
    useState('');

  const initials = name.trim()
    ? name.split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'WS';

  return (
    <div className={styles.form} {...rest}>
      <WorkspacePreview
        initials={initials} name={name}
        description={description}
        color={color}
        onColorChange={setColor} />
      <WorkspaceFormFields
        name={name}
        onNameChange={onNameChange}
        description={description}
        onDescriptionChange={setDescription}
        onSubmit={onSubmit}
        onCancel={onCancel} />
    </div>
  );
};
