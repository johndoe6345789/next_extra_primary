import type { ReactElement } from 'react';
import { setRequestLocale, getTranslations } from
  'next-intl/server';
import { Box, Typography } from '@shared/m3';
import sections from '@/constants/terms-sections.json';
import legal from '@/constants/legal.json';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the Terms of Service page. */
interface TermsPageProps {
  readonly params: Promise<{ locale: string }>;
}

/** Single section rendered within the ToS page. */
function TermsSection({
  title,
  body,
  id,
}: {
  title: string;
  body: string;
  id: string;
}): ReactElement {
  return (
    <Box component="section" mb={3}
      data-testid={`terms-section-${id}`}>
      <Typography variant="h6"
        component="h2" gutterBottom
        sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body2"
        color="text.secondary">
        {body}
      </Typography>
    </Box>
  );
}

/**
 * Static Terms of Service page.
 *
 * @param props - Page props with locale.
 * @returns ToS page content.
 */
export default async function TermsPage({
  params,
}: TermsPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('terms');

  return (
    <Box
      component="main"
      role="main"
      aria-label={t('title')}
      sx={{ maxWidth: 720, mx: 'auto',
        width: '100%', py: 4 }}
    >
      <Typography variant="h4" component="h1"
        gutterBottom sx={{ fontWeight: 800 }}>
        {t('title')}
      </Typography>
      <Typography variant="body2"
        color="text.secondary" sx={{ mb: 4 }}>
        {legal.company} — effective{' '}
        {legal.effectiveDate}
      </Typography>

      {sections.map((s) => (
        <TermsSection
          key={s.id}
          id={s.id}
          title={s.title}
          body={s.body}
        />
      ))}
    </Box>
  );
}
