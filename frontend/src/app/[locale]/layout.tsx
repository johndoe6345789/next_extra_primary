import { ReactNode, type ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { IntlProvider } from '@/components/providers/IntlProvider';
import { AuthGate } from '@/components/providers/AuthGate';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';

/** All locale pages are dynamic (auth + Redux store). */
export const dynamic = 'force-dynamic';

/** Supported application locales. */
const LOCALES = ['en', 'es', 'fr', 'de'] as const;

/** Props for the locale layout. */
interface LocaleLayoutProps {
  /** Page content rendered inside layout. */
  readonly children: ReactNode;
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Generates static params for all locales.
 *
 * @returns Array of locale param objects.
 */
export function generateStaticParams(): Array<{
  locale: string;
}> {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * Locale-scoped layout for internationalised routes.
 *
 * Loads translation messages for the active locale,
 * sets the request locale for server components, and
 * wraps children in `IntlProvider` and `AuthGate`.
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

  let messages: Record<string, unknown> = {};
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    /* Falls back to empty messages. */
  }

  return (
    <IntlProvider locale={locale} messages={messages}>
      <Navbar />
      <AuthGate>{children}</AuthGate>
      <Footer />
    </IntlProvider>
  );
}
