import type { ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
// Email/password login is being phased out in favour of
// Keycloak SSO. The LoginForm import below stays so the
// legacy form remains available in this template repo.
// import { LoginForm } from
//   '@/components/organisms/LoginForm';
import KeycloakAutoLogin from
  '@/components/molecules/KeycloakAutoLogin';
import { AuthHero } from '@shared/ui';
import s from '@shared/scss/modules/AuthPage.module.scss';

export const dynamic = 'force-dynamic';

interface LoginPageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * 2-pane login: marketing pane + Keycloak SSO trigger.
 *
 * The legacy email/password `<LoginForm />` is kept in
 * the codebase (see commented import above) but is no
 * longer rendered — visitors authenticate against
 * Keycloak instead.
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
        {/* Phased out — kept for template parity:
        <LoginForm /> */}
        <KeycloakAutoLogin />
      </div>
    </main>
  );
}
