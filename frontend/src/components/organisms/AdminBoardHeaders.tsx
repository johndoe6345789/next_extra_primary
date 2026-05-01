'use client';

/**
 * Column header row for the forum board admin table.
 * @module components/organisms/AdminBoardHeaders
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import { Box, Tooltip, Typography } from '@shared/m3';

/** Shared style for all column header cells. */
const colStyle = {
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  whiteSpace: 'nowrap' as const,
  overflow: 'hidden' as const,
  textOverflow: 'ellipsis',
};

/**
 * Sticky column-header row for the board admin table.
 * Widths match AdminBoardRow control columns exactly.
 */
export function AdminBoardHeaders(): React.ReactElement {
  const t = useTranslations('admin');
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      px: 2,
      py: 1,
      borderBottom: '1px solid',
      borderColor: 'divider',
      bgcolor: 'action.hover',
      borderRadius: '12px 12px 0 0',
    }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ flex: 1, ...colStyle }}
      >
        {t('board')}
      </Typography>
      <Tooltip title={t('requiresAuthTip')} placement="bottom">
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ width: 148, textAlign: 'center',
            ...colStyle }}
        >
          {t('requiresAuth')}
        </Typography>
      </Tooltip>
      <Tooltip title={t('guestVisibleTip')} placement="bottom">
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ width: 148, textAlign: 'center',
            ...colStyle }}
        >
          {t('guestVisible')}
        </Typography>
      </Tooltip>
      <Tooltip title={t('minPostsTip')} placement="bottom">
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ width: 110, textAlign: 'center',
            ...colStyle }}
        >
          {t('minPosts')}
        </Typography>
      </Tooltip>
    </Box>
  );
}

export default AdminBoardHeaders;
