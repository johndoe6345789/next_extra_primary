'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import {
  Box,
  Typography,
  CircularProgress,
} from '@shared/m3';
import { Markdown } from '@shared/m3/data-display/Markdown';
import { useBlogPost } from '@/hooks/useBlogPost';

/**
 * Full blog post detail page.
 *
 * Renders the post body as markdown.
 * A ReactionBar is placed at the bottom
 * (imported when available).
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
      <Box
        sx={{ p: 4, display: 'flex', justifyContent: 'center' }}
        data-testid="blog-post-loading"
      >
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

  return (
    <Box
      component="article"
      aria-label={post.title}
      data-testid="blog-post-page"
      sx={{ p: 3, maxWidth: 800, mx: 'auto' }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        {post.title}
      </Typography>
      {post.publishedAt && (
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ mb: 2, display: 'block' }}
        >
          {new Date(post.publishedAt).toLocaleDateString()}
          {post.author && ` · ${post.author}`}
        </Typography>
      )}
      <Markdown
        content={post.contentMarkdown}
        data-testid="blog-post-body"
        aria-label={t('postBody')}
      />
    </Box>
  );
}
