'use client';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import StorageIcon from '@mui/icons-material/Storage';
import InventoryIcon from '@mui/icons-material/Inventory';
import CloudQueueIcon
  from '@mui/icons-material/CloudQueue';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import siteLinks from '@/constants/site-links.json';

const iconMap: Record<string, React.ReactElement> = {
  Home: <HomeIcon />, Email: <EmailIcon />,
  Storage: <StorageIcon />, Inventory: <InventoryIcon />,
  CloudQueue: <CloudQueueIcon />,
};

/** @brief Props for the SiteDrawer component. */
interface SiteDrawerProps {
  open: boolean; onClose: () => void;
}

const paperSx = {
  width: 280, borderRadius: '0 16px 16px 0',
};
const headerSx = {
  display: 'flex', alignItems: 'center',
  justifyContent: 'space-between', px: 2, py: 1,
};
const iconSx = { minWidth: 40, color: 'primary.main' };
const extSx = { fontSize: 14, color: 'text.disabled' };

/** @brief Drawer showing cross-site navigation. */
export default function SiteDrawer(
  { open, onClose }: SiteDrawerProps,
) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      data-testid="site-drawer"
      PaperProps={{ sx: paperSx }}
    >
      <Box sx={headerSx}>
        <Typography variant="h6">NextExtra</Typography>
        <IconButton
          onClick={onClose}
          aria-label="Close drawer"
          data-testid="close-drawer"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Typography
        variant="overline"
        sx={{ px: 2, pt: 1 }}
      >
        Sites
      </Typography>
      <List>
        {siteLinks.map((link) => {
          const cur = !!link.current;
          return (
            <ListItemButton
              key={link.label}
              component="a"
              href={link.url}
              selected={cur}
              target={cur ? undefined : '_blank'}
              rel="noopener noreferrer"
              data-testid={`site-${link.icon}`}
            >
              <ListItemIcon sx={iconSx}>
                {iconMap[link.icon]}
              </ListItemIcon>
              <ListItemText primary={link.label} />
              {cur ? null : (
                <OpenInNewIcon sx={extSx} />
              )}
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}
