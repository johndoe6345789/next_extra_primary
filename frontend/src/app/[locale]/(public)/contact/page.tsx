import type { ReactElement } from 'react';
import {
  setRequestLocale,
} from 'next-intl/server';
import { ContactForm } from
  '@/components/organisms/ContactForm';

/** Props for the contact page. */
interface ContactPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Contact page with an enquiry form.
 *
 * @param props - Page props with locale params.
 * @returns Contact page UI.
 */
export default async function ContactPage({
  params,
}: ContactPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactForm />;
}
