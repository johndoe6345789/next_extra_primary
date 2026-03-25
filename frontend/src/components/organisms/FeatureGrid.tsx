'use client';

import React from 'react';
import Grid from '@mui/material/Grid';
import ChatIcon from '@mui/icons-material/Chat';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import TranslateIcon from '@mui/icons-material/Translate';
import LockIcon from '@mui/icons-material/Lock';
import { useTranslations } from 'next-intl';
import { FeatureCard } from './FeatureCard';

const P = 'primary' as const;

const ICONS = [
  <ChatIcon key="chat" color={P} />,
  <EmojiEventsIcon key="gamification" color={P} />,
  <NotificationsActiveIcon key="alerts" color={P} />,
  <DarkModeIcon key="darkmode" color={P} />,
  <TranslateIcon key="i18n" color={P} />,
  <LockIcon key="auth" color={P} />,
];

type FeatureKey =
  | 'aiChat'
  | 'gamification'
  | 'alerts'
  | 'darkMode'
  | 'multiLang'
  | 'secureAuth';

const KEYS: FeatureKey[] = [
  'aiChat',
  'gamification',
  'alerts',
  'darkMode',
  'multiLang',
  'secureAuth',
];

/** Props for the FeatureGrid organism. */
export interface FeatureGridProps {
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Responsive grid of 6 feature cards.
 * 3 cols desktop, 2 tablet, 1 mobile.
 *
 * @param props - Component props.
 */
export const FeatureGrid: React.FC<FeatureGridProps> = ({
  testId = 'feature-grid',
}) => {
  const t = useTranslations('features');
  return (
    <Grid
      container
      spacing={3}
      data-testid={testId}
      role="list"
      aria-label="Application features"
    >
      {KEYS.map((k, idx) => (
        <Grid key={k} size={{ xs: 12, sm: 6, md: 4 }}>
          <FeatureCard
            icon={ICONS[idx]}
            title={t(`${k}.title`)}
            desc={t(`${k}.desc`)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default FeatureGrid;
