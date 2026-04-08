/**
 * Header Actions - FakeMUI Component
 * Action buttons for app header
 */

import React from 'react';
import { IconButton, Box } from '../m3';
import type { HeaderActionsProps }
  from './headerActionsTypes';
import { SunIcon, MoonIcon } from './ThemeIcons';
import { UserMenu } from './UserMenu';
import styles from '../../scss/components/navigation/header-actions.module.scss';

export type { HeaderActionsProps }
  from './headerActionsTypes';

/**
 * HeaderActions - theme toggle, notifications,
 * and user menu for app headers.
 *
 * @param props - Component props.
 */
export const HeaderActions: React.FC<
  HeaderActionsProps
> = ({
  theme = 'light',
  onToggleTheme,
  user,
  showUserMenu = false,
  onToggleUserMenu,
  onLogout,
  notificationMenu,
  className,
  ...rest
}) => (
  <Box
    className={
      `${styles.headerActions} ${className || ''}`
    }
    {...rest}
    data-testid="header-actions"
  >
    {notificationMenu}
    {onToggleTheme && (
      <IconButton
        color="inherit"
        onClick={onToggleTheme}
        aria-label={
          `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`
        }
        data-testid="toggle-theme-button"
      >
        {theme === 'light'
          ? <SunIcon /> : <MoonIcon />}
      </IconButton>
    )}
    {user && (
      <UserMenu
        user={user}
        showUserMenu={showUserMenu}
        onToggleUserMenu={onToggleUserMenu}
        onLogout={onLogout}
      />
    )}
  </Box>
);
