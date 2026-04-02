'use client';

import React from 'react';
import { Box, Container, Typography } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { HeroCta } from '../molecules';

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
      style={{
        padding: '6rem 1.5rem',
        background: [
          'linear-gradient(135deg,',
          'var(--mat-sys-primary) 0%,',
          'var(--mat-sys-tertiary) 100%)',
        ].join(' '),
        color: 'var(--mat-sys-on-primary)',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          data-testid="hero-heading"
          style={{
            fontWeight: 800,
            fontSize: '3rem',
            letterSpacing: '-0.02em',
          }}
        >
          {tCommon('appName')}
        </Typography>
        <Typography
          variant="h5"
          component="p"
          data-testid="hero-subtitle"
          style={{
            marginBottom: '2rem',
            opacity: 0.9,
            fontSize: '1.25rem',
          }}
        >
          {t('subtitle')}
        </Typography>
        <HeroCta />
      </Container>
    </Box>
  );
};

export default HeroSection;
