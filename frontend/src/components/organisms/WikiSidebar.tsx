/**
 * Generic wiki navigation sidebar.
 * Reusable across any wiki-like section of the site.
 * @module components/organisms/WikiSidebar
 */
'use client';

import {
  Box, List, ListItem, ListItemButton,
  ListItemText, Typography,
} from '@shared/m3';
import type { WikiTreeNode } from '../../types/content';

/** Props for WikiSidebar. */
export interface WikiSidebarProps {
  /** Flat list of tree nodes to display. */
  tree: WikiTreeNode[];
  /**
   * URL base for page links, e.g. `/en/wiki`.
   * Links become `${basePath}/${node.slug}`.
   */
  basePath: string;
  /** Slug of the currently active page, or null. */
  activeSlug: string | null;
}

/** @internal One tree node as a sidebar list item. */
function SidebarItem({ node, basePath, isActive }: {
  node: WikiTreeNode;
  basePath: string;
  isActive: boolean;
}) {
  const depth = node.slug.split('/').length - 1;
  return (
    <ListItem disablePadding>
      <ListItemButton
        component="a"
        href={`${basePath}/${node.slug}`}
        selected={isActive}
        aria-current={isActive ? 'page' : undefined}
        data-testid={`wiki-sidebar-item-${node.slug}`}
        sx={{
          pl: 2 + depth * 1.5,
          borderRadius: 1,
          ...(isActive && {
            bgcolor:
              'var(--mat-sys-secondary-container)',
          }),
        }}
      >
        <ListItemText
          primary={node.title}
          primaryTypographyProps={{
            fontWeight: isActive ? 700 : 400,
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

/**
 * Left-hand navigation sidebar for a wiki section.
 * Highlights the active page and indents children
 * by their depth in the slug hierarchy.
 */
export default function WikiSidebar({
  tree,
  basePath,
  activeSlug,
}: WikiSidebarProps) {
  return (
    <Box
      component="nav"
      aria-label="Wiki navigation"
      data-testid="wiki-sidebar"
      sx={{ width: 240, flexShrink: 0 }}
    >
      <Typography
        variant="overline"
        sx={{ px: 2, display: 'block', mb: 1 }}
      >
        Contents
      </Typography>
      <List dense disablePadding>
        {tree.map((node) => (
          <SidebarItem
            key={node.slug}
            node={node}
            basePath={basePath}
            isActive={node.slug === activeSlug}
          />
        ))}
      </List>
    </Box>
  );
}
