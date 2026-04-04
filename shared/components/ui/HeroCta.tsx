'use client';

import React from 'react';
import { Button } from '../m3';
import { useLink } from './LinkContext';
import s from '../../scss/modules/HeroCta.module.scss';

/** Props for HeroCta. */
export interface HeroCtaProps {
  /** Label for the primary CTA button. */
  ctaLabel: string;
  /** Label for the secondary features button. */
  featuresLabel: string;
  /** Href for the register/signup link. */
  registerHref?: string;
}

/**
 * CTA button pair for the hero section.
 * "Get started" links to signup; "Explore features"
 * scrolls to the feature grid.
 *
 * @param props - Component props.
 */
export const HeroCta: React.FC<HeroCtaProps> = ({
  ctaLabel,
  featuresLabel,
  registerHref = '/register',
}) => {
  const Link = useLink();
  const scrollToFeatures = () => {
    document
      .getElementById('feature-grid')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className={s.root}
      data-testid="hero-cta-group"
    >
      <Link href={registerHref}>
        <Button
          size="large"
          data-testid="hero-cta-start"
          aria-label={ctaLabel}
        >
          {ctaLabel}
        </Button>
      </Link>
      <Button
        variant="outlined"
        size="large"
        className="btn--on-primary"
        onClick={scrollToFeatures}
        data-testid="hero-cta-learn"
        aria-label={featuresLabel}
      >
        {featuresLabel}
      </Button>
    </div>
  );
};

export default HeroCta;
