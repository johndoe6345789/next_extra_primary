'use client';

import React from 'react';
import { ApiKeyRow } from
  '../molecules/ApiKeyRow';
import type { ModelOption } from
  './settingsApiKeysConfig';

/** Shape of a stored API key entry. */
interface KeyEntry {
  provider: string;
  maskedKey: string;
  model: string;
}

/** Props for SettingsApiKeysList. */
export interface SettingsApiKeysListProps {
  /** Provider definitions to render. */
  providers: ReadonlyArray<
    Readonly<{ id: string; label: string }>
  >;
  /** Model options per provider id. */
  modelOptions: Record<string, ModelOption[]>;
  /** Currently stored keys. */
  keys: KeyEntry[];
  /** Save handler. */
  onSave: (
    id: string, key: string, model: string,
  ) => void;
  /** Delete handler. */
  onDelete: (id: string) => void;
  /** Translated button labels. */
  labels: {
    apiKey: string;
    model: string;
    save: string;
    edit: string;
    remove: string;
  };
}

/**
 * Renders a list of API key rows for each
 * configured AI provider.
 */
const SettingsApiKeysList: React.FC<
  SettingsApiKeysListProps
> = ({
  providers, modelOptions, keys,
  onSave, onDelete, labels,
}) => {
  const find = (p: string) =>
    keys.find((k) => k.provider === p);

  return (
    <>
      {providers.map(({ id, label }) => {
        const entry = find(id);
        return (
          <ApiKeyRow
            key={id}
            provider={id}
            label={label}
            models={modelOptions[id] ?? []}
            maskedKey={
              entry?.maskedKey ?? ''}
            model={entry?.model ?? ''}
            onSave={(k, m) =>
              onSave(id, k, m)}
            onDelete={() => onDelete(id)}
            labels={labels}
          />
        );
      })}
    </>
  );
};

export default SettingsApiKeysList;
