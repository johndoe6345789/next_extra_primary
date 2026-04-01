'use client';

import React from 'react';
import Grid from '@shared/m3/Grid';
import ChatIcon from '@shared/icons/Chat';
import EmojiEventsIcon from '@shared/icons/EmojiEvents';
import NotificationsActiveIcon from '@shared/icons/NotificationsActive';
import DarkModeIcon from '@shared/icons/DarkMode';
import TranslateIcon from '@shared/icons/Translate';
import LockIcon from '@shared/icons/Lock';
import { useTranslations } from 'next-intl';
import { FeatureCard } from './FeatureCard';

const ICONS = [
  <ChatIcon key="chat" />,
  <EmojiEventsIcon key="gamification" />,
  <NotificationsActiveIcon key="alerts" />,
  <DarkModeIcon key="darkmode" />,
  <TranslateIcon key="i18n" />,
  <LockIcon key="auth" />,
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

const HREFS: Record<FeatureKey, string> = {
  aiChat: '/chat',
  gamification: '/leaderboard',
  alerts: '/notifications',
  darkMode: '/dashboard',
  multiLang: '/about',
  secureAuth: '/register',
};

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
      id="feature-grid"
      data-testid={testId}
      role="list"
      aria-label="Application features"
    >
      {KEYS.map((k, idx) => (
        <Grid key={k} item xs={12} sm={6} md={4}>
          <FeatureCard
            icon={ICONS[idx]}
            title={t(`${k}.title`)}
            desc={t(`${k}.desc`)}
            href={HREFS[k]}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default FeatureGrid;
