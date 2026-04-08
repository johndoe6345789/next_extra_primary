'use client';
/**
 * Admin translation editor.
 *
 * Shows a filterable table of translation keys
 * with inline editing and save functionality.
 */
import { type ReactElement } from 'react';
import { Box, Typography } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useTranslationAdmin } from
  '@/hooks/useTranslationAdmin';
import CoverageMeter from
  '@/components/molecules/CoverageMeter';
import TranslationFilters from
  './TranslationFilters';
import TranslationTable from
  './TranslationTable';

/**
 * Admin UI for viewing and editing
 * translations.
 *
 * @returns Translation editor component.
 */
export default function TranslationEditor(
): ReactElement {
  const t = useTranslations('common');
  const {
    locale, setLocale, locales,
    filter, setFilter, namespaces,
    rows, isLoading, save,
  } = useTranslationAdmin();

  return (
    <Box data-testid="translation-editor">
      <CoverageMeter />
      <TranslationFilters
        locale={locale}
        setLocale={setLocale}
        locales={locales}
        filter={filter}
        setFilter={setFilter}
        namespaces={namespaces}
      />
      {isLoading && (
        <Typography>
          {t('loading')}
        </Typography>
      )}
      <TranslationTable
        rows={rows}
        save={save}
      />
    </Box>
  );
}
