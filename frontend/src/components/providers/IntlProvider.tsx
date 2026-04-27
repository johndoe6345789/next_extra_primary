'use client';

import { type ReactElement, ReactNode } from 'react';
import { NextIntlClientProvider, IntlErrorCode } from 'next-intl';

/**
 * Returns the last segment of a missing key as a fallback,
 * so the UI degrades to a humanish label rather than a
 * thrown error when translations are incomplete.
 */
function fallbackLabel(key: string): string {
  const last = key.split('.').pop() ?? key;
  return last
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

/** Props for the internationalisation provider. */
interface IntlProviderProps {
  /** Child components to render. */
  readonly children: ReactNode;
  /** Translation messages for the active locale. */
  readonly messages: Record<string, unknown>;
  /** Active BCP-47 locale tag (e.g. "en"). */
  readonly locale: string;
}

/**
 * Wraps children with NextIntl client provider.
 *
 * Compatible with React Server Components.
 * Passes pre-loaded messages and locale down
 * to all `useTranslations` consumers.
 *
 * @param props - Component props.
 * @returns Intl-enabled component tree.
 */
export function IntlProvider({
  children,
  messages,
  locale,
}: IntlProviderProps): ReactElement {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={(err) => {
        if (err.code === IntlErrorCode.MISSING_MESSAGE) return;
        console.error(err);
      }}
      getMessageFallback={({ key }) => fallbackLabel(key)}
    >
      {children}
    </NextIntlClientProvider>
  );
}
