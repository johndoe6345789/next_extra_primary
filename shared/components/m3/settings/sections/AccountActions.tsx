'use client';

import React from 'react';
import { testId } from '../accessibility';

interface AccountActionsProps {
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * Edit/Save/Cancel action buttons for the
 * account settings form.
 */
export const AccountActions: React.FC<
  AccountActionsProps
> = ({
  isEditing, isSaving,
  onEdit, onSave, onCancel,
}) => (
  <div>
    {!isEditing ? (
      <button
        className={''}
        onClick={onEdit}
        data-testid={testId.settingsButton(
          'edit-profile'
        )}
      >
        Edit Profile
      </button>
    ) : (
      <>
        <button
          className={''}
          onClick={onSave}
          disabled={isSaving}
          data-testid={testId.settingsButton(
            'save-profile'
          )}
          aria-busy={isSaving}
        >
          {isSaving
            ? 'Saving...'
            : 'Save Changes'}
        </button>
        <button
          onClick={onCancel}
          data-testid={testId.settingsButton(
            'cancel-profile'
          )}
        >
          Cancel
        </button>
      </>
    )}
  </div>
);
