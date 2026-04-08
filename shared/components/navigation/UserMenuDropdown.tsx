/**
 * UserMenuDropdown - dropdown content for
 * the user menu.
 */

import React from 'react';
import {
  Menu, MenuItem, Divider, Box,
} from '../m3';
import styles
  from '../../scss/components/navigation/header-actions.module.scss';

/** Props for UserMenuDropdown. */
export interface UserMenuDropdownProps {
  user: { name: string; email: string };
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

/** User info and logout dropdown. */
export const UserMenuDropdown: React.FC<
  UserMenuDropdownProps
> = ({ user, anchorEl, open,
  onClose, onLogout }) => (
  <Menu anchorEl={anchorEl}
    open={open}
    onClose={onClose}
    data-testid="user-menu">
    <Box className={styles.userInfo}>
      <Box className={styles.userName}>
        {user.name}
      </Box>
      <Box className={styles.userEmail}>
        {user.email}
      </Box>
    </Box>
    <Divider />
    <MenuItem onClick={onLogout}
      data-testid="logout-button">
      Logout
    </MenuItem>
  </Menu>
)
