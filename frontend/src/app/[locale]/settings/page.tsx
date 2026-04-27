import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import SettingsContent from
  '@/components/organisms/SettingsContent';

/** Skip static prerendering for this page. */
export const dynamic = 'force-dynamic';

/** Props for the settings page. */
interface SettingsPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * User settings page with preferences
 * and account options.
 *
 * @param props - Page props with locale params.
 * @returns Settings page UI.
 */
export default async function SettingsPage({
  params,
}: SettingsPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('nav');

  return (
    <Box aria-label={t('settings')}>
      <Typography
        variant="h4" component="h1"
        gutterBottom
      >
        {t('settings')}
      </Typography>
      <SettingsContent />
    </Box>
  );
}
