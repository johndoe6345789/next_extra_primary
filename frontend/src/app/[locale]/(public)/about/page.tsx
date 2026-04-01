import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import {
  Typography,
  Container,
} from '@shared/m3';

/** Props for the about page. */
interface AboutPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Static about page describing the platform.
 *
 * Provides information about ExtraPrimary's
 * mission, features, and team within a
 * readable container layout.
 *
 * @param props - Page props with locale params.
 * @returns About page UI.
 */
export default async function AboutPage({
  params,
}: AboutPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <Container
      component="main"
      role="main"
      maxWidth="md"
      sx={{ py: 6 }}
      aria-label={t('title')}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        {t('title')}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('description')}
      </Typography>
      <Typography variant="body1" paragraph>
        {t('description2')}
      </Typography>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ mt: 4 }}
      >
        {t('missionTitle')}
      </Typography>
      <Typography variant="body1">
        {t('mission')}
      </Typography>
    </Container>
  );
}
