'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';
import { usePermission } from '@/hooks/usePermission';
import {
  SettingsCard, SettingsRow,
} from './SettingsCard';
import { SettingsApiKeys } from './SettingsApiKeys';
import SettingsAdminCard from './SettingsAdminCard';
import SettingsPreferences from './SettingsPreferences';

/**
 * Settings page with account, appearance,
 * language, and admin sections.
 */
const SettingsContent: React.FC = () => {
  const t = useTranslations('settings');
  const { user } = useAuth();
  const { isAdmin } = usePermission();

  return (
    <Box
      style={{ maxWidth: 600 }}
      data-testid="settings-content"
    >
      <SettingsCard testId="settings-account">
        <Typography
          variant="subtitle1" gutterBottom
          style={{ fontWeight: 600 }}
        >
          {t('account')}
        </Typography>
        <SettingsRow label={t('email')}>
          <Typography variant="body2">
            {user?.email ?? '—'}
          </Typography>
        </SettingsRow>
        <SettingsRow label={t('username')}>
          <Typography variant="body2">
            {user?.username ?? '—'}
          </Typography>
        </SettingsRow>
        <SettingsRow label={t('displayName')}>
          <Typography variant="body2">
            {user?.displayName ?? '—'}
          </Typography>
        </SettingsRow>
        <SettingsRow label={t('role')}>
          <Typography
            variant="body2"
            style={{
              textTransform: 'capitalize',
            }}
          >
            {user?.role ?? '—'}
          </Typography>
        </SettingsRow>
      </SettingsCard>

      <SettingsPreferences />
      <SettingsApiKeys />
      {isAdmin && <SettingsAdminCard />}
    </Box>
  );
};

export default SettingsContent;
