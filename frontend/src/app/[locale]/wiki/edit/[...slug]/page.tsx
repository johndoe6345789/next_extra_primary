'use client';

/**
 * Edit an existing wiki page.
 * @module app/[locale]/wiki/edit/[...slug]/page
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Typography, CircularProgress,
} from '@shared/m3';
import { WikiEditor } from
  '@/components/organisms/WikiEditor';
import { useWikiPage } from '@/hooks/useWikiPage';
import { useWikiMutations } from
  '@/hooks/useWikiMutations';

/**
 * Edit-page shell. Loads the existing page then
 * renders WikiEditor pre-populated with its content.
 *
 * @returns Edit-page UI.
 */
export default function WikiEditPage(): React.ReactElement {
  const t = useTranslations('wiki');
  const params = useParams<{
    locale: string; slug: string[];
  }>();
  const locale = params?.locale ?? 'en';
  const slug = Array.isArray(params?.slug)
    ? params.slug.join('/') : (params?.slug ?? '');
  const router = useRouter();
  const { page, isLoading, error: loadErr } =
    useWikiPage(slug);
  const { updatePage, isSaving, error: saveErr } =
    useWikiMutations(locale);

  if (isLoading) {
    return (
      <Box sx={{ p: 4, display: 'flex',
        justifyContent: 'center' }}
        data-testid="wiki-edit-loading">
        <CircularProgress aria-label={t('loading')} />
      </Box>
    );
  }

  if (loadErr || !page) {
    return (
      <Box sx={{ p: 3 }} data-testid="wiki-edit-error">
        <Typography color="error">
          {loadErr ?? t('notFound')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box data-testid="wiki-edit-page" role="main"
      aria-label={t('edit')}>
      <Typography variant="h4" component="h1"
        gutterBottom>
        {t('edit')}: {page.title}
      </Typography>
      {saveErr && (
        <Typography color="error" sx={{ mb: 2 }}
          data-testid="wiki-save-error">
          {saveErr}
        </Typography>
      )}
      <WikiEditor
        initialTitle={page.title}
        initialSlug={slug}
        initialBody={page.bodyMd}
        slugLocked
        onSubmit={(p) => updatePage(slug, p)}
        onCancel={() =>
          router.push(`/${locale}/wiki/${slug}`)}
        isSaving={isSaving}
      />
    </Box>
  );
}
