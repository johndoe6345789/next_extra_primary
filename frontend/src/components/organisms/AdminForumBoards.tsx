'use client';

/**
 * Admin interface for managing forum board settings.
 * @module components/organisms/AdminForumBoards
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Box, Typography, Switch, TextField,
} from '@shared/m3';
import { useAdminForumBoards } from '@/hooks/useAdminForumBoards';
import type { ForumBoard } from '@/types/forumBoard';

/**
 * Row of controls for a single forum board.
 */
function BoardRow({
  board,
}: { board: ForumBoard }): React.ReactElement {
  const t = useTranslations('admin');
  const { update } = useAdminForumBoards();

  return (
    <Box
      data-testid={`admin-board-row-${board.slug}`}
      aria-label={board.label}
      sx={{
        display: 'flex', alignItems: 'center',
        gap: 2, flexWrap: 'wrap',
        p: 2, borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography sx={{ flex: 1, fontWeight: 600 }}>
        {board.icon && (
          <span aria-hidden="true">{board.icon} </span>
        )}
        {board.label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center',
        gap: 0.5 }}>
        <Switch
          checked={board.requiresAuth}
          onChange={(_, v) =>
            update(board.slug, { requiresAuth: v })}
          aria-label={t('requiresAuth')}
          data-testid={`board-${board.slug}-requires-auth`}
        />
        <Typography variant="body2">
          {t('requiresAuth')}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center',
        gap: 0.5 }}>
        <Switch
          checked={board.isGuestVisible}
          onChange={(_, v) =>
            update(board.slug, { isGuestVisible: v })}
          aria-label={t('guestVisible')}
          data-testid={`board-${board.slug}-guest-visible`}
        />
        <Typography variant="body2">
          {t('guestVisible')}
        </Typography>
      </Box>
      <TextField
        type="number"
        label={t('minPosts')}
        value={board.minPosts}
        onChange={(e) =>
          update(board.slug, { minPosts: Number(e.target.value) })}
        sx={{ width: 120 }}
        aria-label={t('minPosts')}
        data-testid={`board-${board.slug}-min-posts`}
      />
    </Box>
  );
}

/**
 * Lists all forum boards with inline admin controls.
 * Uses useAdminForumBoards to fetch and update.
 */
export function AdminForumBoards(): React.ReactElement {
  const { boards } = useAdminForumBoards();

  return (
    <Box
      data-testid="admin-forum-boards"
      aria-label="Forum board administration"
    >
      {boards.map((board) => (
        <BoardRow key={board.slug} board={board} />
      ))}
    </Box>
  );
}

export default AdminForumBoards;
