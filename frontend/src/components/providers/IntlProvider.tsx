import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

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
}: IntlProviderProps): JSX.Element {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
    >
      {children}
    </NextIntlClientProvider>
  );
}
