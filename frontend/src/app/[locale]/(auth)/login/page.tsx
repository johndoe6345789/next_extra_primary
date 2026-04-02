import type { ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { LoginForm } from
  '@/components/organisms/LoginForm';
import { AuthHero } from '@shared/ui';
import s from '@shared/scss/modules/AuthPage.module.scss';

export const dynamic = 'force-dynamic';

interface LoginPageProps {
  readonly params: Promise<{
    locale: string;
  }>;
}

/**
 * 2-pane login: marketing + form.
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
      className={s.root}
      role="main"
      aria-label="Login"
    >
      <AuthHero />
      <div className={s.formPane}>
        <LoginForm />
      </div>
    </main>
  );
}
