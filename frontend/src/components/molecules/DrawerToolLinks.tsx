'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EmailIcon from '@mui/icons-material/Email';
import StorageIcon from '@mui/icons-material/Storage';
import InventoryIcon from '@mui/icons-material/Inventory';
import CloudIcon from '@mui/icons-material/CloudQueue';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTranslations } from 'next-intl';
import toolLinks from '@/constants/tool-links.json';

const ICONS: Record<string, React.ReactNode> = {
  Email: <EmailIcon />,
  Storage: <StorageIcon />,
  Inventory: <InventoryIcon />,
  CloudQueue: <CloudIcon />,
};

/**
 * Tool links section for the mobile drawer.
 * Opens external tool UIs in new tabs.
 */
export const DrawerToolLinks: React.FC = () => {
  const t = useTranslations('nav');
  return (
    <Box data-testid="drawer-tools">
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ px: 2, pt: 1 }}
      >
        {t('tools')}
      </Typography>
      {toolLinks.map((link) => (
        <ListItemButton
          key={link.labelKey}
          component="a"
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            mx: 1,
            my: 0.25,
            borderRadius: 2,
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <ListItemIcon
            sx={{ minWidth: 40, color: 'primary.main' }}
          >
            {ICONS[link.icon]}
          </ListItemIcon>
          <ListItemText
            primary={t(
              link.labelKey as
                | 'webmail'
                | 'pgadmin'
                | 'packageRepo'
                | 's3server',
            )}
            primaryTypographyProps={{
              fontSize: '0.875rem',
            }}
          />
          <OpenInNewIcon
            sx={{ fontSize: 14, color: 'text.disabled' }}
          />
        </ListItemButton>
      ))}
    </Box>
  );
};

export default DrawerToolLinks;
