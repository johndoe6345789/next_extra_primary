'use client';

import React from 'react';
import Typography from '@shared/m3/Typography';
import { Button } from '../atoms';

/** Props for ApiKeyDisplay. */
export interface ApiKeyDisplayProps {
  /** Provider identifier. */
  provider: string;
  /** Provider display label. */
  label: string;
  /** Masked key value. */
  maskedKey: string;
  /** Current model string. */
  model: string;
  /** Start editing handler. */
  onEdit: () => void;
  /** Delete handler. */
  onDelete: () => void;
  /** Translated labels. */
  labels: {
    edit: string;
    remove: string;
  };
}

/**
 * Read-only display of a configured API key
 * with edit and delete buttons.
 */
const ApiKeyDisplay: React.FC<
  ApiKeyDisplayProps
> = ({
  provider, label, maskedKey,
  model, onEdit, onDelete, labels,
}) => (
  <div style={{
    display: 'flex', gap: 8,
    alignItems: 'center',
    padding: '6px 0',
  }}
  data-testid={`key-row-${provider}`}>
    <Typography variant="body2"
      style={{ flex: 1 }}>
      {label}: {maskedKey}
      {model ? ` (${model})` : ''}
    </Typography>
    <Button
      onClick={onEdit}
      testId={`edit-key-${provider}`}
      ariaLabel={labels.edit}>
      {labels.edit}
    </Button>
    <Button
      onClick={onDelete}
      testId={`del-key-${provider}`}
      ariaLabel={labels.remove}>
      {labels.remove}
    </Button>
  </div>
);

export default ApiKeyDisplay;
