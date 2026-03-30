'use client';

import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

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
export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon, title, desc, href,
}) => (
  <Card
    role="listitem"
    aria-label={title}
    data-testid={`feature-${title.toLowerCase().replace(/\s/g, '-')}`}
    sx={{ height: '100%' }}
  >
    <CardActionArea
      href={href}
      sx={{ height: '100%' }}
    >
      <CardContent sx={{ textAlign: 'center' }}>
        {icon}
        <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {desc}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

export default FeatureCard;
