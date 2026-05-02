/**
 * Features page — dedicated route for /features.
 * Renders the same FeatureGrid used on the landing
 * page so the hero "Explore features" CTA has a
 * real destination.
 *
 * @module app/[locale]/features/page
 */
import type { ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Box, Container, Typography }
  from '@shared/m3';
import { FeatureGrid } from '@shared/ui';
import features from '@/constants/features.json';

/** Props for the features page. */
interface FeaturesPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Dedicated features listing page.
 *
 * @param props - Page props with locale.
 * @returns Features page UI.
 */
export default async function FeaturesPage({
  params,
}: FeaturesPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('features');

  return (
    <Box
      component="main"
      role="main"
      aria-label="Features page"
      data-testid="features-page"
      sx={{ minHeight: '100dvh', py: 6 }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{ mb: 4,
            letterSpacing: '-0.02em' }}
          data-testid="features-heading"
        >
          {t('pageTitle')}
        </Typography>
        <FeatureGrid features={features} />
      </Container>
    </Box>
  );
}
