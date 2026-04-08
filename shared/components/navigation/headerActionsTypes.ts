import type React from 'react';

/** Props for the HeaderActions component. */
export interface HeaderActionsProps {
  /** Current theme ('light' | 'dark') */
  theme?: 'light' | 'dark';
  /** Theme toggle handler */
  onToggleTheme?: () => void;
  /** User information */
  user?: {
    name: string;
    email: string;
  };
  /** User menu open state */
  showUserMenu?: boolean;
  /** User menu toggle handler */
  onToggleUserMenu?: () => void;
  /** Logout handler */
  onLogout?: () => void;
  /** Notification menu component */
  notificationMenu?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
  [key: string]: unknown;
}
