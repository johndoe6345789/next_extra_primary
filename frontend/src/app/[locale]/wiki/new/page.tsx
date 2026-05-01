'use client';

/**
 * Create a new wiki page.
 * @module app/[locale]/wiki/new/page
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@shared/m3';
import { WikiEditor } from
  '@/components/organisms/WikiEditor';
import { useWikiMutations } from
  '@/hooks/useWikiMutations';

/**
 * New wiki page form.
 *
 * @returns New-page editor UI.
 */
export default function WikiNewPage(): React.ReactElement {
  const t = useTranslations('wiki');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'en';
  const router = useRouter();
  const { createPage, isSaving, error } =
    useWikiMutations(locale);

  return (
    <Box
      data-testid="wiki-new-page"
      role="main"
      aria-label={t('newPage')}
    >
      <Typography variant="h4" component="h1"
        gutterBottom>
        {t('newPage')}
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}
          data-testid="wiki-new-error">
          {error}
        </Typography>
      )}
      <WikiEditor
        onSubmit={createPage}
        onCancel={() => router.push(`/${locale}/wiki`)}
        isSaving={isSaving}
      />
    </Box>
  );
}
