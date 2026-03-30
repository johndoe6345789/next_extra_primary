'use client';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import labels from '@/constants/ui-labels.json';

/** @brief Props for DrawerLogout. */
interface DrawerLogoutProps {
  /** Callback to log out. */
  onLogout: () => void;
  /** Callback to close the drawer. */
  onClose: () => void;
}

/**
 * @brief Logout button at the bottom of the drawer.
 */
export default function DrawerLogout(
  { onLogout, onClose }: DrawerLogoutProps,
) {
  const handleClick = () => {
    onClose();
    onLogout();
  };

  return (
    <List>
      <ListItemButton
        onClick={handleClick}
        data-testid="drawer-logout"
        aria-label={labels.nav.logout}
      >
        <ListItemIcon><LogoutIcon /></ListItemIcon>
        <ListItemText primary={labels.nav.logout} />
      </ListItemButton>
    </List>
  );
}
