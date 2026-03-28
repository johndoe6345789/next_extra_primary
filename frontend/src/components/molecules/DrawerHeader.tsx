'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslations } from 'next-intl';

/** Props for DrawerHeader. */
export interface DrawerHeaderProps {
  /** Close handler. */
  onClose: () => void;
}

/**
 * Branded drawer header with app name and close
 * button. Uses a gradient background.
 *
 * @param props - Component props.
 */
export const DrawerHeader: React.FC<
  DrawerHeaderProps
> = ({ onClose }) => {
  const t = useTranslations('common');
  return (
    <Box
      sx={{
        px: 2,
        py: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: (theme) =>
          `linear-gradient(135deg, ${
            theme.palette.primary.main
          } 0%, ${
            theme.palette.primary.dark
          } 100%)`,
        color: 'primary.contrastText',
      }}
      data-testid="drawer-header"
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700 }}
      >
        {t('appName')}
      </Typography>
      <IconButton
        onClick={onClose}
        size="small"
        aria-label="Close menu"
        sx={{ color: 'inherit' }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default DrawerHeader;
