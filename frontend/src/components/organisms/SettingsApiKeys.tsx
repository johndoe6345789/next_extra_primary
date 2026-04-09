'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { t as tk } from '@shared/theme/tokens';
import {
  useGetUserKeysQuery,
  useSaveUserKeyMutation,
  useDeleteUserKeyMutation,
} from '@/store/api/apiKeyApi';
import {
  PROVIDERS, MODEL_OPTIONS,
  containerStyle,
} from './settingsApiKeysConfig';
import SettingsApiKeysList from
  './SettingsApiKeysList';

/** Props for SettingsApiKeys. */
export interface SettingsApiKeysProps {
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Settings card for managing personal AI
 * provider API keys (Claude and OpenAI).
 */
export const SettingsApiKeys: React.FC<
  SettingsApiKeysProps
> = ({ testId = 'settings-api-keys' }) => {
  const t = useTranslations('settings');
  const { data } = useGetUserKeysQuery();
  const [saveKey] = useSaveUserKeyMutation();
  const [deleteKey] =
    useDeleteUserKeyMutation();

  const keys = data?.keys ?? [];
  const labels = {
    apiKey: t('apiKey'),
    model: t('modelLabel'),
    save: t('save'),
    edit: t('editKey'),
    remove: t('deleteKey'),
  };

  return (
    <Box
      data-testid={testId}
      style={containerStyle}
    >
      <Typography
        variant="subtitle1" gutterBottom
        style={{ fontWeight: 600 }}>
        {t('apiKeys')}
      </Typography>
      <Typography
        variant="body2"
        style={{
          color: tk.onSurfaceVariant,
          marginBottom: 8,
        }}>
        {t('apiKeysDesc')}
      </Typography>
      <SettingsApiKeysList
        providers={PROVIDERS}
        modelOptions={MODEL_OPTIONS}
        keys={keys}
        onSave={(id, k, m) =>
          saveKey({
            provider: id,
            apiKey: k,
            model: m,
          })}
        onDelete={(id) => deleteKey(id)}
        labels={labels}
      />
    </Box>
  );
};

export default SettingsApiKeys;
