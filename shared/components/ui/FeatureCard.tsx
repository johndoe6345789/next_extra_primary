'use client';

import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from '@shared/m3';
import { useLink } from './LinkContext';
import s from '@shared/scss/modules/FeatureCard.module.scss';

/** Props for the FeatureCard sub-component. */
export interface FeatureCardProps {
  /** Icon element. */
  icon: React.ReactNode;
  /** Feature title. */
  title: string;
  /** Short description. */
  desc: string;
  /** Optional link target. */
  href?: string;
}

/**
 * Single feature card with icon, title, desc.
 */
export const FeatureCard: React.FC<
  FeatureCardProps
> = ({ icon, title, desc, href }) => {
  const testId = `feature-${title
    .toLowerCase()
    .replace(/\s/g, '-')}`;
  const Link = useLink();
  return (
    <Card
      className={s.root}
      role="listitem"
      aria-label={title}
      data-testid={testId}
      style={{ height: '100%' }}
    >
      <CardActionArea
        {...(href
          ? { component: Link, href }
          : {})}
        style={{ height: '100%' }}
      >
        <CardContent
          style={{
            textAlign: 'center',
            padding: '2rem 1.5rem',
          }}
        >
          <div
            style={{
              fontSize: '2.5rem',
              color:
                'var(--mat-sys-primary)',
              marginBottom: '0.75rem',
            }}
          >
            {icon}
          </div>
          <Typography
            variant="h6"
            gutterBottom
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            style={{
              color: 'var(--mat-sys-on-surface-variant)',
            }}
          >
            {desc}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default FeatureCard;
