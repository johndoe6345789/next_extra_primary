'use client';

import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CloudIcon from '@mui/icons-material/Cloud';
import DrawerNavLinks from './DrawerNavLinks';
import DrawerSiteLinks from './DrawerSiteLinks';
import DrawerLogout from './DrawerLogout';

/** @brief Props for SiteDrawer component. */
interface SiteDrawerProps {
  /** Whether the drawer is open. */
  open: boolean;
  /** Callback to close the drawer. */
  onClose: () => void;
  /** Callback to log out. */
  onLogout: () => void;
}

/**
 * @brief Sidebar drawer with navigation and site links.
 */
export default function SiteDrawer(
  { open, onClose, onLogout }: SiteDrawerProps,
) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      data-testid="site-drawer"
      aria-label="Site navigation drawer"
    >
      <Box sx={{ width: 280 }} role="presentation">
        <Box sx={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', p: 2,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CloudIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight={700}>
              NextExtra
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            aria-label="Close drawer"
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <DrawerNavLinks onClose={onClose} />
        <Divider />
        <DrawerSiteLinks />
        <Divider />
        <DrawerLogout onLogout={onLogout} onClose={onClose} />
      </Box>
    </Drawer>
  );
}
