'use client';

import React from 'react';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import { t as tk } from '@shared/theme/tokens';
import { Link } from '@/i18n/navigation';
import { SettingsCard } from './SettingsCard';

/** Shared style for admin links. */
const linkStyle = {
  color: tk.primary,
  fontSize: 14,
  display: 'block' as const,
  marginBottom: 8,
};

/** Admin-only links card for settings. */
const SettingsAdminCard: React.FC = () => {
  const t = useTranslations('settings');

  return (
    <SettingsCard testId="settings-admin">
      <Typography
        variant="subtitle1" gutterBottom
        style={{ fontWeight: 600 }}
      >
        {t('admin')}
      </Typography>
      <Link
        href="/admin/translations"
        style={linkStyle}
        data-testid="settings-admin-trans"
      >
        {t('manageTranslations')}
      </Link>
      <Link
        href="/admin/api-keys"
        style={linkStyle}
        data-testid="settings-admin-keys"
      >
        {t('manageApiKeys')}
      </Link>
      <Link
        href="/admin/env"
        style={linkStyle}
        data-testid="settings-admin-env"
      >
        {t('manageEnvVars')}
      </Link>
      <Link
        href="/admin/users"
        style={linkStyle}
        data-testid="settings-admin-users"
      >
        {t('manageUsers')}
      </Link>
      <Link
        href="/admin/debug"
        style={{ ...linkStyle, marginBottom: 0 }}
        data-testid="settings-admin-debug"
      >
        {t('debugPanel')}
      </Link>
    </SettingsCard>
  );
};

export default SettingsAdminCard;
