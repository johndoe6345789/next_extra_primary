'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Box, Typography, Button, CircularProgress,
} from '@shared/m3';
import { Link } from '@/i18n/navigation';
import { useWikiTree } from '@/hooks/useWikiTree';
import type { WikiTreeNode } from '@/types/content';

/** Single card linking to a top-level wiki page. */
function WikiTreeCard(
  { node }: { node: WikiTreeNode },
): React.ReactElement {
  const t = useTranslations('wiki');
  const childCount = node.children?.length ?? 0;
  return (
    <Box component={Link} href={`/wiki/${node.slug}`}
      aria-label={node.title}
      data-testid={`wiki-card-${node.slug}`}
      sx={{ display: 'block', border: 1,
        borderColor: 'divider', borderRadius: 2, p: 2,
        cursor: 'pointer', textDecoration: 'none',
        color: 'inherit',
        '&:hover': { bgcolor: 'action.hover' } }}>
      <Typography variant="subtitle1">{node.title}</Typography>
      {childCount > 0 && (
        <Typography variant="caption" color="text.secondary">
          {t('subPages', { count: childCount })}
        </Typography>
      )}
    </Box>
  );
}

/**
 * Wiki landing page — top-level page grid with
 * a New Page action.
 *
 * @returns Wiki home UI.
 */
export default function WikiPage(): React.ReactElement {
  const t = useTranslations('wiki');
  const { tree, isLoading } = useWikiTree();

  return (
    <Box component="main" role="main"
      aria-label={t('title')} data-testid="wiki-home">
      <Box sx={{ display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('title')}
        </Typography>
        <Button variant="contained" component={Link}
          href="/wiki/new" aria-label={t('newPage')}
          data-testid="wiki-new-btn">
          {t('newPage')}
        </Button>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex',
          justifyContent: 'center', mt: 6 }}>
          <CircularProgress aria-label={t('loading')} />
        </Box>
      )}

      {!isLoading && tree.length === 0 && (
        <Box data-testid="wiki-empty"
          sx={{ textAlign: 'center', mt: 6 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {t('noPages')}
          </Typography>
          <Button variant="contained" component={Link}
            href="/wiki/new" aria-label={t('newPage')}>
            {t('newPage')}
          </Button>
        </Box>
      )}

      {!isLoading && tree.length > 0 && (
        <Box data-testid="wiki-tree-grid"
          sx={{ display: 'grid', gap: 2,
            gridTemplateColumns:
              'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {tree.map((node) => (
            <WikiTreeCard key={node.slug} node={node} />
          ))}
        </Box>
      )}
    </Box>
  );
}
