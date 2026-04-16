'use client';

/**
 * Notification preferences settings page.
 * @module app/.../profile/settings/notifications
 */
import React, { useState, useEffect }
  from 'react';
import { useTranslations } from 'next-intl';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Button from '@shared/m3/Button';
import {
  useNotificationPreferences,
} from '@/hooks/useNotificationPreferences';
import type { NotifPrefs }
  from '@/store/api/notificationPrefsApi';
import { NotifPrefTable }
  from '@/components/organisms/NotifPrefTable';

/** Notification preferences page. */
export default function NotifSettingsPage(
): React.ReactElement {
  const t = useTranslations('notifications');
  const {
    prefs, isLoading, save,
  } = useNotificationPreferences();

  const [local, setLocal] =
    useState<NotifPrefs | undefined>(prefs);

  useEffect(() => {
    if (prefs) setLocal(prefs);
  }, [prefs]);

  const handleSave = async () => {
    if (local) await save(local);
  };

  if (isLoading || !local) {
    return (
      <Box data-testid="notif-settings-page">
        <Typography>{t('loading')}</Typography>
      </Box>
    );
  }

  return (
    <Box
      data-testid="notif-settings-page"
      aria-label={t('settingsTitle')}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
      >
        {t('settingsTitle')}
      </Typography>
      <NotifPrefTable
        prefs={local}
        onChange={setLocal}
      />
      <Button
        variant="contained"
        onClick={handleSave}
        data-testid="notif-pref-save"
        sx={{ mt: 2 }}
      >
        {t('save')}
      </Button>
    </Box>
  );
}
