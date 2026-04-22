import React from 'react';
import Grid from '@shared/m3/Grid';
import { Icon } from '@shared/m3/data-display/Icon';
import { getTranslations } from 'next-intl/server';
import { FeatureCard } from './FeatureCard';
import type { Feature } from './featureGridData';
import {
  featureHrefs, iconNames,
} from './featureGridData';

/** Props for the FeatureGrid organism. */
export interface FeatureGridProps {
  /** Feature definitions from JSON. */
  features: Feature[];
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Responsive grid of feature cards driven by
 * a JSON features array.
 *
 * @param props - Component props.
 */
export const FeatureGrid = async ({
  features,
  testId = 'feature-grid',
}: FeatureGridProps): Promise<React.JSX.Element> => {
  const t = await getTranslations('features');
  const icons = iconNames(features);
  const hrefs = featureHrefs(features);

  return (
    <Grid
      container
      id="feature-grid"
      data-testid={testId}
      role="list"
      aria-label="Application features"
    >
      {features.map((f, idx) => (
        <Grid key={f.key} item xs={12} sm={6} md={4}>
          <FeatureCard
            icon={
              <Icon
                size="xl" color="primary"
              >
                {icons[idx]}
              </Icon>
            }
            title={t(`${f.key}.title`)}
            desc={t(`${f.key}.desc`)}
            href={hrefs[f.key]}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default FeatureGrid;
