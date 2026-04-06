import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import ProfileContent from
  '@/components/organisms/ProfileContent';

/** Skip static prerendering for this page. */
export const dynamic = 'force-dynamic';

/** Props for the profile page. */
interface ProfilePageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * User profile page with header, badges,
 * stats, and an activity/comment feed.
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
      <Typography
        variant="h4" component="h1"
        gutterBottom
      >
        {t('title')}
      </Typography>
      <ProfileContent />
    </Box>
  );
}
