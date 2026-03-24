'use client';

import React from 'react';
import LightModeIcon
  from '@mui/icons-material/LightMode';
import DarkModeIcon
  from '@mui/icons-material/DarkMode';
import { IconButton } from '../atoms';
import { useThemeMode } from '@/hooks';

/**
 * Props for the ThemeToggle component.
 */
export interface ThemeToggleProps {
  /** data-testid attribute for testing. */
  testId?: string;
}

/**
 * A toggle button that switches between light and
 * dark color modes. Displays the appropriate icon
 * for the current mode and includes a tooltip
 * indicating the active state.
 *
 * @param props - Component props.
 * @returns The theme toggle element.
 */
export const ThemeToggle: React.FC<
  ThemeToggleProps
> = ({ testId = 'theme-toggle' }) => {
  const { mode, toggleMode } = useThemeMode();

  const isDark = mode === 'dark';
  const label = isDark
    ? 'Toggle light mode'
    : 'Toggle dark mode';
  const tip = isDark ? 'Dark mode' : 'Light mode';

  return (
    <div data-testid={testId}>
      <IconButton
        icon={
          isDark
            ? <DarkModeIcon />
            : <LightModeIcon />
        }
        ariaLabel={label}
        onClick={toggleMode}
        tooltip={tip}
        testId={`${testId}-button`}
      />
    </div>
  );
};

export default ThemeToggle;
