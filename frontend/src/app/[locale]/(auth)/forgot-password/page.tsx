import type { ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { Box } from '@metabuilder/m3';
import { ForgotPasswordForm } from
  '@/components/organisms/ForgotPasswordForm';

/** Props for the forgot-password page. */
interface ForgotPasswordPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Forgot password page with reset email form.
 *
 * @param props - Page props with locale params.
 * @returns Forgot password page UI.
 */
export default async function ForgotPasswordPage({
  params,
}: ForgotPasswordPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Box
      component="main"
      role="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        px: 2,
      }}
    >
      <ForgotPasswordForm />
    </Box>
  );
}
