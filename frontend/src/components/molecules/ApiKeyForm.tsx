'use client';

import React from 'react';
import Typography from '@shared/m3/Typography';
import Select from '@shared/m3/inputs/Select';
import MenuItem from
  '@shared/m3/navigation/MenuItem';
import { TextField, Button } from '../atoms';

/** A selectable model option. */
interface ModelOpt {
  value: string;
  label: string;
}

/** Props for ApiKeyForm. */
export interface ApiKeyFormProps {
  /** Provider identifier. */
  provider: string;
  /** Provider display label. */
  label: string;
  /** Available model options. */
  models: ModelOpt[];
  /** API key input value. */
  keyValue: string;
  /** API key setter. */
  setKey: (v: string) => void;
  /** Model input value. */
  model: string;
  /** Model setter. */
  setModel: (v: string) => void;
  /** Save handler. */
  onSave: () => void;
  /** Translated labels. */
  labels: {
    apiKey: string;
    model: string;
    save: string;
  };
}

/**
 * Inline form for entering a new or updated
 * API key and model.
 */
const ApiKeyForm: React.FC<ApiKeyFormProps> = ({
  provider, label, models, keyValue,
  setKey, model, setModel, onSave, labels,
}) => (
  <div style={{ padding: '6px 0' }}
    data-testid={`key-form-${provider}`}>
    <Typography variant="body2"
      gutterBottom>{label}</Typography>
    <div style={{
      display: 'flex', gap: 8,
      alignItems: 'flex-end',
    }}>
      <TextField
        label={labels.apiKey}
        value={keyValue}
        onChange={(e) =>
          setKey(e.target.value)}
        testId={`input-key-${provider}`}
      />
      <Select
        label={labels.model}
        value={model}
        onChange={(e) =>
          setModel(String(e.target.value))}
        testId={`select-mdl-${provider}`}
        size="small"
      >
        {models.map((m) => (
          <MenuItem key={m.value}
            value={m.value}>
            {m.label}
          </MenuItem>
        ))}
      </Select>
      <Button
        onClick={onSave}
        disabled={!keyValue}
        testId={`save-key-${provider}`}
        ariaLabel={labels.save}>
        {labels.save}
      </Button>
    </div>
  </div>
);

export default ApiKeyForm;
