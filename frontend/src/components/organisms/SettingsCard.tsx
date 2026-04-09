'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { t } from '@shared/theme/tokens';

/** Props for the SettingsCard container. */
export interface SettingsCardProps {
  /** Card content. */
  children: React.ReactNode;
  /** Test identifier. */
  testId?: string;
}

/** Reusable settings card container. */
export const SettingsCard: React.FC<
  SettingsCardProps
> = ({ children, testId }) => (
  <Box
    data-testid={testId}
    style={{
      padding: 20,
      borderRadius: t.large,
      background: t.surfaceContainer,
      marginBottom: 16,
    }}
  >
    {children}
  </Box>
);

/** Props for the SettingsRow layout. */
export interface SettingsRowProps {
  /** Row label text. */
  label: string;
  /** Row value content. */
  children: React.ReactNode;
}

/** Label-value row for settings cards. */
export const SettingsRow: React.FC<
  SettingsRowProps
> = ({ label, children }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
  }}>
    <Typography variant="body2">
      {label}
    </Typography>
    <div>{children}</div>
  </div>
);

export default SettingsCard;
