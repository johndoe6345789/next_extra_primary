import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import {
  Typography,
  Container,
} from '@metabuilder/m3';
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
  const t = await getTranslations('contact');

  return (
    <Container
      component="main"
      role="main"
      maxWidth="sm"
      sx={{ py: 6 }}
      aria-label={t('title')}
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
      >
        {t('title')}
      </Typography>
      <ContactForm />
    </Container>
  );
}
