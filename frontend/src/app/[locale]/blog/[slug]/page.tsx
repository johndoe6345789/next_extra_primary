'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  Box, Typography, CircularProgress, Button,
} from '@shared/m3';
import { Link } from '@/i18n/navigation';
import { Markdown } from '@shared/m3/data-display/Markdown';
import { useBlogPost } from '@/hooks/useBlogPost';

/**
 * Full blog post detail page with hero title block
 * and styled prose reading area.
 *
 * @returns Blog post detail page UI.
 */
export default function BlogPostPage(): React.ReactElement {
  const t = useTranslations('blog');
  const { slug } = useParams<{ slug: string }>();
  const { post, isLoading, error } =
    useBlogPost(slug ?? '');

  if (isLoading) {
    return (
      <Box sx={{ p: 4, display: 'flex',
        justifyContent: 'center' }}
        data-testid="blog-post-loading">
        <CircularProgress aria-label={t('loading')} />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Box sx={{ p: 3 }} data-testid="blog-post-error">
        <Typography color="error">
          {error ?? t('notFound')}
        </Typography>
      </Box>
    );
  }

  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(
        undefined,
        { year: 'numeric', month: 'long', day: 'numeric' },
      )
    : null;

  return (
    <Box component="article" aria-label={post.title}
      data-testid="blog-post-page"
      sx={{ maxWidth: 820, mx: 'auto' }}>

      {/* Soft paper surface — warm radial inner gradient,
            generous radius, ambient shadow. Floats. */}
      <Box sx={{
        background:
          'radial-gradient(ellipse at top,'
          + ' rgba(124,58,237,0.045) 0%,'
          + ' rgba(255,255,255,0.025) 55%)',
        borderRadius: '20px',
        padding: '56px 88px 72px 88px',
        boxShadow: '0 12px 48px rgba(0,0,0,0.28)',
        animation:
          'gallery-fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both',
      }}>

        {/* Back link sits inside the panel — quiet move,
              top-left corner of the surface */}
        <Box sx={{ marginBottom: '32px', marginLeft: '-8px' }}>
          <Button component={Link} href="/blog"
            variant="text" size="small"
            sx={{
              color: 'text.secondary',
              gap: 0.5, fontSize: '0.8rem',
              opacity: 0.7,
              '&:hover': {
                color: 'primary.main', opacity: 1,
                bgcolor: 'transparent',
              },
            }}>
            ← Blog
          </Button>
        </Box>

        {/* Editorial header — centered for compositional
              contrast against the left-aligned body */}
        <Box sx={{
          marginBottom: '40px',
          textAlign: 'center',
        }}>
          {dateStr && (
            <Typography component="div"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'primary.main',
                opacity: 0.85,
                marginBottom: '12px',
              }}>
              {dateStr}
            </Typography>
          )}
          <Typography component="h1"
            fontWeight={700}
            sx={{
              fontSize: '2.4rem',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              color: 'text.primary',
              maxWidth: '640px',
              marginLeft: 'auto', marginRight: 'auto',
            }}>
            {post.title}
          </Typography>
          <Box sx={{
            marginTop: '20px',
            marginLeft: 'auto', marginRight: 'auto',
            width: '56px', height: '3px',
            borderRadius: '2px',
            backgroundColor: 'var(--mui-palette-primary-main)',
            opacity: 0.7,
          }} />
        </Box>

        {/* Body — left-aligned prose on the paper surface */}
        <Box sx={{
          fontSize: '1rem', lineHeight: 1.75,
          animation:
            'gallery-fade-up 0.5s cubic-bezier(0.22,1,0.36,1)'
            + ' 0.12s both',
        }}>
          <Markdown
            content={post.contentMarkdown}
            data-testid="blog-post-body"
            aria-label={t('postBody')}
          />
        </Box>

        {/* Closing flourish — diamond mark, signs the
              piece off and echoes the navbar brand mark */}
        <Box sx={{
          marginTop: '56px',
          textAlign: 'center',
          color: 'var(--mui-palette-primary-main)',
          opacity: 0.45,
          fontSize: '0.85rem',
          letterSpacing: '0.6em',
          paddingLeft: '0.6em',
        }}>
          ♦ ♦ ♦
        </Box>
      </Box>
    </Box>
  );
}
