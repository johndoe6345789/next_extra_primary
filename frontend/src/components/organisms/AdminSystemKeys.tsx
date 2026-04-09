'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { t as tk } from '@shared/theme/tokens';
import {
  useGetSystemKeysQuery,
  useSaveSystemKeyMutation,
} from '@/store/api/apiKeyApi';
import SystemKeyRow from './SystemKeyRow';

/** Props for AdminSystemKeys. */
export interface AdminSystemKeysProps {
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Admin panel for managing system-wide
 * AI provider API keys used as fallback
 * when users don't have their own keys.
 */
export const AdminSystemKeys: React.FC<
  AdminSystemKeysProps
> = ({ testId = 'admin-system-keys' }) => {
  const t = useTranslations('admin');
  const { data } = useGetSystemKeysQuery();
  const [saveKey] =
    useSaveSystemKeyMutation();
  const keys = data?.keys ?? [];

  const providers = [
    { id: 'claude', label: 'Anthropic' },
    { id: 'openai', label: 'OpenAI' },
  ] as const;

  return (
    <Box data-testid={testId}>
      <Typography variant="body2"
        style={{
          color: tk.onSurfaceVariant,
          marginBottom: 16,
        }}>
        {t('systemKeysDesc')}
      </Typography>
      {providers.map(({ id, label }) => {
        const entry = keys.find(
          (k) => k.provider === id,
        );
        return (
          <SystemKeyRow
            key={id}
            provider={id}
            label={label}
            configured={
              entry?.configured ?? false}
            maskedKey={
              entry?.maskedKey ?? ''}
            onSave={(k) =>
              saveKey({
                provider: id, apiKey: k,
              })}
            labels={{
              apiKey: t('apiKeyLabel'),
              save: t('save'),
            }}
          />
        );
      })}
    </Box>
  );
};

export default AdminSystemKeys;
