'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTranslations } from 'next-intl';
import { Button } from '../atoms';

/** Props for the HeroSection organism. */
export interface HeroSectionProps {
  /** Get Started click handler. */
  onGetStarted?: () => void;
  /** Learn More click handler. */
  onLearnMore?: () => void;
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Full-width hero with heading, subtitle,
 * and two CTA buttons. Gradient background.
 * Stacks vertically on mobile.
 *
 * @param props - Component props.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted,
  onLearnMore,
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
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            size="large"
            onClick={onGetStarted}
            testId="hero-cta-start"
            ariaLabel={t('cta')}
          >
            {t('cta')}
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="inherit"
            onClick={onLearnMore}
            testId="hero-cta-learn"
            ariaLabel={t('features')}
          >
            {t('features')}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;
