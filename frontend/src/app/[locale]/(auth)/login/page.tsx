import type { ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { LoginForm } from
  '@/components/organisms/LoginForm';

export const dynamic = 'force-dynamic';

interface LoginPageProps {
  readonly params: Promise<{
    locale: string;
  }>;
}

/**
 * Login page with gradient background.
 *
 * @param props - Page props with locale.
 * @returns Login page UI.
 */
export default async function LoginPage({
  params,
}: LoginPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main
      className="auth-page"
      role="main"
      aria-label="Login"
    >
      <LoginForm />
    </main>
  );
}
