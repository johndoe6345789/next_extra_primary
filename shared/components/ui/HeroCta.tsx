'use client';

import React from 'react';
import { Button } from '../m3';
import { useLink } from './LinkContext';
import s from
  '../../scss/modules/HeroCta.module.scss';

/** Props for HeroCta. */
export interface HeroCtaProps {
  /** Label for the primary CTA. */
  ctaLabel: string;
  /** Label for the secondary CTA. */
  featuresLabel: string;
  /** Href for signup. */
  registerHref?: string;
}

/**
 * Hero CTA buttons.
 *
 * @param props - Component props.
 */
export const HeroCta: React.FC<
  HeroCtaProps
> = ({
  ctaLabel,
  featuresLabel,
  registerHref = '/register',
}) => {
  const Link = useLink();

  const scroll = () => {
    document
      .getElementById('feature-grid')
      ?.scrollIntoView({
        behavior: 'smooth',
      });
  };

  return (
    <div
      className={s.root}
      data-testid="hero-cta-group"
    >
      <Link
        href={registerHref}
        className={s.primary}
        data-testid="hero-cta-start"
      >
        {ctaLabel}
      </Link>
      <Button
        variant="outlined"
        size="large"
        className={s.secondary}
        onClick={scroll}
        data-testid="hero-cta-learn"
        aria-label={featuresLabel}
      >
        {featuresLabel}
      </Button>
    </div>
  );
};

export default HeroCta;
