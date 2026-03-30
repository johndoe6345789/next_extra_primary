'use client';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import StorageIcon from '@mui/icons-material/Storage';
import InventoryIcon from '@mui/icons-material/Inventory';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import siteLinks from '@/constants/site-links.json';

/** @brief Icon name to component mapping. */
const iconMap: Record<string, React.ReactElement> = {
  Home: <HomeIcon />,
  Email: <EmailIcon />,
  Storage: <StorageIcon />,
  Inventory: <InventoryIcon />,
  CloudQueue: <CloudQueueIcon />,
};

/** @brief Site link entry shape. */
interface SiteLink {
  label: string;
  url: string;
  icon: string;
  current?: boolean;
}

/**
 * @brief External site links section in the drawer.
 */
export default function DrawerSiteLinks() {
  return (
    <Box>
      <Typography
        variant="overline"
        sx={{ px: 2, pt: 1.5, display: 'block' }}
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
            rel={link.current ? undefined : 'noopener noreferrer'}
            selected={link.current ?? false}
            data-testid={`site-link-${link.icon}`}
            aria-label={link.label}
          >
            <ListItemIcon>
              {iconMap[link.icon] ?? <HomeIcon />}
            </ListItemIcon>
            <ListItemText primary={link.label} />
            {!link.current && (
              <OpenInNewIcon fontSize="small" color="action" />
            )}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
