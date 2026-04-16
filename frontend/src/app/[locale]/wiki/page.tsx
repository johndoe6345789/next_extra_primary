'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Typography, Box } from '@shared/m3';

/**
 * Wiki welcome/landing page.
 *
 * Shown when no specific page is selected.
 *
 * @returns Wiki welcome UI.
 */
export default function WikiPage(): React.ReactElement {
  const t = useTranslations('wiki');
  return (
    <Box
      role="main"
      aria-label={t('title')}
      data-testid="wiki-home"
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {t('title')}
      </Typography>
      <Typography color="textSecondary">
        {t('welcome')}
      </Typography>
    </Box>
  );
}
