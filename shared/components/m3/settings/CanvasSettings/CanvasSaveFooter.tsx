'use client';

import React from 'react';
import { testId } from '../accessibility';

interface CanvasSaveFooterProps {
  onSave: () => void;
  isSaving: boolean;
  saveMessage: string;
}

/**
 * Save button and status for canvas settings.
 */
export const CanvasSaveFooter: React.FC<
  CanvasSaveFooterProps
> = ({ onSave, isSaving, saveMessage }) => (
  <div>
    <button className={''}
      onClick={onSave} disabled={isSaving}
      data-testid={testId.settingsButton(
        'save-all')}
      aria-busy={isSaving}>
      {isSaving
        ? 'Saving...'
        : 'Save All Settings'}
    </button>
    {saveMessage && (
      <p role="status" aria-live="polite"
        aria-atomic="true">
        {saveMessage}
      </p>
    )}
  </div>
);
