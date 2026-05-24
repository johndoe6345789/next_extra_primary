import type { ReactElement } from 'react';
import { setRequestLocale, getTranslations } from
  'next-intl/server';
import { Box, Typography } from '@shared/m3';
import sections from '@/constants/privacy-sections.json';
import legal from '@/constants/legal.json';

/** Skip static prerendering. */
export const dynamic = 'force-dynamic';

/** Props for the Privacy Policy page. */
interface PrivacyPageProps {
  readonly params: Promise<{ locale: string }>;
}

/** Single section rendered within the privacy page. */
function PrivacySection({
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
      data-testid={`privacy-section-${id}`}>
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
 * Static Privacy Policy page.
 *
 * @param props - Page props with locale.
 * @returns Privacy policy page content.
 */
export default async function PrivacyPage({
  params,
}: PrivacyPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('privacy');

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
        <PrivacySection
          key={s.id}
          id={s.id}
          title={s.title}
          body={s.body}
        />
      ))}

      <Box mt={4}
        data-testid="privacy-contact-box">
        <Typography variant="body2">
          Data requests: {legal.contactEmail}
        </Typography>
      </Box>
    </Box>
  );
}
