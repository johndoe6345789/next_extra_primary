import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import { RoleGuard } from
  '@/components/providers/RoleGuard';
import AdminDebugPanel from
  '@/components/organisms/AdminDebugPanel';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the debug page. */
interface DebugPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{
    locale: string;
  }>;
}

/**
 * Admin page showing debug telemetry,
 * API call logs, and system state.
 *
 * @param props - Page props with locale.
 * @returns Debug panel page.
 */
export default async function DebugPage({
  params,
}: DebugPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');

  return (
    <Box
      aria-label="Debug panel"
      data-testid="admin-debug-page"
    >
      <Typography
        variant="h4" component="h1"
        gutterBottom
      >
        {t('debugPanel')}
      </Typography>
      <RoleGuard required="admin">
        <AdminDebugPanel />
      </RoleGuard>
    </Box>
  );
}
