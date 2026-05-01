/**
 * Generic wiki article viewer — no edit controls.
 * @module components/organisms/WikiPageViewer
 */
'use client';

import {
  Box, CircularProgress, Typography,
} from '@shared/m3';
import { MarkdownView } from
  '../molecules/MarkdownView';
import type { WikiPage } from '../../types/content';

/** Props for WikiPageViewer. */
export interface WikiPageViewerProps {
  /** Page data to render, or undefined while loading. */
  page: WikiPage | undefined;
  /** Show spinner when true. */
  isLoading: boolean;
  /** Error message, or null. */
  error: string | null;
}

/**
 * Renders a wiki article (title + markdown body).
 * Handles loading and error states.
 */
export default function WikiPageViewer({
  page,
  isLoading,
  error,
}: WikiPageViewerProps) {
  if (isLoading) {
    return (
      <Box
        sx={{ display: 'flex',
          justifyContent: 'center', py: 8 }}
        data-testid="wiki-viewer-loading"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography
        color="error"
        data-testid="wiki-viewer-error"
      >
        {error}
      </Typography>
    );
  }

  if (!page) return null;

  return (
    <Box
      component="article"
      data-testid="wiki-viewer-content"
      sx={{ maxWidth: 800 }}
    >
      <Typography
        variant="h4" component="h1"
        sx={{ mb: 2, fontWeight: 700 }}
      >
        {page.title}
      </Typography>
      <MarkdownView source={page.bodyMd} />
    </Box>
  );
}
