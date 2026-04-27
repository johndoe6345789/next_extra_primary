import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import { RoleGuard } from
  '@/components/providers/RoleGuard';
import AdminSystemKeys from
  '@/components/organisms/AdminSystemKeys';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the admin API keys page. */
interface ApiKeysPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{
    locale: string;
  }>;
}

/**
 * Admin page for system-wide AI API keys.
 *
 * @param props - Page props with locale.
 * @returns System key management UI.
 */
export default async function ApiKeysPage({
  params,
}: ApiKeysPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');

  return (
    <Box
      aria-label="System API key management"
      data-testid="admin-api-keys-page"
    >
      <Typography
        variant="h4" component="h1"
        gutterBottom
      >
        {t('systemKeys')}
      </Typography>
      <RoleGuard required="admin">
        <AdminSystemKeys />
      </RoleGuard>
    </Box>
  );
}
