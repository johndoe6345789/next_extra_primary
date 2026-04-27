import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import { RoleGuard } from
  '@/components/providers/RoleGuard';
import AdminTestEmail from
  '@/components/organisms/AdminTestEmail';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the admin email page. */
interface EmailPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{
    locale: string;
  }>;
}

/**
 * Admin page for sending test emails to verify
 * SMTP configuration and email templates.
 *
 * @param props - Page props with locale.
 * @returns Test email form interface.
 */
export default async function EmailPage({
  params,
}: EmailPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('admin');

  return (
    <Box
      aria-label="Test email"
      data-testid="admin-email-page"
    >
      <Typography
        variant="h4" component="h1"
        gutterBottom
      >
        {t('testEmail')}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        {t('testEmailDesc')}
      </Typography>
      <RoleGuard required="admin">
        <AdminTestEmail />
      </RoleGuard>
    </Box>
  );
}
