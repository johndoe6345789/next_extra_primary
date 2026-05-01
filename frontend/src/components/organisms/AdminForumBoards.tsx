'use client';

/**
 * Admin interface for managing forum board settings.
 * @module components/organisms/AdminForumBoards
 */
import React from 'react';
import { Box } from '@shared/m3';
import { useAdminForumBoards }
  from '@/hooks/useAdminForumBoards';
import { AdminBoardHeaders }
  from './AdminBoardHeaders';
import { AdminBoardRow }
  from './AdminBoardRow';

/**
 * Lists all forum boards with inline admin controls.
 * Rendered inside the admin/forum page RoleGuard.
 */
export function AdminForumBoards(): React.ReactElement {
  const { boards } = useAdminForumBoards();

  return (
    <Box
      data-testid="admin-forum-boards"
      aria-label="Forum board administration"
      sx={{
        width: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <AdminBoardHeaders />
      {boards.map((board) => (
        <AdminBoardRow
          key={board.slug}
          board={board}
        />
      ))}
    </Box>
  );
}

export default AdminForumBoards;
