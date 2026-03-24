import { setRequestLocale } from 'next-intl/server';
import Box from '@mui/material/Box';
import { HeroSection } from '@/components/organisms/HeroSection';
import { FeatureGrid } from '@/components/organisms/FeatureGrid';

/** Props for the landing page. */
interface LandingPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Landing page with hero and feature highlights.
 *
 * Server component that renders the public-facing
 * homepage with a hero banner and feature grid.
 *
 * @param props - Page props with locale params.
 * @returns Landing page UI.
 */
export default async function LandingPage({
  params,
}: LandingPageProps): Promise<JSX.Element> {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Box
      component="main"
      role="main"
      aria-label="Landing page"
      sx={{ minHeight: '100vh' }}
    >
      <HeroSection />
      <FeatureGrid />
    </Box>
  );
}
