import type { ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { AuthHero }
  from '@/components/molecules/AuthHero';
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
    <main
      className="auth-page"
      role="main"
      aria-label="Reset password"
    >
      <AuthHero />
      <div className="auth-form-pane">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
