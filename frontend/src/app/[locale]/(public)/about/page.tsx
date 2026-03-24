import type { ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

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

  return (
    <Container
      component="main"
      role="main"
      maxWidth="md"
      sx={{ py: 6 }}
      aria-label="About ExtraPrimary"
    >
      <Typography variant="h3" component="h1" gutterBottom>
        About ExtraPrimary
      </Typography>
      <Typography variant="body1" paragraph>
        ExtraPrimary is a gamified learning platform that combines AI-powered
        tutoring with engaging progression mechanics.
      </Typography>
      <Typography variant="body1" paragraph>
        Earn badges, maintain streaks, climb leaderboards, and learn at your own
        pace with personalised AI assistance.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Our Mission
      </Typography>
      <Typography variant="body1">
        To make education accessible, engaging, and rewarding for learners
        everywhere.
      </Typography>
    </Container>
  );
}
