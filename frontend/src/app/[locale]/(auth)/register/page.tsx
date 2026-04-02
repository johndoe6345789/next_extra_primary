import type { ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { AuthHero } from '@shared/ui';
import { RegisterForm }
  from '@/components/organisms/RegisterForm';
import s from '@shared/scss/modules/AuthPage.module.scss';

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
    <main
      className={s.root}
      role="main"
      aria-label="Register"
    >
      <AuthHero />
      <div className={s.formPane}>
        <RegisterForm />
      </div>
    </main>
  );
}
