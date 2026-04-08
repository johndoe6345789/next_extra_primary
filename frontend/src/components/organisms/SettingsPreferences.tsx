'use client';

import React from 'react';
import Typography from '@shared/m3/Typography';
import { Switch, Select, MenuItem } from '@shared/m3';
import type { SelectChangeEvent } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useLocale, useThemeMode } from '@/hooks';
import {
  SettingsCard, SettingsRow,
} from './SettingsCard';

/**
 * Preferences card showing dark-mode toggle
 * and language selector.
 */
const SettingsPreferences: React.FC = () => {
  const t = useTranslations('settings');
  const { mode, toggleMode } = useThemeMode();
  const { locale, setLocale, locales } = useLocale();

  return (
    <SettingsCard testId="settings-appearance">
      <Typography
        variant="subtitle1" gutterBottom
        style={{ fontWeight: 600 }}
      >
        {t('preferences')}
      </Typography>
      <SettingsRow label={t('darkMode')}>
        <Switch
          checked={mode === 'dark'}
          onChange={toggleMode}
          aria-label="Toggle dark mode"
          data-testid="settings-theme-toggle"
        />
      </SettingsRow>
      <SettingsRow label={t('language')}>
        <Select
          value={locale}
          onChange={(
            e: SelectChangeEvent<
              string | string[]
            >,
          ) => setLocale(
            e.target.value as never,
          )}
          label="Select language"
          size="small"
          autoWidth
          testId="settings-locale"
        >
          {(locales as readonly string[]).map(
            (l) => (
              <MenuItem key={l} value={l}>
                {l.toUpperCase()}
              </MenuItem>
            ),
          )}
        </Select>
      </SettingsRow>
    </SettingsCard>
  );
};

export default SettingsPreferences;
