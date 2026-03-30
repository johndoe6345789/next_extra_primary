'use client';

import React from 'react';
import Stack from '@mui/material/Stack';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '../atoms';

/**
 * CTA button pair for the hero section.
 * "Get started" links to signup; "Explore features"
 * scrolls to the feature grid.
 *
 * @returns CTA button group.
 */
export const HeroCta: React.FC = () => {
  const t = useTranslations('hero');

  const scrollToFeatures = () => {
    document
      .getElementById('feature-grid')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      data-testid="hero-cta-group"
    >
      <Link href="/register" style={{ textDecoration: 'none' }}>
        <Button
          size="large"
          testId="hero-cta-start"
          ariaLabel={t('cta')}
        >
          {t('cta')}
        </Button>
      </Link>
      <Button
        variant="outlined"
        size="large"
        color="inherit"
        onClick={scrollToFeatures}
        testId="hero-cta-learn"
        ariaLabel={t('features')}
      >
        {t('features')}
      </Button>
    </Stack>
  );
};

export default HeroCta;
