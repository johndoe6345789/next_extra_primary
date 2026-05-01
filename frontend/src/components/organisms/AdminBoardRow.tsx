'use client';

/**
 * Single board row for the admin forum boards UI.
 * @module components/organisms/AdminBoardRow
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import { Box, Typography, Switch } from '@shared/m3';
import { Icon } from '@shared/m3/data-display/Icon';
import TextField from '@shared/m3/inputs/TextField';
import { useAdminForumBoards }
  from '@/hooks/useAdminForumBoards';
import type { ForumBoard } from '@/types/forumBoard';

/** Props for AdminBoardRow. */
export interface AdminBoardRowProps {
  /** Forum board to display and edit. */
  board: ForumBoard;
}

/**
 * Inline-editable row for one forum board.
 * Column widths match AdminBoardHeaders exactly.
 */
export function AdminBoardRow({
  board,
}: AdminBoardRowProps): React.ReactElement {
  const t = useTranslations('admin');
  const { update } = useAdminForumBoards();
  const slug = board.slug;

  return (
    <Box
      data-testid={`admin-board-row-${slug}`}
      aria-label={board.label}
      sx={{
        display: 'flex', alignItems: 'center',
        gap: 2, px: 2, py: 1.25,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-child': { borderBottom: 0 },
        '&:hover': { bgcolor: 'action.hover' },
        transition: 'background-color 0.15s',
      }}
    >
      {/* Icon + board name */}
      <Box sx={{ display: 'flex', alignItems: 'center',
        gap: 1.5, flex: 1, minWidth: 0 }}>
        <Icon color="primary" size="md">
          {board.icon || 'forum'}
        </Icon>
        <Typography sx={{ fontWeight: 600, fontSize: 14 }}
          noWrap>
          {board.label}
        </Typography>
      </Box>

      {/* Requires sign-in (148 px) */}
      <Box sx={{ width: 148, display: 'flex',
        justifyContent: 'center', flexShrink: 0 }}>
        <Switch
          checked={board.requiresAuth}
          onChange={(_, v) =>
            update(slug, { requiresAuth: v })}
          aria-label={t('requiresAuth')}
          data-testid={`board-${slug}-requires-auth`}
        />
      </Box>

      {/* Visible to guests (148 px) */}
      <Box sx={{ width: 148, display: 'flex',
        justifyContent: 'center', flexShrink: 0 }}>
        <Switch
          checked={board.isGuestVisible}
          onChange={(_, v) =>
            update(slug, { isGuestVisible: v })}
          aria-label={t('guestVisible')}
          data-testid={`board-${slug}-guest-visible`}
        />
      </Box>

      {/* Min posts (110 px) */}
      <TextField
        type="number"
        label=""
        value={board.minPosts}
        onChange={(e) =>
          update(slug, {
            minPosts: Number(e.target.value),
          })}
        sx={{ width: 110, flexShrink: 0 }}
        aria-label={t('minPosts')}
        data-testid={`board-${slug}-min-posts`}
      />
    </Box>
  );
}

export default AdminBoardRow;
