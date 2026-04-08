import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import { RoleGuard } from
  '@/components/providers/RoleGuard';
import AdminEnvVars from
  '@/components/organisms/AdminEnvVars';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the admin env vars page. */
interface EnvPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{
    locale: string;
  }>;
}

/**
 * Admin page showing environment variables
 * for both backend and frontend services.
 *
 * @param props - Page props with locale.
 * @returns Environment variable viewer.
 */
export default async function EnvPage({
  params,
}: EnvPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');

  return (
    <Box
      aria-label="Environment variables"
      data-testid="admin-env-page"
    >
      <Typography
        variant="h4" component="h1"
        gutterBottom
      >
        {t('envVars')}
      </Typography>
      <RoleGuard required="admin">
        <AdminEnvVars />
      </RoleGuard>
    </Box>
  );
}
