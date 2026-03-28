'use client';

import React from 'react';
import Stack from '@mui/material/Stack';
import { useTranslations } from 'next-intl';
import { Button } from '../atoms';

/** Props for the HeroCta molecule. */
export interface HeroCtaProps {
  /** Get Started click handler. */
  onGetStarted?: () => void;
  /** Learn More click handler. */
  onLearnMore?: () => void;
}

/**
 * CTA button pair for the hero section.
 * Stacks vertically on mobile, horizontally on tablet+.
 *
 * @param props - Component props.
 */
export const HeroCta: React.FC<HeroCtaProps> = ({
  onGetStarted,
  onLearnMore,
}) => {
  const t = useTranslations('hero');
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      data-testid="hero-cta-group"
    >
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
  );
};

export default HeroCta;
