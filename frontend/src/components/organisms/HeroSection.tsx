'use client';

import React from 'react';
import { Box, Container } from '@shared/m3';
import { useTranslations } from 'next-intl';
import {
  HeroCta,
} from '@shared/components/ui/HeroCta';
import s from '@shared/scss/modules/HeroSection.module.scss';

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
        <h1
          className={s.heading}
          data-testid="hero-heading"
        >
          {tCommon('appName')}
        </h1>
        <p
          className={s.subtitle}
          data-testid="hero-subtitle"
        >
          {t('subtitle')}
        </p>
        <HeroCta
          ctaLabel={t('cta')}
          featuresLabel={t('features')}
        />
      </Container>
    </Box>
  );
};

export default HeroSection;
