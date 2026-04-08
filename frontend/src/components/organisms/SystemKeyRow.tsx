'use client';

import React, { useState } from 'react';
import Typography from '@shared/m3/Typography';
import { TextField, Button } from '../atoms';

/** Props for SystemKeyRow. */
export interface SystemKeyRowProps {
  /** Provider identifier. */
  provider: string;
  /** Provider display label. */
  label: string;
  /** Whether a key is already configured. */
  configured: boolean;
  /** Masked existing key. */
  maskedKey: string;
  /** Called when saving a new key. */
  onSave: (key: string) => void;
  /** Translated labels. */
  labels: { apiKey: string; save: string };
}

/** Single system key row in admin panel. */
const SystemKeyRow: React.FC<
  SystemKeyRowProps
> = ({
  provider, label, configured,
  maskedKey, onSave, labels,
}) => {
  const [key, setKey] = useState('');
  return (
    <div style={{
      padding: '8px 0',
      display: 'flex', gap: 8,
      alignItems: 'flex-end',
    }}
    data-testid={`sys-key-${provider}`}>
      <Typography variant="body2"
        style={{ minWidth: 80 }}>
        {label}
        {configured
          ? `: ${maskedKey}` : ''}
      </Typography>
      <TextField
        label={labels.apiKey}
        value={key}
        onChange={(e) =>
          setKey(e.target.value)}
        testId={`sys-input-${provider}`}
      />
      <Button
        onClick={() => {
          if (key) { onSave(key); setKey(''); }
        }}
        disabled={!key}
        testId={`sys-save-${provider}`}
        ariaLabel={labels.save}>
        {labels.save}
      </Button>
    </div>
  );
};

export default SystemKeyRow;
