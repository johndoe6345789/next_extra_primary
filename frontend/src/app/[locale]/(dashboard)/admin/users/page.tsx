import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import { RoleGuard } from
  '@/components/providers/RoleGuard';
import AdminUserList from
  '@/components/organisms/AdminUserList';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the admin users page. */
interface UsersPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{
    locale: string;
  }>;
}

/**
 * Admin page for managing platform users:
 * view, change roles, and toggle active.
 *
 * @param props - Page props with locale.
 * @returns User management interface.
 */
export default async function UsersPage({
  params,
}: UsersPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');

  return (
    <Box
      aria-label="User management"
      data-testid="admin-users-page"
    >
      <Typography
        variant="h4" component="h1"
        gutterBottom
      >
        {t('userManagement')}
      </Typography>
      <RoleGuard required="admin">
        <AdminUserList />
      </RoleGuard>
    </Box>
  );
}
