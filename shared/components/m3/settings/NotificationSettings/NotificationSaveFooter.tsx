'use client';

import React from 'react';
import { testId } from '../accessibility';

interface NotificationSaveFooterProps {
  onSave: () => void;
  isSaving: boolean;
  saveMessage: string;
}

/**
 * Save button and status message for
 * notification settings.
 */
export const NotificationSaveFooter: React.FC<
  NotificationSaveFooterProps
> = ({ onSave, isSaving, saveMessage }) => (
  <div>
    <button className={''}
      onClick={onSave}
      disabled={isSaving}
      data-testid={testId.settingsButton(
        'save-preferences')}
      aria-busy={isSaving}>
      {isSaving
        ? 'Saving...'
        : 'Save Preferences'}
    </button>
    {saveMessage && (
      <p role="status" aria-live="polite"
        aria-atomic="true">
        {saveMessage}
      </p>
    )}
  </div>
);
