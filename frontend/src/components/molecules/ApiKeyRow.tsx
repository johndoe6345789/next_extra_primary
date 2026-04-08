'use client';

import React, { useState } from 'react';
import ApiKeyDisplay from './ApiKeyDisplay';
import ApiKeyForm from './ApiKeyForm';

/** A selectable model option. */
interface ModelOpt {
  value: string;
  label: string;
}

/** Props for ApiKeyRow molecule. */
export interface ApiKeyRowProps {
  /** Provider display label. */
  label: string;
  /** Provider identifier. */
  provider: string;
  /** Available model options. */
  models: ModelOpt[];
  /** Masked key (empty if not set). */
  maskedKey: string;
  /** Current model string. */
  model: string;
  /** Save handler. */
  onSave: (key: string, model: string) => void;
  /** Delete handler. */
  onDelete: () => void;
  /** Translation function. */
  labels: {
    apiKey: string; model: string;
    save: string; edit: string;
    remove: string;
  };
}

/**
 * Editable row for a single AI provider key.
 */
export const ApiKeyRow: React.FC<
  ApiKeyRowProps
> = ({
  label, provider, models, maskedKey,
  model, onSave, onDelete, labels,
}) => {
  const [key, setKey] = useState('');
  const [mdl, setMdl] = useState(model);
  const [editing, setEditing] = useState(false);

  if (!editing && maskedKey) {
    return (
      <ApiKeyDisplay
        provider={provider}
        label={label}
        maskedKey={maskedKey}
        model={mdl}
        onEdit={() => setEditing(true)}
        onDelete={onDelete}
        labels={{
          edit: labels.edit,
          remove: labels.remove,
        }}
      />
    );
  }

  return (
    <ApiKeyForm
      provider={provider}
      label={label}
      models={models}
      keyValue={key}
      setKey={setKey}
      model={mdl}
      setModel={setMdl}
      onSave={() => {
        if (key) onSave(key, mdl);
        setKey('');
        setEditing(false);
      }}
      labels={{
        apiKey: labels.apiKey,
        model: labels.model,
        save: labels.save,
      }}
    />
  );
};

export default ApiKeyRow;
