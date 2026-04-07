'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import {
  Switch, Select, MenuItem,
} from '@shared/m3';
import type { SelectChangeEvent } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useAuth, useLocale, useThemeMode } from '@/hooks';
import { usePermission } from '@/hooks/usePermission';
import { Link } from '@/i18n/navigation';

/** Reusable settings card container. */
const Card: React.FC<{
  children: React.ReactNode;
  testId?: string;
}> = ({ children, testId }) => (
  <Box
    data-testid={testId}
    style={{
      padding: 20,
      borderRadius:
        'var(--mat-sys-corner-large, 16px)',
      background:
        'var(--mat-sys-surface-container, #f5f5f5)',
      marginBottom: 16,
    }}
  >
    {children}
  </Box>
);

/** Label-value row. */
const Row: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
  }}>
    <Typography variant="body2">{label}</Typography>
    <div>{children}</div>
  </div>
);

/**
 * Settings page with account, appearance,
 * language, and admin sections.
 */
const SettingsContent: React.FC = () => {
  const t = useTranslations('settings');
  const { user } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const { locale, setLocale, locales } = useLocale();
  const { isAdmin } = usePermission();

  return (
    <Box
      style={{ maxWidth: 600 }}
      data-testid="settings-content"
    >
      <Card testId="settings-account">
        <Typography
          variant="subtitle1" gutterBottom
          style={{ fontWeight: 600 }}
        >
          {t('account')}
        </Typography>
        <Row label={t('email')}>
          <Typography variant="body2">
            {user?.email ?? '—'}
          </Typography>
        </Row>
        <Row label={t('username')}>
          <Typography variant="body2">
            {user?.username ?? '—'}
          </Typography>
        </Row>
        <Row label={t('displayName')}>
          <Typography variant="body2">
            {user?.displayName ?? '—'}
          </Typography>
        </Row>
        <Row label={t('role')}>
          <Typography
            variant="body2"
            style={{
              textTransform: 'capitalize',
            }}
          >
            {user?.role ?? '—'}
          </Typography>
        </Row>
      </Card>

      <Card testId="settings-appearance">
        <Typography
          variant="subtitle1" gutterBottom
          style={{ fontWeight: 600 }}
        >
          {t('preferences')}
        </Typography>
        <Row label={t('darkMode')}>
          <Switch
            checked={mode === 'dark'}
            onChange={toggleMode}
            aria-label="Toggle dark mode"
            data-testid="settings-theme-toggle"
          />
        </Row>
        <Row label={t('language')}>
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
        </Row>
      </Card>

      {isAdmin && (
        <Card testId="settings-admin">
          <Typography
            variant="subtitle1" gutterBottom
            style={{ fontWeight: 600 }}
          >
            {t('admin')}
          </Typography>
          <Link
            href="/admin/translations"
            style={{
              color: 'var(--mat-sys-primary, #6750a4)',
              fontSize: 14,
            }}
            data-testid="settings-admin-trans"
          >
            {t('manageTranslations')}
          </Link>
        </Card>
      )}
    </Box>
  );
};

export default SettingsContent;
