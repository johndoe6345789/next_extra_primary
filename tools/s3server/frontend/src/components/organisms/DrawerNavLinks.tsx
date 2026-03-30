'use client';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ViewListIcon from '@mui/icons-material/ViewList';
import Link from 'next/link';
import labels from '@/constants/ui-labels.json';
import routes from '@/constants/routes.json';

/** @brief Props for DrawerNavLinks. */
interface DrawerNavLinksProps {
  /** Callback to close the drawer. */
  onClose: () => void;
}

/**
 * @brief Internal navigation links for the drawer.
 */
export default function DrawerNavLinks(
  { onClose }: DrawerNavLinksProps,
) {
  return (
    <List>
      <ListItemButton
        component={Link}
        href={routes.dashboard}
        onClick={onClose}
        data-testid="drawer-nav-dashboard"
        aria-label={labels.nav.dashboard}
      >
        <ListItemIcon><DashboardIcon /></ListItemIcon>
        <ListItemText primary={labels.nav.dashboard} />
      </ListItemButton>
      <ListItemButton
        component={Link}
        href={routes.buckets}
        onClick={onClose}
        data-testid="drawer-nav-buckets"
        aria-label={labels.nav.buckets}
      >
        <ListItemIcon><ViewListIcon /></ListItemIcon>
        <ListItemText primary={labels.nav.buckets} />
      </ListItemButton>
    </List>
  );
}
