'use client';

import React from 'react';
import Box from '@metabuilder/m3/Box';
import Container from '@metabuilder/m3/Container';
import Typography from '@metabuilder/m3/Typography';
import { useTranslations } from 'next-intl';
import { HeroCta } from '../molecules';

/** Props for the HeroSection organism. */
export interface HeroSectionProps {
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Full-width hero with heading, subtitle,
 * and two CTA buttons. Gradient background.
 *
 * @param props - Component props.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  testId = 'hero-section',
}) => {
  const t = useTranslations('hero');
  const tCommon = useTranslations('common');
  return (
    <Box
      component="section"
      data-testid={testId}
      aria-label="Hero section"
      sx={(theme) => ({
        py: { xs: 8, md: 12 },
        background: [
          'linear-gradient(135deg,',
          theme.palette.primary.main,
          '0%,',
          theme.palette.secondary.main,
          '100%)',
        ].join(' '),
        color: 'primary.contrastText',
      })}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          data-testid="hero-heading"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '3rem' },
          }}
        >
          {tCommon('appName')}
        </Typography>
        <Typography
          variant="h5"
          component="p"
          data-testid="hero-subtitle"
          sx={{
            mb: 4,
            opacity: 0.9,
            fontSize: { xs: '1rem', md: '1.4rem' },
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
