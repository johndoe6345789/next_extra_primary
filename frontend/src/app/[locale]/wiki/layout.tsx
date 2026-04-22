'use client';

import React, { type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Box, Typography } from '@shared/m3';
import {
  List,
  ListItemButton,
  ListItemText,
} from '@shared/m3/data-display';
import { Link } from '@/i18n/navigation';
import { useWikiTree } from '@/hooks/useWikiTree';
import type { WikiTreeNode } from '@/types/content';

/** Props for WikiLayout. */
interface WikiLayoutProps {
  /** Page content. */
  children: ReactNode;
}

/** Flatten a tree node for sidebar rendering. */
function flatNodes(
  nodes: WikiTreeNode[],
  depth = 0,
): Array<{ slug: string; title: string; depth: number }> {
  return nodes.flatMap((n) => [
    { slug: n.slug, title: n.title, depth },
    ...flatNodes(n.children ?? [], depth + 1),
  ]);
}

/**
 * Wiki layout with sticky left sidebar page tree.
 *
 * @param props - Layout props with children.
 * @returns Wiki layout with sidebar.
 */
export default function WikiLayout({
  children,
}: WikiLayoutProps): React.ReactElement {
  const t = useTranslations('wiki');
  const { tree } = useWikiTree();
  const flat = flatNodes(tree);

  return (
    <Box
      sx={{ display: 'flex', minHeight: '100dvh' }}
      data-testid="wiki-layout"
    >
      <Box
        component="nav"
        aria-label={t('sidebar')}
        sx={{
          width: 240,
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100dvh',
          overflowY: 'auto',
          borderRight: '1px solid',
          borderColor: 'divider',
          p: 1,
        }}
        data-testid="wiki-sidebar"
      >
        <Typography variant="subtitle2" sx={{ p: 1 }}>
          {t('title')}
        </Typography>
        <List dense>
          {flat.map((n) => (
            <ListItemButton
              key={n.slug}
              component={Link}
              href={`/wiki/${n.slug}`}
              sx={{ pl: 1 + n.depth * 2 }}
              aria-label={n.title}
            >
              <ListItemText primary={n.title} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box component="main" sx={{ flex: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
