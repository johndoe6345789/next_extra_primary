import type { ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { Box } from '@metabuilder/m3';
import { RegisterForm } from '@/components/organisms/RegisterForm';

/** Skip static prerendering for this page. */
export const dynamic = 'force-dynamic';
/** Props for the register page. */
interface RegisterPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Registration page with a centred card layout.
 *
 * Renders the `RegisterForm` organism inside a
 * centred card for new-user sign-up.
 *
 * @param props - Page props with locale params.
 * @returns Registration page UI.
 */
export default async function RegisterPage({
  params,
}: RegisterPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Box
      component="main"
      role="main"
      aria-label="Create account"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        px: 2,
      }}
    >
      <RegisterForm />
    </Box>
  );
}
