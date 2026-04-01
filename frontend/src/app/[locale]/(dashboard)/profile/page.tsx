import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
} from '@shared/m3';

/** Skip static prerendering for this page. */
export const dynamic = 'force-dynamic';
/** Props for the profile page. */
interface ProfilePageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * User profile page.
 *
 * Displays user information, a badge showcase,
 * and cumulative statistics in card sections.
 *
 * @param props - Page props with locale params.
 * @returns Profile page UI.
 */
export default async function ProfilePage({
  params,
}: ProfilePageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('profile');

  return (
    <Box aria-label={t('title')}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('title')}
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2">
            {t('userInfo')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('userInfoDesc')}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" component="h2">
            {t('badges')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('badgesDesc')}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" component="h2">
            {t('statistics')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('statisticsDesc')}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
