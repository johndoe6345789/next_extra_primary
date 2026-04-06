import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import DashboardGrid from
  '@/components/organisms/DashboardGrid';

/** Skip static prerendering for this page. */
export const dynamic = 'force-dynamic';
/** Props for the dashboard home page. */
interface DashboardPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Dashboard home page with draggable widget grid.
 *
 * @param props - Page props with locale params.
 * @returns Dashboard overview UI.
 */
export default async function DashboardPage({
  params,
}: DashboardPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('dashboard');

  return (
    <Box aria-label={t('title')}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
      >
        {t('title')}
      </Typography>
      <DashboardGrid />
    </Box>
  );
}
