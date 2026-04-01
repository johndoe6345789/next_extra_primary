'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import ListItemButton from '@shared/m3/ListItemButton';
import ListItemIcon from '@shared/m3/ListItemIcon';
import ListItemText from '@shared/m3/ListItemText';
import EmailIcon from '@shared/icons/Email';
import StorageIcon from '@shared/icons/Storage';
import InventoryIcon from '@shared/icons/Inventory';
import CloudIcon from '@shared/icons/CloudQueue';
import OpenInNewIcon from '@shared/icons/OpenInNew';
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
          <OpenInNewIcon size={14} />
        </ListItemButton>
      ))}
    </Box>
  );
};

export default DrawerToolLinks;
