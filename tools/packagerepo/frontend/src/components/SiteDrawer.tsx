'use client';

import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import StorageIcon from '@mui/icons-material/Storage';
import InventoryIcon from '@mui/icons-material/Inventory';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import siteLinks from '@/constants/site-links.json';

/** Map of icon name to MUI icon component. */
const iconMap: Record<string, React.ReactNode> = {
  Home: <HomeIcon />,
  Email: <EmailIcon />,
  Storage: <StorageIcon />,
  Inventory: <InventoryIcon />,
  CloudQueue: <CloudQueueIcon />,
};

/** Props for the SiteDrawer component. */
interface SiteDrawerProps {
  open: boolean;
  onClose: () => void;
}

/** Site link shape from the JSON constants file. */
interface SiteLink {
  label: string;
  url: string;
  icon: string;
  current?: boolean;
}

/**
 * Navigation drawer showing cross-site links.
 * @param props - open state and close handler
 */
export default function SiteDrawer(
  { open, onClose }: SiteDrawerProps,
) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      data-testid="site-drawer"
      aria-label="Site navigation"
    >
      <Box sx={{ width: 280, p: 2 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Typography variant="h6">NextExtra</Typography>
          <IconButton
            onClick={onClose}
            aria-label="Close drawer"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Typography
          variant="overline"
          sx={{ px: 1, color: 'text.secondary' }}
        >
          Sites
        </Typography>
        <List dense>
          {(siteLinks as SiteLink[]).map((link) => (
            <ListItemButton
              key={link.label}
              component="a"
              href={link.url}
              target={link.current ? undefined : '_blank'}
              rel="noopener noreferrer"
              selected={!!link.current}
            >
              <ListItemIcon>
                {iconMap[link.icon]}
              </ListItemIcon>
              <ListItemText primary={link.label} />
              {!link.current && <OpenInNewIcon fontSize="small" />}
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
