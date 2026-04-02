'use client';

import React from 'react';
import { Box, Container, Typography } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { HeroCta } from '../molecules';
import s from './HeroSection.module.scss';

/** Props for the HeroSection organism. */
export interface HeroSectionProps {
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Full-width hero with gradient background.
 *
 * @param props - Component props.
 */
export const HeroSection: React.FC<
  HeroSectionProps
> = ({ testId = 'hero-section' }) => {
  const t = useTranslations('hero');
  const tCommon = useTranslations('common');
  return (
    <Box
      component="section"
      data-testid={testId}
      aria-label="Hero section"
      className={s.root}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          data-testid="hero-heading"
        >
          {tCommon('appName')}
        </Typography>
        <Typography
          variant="h5"
          component="p"
          className={s.subtitle}
          data-testid="hero-subtitle"
        >
          {t('subtitle')}
        </Typography>
        <HeroCta />
      </Container>
    </Box>
  );
};

export default HeroSection;
