import type { ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { AuthHero } from '@shared/ui';
import { ForgotPasswordForm } from
  '@/components/organisms/ForgotPasswordForm';
import s from '@shared/scss/modules/AuthPage.module.scss';

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
      className={s.root}
      role="main"
      aria-label="Reset password"
    >
      <AuthHero />
      <div className={s.formPane}>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
