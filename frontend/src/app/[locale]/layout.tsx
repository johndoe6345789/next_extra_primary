import { ReactNode, type ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { IntlProvider } from '@/components/providers/IntlProvider';
import { AuthGate } from '@/components/providers/AuthGate';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { LinkAdapter } from
  '@/components/providers/LinkAdapter';
import { HtmlLang } from '@/components/atoms/HtmlLang';
import {
  AppShell,
  ShiftContent,
} from '@/components/organisms/AppShell';
import { DebugBar } from
  '@/components/molecules/DebugBar';
import { PwaRegister } from
  '@/components/atoms/PwaRegister';
import { PwaHead } from './pwa-head';
import { loadMessages } from './loadMessages';

/** All locale pages are dynamic. */
export const dynamic = 'force-dynamic';

/** Supported application locales. */
const LOCALES = [
  'en', 'es', 'fr', 'de',
  'ja', 'zh', 'nl', 'cy',
] as const;

/** Props for the locale layout. */
interface LocaleLayoutProps {
  /** Page content rendered inside layout. */
  readonly children: ReactNode;
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/** Generates static params for all locales. */
export function generateStaticParams(): Array<{
  locale: string;
}> {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * Locale-scoped layout for internationalised
 * routes. Loads translation messages, sets the
 * request locale, and wraps children in providers.
 *
 * @param props - Layout props with locale params.
 * @returns Locale-wrapped component tree.
 */
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await loadMessages(locale);

  return (
    <IntlProvider locale={locale} messages={messages}>
      <HtmlLang locale={locale} />
      <PwaHead />
      <PwaRegister />
      <LinkAdapter>
        <AppShell>
          <Navbar />
          <ShiftContent>
            <AuthGate>
              {children}
            </AuthGate>
            <Footer />
          </ShiftContent>
        </AppShell>
        {process.env.NEXT_PUBLIC_DEBUG_BAR
          === '1' && <DebugBar />}
      </LinkAdapter>
    </IntlProvider>
  );
}
