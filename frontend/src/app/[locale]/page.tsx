import type { ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { Box, Container } from '@shared/m3';
import { HeroSection } from
  '@/components/organisms/HeroSection';
import { FeatureGrid } from
  '@/components/organisms/FeatureGrid';
import s from '@shared/scss/modules/Landing.module.scss';

/** Props for the landing page. */
interface LandingPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{
    locale: string;
  }>;
}

/**
 * Landing page with hero and features.
 *
 * @param props - Page props with locale.
 * @returns Landing page UI.
 */
export default async function LandingPage({
  params,
}: LandingPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Box
      component="main"
      role="main"
      aria-label="Landing page"
      style={{ minHeight: '100vh' }}
    >
      <HeroSection />
      <Container
        maxWidth="lg"
        className={s.features}
      >
        <FeatureGrid />
      </Container>
    </Box>
  );
}
