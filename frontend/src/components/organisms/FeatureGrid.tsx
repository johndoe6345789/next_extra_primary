'use client';

import React from 'react';
import Grid from '@mui/material/Grid2';
import ChatIcon from '@mui/icons-material/Chat';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import TranslateIcon from '@mui/icons-material/Translate';
import LockIcon from '@mui/icons-material/Lock';
import { FeatureCard } from './FeatureCard';

const P = 'primary' as const;
const DATA = [
  { i: <ChatIcon color={P} />, t: 'AI Chat', d: 'Chat with AI models.' },
  {
    i: <EmojiEventsIcon color={P} />,
    t: 'Gamification',
    d: 'Badges and boards.',
  },
  {
    i: <NotificationsActiveIcon color={P} />,
    t: 'Real-time Alerts',
    d: 'Instant alerts.',
  },
  {
    i: <DarkModeIcon color={P} />,
    t: 'Dark Mode',
    d: 'Light and dark themes.',
  },
  { i: <TranslateIcon color={P} />, t: 'Multi-language', d: 'Five languages.' },
  { i: <LockIcon color={P} />, t: 'Secure Auth', d: 'JWT with refresh.' },
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
}) => (
  <Grid
    container
    spacing={3}
    data-testid={testId}
    role="list"
    aria-label="Application features"
  >
    {DATA.map((f) => (
      <Grid key={f.t} size={{ xs: 12, sm: 6, md: 4 }}>
        <FeatureCard icon={f.i} title={f.t} desc={f.d} />
      </Grid>
    ))}
  </Grid>
);

export default FeatureGrid;
