'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
} from '@shared/m3';
import { useWikiPage } from '@/hooks/useWikiPage';

/**
 * Wiki page detail.
 *
 * Renders pre-sanitised HTML from the backend.
 * The backend strips all unsafe tags/attributes
 * before storing wiki content.
 *
 * @returns Wiki page UI.
 */
export default function WikiPageDetail(): React.ReactElement {
  const t = useTranslations('wiki');
  const params = useParams<{ slug: string[] }>();
  const slug = Array.isArray(params?.slug)
    ? params.slug.join('/')
    : (params?.slug ?? '');
  const { page, isLoading, error } = useWikiPage(slug);

  if (isLoading) {
    return (
      <Box
        sx={{ p: 4, display: 'flex', justifyContent: 'center' }}
        data-testid="wiki-page-loading"
      >
        <CircularProgress aria-label={t('loading')} />
      </Box>
    );
  }

  if (error || !page) {
    return (
      <Box sx={{ p: 3 }} data-testid="wiki-page-error">
        <Typography color="error">
          {error ?? t('notFound')}
        </Typography>
      </Box>
    );
  }

  /* eslint-disable react/no-danger */
  return (
    <Box
      component="article"
      aria-label={page.title}
      data-testid="wiki-page-detail"
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {page.title}
      </Typography>
      {page.updatedAt && (
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ display: 'block', mb: 2 }}
        >
          {t('lastUpdated')}{' '}
          {new Date(page.updatedAt).toLocaleDateString()}
          {page.updatedBy && ` · ${page.updatedBy}`}
        </Typography>
      )}
      <Divider sx={{ mb: 2 }} />
      <Box
        data-testid="wiki-page-body"
        dangerouslySetInnerHTML={{ __html: page.contentHtml }}
      />
    </Box>
  );
  /* eslint-enable react/no-danger */
}
