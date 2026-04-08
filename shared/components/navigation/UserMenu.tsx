/**
 * UserMenu - dropdown menu for user actions
 */

import React from 'react';
import { IconButton, Avatar } from '../m3';
import { UserMenuDropdown }
  from './UserMenuDropdown';

/** Props for the UserMenu sub-component. */
export interface UserMenuProps {
  /** User info object */
  user: { name: string; email: string };
  /** Whether menu is open */
  showUserMenu: boolean;
  /** Toggle menu callback */
  onToggleUserMenu?: () => void;
  /** Logout callback */
  onLogout?: () => void;
}

/** User avatar button with dropdown. */
export const UserMenu: React.FC<
  UserMenuProps
> = ({
  user, showUserMenu,
  onToggleUserMenu, onLogout,
}) => {
  const [anchorEl, setAnchorEl] =
    React.useState<HTMLElement | null>(null);
  const handleClick = (
    e: React.MouseEvent<HTMLElement>,
  ) => {
    setAnchorEl(e.currentTarget);
    onToggleUserMenu?.();
  };
  const handleClose = () => {
    setAnchorEl(null);
    if (showUserMenu) onToggleUserMenu?.();
  };
  const handleLogout = () => {
    onLogout?.();
    handleClose();
  };
  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-label={
          `User menu for ${user.name}`
        }
        aria-expanded={showUserMenu}
        aria-haspopup="menu"
        data-testid="user-menu-button">
        <Avatar sx={{ width: 32, height: 32 }}>
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      <UserMenuDropdown
        user={user}
        anchorEl={anchorEl}
        open={showUserMenu
          && Boolean(anchorEl)}
        onClose={handleClose}
        onLogout={handleLogout} />
    </>
  );
};
