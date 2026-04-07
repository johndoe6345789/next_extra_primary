import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import { RoleGuard } from
  '@/components/providers/RoleGuard';
import TranslationEditor from
  '@/components/organisms/TranslationEditor';

/** Skip static prerendering for this page. */
export const dynamic = 'force-dynamic';

/** Props for the admin translations page. */
interface TranslationPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Admin page for managing i18n translations.
 *
 * @param props - Page props with locale params.
 * @returns Translation editor UI.
 */
export default async function TranslationPage({
  params,
}: TranslationPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('settings');

  return (
    <Box
      aria-label="Translation management"
      data-testid="admin-translations-page"
    >
      <Typography
        variant="h4" component="h1"
        gutterBottom
      >
        {t('manageTranslations')}
      </Typography>
      <RoleGuard required="admin">
        <TranslationEditor />
      </RoleGuard>
    </Box>
  );
}
